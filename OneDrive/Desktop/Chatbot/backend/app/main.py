import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from app.api.chat import router as chat_router
from app.core.config import get_settings
from app.middleware.logging import logging_middleware

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s — %(message)s",
    datefmt="%H:%M:%S",
)


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="NeuralChat API",
        description="LangGraph-powered chat backend using Groq",
        version="1.0.0",
        docs_url="/docs" if settings.APP_ENV == "development" else None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.add_middleware(BaseHTTPMiddleware, dispatch=logging_middleware)

    app.include_router(chat_router)

    return app


app = create_app()
