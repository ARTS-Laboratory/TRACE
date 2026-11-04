from Functions.MCP.server import MCPServer

class MCPManager:
    def __init__(self):
        self.servers = {}

    async def add_server(
        self,
        name,
        command,
        args
    ):
        server = MCPServer(
            name=name,
            command=command,
            args=args
        )

        await server.connect()
        self.servers[name] = server

    async def discover_tools(self):
        tools = []

        for server in self.servers.values():
            tools.extend(
                await server.discover_tools()
            )

        return tools

    async def shutdown(self):
        for server in reversed(list(self.servers.values())):
            await server.disconnect()