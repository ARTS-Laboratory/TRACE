import ast
import asyncio
from contextlib import redirect_stdout
import importlib.util
import io
import os
from pathlib import Path
import sys
from tempfile import TemporaryDirectory
from types import SimpleNamespace
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
from Functions.Visuals.duplicate_tables import DuplicateVisualTableFilter

module_spec = importlib.util.spec_from_file_location("table_patch", ROOT / "apply_table_filter.py")
patch = importlib.util.module_from_spec(module_spec)
module_spec.loader.exec_module(patch)

ORIGINAL_TOOL = '''class CreateVisual:
    def __init__(self, on_create_visual):
        self.on_create_visual = on_create_visual

    async def execute(self, spec):
        result = await self.on_create_visual(spec)

        return result
'''

# The control flow from the reviewed streamResponse, with its existing metrics.
ORIGINAL_STREAM = '''from Functions.Model.providers.registry import create_chat_provider

async def streamResponse(messages, toolManager, stats, on_event=None, conversation_id=None):
    async def emit(event_type, data):
        if on_event:
            await on_event({"type": event_type, "conversation_id": conversation_id, "data": data})

    response_content = ""
    thinking_content = ""
    tool_calls = []
    metrics = None
    provider = create_chat_provider()

    async for chunk in provider.stream_chat(messages, toolManager.schema()):
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
    stats.set_llm(**metrics)
    return {"thinking": thinking_content, "content": response_content, "tool_calls": tool_calls}
'''

SPEC = {"type": "table", "columns": ["Component", "Purpose"], "rows": [["FastAPI", "Backend"], ["React", "Visual rendering"], ["Nemotron", "Local model"]]}
TABLE = "| Component | Purpose |\n| --- | --- |\n| FastAPI | Backend |\n| React | Visual rendering |\n| Nemotron | Local model |\n"


def build_tool():
    namespace = {}
    exec(patch.patch_tool(ORIGINAL_TOOL), namespace)
    return namespace["CreateVisual"]


async def run_stream(text, tables, failure=None, suppress=True):
    async def stream_chat(messages, tools):
        for character in text:
            yield SimpleNamespace(thinking_delta="", content_delta=character, tool_calls=[], metrics=None)
        if failure:
            raise failure
        yield SimpleNamespace(thinking_delta="", content_delta="", tool_calls=[], metrics={"generated_tokens": len(text)})

    namespace = {
        "create_chat_provider": lambda: SimpleNamespace(stream_chat=stream_chat),
        "DuplicateVisualTableFilter": DuplicateVisualTableFilter,
    }
    source = patch.patch_streaming(ORIGINAL_STREAM)
    tree = ast.parse(source)
    tree.body = [node for node in tree.body if not isinstance(node, ast.ImportFrom)]
    exec(compile(tree, "patched-streaming.py", "exec"), namespace)
    events = []

    async def on_event(event):
        events.append(event)

    tools = SimpleNamespace(tools={"create_visual": SimpleNamespace(created_tables=tables, suppress_duplicate_tables=suppress)}, schema=lambda: [])
    stats = SimpleNamespace(set_llm=lambda **kwargs: None)
    try:
        result = await namespace["streamResponse"]([], tools, stats, on_event=on_event, conversation_id=7)
    except BaseException as error:
        return None, events, error
    return result, events, None


