from Functions.tool import Tool
from Functions.Model.config import CHROMADB_PATH
import chromadb

client = chromadb.PersistentClient(path=CHROMADB_PATH)

class GetCollections(Tool):
    def __init__(self):
        super().__init__(
            "get_collections",
            "Returns the names and descriptions of all available knowledge collections in the vector database. Use this tool when you need to search the user's documents but do not know which collection is most relevant to the request. Choose the most appropriate collection based on its description before calling query_collection."
        )

    def schema(self):
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": {
                    "type": "object",
                    "properties": {}
                }
            }
        }

    async def execute(self):
        collections = client.list_collections()

        collectionsFound = []
        for collection in collections:
            name = collection.name
            metadata = collection.metadata or {}

            description = metadata.get("description", "No description provided")

            collectionsFound.append({
                "name" : name,
                "description" : description
            })

        return collectionsFound

