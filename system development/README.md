# GlorpCat — Setup and Usage

GlorpCat is a local AI agent built around local language models, tool calling, Retrieval-Augmented Generation (RAG), and extensible MCP-based tools.

The primary interface is the **Browser UI**, with the original **CLI interface** retained for development and debugging.

> **Important:** GlorpCat requires an agent-capable model with reliable **thinking/reasoning** and **tool-calling** support. A model may work for normal conversation while still performing poorly with GlorpCat's agent and tool workflows.

---

## Recommended Setup — Docker Compose

Docker Compose is the recommended way to run GlorpCat.

The Docker deployment separates the main GlorpCat application from the language-model inference engine:

```text
Browser
   │
   ▼
GlorpCat Container
├── FastAPI / Browser UI
├── Agent
├── MCP Tools
├── RAG / ChromaDB
├── PyTorch
└── ROCm
   │
   │ OpenAI-compatible API
   ▼
Inference Container
├── llama.cpp
├── ROCm
└── User-supplied model
```

The inference image does **not** include a language model. The user supplies the model separately through the local `.env` configuration.

This keeps large model files outside of Docker images and makes it possible to change models without rebuilding GlorpCat.

---

## Docker Requirements

The current Docker configuration is developed and tested on Linux with an AMD GPU.

The following software is required:

- Docker Engine
- Docker Compose
- Docker Buildx
- A working AMD GPU/ROCm-compatible host environment
- A local model compatible with llama.cpp
- A model with thinking/reasoning and tool-calling support

Verify the Docker installation with:

```bash
docker --version
docker compose version
docker buildx version
```

On Arch Linux / EndeavourOS, the required Docker packages can be installed with:

```bash
sudo pacman -S docker docker-compose docker-buildx
```

Enable and start Docker:

```bash
sudo systemctl enable --now docker.service
```

A simple Docker installation test can be performed with:

```bash
sudo docker run --rm hello-world
```

---

## Installation

### 1. Clone GlorpCat

```bash
git clone https://github.com/thoang12345/Glorp-Cat.git
cd Glorp-Cat
```

### 2. Create the local environment configuration

GlorpCat provides an example environment configuration:

```bash
cp .env.example .env
```

The `.env` file contains installation-specific configuration and is intentionally excluded from Git.

Edit it with your preferred editor:

```bash
nano .env
```

---

## Model Configuration

The Docker inference service does not contain a model by default.

The following variables in `.env` tell Docker Compose where the selected model and llama.cpp chat template are located.

### `GLORPCAT_MODEL_DIR`

Host directory containing the model.

Example:

```dotenv
GLORPCAT_MODEL_DIR=/path/to/models
```

This directory is mounted read-only inside the inference container as:

```text
/models
```

### `GLORPCAT_MODEL_FILE`

Path to the model relative to `GLORPCAT_MODEL_DIR`.

Example:

```dotenv
GLORPCAT_MODEL_FILE=my-model.gguf
```

If the model is located inside a subdirectory:

```dotenv
GLORPCAT_MODEL_FILE=blobs/my-model-file
```

The resulting path inside the inference container becomes:

```text
/models/<GLORPCAT_MODEL_FILE>
```

### `GLORPCAT_TEMPLATE_DIR`

Host directory containing the llama.cpp chat template.

Example:

```dotenv
GLORPCAT_TEMPLATE_DIR=/path/to/templates
```

This directory is mounted read-only inside the inference container as:

```text
/templates
```

### `GLORPCAT_TEMPLATE_FILE`

Chat-template filename relative to `GLORPCAT_TEMPLATE_DIR`.

Example:

```dotenv
GLORPCAT_TEMPLATE_FILE=model_chat_template.jinja2
```

### `GLORPCAT_MODEL_ALIAS`

Name exposed by the llama.cpp OpenAI-compatible API.

Example:

```dotenv
GLORPCAT_MODEL_ALIAS=my-model
```

A completed `.env` may therefore look similar to:

```dotenv
GLORPCAT_MODEL_DIR=/path/to/models
GLORPCAT_MODEL_FILE=my-model.gguf

GLORPCAT_TEMPLATE_DIR=/path/to/templates
GLORPCAT_TEMPLATE_FILE=model_chat_template.jinja2

GLORPCAT_MODEL_ALIAS=my-model
```

Do not commit `.env` to Git.

---

## Starting GlorpCat

For the first launch, build the GlorpCat image and start the stack:

```bash
sudo docker compose up --build
```

Docker Compose will:

1. Build the GlorpCat application image.
2. Pull the required base images when necessary.
3. Start the llama.cpp inference service.
4. Load the configured model.
5. Wait for the inference service health check to pass.
6. Start the GlorpCat application.
7. Expose the Browser UI on port `8000`.

Once startup completes, open:

```text
http://127.0.0.1:8000
```

### Normal startup

After the image has already been built, GlorpCat can normally be started with:

```bash
sudo docker compose up
```

### Rebuilding

