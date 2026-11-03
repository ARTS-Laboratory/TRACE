import logging

from Functions.Agent.agent import Agent
from Functions.Agent.conversations import Conversation
from Functions.Agent.toolManager import ToolManager
from Functions.ChromaDB.ChromaDB import ChromaDB
from Functions.MCP.manager import MCPManager
from Functions.Media.inspector import MediaInspector
from Functions.Model.config import SYSTEM_PROMPT
from Functions.Model.manager import ModelManager
from Functions.Qdrant.Qdrant import Qdrant

logger = logging.getLogger(__name__)


class Runtime:
    def __init__(
        self,
        tool_manager,
        mcp_manager,
        model_manager,
        media_inspector,
        chroma_db,
        qdrant_db,
    ):
        self.tool_manager = tool_manager
        self.mcp_manager = mcp_manager
        self.model_manager = model_manager
        self.media_inspector = media_inspector
        self.chroma_db = chroma_db
        self.qdrant_db = qdrant_db

    async def shutdown(self):
        try:
            await self.mcp_manager.shutdown()

        finally:
            self.qdrant_db.close()


async def create_runtime():
    tool_manager = ToolManager()
    mcp_manager = MCPManager()
    model_manager = ModelManager()
    media_inspector = MediaInspector()
    chroma_db = ChromaDB()
    qdrant_db = Qdrant()

    try:
        await model_manager.load()

        await mcp_manager.add_server(
            "ddgs",
            command="ddgs",
            args=["mcp"],
        )

        await mcp_manager.add_server(
            "sequential_thinking",
            command="npx",
            args=["-y", "@modelcontextprotocol/server-sequential-thinking"],
        )

        for tool in await mcp_manager.discover_tools():
            tool_manager.register(tool)

        return Runtime(
            tool_manager=tool_manager,
            mcp_manager=mcp_manager,
            model_manager=model_manager,
            media_inspector=media_inspector,
            chroma_db=chroma_db,
            qdrant_db=qdrant_db,
        )

    except BaseException:
        try:
            qdrant_db.close()
        except Exception:
            logger.exception("Failed to close Qdrant during startup cleanup")

        try:
            await mcp_manager.shutdown()
        except Exception:
            logger.exception("Failed to shut down MCP during startup cleanup")

        raise


def create_agent(runtime, messages=None, conversation_id=None):
    conversation = Conversation(SYSTEM_PROMPT)

    if messages:
        for message in messages:
            if message["role"] == "user":
                conversation.add_user(
                    message["content"], message.get("attachments", [])
                )

            elif message["role"] == "assistant":
                conversation.add_assistant(
                    message.get("thinking") or "", message["content"], []
                )

    agent_tool_manager = ToolManager()

    agent_tool_manager.tools = runtime.tool_manager.tools.copy()

    return Agent(
        tool_manager=agent_tool_manager,
        conversation=conversation,
        mcp_manager=runtime.mcp_manager,
        model_manager=runtime.model_manager,
        conversation_id=conversation_id,
    )
