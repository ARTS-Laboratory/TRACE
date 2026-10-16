from Functions.Model.config import MODEL_NAME, MODEL_PROVIDER


def create_chat_provider():
    if MODEL_PROVIDER == "ollama":
        from Functions.Model.providers.ollama import OllamaProvider

        return OllamaProvider(MODEL_NAME)

    if MODEL_PROVIDER == "llama_cpp":
        from Functions.Model.providers.llama_cpp import LlamaCppProvider

        return LlamaCppProvider(MODEL_NAME)

    raise ValueError(
        f"Unsupported MODEL_PROVIDER: {MODEL_PROVIDER!r}. "
        'Use "llama_cpp" or "ollama".'
    )