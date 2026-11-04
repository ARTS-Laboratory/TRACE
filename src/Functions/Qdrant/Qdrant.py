from datetime import UTC, datetime
from importlib.metadata import version

from qdrant_client import QdrantClient, models

from Functions.Model.config import EMBED_MODEL_ID, MAX_TOKENS, QDRANT_URL


class Qdrant:
    def __init__(self):
        self.client = QdrantClient(url=QDRANT_URL)

    def get_collections(self):
        response = self.client.get_collections()
        return [col.name for col in response.collections]

    def delete_collection(self, collection_name):
        collections = self.get_collections()

        if collection_name not in collections:
            return False

        deleted = self.client.delete_collection(collection_name=collection_name)

        return deleted

    def create_collection(self, collection_name, collection_description):
        collection_exists = self.client.collection_exists(
            collection_name=collection_name
        )

        if collection_exists:
            return False

        created = self.client.create_collection(
            collection_name=collection_name,
            vectors_config={
                "dense": models.VectorParams(size=4096, distance=models.Distance.COSINE)
            },
            sparse_vectors_config={
                "bm25": models.SparseVectorParams(
                    modifier=models.Modifier.IDF,
                ),
            },
            metadata={
                "description": collection_description,
                "creation_date": datetime.now(UTC).isoformat(),
                "qdrant_client_version": version("qdrant-client"),
                "embed_model": EMBED_MODEL_ID,
                "max_token": MAX_TOKENS,
            },
        )

        return created

    def upsert_points(self, collection_name, points):
        result = self.client.upsert(
            collection_name=collection_name, points=points, wait=True
        )

        return result

    def search_dense(self, collection_name, query_vector, limit=10):
        if limit < 1:
            raise ValueError("Limit must be at least 1")

        response = self.client.query_points(
            collection_name=collection_name,
            query=query_vector,
            using="dense",
            with_payload=True,
            with_vectors=False,
            limit=limit,
        )

        return response.points

    def search_sparse(
        self, collection_name, query_vector: models.SparseVector, limit=10
    ):
        if limit < 1:
            raise ValueError("Limit must be at least 1")

        response = self.client.query_points(
            collection_name=collection_name,
            query=query_vector,
            using="bm25",
            with_payload=True,
            with_vectors=False,
            limit=limit,
        )

        return response.points

    def close(self):
        self.client.close()


"""import sys
from pathlib import Path

project_src = Path("/home/thienan/Documents/GitHub/Glorp-Cat/src")

if str(project_src) not in sys.path:
    sys.path.insert(0, str(project_src))"""
