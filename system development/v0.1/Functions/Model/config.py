from pathlib import Path

CHATBOT_NAME = "GlorpCat"
MODEL_NAME = "nemotron-3.5-lightning-fixed:30b"
MODEL_PROVIDER = "llama_cpp"  # Change to "ollama" to use the old backend.

#llama.cpp server settings
LLAMA_CPP_BASE_URL = "http://127.0.0.1:8081/v1"
LLAMA_CPP_AUTO_START = True
LLAMA_CPP_TOOLBOX = "llama-rocm-10.0"
LLAMA_CPP_STARTUP_TIMEOUT_S = 120.0
LLAMA_CPP_MODEL_PATH = (
    "/run/host/usr/share/ollama/.ollama/models/blobs/"
    "sha256-5c19f6282f4fc51cb114cb6c876d70ca2fc3b9cf0fbd0a018d9908f4fe1f63b3"
)
LLAMA_CPP_TEMPLATE_PATH = (
    "/run/host/home/thienan/src/ollama-source/model/renderers/testdata/"
    "nemotron35_chat_template.jinja2"
)

#inspect media settings
VISION_NAME = "gemma4:e2b"

# ChromaDB settings
CHROMADB_PATH = "/home/thienan/Documents/GitHub/PaperParsing/Docling Parsing/v0.2/ChromaDB"
DATA_PATH = Path("/home/thienan/Documents/GitHub/Glorp-Cat/system development/v0.1/Data")
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
