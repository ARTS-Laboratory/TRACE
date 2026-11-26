import json
from copy import deepcopy

from Functions.Agent.streaming import streamResponse
from Functions.responseStats import ResponseStats
from Skills.provenance import collect_skill_context


class Agent:
    def __init__(
        self, tool_manager, conversation, mcp_manager, model_manager, conversation_id
    ):
        self.tool_manager = tool_manager
        self.conversation = conversation
        self.mcp_manager = mcp_manager
        self.model_manager = model_manager
        self.conversation_id = conversation_id

    async def chat(
        self,
        user_input,
        attachments=None,
        on_event=None,
        assistant_message_id=None,
        record_event=None,
    ):
        stats = ResponseStats()
        stats.set_model(self.model_manager.info)
        self.conversation.add_user(user_input, attachments)
        model_iteration = 0

        while True:
            visual_created = False

            model_messages = self.conversation.get_model_messages()

            if visual_created:
                reminder = (
                    "\n\nCurrent-turn visual output rule:\n"
                    "A create_visual call has succeeded. The application displays "
                    "that visual automatically. Do not repeat its contents as a "
                    "Markdown table, checklist, list, or prose summary unless the "
                    "user explicitly requested duplicate output. "
                    "Provide only a brief confirmation and any requested source "
                    "links or additional explanation. Additional explanation "
                    "must add information rather than reconstruct the visual. "
                    "Do not mention internal IDs or output-format compliance. "
                    "Continue using tools if needed to complete the remaining "
                    "request, but do not recreate an already completed visual "
                    "merely to acknowledge it."
                )

                model_messages[0] = {
                    **model_messages[0],
                    "content": model_messages[0]["content"] + reminder,
                }

            skill_context = collect_skill_context(model_messages)
            model_iteration += 1

            assistant = await streamResponse(
                model_messages,
                self.tool_manager,
                stats,
                on_event=on_event,
                conversation_id=self.conversation_id,
            )

            context_event = {
                "type": "model_response_context",
                "conversation_id": self.conversation_id,
                "assistant_message_id": assistant_message_id,
                "tool_call_id": None,
                "data": {
                    "model_iteration": model_iteration,
                    "skill_context": deepcopy(skill_context),
                },
            }

            if record_event:
                record_event(deepcopy(context_event))

            if on_event:
                await on_event(deepcopy(context_event))

            # print("DEBUG: streamResponse returned", flush=True)

            self.conversation.add_assistant(
                assistant["thinking"], assistant["content"], assistant["tool_calls"]
            )

            if record_event and assistant["thinking"]:
                record_event(
                    {
                        "type": "thinking_block",
                        "conversation_id": self.conversation_id,
                        "assistant_message_id": assistant_message_id,
                        "tool_call_id": None,
                        "data": {"text": assistant["thinking"]},
                    }
                )

            if not assistant["tool_calls"]:
                break

            tool_messages = await self.tool_manager.execute_calls(
                stats,
                assistant["tool_calls"],
                on_event=on_event,
                conversation_id=self.conversation_id,
                assistant_message_id=assistant_message_id,
                record_event=record_event,
                skill_context=skill_context,
            )

            self.conversation.add_tool_messages(tool_messages)

            for tool_message in tool_messages:
                if tool_message.get("name") != "create_visual":
                    continue

                result = json.loads(tool_message["content"])

                if (
                    isinstance(result, dict)
                    and "error" not in result
                    and "visual_id" in result
                    and "block_id" in result
                ):
                    visual_created = True

        # print("DEBUG: starting load_active", flush=True)
        await self.model_manager.load()
        # print("DEBUG: load_active returned", flush=True)

        stats.finish()

        if on_event:
            await on_event(
                {
                    "type": "response_stats",
                    "conversation_id": self.conversation_id,
                    "data": stats.to_dict(),
                }
            )

        stats.print_stats()

        return {"content": assistant["content"], "thinking": assistant["thinking"]}
