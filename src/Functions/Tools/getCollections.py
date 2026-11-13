import asyncio

from Functions.tool import Tool


class GetCollections(Tool):
    def __init__(self, qdrant_db):
        self.qdrant_db = qdrant_db
        super().__init__(
            "get_collections",
            "Returns the names and descriptions of available document collections. "
            "Use this to choose a collection before calling vector_search "
            "for semantic matching or keyword_search for BM25 keyword matching.",
        )

    def schema(self):
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": {"type": "object", "properties": {}},
            },
        }

    def _get_collections(self):
        collections = self.qdrant_db.get_collections()

        collectionsFound = []
        for collection in collections:
            name = collection
            collection_info = self.qdrant_db.get_collection(collection_name=name)
            metadata = collection_info.config.metadata or {}
            description = metadata.get("description", "No description provided")

            collectionsFound.append({"name": name, "description": description})

        return collectionsFound

    async def execute(self):
        return await asyncio.to_thread(self._get_collections)
