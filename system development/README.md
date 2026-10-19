# GlorpCat --- Setup and Usage

GlorpCat is a local AI agent built around local language models, tool
calling, Retrieval-Augmented Generation (RAG), and extensible MCP-based
tools.

The primary interface is the **Browser UI**, with the original **CLI
interface** retained for development and debugging.

> **Important:** GlorpCat requires an agent-capable model with reliable
> **thinking/reasoning** and **tool-calling** support. A model may work
> for normal conversation while still performing poorly with GlorpCat's
> agent and tool workflows.

------------------------------------------------------------------------

## Recommended Setup --- Docker Compose

Docker Compose is the recommended way to run GlorpCat.

The Docker deployment separates the main GlorpCat application from the
language-model inference engine:

``` text
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
Inference Services
├── inference :8081
│   ├── llama.cpp / ROCm
│   └── Nemotron — chat / reasoning / tools
└── media :8082
    ├── llama.cpp / ROCm
    └── Gemma 4 E2B + mmproj — image / audio
```

The llama.cpp image does **not** include model weights. GGUF files live
in `models/`, while `.env` selects the model files, multimodal
projector, and API aliases.

This keeps large model files outside of Docker images and makes it
possible to change models without rebuilding GlorpCat.

------------------------------------------------------------------------

## Docker Requirements

The current Docker configuration is developed and tested on Linux with
an AMD GPU.

The following software is required:

-   Docker Engine
-   Docker Compose
-   Docker Buildx
-   A working AMD GPU/ROCm-compatible host environment
-   Local GGUF models compatible with llama.cpp
-   A main agent model with thinking/reasoning and tool-calling support
-   A compatible multimodal model and projector for media inspection

Verify the Docker installation with:

``` bash
docker --version
docker compose version
docker buildx version
```

On Arch Linux / EndeavourOS, the required Docker packages can be
installed with:

``` bash
sudo pacman -S docker docker-compose docker-buildx
```

Enable and start Docker:

``` bash
sudo systemctl enable --now docker.service
```

A simple Docker installation test can be performed with:

``` bash
sudo docker run --rm hello-world
```

------------------------------------------------------------------------

## Installation

### 1. Clone GlorpCat

``` bash
git clone https://github.com/thoang12345/Glorp-Cat.git
cd Glorp-Cat
```

### 2. Create the local environment configuration

GlorpCat provides an example environment configuration:

``` bash
cp .env.example .env
```

The `.env` file contains installation-specific configuration and is
intentionally excluded from Git.

Edit it with your preferred editor:

``` bash
nano .env
```

------------------------------------------------------------------------

## Model Configuration

The Docker deployment uses two llama.cpp services:

-   **`inference`** --- Nemotron for chat, reasoning, and tool calling.
-   **`media`** --- Gemma 4 E2B for image and audio inspection.

Neither service bundles model weights. Store local model files under the
repository's `models/` directory, which is excluded from Git.

### 1. Create the model directories

``` bash
mkdir -p models/nemotron models/gemma4
```

The current tested layout is:

``` text
models/
├── nemotron/
│   └── NVIDIA-Nemotron-3.5-Lightning-30B-A3B-Q4_0.gguf
└── gemma4/
    ├── gemma-4-E2B-it-UD-Q8_K_XL.gguf
    └── mmproj-F32.gguf
```

### 2. Main agent model

The main model should provide reliable thinking/reasoning, native tool
calling, multi-turn conversation, tool-result continuation, and enough
context for conversation history, tool schemas, RAG results, and tool
responses.

The current tested main model is:

``` text
NVIDIA-Nemotron-3.5-Lightning-30B-A3B-Q4_0.gguf
```

Its embedded chat template has been tested with GlorpCat, so a separate
Jinja chat-template file is not required.

### 3. Media model

The current tested media configuration is:

``` text
gemma-4-E2B-it-UD-Q8_K_XL.gguf
mmproj-F32.gguf
```

The `mmproj` file supplies the multimodal projector required by
llama.cpp for image and audio input.

### 4. Configure `.env`

``` bash
cp .env.example .env
nano .env
```

The current configuration uses:

