import uuid

import ollama

from Functions.Model.providers.base import ChatProvider, ProviderChunk


def _normalise_tool_call(call) -> dict:
    function = call.function
    arguments = function.arguments

    return {
        "id": getattr(call, "id", None) or f"call_{uuid.uuid4().hex}",
        "type": "function",
        "function": {
            "name": function.name,
            "arguments": arguments if isinstance(arguments, dict) else {},
        },
    }


class OllamaProvider(ChatProvider):
    def __init__(self, model_name: str):
        self.model_name = model_name
        self.client = ollama.AsyncClient()

    async def stream_chat(self, messages, tools):
        response = await self.client.chat(
            model=self.model_name,
            messages=messages,
            stream=True,
            think=True,
            tools=tools,
        )

        async for chunk in response:
            yield ProviderChunk(
                thinking_delta=chunk.message.thinking or "",
                content_delta=chunk.message.content or "",
                tool_calls=[
                    _normalise_tool_call(call)
                    for call in (chunk.message.tool_calls or [])
                ],
                metrics=(
                    {
                        "prompt_tokens": chunk.prompt_eval_count or 0,
                        "prompt_processed_tokens": chunk.prompt_eval_count or 0,
                        "cached_tokens": 0,
                        "generated_tokens": chunk.eval_count or 0,
                        "prompt_duration": chunk.prompt_eval_duration or 0,
                        "generation_duration": chunk.eval_duration or 0,
                        "load_duration": chunk.load_duration or 0,
                        "total_duration": chunk.total_duration or 0,
                    }
                    if chunk.done
                    else None
                ),
            )