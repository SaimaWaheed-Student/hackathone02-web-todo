from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
import uuid

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.message import Message


class Conversation(SQLModel, table=True):
    """Conversation model representing a chat session for a user.

    One conversation per user (1:1 relationship with User).
    Contains messages exchanged between user and AI assistant.
    """

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(
        foreign_key="user.id",
        unique=True,
        nullable=False,
        index=True
    )
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationships
    user: Optional["User"] = Relationship(back_populates="conversation")
    messages: List["Message"] = Relationship(
        back_populates="conversation",
        sa_relationship_kwargs={"cascade": "all, delete-orphan", "order_by": "Message.created_at"}
    )
