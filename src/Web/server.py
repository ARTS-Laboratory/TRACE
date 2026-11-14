import asyncio
import json
import shutil
import uuid
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Literal
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import urlopen

from fastapi import (
    FastAPI,
    File,
    Form,
    HTTPException,
    UploadFile,
    WebSocket,
    WebSocketDisconnect,
)
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from Functions.Agent.factory import create_runtime
from Functions.Conversation.manager import ConversationManager
from Functions.Model.config import DATA_PATH
from Functions.Model.llama_cpp_server import LlamaCppServerManager
from Functions.RAG.job_store import IngestionJobStore
from Functions.RAG.RAG_api import ingest_document
from Functions.RAG.retrieval import keyword_search, vector_search
from Functions.RAG.worker import IngestionWorker
from Functions.Storage.database import Database

runtime = None
database = None
conversation_manager = None
llama_cpp_server = None
pending_attachments = {}
chat_tasks = {}


class UpdateName(BaseModel):
    title: str


class CollectionCreate(BaseModel):
    collection_name: str
    collection_description: str


class QueryCollection(BaseModel):
    collection_name: str
    query: str
    method: Literal["vector", "keyword"] = "vector"
    limit: int = Field(default=10, ge=1)


@asynccontextmanager
async def lifespan(app: FastAPI):
    global runtime
    global database
    global conversation_manager
    global llama_cpp_server

    runtime = await create_runtime()

    llama_cpp_server = LlamaCppServerManager()

    database = Database()
    store = IngestionJobStore()

    store.recover_interrupted_jobs()
    app.state.ingestion_store = store

    worker = IngestionWorker(
        store=store,
        embedding=runtime.embedding,
        qdrant_db=runtime.qdrant_db,
    )

    conversation_manager = ConversationManager(runtime=runtime, database=database)

    try:
        worker.start()
        yield

    finally:
        await asyncio.to_thread(worker.stop)
        await llama_cpp_server.stop()
        await runtime.shutdown()


app = FastAPI(lifespan=lifespan)

app.mount("/static", StaticFiles(directory="Web/static"), name="static")


@app.get("/")
async def root():
    return FileResponse("Web/static/index.html")


@app.get("/api/conversations")
async def get_conversations():
    return conversation_manager.get_conversations()


@app.post("/api/conversations")
async def create_conversation():
    conversation_id = conversation_manager.create()

    return {"id": conversation_id}


@app.get("/api/conversations/{conversation_id}")
async def get_conversation(conversation_id: int):
    conversation = conversation_manager.get_conversation(conversation_id)

    if conversation is None:
        return {"error": "Conversation not found"}

    return conversation


@app.post("/api/attachments")
async def upload_attachments(
    file: UploadFile = File(...),
    conversation_id: int = Form(...),
    message_id: int = Form(...),
):
    conversation = conversation_manager.get_conversation(conversation_id)

    if conversation is None:
        return {"error": "Conversation not found"}

    messages = conversation["messages"]

    match = None
    for message in messages:
        if message_id != message["id"]:
            continue

        match = message
        break

    if match is None:
        return {"error": "Message not found"}

    if match["role"] != "user":
        return {"error": "Message not from user"}

    conversation_media = DATA_PATH / "media" / str(conversation_id)

    conversation_media.mkdir(parents=True, exist_ok=True)

    contents = await file.read()
    original = Path(file.filename)
    name = original.stem.replace(" ", "_")
    extension = original.suffix

    stored_name = f"{conversation_id}_{message_id}_{uuid.uuid7()}_{name}{extension}"
    file_path = conversation_media / stored_name

    file_path.write_bytes(contents)

    attachment_id = conversation_manager.add_attachment(
        conversation_id=conversation_id,
        message_id=match["id"],
        original_name=file.filename,
        file_path=file_path,
        content_type=file.content_type,
        size=len(contents),
    )

    if attachment_id is None:
        file_path.unlink()
        return {"error": "Failed to save attachment"}

    event = pending_attachments.get(message_id)

    if event is not None:
        event.set()

    return {
        "attached": True,
        "id": attachment_id,
    }


