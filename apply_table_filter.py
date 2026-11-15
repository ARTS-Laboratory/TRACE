"""Apply the scoped filter to the previously reviewed GlorpCat source.

Run from the Glorp-Cat repository root after extracting this overlay.
All expected sections are checked before either existing file is modified.
"""

import ast
from pathlib import Path
import re


IMPORT = "from Functions.Visuals.duplicate_tables import DuplicateVisualTableFilter"


def once(source, old, new, label):
    if source.count(old) != 1:
        raise RuntimeError(f"{label}: expected one matching source section; no files changed.")
    return source.replace(old, new, 1)


def patch_tool(source):
    source = once(
        source,
        "        self.on_create_visual = on_create_visual",
        "        self.on_create_visual = on_create_visual\n        self.created_tables = []\n        self.suppress_duplicate_tables = True",
        "CreateVisual constructor",
    )
    pattern = r"(?m)^(?P<indent> +)result = await self\.on_create_visual\(spec\)\n[ \t]*\n(?P=indent)return result"
    matches = list(re.finditer(pattern, source))
    if len(matches) != 1:
        raise RuntimeError("CreateVisual execute: expected reviewed callback/return section; no files changed.")
    indent = matches[0]["indent"]
    replacement = "\n".join(indent + line if line else "" for line in [
        "result = await self.on_create_visual(spec)",
        "",
        "if (",
        "    spec.type == \"table\"",
        "    and isinstance(result, dict)",
        "    and \"error\" not in result",
        "    and \"visual_id\" in result",
        "    and \"block_id\" in result",
        "):",
        "    self.created_tables.append(spec.model_dump())",
        "",
        "return result",
    ])
    return source[:matches[0].start()] + replacement + source[matches[0].end():]


def patch_streaming(source):
    source = once(
        source,
        "from Functions.Model.providers.registry import create_chat_provider",
        "from Functions.Model.providers.registry import create_chat_provider\n" + IMPORT,
        "Streaming import",
    )
    source = once(
        source,
        "    provider = create_chat_provider()",
        "    visual_tool = toolManager.tools.get(\"create_visual\")\n"
        "    duplicate_filter = DuplicateVisualTableFilter(\n"
        "        getattr(visual_tool, \"created_tables\", [])\n"
        "        if getattr(visual_tool, \"suppress_duplicate_tables\", True) else []\n"
        "    )\n\n"
        "    provider = create_chat_provider()",
        "Filter setup",
    )
    source = once(
        source,
        '        if chunk.content_delta:\n'
        '            response_content += chunk.content_delta\n'
        '            await emit("content_delta", chunk.content_delta)',
        '        if chunk.content_delta:\n'
        '            visible = duplicate_filter.feed(chunk.content_delta)\n'
        '            if visible:\n'
        '                response_content += visible\n'
        '                await emit("content_delta", visible)',
        "Content forwarding",
    )
    tree = ast.parse(source)
    functions = [node for node in tree.body if isinstance(node, ast.AsyncFunctionDef) and node.name == "streamResponse"]
    if len(functions) != 1:
        raise RuntimeError("Cannot locate streamResponse; no files changed.")
    loops = [node for node in functions[0].body if isinstance(node, ast.AsyncFor)]
    if len(loops) != 1:
        raise RuntimeError("Expected one provider loop in streamResponse; no files changed.")
    loop = loops[0]
    lines = source.splitlines(keepends=True)
    replacement = ["    try:\n"]
    replacement.extend("    " + line if line.strip() else line for line in lines[loop.lineno - 1:loop.end_lineno])
    if not replacement[-1].endswith("\n"):
        replacement[-1] += "\n"
    replacement.extend([
        "    finally:\n",
        "        # Flush unmatched/partial text on completion, cancellation, or failure.\n",
        "        remaining = duplicate_filter.finish()\n",
        "        if remaining:\n",
        "            response_content += remaining\n",
        "            await emit(\"content_delta\", remaining)\n",
    ])
    return "".join(lines[:loop.lineno - 1] + replacement + lines[loop.end_lineno:])


def main():
    paths = [Path("src/Functions/Tools/createVisual.py"), Path("src/Functions/Agent/streaming.py")]
    if not all(path.is_file() for path in paths):
        raise SystemExit("Run this script from the Glorp-Cat repository root.")
    originals = [path.read_text() for path in paths]
    applied = ["self.created_tables = []" in originals[0], IMPORT in originals[1]]
    if all(applied):
        print("Table filter integration is already present; no existing files changed.")
        return
    if any(applied):
        raise SystemExit("Partial integration detected. No files changed; inspect both source files.")
    updated = [patch_tool(originals[0]), patch_streaming(originals[1])]
    for path, text in zip(paths, updated):
        compile(text, str(path), "exec")
        backup = path.with_name(path.name + ".visual-filter.bak")
        if backup.exists():
            raise SystemExit(f"Backup already exists: {backup}. No files changed; inspect before proceeding.")
    for path, original, text in zip(paths, originals, updated):
        path.with_name(path.name + ".visual-filter.bak").write_text(original)
        path.write_text(text)
        print(f"Updated {path}")


if __name__ == "__main__":
    main()
