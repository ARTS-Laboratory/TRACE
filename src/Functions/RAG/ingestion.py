import uuid
from itertools import batched

from fastembed.sparse.sparse_embedding_base import SparseEmbedding
from qdrant_client import models

from Functions.Model.config import MY_APP_NAMESPACE
from Functions.Qdrant.Qdrant import Qdrant
from Functions.RAG.embedding import Embedding


def generate_point_id(chunk_id: str) -> str:
    point_id = uuid.uuid5(MY_APP_NAMESPACE, chunk_id)

    return str(point_id)


def build_point(
    chunk: dict, dense_vector: list[float], sparse_vector: SparseEmbedding
) -> models.PointStruct:
    point_id = generate_point_id(chunk_id=chunk["chunk_id"])

    vector = {}

    vector["dense"] = dense_vector
    vector["bm25"] = models.SparseVector(
        indices=sparse_vector.indices.tolist(), values=sparse_vector.values.tolist()
    )

    return models.PointStruct(id=point_id, vector=vector, payload=chunk)


def ingest(
    collection_name: str,
    chunks: list[dict],
    embedding: Embedding,
    qdrant_db: Qdrant,
    batch_size: int = 8,
):
    if batch_size < 1:
        raise ValueError("batch_size must be at least 1")

    results = []
    for chunk_batch in batched(chunks, batch_size):
        embedding_text = [chunk["embedding_text"] for chunk in chunk_batch]

        dense_vector = embedding.embed_documents(texts=embedding_text)
        sparse_vector = embedding.embed_sparse_documents(texts=embedding_text)

        built_points = []
        for chunk, dense, sparse in zip(
            chunk_batch, dense_vector, sparse_vector, strict=True
        ):
            built_points.append(
                build_point(chunk=chunk, dense_vector=dense, sparse_vector=sparse)
            )

        results.append(
            qdrant_db.upsert_points(
                collection_name=collection_name, points=built_points
            )
        )

    return results
