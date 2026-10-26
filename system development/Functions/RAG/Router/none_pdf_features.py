import zipfile
from pathlib import Path
from bs4 import BeautifulSoup
 

def general_features(file):
    file_path = Path(file["file_path"])
    
    # 1. Extract suffix and clean file extension
    suffix = file_path.suffix.lower()
    file_extension = suffix.lstrip(".")
    
    # 2. Clean key-value lookup map for the office suite media folders
    media_folders = {
        ".docx": "word/media/",
        ".pptx": "ppt/media/",
        ".xlsx": "xl/media/"
    }
    
    media_folder = media_folders.get(suffix)
    
    # 3. Handle Microsoft Office files
    if media_folder:
        with zipfile.ZipFile(file_path, "r") as microsoftSuiteFile:
            media_files = [f for f in microsoftSuiteFile.namelist() if f.startswith(media_folder)]
                        
        return{
            "file_path": file_path,
            "file_type": file_extension,
            "total media count": len(media_files)
        }

    # 4. Handle HTML, XHTML, and XML files
    elif file_extension in ["html", "htm", "xhtml", "xml"]:
        content = file_path.read_text(encoding="utf-8", errors="ignore")

        if file_extension in ["html", "htm"]:
            parsedContent = BeautifulSoup(content, "html.parser")
            media_count = len(parsedContent.find_all("img"))
        else:
            parsedContent = BeautifulSoup(content, "xml")
            media_count = len(parsedContent.find_all(["img", "image"]))

        return{
            "file_path": file_path,
            "file_type": file_extension,
            "total media count": media_count
        }

    # 5. Fallback for all other file types
    else:
        return{
            "file_path": file_path,
            "file_type": file_extension,
        }
        

