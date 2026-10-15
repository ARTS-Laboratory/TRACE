import httpx
import ollama

from Functions.Model.config import (
    LLAMA_CPP_BASE_URL,
    MODEL_NAME,
    MODEL_PROVIDER,
)
from Functions.Model.info import ModelInfo


class ModelManager:
    def __init__(self):
        self.info = ModelInfo()

    async def _load_llama_cpp(self):
        url = f"{LLAMA_CPP_BASE_URL.rstrip('/')}/models"

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            response.raise_for_status()

        models = response.json().get("data", [])

        model = next(
            (item for item in models if item.get("id") == MODEL_NAME),
            None,
        )

        if model is None:
            raise RuntimeError(
                f"llama.cpp did not report the configured model {MODEL_NAME!r}."
            )

        meta = model.get("meta", {})

        self.info.name = model["id"]
        self.info.parameters = (
            f"{meta['n_params'] / 1_000_000_000:.1f}B"
            if meta.get("n_params")
            else ""
        )
        self.info.quantization = meta.get("ftype", "")
        self.info.family = meta.get("architecture", "")
        self.info.context_length = meta.get("n_ctx", 0)
        self.info.size = meta.get("size", 0)
        self.info.license = ""
        self.info.loaded = True
        self.info.vram_gb = 0.0
        self.info.expires_at = ""

    async def load_static(self):
        if MODEL_PROVIDER == "llama_cpp":
            self.info.name = MODEL_NAME
            self.info.loaded = False

            try:
                await self._load_llama_cpp()
            except httpx.HTTPError:
                pass

            return

        model_info = ollama.show(MODEL_NAME)
        details = model_info.details

        self.info.name = MODEL_NAME
        self.info.parameters = details.parameter_size
        self.info.quantization = details.quantization_level
        self.info.family = details.family
        self.info.license = model_info.license

    async def load_active(self):
        if MODEL_PROVIDER == "llama_cpp":
            await self._load_llama_cpp()
            return

        running_info = ollama.ps()

        model = next(
            (model for model in running_info.models if model.name == MODEL_NAME),
            None,
        )

        if model is None:
            self.info.loaded = False
            return

        self.info.loaded = True
        self.info.context_length = model.context_length
        self.info.vram_gb = model.size_vram / (1024 ** 3)
        self.info.expires_at = model.expires_at

    async def load(self):
        await self.load_static()

        if MODEL_PROVIDER != "llama_cpp":
            await self.load_active()