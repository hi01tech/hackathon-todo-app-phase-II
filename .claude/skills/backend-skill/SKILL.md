---
name: backend-skill
description: Generate RESTful API routes, handle requests and responses, and connect to a PostgreSQL database using FastAPI and SQLModel with JWT-based user isolation.
---

# Backend Skill

## Instructions

### 1. API route generation
- Implement RESTful API endpoints using FastAPI
- Match routes exactly to the required API contract:
  - GET /api/{user_id}/tasks
  - POST /api/{user_id}/tasks
  - GET /api/{user_id}/tasks/{id}
  - PUT /api/{user_id}/tasks/{id}
  - DELETE /api/{user_id}/tasks/{id}
  - PATCH /api/{user_id}/tasks/{id}/complete
- Organize routes by feature/module (e.g., tasks)
- Use clear route prefixes and versioning if needed

### 2. Request and response handling
- Parse request body, path parameters, query parameters, and headers
- Validate incoming request data using Pydantic/SQLModel schemas
- Return consistent JSON responses with correct HTTP status codes
- Handle common errors (400, 401, 403, 404, 500)
- Ensure responses never expose data from other users

### 3. Authentication-aware request processing
- Require a valid JWT token on all API routes
- Extract JWT from `Authorization: Bearer <token>` header
- Decode token to identify authenticated user
- Enforce that `{user_id}` in the route matches the authenticated user
- Reject unauthorized or mismatched requests with 401/403 errors

### 4. Database connectivity
- Connect FastAPI to Neon Serverless PostgreSQL
- Use SQLModel for ORM-based database access
- Manage database sessions using FastAPI dependencies
- Handle database connection lifecycle safely
- Ensure compatibility with serverless Postgres constraints

### 5. CRUD operations with ownership enforcement
- Implement Create, Read, Update, Delete operations for tasks
- Filter all database queries by authenticated user ID
- Prevent access to tasks owned by other users
- Use transactions for write operations
- Support pagination and filtering for task lists

### 6. Security and reliability
- Never trust user IDs from request body alone
- Enforce task ownership on every operation
- Sanitize inputs to prevent injection attacks
- Handle concurrent requests safely
- Keep business logic separate from route definitions

## Best Practices
- Keep routes thin and delegate logic to service layers
- Centralize authentication and JWT verification logic
- Use dependency injection for database sessions and auth
- Return explicit error messages without leaking internals
- Write code that is easy for Claude Code to extend incrementally

## Example Structure
```python
# FastAPI + SQLModel example
from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, select
from db import get_session
from auth import get_current_user
from models import Task

app = FastAPI()

@app.get("/api/{user_id}/tasks")
def list_tasks(
    user_id: int,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user)
):
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    tasks = session.exec(
        select(Task).where(Task.user_id == current_user.id)
    ).all()
    return tasks
