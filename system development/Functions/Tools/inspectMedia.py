from Functions.tool import Tool

class InspectMedia(Tool):
    def __init__(self, conversation_id, conversation_manager, media_inspector):
        super().__init__(
            "inspect_media",
            "Use this tool when the user asks about the contents, meaning, or properties of an attached image, audio file, or supported text file."
            "Inspects an image, audio, or supported text attachment from the current conversation "
            "and answers a question about its contents. Use this tool when you "
            "need to see, read, interpret, or re-examine attached media."
        )

        self.conversation_id = conversation_id
        self.conversation_manager = conversation_manager
        self.media_inspector = media_inspector

    def schema(self):
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": {
                    "type": "object",
                    "properties": {
                        "attachment_id": {
                            "type": "integer",
                            "description": (
                                "ID of the image, audio, or supported text attachment to inspect. "
                                "Use the attachment ID associated with the relevant "
                                "media in the current conversation."
                            )
                        },
                        "question": {
                            "type": "string",
                            "description": (
                                "Specific question to ask about the attachment. "
                                "Ask for the image, audio, or supported text information needed "
                                "to answer the user's request."
                            )
                        }
                    },
                    "required": ["attachment_id", "question"]
                }
            }
        }

    async def execute(self, attachment_id, question):
        attachment = self.conversation_manager.get_attachment(
            self.conversation_id,
            attachment_id
        )
 
        if attachment is None:
            return {
                "error": "no attachment found",
                "attachment_id": attachment_id
            }
        file_path = attachment["file_path"]
        content_type = attachment["content_type"]
        if content_type.startswith("image/"):
            response = await self.media_inspector.inspect_image(file_path, question)

        elif content_type.startswith("audio/"):
            response = await self.media_inspector.inspect_audio(file_path, question)

        elif content_type.startswith("text/"):
            response = await self.media_inspector.inspect_file(file_path, question, content_type)
        else:
            return {
                "error": "invalid file type",
                "content_type": content_type
            }

        return {
            "response": response
        }