"""Marker JSON -> the document/chunk schema used by the Docling path.

No models are loaded on import. Only the tokenizer is needed; no embeddings are
computed. Tables and images remain available even when they have no chunk text.
"""

from __future__ import annotations

import copy
import hashlib
import json
import re
from dataclasses import dataclass, field
from html.parser import HTMLParser
from importlib.metadata import PackageNotFoundError, version
from pathlib import Path
from typing import Any

try:
    import semchunk
except ImportError:
    semchunk = None


@dataclass
class _Node:
    tag: str
    attrs: dict = field(default_factory=dict)
    children: list = field(default_factory=list)
    parent: Any = None


class _HTMLTree(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.root = _Node("root")
        self.stack = [self.root]
        self.feed(html)
        self.close()

    def handle_starttag(self, tag, attrs):
        node = _Node(tag, dict(attrs), parent=self.stack[-1])
        self.stack[-1].children.append(node)
        if tag not in {"br", "hr", "img", "input", "meta", "link", "wbr", "source"}:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def _nodes(node, tag):
    for child in node.children:
        if isinstance(child, _Node):
            if child.tag == tag:
                yield child
            yield from _nodes(child, tag)


def _text(node):
    if isinstance(node, str):
        return node
    if node.tag in {"content-ref", "script", "style"}:
        return ""
    if node.tag == "br":
        return "\n"
    if node.tag == "math" and (
        node.attrs.get("alttext") or node.attrs.get("aria-label")
    ):
        return node.attrs.get("alttext") or node.attrs["aria-label"]
    text = "".join(_text(child) for child in node.children)
    if node.tag == "li":
        text = "- " + text
    if node.tag in {"p", "div", "li", "h1", "h2", "h3", "h4", "h5", "h6", "pre"}:
        return "\n" + text + "\n"
    return text


def _clean(text):
    return "\n".join(
        line
        for line in (
            re.sub(r"[\t \r\f\v]+", " ", line).strip() for line in text.splitlines()
        )
        if line
    )


PARSING_CHUNKING_VERSION = "marker-text-v2"
CONTAINERS = {"Document", "Page", "ListGroup", "TableGroup", "FigureGroup"}
VISUALS = {"Picture", "Figure", "Diagram"}
FURNITURE = {"PageHeader", "PageFooter"}


def load_marker_json(json_path: Path) -> dict:
    document = json.loads(Path(json_path).read_text(encoding="utf-8"))
    if not isinstance(document, dict) or document.get("block_type") != "Document":
        raise ValueError("Expected a Marker Document JSON object")
    return document


def extract_marker_blocks(document: dict) -> list[dict]:
    records, seen_ids = [], set()

    def walk(block, parent_id=None, page_number=None):
        block_id = block.get("id")
        children = block.get("children") or []
        if block_id:
            if block_id in seen_ids:
                raise ValueError(f"Duplicate Marker block ID: {block_id}")
            seen_ids.add(block_id)
            match = re.match(r"^/page/(\d+)/", block_id)
            if match:
                page_number = int(match.group(1)) + 1
            records.append(
                {
                    "source_ref": block_id,
                    "parent_ref": parent_id,
                    "block_type": block.get("block_type"),
                    "page_numbers": [page_number] if page_number is not None else [],
                    "html": block.get("html") or "",
                    "heading_refs": dict(block.get("section_hierarchy") or {}),
                    "child_refs": [
                        child["id"] for child in children if child.get("id")
                    ],
                    "images": block.get("images") or {},
                    "bbox": block.get("bbox"),
                    "polygon": block.get("polygon"),
                    "is_container": block.get("block_type") in CONTAINERS,
                }
            )
        for child in children:
            walk(child, block_id or parent_id, page_number)

    walk(document)
    return records


def html_to_text(html: str) -> str:
    """Extract prose without repeating content-ref children; preserve inline spacing."""
    return _clean(_text(_HTMLTree(html).root))


def _headings(block: dict, index: dict) -> list[str]:
    headings = []
    for level, reference in sorted(
        block["heading_refs"].items(), key=lambda pair: int(pair[0])
    ):
        if reference not in index:
            raise ValueError(f"Missing heading {reference} for {block['source_ref']}")
        text = html_to_text(index[reference]["html"])
        if text:
            headings.append(text)
    return headings


def _effective_heading_contexts(blocks: list[dict], index: dict) -> dict:
    """Prefer explicit section numbers to inconsistent HTML heading ranks.

    All changes are derived; the source heading_refs are retained unchanged.
    Unnumbered subsections use HTML levels, with known section boundaries reset.
    """
    contexts, numbered = {}, {}
    stack = []
    last_numbered = None
    root_names = {
        "references",
        "bibliography",
        "appendix",
        "appendices",
        "acknowledgments",
        "acknowledgements",
    }
    for block in blocks:
        if block["block_type"] != "SectionHeader":
            continue
        text = html_to_text(block["html"])
        tag = re.search(r"<h([1-6])\b", block["html"], re.IGNORECASE)
        html_level = int(tag.group(1)) if tag else 1
        number = re.match(r"^(\d+(?:\.\d+)*)(?:[.)])?\s+\S", text)
        if number:
            path = tuple(int(part) for part in number.group(1).split("."))
            parents = [
                numbered[path[:n]] for n in range(1, len(path)) if path[:n] in numbered
            ]
            stack = [*parents, (len(path), text)]
            # A repeated top-level number starts a new local section-number scope.
            numbered = {
                key: value
                for key, value in numbered.items()
                if key[0] == path[0] and len(key) < len(path)
            }
            numbered[path] = (len(path), text)
            last_numbered = (html_level, list(stack))
        elif text.casefold().rstrip(":") in root_names:
            stack = [(1, text)]
            numbered, last_numbered = {}, None
        elif last_numbered is not None and html_level >= last_numbered[0]:
            # Unnumbered scientific subheads following e.g. section 3.2.
            base = last_numbered[1]
            stack = [*base, (base[-1][0] + 1, text)]
        else:
            stack = [entry for entry in stack if entry[0] < html_level]
            stack.append((html_level, text))
        contexts[block["source_ref"]] = [value for _, value in stack if value]
    result = {}
    for block in blocks:
        original = _headings(block, index)  # also validates source references
        refs = sorted(block["heading_refs"].items(), key=lambda pair: int(pair[0]))
        deepest = refs[-1][1] if refs else None
        result[block["source_ref"]] = contexts.get(deepest, original)
    return result


def apply_reviewed_corrections(
    blocks: list[dict], document_id: str, corrections: dict | None
) -> tuple[list[dict], list[dict]]:
    """Apply explicitly reviewed, hash-guarded overrides without altering the JSON.

    Overrides are specific to one source-file ID and exact extracted HTML. Excluded
    blocks remain in document-level audit records and in the original saved JSON.
    """
    if corrections is None:
        return blocks, []
    if corrections.get("document_id") != document_id:
        raise ValueError("Reviewed corrections belong to a different source document")
    copied = copy.deepcopy(blocks)
    index = {b["source_ref"]: b for b in copied}
    audit = []
    for override in corrections.get("blocks", []):
        reference = override["source_ref"]
        if reference not in index:
            raise ValueError(f"Correction references missing block: {reference}")
        block = index[reference]
        digest = hashlib.sha256(block["html"].encode("utf-8")).hexdigest()
        if digest != override["expected_html_sha256"]:
            raise ValueError(
                f"Extracted HTML changed for {reference}; re-review correction"
            )
        if not override.get("reason") or not override.get("evidence"):
            raise ValueError("Reviewed corrections require a reason and evidence")
        original = block["html"]
        if "replacement_html" in override:
            block["html"] = override["replacement_html"]
            block["original_html"] = original
        if override.get("exclude_from_index"):
            block["exclude_from_index"] = True
        entry = {**override, "original_html": original}
        audit.append(entry)
    return copied, audit


def _table_data(html: str) -> dict:
    table = next(_nodes(_HTMLTree(html).root, "table"), None)
    if table is None:
        return {
            "num_rows": 0,
            "num_cols": 0,
            "table_cells": [],
            "grid": [],
            "header_rows": 0,
        }
    occupied, cells, header_rows = {}, [], 0

    def nearest(node, tag):
        node = node.parent
        while node is not None:
            if node.tag == tag:
                return node
            node = node.parent
        return None

    rows = [row for row in _nodes(table, "tr") if nearest(row, "table") is table]
    for r, row in enumerate(rows):
        entries = [
            cell
            for cell in row.children
            if isinstance(cell, _Node) and cell.tag in {"td", "th"}
        ]
        if r == header_rows and (
            nearest(row, "thead") or (entries and all(c.tag == "th" for c in entries))
        ):
            header_rows += 1
        col = 0
        for cell in entries:
            while (r, col) in occupied:
                col += 1
            rs, cs = (
                max(1, int(cell.attrs.get("rowspan", 1))),
                max(1, int(cell.attrs.get("colspan", 1))),
            )
            if rs * cs > 10000 or r + rs > 10000 or col + cs > 10000:
                raise ValueError("Unreasonably large HTML table span")
            text = _clean(_text(cell))
            cells.append(
                {
                    "text": text,
                    "start_row_offset_idx": r,
                    "start_col_offset_idx": col,
                    "row_span": rs,
                    "col_span": cs,
                    "column_header": cell.tag == "th"
                    or nearest(row, "thead") is not None,
                }
            )
            for rr in range(r, r + rs):
                for cc in range(col, col + cs):
                    occupied[rr, cc] = text
            col += cs
    nr = max([len(rows)] + [r + 1 for r, _ in occupied])
    nc = max([0] + [c + 1 for _, c in occupied])
    return {
        "num_rows": nr,
        "num_cols": nc,
        "table_cells": cells,
        "grid": [[occupied.get((r, c), "") for c in range(nc)] for r in range(nr)],
        "header_rows": header_rows,
    }


def _markdown_row(cells):
    return (
        "| "
        + " | ".join(
            str(cell).replace("|", r"\|").replace("\n", "<br>") for cell in cells
        )
        + " |"
    )


def extract_marker_assets(blocks: list[dict]) -> dict:
    index = {b["source_ref"]: b for b in blocks}
    assets = {"pictures": [], "tables": []}
    for block in blocks:
        kind = block["block_type"]
        if kind not in VISUALS | {"Table"}:
            continue
        parent = index.get(block["parent_ref"], {})
        # Explicit siblings in a semantic figure/table group; never guess by proximity.
        captions = (
            [
                ref
                for ref in parent.get("child_refs", [])
                if index[ref]["block_type"] == "Caption"
            ]
            if parent.get("block_type") in {"FigureGroup", "TableGroup"}
            else []
        )
        record = {
            "source_ref": block["source_ref"],
            "caption_refs": captions,
            "captions": [html_to_text(index[ref]["html"]) for ref in captions],
            "page_numbers": block["page_numbers"],
            "bbox": block["bbox"],
            "polygon": block["polygon"],
        }
        if kind == "Table":
            record.update(
                {"html": block["html"], "table_data": _table_data(block["html"])}
            )
            assets["tables"].append(record)
        else:
            # Paths are relative to the Marker JSON directory. Do not assume files exist.
            record.update(
                {
                    "image_uri": next(iter(block["images"].values()), None),
                    "images": block["images"],
                    "block_type": kind,
                }
            )
            assets["pictures"].append(record)
    return assets


def initialize_marker_chunking(model_id=None, max_tokens=None) -> dict:
    """Load only the tokenizer, once per batch; no GPU or embedding weights."""
    if model_id is None or max_tokens is None:
        from Functions.Model.config import EMBED_MODEL_ID, MAX_TOKENS

        model_id = model_id if model_id is not None else EMBED_MODEL_ID
        max_tokens = max_tokens if max_tokens is not None else MAX_TOKENS
    from transformers import AutoTokenizer

    return {
        "tokenizer": AutoTokenizer.from_pretrained(model_id),
        "model_id": model_id,
        "max_tokens": max_tokens,
    }


def _counter(tokenizer):
    if hasattr(tokenizer, "count_tokens"):
        return tokenizer.count_tokens
    return lambda text: len(tokenizer.encode(text, add_special_tokens=True))


def chunk_marker_document(
    document: dict,
    document_id: str,
    tokenizer: Any,
    file_name: str | None = None,
    max_tokens: int = 1024,
    model_id: str = "Qwen/Qwen3-Embedding-8B",
    processing_version: str = PARSING_CHUNKING_VERSION,
    reviewed_corrections: dict | None = None,
) -> dict:
    """Return chunking_result plus assets. Fail explicitly rather than truncate content."""
    if not isinstance(document_id, str) or not document_id:
        raise ValueError("A nonempty document_id is required")
    if max_tokens <= 0:
        raise ValueError("max_tokens must be positive")
    blocks, correction_audit = apply_reviewed_corrections(
        extract_marker_blocks(document), document_id, reviewed_corrections
    )
    if reviewed_corrections is not None:
        correction_hash = hashlib.sha256(
            json.dumps(reviewed_corrections, sort_keys=True).encode()
        ).hexdigest()[:12]
        processing_version = f"{processing_version}-review-{correction_hash}"
    index = {b["source_ref"]: b for b in blocks}
    contexts = _effective_heading_contexts(blocks, index)
    heading_audit = [
        {
            "source_ref": b["source_ref"],
            "original_headings": _headings(b, index),
            "effective_headings": contexts[b["source_ref"]],
        }
        for b in blocks
        if contexts[b["source_ref"]] != _headings(b, index)
    ]
    assets = extract_marker_assets(blocks)
    for asset in assets["tables"]:
        source_block = index[asset["source_ref"]]
        if "original_html" in source_block:
            asset["original_html"] = source_block["original_html"]
    asset_index = {a["source_ref"]: a for group in assets.values() for a in group}
    count = _counter(tokenizer)
    chunks, pending = [], []

    def contextualize(text, headings):
        return "\n".join([*headings, text])

    def emit(text, sources, headings, extra=None):
        if not text.strip():
            return
        refs = list(dict.fromkeys(sources))
        context = contextualize(text, headings)
        n = count(context)
        if n > max_tokens:
            raise ValueError(
                f"Final chunk exceeds {max_tokens} tokens ({n}) for {refs}"
            )
        number = len(chunks)
        try:
            marker_version = version("marker-pdf")
        except PackageNotFoundError:
            marker_version = None
        chunks.append(
            {
                "document_id": document_id,
                "chunk_id": f"{document_id}_{processing_version}_{number}",
                "chunk_number": number,
                "source_text": text,
                "embedding_text": context,
                "token_count": n,
                "metadata": {
                    "headings": headings,
                    "labels": sorted({index[r]["block_type"] for r in refs}),
                    "page_numbers": sorted(
                        {p for r in refs for p in index[r]["page_numbers"]}
                    ),
                    "source_refs": refs,
                    "file_name": file_name,
                    "mimetype": "application/pdf",
                    "asset_refs": list(
                        dict.fromkeys(
                            ref
                            for r in refs
                            for ref in [
                                r,
                                *[
                                    a["source_ref"]
                                    for a in asset_index.values()
                                    if r in a["caption_refs"]
                                ],
                            ]
                            if ref in asset_index
                        )
                    ),
                },
                "parser_metadata": {
                    "parser": "marker",
                    "parsing_version": processing_version,
                    "marker_version": marker_version,
                    "tokenizer_model": model_id,
                    "max_tokens": max_tokens,
                    "splitter": "semchunk"
                    if semchunk is not None
                    else "boundary_fallback",
                    "full_metadata": {"blocks": [index[r] for r in refs]},
                    **(extra or {}),
                },
            }
        )

    def split(text, headings, prefix=""):
        if count(contextualize(prefix, headings)) >= max_tokens:
            raise ValueError(
                "Headings/table headers exhaust the chunk budget; increase the budget"
            )
        if count(contextualize(prefix + text, headings)) <= max_tokens:
            return [prefix + text]
        if semchunk is not None:
            splitter = semchunk.chunkerify(
                lambda part: count(contextualize(prefix + part, headings)),
                chunk_size=max_tokens,
            )
            parts = splitter(text)
            if parts and all(
                count(contextualize(prefix + p, headings)) <= max_tokens for p in parts
            ):
                return [prefix + part for part in parts]
        # Offline fallback: prefer paragraph/sentence/word boundaries, and verify
        # each final string with the caller's real tokenizer. No text truncation.
        remaining, result = text, []
        while remaining:
            low, high, best = 1, len(remaining), 0
            while low <= high:
                middle = (low + high) // 2
                if (
                    count(contextualize(prefix + remaining[:middle], headings))
                    <= max_tokens
                ):
                    best, low = middle, middle + 1
                else:
                    high = middle - 1
            if not best:
                raise ValueError(
                    "One character plus its context exceeds the token budget"
                )
            end = best
            if best < len(remaining):
                boundaries = [
                    m.end()
                    for m in re.finditer(r"\n\n|[.!?]\s+|\s+", remaining[:best])
                    if m.end() >= best // 2
                ]
                if boundaries:
                    end = boundaries[-1]
            part, remaining = remaining[:end], remaining[end:]
            if part.strip():
                result.append(prefix + part.strip())
        return result

    def flush():
        if pending:
            emit(
                "\n\n".join(p[0] for p in pending),
                [p[1] for p in pending],
                pending[0][2],
            )
            pending.clear()

    def table_chunks(block, headings):
        data = asset_index[block["source_ref"]]["table_data"]
        grid, nh = data["grid"], data["header_rows"]
        if not grid:
            for part in split(html_to_text(block["html"]), headings):
                emit(part, [block["source_ref"]], headings)
            return
        # Without explicit headers, generate neutral column labels; first data row stays data.
        head = (
            [_markdown_row(row) for row in grid[:nh]]
            if nh
            else [_markdown_row([f"Column {i + 1}" for i in range(data["num_cols"])])]
        )
        header = (
            "\n".join([head[0], _markdown_row(["---"] * data["num_cols"]), *head[1:]])
            + "\n"
        )
        body = grid[nh:]
        if not body:
            emit(header.rstrip(), [block["source_ref"]], headings)
            return
        batch, start = [], nh
        for row_no, row in enumerate(body, nh):
            line = _markdown_row(row)
            candidate = header + "\n".join([*batch, line])
            if batch and count(contextualize(candidate, headings)) > max_tokens:
                emit(
                    header + "\n".join(batch),
                    [block["source_ref"]],
                    headings,
                    {"table_row_range": [start, row_no]},
                )
                batch, start = [], row_no
            if count(contextualize(header + line, headings)) > max_tokens:
                # Exceptional wide row: preserve every character in fragments with headers.
                for part in split(line, headings, prefix=header):
                    emit(
                        part,
                        [block["source_ref"]],
                        headings,
                        {"table_row_range": [row_no, row_no + 1], "row_fragment": True},
                    )
                start = row_no + 1
            else:
                batch.append(line)
        if batch:
            emit(
                header + "\n".join(batch),
                [block["source_ref"]],
                headings,
                {"table_row_range": [start, nh + len(body)]},
            )

    # Tables serialize descendants atomically; do not also index their cell children.
    def under_table(block):
        parent = block["parent_ref"]
        while parent in index:
            if index[parent]["block_type"] == "Table":
                return True
            parent = index[parent]["parent_ref"]
        return False

    for block in blocks:
        kind = block["block_type"]
        if (
            block.get("exclude_from_index")
            or kind in FURNITURE
            or kind in VISUALS
            or under_table(block)
        ):
            continue
        if kind == "SectionHeader":
            flush()
            continue
        text = html_to_text(block["html"])
        if block["is_container"] and not text:
            # Usually content-ref-only. Preserve any actual literal text once.
            continue
        headings = contexts[block["source_ref"]]
        if kind == "Table":
            flush()
            table_chunks(block, headings)
        elif text:
            if kind in {"Caption", "Footnote", "Equation", "Formula", "Code"}:
                flush()
                for part in split(text, headings):
                    emit(part, [block["source_ref"]], headings)
                continue
            for part in split(text, headings):
                candidate = "\n\n".join([*[p[0] for p in pending], part])
                if pending and (
                    pending[0][2] != headings
                    or count(contextualize(candidate, headings)) > max_tokens
                ):
                    flush()
                pending.append((part, block["source_ref"], headings))
    flush()
    return {
        "chunking_result": {
            "document_id": document_id,
            "chunk_count": len(chunks),
            "chunks": chunks,
            "token_overflow": [],
            "quality_report": {
                "heading_corrections": heading_audit,
                "reviewed_corrections": correction_audit,
            },
        },
        "assets": assets,
    }
