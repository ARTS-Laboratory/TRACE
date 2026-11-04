from Functions.tool import Tool

class DiscoveredMCPTool(Tool):
    def __init__(self, server, tool_info):
        description = tool_info.description

        if tool_info.name == "sequential_thinking":
            description += (
                "\n\n"
                "Use this tool for:\n"
                "- architecture design\n"
                "- debugging\n"
                "- optimization\n"
                "- long planning tasks\n"
                "- logical reasoning\n"
                "- exploring alternatives\n"
            )

        super().__init__(
            tool_info.name,
            description
        )

        self.server = server
        self.tool_info = tool_info

    def schema(self):
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.tool_info.inputSchema
            }
        }

    async def execute(self, **kwargs):
        result = await self.server.call_tool(
            self.name,
            kwargs
        )

        return result.structuredContent