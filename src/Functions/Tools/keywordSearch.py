import asyncio

from Functions.RAG.retrieval import keyword_search
from Functions.tool import Tool
from Functions.utilities import logger


class KeywordSearch(Tool):
    def __init__(self, qdrant_db, embedding, reranker):
        self.qdrant_db = qdrant_db
        self.embedding = embedding
        self._reranker = reranker
        super().__init__(
            "keyword_search",
            "Searches a document collection using BM25 keyword matching, then reranks "
            "the matching passages for relevance. Returns passages with source metadata "
            "for attribution. Use this tool when specific terms, names, identifiers, "
            "or technical vocabulary are important. If the collection is unknown, "
            "call get_collections first. For conceptual questions or paraphrased ideas, "
            "use vector_search.",
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
                        "collection_name": {
                            "type": "string",
                            "description": (
                                "Name of the document collection. Call get_collections "
                                "to discover available collection names."
                            ),
                        },
                        "query": {
                            "type": "string",
                            "description": "Query for the collection.",
                        },
                    },
                    "required": ["collection_name", "query"],
                },
            },
        }

    async def execute(self, collection_name: str, query: str, limit: int = 10):
        if limit < 1:
            raise ValueError("Limit must be at least 1")

        candidate_limit = max(30, limit)

        results = await asyncio.to_thread(
            keyword_search,
            collection_name=collection_name,
            query=query,
            embedding=self.embedding,
            qdrant_db=self.qdrant_db,
            limit=candidate_limit,
        )

        try:
            selected_results = await asyncio.to_thread(
                self._reranker.rerank,
                query=query,
                results=results,
                limit=limit,
            )
        except Exception:
            logger.exception("Keyword search reranking failed")
            selected_results = results[:limit]

        payload = []
        for result in selected_results:
            chunk = result["chunk"]
            metadata = chunk.get("metadata") or {}

            payload.append(
                {
                    "chunk_id": chunk["chunk_id"],
                    "text": chunk["embedding_text"],
                    "file_name": metadata.get("file_name"),
                    "page_numbers": metadata.get("page_numbers", []),
                    "score": result["score"],
                    "rerank_score": result.get("rerank_score"),
                }
            )

        logger.info("Keyword search payload: %s", payload)
        return payload
