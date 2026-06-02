# NeuralChat — Backend

FastAPI backend powered by LangGraph + Groq. Supports both REST and Server-Sent Events (SSE) streaming.

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Add your GROQ_API_KEY in .env

python run.py
```

API available at `http://localhost:8000`  
Swagger docs at `http://localhost:8000/docs`

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/health` | Health check + model info |
| POST | `/api/v1/chat` | Single-turn response |
| POST | `/api/v1/chat/stream` | SSE streaming response |
| DELETE | `/api/v1/session/{id}` | Clear session history |

## Architecture

```
app/
├── api/          # FastAPI routers
├── core/         # Config (pydantic-settings)
├── middleware/   # Request logging
├── schemas/      # Pydantic models
└── services/
    ├── chat_agent.py    # LangGraph agent + Groq LLM
    └── session_store.py # In-memory session management
```
