from Functions.Model.providers.registry import create_chat_provider


async def streamResponse(
    messages: list[dict],
    toolManager,
    stats,
    on_event=None,
    conversation_id=None,
) -> dict[str, object]:
    async def emit(event_type, data):
        if on_event:
            await on_event(
                {
                    "type": event_type,
                    "conversation_id": conversation_id,
                    "data": data,
                }
            )

    response_content = ""
    thinking_content = ""
    tool_calls = []
    metrics = None

    provider = create_chat_provider()

    async for chunk in provider.stream_chat(
        messages,
        toolManager.schema(),
    ):
        if chunk.thinking_delta:
            thinking_content += chunk.thinking_delta
            await emit("thinking_delta", chunk.thinking_delta)

        if chunk.content_delta:
            response_content += chunk.content_delta
            await emit("content_delta", chunk.content_delta)

        if chunk.tool_calls:
            tool_calls.extend(chunk.tool_calls)

        if chunk.metrics:
            metrics = chunk.metrics

    if metrics is None:
        raise RuntimeError("The model backend ended without timing metadata.")

    stats.set_llm(
        prompt_tokens=metrics["prompt_tokens"],
        generated_tokens=metrics["generated_tokens"],
        prompt_duration=metrics["prompt_duration"],
        generation_duration=metrics["generation_duration"],
        load_duration=metrics["load_duration"],
        total_duration=metrics["total_duration"],
        prompt_processed_tokens=metrics.get(
            "prompt_processed_tokens",
            metrics["prompt_tokens"],
        ),
        cached_tokens=metrics.get("cached_tokens", 0),
    )

    return {
        "thinking": thinking_content,
        "content": response_content,
        "tool_calls": tool_calls,
    }