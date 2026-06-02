# NeuralChat

Full-stack AI chat application. Python/FastAPI backend with LangGraph + Groq, React frontend with SSE streaming.

## Stack

**Backend** — FastAPI · LangGraph · LangChain · Groq (llama3-70b)  
**Frontend** — React 18 · CSS Modules · react-markdown · react-syntax-highlighter

## Quick Start

### 1. Get a Groq API key
Free at [console.groq.com](https://console.groq.com)

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Set GROQ_API_KEY in .env

python run.py
# → http://localhost:8000
# → Swagger: http://localhost:8000/docs
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm start
# → http://localhost:3000
```

## Project Structure

```
neuralchat/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI route handlers
│   │   ├── core/         # App config (pydantic-settings)
│   │   ├── middleware/   # Request logging
│   │   ├── schemas/      # Pydantic request/response models
│   │   └── services/
│   │       ├── chat_agent.py    # LangGraph agent + Groq LLM
│   │       └── session_store.py # In-memory session management
│   ├── requirements.txt
│   └── run.py
│
└── frontend/
    └── src/
        ├── components/
        │   ├── chat/     # MessageBubble, MessageList, ChatInput, ChatHeader
        │   └── layout/   # Sidebar
        ├── hooks/        # useChatSession, useScrollToBottom, useServerHealth
        ├── services/     # api.js (all HTTP/SSE calls)
        ├── styles/       # Global CSS variables + reset
        └── types/        # JSDoc type definitions
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Backend health + model info |
| POST | `/api/v1/chat` | Single response |
| POST | `/api/v1/chat/stream` | SSE streaming response |
| DELETE | `/api/v1/session/{id}` | Clear session history |

## Architecture Notes

- LangGraph manages stateful conversation flow with `MemorySaver` checkpointing per session
- The frontend streams tokens via Server-Sent Events, rendering markdown and code blocks in real time
- All API logic is isolated in `services/api.js` — swap the backend URL and nothing else changes
- `useChatSession` is the single source of truth for all chat state; components stay pure
