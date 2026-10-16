import ollama
from pathlib import Path

from Functions.Model.config import VISION_NAME
from Functions.Model.config import MODEL_NAME

class MediaInspector:
    def __init__(self):
        self.client = ollama.AsyncClient()
        self.vision_model = VISION_NAME
        self.model = MODEL_NAME

    async def inspect_image(self, file_path, question):
        response = await self.client.chat(
            model=self.vision_model,
            messages=[
                {
                    "role": "user",
                    "content": question,
                    "images": [file_path],
                }
            ],
        )

        return response.message.content

    async def inspect_audio(self, file_path, question):
        response = await self.client.chat(
            model=self.vision_model,
            messages=[
                {
                    "role": "user",
                    "content": question,
                    "images": [file_path],
                }
            ],
        )

        return response.message.content

    async def inspect_file(self, file_path, question, content_type):
        file_path = Path(file_path)

        with open(file_path, "r", encoding="utf-8") as f:
            file_content = f.read()

        content = (
            f"File: {file_path.name}\n\n"
            f"File type: {content_type}\n\n"
            f"[File Contents]\n\n"
            f"{file_content}\n\n"
            f"Question: {question}"
        )

        return content