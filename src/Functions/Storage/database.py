import json
import sqlite3

from Functions.Model.config import DATA_PATH

DATABASE_PATH = DATA_PATH / "glorp_cat.db"


class Database:
    def __init__(self):
        DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)

        self.connection = sqlite3.connect(DATABASE_PATH)

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

        cursor.execute(
            """
            INSERT INTO execution_events (
                conversation_id,
                assistant_message_id,
                tool_call_id,
                event_type,
                data_json
            )
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                event["conversation_id"],
                event["assistant_message_id"],
                event["tool_call_id"],
                event["type"],
                json.dumps(event["data"]),
            ),
        )

        self.connection.commit()

        return cursor.lastrowid

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
                assistant_message_id INTEGER NOT NULL,
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

            tool_column = next(
                (column for column in columns if column[1] == "tool_call_id"),
                None,
            )

            if tool_column is None:
                raise RuntimeError("execution_events.tool_call_id is missing.")

            # Already nullable: nothing to migrate.
            if not tool_column[3]:
                connection.commit()
                return

            schema_objects = connection.execute(
                """
                SELECT sql FROM sqlite_master
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
                    assistant_message_id INTEGER NOT NULL,
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
                SELECT id, conversation_id, assistant_message_id,
                    tool_call_id, event_type, data_json, created_at
                FROM execution_events
            """)

            connection.execute("DROP TABLE execution_events")
            connection.execute(
                "ALTER TABLE execution_events_migrating RENAME TO execution_events"
            )

            for row in schema_objects:
                connection.execute(row[0])

            # Avoid reusing IDs belonging to previously deleted events.
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
