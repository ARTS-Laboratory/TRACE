from marker.converters.pdf import PdfConverter
from marker.renderers.json import JSONOutput
from marker.models import create_model_dict
from parsing_profiles import markerPipelineOptions
from pathlib import Path
import logging
from typing import Any
import json
import base64
import binascii

logging.basicConfig(level=logging.INFO,
                     format='%(asctime)s - %(levelname)s - %(message)s',
                     datefmt='%Y-%m-%d %I:%M:%S %p')

logger = logging.getLogger(__name__)


class MarkerParser:
        def __init__(
                self,
                profile: markerPipelineOptions,
                ):
                self.profile = profile
                self.converter = self._buildPdfConverter(profile)

        @staticmethod
        def _buildPdfConverter(profile: markerPipelineOptions) -> PdfConverter:
                artifact_dict = create_model_dict()
                config = {
                        "force_ocr": profile.forceOCR,
                        "paginate_output": profile.paginateOutput,
                        "strip_existing_ocr": profile.stripExistingOCR,
                        "mode": profile.mode,
                        "ocr_full_page": profile.ocrFullPage,
                        }

                if profile.pageRanges:
                        config["page_range"] = profile.pageRanges

                kwargs = {
                        "artifact_dict": artifact_dict,
                        "config": config,
                        "renderer": "marker.renderers.json.JSONRenderer"
                        }

                print(kwargs)

                if profile.useLLM:
                        config.update({
                                "use_llm": True,
                                "ollama_base_url": profile.ollamaBaseUrl,
                                "ollama_model": profile.ollamaModel,
                        })

                        kwargs["llm_service"] = profile.llmService

                return PdfConverter(**kwargs)


        def convert(self, pdf: Path) -> JSONOutput:
                return self.converter(str(pdf))

        def export(
                self,
                rendered: JSONOutput,
                outputFolder: Path,
                parserName: str,
                stem: str,
                ) -> dict[str, Any]:

                baseDir = outputFolder / parserName
                outputDir = baseDir / stem

                outputDir.mkdir(parents=True, exist_ok=True)

                # Convert Pydantic output into a mutable dictionary.
                document = rendered.model_dump(mode="json")

                # Extract images and replace Base64 strings with relative paths.
                image_count = extract_marker_images(document, outputDir)

                # Save the modified document structure.
                jsonPath = outputDir / f"{stem}.json"

                jsonPath.write_text(
                json.dumps(document, indent=2, ensure_ascii=False),
                encoding="utf-8",
                )

                logger.info("Wrote %s", jsonPath)
                logger.info("Exported %d images", image_count)


                logger.info(f"Wrote {jsonPath}")

                return {
                        "file": stem,
                        "parser": parserName,
                        "pages": self.converter.page_count,
                        "json": jsonPath,
                        "images": image_count,
                        }

def extract_marker_images(document: dict, output_dir: Path) -> int:
    images_dir = output_dir / "images"
    image_count = 0

    def process_block(block: dict):
        nonlocal image_count

        images = block.get("images")

        if isinstance(images, dict):
            for image_id, encoded_image in images.items():
                if not isinstance(encoded_image, str):
                    continue

                try:
                    image_bytes = base64.b64decode(
                        encoded_image,
                        validate=True
                    )
                except (ValueError, binascii.Error) as exc:
                    raise ValueError(
                        f"Invalid Base64 image in block {block.get('id')}"
                    ) from exc

                # Detect the actual image format.
                if image_bytes.startswith(b"\xff\xd8\xff"):
                    extension = ".jpg"
                elif image_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
                    extension = ".png"
                elif image_bytes.startswith(b"RIFF") and image_bytes[8:12] == b"WEBP":
                    extension = ".webp"
                else:
                    raise ValueError(
                        f"Unsupported image format in block {block.get('id')}"
                    )

                images_dir.mkdir(parents=True, exist_ok=True)

                filename = f"image_{image_count:06d}{extension}"
                image_path = images_dir / filename

                image_path.write_bytes(image_bytes)

                # Replace Base64 with a relative file reference.
                images[image_id] = f"images/{filename}"

                image_count += 1

        for child in block.get("children") or []:
            process_block(child)

    process_block(document)
    return image_count


def convertDocumentsMarker(
    parserPlans: list[dict[str, Any]],
    inputFolder: Path,
    outputFolder: Path,
) -> list[dict[str, Any]]:
    markerPlans = [
        plan
        for plan in parserPlans
        if plan["parser_plan"].startswith("marker")
    ]

    parsers: dict[str, MarkerParser] = {}
    results: list[dict[str, Any]] = []

    for plan in markerPlans:
        parserName = plan["parser_plan"]

        if parserName not in parsers:
            profile = parsingProfiles.getMarkerProfile(parserName)
            parsers[parserName] = MarkerParser(profile)

        parser = parsers[parserName]
        pdf = inputFolder / plan["file"]

        try:
            logger.info(f"Converting {pdf.name} with {parserName}")

            t.tic()
            rendered = parser.convert(pdf)
            logger.info(
                f"{pdf.name}: {parser.converter.page_count} pages"
            )
            t.toc(f"Converted {pdf.name} in")

            summary = parser.export(
                rendered,
                outputFolder,
                parserName,
                pdf.stem,
            )

            results.append(summary)

        except Exception:
            logger.exception(f"{parserName} failed on {pdf.name}")

    return results
