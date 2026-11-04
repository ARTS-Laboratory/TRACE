class Conversation:
    def __init__(self, system_prompt):
        self.system_prompt = system_prompt
        self.reset()

    def add_user(self, content, attachments=None):
        compact_attachment = []

        if attachments:
            for attachment in attachments:
                attachment_id = attachment["id"]
                original_name = attachment["original_name"]
                content_type = attachment["content_type"]

                compact_attachment.append({
                    "attachment_id": attachment_id,
                    "original_name": original_name,
                    "content_type": content_type
                })

        self.messages.append({
            "role": "user",
            "content": content,
            "attachments": compact_attachment
        })

    def get_model_messages(self):
        model_messages = []

        for message in self.messages:
            if message["role"] != "user":
                model_messages.append(message)
                continue

            if not message["attachments"]:
                model_messages.append(message)
                continue

            if message["attachments"]:
                compact_attachment = [
                        f"attachment_id: {att.get("attachment_id")}\n" 
                        f"original_name: {att.get("original_name")}\n" 
                        f"content_type: {att.get("content_type")}" 
                    for att in message.get("attachments", [])
                    ]

                attachment_info = f"[Attachment Info]\n{"\n\n".join(compact_attachment)}"

                message = ({
                    "role": "user",
                    "content": message["content"] + "\n\n" + attachment_info
                })

                model_messages.append(message)

        return model_messages

    def add_assistant(self, thinking, content, tool_calls):

        self.messages.append({
            "role": "assistant",
            "thinking": thinking,
            "content": content,
            "tool_calls": tool_calls
        })

    def add_tool(self, name, content):

        self.messages.append({
            "role": "tool",
            "name": name,
            "content": content
        })

    def add_tool_messages(self, tool_messages):
        self.messages.extend(tool_messages)

    def reset(self):
        self.messages = [
            {
                "role": "system",
                "content": self.system_prompt
            }
        ]

    def history(self):
        return self.messages