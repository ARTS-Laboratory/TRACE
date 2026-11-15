import sys
from pathlib import Path
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from Functions.Visuals.duplicate_tables import DuplicateVisualTableFilter


SPEC = {"type": "table", "columns": ["Component", "Purpose"], "rows": [
    ["FastAPI", "Backend"], ["React", "Visual rendering"], ["Nemotron", "Local model"],
]}
TABLE = "| Component | Purpose |\n| --- | --- |\n| FastAPI | Backend |\n| React | Visual rendering |\n| Nemotron | Local model |\n"


def run_filter(text, specs=None, width=1):
    worker = DuplicateVisualTableFilter([SPEC] if specs is None else specs)
    output = [worker.feed(text[i:i + width]) for i in range(0, len(text), width)]
    output.append(worker.finish())
    return "".join(output)


class DuplicateTableTests(unittest.TestCase):
    def test_matching_table_at_every_chunk_width(self):
        for width in range(1, len(TABLE) + 1):
            with self.subTest(width=width):
                self.assertEqual(run_filter(TABLE, width=width), "")

    def test_explanations_and_sources_survive(self):
        text = "Explanation before.\n\n" + TABLE + "\nSource: https://example.test/source\nExplanation after."
        self.assertEqual(run_filter(text), "Explanation before.\n\n\nSource: https://example.test/source\nExplanation after.")

    def test_exact_boilerplate_intro_removed_with_duplicate(self):
        text = "Here’s the requested table:\n\n" + TABLE
        self.assertEqual(run_filter(text), "")

    def test_intro_before_different_table_preserved(self):
        text = "Here's the requested table:\n\n" + TABLE.replace("Backend", "Different")
        self.assertEqual(run_filter(text), text)

    def test_changed_data_preserved(self):
        text = TABLE.replace("Backend", "Backend server")
        self.assertEqual(run_filter(text), text)

    def test_changed_columns_preserved(self):
        text = TABLE.replace("Purpose", "Description")
        self.assertEqual(run_filter(text), text)

    def test_extra_row_preserved(self):
        text = TABLE + "| Another | Value |\n"
        self.assertEqual(run_filter(text), text)

    def test_missing_row_preserved(self):
        text = TABLE[:TABLE.rfind("| Nemotron")]
        self.assertEqual(run_filter(text), text)

    def test_malformed_extra_row_preserves_entire_table(self):
        text = TABLE + "| extra | invalid | third cell |\n"
        self.assertEqual(run_filter(text), text)

    def test_truncated_extra_row_preserves_entire_table(self):
        text = TABLE + "| extra"
        self.assertEqual(run_filter(text), text)

    def test_row_order_preserved(self):
        text = TABLE.replace("| FastAPI | Backend |\n| React | Visual rendering |", "| React | Visual rendering |\n| FastAPI | Backend |")
        self.assertEqual(run_filter(text), text)

    def test_fenced_code_preserved(self):
        for fence in ["```", "~~~~"]:
            text = fence + "markdown\n" + TABLE + fence + "\n"
            self.assertEqual(run_filter(text), text)

    def test_indented_code_preserved(self):
        text = "".join("    " + line for line in TABLE.splitlines(keepends=True))
        self.assertEqual(run_filter(text), text)

    def test_alignment_and_optional_outer_pipes(self):
        text = TABLE.replace("| --- | --- |", "| :--- | ---: |").replace("| Component | Purpose |", "Component | Purpose")
        self.assertEqual(run_filter(text), "")

    def test_bold_cells(self):
        self.assertEqual(run_filter(TABLE.replace("FastAPI", "**FastAPI**")), "")

    def test_cell_citations_preserved(self):
        text = TABLE.replace("FastAPI", "[FastAPI](https://example.test)")
        self.assertEqual(run_filter(text), text)

    def test_plain_text_and_no_successful_visual(self):
        text = "Regular text streams.\nAnother paragraph without a newline."
        self.assertEqual(run_filter(text), text)
        worker = DuplicateVisualTableFilter([])
        self.assertEqual(worker.feed(TABLE), TABLE)
        self.assertEqual(worker.finish(), "")

    def test_tab_separated_copy(self):
        text = "Component\tPurpose\nFastAPI\tBackend\nReact\tVisual rendering\nNemotron\tLocal model"
        self.assertEqual(run_filter(text), "")

    def test_empty_tsv_cells(self):
        spec = {"type": "table", "columns": ["A", "B"], "rows": [["x", ""]]}
        self.assertEqual(run_filter("A\tB\nx\t\n", [spec]), "")

    def test_escaped_pipe(self):
        spec = {"type": "table", "columns": ["A", "B"], "rows": [["x|y", "z"]]}
        self.assertEqual(run_filter("| A | B |\n| --- | --- |\n| x\\|y | z |\n", [spec]), "")

    def test_multiple_visuals_and_duplicates(self):
        second = {"type": "table", "columns": ["Name", "Value"], "rows": [["X", "1"]]}
        text = TABLE + "\nBetween.\n\n| Name | Value |\n| --- | --- |\n| X | 1 |\n"
        self.assertEqual(run_filter(text, [SPEC, second]), "\nBetween.\n\n")

    def test_partial_cancellation_flush_and_repeated_finish(self):
        text = "Intro.\n| Component | Purpose |\n| --- | --- |\n| FastAPI | Back"
        worker = DuplicateVisualTableFilter([SPEC])
        result = worker.feed(text) + worker.finish()
        self.assertEqual(result, text)
        self.assertEqual(worker.finish(), "")

    def test_literal_formatting_in_visual_not_equivalent_to_plain_data(self):
        spec = {**SPEC, "rows": [["**FastAPI**", "Backend"], *SPEC["rows"][1:]]}
        self.assertEqual(run_filter(TABLE, [spec]), TABLE)

    def test_buffer_limit_preserves_text(self):
        text = "x" * 1000 + "\n" + TABLE
        worker = DuplicateVisualTableFilter([SPEC])
        worker.max_buffer = 100
        self.assertEqual(worker.feed(text[:200]) + worker.feed(text[200:]) + worker.finish(), text)

    def test_reported_intel_typographic_year_ranges(self):
        spec = {"type": "table", "columns": ["Name", "Tenure"], "rows": [
            ["Pat Gelsinger", "2021–2024"], ["Brian Krzanich", "2013–2018"],
            ["Paul Otellini", "2005–2013"], ["Craig Barrett", "1998–2005"],
            ["Andrew Grove", "1987–1998"],
        ]}
        # Fixture reproduces the reported output; it is not a verified CEO list.
        table = "| Name | Tenure |\n| --- | --- |\n" + "".join(
            f"| {name} | {years.replace('–', chr(0x202f) + '–' + chr(0x202f))} |\n"
            for name, years in spec["rows"]
        )
        for width in range(1, len(table) + 1):
            with self.subTest(width=width):
                self.assertEqual(run_filter(table, [spec], width), "")

    def test_year_range_whitespace_and_dash_variants(self):
        spec = {"type": "table", "columns": ["Name", "Tenure"], "rows": [["A", "2021–2024"]]}
        for dash in ["-", "‐", "‑", "‒", "–", "—"]:
            for space in ["", " ", "\u202f", "\u00a0"]:
                text = f"| Name | Tenure |\n| --- | --- |\n| A | 2021{space}{dash}{space}2024 |\n"
                self.assertEqual(run_filter(text, [spec]), "")

    def test_changed_year_range_preserved(self):
        spec = {"type": "table", "columns": ["Name", "Tenure"], "rows": [["A", "2021–2024"]]}
        text = "| Name | Tenure |\n| --- | --- |\n| A | 2021 – 2025 |\n"
        self.assertEqual(run_filter(text, [spec]), text)

    def test_general_numbers_and_punctuation_not_collapsed(self):
        spec = {"type": "table", "columns": ["Name", "Value"], "rows": [["A", "10–20"]]}
        text = "| Name | Value |\n| --- | --- |\n| A | 10 – 20 |\n"
        self.assertEqual(run_filter(text, [spec]), text)

    def test_reported_tsv_year_ranges_and_sources(self):
        spec = {"type": "table", "columns": ["Name", "Tenure"], "rows": [["A", "2021–2024"]]}
        text = "Name\tTenure\nA\t2021\u202f–\u202f2024\n\nSource: https://example.test\n"
        self.assertEqual(run_filter(text, [spec]), "\nSource: https://example.test\n")

    def test_year_ranges_in_fenced_code_preserved(self):
        spec = {"type": "table", "columns": ["Name", "Tenure"], "rows": [["A", "2021–2024"]]}
        text = "```markdown\n| Name | Tenure |\n| --- | --- |\n| A | 2021 – 2024 |\n```\n"
        self.assertEqual(run_filter(text, [spec]), text)


if __name__ == "__main__":
    unittest.main()
