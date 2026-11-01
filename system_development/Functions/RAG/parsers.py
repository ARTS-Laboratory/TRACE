from Functions.RAG.parsing_profiles.apply_parser_settings import addDoclingParserSettings
from Functions.RAG.parsing_profiles.parsing_profiles import profileNames
from Functions.RAG.Router.router import pdf_router
from Functions.utilities import logger, t
from Functions.Model.config import DATA_PATH
from pathlib import Path
from docling.exceptions import ConversionError
from docling_core.types.doc import ImageRefMode
import httpx
from Functions.Services.lifecycle import service_lease

OUTPUT_FOLDER = DATA_PATH / "output" / "docling"

def route_pdf(pdfs):
    routed_pdf = pdf_router(pdfs)

    docling_files = []
    marker_files = []
    docling_summary = []
    marker_summary = []

    for item in routed_pdf:
        profile = item.get("parsing profile", "")

        if profile.startswith("docling"):
            docling_files.append(item)
        elif profile == "marker":
            marker_files.append(item)

    if len(docling_files) != 0:
        docling_summary = convert_docling_documents(docling_files)
    if len(marker_files) != 0:
        marker_summary = convert_marker_documents(marker_files)

    return {
        "docling": docling_summary,
        "marker": marker_summary
    }

def convert_docling_documents(router_results):
    parser_plans = addDoclingParserSettings(router_results)

    for plan in parser_plans:
        profile = plan["profile"]
        files = plan["files"]
        settings = plan["settings"]

        logger.info(f"Beginning Docling conversion for {len(files)} {profile} files.")

        for file in files:
            file_path = file["file_path"]

            try:
                logger.info(f"Converting {file_path.name}")

                file["converted file"] = settings.convert(file_path)

                json_path = export_docling_json(file["converted file"].document, file_path, profile)
                file["json path"] = json_path
                logger.info(f"Exported {file_path.name} as JSON to {json_path}")

                file["conversion status"] = "success"

            except ConversionError as e:
                logger.error(f"Error converting {file_path.name}: {e}")
                file["conversion error"] = e
                file["conversion status"] = "failed"

    return parser_plans

def convert_marker_documents(pdfs):
    with service_lease("parsing"):
        return _convert_marker_documents_active(pdfs)

def _convert_marker_documents_active(pdfs):
    summaries = []

    url = "http://marker:8002/parse"

    for pdf in pdfs:
        file_path = pdf["file_path"]

        try:
            relative_path = file_path.resolve().relative_to(
                DATA_PATH.resolve()
            )

            request_payload = {
                "file_path": str(relative_path),
                "output_format": "json",
                "parsing_profile": pdf["parsing profile"]
            }

            logger.info(f"Sending {file_path.name} to Marker API")

            response = httpx.post(
                url,
                json=request_payload,
                timeout=httpx.Timeout(
                    connect=10.0,
                    read=1800.0,
                    write=30.0,
                    pool=10.0
                )
            )

            response.raise_for_status()

            response_data = response.json()

            if response_data.get("status") != "complete":
                raise ValueError(
                    "Marker API did not report successful completion"
                )

            summary = response_data["summary"]
            json_path = (DATA_PATH / summary["json"]).resolve()
            output_path = (DATA_PATH / "output").resolve()

            if not json_path.is_relative_to(output_path):
                raise ValueError(
                    "Marker returned an invalid output path"
                )

            if not json_path.is_file():
                raise FileNotFoundError(
                    "Marker output JSON file was not found"
                )

            logger.info(
                f"Marker completed {file_path.name}: {json_path}"
            )

            summaries.append({
                "name": file_path.name,
                "summary": summary,
                "status": "success"
            })

        except ValueError as e:
            logger.error(
                f"Invalid Marker request or response for "
                f"{file_path.name}: {e}"
            )
            summaries.append({
                "name": file_path.name,
                "summary": None,
                "status": "failed",
                "error": str(e)
            })

        except httpx.TimeoutException as e:
            logger.error(
                f"Marker request timed out for {file_path.name}: {e}"
            )
            summaries.append({
                "name": file_path.name,
                "summary": None,
                "status": "failed",
                "error": "Marker request timed out"
            })

        except httpx.HTTPStatusError as e:
            logger.error(
                f"Marker API returned HTTP "
                f"{e.response.status_code} for {file_path.name}: {e}"
            )
            summaries.append({
                "name": file_path.name,
                "summary": None,
                "status": "failed",
                "error": f"Marker API HTTP {e.response.status_code}"
            })

        except httpx.RequestError as e:
            logger.error(
                f"Marker connection failed for {file_path.name}: {e}"
            )
            summaries.append({
                "name": file_path.name,
                "summary": None,
                "status": "failed",
                "error": "Unable to communicate with Marker API"
            })

        except (KeyError, TypeError, FileNotFoundError) as e:
            logger.error(
                f"Invalid or missing Marker output for "
                f"{file_path.name}: {e}"
            )
            summaries.append({
                "name": file_path.name,
                "summary": None,
                "status": "failed",
                "error": str(e)
            })

    return summaries

def export_docling_json(document, file_path: Path, profile: str):
    stem = file_path.stem

    base_path = OUTPUT_FOLDER / profile / stem
    image_path = base_path / "images"
    base_path.mkdir(parents=True, exist_ok=True)
    image_path.mkdir(parents=True, exist_ok=True)

    json_path = base_path / f"{stem}.json"

    document.save_as_json(
            json_path,
            image_mode=ImageRefMode.REFERENCED,
            artifacts_dir=image_path
    )

    return json_path