import json
import sqlite3
from pathlib import Path

from Functions.Model.config import DATA_PATH

DATABASE_PATH = DATA_PATH / "glorp_cat.db"


class Database:
    def __init__(self, database_path: Path = DATABASE_PATH):
        database_path.parent.mkdir(parents=True, exist_ok=True)

        self.connection = sqlite3.connect(database_path)
        self.connection.execute("PRAGMA foreign_keys = ON")
        self.connection.row_factory = sqlite3.Row

        self.create_tables()
        self.migrate_execution_events()

    def create_conversation(self, title="New chat"):
        cursor = self.connection.cursor()

        cursor.execute(
            """
            INSERT INTO conversations (title)
            VALUES (?)
            """,
            (title,),
        )

        self.connection.commit()

        return cursor.lastrowid

    def get_conversations(self):
        cursor = self.connection.cursor()

        cursor.execute("""
            SELECT *
            FROM conversations
            ORDER BY updated_at DESC
        """)

        return [dict(row) for row in cursor.fetchall()]

    def get_conversation(self, conversation_id):
        cursor = self.connection.cursor()

        cursor.execute(
            """
            SELECT *
            FROM conversations
            WHERE id = ?
            """,
            (conversation_id,),
        )

        conversation = cursor.fetchone()

        if conversation is None:
            return None

        cursor.execute(
            """
            SELECT *
            FROM messages
            WHERE conversation_id = ?
            ORDER BY id ASC
            """,
            (conversation_id,),
        )

        messages = [dict(row) for row in cursor.fetchall()]

        for message in messages:
            attachments = self.get_attachments_for_message(message["id"])

            message["attachments"] = attachments

            if message["role"] == "assistant":
                message["blocks"] = self.get_response_blocks(message["id"])

        result = dict(conversation)
        result["messages"] = messages
        result["execution_events"] = self.get_execution_events(conversation_id)

        return result

    def add_message(self, conversation_id, role, content, thinking=None):
        cursor = self.connection.cursor()

        cursor.execute(
            """
            INSERT INTO messages (
                conversation_id,
                role,
                content,
                thinking
            )
            VALUES (?, ?, ?, ?)
            """,
            (conversation_id, role, content, thinking),
        )

        cursor.execute(
            """
            UPDATE conversations
            SET updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (conversation_id,),
        )

        self.connection.commit()

        return cursor.lastrowid

    def add_attachment(
        self,
        conversation_id,
        message_id,
        original_name,
        file_path,
        content_type,
        size,
    ):
        cursor = self.connection.cursor()

        cursor.execute(
            """
            INSERT INTO attachments (
                conversation_id,
                message_id,
                original_name,
                file_path,
                content_type,
                size
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                conversation_id,
                message_id,
                original_name,
                str(file_path),
                content_type,
                size,
            ),
        )

        attachment_id = cursor.lastrowid

        cursor.execute(
            """
            UPDATE conversations
            SET updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (conversation_id,),
        )

        self.connection.commit()

        return attachment_id

    def get_attachment(self, attachment_id):
        cursor = self.connection.cursor()

        cursor.execute(
            """
            SELECT *
            FROM attachments
            WHERE id = ?
            """,
            (attachment_id,),
        )

        row = cursor.fetchone()

        if row is None:
            return None

        attachment_info = dict(row)

        return attachment_info

    def get_attachments_for_message(self, message_id):
        cursor = self.connection.cursor()

        cursor.execute(
            """
            SELECT *
            FROM attachments
            WHERE message_id = ?
            """,
            (message_id,),
        )

        attachments = [dict(row) for row in cursor.fetchall()]

        return attachments

    def delete_conversation(self, conversation_id):
        cursor = self.connection.cursor()

        cursor.execute(
            """
            DELETE FROM conversations
            WHERE id = ?
            """,
            (conversation_id,),
        )

        self.connection.commit()

        return cursor.rowcount > 0

    def update_conversation_title(self, conversation_id, title):
        cursor = self.connection.cursor()

        cursor.execute(
            """
            UPDATE conversations
            SET title = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (title, conversation_id),
        )

        self.connection.commit()

    def update_message(self, message_id, content, thinking=None):
        cursor = self.connection.cursor()

        cursor.execute(
            """
            UPDATE messages
            SET content = ?,
                thinking = ?
            WHERE id = ?
            """,
            (content, thinking, message_id),
        )

        self.connection.commit()

    def add_execution_event(self, event):
        cursor = self.connection.cursor()

        try:
            event_id = self._insert_execution_event(cursor=cursor, event=event)

            self.connection.commit()
        except Exception:
            self.connection.rollback()
            raise

        return event_id

    def get_execution_events(self, conversation_id):
        cursor = self.connection.cursor()

        cursor.execute(
            """
            SELECT *
            FROM conversations
            WHERE id = ?
            """,
            (conversation_id,),
        )

        conversation = cursor.fetchone()

        if conversation is None:
            return None

        cursor.execute(
            """
            SELECT *
            FROM execution_events
            WHERE conversation_id = ?
            ORDER BY id ASC
            """,
            (conversation_id,),
        )

        executions = [dict(row) for row in cursor.fetchall()]

        for execution in executions:
            data = json.loads(execution["data_json"])

            execution["data"] = data

        return executions

    def add_response_block(
        self, assistant_message_id, block_type, content=None, visual_id=None
    ):
        cursor = self.connection.cursor()

        cursor.execute(
            """
            INSERT INTO response_blocks (
                assistant_message_id,
                type,
                content,
                visual_id
            )
            VALUES (?, ?, ?, ?)
            """,
            (assistant_message_id, block_type, content, visual_id),
        )

        self.connection.commit()

        return cursor.lastrowid

    def get_response_blocks(self, assistant_message_id):
        cursor = self.connection.cursor()

        cursor.execute(
            """
            SELECT *
            FROM response_blocks
            WHERE assistant_message_id = ?
            ORDER BY id ASC
            """,
            (assistant_message_id,),
        )

        response_blocks = [dict(row) for row in cursor.fetchall()]

        return response_blocks

    def update_response_block(self, block_id, content):
        cursor = self.connection.cursor()

        cursor.execute(
            """
            UPDATE response_blocks
            SET content = ?
            WHERE id = ?
            """,
            (content, block_id),
        )

        self.connection.commit()

    def add_visual_block(self, assistant_message_id, spec):
        cursor = self.connection.cursor()

        spec_json = json.dumps(spec)
        try:
            cursor.execute(
                """
            INSERT INTO visuals (
                assistant_message_id,
                spec_json
            )
            VALUES (?, ?)
            """,
                (assistant_message_id, spec_json),
            )

            visual_id = cursor.lastrowid

            cursor.execute(
                """
            INSERT INTO response_blocks (
                assistant_message_id,
                type,
                visual_id
            )
            VALUES (?, ?, ?)
            """,
                (assistant_message_id, "visual", visual_id),
            )

            block_id = cursor.lastrowid
            self.connection.commit()

        except Exception:
            self.connection.rollback()
            raise

        return {"visual_id": visual_id, "block_id": block_id}

    def get_visual(self, visual_id):
        cursor = self.connection.cursor()

        cursor.execute(
            """
            SELECT *
            FROM visuals
            WHERE id = ?
            """,
            (visual_id,),
        )

        row = cursor.fetchone()

        if row is None:
            return None

        visual = dict(row)

        visual["spec"] = json.loads(visual["spec_json"])

        return visual

    def get_visual_state(self, visual_id):
        cursor = self.connection.cursor()

        cursor.execute(
            """
            SELECT state_json
            FROM visual_state
            WHERE visual_id = ?
            """,
            (visual_id,),
        )

        row = cursor.fetchone()

        if row is None:
            return {}

        state_json = json.loads(row["state_json"])

        return state_json

    def save_visual_state(self, visual_id, state):
        state_json = json.dumps(state)
        cursor = self.connection.cursor()

        try:
            cursor.execute(
                """
                INSERT INTO visual_state (visual_id, state_json)
                VALUES (?, ?)
                ON CONFLICT(visual_id) DO UPDATE SET
                    state_json = excluded.state_json,
                    updated_at = CURRENT_TIMESTAMP
                """,
                (visual_id, state_json),
            )
            self.connection.commit()
        except Exception:
            self.connection.rollback()
            raise

    def get_conversation_skills(self, conversation_id: int) -> list[dict]:
        cursor = self.connection.cursor()

        cursor.execute(
            """
            SELECT
                sp.id,
                sp.name,
                sp.description,
                sp.source,
                sp.content_hash,
                sp.package_path
            FROM skill_packages AS sp
            JOIN conversation_skills AS cs
                ON cs.skill_package_id = sp.id
            WHERE cs.conversation_id = ?
            ORDER BY sp.name ASC, sp.id ASC
            """,
            (conversation_id,),
        )

        return [dict(row) for row in cursor.fetchall()]

    def register_skill_package(
        self,
        name: str,
        description: str,
        source: str,
        content_hash: str,
        package_path: str,
    ):
        cursor = self.connection.cursor()

        try:
            cursor.execute(
                """
            INSERT INTO skill_packages (
                name,
                description,
                source,
                content_hash,
                package_path
            )

            VALUES (?, ?, ?, ?, ?)
            """,
                (name, description, source, content_hash, package_path),
            )

            skill_id = cursor.lastrowid
            self.connection.commit()

            return skill_id

        except sqlite3.IntegrityError:
            self.connection.rollback()
            raise

    def activate_conversation_skill(self, conversation_id: int, skill_package_id: int):

        cursor = self.connection.cursor()

        try:
            cursor.execute(
                """
            INSERT INTO conversation_skills (
                conversation_id,
                skill_package_id
            )

            VALUES (?, ?)
            """,
                (conversation_id, skill_package_id),
            )

            self.connection.commit()

        except sqlite3.IntegrityError:
            self.connection.rollback()
            raise

    def get_skill_package(self, source: str, name: str, content_hash: str):
        cursor = self.connection.cursor()

        cursor.execute(
            """
        SELECT
            sp.id,
            sp.name,
            sp.description,
            sp.source,
            sp.content_hash,
            sp.package_path
        FROM skill_packages AS sp
        WHERE sp.source = ?
            AND sp.name = ?
            AND sp.content_hash = ?
        """,
            (source, name, content_hash),
        )

        row = cursor.fetchone()

        if row is None:
            return None

        return dict(row)

    def search_skill_packages(
        self,
        conversation_id: int,
        query: str,
        limit: int = 10,
    ) -> list[dict]:
        if type(query) is not str:
            raise ValueError("query must be a string")

        if type(limit) is not int:
            raise ValueError("limit must be an integer")

        if limit < 1 or limit > 50:
            raise ValueError("limit must be between 1 and 50")

        query = query.strip()

        if not query:
            return []

        pattern = f"%{query}%"
        cursor = self.connection.cursor()

        cursor.execute(
            """
            SELECT
                package.id,
                package.name,
                package.description,
                package.source,
                package.content_hash
            FROM skill_packages AS package
            WHERE EXISTS (
                SELECT 1
                FROM conversations
                WHERE id = ?
            )
              AND (package.name LIKE ? OR package.description LIKE ?)
              AND (
                  EXISTS (
                      SELECT 1
                      FROM universal_skill_packages AS universal
                      WHERE universal.skill_package_id = package.id
                  )
                  OR EXISTS (
                      SELECT 1
                      FROM skill_install_requests AS request
                      WHERE request.conversation_id = ?
                        AND request.skill_package_id = package.id
                        AND request.status = 'installed'
                  )
              )
            ORDER BY package.name ASC, package.id ASC
            LIMIT ?
            """,
            (
                conversation_id,
                pattern,
                pattern,
                conversation_id,
                limit,
            ),
        )

        return [dict(row) for row in cursor.fetchall()]

    def get_skill_package_by_id(self, skill_package_id: int):
        cursor = self.connection.cursor()

        cursor.execute(
            """
            SELECT
                id,
                name,
                description,
                source,
                content_hash,
                package_path
            FROM skill_packages
            WHERE id = ?
        """,
            (skill_package_id,),
        )

        row = cursor.fetchone()

        if row is None:
            return None

        return dict(row)

    def approve_skill_package(self, skill_package_id: int) -> None:
        cursor = self.connection.cursor()

        try:
            cursor.execute(
                """
            INSERT INTO approved_skill_packages (
                skill_package_id
            )
            VALUES (?)
            ON CONFLICT(skill_package_id) DO NOTHING
            """,
                (skill_package_id,),
            )

            self.connection.commit()

        except sqlite3.IntegrityError:
            self.connection.rollback()
            raise

    def is_skill_package_approved(self, skill_package_id: int) -> bool:
        cursor = self.connection.cursor()

        cursor.execute(
            """
            SELECT 1
            FROM approved_skill_packages
            WHERE skill_package_id = ?
            """,
            (skill_package_id,),
        )

        return cursor.fetchone() is not None

    def create_skill_install_request(
        self,
        conversation_id: int,
        repository_url: str,
        revision: str,
        skill_file_path: str,
    ) -> int:
        cursor = self.connection.cursor()

        try:
            cursor.execute(
                """
                INSERT INTO skill_install_requests (
                    conversation_id,
                    repository_url,
                    revision,
                    skill_file_path
                )
                VALUES (?, ?, ?, ?)
                """,
                (
                    conversation_id,
                    repository_url,
                    revision,
                    skill_file_path,
                ),
            )

            installation_id = cursor.lastrowid
            self.connection.commit()

            return installation_id

        except sqlite3.IntegrityError:
            self.connection.rollback()
            raise

    def get_skill_install_request(self, request_id: int) -> dict | None:
        cursor = self.connection.cursor()

        cursor.execute(
            """
            SELECT *
            FROM skill_install_requests
            WHERE id = ?
            """,
            (request_id,),
        )

        row = cursor.fetchone()

        if row is None:
            return None

        return dict(row)

    def get_conversation_skill_install_requests(
        self, conversation_id: int
    ) -> list[dict]:
        cursor = self.connection.cursor()

        cursor.execute(
            """
        SELECT *
        FROM skill_install_requests
        WHERE conversation_id = ?
        ORDER BY id ASC
        """,
            (conversation_id,),
        )

        return [dict(row) for row in cursor.fetchall()]

    def claim_skill_install_request(
        self, request_id: int, conversation_id: int
    ) -> bool:
        cursor = self.connection.cursor()

        try:
            cursor.execute(
                """
                UPDATE skill_install_requests
                SET status = 'installing'
                WHERE id = ?
                    AND conversation_id = ?
                    AND status = 'pending'
                """,
                (request_id, conversation_id),
            )

            if cursor.rowcount != 1:
                self.connection.rollback()
                return False

            cursor.execute(
                """
                SELECT repository_url, revision, skill_file_path
                FROM skill_install_requests
                WHERE id = ?
                    AND conversation_id = ?
                """,
                (request_id, conversation_id),
            )
            request = cursor.fetchone()

            if request is None:
                raise RuntimeError("installation request could not be retrieved.")

            self._insert_execution_event(
                cursor=cursor,
                event={
                    "type": "skill_install_approved",
                    "conversation_id": conversation_id,
                    "assistant_message_id": None,
                    "tool_call_id": None,
                    "data": {
                        "request_id": request_id,
                        "repository_url": request["repository_url"],
                        "revision": request["revision"],
                        "skill_file_path": request["skill_file_path"],
                    },
                },
            )

            self.connection.commit()
            return True

        except Exception:
            self.connection.rollback()
            raise

    def deny_skill_install_request(
        self,
        request_id: int,
        conversation_id: int,
    ) -> bool:
        cursor = self.connection.cursor()

        try:
            cursor.execute(
                """
                UPDATE skill_install_requests
                SET status = 'denied'
                WHERE id = ?
                  AND conversation_id = ?
                  AND status = 'pending'
                """,
                (request_id, conversation_id),
            )

            if cursor.rowcount != 1:
                self.connection.rollback()
                return False

            cursor.execute(
                """
                SELECT repository_url, revision, skill_file_path
                FROM skill_install_requests
                WHERE id = ?
                  AND conversation_id = ?
                """,
                (request_id, conversation_id),
            )
            request = cursor.fetchone()

            if request is None:
                raise RuntimeError(
                    "Denied installation request could not be retrieved."
                )

            self._insert_execution_event(
                cursor=cursor,
                event={
                    "type": "skill_install_denied",
                    "conversation_id": conversation_id,
                    "assistant_message_id": None,
                    "tool_call_id": None,
                    "data": {
                        "request_id": request_id,
                        "repository_url": request["repository_url"],
                        "revision": request["revision"],
                        "skill_file_path": request["skill_file_path"],
                    },
                },
            )

            self.connection.commit()
            return True

        except Exception:
            self.connection.rollback()
            raise

    def fail_skill_install_request(self, request_id: int, conversation_id: int) -> bool:
        cursor = self.connection.cursor()

        try:
            cursor.execute(
                """
                UPDATE skill_install_requests
                SET status = 'failed'
                WHERE id = ?
                    AND conversation_id = ?
                    AND status = 'installing'
                """,
                (request_id, conversation_id),
            )

            if cursor.rowcount != 1:
                self.connection.rollback()
                return False

            cursor.execute(
                """
                SELECT repository_url, revision, skill_file_path
                FROM skill_install_requests
                WHERE id = ?
                    AND conversation_id = ?
                """,
                (request_id, conversation_id),
            )
            request = cursor.fetchone()

            if request is None:
                raise RuntimeError(
                    "Failed installation request could not be retrieved."
                )

            self._insert_execution_event(
                cursor=cursor,
                event={
                    "type": "skill_install_failed",
                    "conversation_id": conversation_id,
                    "assistant_message_id": None,
                    "tool_call_id": None,
                    "data": {
                        "request_id": request_id,
                        "repository_url": request["repository_url"],
                        "revision": request["revision"],
                        "skill_file_path": request["skill_file_path"],
                    },
                },
            )

            self.connection.commit()
            return True

        except Exception:
            self.connection.rollback()
            raise

    def complete_skill_install_request(
        self,
        request_id: int,
        conversation_id: int,
        skill_package_id: int,
    ) -> bool:
        cursor = self.connection.cursor()

        try:
            cursor.execute(
                """
                UPDATE skill_install_requests
                SET status = 'installed',
                    skill_package_id = ?
                WHERE id = ?
                  AND conversation_id = ?
                  AND status = 'installing'
                """,
                (skill_package_id, request_id, conversation_id),
            )

            if cursor.rowcount != 1:
                self.connection.rollback()
                return False

            cursor.execute(
                """
                SELECT repository_url, revision, skill_file_path
                FROM skill_install_requests
                WHERE id = ?
                  AND conversation_id = ?
                """,
                (request_id, conversation_id),
            )
            request = cursor.fetchone()

            if request is None:
                raise RuntimeError("Installation request could not be retrieved.")

            cursor.execute(
                """
                SELECT id, name, source, content_hash
                FROM skill_packages
                WHERE id = ?
                """,
                (skill_package_id,),
            )
            package = cursor.fetchone()

            if package is None:
                raise RuntimeError("Installed skill package could not be retrieved.")

            cursor.execute(
                """
                INSERT INTO approved_skill_packages (skill_package_id)
                VALUES (?)
                ON CONFLICT(skill_package_id) DO NOTHING
                """,
                (skill_package_id,),
            )

            self._insert_execution_event(
                cursor=cursor,
                event={
                    "type": "skill_install_completed",
                    "conversation_id": conversation_id,
                    "assistant_message_id": None,
                    "tool_call_id": None,
                    "data": {
                        "request_id": request_id,
                        "repository_url": request["repository_url"],
                        "revision": request["revision"],
                        "skill_file_path": request["skill_file_path"],
                        "skill_package_id": package["id"],
                        "name": package["name"],
                        "source": package["source"],
                        "content_hash": package["content_hash"],
                    },
                },
            )

            self.connection.commit()
            return True

        except Exception:
            self.connection.rollback()
            raise

    def _insert_execution_event(self, cursor, event):
        cursor.execute(
            """
            INSERT INTO execution_events (
                conversation_id,
                assistant_message_id,
                tool_call_id,
                event_type,
                data_json
            )
            VALUES(?, ?, ?, ?, ?)
            """,
            (
                event["conversation_id"],
                event["assistant_message_id"],
                event["tool_call_id"],
                event["type"],
                json.dumps(event["data"]),
            ),
        )

        return cursor.lastrowid

    def register_universal_skill_package(self, skill_package_id: int):
        cursor = self.connection.cursor()

        try:
            cursor.execute(
                """
                INSERT INTO universal_skill_packages (
                    skill_package_id
                )
                VALUES(?)
                ON CONFLICT(skill_package_id) DO NOTHING
                """,
                (skill_package_id,),
            )
            self.connection.commit()
            return True

        except Exception:
            self.connection.rollback()
            raise

    def can_access_skill_package(
        self,
        conversation_id: int,
        skill_package_id: int,
    ) -> bool:
        cursor = self.connection.cursor()

        cursor.execute(
            """
            SELECT EXISTS (
                SELECT 1
                FROM conversations AS conversation
                CROSS JOIN skill_packages AS package
                WHERE conversation.id = ?
                  AND package.id = ?
                  AND (
                      EXISTS (
                          SELECT 1
                          FROM universal_skill_packages AS universal
                          WHERE universal.skill_package_id = package.id
                      )
                      OR EXISTS (
                          SELECT 1
                          FROM skill_install_requests AS request
                          WHERE request.conversation_id = conversation.id
                            AND request.skill_package_id = package.id
                            AND request.status = 'installed'
                      )
                  )
            )
            """,
            (conversation_id, skill_package_id),
        )

        return bool(cursor.fetchone()[0])

    def recover_interrupted_skill_install_requests(self) -> int:
        connection = self.connection

        if connection.in_transaction:
            raise RuntimeError(
                "Run installation recovery outside an active transaction."
            )

        cursor = connection.cursor()
        cursor.execute("BEGIN IMMEDIATE")

        try:
            cursor.execute(
                """
                SELECT
                    id,
                    conversation_id,
                    repository_url,
                    revision,
                    skill_file_path
                FROM skill_install_requests
                WHERE status = 'installing'
                ORDER BY id ASC
                """
            )
            requests = cursor.fetchall()

            for request in requests:
                cursor.execute(
                    """
                    UPDATE skill_install_requests
                    SET status = 'failed'
                    WHERE id = ?
                      AND conversation_id = ?
                      AND status = 'installing'
                    """,
                    (request["id"], request["conversation_id"]),
                )

                if cursor.rowcount != 1:
                    raise RuntimeError(
                        "Interrupted installation request could not be recovered."
                    )

                self._insert_execution_event(
                    cursor=cursor,
                    event={
                        "type": "skill_install_failed",
                        "conversation_id": request["conversation_id"],
                        "assistant_message_id": None,
                        "tool_call_id": None,
                        "data": {
                            "request_id": request["id"],
                            "repository_url": request["repository_url"],
                            "revision": request["revision"],
                            "skill_file_path": request["skill_file_path"],
                            "reason": "server_restart",
                        },
                    },
                )

            connection.commit()
            return len(requests)

        except BaseException:
            connection.rollback()
            raise

    def create_tables(self):
        cursor = self.connection.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id INTEGER NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                thinking TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (conversation_id)
                    REFERENCES conversations(id)
                    ON DELETE CASCADE
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS attachments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id INTEGER NOT NULL,
                message_id INTEGER NOT NULL,
                original_name TEXT NOT NULL,
                file_path TEXT NOT NULL,
                content_type TEXT NOT NULL,
                size INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (conversation_id)
                    REFERENCES conversations(id)
                    ON DELETE CASCADE,

                FOREIGN KEY (message_id)
                    REFERENCES messages(id)
                    ON DELETE CASCADE
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ingestion_jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                job_id TEXT UNIQUE NOT NULL,
                collection_name TEXT NOT NULL,
                original_name TEXT NOT NULL,
                source_path TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'queued',
                stage TEXT NOT NULL DEFAULT 'queued',
                created_at REAL NOT NULL,
                started_at REAL,
                finished_at REAL,
                stage_started_at REAL,
                stage_timings_json TEXT NOT NULL DEFAULT '{}',
                result_json TEXT,
                error TEXT
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS execution_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id INTEGER NOT NULL,
                assistant_message_id INTEGER,
                tool_call_id TEXT,
                event_type TEXT NOT NULL,
                data_json TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (conversation_id)
                    REFERENCES conversations(id)
                    ON DELETE CASCADE,

                FOREIGN KEY (assistant_message_id)
                    REFERENCES messages(id)
                    ON DELETE CASCADE 
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS response_blocks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                assistant_message_id INTEGER NOT NULL,
                type TEXT NOT NULL,
                content TEXT,
                visual_id INTEGER,

                FOREIGN KEY (assistant_message_id)
                    REFERENCES messages(id)
                    ON DELETE CASCADE
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS visuals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                assistant_message_id INTEGER NOT NULL,
                spec_json TEXT NOT NULL,
                schema_version INTEGER NOT NULL DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (assistant_message_id)
                    REFERENCES messages(id)
                    ON DELETE CASCADE 
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS visual_state (
                visual_id INTEGER PRIMARY KEY,
                state_json TEXT NOT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (visual_id)
                    REFERENCES visuals(id)
                    ON DELETE CASCADE
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS skill_packages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                source TEXT NOT NULL,
                content_hash TEXT NOT NULL,
                package_path TEXT NOT NULL,
                installed_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                UNIQUE (source, name, content_hash)
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS universal_skill_packages (
                skill_package_id INTEGER PRIMARY KEY,

                FOREIGN KEY (skill_package_id)
                    REFERENCES skill_packages(id)
                    ON DELETE CASCADE
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS conversation_skills (
                conversation_id INTEGER NOT NULL,
                skill_package_id INTEGER NOT NULL,
                activated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,

                PRIMARY KEY (conversation_id, skill_package_id),

                FOREIGN KEY (conversation_id)
                    REFERENCES conversations(id)
                    ON DELETE CASCADE,

                FOREIGN KEY (skill_package_id)
                    REFERENCES skill_packages(id)
                    ON DELETE RESTRICT
            )
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS approved_skill_packages (
            skill_package_id INTEGER PRIMARY KEY,
            approved_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,

            FOREIGN KEY (skill_package_id)
                REFERENCES skill_packages(id)
                ON DELETE CASCADE
        )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS skill_install_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id INTEGER NOT NULL,
                repository_url TEXT NOT NULL,
                revision TEXT NOT NULL,
                skill_file_path TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending'
                    CHECK (
                        status IN (
                            'pending',
                            'installing',
                            'installed',
                            'denied',
                            'failed'
                        )
                    ),
                skill_package_id INTEGER,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (conversation_id)
                    REFERENCES conversations(id)
                    ON DELETE CASCADE,

                FOREIGN KEY (skill_package_id)
                    REFERENCES skill_packages(id)
                    ON DELETE RESTRICT
            )
        """)

        self.connection.commit()

    def migrate_execution_events(self):
        connection = self.connection

        if connection.in_transaction:
            raise RuntimeError("Run migration outside an active transaction.")

        connection.execute("BEGIN IMMEDIATE")

        try:
            columns = connection.execute(
                "PRAGMA table_info(execution_events)"
            ).fetchall()

            nullable_columns = []

            for name in ("assistant_message_id", "tool_call_id"):
                column = next(
                    (column for column in columns if column[1] == name),
                    None,
                )

                if column is None:
                    raise RuntimeError(f"execution_events.{name} is missing.")

                nullable_columns.append(column)

            # Skip rebuilding only when both columns are already nullable.
            if all(not column[3] for column in nullable_columns):
                connection.commit()
                return

            schema_objects = connection.execute(
                """
                SELECT sql
                FROM sqlite_master
                WHERE tbl_name = 'execution_events'
                AND type IN ('index', 'trigger')
                AND sql IS NOT NULL
                """
            ).fetchall()

            sequence = connection.execute(
                "SELECT seq FROM sqlite_sequence WHERE name = 'execution_events'"
            ).fetchone()

            connection.execute("""
                CREATE TABLE execution_events_migrating (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    conversation_id INTEGER NOT NULL,
                    assistant_message_id INTEGER,
                    tool_call_id TEXT,
                    event_type TEXT NOT NULL,
                    data_json TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                    FOREIGN KEY (conversation_id)
                        REFERENCES conversations(id)
                        ON DELETE CASCADE,

                    FOREIGN KEY (assistant_message_id)
                        REFERENCES messages(id)
                        ON DELETE CASCADE
                )
            """)

            connection.execute("""
                INSERT INTO execution_events_migrating (
                    id, conversation_id, assistant_message_id,
                    tool_call_id, event_type, data_json, created_at
                )
                SELECT
                    id, conversation_id, assistant_message_id,
                    tool_call_id, event_type, data_json, created_at
                FROM execution_events
            """)

            connection.execute("DROP TABLE execution_events")
            connection.execute(
                "ALTER TABLE execution_events_migrating RENAME TO execution_events"
            )

            for row in schema_objects:
                connection.execute(row[0])

            # Preserve IDs reserved by events that were previously deleted.
            if sequence is not None:
                connection.execute(
                    "DELETE FROM sqlite_sequence WHERE name = 'execution_events'"
                )
                connection.execute(
                    "INSERT INTO sqlite_sequence (name, seq) VALUES (?, ?)",
                    ("execution_events", sequence[0]),
                )

            violations = connection.execute(
                "PRAGMA foreign_key_check(execution_events)"
            ).fetchall()

            if violations:
                raise RuntimeError("Execution event foreign-key validation failed.")

            connection.commit()

        except BaseException:
            connection.rollback()
            raise
