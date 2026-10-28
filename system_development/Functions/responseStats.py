import time

TAB = "  "
TOOL_WIDTH = 30
GREEN = "\033[38;2;16;163;127m"
RESET = "\033[0m"


class ResponseStats:

    def __init__(self):
        self.start_time = time.perf_counter()
        self.total_time = 0.0
        self.tool_times = []

    def add_tool(self, name, elapsed):
        self.tool_times.append({
            "name": name,
            "elapsed": elapsed
        })

    def set_llm(
        self,
        prompt_tokens,
        generated_tokens,
        prompt_duration,
        generation_duration,
        load_duration,
        total_duration,
        prompt_processed_tokens=None,
        cached_tokens=0,
    ):
        self.prompt_tokens = prompt_tokens
        self.prompt_processed_tokens = (
            prompt_tokens
            if prompt_processed_tokens is None
            else prompt_processed_tokens
        )
        self.cached_tokens = cached_tokens
        self.generated_tokens = generated_tokens

        # Convert durations from nanoseconds to seconds
        prompt_seconds = prompt_duration / 1e9
        generation_seconds = generation_duration / 1e9

        # Avoid division by zero if it reports a duration of 0
        self.prompt_speed = (
            self.prompt_processed_tokens / prompt_seconds
            if prompt_seconds > 0
            else 0.0
        )

        self.generation_speed = (
            generated_tokens / generation_seconds
            if generation_seconds > 0
            else 0.0
        )

        self.load_time = load_duration / 1e9
        self.thinking_time = prompt_seconds
        self.response_time = generation_seconds
        self.model_time = total_duration / 1e9

    def finish(self):
        self.total_time = time.perf_counter() - self.start_time

    def set_model(self, model_info):
        self.model = model_info

    def stat(self, label, value):
        print(f"{TAB}{label:<{TOOL_WIDTH}}{value}")

    def to_dict(self):
        if self.model.context_length > 0:
            context_usage = (
                (self.prompt_tokens + 1) /
                self.model.context_length
            ) * 100
        else:
            context_usage = None

        return {
            "model": {
                "context_length": self.model.context_length,
                "context_used": self.prompt_tokens,
                "context_usage": context_usage,
            },

            "tokens": {
                "prompt": self.prompt_tokens,
                "generated": self.generated_tokens,
            },

            "speed": {
                "prompt": self.prompt_speed,
                "generation": self.generation_speed,
            },

            "timing": {
                "load": self.load_time,
                "thinking": self.thinking_time,
                "generation": self.response_time,
                "model_total": self.model_time,
                "overall": self.total_time,
            },

            "tools": self.tool_times,
        }

    def print_stats(self):
        if self.model.context_length > 0:
            context_usage = (
                (self.prompt_tokens + 1) /
                self.model.context_length
            ) * 100
        else:
            context_usage = None
        
        print(f"{GREEN}\n\n" + "=" * 50)
        print("📊 Response Statistics:")

        print("\n🧠 Model:")
        if context_usage is not None:
            self.stat(
                "Context",
                f"{self.prompt_tokens:,} / "
                f"{self.model.context_length:,} "
                f"({context_usage:.1f}%)"
            )
        else:
            self.stat(
                "Context",
                f"{self.prompt_tokens:,} / N/A"
            )
        self.stat("Prompt Tokens", f"{self.prompt_tokens:,}")
        self.stat("Generated Tokens", f"{self.generated_tokens:,}")
        self.stat("Prompt Speed", f"{self.prompt_speed:.2f} tok/s")
        self.stat("Generation Speed", f"{self.generation_speed:.2f} tok/s")
        self.stat("Load Time", f"{self.load_time:.2f} s")

        print("\n🔧 Tools:")
        if self.tool_times:
            for tool in self.tool_times:
                self.stat(
                    tool["name"],
                    f"{tool['elapsed']:.2f} s"
                )
        else:
            self.stat("None", "")

        print("\n⏱ Response:")
        self.stat("Thinking", f"{self.thinking_time:.2f} s")
        self.stat("Generation", f"{self.response_time:.2f} s")
        self.stat("Model Total", f"{self.model_time:.2f} s")
        self.stat("Overall Total", f"{self.total_time:.2f} s")

        print("=" * 50 + RESET)