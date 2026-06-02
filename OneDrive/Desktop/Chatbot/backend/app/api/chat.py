import json
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from app.schemas.chat import ChatRequest, ChatResponse, HealthResponse
from app.services.chat_agent import ChatAgent
from app.services.session_store import session_store, SessionStore
from app.schemas.chat import ChatMessage
from app.core.config import get_settings, Settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["chat"])

_agent: ChatAgent | None = None


def get_agent() -> ChatAgent:
    global _agent
    if _agent is None:
        _agent = ChatAgent()
    return _agent


def get_store() -> SessionStore:
    return session_store


@router.get("/health", response_model=HealthResponse)
async def health(settings: Settings = Depends(get_settings)):
    return HealthResponse(
        status="ok",
        model=settings.GROQ_MODEL,
        environment=settings.APP_ENV,
    )


@router.post("/chat", response_model=ChatResponse)
async def chat(
    req: ChatRequest,
    agent: ChatAgent = Depends(get_agent),
    store: SessionStore = Depends(get_store),
):
    history = store.get(req.session_id)

    try:
        reply, model = await agent.invoke(req.session_id, req.message, history)
    except Exception as e:
        logger.exception("Agent error: %s", e)
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Model unavailable. Check your GROQ_API_KEY.")

    store.append(req.session_id, ChatMessage(role="user", content=req.message))
    store.append(req.session_id, ChatMessage(role="assistant", content=reply))

    return ChatResponse(session_id=req.session_id, reply=reply, model=model)


@router.post("/chat/stream")
async def chat_stream(
    req: ChatRequest,
    agent: ChatAgent = Depends(get_agent),
    store: SessionStore = Depends(get_store),
):
    history = store.get(req.session_id)
    full_reply: list[str] = []

    async def event_stream():
        try:
            async for token in agent.stream(req.session_id, req.message, history):
                full_reply.append(token)
                data = json.dumps({"delta": token, "done": False})
                yield f"data: {data}\n\n"

            store.append(req.session_id, ChatMessage(role="user", content=req.message))
            store.append(req.session_id, ChatMessage(role="assistant", content="".join(full_reply)))

            yield f"data: {json.dumps({'delta': '', 'done': True})}\n\n"
        except Exception as e:
            logger.exception("Stream error: %s", e)
            yield f"data: {json.dumps({'error': 'Stream failed', 'done': True})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.delete("/session/{session_id}")
async def clear_session(session_id: str, store: SessionStore = Depends(get_store)):
    store.clear(session_id)
    return {"cleared": True, "session_id": session_id}
