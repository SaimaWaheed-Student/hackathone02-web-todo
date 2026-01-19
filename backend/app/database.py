from sqlmodel import SQLModel, Session, create_engine
from typing import Generator

from app.config import get_settings

settings = get_settings()

# Create engine with Neon PostgreSQL connection
# SSL mode required for Neon
engine = create_engine(
    settings.database_url,
    echo=settings.debug,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=300,
    connect_args={"connect_timeout": 10},
)


def create_db_and_tables() -> None:
    """Create all database tables from SQLModel metadata."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """Dependency that provides a database session."""
    with Session(engine) as session:
        yield session
