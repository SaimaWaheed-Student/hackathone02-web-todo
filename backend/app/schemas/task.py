from pydantic import BaseModel, Field
from datetime import datetime, date, time
from typing import Optional
from uuid import UUID


class TaskCreate(BaseModel):
    """Schema for task creation request."""

    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    due_date: Optional[date] = None
    due_time: Optional[time] = None


class TaskUpdate(BaseModel):
    """Schema for task update request."""

    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    due_date: Optional[date] = None
    due_time: Optional[time] = None


class TaskCompleteToggle(BaseModel):
    """Schema for toggling task completion status."""

    completed: bool


class TaskResponse(BaseModel):
    """Schema for task response."""

    id: UUID
    user_id: UUID
    title: str
    description: str | None
    completed: bool
    due_date: Optional[date]
    due_time: Optional[time]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskListResponse(BaseModel):
    """Schema for task list response."""

    tasks: list[TaskResponse]
    count: int
