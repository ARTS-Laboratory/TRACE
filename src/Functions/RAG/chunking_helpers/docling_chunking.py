import json
from importlib.metadata import version
from pathlib import Path
from typing import Any

from docling_core.transforms.chunker import DocChunk
from docling_core.transforms.chunker.chunk_expander import (
    PageChunkExpander,
    TreeChunkExpander,
)
from docling_core.transforms.chunker.hierarchical_chunker import (
    ChunkingDocSerializer,
    ChunkingSerializerProvider,
)
from docling_core.transforms.chunker.hybrid_chunker import HybridChunker
from docling_core.transforms.chunker.tokenizer.huggingface import HuggingFaceTokenizer
from docling_core.transforms.serializer.base import (
    BaseDocSerializer,
    SerializationResult,
)
from docling_core.transforms.serializer.common import create_ser_result
from docling_core.transforms.serializer.markdown import (
    MarkdownPictureSerializer,
    MarkdownTableSerializer,
)
from docling_core.types.doc.document import DoclingDocument, PictureItem
from transformers import AutoTokenizer
from typing_extensions import override

from Functions.Model.config import EMBED_MODEL_ID, MAX_TOKENS
from Functions.utilities import logger, t

DOCLING_VERSION = version("docling")
PARSING_CHUNKING_VERSION = "docling-text-v1"


class DescriptionPictureSerializer(MarkdownPictureSerializer):
    @override
    def serialize(
        self,
        *,
        item: PictureItem,
        doc_serializer: BaseDocSerializer,
        doc: DoclingDocument,
        **kwargs: Any,
    ) -> SerializationResult:
        text_parts: list[str] = []

        if item.meta is not None:
            if item.meta.classification is not None:
                main_pred = item.meta.classification.get_main_prediction()
                if main_pred is not None:
                    text_parts.append(f"\nPicture type: {main_pred.class_name}")

            if item.meta.molecule is not None:
                text_parts.append(f"\nSMILES: {item.meta.molecule.smi}")

        text_res = "\n".join(text_parts)
        text_res = doc_serializer.post_process(text=text_res)
        return create_ser_result(text=text_res, span_source=item)


class DoclingSerializerProvider(ChunkingSerializerProvider):
    def get_serializer(self, doc: DoclingDocument) -> ChunkingDocSerializer:
        return ChunkingDocSerializer(
            doc=doc,
            table_serializer=MarkdownTableSerializer(),
            picture_serializer=DescriptionPictureSerializer(),
        )


def initialize_docling_chunking():
    tokenizer = HuggingFaceTokenizer(
        tokenizer=AutoTokenizer.from_pretrained(EMBED_MODEL_ID), max_tokens=MAX_TOKENS
    )

    chunker = HybridChunker(
        tokenizer=tokenizer,
        serializer_provider=DoclingSerializerProvider(),
        repeat_table_header=True,
        merge_peers=True,
    )

    return {"tokenizer": tokenizer, "chunker": chunker}


def rehydrate_docling_json(docling_json: Path) -> DoclingDocument:
    document = DoclingDocument.model_validate(
        json.loads(docling_json.read_text(encoding="utf-8"))
    )

    return document


def chunk(
    document: DoclingDocument,
    document_id: str,
    chunker: HybridChunker,
    tokenizer: HuggingFaceTokenizer,
) -> dict:
    t.tic()
    document_chunks = list(chunker.chunk(dl_doc=document))

    if not document_chunks:
        return {
            "document_id": document_id,
            "chunk_count": 0,
            "chunks": [],
            "token_overflow": [],
        }

    token_overflow = []
    chunks = []
    for chunk_number, chunk in enumerate(document_chunks):
        page_Numbers = set()
        labels = set()
        self_reference = []
        chunk_contextualized = chunker.contextualize(chunk=chunk)
        chunk_text = chunk.text
        token_count = tokenizer.count_tokens(chunk_contextualized)
        headings = chunk.meta.headings if chunk.meta.headings else []
        origin = getattr(chunk.meta, "origin", None)
        file_name = origin.filename if origin and origin.filename else None
        mime_type = origin.mimetype if origin and origin.mimetype else None

        for item in chunk.meta.doc_items:
            if item.self_ref not in self_reference:
                self_reference.append(item.self_ref)

            if hasattr(item, "label") and item.label:
                labels.add(str(item.label))

            for provenance in getattr(item, "prov", []):
                if hasattr(provenance, "page_no"):
                    page_Numbers.add(provenance.page_no)

        if token_count > MAX_TOKENS:
            token_overflow.append(
                {"chunk_number": chunk_number, "token_count": token_count}
            )

        chunks.append(
            {
                "document_id": document_id,
                "chunk_id": f"{document_id}_{PARSING_CHUNKING_VERSION}_{chunk_number}",
                "chunk_number": chunk_number,
                "source_text": chunk_text,
                "embedding_text": chunk_contextualized,
                "token_count": token_count,
                "metadata": {
                    "headings": headings,
                    "labels": sorted(labels),
                    "page_numbers": sorted(page_Numbers),
                    "source_refs": self_reference,
                    "file_name": file_name,
                    "mimetype": mime_type,
                },
                "parser_metadata": {
                    "parser": "docling",
                    "parsing_version": PARSING_CHUNKING_VERSION,
                    "docling_version": DOCLING_VERSION,
                    "tokenizer_model": EMBED_MODEL_ID,
                    "max_tokens": MAX_TOKENS,
                    "full_metadata": chunk.meta.model_dump(mode="json"),
                },
            }
        )
    elapsed_seconds = t.tocvalue()
    logger.info(f"Chunking took: {elapsed_seconds:.2f}")

    return {
        "document_id": document_id,
        "chunk_count": len(chunks),
        "chunks": chunks,
        "token_overflow": token_overflow,
    }


