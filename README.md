# Suppress duplicate visual tables

This backend overlay filters complete Markdown or tab-separated tables that
repeat a table successfully created by create_visual during the current turn.
No npm dependency or frontend rebuild is required.

## Year-range typography fix

The reported Intel table escaped the initial filter because tool arguments used
2021–2024 while Markdown used narrow no-break spaces around the dash. Whole-cell
four-digit year ranges now normalize spacing and common dash typography before
comparison. Changed years remain different. Other numeric ranges and general
punctuation are not normalized. The reported five-row output is included as a
regression fixture only; these tests do not validate the factual CEO selection.

If the initial integration is already installed, re-extract this updated archive.
The apply script reports that integration is already present; that is expected.
The updated helper and tests still need the application container rebuilt.

## Apply

Extract at the Glorp-Cat repository root, preserving paths. Then run:

    cd /home/thienan/Documents/GitHub/Glorp-Cat
    python3 apply_table_filter.py
    python3 -m unittest discover -s tests -p 'test_*visual_table*.py' -v
    docker compose up -d --build glorpcat

Run the commands in sequence, continuing only after each succeeds. The apply
script checks the reviewed source sections and compiles both updated modules
before writing. If your source differs, it stops without modifying either
existing source file. Paste that error rather than forcing the patch.

The script changes:
- src/Functions/Tools/createVisual.py
- src/Functions/Agent/streaming.py

The overlay adds:
- src/Functions/Visuals/duplicate_tables.py
- tests/test_duplicate_visual_tables.py
- tests/test_visual_table_integration.py
- apply_table_filter.py

The first application preserves original source beside each changed file as
createVisual.py.visual-filter.bak and streaming.py.visual-filter.bak. It refuses
to overwrite existing backups and is a no-op when both integration markers
already exist. Normal source differences should be reviewed with git diff.

No server.py, agent.py, schemas, database, or frontend source is replaced.
Existing prompt guidance and the temporary per-turn reminder may remain.

## Retest

Use a new conversation and ask:

> Create a table titled "Components" with columns Component and Purpose. Use
> exactly these rows: FastAPI / Backend; React / Visual rendering; Nemotron /
> Local model.

Expect a single inline visual. An exact duplicate Markdown table is suppressed,
including the specific "Here's the requested table:" boilerplate when directly
followed by that duplicate. Other explanatory text is retained. Refresh to verify
the duplicate is absent from saved response blocks too. Existing saved messages
are not rewritten; this applies only to new generation after deployment.

Also test a requested explanation and source attribution after a visual, a
normal non-visual answer, cancellation partway through an explanation, and
another visual in the same turn. Unmatched text should be retained.

## How it works

CreateVisual records validated table specifications only after its callback
returns visual_id and block_id without an error. The temporary tool instance
already lasts only for one active chat turn, so previous turns do not register
tables for suppression.

Each model streaming pass takes the already-created table specifications and
filters content_delta before forwarding it. The same filtered text is returned
to the agent conversation. Your existing server persists forwarded text as
response_text and response blocks, so displayed and saved text agree.

The filter compares all column headings and all rows in order, normalizing
whitespace and a small set of Markdown wrappers. It suppresses only a complete
match. Changed values, extra or missing rows, reordered rows, changed headings,
and citations embedded in cells are preserved. Fenced and indented code are
also preserved. Explicit source links outside the table remain in the output.

Content passes through immediately when there is no registered visual table.
After a table is registered, ordinary text is released one completed line at a
time; candidate tables are held until their boundary or stream completion so
they never flash on screen before being removed. A trailing line is flushed at
completion, cancellation, or provider failure. This adds line-level latency to
post-table text, rather than holding the entire response. Candidate buffering
is capped at 256 KiB; exceeding that limit preserves text and disables filtering
for the remainder of that model pass.

## Scope

This fixes the observed duplicate-table format without another model request.
It is not universal semantic deduplication. It does not suppress paraphrased
prose, HTML tables, altered data, or tables generated before their visual is
successfully created. It does not verify factual correctness. Checklists and
other visual types are outside this change.

By default, identical tables after a created visual are suppressed even if
the model intended to repeat them. For an application flow that explicitly
requires both representations, set visual_tool.suppress_duplicate_tables = False
before agent.chat. Natural-language opt-out detection is not implemented.

## Validation

40 tests passed in the preparation environment: 30 filter tests and 10
integration/patch tests. Tests cover every chunk width for the Components
example, TSV text, formatting, preservation cases, partial tables, code fences,
multiple visuals, bounded buffering, success/failure registration, consistent
emitted/returned text, cancellation, provider errors, explicit opt-out, patch
idempotency, backups, and rejection of unexpected source before writes.

Integration tests use the reviewed streaming control flow with a fake provider;
they do not run your live model, FastAPI server, or actual database. Run the
tests against your extracted files and verify the new response in the browser.

## Rollback

Restore createVisual.py and streaming.py from their .visual-filter.bak copies,
then rebuild glorpcat. Added helper/tests can remain unused or be removed.
