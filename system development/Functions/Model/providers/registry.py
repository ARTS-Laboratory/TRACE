from Functions.Model.config import MODEL_NAME


def create_chat_provider():
    from Functions.Model.providers.llama_cpp import LlamaCppProvider

    return LlamaCppProvider(MODEL_NAME)