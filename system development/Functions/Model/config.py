import os
from pathlib import Path

ModelDirectory = Path(__file__).parent
FunctionsDirectory = ModelDirectory.parent
SystemDevelopmentDirectory = FunctionsDirectory.parent
GlorpCatDirectory = SystemDevelopmentDirectory.parent
GitHubDirectory = GlorpCatDirectory.parent

CHATBOT_NAME = "GlorpCat"
MODEL_NAME = os.getenv("GLORPCAT_MODEL_ALIAS") or "nemotron-3.5-lightning-fixed:30b"

#llama.cpp server settings
LLAMA_CPP_BASE_URL = os.getenv("GLORPCAT_LLAMA_CPP_URL") or "http://127.0.0.1:8081/v1"
LLAMA_CPP_AUTO_START = os.getenv("GLORPCAT_LLAMA_CPP_AUTO_START", "true").lower() == "true"
LLAMA_CPP_TOOLBOX = "llama-rocm-10.0"
LLAMA_CPP_STARTUP_TIMEOUT_S = 120.0
LLAMA_CPP_MODEL_PATH = (GlorpCatDirectory / "models" /( os.getenv("GLORPCAT_MODEL_FILE") or "nemotron/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-Q4_0.gguf")) 

#inspect media settings
MEDIA_BASE_URL = os.getenv("GLORPCAT_MEDIA_URL") or "http://127.0.0.1:8082/v1"
MEDIA_MODEL_NAME = os.getenv("GLORPCAT_MEDIA_ALIAS") or "gemma-4-E2B-it-UD-Q8_K_XL"

# ChromaDB settings
CHROMADB_PATH = Path(os.getenv("GLORPCAT_CHROMADB_DIR") or GitHubDirectory / "PaperParsing/Docling Parsing/v0.2/ChromaDB")
DATA_PATH = Path(os.getenv("GLORPCAT_DATA_DIR") or SystemDevelopmentDirectory / "Data")
RERANKER_MODEL = "BAAI/bge-reranker-base"

STREAM = True
THINKING = True
CONTEXT_WINDOW = 16384
DEFAULT_LOCATION = "Columbia, South Carolina, United States"

SYSTEM_PROMPT = (
    f"You are {CHATBOT_NAME}. You are a helpful assistant. Have fun! :)"
    f"You have access to a vector database containing documents, handbooks, "
    f"notes, manuals, and other user-provided knowledge."
    f"When a question could reasonably be answered from these documents—even "
    f"if you have general knowledge about the topic—prefer retrieving the "
    f"relevant information first."
    f"If you do not know which collection is appropriate, call "
    f"`get_collections` before using `query_collection`."
    f"The 'handbook' database contains a 'arts_lab_graduate_handbook', that "
    f"contains information relating to graduate studies, conferences, paper "
    f"style guides and more."
)