class StreamIntegrationTests(unittest.IsolatedAsyncioTestCase):
    async def test_successful_callback_registers_table(self):
        async def callback(spec):
            return {"visual_id": 1, "block_id": 2}
        tool = build_tool()(callback)
        spec = SimpleNamespace(type="table", model_dump=lambda: SPEC)
        self.assertEqual(await tool.execute(spec), {"visual_id": 1, "block_id": 2})
        self.assertEqual(tool.created_tables, [SPEC])

    async def test_failed_callback_does_not_register(self):
        async def callback(spec):
            return {"error": "Not saved"}
        tool = build_tool()(callback)
        await tool.execute(SimpleNamespace(type="table", model_dump=lambda: SPEC))
        self.assertEqual(tool.created_tables, [])

    async def test_non_table_not_registered(self):
        async def callback(spec):
            return {"visual_id": 1, "block_id": 2}
        tool = build_tool()(callback)
        await tool.execute(SimpleNamespace(type="checklist"))
        self.assertEqual(tool.created_tables, [])

    async def test_filtered_text_matches_emitted_and_returned_content(self):
        text = "Here's the requested table:\n" + TABLE + "\nSource: https://example.test\n"
        result, events, error = await run_stream(text, [SPEC])
        self.assertIsNone(error)
        emitted = "".join(event["data"] for event in events if event["type"] == "content_delta")
        self.assertEqual(emitted, "\nSource: https://example.test\n")
        self.assertEqual(result["content"], emitted)
        self.assertTrue(all(event["conversation_id"] == 7 for event in events))

    async def test_no_registered_table_passes_text_unchanged(self):
        result, events, error = await run_stream(TABLE, [])
        self.assertIsNone(error)
        self.assertEqual(result["content"], TABLE)

    async def test_explicit_opt_out(self):
        result, events, error = await run_stream(TABLE, [SPEC], suppress=False)
        self.assertIsNone(error)
        self.assertEqual(result["content"], TABLE)

    async def test_cancelled_generation_flushes_partial_text(self):
        partial = "Intro.\n| Component | Purpose |\n| --- | --- |\n| FastAPI | Back"
        result, events, error = await run_stream(partial, [SPEC], asyncio.CancelledError())
        self.assertIsInstance(error, asyncio.CancelledError)
        self.assertEqual("".join(event["data"] for event in events), partial)

    async def test_failed_generation_flushes_partial_text(self):
        partial = "Intro without newline"
        result, events, error = await run_stream(partial, [SPEC], RuntimeError("Provider failed"))
        self.assertIsInstance(error, RuntimeError)
        self.assertEqual("".join(event["data"] for event in events), partial)


class PatchApplicationTests(unittest.TestCase):
    def test_applies_once_and_preserves_backups(self):
        with TemporaryDirectory() as directory:
            root = Path(directory)
            tool_path = root / "src/Functions/Tools/createVisual.py"
            stream_path = root / "src/Functions/Agent/streaming.py"
            tool_path.parent.mkdir(parents=True)
            stream_path.parent.mkdir(parents=True)
            tool_path.write_text(ORIGINAL_TOOL)
            stream_path.write_text(ORIGINAL_STREAM)
            previous = Path.cwd()
            try:
                os.chdir(root)
                with redirect_stdout(io.StringIO()):
                    patch.main()
                    first = [tool_path.read_text(), stream_path.read_text()]
                    patch.main()
                self.assertEqual(first, [tool_path.read_text(), stream_path.read_text()])
                self.assertEqual(tool_path.with_name(tool_path.name + ".visual-filter.bak").read_text(), ORIGINAL_TOOL)
                self.assertEqual(stream_path.with_name(stream_path.name + ".visual-filter.bak").read_text(), ORIGINAL_STREAM)
            finally:
                os.chdir(previous)

    def test_unknown_source_aborts_before_writes(self):
        with TemporaryDirectory() as directory:
            root = Path(directory)
            tool_path = root / "src/Functions/Tools/createVisual.py"
            stream_path = root / "src/Functions/Agent/streaming.py"
            tool_path.parent.mkdir(parents=True)
            stream_path.parent.mkdir(parents=True)
            tool_path.write_text(ORIGINAL_TOOL)
            stream_path.write_text("# Source differs from the reviewed implementation\n")
            previous = Path.cwd()
            try:
                os.chdir(root)
                with self.assertRaises(RuntimeError):
                    patch.main()
                self.assertEqual(tool_path.read_text(), ORIGINAL_TOOL)
                self.assertFalse(tool_path.with_name(tool_path.name + ".visual-filter.bak").exists())
            finally:
                os.chdir(previous)


if __name__ == "__main__":
    unittest.main()
