# Feature Specification: Core Task Management Backend

**Feature Branch**: `001-task-backend-core`
**Created**: 2026-01-17
**Status**: Draft
**Input**: Spec 1 – Core Task Management Backend (FastAPI + Database)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Task Management CRUD (Priority: P1)

Developers and API consumers need a robust set of endpoints to manage tasks so they can build the frontend application.

**Why this priority**: Use core functionality of the application. Without this, there is no app.

**Independent Test**: Can be fully tested using `curl` or Postman to cycle a task through its lifecycle (create -> read -> update -> complete -> delete) without a frontend.

**Acceptance Scenarios**:

1. **Given** a user ID "user_123", **When** I POST a new task, **Then** it is saved and returned with a generated ID.
2. **Given** an existing task, **When** I GET the task by ID, **Then** all task details are returned.
3. **Given** an existing task, **When** I PATCH the task as complete, **Then** the `is_completed` status updates to true.
4. **Given** an existing task, **When** I DELETE the task, **Then** it is no longer retrievable via GET.

---

### User Story 2 - User Data Isolation (Priority: P1)

The system must ensure that tasks are strictly associated with their owner, even before full authentication is implemented.

**Why this priority**: Security foundation. We must build data isolation into the queries from day one.

**Independent Test**: Create tasks for "user_A" and "user_B", then verify "user_A" lists ONLY their tasks.

**Acceptance Scenarios**:

1. **Given** tasks exist for "user_A" and "user_B", **When** I GET `/api/user_A/tasks`, **Then** only "user_A" tasks are returned.
2. **Given** a task belongs to "user_B", **When** "user_A" attempts to GET/UPDATE/DELETE it, **Then** the system returns 404 Not Found (preserving privacy).

---

### Edge Cases

- **Task Mismatch**: If `user_id` in path does not match task owner, return 404 (not 403) to prevent enumeration.
- **Invalid ID Format**: If `task_id` is not a valid identifier, return 422 Unprocessable Entity.
- **Empty Payload**: POST/PUT with empty bodies should return 422.
- **Database Failure**: Connection issues must raise 500 Internal Server Error with safe error details.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a FastAPI application with `SQLModel` integration for Neon PostgreSQL.
- **FR-002**: System MUST define a `Task` SQLModel with fields: `id` (UUID/int), `title` (str), `description` (str, optional), `is_completed` (bool), `user_id` (str/int), `created_at` (datetime), `updated_at` (datetime).
- **FR-003**: System MUST expose `GET /api/{user_id}/tasks` to list all tasks for a specific user.
- **FR-004**: System MUST expose `POST /api/{user_id}/tasks` to create a new task for a specific user.
- **FR-005**: System MUST expose `GET /api/{user_id}/tasks/{id}` to retrieve a specific task, strictly scoped to the `user_id` in the path.
- **FR-006**: System MUST expose `PUT /api/{user_id}/tasks/{id}` to update a task, scoped to `user_id`.
- **FR-007**: System MUST expose `DELETE /api/{user_id}/tasks/{id}` to delete a task, scoped to `user_id`.
- **FR-008**: System MUST expose `PATCH /api/{user_id}/tasks/{id}/complete` to mark a task as done.
- **FR-009**: System MUST return 404 if a task is not found OR if the task ID does not match the `user_id` provided (security through obscurity).
- **FR-010**: System MUST validate input data using Pydantic/SQLModel models (return 422 for invalid data).

### Key Entities

- **Task**: The core unit of work. Belongs to a single User (via `user_id`).
- **User**: (Implicit for now) Identified strictly by `user_id` string passed in URL path.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: API provides 100% coverage of CRUD operations for Tasks (Verified by tests).
- **SC-002**: All database queries include `user_id` filter (Verified by code review/checks).
- **SC-003**: API returns standard HTTP status codes: 200/201 (Success), 404 (Not Found), 422 (Validation Error), 500 (Server Error).
- **SC-004**: Database connections are managed via a session dependency that closes after request.
