import threading
from pathlib import Path

from Functions.Qdrant.Qdrant import Qdrant
from Functions.RAG.embedding import Embedding
from Functions.RAG.job_store import IngestionJobStore
from Functions.RAG.RAG_api import ingest_document
from Functions.utilities import logger


class IngestionWorker:
    def __init__(
        self, store: IngestionJobStore, embedding: Embedding, qdrant_db: Qdrant
    ):
        self.store = store
        self.embedding = embedding
        self.qdrant_db = qdrant_db
        self.stop_event = threading.Event()
        self.thread = None

    def process_one_job(self) -> bool:
        job = self.store.claim_next_job()
        if job is None:
            return False

        def on_stage(stage: str):
            self.store.update_stage(job_id=job["job_id"], stage=stage)

        try:
            result = ingest_document(
                source_path=Path(job["source_path"]),
                collection_name=job["collection_name"],
                embedding=self.embedding,
                qdrant_db=self.qdrant_db,
                on_stage=on_stage,
            )

            if result["status"] == "success":
                self.store.complete_job(job_id=job["job_id"], result=result)
            else:
                raise RuntimeError("status isn't success")

        except Exception as error:  # noqa: BLE001
            logger.exception(f"Job failed because {error}")
            self.store.fail_job(job_id=job["job_id"], error=str(error))

        return True

    def run(self):
        while not self.stop_event.is_set():
            try:
                processed = self.process_one_job()
            except Exception:  # noqa: BLE001
                logger.exception("Ingestion worker could not process a job")
                self.stop_event.wait(1)
                continue

            if not processed:
                self.stop_event.wait(1)

    def start(self):
        if self.thread is not None and self.thread.is_alive():
            return

        self.stop_event.clear()

        self.thread = threading.Thread(
            target=self.run,
            name="ingestion-worker",
            daemon=False,
        )
        self.thread.start()

    def stop(self):
        self.stop_event.set()

        if self.thread is not None:
            self.thread.join()

        self.thread = None
