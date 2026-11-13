import torch
from transformers import AutoModel

from Functions.Model.config import RERANKER_MODEL


class Reranker:
    def __init__(self):
        self.reranker_model = None

    def lazy_load_reranker(self):
        if self.reranker_model is None:
            self.reranker_model = AutoModel.from_pretrained(
                pretrained_model_name_or_path=RERANKER_MODEL,
                trust_remote_code=True,
                dtype=torch.bfloat16,
            )
            self.reranker_model.to("cuda")
            self.reranker_model.eval()

        return self.reranker_model

    def rerank(self, query: str, results: list[dict], limit: int = 10):
        if limit < 1:
            raise ValueError("Limit must be at least 1")

        if results == []:
            return []

        embedded_text = [result["chunk"]["embedding_text"] for result in results]

        reranker = self.lazy_load_reranker()

        reranked_results = reranker.rerank(query, embedded_text, top_n=limit)

        llm_payload = []
        for reranked_result in reranked_results:
            original = results[reranked_result["index"]]
            llm_payload.append(
                {
                    **original,
                    "rerank_score": float(reranked_result["relevance_score"]),
                }
            )

        return llm_payload
