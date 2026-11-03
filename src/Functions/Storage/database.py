import sqlite3
from pathlib import Path
from Functions.Model.config import DATA_PATH

DATABASE_PATH = (DATA_PATH / "glorp_cat.db")

class Database:
    def __init__(self):
        DATABASE_PATH.parent.mkdir(
            parents=True,
            exist_ok=True
        )

        self.connection = sqlite3.connect(
            DATABASE_PATH
        )

        self.connection.execute(
            "PRAGMA foreign_keys = ON"
        )

        self.connection.row_factory = sqlite3.Row

        self.create_tables()
        
    def create_conversation(self, title="New chat"):
        cursor = self.connection.cursor()

        cursor.execute(
            """
            INSERT INTO conversations (title)
            VALUES (?)
            """,
            (title,)
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
            (conversation_id,)
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
            (conversation_id,)
        )

        messages = [
            dict(row)
            for row in cursor.fetchall()
        ]

        for message in messages:
            attachments = self.get_attachments_for_message(
                message["id"]
            )

            message["attachments"] = attachments

        result = dict(conversation)
        result["messages"] = messages

        return result

    def add_message(
        self,
        conversation_id,
        role,
        content,
        thinking=None
    ):
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
            (
                conversation_id,
                role,
                content,
                thinking
            )
        )

        cursor.execute(
            """
            UPDATE conversations
            SET updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (conversation_id,)
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
                size
            )
        )

        attachment_id = cursor.lastrowid

        cursor.execute("""
            UPDATE conversations
            SET updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (conversation_id,)
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
            (attachment_id,)
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
            (message_id,)
        )

        attachments = [
            dict(row)
            for row in cursor.fetchall()
        ]

        return attachments

    def delete_conversation(self, conversation_id):
        cursor = self.connection.cursor()

        cursor.execute(
            """
            DELETE FROM conversations
            WHERE id = ?
            """,
            (conversation_id,)
        )

        self.connection.commit()

        return cursor.rowcount > 0

    def update_conversation_title(
        self,
        conversation_id,
        title
    ):
        cursor = self.connection.cursor()

        cursor.execute(
            """
            UPDATE conversations
            SET title = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (
                title,
                conversation_id
            )
        )

        self.connection.commit()

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

        self.connection.commit()