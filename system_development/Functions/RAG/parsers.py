from Functions.RAG.parsing_profiles.apply_parser_settings import addDoclingParserSettings
from Functions.RAG.Router.router import pdf_router
from Functions.utilities import logger

from docling.exceptions import ConversionError

def convert_docling_documents(pdfs):
    router_results = pdf_router(pdfs)
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
                file["conversion status"] = "success"
                file["converted file"] = settings.convert(file_path)
            
            except ConversionError as e:
                logger.error(f"Error converting {file_path.name}: {e}")
                file["conversion status"] = "failed"
                file["conversion error"] = e

            print(file["conversion status"])

    return parser_plans

from Functions.RAG.Router.router import load_documents, filter_pdfs

files = load_documents()
pdfs, non_pdfs = filter_pdfs(files)

bruh = convert_docling_documents(pdfs)

