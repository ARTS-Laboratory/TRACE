"""Conservatively suppress tables that repeat successfully created visuals."""

import re


def _text(value):
    value = re.sub(r"\s+", " ", value).strip()
    # Typography-only variants of a whole-cell year range are equivalent.
    # Do not remove punctuation/spacing from general text or numeric values.
    years = re.fullmatch(r"([0-9]{4})\s*[-‐‑‒–—]\s*([0-9]{4})", value)
    if years:
        return f"{years[1]}–{years[2]}"
    return value


def _markdown_text(value):
    value = _text(value)
    for marker in ("**", "__", "`"):
        if value.startswith(marker) and value.endswith(marker) and len(value) > 2 * len(marker):
            value = value[len(marker):-len(marker)]
    return _text(value)


def _cells(line, kind):
    text = line.rstrip("\r\n")
    if kind == "tsv":
        return text.strip(" ").split("\t") if "\t" in text else None
    text = text.strip()
    parts = []
    cell = []
    index = 0
    found = False
    while index < len(text):
        if text[index:index + 2] == "\\|":
            cell.append("|")
            index += 2
            continue
        if text[index] == "|":
            parts.append("".join(cell))
            cell = []
            found = True
        else:
            cell.append(text[index])
        index += 1
    if not found:
        return None
    parts.append("".join(cell))
    if text.startswith("|"):
        parts = parts[1:]
    if text.endswith("|") and not text.endswith("\\|"):
        parts = parts[:-1]
    return parts


class DuplicateVisualTableFilter:
    """Buffers candidate tables; releases anything that isn't a complete match.

    Only tables matching all columns and all rows, in order, are suppressed.
    Code fences, changed data, citations in cells, and incomplete tables survive.
    Tables preceding their visual creation are outside this filter's scope.
    """

    def __init__(self, specs):
        self.tables = [
            (
                tuple(_text(cell) for cell in spec["columns"]),
                tuple(tuple(_text(cell) for cell in row) for row in spec["rows"]),
            )
            for spec in specs if spec.get("type") == "table"
        ]
        self.pending = ""
        self.intro = ""
        self.candidate = None
        self.fence = None
        self.max_buffer = 262144

    def feed(self, text):
        if not self.tables:
            return text
        self.pending += text
        output = []
        while "\n" in self.pending:
            line, self.pending = self.pending.split("\n", 1)
            output.append(self._line(line + "\n"))
        # Bound delayed content. Never discard text when limits are exceeded.
        buffered = len(self.pending) + len(self.intro)
        if self.candidate:
            buffered += sum(map(len, self.candidate["raw"]))
        if buffered > self.max_buffer:
            output.append(self._release())
            output.append(self.intro + self.pending)
            self.intro = self.pending = ""
            # Pass the rest of this model response through unchanged.
            self.tables = []
        return "".join(output)

    def finish(self):
        result = self._line(self.pending) if self.pending else ""
        self.pending = ""
        return result + self._resolve() + self._take_intro()

    def _take_intro(self):
        text, self.intro = self.intro, ""
        return text

    def _release(self):
        if self.candidate is None:
            return ""
        text = "".join(self.candidate["raw"])
        self.candidate = None
        return text

    def _resolve(self):
        candidate = self.candidate
        if candidate is None:
            return ""
        rows = tuple(candidate["rows"])
        if candidate["ready"] and any(
            header == candidate["header"] and expected == rows
            for header, expected in self.tables
        ):
            self.candidate = None
            return ""
        return self._release()

    def _line(self, line):
        if self.candidate is not None:
            candidate = self.candidate
            cells = _cells(line, candidate["kind"])
            if not candidate["ready"]:
                if cells is not None and len(cells) == len(candidate["header"]) and all(
                    re.fullmatch(r":?-{3,}:?", cell.strip()) for cell in cells
                ):
                    candidate["raw"].append(line)
                    candidate["ready"] = True
                    return ""
                # A header-shaped line without a separator isn't a Markdown table.
                return self._release() + self._line(line)
            if cells is not None and len(cells) == len(candidate["header"]):
                normalize = _markdown_text if candidate["kind"] == "pipe" else _text
                candidate["rows"].append(tuple(normalize(cell) for cell in cells))
                candidate["raw"].append(line)
                return ""
            if cells is not None:
                # A malformed extra row must not turn a changed table into a match.
                return self._release() + line
            return self._resolve() + self._line(line)

        stripped = line.strip()
        fence = re.match(r"^ {0,3}(`{3,}|~{3,})(.*)$", line.rstrip("\r\n"))
        if self.fence:
            if fence and fence[1][0] == self.fence[0] and len(fence[1]) >= self.fence[1] and not fence[2].strip():
                self.fence = None
            return self._take_intro() + line
        if fence:
            self.fence = (fence[1][0], len(fence[1]))
            return self._take_intro() + line
        if line.startswith(("    ", "\t")):
            return self._take_intro() + line

        intros = {"here’s the requested table:", "here's the requested table:", "here is the requested table:", "here’s the table:", "here's the table:", "here is the table:"}
        if stripped.casefold() in intros:
            previous = self._take_intro()
            self.intro = line
            return previous
        if not stripped and self.intro:
            self.intro += line
            return ""

        for kind in ("pipe", "tsv"):
            cells = _cells(line, kind)
            if cells is None:
                continue
            normalize = _markdown_text if kind == "pipe" else _text
            header = tuple(normalize(cell) for cell in cells)
            if any(header == expected for expected, _ in self.tables):
                self.candidate = {
                    "kind": kind,
                    "header": header,
                    "rows": [],
                    "raw": [self._take_intro(), line],
                    "ready": kind == "tsv",
                }
                return ""
        return self._take_intro() + line
