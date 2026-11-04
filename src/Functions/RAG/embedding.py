import torch
from fastembed import SparseTextEmbedding
from fastembed.sparse.sparse_embedding_base import SparseEmbedding
from sentence_transformers import SentenceTransformer

from Functions.Model.config import EMBED_MODEL_ID


class Embedding:
    def __init__(self):
        self.dense_model = None
        self.sparse_model = None

    def lazy_load_dense(self):
        if self.dense_model is None:
            self.dense_model = SentenceTransformer(
                model_name_or_path=EMBED_MODEL_ID,
                device="cuda",
                model_kwargs={"torch_dtype": torch.bfloat16},
            )

        return self.dense_model

    def lazy_load_sparse(self):
        if self.sparse_model is None:
            self.sparse_model = SparseTextEmbedding(model_name="Qdrant/bm25")

        return self.sparse_model

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        embedding_model = self.lazy_load_dense()

        embeddings = embedding_model.encode_document(texts, normalize_embeddings=True)

        return embeddings.tolist()

    def embed_sparse_documents(self, texts: list[str]) -> list[SparseEmbedding]:
        embedding_model = self.lazy_load_sparse()

        embeddings = embedding_model.embed(texts)

        return list(embeddings)

    def embed_query(self, query: str) -> list[float]:
        embedding_model = self.lazy_load_dense()

        embedded_query = embedding_model.encode_query(query, normalize_embeddings=True)

        return embedded_query.tolist()

    def embed_sparse_query(self, query: str) -> SparseEmbedding:
        embedding_model = self.lazy_load_sparse()

        embedded_query = embedding_model.query_embed(query=query)

        return next(embedded_query)
