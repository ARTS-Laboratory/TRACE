import json
import sqlite3
import time
import uuid
from pathlib import Path

from Functions.Storage.database import DATABASE_PATH


class IngestionJobStore:
    def __init__(self):
        self.database_path = DATABASE_PATH

    def create_job(self, collection_name: str, original_name: str, source_path: Path):
        connection = sqlite3.connect(self.database_path)

        try:
            with connection:
                cursor = connection.cursor()
                job_id = str(uuid.uuid7())

                cursor.execute(
                    """
                    INSERT INTO ingestion_jobs (
                        job_id,
                        collection_name,
                        original_name,
                        source_path,
                        created_at
                    )
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    (
                        job_id,
                        collection_name,
                        original_name,
                        str(source_path),
                        time.time(),
                    ),
                )

        finally:
            connection.close()

        return job_id

    def get_job(self, job_id):
        connection = sqlite3.connect(self.database_path)

        try:
            with connection:
                connection.row_factory = sqlite3.Row
                cursor = connection.cursor()

                cursor.execute(
                    """
                    SELECT *
                    FROM ingestion_jobs
                    WHERE job_id = ?
                    """,
                    (job_id,),
                )

                row = cursor.fetchone()
                if row is not None:
                    return dict(row)

                return None
        finally:
            connection.close()

    def claim_next_job(self):
        connection = sqlite3.connect(self.database_path)

        try:
            with connection:
                connection.row_factory = sqlite3.Row
                cursor = connection.cursor()

                cursor.execute("BEGIN IMMEDIATE")

                cursor.execute(
                    """
                    SELECT *
                    FROM ingestion_jobs
                    WHERE status = 'queued'
                    ORDER BY id ASC
                    LIMIT 1
                    """
                )

                row = cursor.fetchone()
                if row is None:
                    return None

                job_id = row["job_id"]
                timestamp = time.time()

                cursor.execute(
                    """
                    UPDATE ingestion_jobs
                    SET status = 'running',
                        stage = 'starting',
                        started_at = ?,
                        stage_started_at = ?
                    WHERE job_id = ?
                    """,
                    (timestamp, timestamp, job_id),
                )

                cursor.execute(
                    """
                SELECT *
                FROM ingestion_jobs
                WHERE job_id = ?
                """,
                    (job_id,),
                )

                updated_row = cursor.fetchone()

                return dict(updated_row)

        finally:
            connection.close()

    def update_stage(self, job_id: str, stage: str):
        connection = sqlite3.connect(self.database_path)

        try:
            with connection:
                connection.row_factory = sqlite3.Row
                cursor = connection.cursor()

                cursor.execute("BEGIN IMMEDIATE")

                cursor.execute(
                    """
                SELECT *
                FROM ingestion_jobs
                WHERE job_id = ?
                """,
                    (job_id,),
                )

                row = cursor.fetchone()
                if row is None:
                    raise ValueError("Job is missing or isn't running.")

                status = row["status"]
                queried_stage = row["stage"]

                if status != "running":
                    raise ValueError("Job is not running.")

                if queried_stage == stage:
                    return

                current_time = time.time()
                previous_time = row["stage_started_at"]
                json_timings = json.loads(row["stage_timings_json"])

                elapsed = current_time - previous_time
                json_timings[queried_stage] = (
                    json_timings.get(queried_stage, 0.0) + elapsed
                )

                json_string = json.dumps(json_timings)

                cursor.execute(
                    """
                    UPDATE ingestion_jobs
                    SET stage = ?,
                        stage_started_at = ?,
                        stage_timings_json = ?
                    WHERE job_id = ?
                    """,
                    (stage, current_time, json_string, job_id),
                )

        finally:
            connection.close()

    def complete_job(self, job_id: str, result: dict):
        connection = sqlite3.connect(self.database_path)

        try:
            with connection:
                connection.row_factory = sqlite3.Row
                cursor = connection.cursor()

                cursor.execute("BEGIN IMMEDIATE")

                cursor.execute(
                    """
                SELECT *
                FROM ingestion_jobs
                WHERE job_id = ?
                """,
                    (job_id,),
                )

                row = cursor.fetchone()
                if row is None:
                    return None

                job_id = row["job_id"]
                timestamp = time.time()

        finally:
            connection.close()
