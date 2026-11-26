import asyncio

from Functions.Agent.factory import create_agent, create_runtime
from Functions.Conversation.manager import ConversationManager
from Functions.Model.config import CHATBOT_NAME
from Functions.Storage.database import Database
from Functions.system import giveGPUstatus

GREY = "\033[90m"
RESET = "\033[0m"
BLUE_GREY = "\033[38;2;120;140;170m"


class TerminalRenderer:
    def __init__(self):
        self.in_thinking = False

    async def handle_event(self, event):
        event_type = event["type"]
        data = event["data"]

        if event_type == "thinking_delta":
            if not self.in_thinking:
                self.in_thinking = True

                print(f"\n{GREY}{CHATBOT_NAME} thinking:\n", end="")

            print(data, end="", flush=True)

        elif event_type == "content_delta":
            if self.in_thinking:
                print(f"{RESET}\n\n{CHATBOT_NAME}:\n", end="")

                self.in_thinking = False

            print(data, end="", flush=True)

        elif event_type == "tool_started":
            name = data["name"]
            arguments = data["arguments"]

            print(f"{BLUE_GREY}\n" + "=" * 50)
            print(f"🔧 Executing Tool: {name}")

            if arguments:
                print("\nArguments:")

                for key, value in arguments.items():
                    print(f"  {key}: {value}")

            print(RESET, end="")

        elif event_type == "tool_finished":
            elapsed = data["elapsed"]

            print(f"{BLUE_GREY}\n✓ Completed in {elapsed:.2f} s")

            print("=" * 50 + RESET + "\n")


async def main():
    giveGPUstatus()

    runtime = await create_runtime()
    database = None

    try:
        database = Database()
        manager = ConversationManager(
            runtime=runtime,
            database=database,
        )

        conversation_id = manager.create(title="Terminal chat")
        agent = manager.get_agent(conversation_id)

        if agent is None:
            raise RuntimeError("Terminal conversation could not be loaded.")

        renderer = TerminalRenderer()

        while True:
            try:
                user = input("\n\nYou: ")
            except EOFError:
                break

            if not user.strip():
                break

            await agent.chat(
                user,
                on_event=renderer.handle_event,
            )

    finally:
        try:
            await runtime.shutdown()
        finally:
            if database is not None:
                database.connection.close()


if __name__ == "__main__":
    asyncio.run(main())
