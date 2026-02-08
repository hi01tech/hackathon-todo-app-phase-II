# Data Model: Core Task Management Backend

**Feature**: 001-task-backend-core
**Date**: 2026-01-24
**Status**: Complete

## Entities

### Task

The core entity representing a unit of work owned by a user.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, NOT NULL, DEFAULT uuid4() | Unique task identifier |
| `title` | VARCHAR(255) | NOT NULL, MIN 1 char | Task title |
| `description` | TEXT | NULLABLE | Optional detailed description |
| `is_completed` | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status |
| `user_id` | VARCHAR(255) | NOT NULL, INDEXED | Owner identifier (foreign key placeholder) |
| `created_at` | TIMESTAMP WITH TZ | NOT NULL, DEFAULT NOW() | Creation timestamp (UTC) |
| `updated_at` | TIMESTAMP WITH TZ | NOT NULL, DEFAULT NOW() | Last update timestamp (UTC) |

### Indexes

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `pk_task_id` | `id` | PRIMARY KEY | Unique task lookup |
| `ix_task_user_id` | `user_id` | B-TREE | User-scoped queries |
| `ix_task_user_completed` | `user_id`, `is_completed` | COMPOSITE | Filter by completion status |

### Constraints

- `title` must be non-empty (length >= 1)
- `user_id` must be non-empty (length >= 1)
- `updated_at` >= `created_at` (application-enforced)

---

## SQLModel Definition

```python
import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field

class Task(SQLModel, table=True):
    """Task entity - represents a unit of work owned by a user."""

    __tablename__ = "tasks"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        nullable=False,
        description="Unique task identifier"
    )
    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
        nullable=False,
        description="Task title"
    )
    description: Optional[str] = Field(
        default=None,
        nullable=True,
        description="Optional detailed description"
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
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False,
        description="Creation timestamp (UTC)"
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False,
        description="Last update timestamp (UTC)"
    )
```

---

## Pydantic Schemas (Request/Response)

### TaskCreate (POST request body)

```python
class TaskCreate(SQLModel):
    """Schema for creating a new task."""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(default=None)
```

### TaskUpdate (PUT request body)

```python
class TaskUpdate(SQLModel):
    """Schema for updating an existing task."""
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None)
    is_completed: Optional[bool] = Field(default=None)
```

### TaskRead (Response body)

```python
class TaskRead(SQLModel):
    """Schema for task responses."""
    id: uuid.UUID
    title: str
    description: Optional[str]
    is_completed: bool
    user_id: str
    created_at: datetime
    updated_at: datetime
```

---

## State Transitions

```
┌─────────────┐     POST /tasks      ┌─────────────┐
│  (none)     │ ─────────────────────▶│   ACTIVE    │
└─────────────┘                       │is_completed │
                                      │   = false   │
                                      └──────┬──────┘
                                             │
                         PATCH /tasks/{id}/complete
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │  COMPLETED  │
                                      │is_completed │
                                      │   = true    │
                                      └──────┬──────┘
                                             │
                         PATCH /tasks/{id}/complete (toggle)
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │   ACTIVE    │
                                      │is_completed │
                                      │   = false   │
                                      └─────────────┘
```

---

## Validation Rules

| Rule | Field | Validation | Error Code |
|------|-------|------------|------------|
| VR-001 | title | Required, 1-255 chars | 422 |
| VR-002 | description | Optional, no max | - |
| VR-003 | user_id | Required (from path), 1-255 chars | 422 |
| VR-004 | is_completed | Boolean only | 422 |

---

## Database Migration Notes

For initial schema creation:
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_task_user_id ON tasks(user_id);
CREATE INDEX ix_task_user_completed ON tasks(user_id, is_completed);
```

SQLModel will auto-create this via `SQLModel.metadata.create_all(engine)` on startup.
