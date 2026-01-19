from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, date, time
from typing import TYPE_CHECKING, Optional
import uuid

if TYPE_CHECKING:
    from app.models.user import User


class Task(SQLModel, table=True):
    """Task model representing a todo item owned by a user."""

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    title: str = Field(max_length=255)
    description: str | None = Field(default=None)
    completed: bool = Field(default=False)
    due_date: Optional[date] = Field(default=None)
    due_time: Optional[time] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to user
    user: "User" = Relationship(back_populates="tasks")
