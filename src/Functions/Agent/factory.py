import logging
import sys

from Functions.Agent.agent import Agent
from Functions.Agent.conversations import Conversation
from Functions.Agent.toolManager import ToolManager
from Functions.ChromaDB.ChromaDB import ChromaDB
from Functions.MCP.manager import MCPManager
from Functions.Media.inspector import MediaInspector
from Functions.Model.config import SKILLS_PROMPT, SYSTEM_PROMPT
from Functions.Model.manager import ModelManager
from Functions.Qdrant.Qdrant import Qdrant
from Functions.RAG.embedding import Embedding
from Functions.RAG.reranking import Reranker
from Functions.Tools.getCollections import GetCollections
from Functions.Tools.keywordSearch import KeywordSearch
from Functions.Tools.loadSkill import LoadSkill
from Functions.Tools.readSkillReference import ReadSkillReference
from Functions.Tools.vectorSearch import VectorSearch
from Skills.catalog import format_skill_catalog

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
        embedding,
        reranker,
    ):
        self.tool_manager = tool_manager
        self.mcp_manager = mcp_manager
        self.model_manager = model_manager
        self.media_inspector = media_inspector
        self.chroma_db = chroma_db
        self.qdrant_db = qdrant_db
        self.embedding = embedding
        self.reranker = reranker

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
    embedding = Embedding()
    reranker = Reranker()

    try:
        await model_manager.load()

        await mcp_manager.add_server(
            "ddgs",
            command="ddgs",
            args=["mcp"],
        )

        await mcp_manager.add_server(
            "skill_discovery", command=sys.executable, args=["-m", "Skills.mcp_server"]
        )

        for tool in await mcp_manager.discover_tools():
            tool_manager.register(tool)

        # =========================
        # Tool Registry
        # =========================
        tool_manager.register(GetCollections(qdrant_db=qdrant_db))

        tool_manager.register(
            VectorSearch(
                qdrant_db=qdrant_db,
                embedding=embedding,
                reranker=reranker,
            )
        )

        tool_manager.register(
            KeywordSearch(
                qdrant_db=qdrant_db,
                embedding=embedding,
                reranker=reranker,
            )
        )

        return Runtime(
            tool_manager=tool_manager,
            mcp_manager=mcp_manager,
            model_manager=model_manager,
            media_inspector=media_inspector,
            chroma_db=chroma_db,
            qdrant_db=qdrant_db,
            embedding=embedding,
            reranker=reranker,
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


def create_agent(runtime, messages=None, conversation_id=None, catalog=None):
    if catalog is None:
        raise ValueError("A conversation skill catalog must be supplied.")

    loaded_prompt = build_agent_system_prompt(catalog=catalog)

    conversation = Conversation(loaded_prompt)

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

    # This gives each agent its own catalog and loader instance for skills.
    agent_tool_manager.register(LoadSkill(catalog=catalog))
    agent_tool_manager.register(ReadSkillReference(catalog=catalog))

    return Agent(
        tool_manager=agent_tool_manager,
        conversation=conversation,
        mcp_manager=runtime.mcp_manager,
        model_manager=runtime.model_manager,
        conversation_id=conversation_id,
    )


def build_agent_system_prompt(catalog: dict) -> str:
    catalog_prompt = format_skill_catalog(catalog=catalog)

    loaded_prompt = SYSTEM_PROMPT
    loaded_prompt += "\n\n" + SKILLS_PROMPT + "\n\n" + catalog_prompt

    return loaded_prompt
