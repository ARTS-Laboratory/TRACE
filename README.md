# Glorp-Cat

> A local, multi-model AI agent with a browser-based interface, built to
> keep capable AI workflows on your own hardware.

```{=html}
<p align="center">
```
`<img src="media/glorpCat.png" alt="Glorp Cat" width="400">`{=html}
```{=html}
</p>
```
```{=html}
<p align="center">
```
`<em>`{=html}My king, my GOAT.`</em>`{=html}
```{=html}
</p>
```
## What is Glorp-Cat?

Glorp-Cat is a Python-based local AI assistant that brings together
local language models, tool calling, and retrieval-augmented generation
(RAG) in one system. Its goal is to provide a practical agent that can
run on personal hardware while still having a clean browser UI for
everyday use.

The project is designed around a simple idea: keep routine work local,
use tools when the model needs information or actions, and reserve
external AI assistance for tasks that genuinely exceed the local
system's capabilities.

## Current capabilities

-   Streamed chat responses in both the command-line interface and
    browser UI
-   llama.cpp-based local inference with thinking and tool-calling
    workflows
-   Dedicated multimodal llama.cpp service for image and audio
    inspection
-   A FastAPI-powered web interface
-   Model response statistics, including token usage, generation speed,
    tool use, and timing
-   MCP-based tool integration for extensible agent capabilities
-   An in-development RAG pipeline for injecting and searching project
    documents

## Architecture

Glorp-Cat keeps each responsibility separate so the project can grow
without turning into one giant script:

  -----------------------------------------------------------------------
  Component                           Role
  ----------------------------------- -----------------------------------
  GlorpCat application                Runs the FastAPI browser UI, agent,
                                      tools, conversation management, RAG
                                      integration, and application logic.

  Local inference services            Runs specialized local models
                                      independently from the main
                                      application. The current Docker
                                      deployment uses llama.cpp with ROCm
                                      for both the main agent model and
                                      multimodal media model.

  Agent layer                         Coordinates messages, reasoning
                                      output, tool calls, and final
                                      responses.

  MCP tools                           Adds capabilities such as search
                                      and other external actions through
                                      a standard interface.

  RAG pipeline *(in integration)*     Parses, chunks, embeds, and
                                      retrieves information from local
                                      documents for use by Glorp-Cat.

  FastAPI browser UI                  Provides the primary interface
                                      while using the same underlying
                                      agent system as the CLI.
  -----------------------------------------------------------------------

The recommended deployment uses Docker Compose to keep the application
and inference engine separate:

``` text
Docker Compose
│
├── glorpcat
│   ├── FastAPI / Browser UI
│   ├── Agent
│   ├── MCP Tools
│   └── RAG
│
├── inference
│   ├── llama.cpp
│   ├── ROCm
│   ├── Nemotron
│   └── Chat / Reasoning / Tool Calling
│
└── media
    ├── llama.cpp
    ├── ROCm
    ├── Gemma 4 E2B + multimodal projector
    └── Image / Audio Inspection

## RAG pipeline *(work in progress)*

> **Project status:** 🚧 **Work in Progress**
>
> Glorp-Cat's Retrieval-Augmented Generation (RAG) pipeline is actively being developed and integrated into the agent. The overall architecture is in place, but several stages are still being refined, optimized, and connected to the main Glorp-Cat workflow. Parser configurations, chunking strategies, and retrieval quality should be considered experimental until the pipeline is complete.

### Overview

The RAG component is a modular document-ingestion pipeline that processes a wide variety of technical documents into a searchable vector database. Once integrated, it will give Glorp-Cat a local knowledge base that it can retrieve from when answering questions about injected project documents.

The pipeline uses interchangeable parsing backends so each document type can be processed by the parser best suited to it. Current development focuses on bringing **Docling** and **Marker 2** into a common workflow while retaining unified downstream chunking and retrieval.

Current execution flow:

```text
Input/
   │
   ▼
GPU / System Initialization
   │
   ▼
Initialize Docling Chunker
   │
   ▼
Build Project Paths
   │
   ▼
Create ChromaDB Client
   │
   ▼
Classify Input Documents
   │
   ├── PDF Classification
   └── General File Classification
   │
   ▼
Display Parsing Plan
   │
   ▼
Create / Open Chroma Collection
   │
   ▼
(Optional) Query Existing Collection
   │
   ▼
Document Conversion
      ├── Marker 2
      └── Docling
