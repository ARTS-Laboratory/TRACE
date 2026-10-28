import json

import httpx

from Functions.Model.config import LLAMA_CPP_BASE_URL
from Functions.Model.providers.base import ChatProvider, ProviderChunk


class LlamaCppProvider(ChatProvider):
    def __init__(self, model_name: str):
        self.model_name = model_name
        self.url = f"{LLAMA_CPP_BASE_URL.rstrip('/')}/chat/completions"

    @staticmethod
    def _prepare_messages(messages: list[dict]) -> list[dict]:
        prepared = []

        for message in messages:
            role = message["role"]

            if role == "assistant":
                item = {
                    "role": "assistant",
                    "content": message.get("content", ""),
                }

                if message.get("thinking"):
                    item["reasoning_content"] = message["thinking"]

                if message.get("tool_calls"):
                    item["tool_calls"] = []

                    for call in message["tool_calls"]:
                        arguments = call["function"]["arguments"]

                        if not isinstance(arguments, str):
                            arguments = json.dumps(arguments)

                        item["tool_calls"].append(
                            {
                                "id": call["id"],
                                "type": "function",
                                "function": {
                                    "name": call["function"]["name"],
                                    "arguments": arguments,
                                },
                            }
                        )

                prepared.append(item)
                continue

            if role == "tool":
                prepared.append(
                    {
                        "role": "tool",
                        "tool_call_id": message["tool_call_id"],
                        "content": message["content"],
                    }
                )
                continue

            prepared.append(
                {
                    "role": role,
                    "content": message["content"],
                }
            )

        return prepared

    @staticmethod
    def _metrics(timings: dict) -> dict:
        cache_tokens = int(timings.get("cache_n", 0))
        prompt_tokens = int(timings.get("prompt_n", 0))
        generated_tokens = int(timings.get("predicted_n", 0))

        prompt_ms = float(timings.get("prompt_ms", 0))
        generation_ms = float(timings.get("predicted_ms", 0))

        return {
            "prompt_tokens": cache_tokens + prompt_tokens,
            "prompt_processed_tokens": prompt_tokens,
            "cached_tokens": cache_tokens,
            "generated_tokens": generated_tokens,
            "prompt_duration": int(prompt_ms * 1_000_000),
            "generation_duration": int(generation_ms * 1_000_000),
            "load_duration": 0,
            "total_duration": int(
                (prompt_ms + generation_ms) * 1_000_000
            ),
        }

    @staticmethod
    def _finalise_tool_calls(fragments: dict[int, dict]) -> list[dict]:
        calls = []

        for index in sorted(fragments):
            fragment = fragments[index]
            arguments_text = fragment["arguments"] or "{}"

            try:
                arguments = json.loads(arguments_text)
            except json.JSONDecodeError as error:
                raise ValueError(
                    "llama.cpp returned invalid JSON tool arguments for "
                    f"{fragment['name']!r}: {arguments_text!r}"
                ) from error

            calls.append(
                {
                    "id": fragment["id"],
                    "type": "function",
                    "function": {
                        "name": fragment["name"],
                        "arguments": arguments,
                    },
                }
            )

        return calls

    async def stream_chat(self, messages, tools):
        payload = {
            "model": self.model_name,
            "messages": self._prepare_messages(messages),
            "tools": tools,
            "stream": True,
            "temperature": 1,
            "top_p": 0.95,
        }

        tool_fragments = {}
        final_timings = None

        timeout = httpx.Timeout(
            connect=10.0,
            read=None,
            write=60.0,
            pool=10.0,
        )

        async with httpx.AsyncClient(timeout=timeout) as client:
            async with client.stream("POST", self.url, json=payload) as response:
                response.raise_for_status()

                async for line in response.aiter_lines():
                    if not line.startswith("data: "):
                        continue

                    data = line.removeprefix("data: ").strip()

                    if data == "[DONE]":
                        break

                    event = json.loads(data)
                    choice = event["choices"][0]
                    delta = choice.get("delta", {})

                    thinking_delta = delta.get("reasoning_content") or ""
                    content_delta = delta.get("content") or ""

                    for tool_call in delta.get("tool_calls") or []:
                        index = tool_call.get("index", 0)

                        fragment = tool_fragments.setdefault(
                            index,
                            {
                                "id": "",
                                "name": "",
                                "arguments": "",
                            },
                        )

                        fragment["id"] = tool_call.get(
                            "id",
                            fragment["id"],
                        )

                        function = tool_call.get("function") or {}
                        fragment["name"] += function.get("name") or ""
                        fragment["arguments"] += (
                            function.get("arguments") or ""
                        )

                    if event.get("timings"):
                        final_timings = event["timings"]

                    if thinking_delta or content_delta:
                        yield ProviderChunk(
                            thinking_delta=thinking_delta,
                            content_delta=content_delta,
                        )

        yield ProviderChunk(
            tool_calls=self._finalise_tool_calls(tool_fragments),
            metrics=(
                self._metrics(final_timings)
                if final_timings is not None
                else None
            ),
        )