``` dotenv
GLORPCAT_MODEL_FILE=nemotron/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-Q4_0.gguf
GLORPCAT_MODEL_ALIAS=NVIDIA-Nemotron-3.5-Lightning-30B-A3B-Q4_0

GLORPCAT_MEDIA_FILE=gemma4/gemma-4-E2B-it-UD-Q8_K_XL.gguf
GLORPCAT_MEDIA_ALIAS=gemma-4-E2B-it-UD-Q8_K_XL
GLORPCAT_MEDIA_MMPROJ=gemma4/mmproj-F32.gguf
```

Model paths are relative to `models/`; do not prefix them with
`models/`.

The aliases are the names exposed by llama.cpp's OpenAI-compatible API
and used by GlorpCat when selecting each model.

Do not commit `.env` or files inside `models/` to Git.

------------------------------------------------------------------------

## Starting GlorpCat

For the first launch, build the GlorpCat image and start the stack:

``` bash
sudo docker compose up --build
```

Docker Compose will:

1.  Build the GlorpCat application image.
2.  Pull the required base images when necessary.
3.  Start the main `inference` llama.cpp service.
4.  Start the multimodal `media` llama.cpp service.
5.  Load the configured Nemotron and Gemma 4 E2B models.
6.  Wait for both inference-service health checks to pass.
7.  Start the GlorpCat application.
8.  Expose the Browser UI on port `8000`.

Once startup completes, open:

``` text
http://127.0.0.1:8000
```

### Normal startup

After the image has already been built, GlorpCat can normally be started
with:

``` bash
sudo docker compose up
```

### Rebuilding

If the Dockerfile or application dependencies change, rebuild with:

``` bash
sudo docker compose up --build
```

### Stopping GlorpCat

Press `Ctrl+C` when Compose is running in the foreground.

Then remove the stopped containers and Compose network with:

``` bash
sudo docker compose down
```

This does not delete the GlorpCat images, application data, model files,
or persistent Hugging Face cache.

------------------------------------------------------------------------

## Docker Services

The Compose deployment currently contains three primary services.

### `glorpcat`

The application container runs FastAPI, the Browser UI, agent system,
MCP integration, ChromaDB client, PyTorch/ROCm support, and Sentence
Transformers/reranker components.

### `inference`

Uses `kyuz0/amd-strix-halo-toolboxes:rocm-10.0` to run the main
`llama-server` instance. GlorpCat reaches it internally at:

``` text
http://inference:8081/v1
```

The current tested model is Nemotron, used for chat, reasoning, and tool
calling.

### `media`

Uses the same llama.cpp/ROCm image to run a second `llama-server`
instance with Gemma 4 E2B and its multimodal projector. GlorpCat reaches
it internally at:

``` text
http://media:8082/v1
```

This service handles image and audio inspection.

Both llama.cpp services have health checks, and `glorpcat` waits for
both to become healthy before starting.

------------------------------------------------------------------------

## Persistent Data

GlorpCat deliberately keeps runtime data outside of disposable
containers.

### Application Data

The repository's:

``` text
system development/Data/
```

directory is mounted into the GlorpCat container as:

``` text
/app/Data
```

This directory contains runtime data such as:

-   Conversation database
-   Attachments
-   Media
-   llama.cpp logs and PID information used by native execution

Removing or recreating the GlorpCat container therefore does not delete
conversation history.

### Hugging Face Cache

Models downloaded by Sentence Transformers and related Hugging Face
components are stored in a persistent Docker volume:

``` text
glorpcat-hf-cache
```

This prevents large embedding or reranker models from being downloaded
every time the GlorpCat container is recreated.

### ChromaDB

The current development configuration mounts the ChromaDB database
generated by the separate PaperParsing project into the GlorpCat
container.

PaperParsing is available here:

https://github.com/thoang12345/PaperParsing

The current RAG integration is still under development, so the ChromaDB
location and integration workflow may change as the projects are more
tightly integrated.

------------------------------------------------------------------------

## Checking Container Status

To inspect the running services:

``` bash
sudo docker compose ps
```

A healthy stack should look conceptually similar to:

``` text
SERVICE      STATUS
inference    Up (healthy)
media        Up (healthy)
glorpcat     Up
```

