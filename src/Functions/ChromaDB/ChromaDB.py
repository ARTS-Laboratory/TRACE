import chromadb
import os

from Functions.Model.config import CHROMADB_PATH

class ChromaDB:
    def __init__(self):
        self.client = chromadb.PersistentClient(path=str(CHROMADB_PATH))

    def get_collections(self):
        collections = self.client.list_collections()
        return [col.name for col in collections]

    def delete_collection(self, collection_name):
        collections = self.get_collections()

        if collection_name not in collections:
            return False

        self.client.delete_collection(name=collection_name)
        return True

    def create_collection(self, collection_name, collection_description):

        collections = self.get_collections()

        if collection_name in collections:
            return False

        self.client.create_collection(
            name=collection_name,
            metadata={
                "description": collection_description,
                "hnsw:space": "cosine"
            },
            configuration={
                "hnsw": {
                    "space": "cosine",
                    "ef_construction": 200,
                    "ef_search": 100,
                    "max_neighbors": 32,
                    "num_threads": os.cpu_count(),
                    "batch_size": 100,
                    "sync_threshold": 1000,
                    "resize_factor": 1.2,
                }
            }
        )

        return True