def extract_docling_assets(document: DoclingDocument) -> dict:
    pictures = []
    tables = []

    def shared_metadata(item):
        return {
            "source_ref": item.self_ref,
            "caption_refs": [reference.cref for reference in item.captions],
            "page_numbers": sorted({provenance.page_no for provenance in item.prov}),
        }

    for picture in document.pictures:
        image = picture.image

        pictures.append(
            {
                **shared_metadata(picture),
                "image_uri": str(image.uri) if image is not None else None,
                "mimetype": image.mimetype if image is not None else None,
                "width": image.size.width if image is not None else None,
                "height": image.size.height if image is not None else None,
            }
        )

    for table in document.tables:
        tables.append(
            {
                **shared_metadata(table),
                "table_data": table.data.model_dump(mode="json"),
            }
        )

    return {
        "pictures": pictures,
        "tables": tables,
    }


def link_chunk_assets(chunking_result: dict, assets: dict) -> dict:
    asset_refs = {
        asset["source_ref"]
        for asset_type in ("pictures", "tables")
        for asset in assets.get(asset_type, [])
    }

    for chunk_record in chunking_result.get("chunks", []):
        metadata = chunk_record["metadata"]

        metadata["asset_refs"] = list(
            dict.fromkeys(
                reference
                for reference in metadata.get("source_refs", [])
                if reference in asset_refs
            )
        )

    return chunking_result


def expand_docling_chunk(
    chunk: DocChunk,
    document: DoclingDocument,
    chunker: HybridChunker,
    tokenizer: HuggingFaceTokenizer,
) -> dict:
    serializer = chunker.serializer_provider.get_serializer(doc=document)

    expanded_chunk = TreeChunkExpander().expand(
        chunk=chunk,
        dl_doc=document,
        serializer=serializer,
    )

    original_text = chunker.contextualize(chunk=chunk)
    expanded_text = chunker.contextualize(chunk=expanded_chunk)

    return {
        "source_refs": list(
            dict.fromkeys(item.self_ref for item in expanded_chunk.meta.doc_items)
        ),
        "source_text": expanded_chunk.text,
        "contextualized_text": expanded_text,
        "token_count": tokenizer.count_tokens(expanded_text),
        "original_token_count": tokenizer.count_tokens(original_text),
        "content_changed": expanded_text != original_text,
    }


def expand_docling_pages(
    chunk: DocChunk,
    document: DoclingDocument,
    chunker: HybridChunker,
    tokenizer: HuggingFaceTokenizer,
) -> dict:
    page_numbers = sorted(
        {
            provenance.page_no
            for item in chunk.meta.doc_items
            for provenance in item.prov
        }
    )

    if not page_numbers:
        return {
            "available": False,
            "reason": "Chunk has no page provenance",
            "page_numbers": [],
        }

    serializer = chunker.serializer_provider.get_serializer(doc=document)

    expanded_chunk = PageChunkExpander().expand(
        chunk=chunk,
        dl_doc=document,
        serializer=serializer,
    )

    original_text = chunker.contextualize(chunk=chunk)
    expanded_text = chunker.contextualize(chunk=expanded_chunk)

    return {
        "available": True,
        "page_numbers": page_numbers,
        "source_refs": list(
            dict.fromkeys(item.self_ref for item in expanded_chunk.meta.doc_items)
        ),
        "source_text": expanded_chunk.text,
        "contextualized_text": expanded_text,
        "token_count": tokenizer.count_tokens(expanded_text),
        "original_token_count": tokenizer.count_tokens(original_text),
        "content_changed": expanded_text != original_text,
    }
