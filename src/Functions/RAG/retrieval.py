from qdrant_client import models
from qdrant_client.models import ScoredPoint

from Functions.Qdrant.Qdrant import Qdrant
from Functions.RAG.embedding import Embedding


def vector_search(
    collection_name: str,
    query: str,
    embedding: Embedding,
    qdrant_db: Qdrant,
    limit: int = 10,
):
    if not query.strip():
        raise ValueError("Query must not be blank")

    if limit < 1:
        raise ValueError("Limit must be at least 1")

    query_vector = embedding.embed_query(query=query)

    search_results = qdrant_db.search_dense(
        collection_name=collection_name, query_vector=query_vector, limit=limit
    )

    return [format_search_result(hit) for hit in search_results]


def keyword_search(
    collection_name: str,
    query: str,
    embedding: Embedding,
    qdrant_db: Qdrant,
    limit: int = 10,
):
    if not query.strip():
        raise ValueError("Query must not be blank")

    if limit < 1:
        raise ValueError("Limit must be at least 1")

    sparse_embedding = embedding.embed_sparse_query(query=query)

    query_vector = models.SparseVector(
        indices=sparse_embedding.indices.tolist(),
        values=sparse_embedding.values.tolist(),
    )

    search_results = qdrant_db.search_sparse(
        collection_name=collection_name, query_vector=query_vector, limit=limit
    )

    return [format_search_result(hit) for hit in search_results]


def format_search_result(hit: ScoredPoint):
    return {"point_id": str(hit.id), "score": hit.score, "chunk": hit.payload}
