from pathlib import Path

from src.Functions.RAG.chunking import docling_chunking


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