If the Dockerfile or application dependencies change, rebuild with:

```bash
sudo docker compose up --build
```

### Stopping GlorpCat

Press `Ctrl+C` when Compose is running in the foreground.

Then remove the stopped containers and Compose network with:

```bash
sudo docker compose down
```

This does not delete the GlorpCat images, application data, model files, or persistent Hugging Face cache.

---

## Docker Services

The Compose deployment currently contains two primary services.

### `glorpcat`

The GlorpCat application container contains:

- Python 3.14
- PyTorch
- AMD ROCm support
- FastAPI
- Browser UI
- Agent system
- MCP integration
- ChromaDB client
- Sentence Transformers / reranker support

The current application image is based on AMD's ROCm/PyTorch container.

### `inference`

The inference service uses:

```text
kyuz0/amd-strix-halo-toolboxes:rocm-10.0
```

This provides a llama.cpp environment known to work with AMD Strix Halo hardware.

The service runs `llama-server` and exposes its OpenAI-compatible API to the GlorpCat container.

The inference service is not exposed directly to the host. GlorpCat communicates with it over the internal Docker Compose network:

```text
http://inference:8081/v1
```

The service includes a health check so GlorpCat waits until llama.cpp has finished loading the model before starting.

---

## Persistent Data

GlorpCat deliberately keeps runtime data outside of disposable containers.

### Application Data

The repository's:

```text
system development/Data/
```

directory is mounted into the GlorpCat container as:

```text
/app/Data
```

This directory contains runtime data such as:

- Conversation database
- Attachments
- Media
- llama.cpp logs and PID information used by native execution

Removing or recreating the GlorpCat container therefore does not delete conversation history.

### Hugging Face Cache

Models downloaded by Sentence Transformers and related Hugging Face components are stored in a persistent Docker volume:

```text
glorpcat-hf-cache
```

This prevents large embedding or reranker models from being downloaded every time the GlorpCat container is recreated.

### ChromaDB

The current development configuration mounts the ChromaDB database generated by the separate PaperParsing project into the GlorpCat container.

PaperParsing is available here:

https://github.com/thoang12345/PaperParsing

The current RAG integration is still under development, so the ChromaDB location and integration workflow may change as the projects are more tightly integrated.

---

## Checking Container Status

To inspect the running services:

```bash
sudo docker compose ps
```

A healthy stack should look conceptually similar to:

```text
SERVICE      STATUS
inference    Up (healthy)
glorpcat     Up
```

To inspect logs:

```bash
sudo docker compose logs
```

To follow logs continuously:

```bash
sudo docker compose logs -f
```

Logs for an individual service can be viewed with:

```bash
sudo docker compose logs glorpcat
```

or:

```bash
sudo docker compose logs inference
```

---

## Model Requirements

GlorpCat is intended to run with an agent-capable language model.

The model should support:

- **Thinking / reasoning output**
- **Native tool calling**
- **Multi-turn conversations**
- **Tool results being returned to the model**
- A sufficiently large context window for conversation history, tool schemas, RAG results, and tool responses

Tool-calling support is particularly important.

GlorpCat's agent loop allows the model to decide when a tool is necessary, call it, receive the result, and continue generating a response.

A model that performs well at normal chat but poorly at tool calling may appear to work until GlorpCat attempts to use MCP or local tools.

---

# Native Development Setup

Docker Compose is recommended for normal use, but GlorpCat can still run directly from Python for development and debugging.

The native configuration currently supports a locally managed llama.cpp backend.

## Python Environment

GlorpCat currently targets Python 3.14.

Create a virtual environment:

```bash
python3.14 -m venv glorp-cat
```

Activate it:

```bash
source glorp-cat/bin/activate
```

Upgrade pip:

```bash
python -m pip install --upgrade pip
```

Install the GlorpCat dependencies:

```bash
python -m pip install -r requirements.txt
```

ROCm PyTorch may require a separate AMD-specific installation depending on the host environment.

Verify the active Python interpreter with:

```bash
which python
```

The returned path should point into the GlorpCat virtual environment.

---

## Native llama.cpp Backend

When GlorpCat is run natively, the current configuration can automatically manage the llama.cpp server lifecycle.

The native configuration uses settings in:

```text
Functions/Model/config.py
```

including the llama.cpp backend URL, model configuration, server startup settings, and local inference environment.

When native auto-start is enabled, GlorpCat starts the configured llama.cpp server when required and shuts it down with the application.

The Docker configuration behaves differently: Docker Compose owns the inference-service lifecycle, and GlorpCat connects to the `inference` service over the Compose network.

---

## Starting the Browser UI Natively

From:

```text
system development/
```

activate the virtual environment:

```bash
source glorp-cat/bin/activate
```

Start FastAPI:

```bash
uvicorn Web.server:app \
    --reload \
    --reload-exclude "**/Data/media/**"
```

The Browser UI will be available at:

```text
http://127.0.0.1:8000
```

