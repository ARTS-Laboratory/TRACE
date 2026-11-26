import asyncio
import importlib
import inspect
import json
import pkgutil
import time
from copy import deepcopy

import Functions.Tools
from Functions.tool import Tool

BLUE_GREY = "\033[38;2;120;140;170m"
RESET = "\033[0m"


class ToolManager:
    def __init__(self):
        self.tools = {}
        self.load_tools()

    def __iter__(self):
        return iter(self.tools.values())

    def register(self, tool):
        if tool.name in self.tools:
            raise ValueError(f"Tool '{tool.name}' already registered.")

        self.tools[tool.name] = tool

    def load_tools(self):
        for _, module_name, _ in pkgutil.iter_modules(Functions.Tools.__path__):
            module = importlib.import_module(f"Functions.Tools.{module_name}")

            for _, obj in inspect.getmembers(module):
                if (
                    inspect.isclass(obj)
                    and issubclass(obj, Tool)
                    and not inspect.isabstract(obj)
                ):
                    signature = inspect.signature(obj.__init__)

                    required_parameters = []
                    for parameter in signature.parameters.values():
                        if parameter.name == "self":
                            continue

                        if parameter.default == inspect.Parameter.empty:
                            required_parameters.append(parameter)

                    if required_parameters:
                        continue

                    self.register(obj())

    def schema(self):
        return [tool.schema() for tool in self.tools.values()]

    async def execute(
        self,
        stats,
        name,
        on_event=None,
        tool_call_id=None,
        conversation_id=None,
        assistant_message_id=None,
        record_event=None,
        skill_context=None,
        **kwargs,
    ):

        async def emit(event_type, data):
            event = {
                "type": event_type,
                "conversation_id": conversation_id,
                "assistant_message_id": assistant_message_id,
                "tool_call_id": tool_call_id,
                "data": {
                    **data,
                    "skill_context": deepcopy(
                        skill_context if skill_context is not None else []
                    ),
                },
            }

            if record_event:
                record_event(event)

            if on_event:
                await on_event(event)

        await emit("tool_started", {"name": name, "arguments": kwargs})
        start = time.perf_counter()
        try:
            result = await self.tools[name].execute(**kwargs)

        except asyncio.CancelledError:
            elapsed = time.perf_counter() - start

            await emit("tool_cancelled", {"name": name, "elapsed": elapsed})
            raise

        except Exception as e:
            elapsed = time.perf_counter() - start

            await emit(
                "tool_failed", {"name": name, "elapsed": elapsed, "error": str(e)}
            )
            raise

        elapsed = time.perf_counter() - start
        stats.add_tool(name, elapsed)

        await emit(
            "tool_finished", {"name": name, "elapsed": elapsed, "result": result}
        )

        return result

    async def execute_calls(
        self,
        stats,
        tool_calls,
        on_event=None,
        conversation_id=None,
        assistant_message_id=None,
        record_event=None,
        skill_context=None,
    ):
        messages = []

        for call in tool_calls:
            if isinstance(call, dict):
                function = call["function"]
                call_id = call["id"]
                name = function["name"]
                args = function["arguments"]

            else:
                function = call.function
                call_id = call.id
                name = function.name
                args = function.arguments

            if isinstance(args, str):
                args = json.loads(args)

            result = await self.execute(
                stats,
                name,
                on_event=on_event,
                tool_call_id=call_id,
                conversation_id=conversation_id,
                assistant_message_id=assistant_message_id,
                record_event=record_event,
                skill_context=skill_context,
                **args,
            )

            messages.append(
                {
                    "role": "tool",
                    "name": name,
                    "tool_call_id": call_id,
                    "content": json.dumps(result),
                }
            )

        return messages
