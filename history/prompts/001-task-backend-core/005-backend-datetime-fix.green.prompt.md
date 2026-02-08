---
id: 005
title: Backend Datetime Fix Applied
stage: green
date: 2026-01-25
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-task-backend-core
branch: 001-task-backend-core
user: developer
command: debugging
labels: [bugfix, datetime, asyncpg, neon]
links:
  spec: specs/001-task-backend-core/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/app/models/task.py
  - backend/app/routers/tasks.py
tests:
  - Manual curl tests passed
---

## Prompt

User reported 500 Internal Server Error when creating tasks. Error: "can't subtract offset-naive and offset-aware datetimes"

## Response snapshot

Fixed timezone-aware datetime issue with asyncpg/Neon PostgreSQL:

**Root Cause**:
- Task model used `datetime.now(timezone.utc)` which creates timezone-aware datetimes
- Neon PostgreSQL column was `TIMESTAMP WITHOUT TIME ZONE`
- asyncpg couldn't convert between the two formats

**Fix Applied**:
1. Changed `datetime.now(timezone.utc)` to `datetime.utcnow()` in models/task.py
2. Changed `datetime.now(timezone.utc)` to `datetime.utcnow()` in routers/tasks.py

**Verification**:
All CRUD endpoints tested successfully:
- POST /api/{user_id}/tasks → 201 Created
- GET /api/{user_id}/tasks → 200 OK (list)
- GET /api/{user_id}/tasks/{id} → 200 OK (single)
- PUT /api/{user_id}/tasks/{id} → 200 OK (update)
- PATCH /api/{user_id}/tasks/{id}/complete → 200 OK (toggle)
- DELETE /api/{user_id}/tasks/{id} → 200 OK

User isolation verified:
- Different users see only their own tasks
- Cross-user access returns 404 (not 403)

## Outcome

- ✅ Impact: Backend fully functional
- 🧪 Tests: All manual curl tests passed
- 📁 Files: 2 files modified
- 🔁 Next prompts: Frontend implementation or additional features
- 🧠 Reflection: asyncpg has strict datetime handling; use naive UTC datetimes for TIMESTAMP WITHOUT TIME ZONE columns

## Evaluation notes (flywheel)

- Failure modes observed: Timezone mismatch between Python and PostgreSQL
- Graders run and results: PASS (all endpoints working)
- Prompt variant: Debugging session
- Next experiment: Consider using TIMESTAMP WITH TIME ZONE in schema for better timezone handling
