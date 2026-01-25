"""Chat API endpoints for AI-powered task management.

Implements endpoints per contracts/chat-api.yaml specification.
All endpoints require JWT authentication.
"""

from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session

from app.database import get_session
from app.models.user import User
from app.auth.dependencies import get_current_user
from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    ChatHistoryResponse,
    MessageResponse,
)
from app.services.chat import ChatService

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def send_chat_message(
    request: ChatRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> ChatResponse:
    """Send message to AI chatbot and receive response.

    The AI assistant can execute task operations (add, list, complete, delete, update)
    based on user intent.

    - **message**: Natural language message (1-2000 characters)

    Returns AI response with optional tool call results.
    """
    chat_service = ChatService(session, current_user)
    response = await chat_service.process_message(request.message)
    return response


@router.get("/history", response_model=ChatHistoryResponse)
async def get_chat_history(
    limit: int = Query(default=50, ge=1, le=100, description="Maximum messages to return"),
    before: Optional[UUID] = Query(default=None, description="Return messages before this ID"),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> ChatHistoryResponse:
    """Retrieve conversation history.

    Messages are returned in chronological order (oldest first).

    - **limit**: Maximum number of messages (1-100, default 50)
    - **before**: For pagination, return messages before this message ID
    """
    chat_service = ChatService(session, current_user)
    messages, has_more = chat_service.get_conversation_history(limit=limit, before=before)

    return ChatHistoryResponse(
        messages=[
            MessageResponse(
                id=msg.id,
                role=msg.role,
                content=msg.content,
                tool_name=msg.tool_name,
                tool_call_id=msg.tool_call_id,
                created_at=msg.created_at
            )
            for msg in messages
        ],
        has_more=has_more
    )


@router.delete("/history", status_code=status.HTTP_204_NO_CONTENT)
async def clear_chat_history(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> None:
    """Clear all messages in the user's conversation.

    The conversation record is preserved but all messages are removed.
    """
    chat_service = ChatService(session, current_user)
    chat_service.clear_conversation_history()
