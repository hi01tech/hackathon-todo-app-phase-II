"""Task model and Pydantic schemas for request/response validation."""

import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field


class TaskBase(SQLModel):
    """Base schema with shared task fields."""

    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Task title"
    )
    description: Optional[str] = Field(
        default=None,
        description="Optional detailed description"
    )


class TaskCreate(TaskBase):
    """Schema for creating a new task (POST request body)."""

    pass


class TaskUpdate(SQLModel):
    """Schema for updating an existing task (PUT request body)."""

    title: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=255,
        description="Task title"
    )
    description: Optional[str] = Field(
        default=None,
        description="Task description"
    )
    is_completed: Optional[bool] = Field(
        default=None,
        description="Task completion status"
    )


class Task(TaskBase, table=True):
    """Task database model (SQLModel table)."""

    __tablename__ = "tasks"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        nullable=False,
        description="Unique task identifier"
    )
    is_completed: bool = Field(
        default=False,
        nullable=False,
        description="Completion status"
    )
    user_id: str = Field(
        ...,
        min_length=1,
        max_length=255,
        nullable=False,
        index=True,
        description="Owner identifier"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Creation timestamp (UTC)"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="Last update timestamp (UTC)"
    )


class TaskRead(TaskBase):
    """Schema for task responses (includes all fields)."""

    id: uuid.UUID
    is_completed: bool
    user_id: str
    created_at: datetime
    updated_at: datetime
