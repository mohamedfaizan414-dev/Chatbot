from pydantic import BaseModel, Field
from typing import Literal
from datetime import datetime
import uuid


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    message: str = Field(..., min_length=1, max_length=4000)
    history: list[ChatMessage] = Field(default_factory=list)


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    model: str
    tokens_used: int | None = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class StreamChunk(BaseModel):
    session_id: str
    delta: str
    done: bool = False


class HealthResponse(BaseModel):
    status: str
    model: str
    environment: str
