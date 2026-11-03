from Functions.Agent.factory import create_agent
from Functions.Tools.inspectMedia import InspectMedia

def make_title(message, max_length=40):
    title = " ".join(
        message.strip().split()
    )

    if not title:
        return "New chat"

    if len(title) <= max_length:
        return title

    return title[:max_length].rstrip() + "..."

class ConversationManager:
    def __init__(self, runtime, database):
        self.runtime = runtime
        self.database = database

        # Active Agent instances keyed by conversation ID
        self.agents = {}


    def create(self, title="New chat"):
        conversation_id = self.database.create_conversation(
            title
        )

        agent = create_agent(
            self.runtime,
            conversation_id=conversation_id
            )

        media_inspector = self.runtime.media_inspector
        
        tool = InspectMedia(
            conversation_id=conversation_id,
            conversation_manager=self,
            media_inspector=media_inspector
        )

        agent.tool_manager.register(tool)
        self.agents[conversation_id] = agent

        return conversation_id


    def get_agent(self, conversation_id):
        # Already loaded
        if conversation_id in self.agents:
            return self.agents[conversation_id]

        # Otherwise restore it from SQLite
        stored = self.database.get_conversation(
            conversation_id
        )

        if stored is None:
            return None

        agent = create_agent(
            self.runtime,
            messages=stored["messages"],
            conversation_id=conversation_id
        )

        media_inspector = self.runtime.media_inspector

        tool = InspectMedia(
            conversation_id=conversation_id,
            conversation_manager=self,
            media_inspector=media_inspector
        )

        agent.tool_manager.register(tool)

        self.agents[conversation_id] = agent

        return agent

    def set_title_from_message(
        self,
        conversation_id,
        message
    ):
        conversation = self.database.get_conversation(
            conversation_id
        )

        if conversation is None:
            return None

        # Only automatically title untouched chats
        if conversation["title"] != "New chat":
            return conversation["title"]

        title = make_title(message)

        self.database.update_conversation_title(
            conversation_id,
            title
        )

        return title  

    def rename(self, conversation_id, title):
        conversation = self.database.get_conversation(
            conversation_id
        )

        if conversation is None:
            return None

        self.database.update_conversation_title(
            conversation_id,
            title
        )

        return title

    def delete(self, conversation_id):
        deleted = self.database.delete_conversation(
            conversation_id
        )

        if deleted:
            self.agents.pop(
                conversation_id,
                None
            )

        return deleted  

    def add_attachment(            
            self,
            conversation_id,
            message_id,
            original_name,
            file_path,
            content_type,
            size,
            ):
        attached = self.database.add_attachment(
            conversation_id,
            message_id,
            original_name,
            file_path,
            content_type,
            size,
        )

        if attached is None:
            return None

        return attached

    def get_attachment(self, conversation_id, attachment_id):
        attachment = self.database.get_attachment(
            attachment_id
        )

        if attachment is None:
            return None

        if attachment["conversation_id"] != conversation_id:
            return None

        return attachment

    def get_attachments_for_message(self, message_id):
        attachment_for_message = self.database.get_attachments_for_message(
            message_id
        )

        return attachment_for_message

    def get_conversation(self, conversation_id):
        return self.database.get_conversation(
            conversation_id
        )

    def get_attachment_by_id(self, attachment_id):
        attachment = self.database.get_attachment(attachment_id)

        if not attachment:
            return None

        return attachment    

    def get_conversations(self):
        return self.database.get_conversations()

