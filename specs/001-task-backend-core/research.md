# Research: Core Task Management Backend

**Feature**: 001-task-backend-core
**Date**: 2026-01-24
**Status**: Complete

## Research Questions

### RQ-1: SQLModel + Neon PostgreSQL Connection Pattern

**Decision**: Use async SQLModel with `asyncpg` driver via connection string from environment variable.

**Rationale**:
- Neon PostgreSQL requires SSL connections (`sslmode=require`)
- SQLModel 0.0.14+ supports async sessions via SQLAlchemy 2.0
- Connection pooling handled by Neon's serverless driver
- Environment variable `DATABASE_URL` follows 12-factor app principles

**Alternatives Considered**:
- Synchronous psycopg2: Rejected due to blocking I/O in async FastAPI
- Raw asyncpg: Rejected; SQLModel provides ORM benefits without complexity

**Pattern**:
```python
from sqlmodel import SQLModel, create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

DATABASE_URL = os.getenv("DATABASE_URL")  # postgresql+asyncpg://...
engine = create_async_engine(DATABASE_URL, echo=False)
```

---

### RQ-2: Session Management Strategy

**Decision**: Use FastAPI dependency injection with async context manager.

**Rationale**:
- Sessions are request-scoped (created per request, closed after)
- Dependency injection ensures proper cleanup on exceptions
- Matches FR-SC-004 from spec: "session dependency that closes after request"

**Alternatives Considered**:
- Global session: Rejected; not thread-safe for concurrent requests
- Manual session management: Rejected; error-prone, violates DRY

**Pattern**:
```python
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSession(engine) as session:
        yield session
```

---

### RQ-3: Task ID Type (UUID vs Integer)

**Decision**: Use UUID (uuid4) as primary key.

**Rationale**:
- Prevents enumeration attacks (FR-009: security through obscurity)
- Client-side generation possible for offline-first future
- No sequence contention in distributed scenarios
- Spec allows "UUID/int" - UUID is more secure

**Alternatives Considered**:
- Auto-increment integer: Rejected; enables task ID enumeration
- ULID: Rejected; UUID is sufficient and more widely supported

**Pattern**:
```python
import uuid
from sqlmodel import Field

class Task(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
```

---

### RQ-4: Timestamp Handling

**Decision**: Use `datetime` with timezone-aware UTC timestamps, auto-set on create/update.

**Rationale**:
- Consistent timestamps across timezones
- `created_at` set once on INSERT
- `updated_at` set on every UPDATE via SQLModel event or default

**Alternatives Considered**:
- Naive datetime: Rejected; timezone ambiguity
- String timestamps: Rejected; loses database indexing benefits

**Pattern**:
```python
from datetime import datetime, timezone

class Task(SQLModel, table=True):
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```

---

### RQ-5: User-Scoped Query Pattern

**Decision**: All queries MUST include `user_id` in WHERE clause. No exceptions.

**Rationale**:
- Enforces data isolation at query level (Constitution III, V)
- Returns 404 for both "not found" and "wrong user" (FR-009)
- Prevents information leakage about task existence

**Pattern**:
```python
# Correct: Always filter by user_id
task = session.exec(
    select(Task).where(Task.id == task_id, Task.user_id == user_id)
).first()

# NEVER: Query by task_id alone, then check user_id
# This leaks information about task existence
```

---

### RQ-6: Error Response Format

**Decision**: Use FastAPI's HTTPException with standard status codes and JSON detail.

**Rationale**:
- Matches SC-003: 200/201 (Success), 404 (Not Found), 422 (Validation), 500 (Server)
- Consistent error shape: `{"detail": "message"}`
- Pydantic validation errors automatically return 422

**HTTP Status Code Usage**:
| Code | Usage |
|------|-------|
| 200 | Successful GET, PUT, PATCH, DELETE |
| 201 | Successful POST (resource created) |
| 404 | Task not found OR user mismatch (same response) |
| 422 | Validation error (invalid input) |
| 500 | Database/server errors |

---

### RQ-7: Input Validation Strategy

**Decision**: Use Pydantic models (via SQLModel) for request body validation.

**Rationale**:
- Automatic 422 responses for invalid data (FR-010)
- Type coercion and constraints via Field validators
- Separate Create/Update/Read schemas for precise control

**Schemas**:
- `TaskCreate`: title (required), description (optional)
- `TaskUpdate`: title (optional), description (optional), is_completed (optional)
- `TaskRead`: Full task representation with all fields

---

## Dependencies Confirmed

| Package | Version | Purpose |
|---------|---------|---------|
| fastapi | >=0.109.0 | Web framework |
| sqlmodel | >=0.0.14 | ORM with Pydantic integration |
| uvicorn | >=0.27.0 | ASGI server |
| asyncpg | >=0.29.0 | Async PostgreSQL driver |
| python-dotenv | >=1.0.0 | Environment variable loading |
| httpx | >=0.26.0 | Testing HTTP client |
| pytest | >=8.0.0 | Testing framework |
| pytest-asyncio | >=0.23.0 | Async test support |

---

## Risks Identified

1. **Neon Cold Start**: First connection may have latency. Mitigation: Connection pooling, health check endpoint.
2. **UUID Indexing**: UUIDs are larger than integers. Mitigation: Acceptable for this scale; add index on (user_id, id).
3. **No Auth Layer**: user_id is trusted input. Mitigation: Documented as explicit scope limitation; auth added in future spec.
