import hashlib
from pathlib import Path

from Functions.RAG.chunking_helpers.docling_chunking import (
    chunk,
    extract_docling_assets,
    initialize_docling_chunking,
    link_chunk_assets,
    rehydrate_docling_json,
)
from Functions.RAG.chunking_helpers.marker_chunking import (
    chunk_marker_document,
    initialize_marker_chunking,
    load_marker_json,
)
from Functions.utilities import logger


def generate_sha256_id(source_path: Path) -> str:
    with open(source_path, "rb") as file:
        file_hash = hashlib.file_digest(file, "sha256")

    return file_hash.hexdigest()


def docling_chunking(docling_summary: list[dict]) -> list[dict]:
    chunking_Objects = initialize_docling_chunking()
    docling_chunks = []

    for plan in docling_summary:
        files = plan["files"]

        for file in files:
            if file["conversion_status"] != "success":
                continue

            file_path = file["file_path"]
            json_path = file["json_path"]

            logger.info(f"Chunking {file_path.name}")

            document = rehydrate_docling_json(docling_json=json_path)
            document_id = generate_sha256_id(source_path=file_path)
            assets = extract_docling_assets(document=document)

            chunking_result = chunk(
                document=document,
                document_id=document_id,
                chunker=chunking_Objects["chunker"],
                tokenizer=chunking_Objects["tokenizer"],
            )

            chunking_result = link_chunk_assets(
                chunking_result=chunking_result, assets=assets
            )

            docling_chunks.append(
                {
                    "file_path": file_path,
                    "json_path": json_path,
                    "chunking_result": chunking_result,
                    "assets": assets,
                }
            )

    return docling_chunks


def marker_chunking(marker_summary: list[dict], *, chunking_objects=None) -> list[dict]:
    """Process successful Marker responses; same wrapper as docling_chunking().

    Success records must preserve original file_path and exported json_path.
    The existing Marker parser must include both paths on success records.
    """
    successful = [item for item in marker_summary if item.get("status") == "success"]

    if not successful:
        return []
    tools = (
        chunking_objects
        if chunking_objects is not None
        else initialize_marker_chunking()
    )
    results = []

    for item in successful:
        if "file_path" not in item or "json_path" not in item:
            raise ValueError(
                "Marker success records need file_path and json_path; add these fields to the Marker parser success record"
            )

        file_path, json_path = Path(item["file_path"]), Path(item["json_path"])
        logger.info("Chunking Marker document %s", file_path.name)
        document_id = generate_sha256_id(file_path)

        result = chunk_marker_document(
            document=load_marker_json(json_path),
            document_id=document_id,
            tokenizer=tools["tokenizer"],
            file_name=file_path.name,
            max_tokens=tools["max_tokens"],
            model_id=tools["model_id"],
            reviewed_corrections=item.get("reviewed_corrections"),
        )

        results.append(
            {
                "file_path": file_path,
                "json_path": json_path,
                "chunking_result": result["chunking_result"],
                "assets": result["assets"],
            }
        )
    return results


def test_docling_chunking() -> list[dict]:
    data_path = Path("/home/thienan/Documents/GitHub/Glorp-Cat/src/Data")

    docling_summary = [
        {
            "profile": "doclingNative",
            "files": [
                {
                    "conversion_status": "success",
                    "file_path": (
                        data_path / "input" / "arts_lab_graduate_handbook.pdf"
                    ),
                    "json_path": (
                        data_path
                        / "output/docling/doclingNative"
                        / "arts_lab_graduate_handbook"
                        / "arts_lab_graduate_handbook.json"
                    ),
                },
            ],
        },
        {
            "profile": "doclingOCR",
            "files": [
                {
                    "conversion_status": "success",
                    "file_path": (
                        data_path / "input" / "nasa_proposal_Thienan_Hoang_v1.docx"
                    ),
                    "json_path": (
                        data_path
                        / "output/docling/doclingOCR"
                        / "nasa_proposal_Thienan_Hoang_v1"
                        / "nasa_proposal_Thienan_Hoang_v1.json"
                    ),
                },
                {
                    "conversion_status": "failed",
                },
            ],
        },
    ]

    results = docling_chunking(docling_summary)

    assert len(results) == 2, "Expected two successful document results"

    expected_assets = {
        "arts_lab_graduate_handbook.pdf": (0, 1),
        "nasa_proposal_Thienan_Hoang_v1.docx": (4, 1),
    }

    document_ids = []

    for result in results:
        file_name = Path(result["file_path"]).name
        chunking_result = result["chunking_result"]
        assets = result["assets"]

        picture_count = len(assets["pictures"])
        table_count = len(assets["tables"])

        actual = (picture_count, table_count)
        expected = expected_assets[file_name]

        assert actual == expected, (
            f"{file_name}: expected {expected[0]} pictures and "
            f"{expected[1]} tables; got {actual[0]} pictures and "
            f"{actual[1]} tables. JSON: {result['json_path']}"
        )
        document_ids.append(chunking_result["document_id"])

        print(
            {
                "file": file_name,
                "document_id": chunking_result["document_id"],
                "chunks": chunking_result["chunk_count"],
                "pictures": picture_count,
                "tables": table_count,
                "token_overflow": chunking_result["token_overflow"],
            }
        )

    assert len(set(document_ids)) == 2, "Document IDs should differ"

    print("PASS: Both documents processed; failed entry skipped.")

    return results
