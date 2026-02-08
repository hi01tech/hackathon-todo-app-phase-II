# Implementation Plan: Core Task Management Backend

**Branch**: `001-task-backend-core` | **Date**: 2026-01-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-task-backend-core/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a RESTful Task Management API using FastAPI and SQLModel with Neon PostgreSQL. The backend provides full CRUD operations for tasks with strict user-scoped data isolation. Authentication is deferred; `user_id` is treated as a trusted path parameter for this phase.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI, SQLModel, uvicorn, asyncpg, python-dotenv
**Storage**: Neon Serverless PostgreSQL
**Testing**: pytest, pytest-asyncio, httpx (TestClient)
**Target Platform**: Linux server / Docker container
**Project Type**: web (backend-only for this spec)
**Performance Goals**: Standard CRUD latency (<100ms p95 for simple operations)
**Constraints**: User-scoped queries mandatory; no auth middleware in this phase
**Scale/Scope**: Single-user development; foundation for multi-user auth integration

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-First Development | ✅ PASS | All endpoints derived from FR-001 through FR-010 |
| II. Correctness Over Speed | ✅ PASS | No assumptions; spec defines exact behavior |
| III. Security-By-Design | ⚠️ DEFERRED | JWT auth deferred per spec; user_id isolation enforced |
| IV. Reproducibility | ✅ PASS | Following Spec → Plan → Tasks → Implementation |
| V. Separation of Concerns | ✅ PASS | Backend-only; no frontend coupling |

**Gate Result**: PASS (Security deferred by explicit spec scope; data isolation enforced at query level)

## Project Structure

### Documentation (this feature)

```text
specs/001-task-backend-core/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   └── openapi.yaml     # OpenAPI 3.0 specification
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Environment configuration
│   ├── database.py          # SQLModel engine & session management
│   ├── models/
│   │   ├── __init__.py
│   │   └── task.py          # Task SQLModel + Pydantic schemas
│   └── routers/
│       ├── __init__.py
│       └── tasks.py         # Task CRUD endpoints
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # pytest fixtures
│   ├── test_tasks.py        # Task endpoint tests
│   └── test_models.py       # Model validation tests
├── requirements.txt
├── .env.example
└── README.md
```

**Structure Decision**: Web application backend-only structure. Frontend will be added in a separate spec. The `backend/` directory isolates Python/FastAPI code from future `frontend/` Next.js code.

## Complexity Tracking

> No violations requiring justification. Design follows minimal viable approach.

## Phase 0 Artifacts

- **[research.md](./research.md)**: Research decisions for SQLModel patterns, session management, UUID keys, timestamps, user-scoped queries, and error handling.

## Phase 1 Artifacts

- **[data-model.md](./data-model.md)**: Task entity definition, SQLModel schema, Pydantic request/response models, validation rules.
- **[contracts/openapi.yaml](./contracts/openapi.yaml)**: OpenAPI 3.0 specification for all 6 endpoints.
- **[quickstart.md](./quickstart.md)**: Local development setup guide.

## API Endpoints Summary

| Method | Path | Description | Status Codes |
|--------|------|-------------|--------------|
| GET | `/api/{user_id}/tasks` | List all tasks for user | 200, 500 |
| POST | `/api/{user_id}/tasks` | Create new task | 201, 422, 500 |
| GET | `/api/{user_id}/tasks/{task_id}` | Get specific task | 200, 404, 422, 500 |
| PUT | `/api/{user_id}/tasks/{task_id}` | Update task | 200, 404, 422, 500 |
| DELETE | `/api/{user_id}/tasks/{task_id}` | Delete task | 200, 404, 422, 500 |
| PATCH | `/api/{user_id}/tasks/{task_id}/complete` | Toggle completion | 200, 404, 422, 500 |

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Primary Key | UUID v4 | Prevents enumeration attacks (FR-009) |
| Session Management | Async dependency injection | Request-scoped, auto-cleanup (SC-004) |
| User Isolation | WHERE clause filtering | All queries include user_id (Constitution III) |
| 404 vs 403 | Always 404 | Security through obscurity (FR-009) |
| Timestamps | UTC timezone-aware | Consistent across deployments |

## Next Steps

1. Run `/sp.tasks` to generate implementation tasks from this plan
2. Implement tasks following TDD workflow (Red → Green → Refactor)
3. Verify all acceptance scenarios from spec pass

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Neon cold start latency | First request slow | Add health check endpoint; connection keep-alive |
| No auth layer | user_id can be spoofed | Documented limitation; auth spec follows |
| UUID storage overhead | Slightly larger indexes | Acceptable for security benefit at this scale |
