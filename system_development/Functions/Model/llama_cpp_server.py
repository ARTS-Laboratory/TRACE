import asyncio
import os
import signal
import subprocess
from pathlib import Path

import httpx

from Functions.Model.config import (
    DATA_PATH,
    LLAMA_CPP_AUTO_START,
    LLAMA_CPP_BASE_URL,
    LLAMA_CPP_MODEL_PATH,
    LLAMA_CPP_STARTUP_TIMEOUT_S,
    LLAMA_CPP_TOOLBOX,
    MODEL_NAME,
)


class LlamaCppServerManager:
    def __init__(self):
        self.process = None
        self.log_file = None
        self.owns_server = False
        self.lock = asyncio.Lock()
        self.pid_file = DATA_PATH / "logs" / "llama_cpp.pid"

    @property
    def enabled(self):
        return LLAMA_CPP_AUTO_START

    async def is_healthy(self):
        url = f"{LLAMA_CPP_BASE_URL.rstrip('/')}/models"

        try:
            async with httpx.AsyncClient(timeout=1.0) as client:
                response = await client.get(url)

            return response.is_success and bool(response.json().get("data"))
        except httpx.HTTPError:
            return False

    def llama_command(self):
        return [
            "llama-server",
            "-m",
            LLAMA_CPP_MODEL_PATH,
            "--host",
            "127.0.0.1",
            "--port",
            "8081",
            "-c",
            "32768",
            "--device",
            "ROCm0",
            "-ngl",
            "999",
            "--flash-attn",
            "on",
            "--load-mode",
            "none",
            "--alias",
            MODEL_NAME,
            "--reasoning",
            "on",
            "--reasoning-format",
            "deepseek",
            "--reasoning-preserve",
        ]

    def command(self):
        container_pid_file = f"/run/host{self.pid_file}"

        return [
            "toolbox",
            "run",
            "--container",
            LLAMA_CPP_TOOLBOX,
            "sh",
            "-c",
            (
                'pid_file="$1"; shift; '
                'printf "%s\\n" "$$" > "$pid_file"; '
                'exec "$@"'
            ),
            "sh",
            container_pid_file,
            *self.llama_command(),
        ]

    async def ensure_running(self):
        if not self.enabled or await self.is_healthy():
            return

        async with self.lock:
            if await self.is_healthy():
                return

            logs = DATA_PATH / "logs"
            logs.mkdir(parents=True, exist_ok=True)
            self.pid_file.unlink(missing_ok=True)

            self.log_file = open(
                logs / "llama_cpp.log",
                "ab",
                buffering=0,
            )

            self.process = subprocess.Popen(
                self.command(),
                stdin=subprocess.DEVNULL,
                stdout=self.log_file,
                stderr=subprocess.STDOUT,
                start_new_session=True,
            )
            self.owns_server = True

            deadline = (
                asyncio.get_running_loop().time()
                + LLAMA_CPP_STARTUP_TIMEOUT_S
            )

            while asyncio.get_running_loop().time() < deadline:
                if await self.is_healthy():
                    return

                if self.process.poll() is not None:
                    await self.stop()
                    raise RuntimeError(
                        "llama.cpp exited during startup. See "
                        f"{logs / 'llama_cpp.log'}"
                    )

                await asyncio.sleep(0.5)

            await self.stop()
            raise RuntimeError(
                "Timed out waiting for llama.cpp to start. See "
                f"{logs / 'llama_cpp.log'}"
            )

    def terminate_owned_server(self):
        if not self.pid_file.exists():
            return

        try:
            pid = int(self.pid_file.read_text().strip())
        except ValueError:
            self.pid_file.unlink(missing_ok=True)
            return

        try:
            cmdline = (
                (Path("/proc") / str(pid) / "cmdline")
                .read_bytes()
            )
        except FileNotFoundError:
            cmdline = b""

        if b"llama-server" in cmdline:
            os.kill(pid, signal.SIGTERM)

        self.pid_file.unlink(missing_ok=True)

    async def stop(self):
        if not self.owns_server:
            return

        self.terminate_owned_server()

        deadline = asyncio.get_running_loop().time() + 10.0

        while (
            await self.is_healthy()
            and asyncio.get_running_loop().time() < deadline
        ):
            await asyncio.sleep(0.25)

        if self.process is not None and self.process.poll() is None:
            self.process.terminate()

            try:
                await asyncio.to_thread(self.process.wait, 10)
            except subprocess.TimeoutExpired:
                self.process.kill()
                await asyncio.to_thread(self.process.wait)

        if self.log_file is not None:
            self.log_file.close()

        self.process = None
        self.log_file = None
        self.owns_server = False