from Functions.RAG.Router.keywords import SCIENTIFIC_KEYWORDS, TECHNICAL_SHEET_KEYWORDS, CITATION_PATTERNS, CAPTION_PATTERNS
import mimetypes
import re

def _extract_page_metadata(page, dimension_counts, rotation_counts):
    """Accumulates page dimension and rotation frequencies."""
    rect = page.rect
    dim = (rect.height, rect.width)
    rotation = page.rotation
    
    dimension_counts[dim] = dimension_counts.get(dim, 0) + 1
    rotation_counts[rotation] = rotation_counts.get(rotation, 0) + 1

def _extract_page_words(page_text):
    """Computes total word count and words list for a single page."""
    page_words = page_text.split()
    return len(page_words)

def _extract_page_blocks(page, page_number, fig_results, fig_totals):
    """Extracts layout text blocks and checks for figure/table captions."""
    blocks = page.get_text("blocks", sort=True)
    blocks_this_page = 0
    compiled_caption_patterns = {k: re.compile(v) for k, v in CAPTION_PATTERNS.items()}

    for block in blocks:
        x0, y0, x1, y1, text, block_no, block_type = block
        stripped_text = text.strip()
        
        if block_type == 0 and stripped_text:
            blocks_this_page += 1
            
            # Check caption patterns
            for caption_type, pattern in compiled_caption_patterns.items():
                if pattern.match(stripped_text):
                    if page_number not in fig_results[caption_type]["pages"]:
                        fig_results[caption_type]["pages"].append(page_number)
                    
                    fig_results[caption_type]["caption information"].append({
                        "page number": page_number,
                    })
                    
                    fig_results[caption_type]["total matches"] += 1
                    fig_totals[0] += 1
                    break  # Stop checking other patterns once matched

    return blocks_this_page

def _extract_page_images(page, page_number, image_block):
    """Extracts image count and page coverage info for images on the page."""
    images_info = page.get_image_info()
    number_of_images = len(images_info)
    
    page_rect = page.rect
    page_area = page_rect.height * page_rect.width

    for image in images_info:
        _, _, x1, y1 = image["bbox"]
        x0, y0, _, _ = image["bbox"]
        bbox_area = (y1 - y0) * (x1 - x0)
        page_coverage = (bbox_area / page_area) * 100 if page_area > 0 else 0.0

        image_block.append(
            {
                "page number": page_number,
                "page coverage percentage": round(page_coverage, 4),
            }
        )

    return number_of_images

def _extract_page_vector_graphics(page, vector_paths_per_page, vector_ops_per_page, totals_paths, totals_ops):
    """
    Extracts vector paths and drawing operations (items) from the page 
    using page.get_drawings() to evaluate graphic complexity.
    """
    drawings = page.get_drawings()
    num_paths = len(drawings)
    num_ops = sum(len(path.get("items", [])) for path in drawings)
    
    totals_paths[0] += num_paths
    totals_ops[0] += num_ops
    
    vector_paths_per_page.append(num_paths)
    vector_ops_per_page.append(num_ops)

def _evaluate_keywords(page_text_lower, keywords_list, results_dict, totals_ref, page_number):
    """Evaluates case-insensitive keyword matches against page text."""
    for keyword in keywords_list:
        if keyword.lower() in page_text_lower:
            results_dict[keyword]["pages"].append(page_number)
            results_dict[keyword]["pages matched"] += 1
            totals_ref[0] += 1

def _evaluate_citations(page_text, compiled_patterns, cit_results, cit_totals, page_number):
    """Evaluates citation regex patterns against page text."""
    for citation_type, pattern in compiled_patterns.items():
        matches = list(pattern.finditer(page_text))
        match_count = len(matches)
        
        if match_count > 0:
            cit_results[citation_type]["total matches"] += match_count
            cit_totals[0] += match_count
            
            if page_number not in cit_results[citation_type]["pages"]:
                cit_results[citation_type]["pages"].append(page_number)