To inspect logs:

``` bash
sudo docker compose logs
```

To follow logs continuously:

``` bash
sudo docker compose logs -f
```

Logs for an individual service can be viewed with:

``` bash
sudo docker compose logs glorpcat
```

or:

``` bash
sudo docker compose logs inference
```

or:

``` bash
sudo docker compose logs media
```

------------------------------------------------------------------------

## Model Requirements

GlorpCat is intended to run with an agent-capable language model.

The model should support:

-   **Thinking / reasoning output**
-   **Native tool calling**
-   **Multi-turn conversations**
-   **Tool results being returned to the model**
-   A sufficiently large context window for conversation history, tool
    schemas, RAG results, and tool responses

Tool-calling support is particularly important.

GlorpCat's agent loop allows the model to decide when a tool is
necessary, call it, receive the result, and continue generating a
response.

A model that performs well at normal chat but poorly at tool calling may
appear to work until GlorpCat attempts to use MCP or local tools.

------------------------------------------------------------------------

# Native Development Setup

Docker Compose is recommended for normal use, but GlorpCat can still run
directly from Python for development and debugging.

The native configuration currently supports a locally managed llama.cpp
backend.

## Python Environment

GlorpCat currently targets Python 3.14.

Create a virtual environment:

``` bash
python3.14 -m venv glorp-cat
```

Activate it:

``` bash
source glorp-cat/bin/activate
```

Upgrade pip:

``` bash
python -m pip install --upgrade pip
```

Install the GlorpCat dependencies:

``` bash
python -m pip install -r requirements.txt
```

ROCm PyTorch may require a separate AMD-specific installation depending
on the host environment.

Verify the active Python interpreter with:

``` bash
which python
```

The returned path should point into the GlorpCat virtual environment.

------------------------------------------------------------------------

## Native llama.cpp Backend

When GlorpCat is run natively, the current configuration can
automatically manage the llama.cpp server lifecycle.

The native configuration uses settings in:

``` text
Functions/Model/config.py
```

including the llama.cpp backend URL, model configuration, server startup
settings, and local inference environment.

When native auto-start is enabled, GlorpCat starts the configured main
llama.cpp server when required and shuts it down with the application.

The Docker configuration behaves differently: Docker Compose owns both
llama.cpp service lifecycles, and GlorpCat connects to `inference` and
`media` over the Compose network.

------------------------------------------------------------------------

## Starting the Browser UI Natively

From:

``` text
system development/
```

activate the virtual environment:

``` bash
source glorp-cat/bin/activate
```

Start FastAPI:

``` bash
uvicorn Web.server:app \
    --reload \
    --reload-exclude "**/Data/media/**"
```

The Browser UI will be available at:

``` text
http://127.0.0.1:8000
```

`--reload` is useful during development because FastAPI automatically
restarts when Python source files change.

Press `Ctrl+C` to stop the server.

------------------------------------------------------------------------

## CLI Version

GlorpCat can also be run directly from the terminal using its original
CLI interface.

From:

``` text
system development/
```

activate the virtual environment:

``` bash
source glorp-cat/bin/activate
```

Then run:

``` bash
python glorpCat.py
```

The CLI streams GlorpCat's output directly to the terminal, including
thinking/reasoning output, tool activity, response statistics, and the
final response.

The CLI is particularly useful for development and debugging because
agent behavior can be observed without the Browser UI.

------------------------------------------------------------------------

## Tools and MCP

GlorpCat is designed as an agent rather than a simple chatbot.

The model can determine that it needs additional information, request a
tool call, receive the result, and continue reasoning using that
information.

Additional capabilities are exposed through **MCP (Model Context
Protocol)** servers. This keeps external functionality modular instead
of tightly coupling every tool directly to the core agent.

The current Docker application image includes the dependencies required
for the MCP services used by GlorpCat, including DDGS and the Sequential
Thinking MCP server.

Because tools are selected by the language model, the quality of the
model's tool-calling implementation has a significant effect on how
reliably GlorpCat operates.

------------------------------------------------------------------------

## RAG

GlorpCat supports Retrieval-Augmented Generation for retrieving
information from indexed documents and injecting relevant context into
the model's conversation.

