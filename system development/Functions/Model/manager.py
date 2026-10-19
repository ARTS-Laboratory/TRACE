import httpx

from Functions.Model.config import (
    LLAMA_CPP_BASE_URL,
    MODEL_NAME,
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
        self.info.name = MODEL_NAME
        self.info.loaded = False

        try:
            await self._load_llama_cpp()
        except httpx.HTTPError:
            pass

        return

    async def load(self):
        await self.load_static()