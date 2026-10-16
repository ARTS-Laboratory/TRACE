import asyncio

from Functions.system import giveGPUstatus
from Functions.Agent.factory import create_agent, create_runtime
from Functions.Model.config import CHATBOT_NAME


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

                print(
                    f"\n{GREY}{CHATBOT_NAME} thinking:\n",
                    end=""
                )

            print(
                data,
                end="",
                flush=True
            )

        elif event_type == "content_delta":
            if self.in_thinking:
                print(
                    f"{RESET}\n\n{CHATBOT_NAME}:\n",
                    end=""
                )

                self.in_thinking = False

            print(
                data,
                end="",
                flush=True
            )

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

            print(
                f"{BLUE_GREY}\n"
                f"✓ Completed in {elapsed:.2f} s"
            )

            print("=" * 50 + RESET + "\n")

async def main():
    giveGPUstatus()

    runtime = await create_runtime()
    agent = create_agent(runtime)

    renderer = TerminalRenderer()

    try:
        while True:
            user = input("\n\nYou: ")

            if not user:
                break

            await agent.chat(
                user,
                on_event=renderer.handle_event
            )

    finally:
        await runtime.shutdown()

if __name__ == "__main__":
    asyncio.run(main())