@app.get("/api/attachments/{attachment_id}")
async def get_attachment(attachment_id: int):
    attachment = conversation_manager.get_attachment_by_id(attachment_id=attachment_id)

    if attachment is None:
        return {"error": "Attachment not found"}

    file_path = Path(attachment["file_path"])

    if not file_path.exists():
        return {"error": "File not found"}

    return FileResponse(file_path, media_type=attachment["content_type"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.patch("/api/conversations/{conversation_id}")
async def rename_conversation(conversation_id: int, new_name: UpdateName):
    renamed = conversation_manager.rename(conversation_id, new_name.title)

    if not renamed:
        return {"error": "Conversation not found"}

    return {"renamed": True, "id": conversation_id, "title": renamed}


@app.delete("/api/conversations/{conversation_id}")
async def delete_conversation(conversation_id: int):
    deleted = conversation_manager.delete(conversation_id)

    if not deleted:
        return {"error": "Conversation not found"}

    return {"deleted": True, "id": conversation_id}


@app.get("/api/chromadb/collections")
async def get_chromadb_collections():
    collections = runtime.chroma_db.get_collections()
    return {"collections": collections}


@app.delete("/api/chromadb/collections/{collection_name}")
async def delete_chromadb_collection(collection_name: str):

    deleted_collection = runtime.chroma_db.delete_collection(collection_name)

    if not deleted_collection:
        return {"error": "Collection not deleted"}

    return {"deleted": True, "collection": collection_name}


@app.post("/api/chromadb/collections")
async def create_collection(data: CollectionCreate):

    created_collection = runtime.chroma_db.create_collection(
        data.collection_name, data.collection_description
    )

    if not created_collection:
        return {"error": "Collection creation failed."}

    return {
        "created": True,
        "collection": data.collection_name,
        "description": data.collection_description,
    }


@app.get("/api/rag/collections")
def get_qdrant_collections():
    collections = runtime.qdrant_db.get_collections()
    return {"collections": collections}


@app.post("/api/rag/collections")
def create_qdrant_collection(data: CollectionCreate):
    created = runtime.qdrant_db.create_collection(
        data.collection_name, data.collection_description
    )

    if not created:
        return {"error": "Collection creation failed."}

    return {
        "created": created,
        "collection": data.collection_name,
        "description": data.collection_description,
    }


@app.delete("/api/rag/collections/{collection_name}")
def delete_qdrant_collection(collection_name: str):
    deleted = runtime.qdrant_db.delete_collection(collection_name=collection_name)

    if not deleted:
        return {"error": "Collection not deleted."}

    return {"deleted": deleted, "collection": collection_name}


@app.post("/api/rag/search")
def search_collection(data: QueryCollection):
    try:
        if data.method == "vector":
            search_results = vector_search(
                collection_name=data.collection_name,
                query=data.query,
                embedding=runtime.embedding,
                qdrant_db=runtime.qdrant_db,
                limit=data.limit,
            )

            return {
                "collection_name": data.collection_name,
                "method": data.method,
                "results": search_results,
            }

        search_results = keyword_search(
            collection_name=data.collection_name,
            query=data.query,
            embedding=runtime.embedding,
            qdrant_db=runtime.qdrant_db,
            limit=data.limit,
        )

        return {
            "collection_name": data.collection_name,
            "method": data.method,
            "results": search_results,
        }
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error


@app.post("/api/rag/ingest", status_code=202)
def ingest_rag_document(
    collection_name: str = Form(...),
    file: UploadFile = File(...),
):
    try:
        input_directory = DATA_PATH / "input"
        input_directory.mkdir(parents=True, exist_ok=True)

        original_name = Path(file.filename or "document").name
        source_path = input_directory / f"{uuid.uuid4().hex}_{original_name}"

        with open(source_path, "wb") as destination:
            shutil.copyfileobj(file.file, destination)

        job_id = app.state.ingestion_store.create_job(
            collection_name=collection_name,
            original_name=original_name,
            source_path=source_path,
        )

        return {"job_id": job_id, "status": "queued"}
    finally:
        file.file.close()


@app.get("/api/rag/jobs/{job_id}")
def get_job(job_id: str):
    job = app.state.ingestion_store.get_job(job_id=job_id)

    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    stage_timings = json.loads(job["stage_timings_json"])
    stage_started_at = job["stage_started_at"]
    result = json.loads(job["result_json"]) if job["result_json"] is not None else None

    return {
        "job_id": job["job_id"],
        "collection_name": job["collection_name"],
        "original_name": job["original_name"],
        "status": job["status"],
        "stage": job["stage"],
        "created_at": job["created_at"],
        "started_at": job["started_at"],
        "finished_at": job["finished_at"],
        "stage_started_at": stage_started_at,
        "stage_timings": stage_timings,
        "result": result,
        "error": job["error"],
    }


@app.get("/api/logs/{service}")
def get_service_logs(service: str, tail: int = 200):
    if tail < 1 or tail > 1000:
        raise HTTPException(status_code=422, detail="Tail must be between 1 and 1000")

    try:
        parameters = urlencode({"tail": tail})
        url = f"http://controller:8090/logs/{service}?{parameters}"

        with urlopen(url, timeout=20) as response:
            result = json.load(response)

        return result
    except HTTPError as error:
        status_code = 404 if error.code == 404 else 503
        detail = (
            "Log service not found" if status_code == 404 else "Log gateway unavailable"
        )
        raise HTTPException(status_code=status_code, detail=detail) from error

    except (URLError, TimeoutError) as error:
        raise HTTPException(
            status_code=503,
            detail="Log gateway unavailable",
        ) from error


async def handle_chat(websocket: WebSocket, data):
    conversation_id = data["conversation_id"]

    try:
        message = data["message"]
        has_attachment = data.get("has_attachment", False)
        agent = conversation_manager.get_agent(conversation_id)

        if agent is None:
            try:
                await websocket.send_json(
                    {"type": "error", "data": "Conversation not found"}
                )
            except WebSocketDisconnect:
                pass

            return

        message_id = database.add_message(
            conversation_id=conversation_id, role="user", content=message
        )

        if has_attachment:
            event = asyncio.Event()
            pending_attachments[message_id] = event

        await websocket.send_json(
            {
                "type": "user_message_saved",
                "data": {"conversation_id": conversation_id, "message_id": message_id},
            }
        )

        if has_attachment:
            try:
                await asyncio.wait_for(event.wait(), timeout=30.0)

            except TimeoutError:
                await websocket.send_json(
                    {"type": "error", "data": "Attachment upload failed. (Timedout)"}
                )
                return

            finally:
                pending_attachments.pop(message_id, None)

        title = conversation_manager.set_title_from_message(conversation_id, message)

        await websocket.send_json(
            {
                "type": "conversation_title",
                "data": {"conversation_id": conversation_id, "title": title},
            }
        )

        async def insert_visual_block(visual_id):
            nonlocal active_text_block_id, active_block_text
            visual_block_id = database.add_response_block(
                assistant_message_id=assistant_message_id,
                block_type="visual",
                visual_id=visual_id,
            )

            event = {
                "type": "block_created",
                "conversation_id": conversation_id,
                "assistant_message_id": assistant_message_id,
                "data": {
                    "id": visual_block_id,
                    "type": "visual",
                    "visual_id": visual_id,
                },
            }

            await send_event(event=event)

            active_text_block_id = None
            active_block_text = ""

        async def send_event(event):
            nonlocal active_text_block_id, active_block_text, response_text
            if event["type"] == "content_delta":
                active_block_text += event["data"]
                response_text += event["data"]

                if active_text_block_id is None:
                    active_text_block_id = database.add_response_block(
                        assistant_message_id=assistant_message_id,
                        block_type="text",
                        content=active_block_text,
                    )
                else:
                    database.update_response_block(
                        block_id=active_text_block_id, content=active_block_text
                    )

                event["assistant_message_id"] = assistant_message_id
                event["block_id"] = active_text_block_id

            try:
                await websocket.send_json(event)
            except WebSocketDisconnect:
                pass

        attachments = conversation_manager.get_attachments_for_message(
            message_id=message_id
        )

        await llama_cpp_server.ensure_running()

        active_text_block_id = None
        active_block_text = ""
        response_text = ""

        assistant_message_id = database.add_message(
            conversation_id=conversation_id, role="assistant", content="", thinking=""
        )
        record_event = database.add_execution_event

        print("CHAT START", conversation_id)

        assistant = await agent.chat(
            message,
            attachments=attachments,
            on_event=send_event,
            assistant_message_id=assistant_message_id,
            record_event=record_event,
        )

        print("CHAT END", conversation_id)

        database.update_message(
            message_id=assistant_message_id,
            content=response_text,
            thinking=assistant["thinking"],
        )

        await websocket.send_json({"type": "done", "conversation_id": conversation_id})

    except WebSocketDisconnect:
        pass

    except Exception as e:
        try:
            await websocket.send_json({"type": "error", "data": str(e)})
        except WebSocketDisconnect:
            pass

    except asyncio.CancelledError:
        try:
            await websocket.send_json(
                {"type": "cancelled", "conversation_id": conversation_id}
            )
        except WebSocketDisconnect:
            pass

    finally:
        current_task = asyncio.current_task()
        stored_task = chat_tasks.get(conversation_id)

        if stored_task is current_task:
            chat_tasks.pop(conversation_id, None)


@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            data = await websocket.receive_json()
            conversation_id = data["conversation_id"]

            if data.get("type") == "cancel":
                chat = chat_tasks.get(conversation_id)

                if chat is not None:
                    chat.cancel()
                    await websocket.send_json(
                        {"type": "cancelled", "conversation_id": conversation_id}
                    )

            else:
                chat = asyncio.create_task(handle_chat(websocket, data))
                chat_tasks[conversation_id] = chat

    except WebSocketDisconnect:
        active_tasks = list(chat_tasks.values())

        for task in active_tasks:
            task.cancel()
