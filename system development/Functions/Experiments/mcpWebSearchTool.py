from Functions.tool import Tool
from Functions.MCP.client import MCPClient

class MCPWebSearchTool(Tool):

    def __init__(self):
        super().__init__(
            "web_search",
            "Search the web using the DDGS MCP server."
        )

        self.client = MCPClient(
            command="ddgs",
            args=["mcp"]
        )

    def schema(self):
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "The search query to look up on the web."
                        }
                    },
                    "required": ["query"]
                }
            }
        }

    async def execute(self, query):

        async with self.client:

            result = await self.client.call_tool(
                "search_text",
                {
                    "query": query,
                    "max_results": 5
                }
            )

        return result.structuredContent