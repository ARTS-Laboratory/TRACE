from Functions.tool import Tool
from Functions.Model.config import CHROMADB_PATH, RERANKER_MODEL

import chromadb
from sentence_transformers import CrossEncoder
from chromadb.errors import NotFoundError


model = CrossEncoder(RERANKER_MODEL, device="cpu")


class QueryCollection(Tool):
    def __init__(self):
        super().__init__(
            "query_collection",
            "Searches a specific ChromaDB knowledge collection for information "
            "relevant to a user's request and returns the highest-ranked passages "
            "with their metadata. Use this tool when the answer is likely to be "
            "contained in the user's stored documents. If the appropriate collection "
            "is unknown, first call get_collections to discover available collections "
            "and select the most relevant one. If you feel like you don't immediately "
            "have the answer try querying a database."
        )

        self.client = chromadb.PersistentClient(path=CHROMADB_PATH)

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
                                "Name of a ChromaDB collection. Unless told otherwise, "
                                "call get_collections tool to get names of collections."
                            )
                        },
                        "query": {
                            "type": "string",
                            "description": "Query for the collection within database."
                        }
                    },
                    "required": ["collection_name", "query"]
                }
            }
        }

    def _get_collection(self, collection_name):
        try:
            return self.client.get_collection(name=collection_name)

        except NotFoundError:
            return None

    def _rerank(self, query, documents, metadatas):
        pairs = [
            [query, document]
            for document in documents
        ]

        scores = model.predict(pairs)

        scored_documents = [
            {
                "text": document,
                "metadata": metadata,
                "score": float(score)
            }
            for document, metadata, score in zip(
                documents,
                metadatas,
                scores
            )
        ]

        return sorted(
            scored_documents,
            key=lambda x: x["score"],
            reverse=True
        )[:10]

    async def execute(self, collection_name, query):
        collection = self._get_collection(collection_name)

        if collection is None:
            return {
                "error": "collection_not_found",
                "collection_name": collection_name
            }

        results = collection.query(
            query_texts=[query],
            n_results=10
        )

        documents = results["documents"][0]
        metadatas = results["metadatas"][0] or [{}] * len(documents)

        try:
            reranked_results = self._rerank(
                query,
                documents,
                metadatas
            )

        except Exception as e:
            print(f"[QueryCollection] Reranking failed: {e}")

            # Fall back to Chroma ordering
            reranked_results = [
                {
                    "text": text,
                    "metadata": metadata,
                    "score": None,
                }
                for text, metadata in zip(
                    documents,
                    metadatas
                )
            ][:5]

        llm_payload = {
            "query": query,
            "total_returned": len(reranked_results),
            "results": [
                {
                    "rank": rank,
                    "score": item["score"],
                    "text": item["text"],
                    "metadata": item["metadata"]
                }
                for rank, item in enumerate(
                    reranked_results,
                    start=1
                )
            ]
        }

        return llm_payload