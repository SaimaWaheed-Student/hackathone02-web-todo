from sqlmodel import SQLModel, Session
from typing import Generator

from app.config import get_settings

# Import all models to ensure they are registered with SQLModel metadata
from app.models.user import User  # noqa: F401
from app.models.task import Task  # noqa: F401
from app.models.conversation import Conversation  # noqa: F401
from app.models.message import Message  # noqa: F401

settings = get_settings()

# Engine will be created lazily when needed
_engine = None


def get_engine():
    """Create and return database engine with PostgreSQL connection."""
    from sqlmodel import create_engine

    global _engine
    if _engine is None:
        _engine = create_engine(
            settings.database_url,
            echo=settings.debug,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10,
            pool_timeout=30,
            pool_recycle=300,
            connect_args={"connect_timeout": 10},
        )
    return _engine


def create_db_and_tables() -> None:
    """Create all database tables from SQLModel metadata with retry logic."""
    import time
    import logging
    from sqlalchemy.exc import OperationalError

    db_engine = get_engine()
    max_retries = 10
    retry_delay = 5  # seconds

    for attempt in range(max_retries):
        try:
            logging.info(f"Attempting to create database tables (attempt {attempt + 1}/{max_retries})")
            SQLModel.metadata.create_all(db_engine)
            logging.info("Database tables created successfully")
            return
        except OperationalError as e:
            logging.warning(f"Database connection failed (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
            else:
                logging.error("Failed to connect to database after all retries")
                raise
        except Exception as e:
            logging.error(f"Unexpected error during database initialization: {e}")
            raise


def get_session() -> Generator[Session, None, None]:
    """Dependency that provides a database session."""
    db_engine = get_engine()
    with Session(db_engine) as session:
        yield session
