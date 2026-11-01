from markerParser import MarkerParser
from parsing_profiles import profileNames, markerPipelineOptions
from parser_settings import markerProfiles

from surya.inference.backends.spawn import SpawnError
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pathlib import Path
from pytictoc import TicToc
import logging
import tempfile
import asyncio

# Cache initialized MarkerParser instances by profile name.
parsers: dict[str, MarkerParser] = {}

# Prevent simultaneous initialization of converters.
parser_lock = asyncio.Lock()
conversion_lock = asyncio.Lock()

logging.basicConfig(level=logging.INFO,
                     format='%(asctime)s - %(levelname)s - %(message)s',
                     datefmt='%Y-%m-%d %I:%M:%S %p')

t = TicToc()
app = FastAPI()
logger = logging.getLogger(__name__)
DATA_PATH = Path("/app/Data").resolve()
INPUT_PATH = (DATA_PATH / "input").resolve()

class FilePayload(BaseModel):
    file_path: Path
    output_format: str
    parsing_profile: str

@app.get("/health")
def health():
    return {
        "status": "ok"
    }

@app.post("/parse")
async def load_payload(payload: FilePayload):
    if payload.output_format.lower() != "json":
        raise HTTPException(status_code=400, detail="Output format must be json")

    if payload.file_path.is_absolute():
        raise HTTPException(status_code=400, detail="File cannot be absolute")

    targeted_file = (DATA_PATH / payload.file_path).resolve()
    # Check if file is within the allowed directory
    if not targeted_file.is_relative_to(INPUT_PATH):
        raise HTTPException(status_code=403, detail="File path is outside the permitted directory")

    # Check existence
    if not targeted_file.exists():
        raise HTTPException(status_code=404, detail="File path does not exist")

    # Check if it is a regular file
    if not targeted_file.is_file():
        raise HTTPException(status_code=400, detail="File is not a regular file")

    # Check extension
    if targeted_file.suffix.lower() != ".pdf":
        raise HTTPException(status_code=400, detail="File extension is not .pdf")

    async with conversion_lock:
        try:
            parser = await getCachedMarkerParser(
                payload.parsing_profile
            )

        except HTTPException:
            raise

        except Exception:
            logger.exception("Failed to initialize Marker converter")
            raise HTTPException(status_code=500,detail="Marker initialization failed")

        logger.info("Converting %s", targeted_file.name)
        t.tic()

        try:
            rendered = await asyncio.to_thread(
                parser.convert,
                targeted_file
            )

        except SpawnError:
            logger.exception("Surya inference service unavailable")
            raise HTTPException(status_code=503, detail="Surya inference service unavailable")

        except Exception:
            logger.exception("Marker conversion failed: %s", targeted_file.name)
            raise HTTPException(status_code=500,detail="Document conversion failed")

        elapsed_seconds = t.tocvalue()
        logger.info("Time taken to convert: %.2fs",elapsed_seconds)

        logger.info("Exporting %s", targeted_file.name)
        t.tic()

        try:
            summary = await asyncio.to_thread(
                parser.export,
                rendered,
                DATA_PATH / "output",
                payload.parsing_profile,
                targeted_file.stem
            )

            summary["json"] = str(
                summary["json"].relative_to(DATA_PATH)
            )

        except Exception:
            logger.exception("Marker JSON export failed: %s", targeted_file.name)
            raise HTTPException(status_code=500, detail="Document export failed")

        elapsed_seconds = t.tocvalue()
        logger.info(
            "Time taken to export: %.2fs",
            elapsed_seconds
        )

    return {
        "file path": targeted_file,
        "file name": targeted_file.name,
        "output format": payload.output_format,
        "summary": summary,
        "status": "complete"
    }

# File: docker/marker/server.py

async def getCachedMarkerParser(parser_name: str) -> MarkerParser:
    async with parser_lock:

        if parser_name in parsers:
            logger.info("Reusing cached Marker converter: %s", parser_name)
            return parsers[parser_name]

        profile = getMarkerProfile(parser_name)

        logger.info("Initializing Marker converter: %s", parser_name)

        parser = await asyncio.to_thread(MarkerParser, profile)

        parsers[parser_name] = parser

        logger.info("Cached Marker converter: %s", parser_name)

        return parser

def getMarkerProfile(parserName: str) -> markerPipelineOptions:
    profileMap = {
        "marker": profileNames.marker,
    }

    try:
        return markerProfiles[profileMap[parserName]]
    except KeyError:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown Marker parsing profile: {parserName}"
        )

def addMarkerParserSettings(markerProfiles):
    profiles_list = [profile.value for profile in profileNames if "marker" in profile.value]

    parserPlansWithSettings = [
            {
                "profile": profile,
                "settings": MarkerParser(markerProfiles[profileNames(profile)]),
            }

            for profile in profiles_list
    ]

    return parserPlansWithSettings

"""
curl -i -X POST http://localhost:8002/parse \
  -H "Content-Type: application/json" \
  -d '{
    "file_path": "input/Sample Mixed PDF - Multiple.pdf",
    "output_format": "json",
    "parser_profile": "marker"
  }'
"""