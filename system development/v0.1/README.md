# GlorpCat

GlorpCat is a local AI agent designed around local language models, tool calling, and extensible MCP-based tools. It can be used through either the **Browser UI** or the original **CLI interface**.

> **Important:** GlorpCat requires a model that supports **thinking/reasoning and tool calling**. Models without reliable tool-calling support may still generate normal responses, but agent features and MCP tools may not work correctly.

---

## Starting GlorpCat

### Browser UI — Recommended

The browser UI is the recommended way to use GlorpCat.

From the GlorpCat project directory, activate your Python virtual environment:

```bash
source .venv/bin/activate
```

Start the **FastAPI server**:

```bash
uvicorn Web.server:app --reload --reload-exclude "**/Data/media/**"
```

`--reload` is useful during development because the FastAPI server automatically restarts when Python source files change.

Once the server starts, Uvicorn will display an address similar to:

```text
INFO:     Uvicorn running on http://127.0.0.1:8000
```

Open the following address in your browser:

```text
http://127.0.0.1:8000
```

Keep the terminal running while using GlorpCat. Press `Ctrl+C` when you want to stop the FastAPI server.

If the browser UI uses a separate frontend development server, start it in another terminal after activating the required environment.

---

## Model Requirements

GlorpCat is intended to run with an agent-capable language model.

The model should support:

* **Thinking / reasoning output**
* **Native tool calling**
* **Multi-turn conversations**
* **Tool results being returned to the model**
* A sufficiently large **context window** for conversation history, tool schemas, RAG results, and tool responses

Tool-calling support is particularly important. GlorpCat's agent loop allows the model to decide when a tool is necessary, call it, receive the result, and continue generating a response.

A model that is good at normal chat but poor at tool calling may appear to work until GlorpCat attempts to use its tools.

### Local Model Server

Make sure your local model server is running and that the configured model is available before starting GlorpCat.

For example, when using Ollama:

```bash
ollama list
```

You can check whether a model is currently loaded with:

```bash
ollama ps
```

GlorpCat's configured model must match a model available through the selected local inference backend.

---

## Installation

It is recommended to run GlorpCat inside a Python virtual environment rather than installing its dependencies globally.

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it:

```bash
source .venv/bin/activate
```

Upgrade pip:

```bash
python -m pip install --upgrade pip
```

Install the required Python packages:

```bash
python -m pip install -r requirements.txt
```

The environment must be activated again whenever you open a new terminal:

```bash
source .venv/bin/activate
```

---

## CLI Version

GlorpCat can also be run directly from the terminal using its original CLI interface.

Activate the virtual environment:

```bash
source .venv/bin/activate
```

Then run:

```bash
python glorpCat.py
```

The CLI streams GlorpCat's output directly to the terminal, including its thinking/reasoning output and final response.

A typical interaction looks similar to:

```text
You: Hello

GlorpCat thinking:
User is greeting me. No tool is required.

GlorpCat:
Hello! How can I help you today?
```

The CLI is particularly useful for development and debugging because the agent's behavior can be observed directly without the browser interface.

---

## Tools and MCP

GlorpCat is designed as an agent rather than a simple chatbot.

The model can determine that it needs additional information, request a tool call, receive the result, and continue reasoning using that information.

Additional capabilities can be exposed to GlorpCat through **MCP (Model Context Protocol)** servers. This allows external functionality to remain modular instead of being tightly integrated into the core agent.

Because tools are selected by the language model, the quality of the model's tool-calling implementation has a significant effect on how reliably GlorpCat operates.

---

## RAG

GlorpCat is being designed to support **Retrieval-Augmented Generation (RAG)** for document retrieval and injection.

RAG allows relevant information from indexed documents to be retrieved and inserted into the model's context when needed. This provides the local model with access to information that is not contained in its original training data.

RAG should be treated separately from general-purpose tools:

* **RAG** — retrieval and injection of document knowledge.
* **MCP/tools** — actions and access to external systems.
* **LLM** — reasoning, coordination, and response generation.

Keeping these components separated makes it easier to replace or improve individual parts of the system.

---

## Architecture

At a high level, GlorpCat follows this structure:

```text
Browser UI / CLI
       │
       ▼
     Agent
       │
       ├──── Conversation / Context
       │
       ├──── Local LLM
       │
       ├──── Tool Manager
       │        │
       │        └──── MCP / Local Tools
       │
       └──── RAG
                │
                └──── Document Knowledge
```

The local model acts as the primary coordinator. Tasks that exceed the capabilities of the local models can eventually be delegated to a more capable external model.

---

## Troubleshooting

If GlorpCat starts but does not respond correctly, first verify that the model server is running and that the configured model exists.

For Ollama:

```bash
ollama ps
ollama list
```

If normal conversation works but tools do not, check that:

* The selected model actually supports tool calling.
* MCP servers or local tools are running correctly.
* Tool schemas are being provided to the model.
* Tool results are being returned to the conversation.
* The model is using the expected chat/tool-call format.

If thinking output does not appear, verify that the selected model exposes reasoning/thinking output in a format supported by GlorpCat.

For Python-related errors, confirm that the virtual environment is active:

```bash
which python
```

The path should point to the GlorpCat virtual environment rather than the system Python installation.

---

## Development Notes

GlorpCat is under active development. The architecture is intentionally modular so that the inference backend, models, RAG pipeline, MCP servers, tools, CLI, and browser UI can evolve independently.

When adding new functionality, prefer keeping capabilities behind well-defined interfaces rather than directly coupling them to the agent. This is especially important for MCP tools and RAG, since both are expected to expand significantly as the project develops.

## Start Strata Q4

```bash
cd ~/src/Strata

export SDK="$HOME/rocm/strata-7.14.1"
export ROCM_PATH="$SDK"
export HIP_PATH="$SDK"
export HIP_PLATFORM=amd
export PATH="$SDK/bin:$SDK/lib/llvm/bin:$PATH"
export LD_LIBRARY_PATH="$SDK/lib:$SDK/lib/rocm_sysdeps/lib:$SDK/lib/llvm/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"

./.venv/bin/python serve/server.py \
  --engine strata \
  --config "$PWD/strata-unsloth-ud-iq4_xs.json" \
  --port 8080 \
  --open
```

Strata opens at `http://127.0.0.1:8080`.

## Stop Strata Q4 and Release RAM

Run this from another terminal:

```bash
pkill -TERM -f 'serve/server.py.*strata-unsloth-ud-iq4_xs.json'

sleep 3

free -h
```

> Do not run a large Ollama model while Strata Q4 is loaded.

