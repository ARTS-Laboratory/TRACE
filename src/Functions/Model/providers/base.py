from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import AsyncIterator


@dataclass
class ProviderChunk:
    thinking_delta: str = ""
    content_delta: str = ""
    tool_calls: list[dict] = field(default_factory=list)
    metrics: dict | None = None


class ChatProvider(ABC):
    @abstractmethod
    async def stream_chat(
        self,
        messages: list[dict],
        tools: list[dict],
    ) -> AsyncIterator[ProviderChunk]:
        """Yield backend-neutral streamed chat chunks."""
        raise NotImplementedError