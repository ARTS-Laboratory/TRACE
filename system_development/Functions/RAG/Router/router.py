from Functions.Model.config import INPUT_PATH
from Functions.RAG.Router.pdf_features import extract_pdf_features_single_pass
from Functions.RAG.Router.none_pdf_features import general_features
import pymupdf

"""
cd "/home/thienan/Documents/GitHub/Glorp-Cat/system development"

/home/thienan/Documents/GitHub/Glorp-Cat/glorp-cat/bin/python -m Functions.RAG.Router.router
"""

def load_documents():
    files = [{"file_path": file, "document": pymupdf.open(file)} for file in INPUT_PATH.iterdir() if file.is_file()]
    return files

def filter_pdfs(files):
    pdfs = []
    non_pdfs = []
    for file in files:
        extension = file["file_path"].suffix.lower().lstrip(".")
        if extension == "pdf":
            pdfs.append(file)
        else:
            non_pdfs.append(file)
    return pdfs, non_pdfs

def extract_pdf_features(pdfs):
    extracted_results = []
    for pdf in pdfs:
        # Utilizing the optimized single-pass feature extractor
        extracted_results.append(extract_pdf_features_single_pass(pdf))
    return extracted_results

def non_pdf_router(non_pdfs):
    results = general_features(non_pdfs)
    routed_non_pdf = []

    for result in results:
        total_media_count = result["total media count"]
        if total_media_count > 0:
            result["parsing profile"] = "doclingOCR"
            routed_non_pdf.append(
                {
                    "file_path": result["file_path"],
                    "parsing profile": "doclingOCR"
                }
            )
        else:
            result["parsing profile"] = "doclingNative"
            routed_non_pdf.append(
                {
                    "file_path": result["file_path"],
                    "parsing profile": "doclingNative"
                }
            )            
    return routed_non_pdf

def keyword_and_pattern_evidence(result, page_count):
    scientific_matches = result["scientific features"]["total matches"]
    technical_matches = result["technical features"]["total matches"]
    citation_matches = result["citations"]["total matches"]
    caption_matches = result["figures and tables"]["total matches"]

    scientific_evidence = scientific_matches / page_count >= 2
    technical_evidence = technical_matches / page_count >= 2
    citation_evidence = citation_matches / page_count >= 2
    structure_evidence = caption_matches / page_count >= 4

    scientific_evidence_count = sum([
        scientific_evidence,
        citation_evidence,
        structure_evidence
    ])

    return scientific_evidence_count, technical_evidence

def classify_density(value, low_limit, high_limit):
    if value < low_limit:
        return "low"
    elif value <= high_limit:
        return "medium"
    else:
        return "high"

def visual_complexity(result, total_image_count, page_count):
    if page_count <= 0:
        return {"error": "page_count must be greater than 0"}

    vector_graphics = result.get("vector graphics", {})
    total_vector_paths = vector_graphics.get("total vector paths", 0)
    total_drawing_operators = vector_graphics.get("total drawing operations", 0)

    raster_density = total_image_count / page_count
    vector_path_density = total_vector_paths / page_count
    drawing_operation_density = total_drawing_operators / page_count

    return {
        "raster density": classify_density(raster_density, low_limit=0.5, high_limit=2.0),
        "vector path density": classify_density(vector_path_density, low_limit=10, high_limit=150),
        "drawing operation density": classify_density(drawing_operation_density, low_limit=30, high_limit=500)
    }

def document_statistics(result):
    page_count = result["metadata"]["page count"]
    word_count = result["words"]["total word count"]
    average_words_per_page = word_count / page_count

    images = result["images"]
    image_information = images["image information"]
    images_per_page = images["images per page"]

    image_coverage = [
        image["page coverage percentage"]
        for image in image_information
    ]

    # Image distribution
    pages_with_images = sum(
        1 for image_count in images_per_page
        if image_count > 0
    )
    image_page_ratio = pages_with_images / page_count

    # Image counts
    total_image_count = images["total image count"]
    average_image_count = total_image_count / page_count

    # Image coverage
    total_percentage = sum(image_coverage)
    max_coverage = max(image_coverage, default=0)
    average_coverage = (
        total_percentage / len(image_coverage)
        if image_coverage else 0
    )    

    science_evidence_count, technical_evidence = keyword_and_pattern_evidence(
        result,
        page_count
    )    
    visual_complexity_rating = visual_complexity(result, total_image_count, page_count)
    
    return {
        "page count": page_count,
        "word count": word_count,
        "average word count": average_words_per_page,
        "image-page ratio": image_page_ratio,
        "total image count": total_image_count,
        "average image count": average_image_count,
        "max image coverage": max_coverage,
        "average image coverage": average_coverage,
        "science evidence count": science_evidence_count,
        "technical evidence": technical_evidence,
        "raster density": visual_complexity_rating["raster density"],
        "vector path density": visual_complexity_rating["vector path density"],
        "drawing operation density": visual_complexity_rating["drawing operation density"]
    }

def pdf_router(pdfs):
    results = extract_pdf_features(pdfs)
    routed_pdf = []

    for result in results:
        stats = document_statistics(result)

        # 1. Determine complexity using categorical density metrics
        vector_complex = (
            stats["vector path density"] in ("medium", "high")
            or stats["drawing operation density"] in ("medium", "high")
        )

        raster_complex = (
            stats["total image count"] > 0
            and (
                stats["average image coverage"] >= 5
                or stats["max image coverage"] >= 10
                or stats["raster density"] in ("medium", "high")
            )
        )

        visual_complex = vector_complex or raster_complex

        # 2. Routing logic based on streamlined hierarchy
        
        # Scan-dominated PDF
        if (
            stats["average word count"] < 20
            and stats["image-page ratio"] >= 0.70
            and (
                stats["average image coverage"] >= 30
                or stats["max image coverage"] >= 70
            )
        ):
            result["parsing profile"] = "doclingScannedOCR"
            routed_pdf.append(
                {
                    "file_path": result["file_path"],
                    "parsing profile": "doclingScannedOCR"
                }
            )

        # Scientific + complex structure
        elif stats["science evidence count"] >= 2 and visual_complex:
            result["parsing profile"] = "marker"
            routed_pdf.append(
                {
                    "file_path": result["file_path"],
                    "parsing profile": "marker"
                }
            )

        # Technical + complex structure
        elif stats["technical evidence"] and visual_complex:
            result["parsing profile"] = "marker"
            routed_pdf.append(
                {
                    "file_path": result["file_path"],
                    "parsing profile": "marker"
                }
            )

        # Raster-containing document where selective OCR may be useful
        elif raster_complex:
            result["parsing profile"] = "doclingOCR"
            routed_pdf.append(
                {
                    "file_path": result["file_path"],
                    "parsing profile": "doclingOCR"
                }
            )

        # Ordinary / simple native document
        else:
            result["parsing profile"] = "doclingNative"
            routed_pdf.append(
                {
                    "file_path": result["file_path"],
                    "parsing profile": "doclingNative"
                }
            )

    return routed_pdf