RAG is treated separately from general-purpose tools:

-   **RAG** --- retrieval and injection of document knowledge.
-   **MCP/tools** --- actions and access to external systems.
-   **LLM** --- reasoning, coordination, and response generation.

The current RAG implementation uses ChromaDB and is being developed
alongside the separate
[PaperParsing](https://github.com/thoang12345/PaperParsing) project.

Keeping these components separate makes it easier to replace or improve
parsing, embedding, retrieval, model inference, and tools independently.

------------------------------------------------------------------------

## Architecture

At a high level:

``` text
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

Under Docker, the application and inference engine are separated into
independent services:

``` text
Docker Compose
│
├── glorpcat
│      ├──── http://inference:8081/v1
│      └──── http://media:8082/v1
│
├── inference
│      └──── llama-server / Nemotron
│
└── media
       └──── llama-server / Gemma 4 E2B + mmproj
```

This keeps the application separate from model serving while allowing
specialized llama.cpp services and models to evolve independently.

------------------------------------------------------------------------

## Troubleshooting

### Containers do not start

Check:

``` bash
sudo docker compose ps
```

Then inspect logs:

``` bash
sudo docker compose logs
```

### Inference is unhealthy

Inspect the inference logs:

``` bash
sudo docker compose logs inference
```

The model filename, model availability, GPU access, and llama.cpp
arguments should be checked first.

The inference health endpoint is:

``` text
http://127.0.0.1:8081/health
```

from inside the inference container.

It can be tested with:

``` bash
sudo docker compose exec inference \
    curl -f http://127.0.0.1:8081/health
```

A healthy server should return:

``` json
{"status":"ok"}
```

### Media inference is unhealthy

Inspect the media logs:

``` bash
sudo docker compose logs media
```

Check the media model filename, `mmproj` filename, GPU access, and
llama.cpp arguments.

Test its health endpoint with:

``` bash
sudo docker compose exec media \
    curl -f http://127.0.0.1:8082/health
```

A healthy media server should return:

``` json
{"status":"ok"}
```

### Browser UI does not load

Check whether the GlorpCat service is running:

``` bash
sudo docker compose ps
```

The application should expose:

``` text
0.0.0.0:8000->8000/tcp
```

Then open:

``` text
http://127.0.0.1:8000
```

### Conversations are missing

Verify that the application data directory is mounted:

``` bash
sudo docker compose exec glorpcat \
    ls -lh /app/Data/glorp_cat.db
```

### Chroma collections are missing

Verify the ChromaDB mount:

``` bash
sudo docker compose exec glorpcat \
    ls -la /app/ChromaDB
```

The current Compose configuration expects the development ChromaDB
generated by PaperParsing.

### Model responds but tools fail

Check that:

-   The selected model supports native tool calling.
-   MCP servers started successfully.
-   Tool schemas are reaching the model.
-   Tool results are being returned to the conversation.
-   The model's embedded chat template supports the expected tool-call
    format.

### Thinking output does not appear

Verify that the selected model exposes reasoning/thinking output in a
format supported by GlorpCat and that the llama.cpp reasoning settings
are appropriate for that model.

------------------------------------------------------------------------

## Docker Storage and Cleanup

View Docker storage usage with:

``` bash
sudo docker system df -v
```

Remove dangling images from previous builds with:

``` bash
sudo docker image prune
```

BuildKit maintains a build cache to speed up future builds. This cache
can be removed with:

``` bash
sudo docker builder prune
```

Removing the build cache is optional and may make the next GlorpCat
image build substantially slower.

Avoid deleting the `glorpcat-hf-cache` volume unless you intentionally
want Hugging Face models to be downloaded again.

------------------------------------------------------------------------

## Development Notes

GlorpCat is under active development.

The architecture is intentionally modular so that:

-   Inference services
-   Models
-   RAG
-   MCP servers
-   Tools
-   CLI
-   Browser UI

can evolve independently.

When adding new functionality, prefer keeping capabilities behind
well-defined interfaces rather than directly coupling them to the agent.

This is especially important for inference, MCP tools, and RAG, since
all three are expected to continue expanding as GlorpCat develops.
