from datetime import datetime
from Functions.tool import Tool

class TimeTool(Tool):

    def __init__(self):
        super().__init__(
            "get_time",
            "Returns the current local time."
        )

    def schema(self):
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": {
                    "type": "object",
                    "properties": {}
                }
            }
        }

    async def execute(self):
        return datetime.now().strftime("%I:%M:%S %p %B %d, %Y")