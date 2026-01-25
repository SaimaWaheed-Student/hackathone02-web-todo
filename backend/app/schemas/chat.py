"""Chat API schemas for AI chatbot.

Defines request/response schemas per contracts/chat-api.yaml specification.
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from uuid import UUID
from enum import Enum


class ChatRequest(BaseModel):
    """Schema for chat message request."""

    message: str = Field(
        min_length=1,
        max_length=2000,
        description="User's natural language message"
    )


class ToolCallResult(BaseModel):
    """Schema for tool execution result."""

    tool: str = Field(description="Name of the tool that was called")
    result: str = Field(description="Outcome: success or error")
    task_id: Optional[str] = Field(default=None, description="ID of affected task")
    count: Optional[int] = Field(default=None, description="Number of items (for list_tasks)")
    error_message: Optional[str] = Field(default=None, description="Error details if result is error")


class ChatResponse(BaseModel):
    """Schema for chat message response."""

    response: str = Field(description="AI assistant's response message")
    tool_calls: List[ToolCallResult] = Field(
        default_factory=list,
        description="List of tools called during this interaction"
    )
    error: bool = Field(default=False, description="Whether this response indicates an error")


class MessageRole(str, Enum):
    """Role of the message sender."""
    USER = "user"
    ASSISTANT = "assistant"
    TOOL = "tool"


class MessageResponse(BaseModel):
    """Schema for individual message in history."""

    id: UUID
    role: MessageRole
    content: str
    tool_name: Optional[str] = None
    tool_call_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ChatHistoryResponse(BaseModel):
    """Schema for conversation history response."""

    messages: List[MessageResponse]
    has_more: bool = Field(
        default=False,
        description="Whether more messages exist before the returned set"
    )
