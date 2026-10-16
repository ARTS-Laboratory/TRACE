from Functions.MCP.tool import DiscoveredMCPTool
from contextlib import AsyncExitStack
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import asyncio

class MCPServer:
    def __init__(self, name, command, args):
        self.server_params = StdioServerParameters(
            command=command,
            args=args
        )
        # Initialize the stack to track all async context managers
        self.exit_stack = AsyncExitStack()
        self.session = None
        self._cleanup_lock = asyncio.Lock()
        self.name = name    

    async def connect(self):
        if self.session is not None:
            return

        try:
            # 1. Start the stdio transport client and track its lifecycle
            read_stream, write_stream = await self.exit_stack.enter_async_context(
                stdio_client(self.server_params)
            )
            
            # 2. Bind the MCP protocol session to the transport streams
            self.session = await self.exit_stack.enter_async_context(
                ClientSession(read_stream, write_stream)
            )
            
            # 3. Perform the official MCP capability handshake
            await self.session.initialize()
            print("Successfully connected to MCP Server!")
        except Exception as e:
            await self.disconnect()
            raise e

    async def disconnect(self):
        async with self._cleanup_lock:

            print(f"Closing MCP server: {self.name}")

            if self.session is None:
                return

            await self.exit_stack.aclose()

            self.session = None
            self.exit_stack = AsyncExitStack()

    async def call_tool(self, name, arguments):
        if self.session is None:
            raise RuntimeError("Server is not connected.")

        return await self.session.call_tool(
            name,
            arguments
        )

    async def discover_tools(self):
        discovered = []
        tools = await self.session.list_tools()

        for tool in tools.tools:
            discovered.append(
                DiscoveredMCPTool(
                    self,
                    tool
                )
            )
        return discovered
