"""Coordinate one saved document through parsing, chunking, and ingestion.

Call this once per browser file, waiting for completion before starting the
next file. Upload handling and HTTP error responses belong in Web/server.py.
"""

import json
from pathlib import Path

import pymupdf

from Functions.Qdrant.Qdrant import Qdrant
from Functions.RAG.chunking import docling_chunking, marker_chunking
from Functions.RAG.embedding import Embedding
from Functions.RAG.ingestion import ingest
from Functions.RAG.parsers import convert_docling_documents, route_pdf
from Functions.RAG.Router.router import non_pdf_router
from Functions.utilities import logger


def _serialize_path(value):
    if isinstance(value, Path):
        return str(value)
    raise TypeError(f"Cannot serialize {type(value).__name__}")


def ingest_document(
    source_path: Path,
    collection_name: str,
    embedding: Embedding,
    qdrant_db: Qdrant,
    batch_size: int = 8,
) -> dict:
    """Ingest a single document and return a JSON-compatible completion summary.

    Exceptions propagate to the caller. A failed multi-batch upload may have
    already stored earlier batches; this function does not roll back writes.
    Source files, parser JSON, and chunk/asset exports are retained.
    """
    source_path = Path(source_path).resolve()

    if not source_path.is_file():
        raise FileNotFoundError(f"Source file not found: {source_path}")
    if not collection_name.strip():
        raise ValueError("Collection name must not be blank")
    if batch_size < 1:
        raise ValueError("batch_size must be at least 1")
    if collection_name not in qdrant_db.get_collections():
        raise ValueError(f"Collection does not exist: {collection_name}")

    logger.info("Routing and parsing %s", source_path.name)

    if source_path.suffix.lower() == ".pdf":
        # The PDF feature extractor receives the same record shape as the
        # existing router's load_documents(), but only for this one file.
        with pymupdf.open(source_path) as document:
            if document.page_count < 1:
                raise ValueError("PDF must contain at least one page")
            parsing_results = route_pdf(
                [{"file_path": source_path, "document": document}]
            )
        docling_summary = parsing_results["docling"]
        marker_summary = parsing_results["marker"]
    else:
        # Keep non-PDF inputs out of pymupdf.open(); use the existing router.
        routed_files = non_pdf_router([{"file_path": source_path}])
        if len(routed_files) != 1:
            raise RuntimeError("Non-PDF routing did not return one document")
        docling_summary = convert_docling_documents(routed_files)
        marker_summary = []

    successful_docling = []
    successful_marker = []
    errors = []

    for plan in docling_summary:
        for file in plan["files"]:
            if file.get("conversion_status") == "success":
                successful_docling.append(file)
            else:
                errors.append(
                    str(file.get("conversion_error", "Docling conversion failed"))
                )

    for file in marker_summary:
        if file.get("status") == "success":
            successful_marker.append(file)
        else:
            errors.append(str(file.get("error", "Marker conversion failed")))

    if errors:
        raise RuntimeError(
            f"Parsing failed for {source_path.name}: {'; '.join(errors)}"
        )
    if len(successful_docling) + len(successful_marker) != 1:
        raise RuntimeError("Parsing did not return exactly one successful document")

    logger.info("Chunking %s", source_path.name)
    if successful_docling:
        parser = "docling"
        chunked_documents = docling_chunking(docling_summary)
    else:
        parser = "marker"
        chunked_documents = marker_chunking(marker_summary)

    if len(chunked_documents) != 1:
        raise RuntimeError("Chunking did not return exactly one document")

    chunked_document = chunked_documents[0]
    chunking_result = chunked_document["chunking_result"]
    chunks = chunking_result.get("chunks", [])

    if not chunks:
        raise RuntimeError("No text chunks were produced; nothing was ingested")
    if chunking_result["chunk_count"] != len(chunks):
        raise RuntimeError("Chunk count does not match the generated chunks")
    if chunking_result.get("token_overflow"):
        raise RuntimeError(
            "Chunks exceed the configured token budget; ingestion stopped"
        )

    # Retain assets and parser provenance outside the point payload as well.
    # This export records chunking output, not proof that ingestion succeeded.
    json_path = Path(chunked_document["json_path"])
    chunking_json_path = json_path.with_name(f"{json_path.stem}.chunks.json")
    chunking_json_path.write_text(
        json.dumps(
            chunked_document,
            indent=2,
            ensure_ascii=False,
            default=_serialize_path,
        ),
        encoding="utf-8",
    )

    logger.info(
        "Embedding and storing %s chunks from %s", len(chunks), source_path.name
    )
    updates = ingest(
        collection_name=collection_name,
        chunks=chunks,
        embedding=embedding,
        qdrant_db=qdrant_db,
        batch_size=batch_size,
    )

    expected_batches = (len(chunks) + batch_size - 1) // batch_size
    if len(updates) != expected_batches or any(
        update.status.value != "completed" for update in updates
    ):
        raise RuntimeError("Qdrant did not confirm completion of every ingestion batch")

    assets = chunked_document["assets"]
    logger.info("Finished ingesting %s", source_path.name)
    return {
        "status": "success",
        "collection_name": collection_name,
        "file_name": source_path.name,
        "document_id": chunking_result["document_id"],
        "parser": parser,
        "chunk_count": len(chunks),
        "picture_count": len(assets.get("pictures", [])),
        "table_count": len(assets.get("tables", [])),
        "json_path": str(json_path),
        "chunking_json_path": str(chunking_json_path),
    }
