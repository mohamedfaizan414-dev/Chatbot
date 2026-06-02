from collections import defaultdict
from datetime import datetime, timedelta
from app.schemas.chat import ChatMessage


class SessionStore:
    def __init__(self, ttl_hours: int = 2):
        self._sessions: dict[str, list[ChatMessage]] = defaultdict(list)
        self._last_active: dict[str, datetime] = {}
        self._ttl = timedelta(hours=ttl_hours)

    def get(self, session_id: str) -> list[ChatMessage]:
        self._cleanup()
        return self._sessions.get(session_id, [])

    def append(self, session_id: str, message: ChatMessage) -> None:
        self._sessions[session_id].append(message)
        self._last_active[session_id] = datetime.utcnow()

    def clear(self, session_id: str) -> None:
        self._sessions.pop(session_id, None)
        self._last_active.pop(session_id, None)

    def _cleanup(self) -> None:
        now = datetime.utcnow()
        expired = [sid for sid, t in self._last_active.items() if now - t > self._ttl]
        for sid in expired:
            self._sessions.pop(sid, None)
            self._last_active.pop(sid, None)


session_store = SessionStore()