```

### Document classification

Each document is analyzed before parsing. The classifier determines its
document type, appropriate parser, parsing profile, and output location.
This lets the pipeline automatically route documents to the most
suitable parsing backend.

### Parsing backends

#### Marker 2

Marker is used for high-fidelity PDF extraction, especially for
scientific papers, technical reports, multi-column layouts, tables, and
mathematical content.

Current features include:

-   Native SDK integration with no CLI subprocesses
-   llama.cpp-powered multimodal LLM processors
-   Markdown export
-   JSON export
-   Embedded-image extraction

#### Docling

Docling serves as the general-purpose document parser, with current work
focused on general PDF parsing, Office-document support, native document
chunking, and rich document-structure extraction.

The long-term plan is for Docling to become the primary ingestion
engine, with Marker acting as a specialized parser for complex PDFs.

### Chunking *(under development)*

Chunking has been partially implemented but is not yet integrated into
the main execution flow. Current work includes:

-   Docling `HybridChunker`
-   Token-aware chunk sizing
-   Metadata generation
-   Parser-independent chunk normalization

Future work includes context-aware chunk generation, parser-output
normalization, chunk-quality evaluation, and retrieval benchmarking.

### ChromaDB integration *(under development)*

A ChromaDB client is initialized at startup, with browser-based
collection management for listing, selecting, creating, and deleting
collections. A basic query interface is also being developed. Automatic
ingestion of parsed chunks remains disabled while the chunking pipeline
is finalized.

### Query system

A basic query interface is available for interacting with existing
Chroma collections. It will grow into a full retrieval pipeline that
supports similarity search, metadata filtering, source citations, and
multi-document retrieval, then delivers the retrieved context to
Glorp-Cat for answer generation.

### Development priorities

The ingestion pipeline is being completed in this order:

1.  Finish parser integration
2.  Finalize chunk generation
3.  Normalize metadata between parsers
4.  Integrate automatic ChromaDB ingestion
5.  Evaluate retrieval quality
6.  Add answer generation using retrieved context

### Design philosophy

The RAG system deliberately treats parsing, chunking, embedding, and
retrieval as independent components instead of one monolithic process.
This enables multiple parsing backends, independent parser benchmarking,
configurable chunking strategies, future embedding-model replacement,
and vector-database portability.

Its long-term objective is a flexible RAG ingestion pipeline that
reliably processes technical documents, remains easy to extend as
parsers, embedding models, and retrieval techniques improve, and gives
Glorp-Cat grounded access to the user's local document collection.

## Requirements

Glorp-Cat is intended for a local model that supports both
**thinking/reasoning** and **tool calling**. A capable GPU and
sufficient VRAM/RAM are strongly recommended, especially for larger
models or longer context windows.

The recommended deployment uses **Docker Compose**. The current
development environment targets Linux and AMD ROCm, with the inference
stack tested on AMD Strix Halo hardware.

The Docker deployment provides the application and inference
environments, but **does not bundle a language model**. Users provide
local GGUF files for the main agent model and the multimodal media
model. The current tested configuration uses Nemotron for
chat/reasoning/tool calling and Gemma 4 E2B for image/audio inspection.

Native Python execution remains available for development and debugging.

## Getting started

The browser UI is served through FastAPI, while a command-line interface
remains available for direct terminal interaction.

The recommended way to run Glorp-Cat is through Docker Compose.

At a high level:

``` bash
git clone https://github.com/thoang12345/Glorp-Cat.git
cd Glorp-Cat

cp .env.example .env
```

For installation, configuration, model setup, and launch instructions,
see the [system development README](system%20development/README.md).

## Project direction

Current development is focused on finishing the document-ingestion
pipeline and improving the browser UI. Longer-term work includes:

-   Better document parsing, chunking, and image-aware retrieval
-   ChromaDB-backed retrieval alongside Neo4j knowledge-graph/GraphRAG
    support
-   A graphical document-ingestion workflow
-   Additional quality-of-life improvements for the UI
-   An optional agent-loop mode for executing user-defined workflows
    with minimal human intervention

## Related project

-   [PaperParsing](https://github.com/thoang12345/PaperParsing) --- the
    standalone RAG and document-ingestion pipeline being developed for
    integration with Glorp-Cat.

## Status

Glorp-Cat is actively under development. Functionality and reliability
take priority over visual polish while the core agent, tools, and RAG
system are being built out.

## Why local?

Running locally gives you more control over your data, your models, and
your workflow. Glorp-Cat is not trying to replace every cloud model; it
is built to make local AI useful enough to handle the work that should
stay on your machine.
