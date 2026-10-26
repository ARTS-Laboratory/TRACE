
from Functions.RAG.Router.keywords import SCIENTIFIC_KEYWORDS, TECHNICAL_SHEET_KEYWORDS, CITATION_PATTERNS, CAPTION_PATTERNS
import mimetypes
import re

def metadata(file):
    file_type, _ = mimetypes.guess_type(file["file_path"])
    document = file["document"]
    page_count = document.page_count
    
    page_dimensions = []
    # 1. Localize the .append method to speed up loop execution
    page_dims_append = page_dimensions.append

    for page_number, page in enumerate(document):
        # 2. Cache page.rect to avoid repeated attribute lookup chains
        rect = page.rect
        page_dims_append(
            {
                "page number": page_number,
                "page dimensions HxW": (rect.height, rect.width),
                "page rotation": page.rotation
            }
        )

    return {
        "file type": file_type,
        "page count": page_count,
        "page dimensions": page_dimensions
    }

def words(file):
    total_word_count = 0
    words_per_page = []
    blocks_per_page = []
    text_block = []

    for page_number, page in enumerate(file["document"]):
        # 1. Compute and cache word count once to avoid calling len() twice
        page_words = page.get_text().split()
        num_words = len(page_words)
        total_word_count += num_words
        words_per_page.append(num_words)

        blocks = page.get_text("blocks", sort=True)
        blocks_this_page = 0
        
        # 2. Localize method reference for faster inner-loop appends
        text_block_append = text_block.append

        for block_number, block in enumerate(blocks):
            x0, y0, x1, y1, text, block_no, block_type = block

            if block_type == 0:
                text_block_append(
                    {
                        "block number": block_number,
                        "page number": page_number,
                        "bbox": (x0, y0, x1, y1),
                        "dimensions HxW": (y1 - y0, x1 - x0),  # Calculated inline
                        "text": text,
                        "block type": block_type
                    }
                )
                blocks_this_page += 1

        blocks_per_page.append(blocks_this_page)

    return {
        "total word count": total_word_count,
        "words per page": words_per_page,
        "text blocks per page": blocks_per_page,
        "blocks": text_block
    }

def images(file):
    total_images = 0
    images_per_page = []
    image_block = []

    for page_number, page in enumerate(file["document"]):
        # 1. Call get_image_info() ONCE per page and cache the result
        images_info = page.get_image_info()
        number_of_images = len(images_info)
        
        images_per_page.append(number_of_images)
        total_images += number_of_images

        for image in images_info:
            bbox = image["bbox"]
            x0, y0, x1, y1 = bbox  # Faster, cleaner unpacking

            image_block.append(
                {
                    "image number": image["number"],
                    "page number": page_number,
                    "bbox": bbox,
                    "bbox dimensions HxW": (y1 - y0, x1 - x0),
                    "pixel dimensions HxW": (image["height"], image["width"])
                }
            )

    return {
        "total image count": total_images,
        "images per page": images_per_page,
        "image information": image_block
    }

def keywords_science(file):
    total_matches = 0
    results = {
        keyword: {"pages": [], "pages matched": 0} 
        for keyword in SCIENTIFIC_KEYWORDS
    }

    for page_number, page in enumerate(file["document"]):
        for keyword in SCIENTIFIC_KEYWORDS:
            # Use direct list truthiness instead of len() > 0
            if page.search_for(keyword):
                res = results[keyword]
                res["pages"].append(page_number)
                res["pages matched"] += 1
                total_matches += 1

    return {
        "total matches": total_matches,
        "results": results
    }


def keywords_technical(file):
    total_matches = 0
    results = {
        keyword: {"pages": [], "pages matched": 0} 
        for keyword in TECHNICAL_SHEET_KEYWORDS
    }

    for page_number, page in enumerate(file["document"]):
        for keyword in TECHNICAL_SHEET_KEYWORDS:
            # Use truthiness of the list directly (faster than calling len() > 0)
            if page.search_for(keyword):
                results[keyword]["pages"].append(page_number)
                results[keyword]["pages matched"] += 1
                total_matches += 1

    return {
        "total matches": total_matches,
        "results": results
    }

def citations(file):
    total_matches = 0
    results = {
        citation_type: {"pages": [], "total matches": 0} 
        for citation_type in CITATION_PATTERNS
    }
    
    compiled_patterns = {
        citation_type: re.compile(pattern) 
        for citation_type, pattern in CITATION_PATTERNS.items()
    }

    for page_number, page in enumerate(file["document"]):
        page_text = page.get_text()
        
        for citation_type, pattern in compiled_patterns.items():
            matches = list(pattern.finditer(page_text))
            match_count = len(matches)
            
            if match_count > 0:
                results[citation_type]["total matches"] += match_count
                total_matches += match_count
                
                if page_number not in results[citation_type]["pages"]:
                    results[citation_type]["pages"].append(page_number)

    return {
        "total matches": total_matches,
        "results": results
    }

def figures_and_tables(file):
    total_matches = 0
    results = {
        caption_type: {"pages": [], "total matches": 0, "caption information": []}
        for caption_type in CAPTION_PATTERNS
    }
    
    compiled_patterns = {k: re.compile(v) for k, v in CAPTION_PATTERNS.items()}

    for page_number, page in enumerate(file["document"]):
        for b in page.get_text("blocks", sort=True):
            text = b[4].strip()
            
            for caption_type, pattern in compiled_patterns.items():
                if pattern.match(text):  # Checks if the text starts with the pattern
                    bbox = tuple(b[:4])

                    if page_number not in results[caption_type]["pages"]:
                        results[caption_type]["pages"].append(page_number)

                    results[caption_type]["caption information"].append({
                        "page number": page_number,
                        "caption": text,
                        "bbox": bbox
                    })
                    
                    results[caption_type]["total matches"] += 1
                    total_matches += 1
                    break  # Stop checking other patterns for this block once matched

    return {
        "total matches": total_matches,
        "results": results
    }
