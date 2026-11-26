from Functions.tool import Tool


class DiscoveredMCPTool(Tool):
    def __init__(self, server, tool_info):
        description = tool_info.description

        super().__init__(tool_info.name, description)

        self.server = server
        self.tool_info = tool_info

    def schema(self):
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.tool_info.inputSchema,
            },
        }

    async def execute(self, **kwargs):
        result = await self.server.call_tool(self.name, kwargs)

        content = [
            block.model_dump(mode="json", exclude_none=True) for block in result.content
        ]

        if result.isError:
            return {
                "error": "MCP tool execution failed.",
                "content": content,
            }

        if result.structuredContent is not None:
            return result.structuredContent

        return {"content": content}
