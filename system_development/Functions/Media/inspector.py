from pathlib import Path
import mimetypes
import base64
import httpx

from Functions.Model.config import MEDIA_BASE_URL, MEDIA_MODEL_NAME

timeout = httpx.Timeout(
            connect=10.0,
            read=None,
            write=60.0,
            pool=10.0,
        )

class MediaInspector:
    def __init__(self):
        self.model_name = MEDIA_MODEL_NAME
        self.url = f"{MEDIA_BASE_URL.rstrip("/")}/chat/completions" 

    def _prepare_payload(self, file_path, question):
        file_path = Path(file_path)
        
        with open(file_path, "rb") as file:
            encoded_bytes = base64.b64encode(file.read())
        
        encoded_file = encoded_bytes.decode("utf-8")
        mime, _ = mimetypes.guess_type(file_path)

        if mime is None:
            return {
                "error", "invalid type"
            }

        if "image" in mime:
            data_url = f"data:{mime};base64,{encoded_file}"
            content_payload = {
                "type": "image_url",
                    "image_url": {
                        "url": data_url
                    }
                }
            
        elif "audio" in mime:
            content_payload = {
                    "type": "input_audio",
                    "input_audio": {
                        "data": encoded_file
                    }
                }
            
        return {
            "model": self.model_name,
            "stream": False,
            "messages": [
                {
                "role": "user",
                "content": [ 
                        content_payload,
                        {
                        "type": "text",
                        "text": question
                        }
                    ]
                }
            ],
            "temperature": 0,
            "top_p": 0.95    
        }

    async def inspect_media(self, file_path, question):
        payload = self._prepare_payload(file_path, question)

        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(self.url, json=payload)
            response.raise_for_status()

            event = response.json()
            choice = event["choices"][0]["message"]["content"]
            
        return choice

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