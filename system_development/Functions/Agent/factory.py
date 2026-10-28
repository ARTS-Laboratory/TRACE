from Functions.Model.config import SYSTEM_PROMPT
from Functions.Agent.agent import Agent
from Functions.Agent.conversations import Conversation
from Functions.Agent.toolManager import ToolManager
from Functions.MCP.manager import MCPManager
from Functions.Model.manager import ModelManager
from Functions.Media.inspector import MediaInspector
from Functions.ChromaDB.ChromaDB import ChromaDB

class Runtime:
    def __init__(
        self,
        tool_manager,
        mcp_manager,
        model_manager,
        media_inspector,
        chroma_db
    ):
        self.tool_manager = tool_manager
        self.mcp_manager = mcp_manager
        self.model_manager = model_manager
        self.media_inspector = media_inspector
        self.chroma_db = chroma_db

    async def shutdown(self):
        await self.mcp_manager.shutdown()


async def create_runtime():
    tool_manager = ToolManager()
    mcp_manager = MCPManager()
    model_manager = ModelManager()
    media_inspector = MediaInspector()
    chroma_db = ChromaDB()

    await model_manager.load()

    await mcp_manager.add_server(
        "ddgs",
        command="ddgs",
        args=["mcp"]
    )

    await mcp_manager.add_server(
        "sequential_thinking",
        command="npx",
        args=[
            "-y",
            "@modelcontextprotocol/server-sequential-thinking"
        ]
    )

    for tool in await mcp_manager.discover_tools():
        tool_manager.register(tool)

    return Runtime(
        tool_manager=tool_manager,
        mcp_manager=mcp_manager,
        model_manager=model_manager,
        media_inspector=media_inspector,
        chroma_db=chroma_db
    )


def create_agent(runtime, messages=None, conversation_id=None):
    conversation = Conversation(
        SYSTEM_PROMPT
    )

    if messages:
        for message in messages:
            if message["role"] == "user":
                conversation.add_user(
                    message["content"],
                    message.get("attachments", [])
                )

            elif message["role"] == "assistant":
                conversation.add_assistant(
                    message.get("thinking") or "",
                    message["content"],
                    []
                )

    agent_tool_manager = ToolManager()

    agent_tool_manager.tools = runtime.tool_manager.tools.copy()

    return Agent(
        tool_manager=agent_tool_manager,
        conversation=conversation,
        mcp_manager=runtime.mcp_manager,
        model_manager=runtime.model_manager,
        conversation_id=conversation_id
    )