def extract_pdf_features_single_pass(file):
    """
    Performs a single optimized pass over all pages in the PDF document,
    delegating page-level data extraction to specialized modular helpers.
    """
    file_type, _ = mimetypes.guess_type(file["file_path"])
    document = file["document"]
    page_count = document.page_count
    
    # Aggregator state dictionaries & lists
    dimension_counts = {}
    rotation_counts = {}

    total_word_count = 0
    words_per_page = []
    blocks_per_page = []

    total_images = 0
    images_per_page = []
    image_block = []

    vector_total_paths = [0]
    vector_total_operations = [0]
    vector_paths_per_page = []
    vector_ops_per_page = []

    sci_total_matches = [0]
    sci_results = {
        keyword: {"pages": [], "pages matched": 0} 
        for keyword in SCIENTIFIC_KEYWORDS
    }

    tech_total_matches = [0]
    tech_results = {
        keyword: {"pages": [], "pages matched": 0} 
        for keyword in TECHNICAL_SHEET_KEYWORDS
    }

    cit_total_matches = [0]
    cit_results = {
        citation_type: {"pages": [], "total matches": 0} 
        for citation_type in CITATION_PATTERNS
    }
    compiled_citation_patterns = {
        citation_type: re.compile(pattern) 
        for citation_type, pattern in CITATION_PATTERNS.items()
    }

    fig_total_matches = [0]
    fig_results = {
        caption_type: {"pages": [], "total matches": 0, "caption information": []}
        for caption_type in CAPTION_PATTERNS
    }

    # ==========================================
    # SINGLE PASS OVER ALL PAGES
    # ==========================================
    for page_number, page in enumerate(document):
        # 1. Metadata
        _extract_page_metadata(page, dimension_counts, rotation_counts)

        # 2. Extract raw page text ONCE
        page_text = page.get_text()
        page_text_lower = page_text.lower()

        # 3. Words & Word Counts
        num_words = _extract_page_words(page_text)
        total_word_count += num_words
        words_per_page.append(num_words)

        # 4. Text Blocks & Figures/Tables
        blocks_this_page = _extract_page_blocks(page, page_number, fig_results, fig_total_matches)
        blocks_per_page.append(blocks_this_page)

        # 5. Images
        number_of_images = _extract_page_images(page, page_number, image_block)
        images_per_page.append(number_of_images)
        total_images += number_of_images

        # 6. Vector Graphics (Paths vs Drawing Operations)
        _extract_page_vector_graphics(
            page, vector_paths_per_page, vector_ops_per_page, 
            vector_total_paths, vector_total_operations
        )

        # 7. Scientific Keywords
        _evaluate_keywords(page_text_lower, SCIENTIFIC_KEYWORDS, sci_results, sci_total_matches, page_number)

        # 8. Technical Keywords
        _evaluate_keywords(page_text_lower, TECHNICAL_SHEET_KEYWORDS, tech_results, tech_total_matches, page_number)

        # 9. Citations
        _evaluate_citations(page_text, compiled_citation_patterns, cit_results, cit_total_matches, page_number)

    # Format final metadata outputs
    page_dimensions = [
        {"dimensions HxW": dim, "count": count}
        for dim, count in dimension_counts.items()
    ]
    page_rotations = [
        {"rotation": rot, "count": count}
        for rot, count in rotation_counts.items()
    ]

    # Compute vector summary metrics & peaks
    safe_page_count = page_count if page_count > 0 else 1
    avg_vector_paths = round(vector_total_paths[0] / safe_page_count, 2)
    avg_drawing_ops = round(vector_total_operations[0] / safe_page_count, 2)

    max_paths_count = max(vector_paths_per_page) if vector_paths_per_page else 0
    max_paths_page = vector_paths_per_page.index(max_paths_count) if vector_paths_per_page else 0

    max_ops_count = max(vector_ops_per_page) if vector_ops_per_page else 0
    max_ops_page = vector_ops_per_page.index(max_ops_count) if vector_ops_per_page else 0

    return {
        "file_path": file["file_path"],
        "metadata": {
            "file type": file_type,
            "page count": page_count,
            "page dimensions": page_dimensions,
            "page rotations": page_rotations
        },
        "words": {
            "total word count": total_word_count,
            "words per page": words_per_page,
            "text blocks per page": blocks_per_page,
        },
        "images": {
            "total image count": total_images,
            "images per page": images_per_page,
            "image information": image_block
        },
        "vector graphics": {
            "total vector paths": vector_total_paths[0],
            "total drawing operations": vector_total_operations[0],
            "average vector paths per page": avg_vector_paths,
            "average drawing operations per page": avg_drawing_ops,
            "max vector paths": {
                "page": max_paths_page,
                "count": max_paths_count
            },
            "max drawing operations": {
                "page": max_ops_page,
                "count": max_ops_count
            },
            "vector paths per page": vector_paths_per_page,
            "drawing operations per page": vector_ops_per_page
        },
        "scientific features": {
            "total matches": sci_total_matches[0],
            "results": sci_results
        },
        "technical features": {
            "total matches": tech_total_matches[0],
            "results": tech_results
        },
        "citations": {
            "total matches": cit_total_matches[0],
            "results": cit_results
        },
        "figures and tables": {
            "total matches": fig_total_matches[0],
            "results": fig_results
        }
    }