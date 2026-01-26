from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import TYPE_CHECKING, Optional
from enum import Enum
import uuid

if TYPE_CHECKING:
    from app.models.conversation import Conversation


class MessageRole(str, Enum):
    """Role of the message sender."""
    USER = "user"
    ASSISTANT = "assistant"
    TOOL = "tool"


class Message(SQLModel, table=True):
    """Message model representing a single chat message.

    Stores user messages, assistant responses, and tool execution records.
    """

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    conversation_id: uuid.UUID = Field(
        foreign_key="conversation.id",
        nullable=False,
        index=True
    )
    role: MessageRole = Field(nullable=False)
    content: str = Field(nullable=False)
    tool_call_id: Optional[str] = Field(default=None, max_length=50)
    tool_name: Optional[str] = Field(default=None, max_length=50)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False, index=True)

    # Relationships
    conversation: Optional["Conversation"] = Relationship(back_populates="messages")
