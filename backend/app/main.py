from contextlib import asynccontextmanager
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import create_db_and_tables
from app.routers import auth, tasks, chat

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup/shutdown events."""
    # Startup: Database initialization is done by init-db job
    # Just ensure we can connect to the database
    yield
    # Shutdown: cleanup if needed


app = FastAPI(
    title="Todo API",
    description="Full-Stack Todo Web Application API",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3000",
        # Docker Compose / K8s port-forward origins
        "http://localhost:7860",
        "http://localhost:7861",
        "http://localhost:7862",
        "http://localhost:7863",
        # Vercel frontend
        "https://frontend-delta-lime-66.vercel.app",
        # Hugging Face Spaces domains
        "https://huggingface.co",
        "https://*.hf.space",
        "https://saimawaheedsaima5-*.hf.space",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origin_regex=r"https://.*\.(hf\.space|vercel\.app)",
)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
