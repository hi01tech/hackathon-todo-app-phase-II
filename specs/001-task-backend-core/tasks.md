# Tasks: Core Task Management Backend

**Input**: Design documents from `/specs/001-task-backend-core/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml

**Tests**: Not explicitly requested in spec. Tests omitted per template guidelines.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)
- All paths relative to `backend/` directory

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and Python/FastAPI structure

- [x] T001 Create backend directory structure per plan.md in backend/
- [x] T002 Initialize Python project with requirements.txt in backend/requirements.txt
- [x] T003 [P] Create .env.example with DATABASE_URL template in backend/.env.example
- [x] T004 [P] Create backend/app/__init__.py package marker
- [x] T005 [P] Create backend/app/models/__init__.py package marker
- [x] T006 [P] Create backend/app/routers/__init__.py package marker
- [x] T007 [P] Create backend/tests/__init__.py package marker

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before user story work begins

**⚠️ CRITICAL**: No endpoint work can begin until this phase is complete

- [x] T008 Implement environment configuration in backend/app/config.py
- [x] T009 Implement async database engine and session management in backend/app/database.py
- [x] T010 Create Task SQLModel and Pydantic schemas in backend/app/models/task.py
- [x] T011 Create FastAPI application entry point with lifespan in backend/app/main.py
- [x] T012 Add health check endpoint to backend/app/main.py
- [x] T013 [P] Create pytest fixtures in backend/tests/conftest.py

**Checkpoint**: Foundation ready - API endpoint implementation can now begin

---

## Phase 3: User Story 1 - Task Management CRUD (Priority: P1) 🎯 MVP

**Goal**: Provide full CRUD operations for tasks so developers can build frontend applications

**Independent Test**: Use curl/Postman to cycle a task through create → read → update → complete → delete

**Acceptance Scenarios**:
1. POST new task → saved with generated UUID
2. GET task by ID → all details returned
3. PATCH complete → is_completed toggles to true
4. DELETE task → no longer retrievable

### Implementation for User Story 1

- [x] T014 [US1] Implement POST /api/{user_id}/tasks endpoint in backend/app/routers/tasks.py
- [x] T015 [US1] Implement GET /api/{user_id}/tasks endpoint (list all) in backend/app/routers/tasks.py
- [x] T016 [US1] Implement GET /api/{user_id}/tasks/{task_id} endpoint in backend/app/routers/tasks.py
- [x] T017 [US1] Implement PUT /api/{user_id}/tasks/{task_id} endpoint in backend/app/routers/tasks.py
- [x] T018 [US1] Implement DELETE /api/{user_id}/tasks/{task_id} endpoint in backend/app/routers/tasks.py
- [x] T019 [US1] Implement PATCH /api/{user_id}/tasks/{task_id}/complete endpoint in backend/app/routers/tasks.py
- [x] T020 [US1] Register tasks router in backend/app/main.py
- [x] T021 [US1] Add input validation error handling (422) in backend/app/routers/tasks.py

**Checkpoint**: User Story 1 complete - full CRUD lifecycle testable with curl

---

## Phase 4: User Story 2 - User Data Isolation (Priority: P1)

**Goal**: Ensure tasks are strictly associated with their owner via user_id filtering

**Independent Test**: Create tasks for user_A and user_B, verify user_A only sees their tasks

**Acceptance Scenarios**:
1. GET /api/user_A/tasks → only user_A tasks returned
2. user_A attempts GET/PUT/DELETE on user_B's task → 404 (not 403)

### Implementation for User Story 2

- [x] T022 [US2] Enforce user_id filter on GET list endpoint in backend/app/routers/tasks.py
- [x] T023 [US2] Enforce user_id + task_id compound lookup on GET single in backend/app/routers/tasks.py
- [x] T024 [US2] Enforce user_id + task_id compound lookup on PUT in backend/app/routers/tasks.py
- [x] T025 [US2] Enforce user_id + task_id compound lookup on DELETE in backend/app/routers/tasks.py
- [x] T026 [US2] Enforce user_id + task_id compound lookup on PATCH complete in backend/app/routers/tasks.py
- [x] T027 [US2] Return 404 (not 403) for user mismatch in all endpoints in backend/app/routers/tasks.py

**Checkpoint**: User Story 2 complete - data isolation verified across users

---

## Phase 5: Edge Cases & Error Handling

**Purpose**: Handle edge cases per spec requirements

- [x] T028 Handle invalid UUID format with 422 response in backend/app/routers/tasks.py
- [x] T029 Handle empty POST/PUT body with 422 response in backend/app/routers/tasks.py
- [x] T030 Handle database connection failures with 500 response in backend/app/database.py
- [x] T031 Add updated_at timestamp update on PUT/PATCH operations in backend/app/routers/tasks.py

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and final validation

- [x] T032 [P] Create README.md with setup instructions in backend/README.md
- [x] T033 [P] Validate all endpoints against contracts/openapi.yaml
- [x] T034 Run quickstart.md validation (health check + CRUD cycle)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational
- **User Story 2 (Phase 4)**: Depends on User Story 1 (refines existing endpoints)
- **Edge Cases (Phase 5)**: Depends on User Stories 1 & 2
- **Polish (Phase 6)**: Depends on all phases complete

### User Story Dependencies

| Story | Depends On | Notes |
|-------|------------|-------|
| US1 (CRUD) | Phase 2 | Core functionality - MVP |
| US2 (Isolation) | US1 | Adds filtering to existing endpoints |

### Parallel Opportunities

**Phase 1 parallel tasks** (T003-T007):
```
T003 [P] .env.example
T004 [P] app/__init__.py
T005 [P] models/__init__.py
T006 [P] routers/__init__.py
T007 [P] tests/__init__.py
```

**Phase 6 parallel tasks** (T032-T033):
```
T032 [P] README.md
T033 [P] OpenAPI validation
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T013)
3. Complete Phase 3: User Story 1 (T014-T021)
4. **STOP and VALIDATE**: Test CRUD with curl
5. Deploy/demo MVP

### Full Implementation

1. Setup + Foundational → Foundation ready
2. User Story 1 → CRUD works → Demo MVP
3. User Story 2 → Data isolation enforced
4. Edge Cases → Robust error handling
5. Polish → Documentation complete

---

## Task Summary

| Phase | Task Range | Count | Purpose |
|-------|------------|-------|---------|
| Setup | T001-T007 | 7 | Project structure |
| Foundational | T008-T013 | 6 | Core infrastructure |
| US1 (CRUD) | T014-T021 | 8 | MVP functionality |
| US2 (Isolation) | T022-T027 | 6 | Security foundation |
| Edge Cases | T028-T031 | 4 | Error handling |
| Polish | T032-T034 | 3 | Documentation |
| **Total** | T001-T034 | **34** | |

---

## Notes

- All queries MUST include user_id in WHERE clause (Constitution III)
- Return 404 for both "not found" AND "wrong user" (FR-009)
- UUID primary keys prevent enumeration attacks
- Async SQLModel with asyncpg driver
- Session dependency auto-closes after request