`--reload` is useful during development because FastAPI automatically restarts when Python source files change.

Press `Ctrl+C` to stop the server.

---

## CLI Version

GlorpCat can also be run directly from the terminal using its original CLI interface.

From:

```text
system development/
```

activate the virtual environment:

```bash
source glorp-cat/bin/activate
```

Then run:

```bash
python glorpCat.py
```

The CLI streams GlorpCat's output directly to the terminal, including thinking/reasoning output, tool activity, response statistics, and the final response.

The CLI is particularly useful for development and debugging because agent behavior can be observed without the Browser UI.

---

## Tools and MCP

GlorpCat is designed as an agent rather than a simple chatbot.

The model can determine that it needs additional information, request a tool call, receive the result, and continue reasoning using that information.

Additional capabilities are exposed through **MCP (Model Context Protocol)** servers. This keeps external functionality modular instead of tightly coupling every tool directly to the core agent.

The current Docker application image includes the dependencies required for the MCP services used by GlorpCat, including DDGS and the Sequential Thinking MCP server.

Because tools are selected by the language model, the quality of the model's tool-calling implementation has a significant effect on how reliably GlorpCat operates.

---

## RAG

GlorpCat supports Retrieval-Augmented Generation for retrieving information from indexed documents and injecting relevant context into the model's conversation.

RAG is treated separately from general-purpose tools:

- **RAG** — retrieval and injection of document knowledge.
- **MCP/tools** — actions and access to external systems.
- **LLM** — reasoning, coordination, and response generation.

The current RAG implementation uses ChromaDB and is being developed alongside the separate [PaperParsing](https://github.com/thoang12345/PaperParsing) project.

Keeping these components separate makes it easier to replace or improve parsing, embedding, retrieval, model inference, and tools independently.

---

## Architecture

At a high level:

```text
Browser UI / CLI
       │
       ▼
     Agent
       │
       ├──── Conversation / Context
       │
       ├──── Local LLM
       │        │
       │        └──── llama.cpp Inference
       │
       ├──── Tool Manager
       │        │
       │        └──── MCP / Local Tools
       │
       └──── RAG
                │
                └──── ChromaDB / Document Knowledge
```

Under Docker, the application and inference engine are separated into independent services:

```text
Docker Compose
│
├── glorpcat
│      │
│      └──── http://inference:8081/v1
│
└── inference
       │
       └──── llama-server
```

This allows the inference backend and application to evolve independently.

---

## Troubleshooting

### Containers do not start

Check:

```bash
sudo docker compose ps
```

Then inspect logs:

```bash
sudo docker compose logs
```

### Inference is unhealthy

Inspect the inference logs:

```bash
sudo docker compose logs inference
```

The model path, template path, GPU access, and llama.cpp arguments should be checked first.

The inference health endpoint is:

```text
http://127.0.0.1:8081/health
```

from inside the inference container.

It can be tested with:

```bash
sudo docker compose exec inference \
    curl -f http://127.0.0.1:8081/health
```

A healthy server should return:

```json
{"status":"ok"}
```

### Browser UI does not load

Check whether the GlorpCat service is running:

```bash
sudo docker compose ps
```

The application should expose:

```text
0.0.0.0:8000->8000/tcp
```

Then open:

```text
http://127.0.0.1:8000
```

### Conversations are missing

Verify that the application data directory is mounted:

```bash
sudo docker compose exec glorpcat \
    ls -lh /app/Data/glorp_cat.db
```

### Chroma collections are missing

Verify the ChromaDB mount:

```bash
sudo docker compose exec glorpcat \
    ls -la /app/ChromaDB
```

The current Compose configuration expects the development ChromaDB generated by PaperParsing.

### Model responds but tools fail

Check that:

- The selected model supports native tool calling.
- MCP servers started successfully.
- Tool schemas are reaching the model.
- Tool results are being returned to the conversation.
- The selected chat template supports the expected tool-call format.

### Thinking output does not appear

Verify that the selected model exposes reasoning/thinking output in a format supported by GlorpCat and that the llama.cpp reasoning settings are appropriate for that model.

---

## Docker Storage and Cleanup

View Docker storage usage with:

```bash
sudo docker system df -v
```

Remove dangling images from previous builds with:

```bash
sudo docker image prune
```

BuildKit maintains a build cache to speed up future builds. This cache can be removed with:

```bash
sudo docker builder prune
```

Removing the build cache is optional and may make the next GlorpCat image build substantially slower.

Avoid deleting the `glorpcat-hf-cache` volume unless you intentionally want Hugging Face models to be downloaded again.

---

## Development Notes

GlorpCat is under active development.

The architecture is intentionally modular so that:

- Inference backends
- Models
- RAG
- MCP servers
- Tools
- CLI
- Browser UI

can evolve independently.

When adding new functionality, prefer keeping capabilities behind well-defined interfaces rather than directly coupling them to the agent.

This is especially important for inference, MCP tools, and RAG, since all three are expected to continue expanding as GlorpCat develops.