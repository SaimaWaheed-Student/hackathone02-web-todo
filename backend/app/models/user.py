from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
import uuid

if TYPE_CHECKING:
    from app.models.task import Task
    from app.models.conversation import Conversation


class User(SQLModel, table=True):
    """User model representing a registered account holder."""

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to tasks
    tasks: List["Task"] = Relationship(back_populates="user")

    # Relationship to conversation (one-to-one)
    conversation: Optional["Conversation"] = Relationship(back_populates="user")
