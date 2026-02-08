# Tasks: Authentication & Security Integration

**Input**: Design documents from `/specs/002-auth-jwt-integration/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/auth-openapi.yaml

**Tests**: Not explicitly requested in spec. Tests omitted per template guidelines.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US5)
- Paths relative to `frontend/` or `backend/` directories

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize frontend project and add backend auth dependencies

- [ ] T001 Create frontend directory structure per plan.md in frontend/
- [ ] T002 Initialize Next.js 16+ project with App Router in frontend/
- [ ] T003 Install Better Auth and JWT dependencies in frontend/package.json
- [ ] T004 [P] Create frontend/.env.local.example with auth environment variables
- [ ] T005 [P] Add PyJWT to backend/requirements.txt
- [ ] T006 [P] Add JWT_SECRET to backend/.env and backend/.env.example
- [ ] T007 [P] Create backend/app/auth/__init__.py package marker
- [ ] T008 [P] Create frontend/src/lib/ directory structure

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core auth infrastructure that MUST be complete before user stories

**⚠️ CRITICAL**: No auth flow work can begin until this phase is complete

### Backend Auth Module

- [ ] T009 Add JWT_SECRET and JWT_ALGORITHM to backend/app/config.py
- [ ] T010 Create JWT verification handler in backend/app/auth/jwt_handler.py
- [ ] T011 Create auth dependency (get_current_user) in backend/app/auth/dependencies.py
- [ ] T012 Export auth dependencies in backend/app/auth/__init__.py

### Frontend Auth Setup

- [ ] T013 Configure Better Auth server in frontend/src/lib/auth.ts
- [ ] T014 Create Better Auth API route handler in frontend/src/app/api/auth/[...all]/route.ts
- [ ] T015 Create auth client utilities in frontend/src/lib/auth-client.ts
- [ ] T016 Create API client with JWT attachment in frontend/src/lib/api-client.ts

**Checkpoint**: Foundation ready - auth flows can now be implemented

---

## Phase 3: User Story 1 - User Registration (Priority: P1) 🎯 MVP

**Goal**: Allow new users to create accounts with email and password

**Independent Test**: Complete signup form with valid email/password, verify account created

**Acceptance Scenarios**:
1. Valid email + password (8+ chars) → account created
2. Duplicate email → error message shown
3. Weak password → validation error shown

### Implementation for User Story 1

- [ ] T017 [P] [US1] Create SignUpForm component in frontend/src/components/auth/SignUpForm.tsx
- [ ] T018 [US1] Create sign-up page in frontend/src/app/(auth)/sign-up/page.tsx
- [ ] T019 [US1] Create auth layout in frontend/src/app/(auth)/layout.tsx
- [ ] T020 [US1] Add email and password validation to SignUpForm in frontend/src/components/auth/SignUpForm.tsx

**Checkpoint**: User Story 1 complete - users can register accounts

---

## Phase 4: User Story 2 - User Sign In & Token Issuance (Priority: P1)

**Goal**: Allow registered users to sign in and receive JWT tokens

**Independent Test**: Sign in with valid credentials, verify JWT issued and stored

**Acceptance Scenarios**:
1. Correct credentials → JWT issued, redirected to dashboard
2. Wrong credentials → error message, no token
3. Session persists across browser refresh

### Implementation for User Story 2

- [ ] T021 [P] [US2] Create SignInForm component in frontend/src/components/auth/SignInForm.tsx
- [ ] T022 [US2] Create sign-in page in frontend/src/app/(auth)/sign-in/page.tsx
- [ ] T023 [US2] Add form validation and error handling to SignInForm
- [ ] T024 [US2] Configure token storage (httpOnly cookie) in frontend/src/lib/auth.ts

**Checkpoint**: User Story 2 complete - users can sign in and receive tokens

---

## Phase 5: User Story 3 - Protected API Access (Priority: P1)

**Goal**: Protect all task endpoints with JWT verification

**Independent Test**: Make API requests with/without valid tokens, verify 401 for invalid

**Acceptance Scenarios**:
1. Valid token → request succeeds
2. No token → 401 Unauthorized
3. Expired token → 401 Unauthorized

### Implementation for User Story 3

- [ ] T025 [US3] Update task endpoints to remove {user_id} from URL path in backend/app/routers/tasks.py
- [ ] T026 [US3] Add auth dependency to all task endpoints in backend/app/routers/tasks.py
- [ ] T027 [US3] Update task router registration (remove /api/{user_id} prefix) in backend/app/main.py
- [ ] T028 [US3] Handle 401 responses in API client in frontend/src/lib/api-client.ts

**Checkpoint**: User Story 3 complete - all endpoints require valid JWT

---

## Phase 6: User Story 4 - Task Ownership Enforcement (Priority: P1)

**Goal**: Use JWT identity for task ownership instead of URL parameter

**Independent Test**: Create tasks as User A, verify User B cannot access them

**Acceptance Scenarios**:
1. Create task → associated with JWT user identity
2. Access other user's task → 404 (not 403)
3. List tasks → only own tasks returned

### Implementation for User Story 4

- [ ] T029 [US4] Extract user_id from JWT in task creation endpoint in backend/app/routers/tasks.py
- [ ] T030 [US4] Filter task list by JWT user_id in backend/app/routers/tasks.py
- [ ] T031 [US4] Verify ownership using JWT user_id in GET single task in backend/app/routers/tasks.py
- [ ] T032 [US4] Verify ownership using JWT user_id in PUT endpoint in backend/app/routers/tasks.py
- [ ] T033 [US4] Verify ownership using JWT user_id in DELETE endpoint in backend/app/routers/tasks.py
- [ ] T034 [US4] Verify ownership using JWT user_id in PATCH complete endpoint in backend/app/routers/tasks.py

**Checkpoint**: User Story 4 complete - task ownership enforced via JWT

---

## Phase 7: User Story 5 - User Sign Out (Priority: P2)

**Goal**: Allow users to sign out and clear their session

**Independent Test**: Sign out, verify token cleared, subsequent requests fail auth

**Acceptance Scenarios**:
1. Click sign out → token removed, redirected to sign-in
2. After sign out → protected pages redirect to sign-in

### Implementation for User Story 5

- [ ] T035 [P] [US5] Create SignOutButton component in frontend/src/components/auth/SignOutButton.tsx
- [ ] T036 [US5] Add sign out handler to auth client in frontend/src/lib/auth-client.ts
- [ ] T037 [US5] Create protected layout with sign out button in frontend/src/app/(protected)/layout.tsx

**Checkpoint**: User Story 5 complete - users can sign out

---

## Phase 8: Frontend Protected Routes & Dashboard

**Purpose**: Create protected pages and route middleware

- [ ] T038 Create route protection middleware in frontend/src/middleware.ts
- [ ] T039 Create dashboard page in frontend/src/app/(protected)/dashboard/page.tsx
- [ ] T040 Create root layout with providers in frontend/src/app/layout.tsx
- [ ] T041 Create home page with auth redirect in frontend/src/app/page.tsx
- [ ] T042 [P] Create next.config.js with API proxy settings in frontend/next.config.js

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, validation, and final integration

- [ ] T043 [P] Create frontend README.md with setup instructions in frontend/README.md
- [ ] T044 [P] Update backend README.md with auth documentation in backend/README.md
- [ ] T045 Validate auth flow end-to-end per quickstart.md
- [ ] T046 Test cross-user data isolation (User A cannot see User B tasks)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **US1 Registration (Phase 3)**: Depends on Foundational
- **US2 Sign In (Phase 4)**: Depends on US1 (need user to sign in)
- **US3 Protected API (Phase 5)**: Depends on Foundational (backend) + US2 (frontend token)
- **US4 Ownership (Phase 6)**: Depends on US3 (auth dependency in place)
- **US5 Sign Out (Phase 7)**: Depends on US2 (need signed-in state)
- **Protected Routes (Phase 8)**: Depends on US2, US3
- **Polish (Phase 9)**: Depends on all phases complete

### User Story Dependencies

| Story | Depends On | Notes |
|-------|------------|-------|
| US1 (Registration) | Phase 2 | Entry point - MVP |
| US2 (Sign In) | US1 | Need registered user |
| US3 (Protected API) | Phase 2 | Backend-focused |
| US4 (Ownership) | US3 | Builds on auth dependency |
| US5 (Sign Out) | US2 | Need signed-in state |

### Parallel Opportunities

**Phase 1 parallel tasks** (T004-T008):
```
T004 [P] frontend/.env.local.example
T005 [P] backend/requirements.txt
T006 [P] backend/.env JWT_SECRET
T007 [P] backend/app/auth/__init__.py
T008 [P] frontend/src/lib/ directory
```

**Phase 3 parallel** (T017):
```
T017 [P] SignUpForm component (no dependencies within phase)
```

**Phase 7 parallel** (T035):
```
T035 [P] SignOutButton component
```

---

## Implementation Strategy

### MVP First (US1 + US2 + US3)

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T016)
3. Complete Phase 3: US1 Registration (T017-T020)
4. Complete Phase 4: US2 Sign In (T021-T024)
5. Complete Phase 5: US3 Protected API (T025-T028)
6. **STOP and VALIDATE**: Test signup → signin → API access
7. Deploy/demo MVP

### Full Implementation

1. Setup + Foundational → Foundation ready
2. US1 → Registration works
3. US2 → Sign in works, JWT issued
4. US3 → API protected
5. US4 → Ownership enforced
6. US5 → Sign out works
7. Protected Routes → Dashboard accessible
8. Polish → Documentation complete

---

## Task Summary

| Phase | Task Range | Count | Purpose |
|-------|------------|-------|---------|
| Setup | T001-T008 | 8 | Project initialization |
| Foundational | T009-T016 | 8 | Auth infrastructure |
| US1 (Registration) | T017-T020 | 4 | User signup |
| US2 (Sign In) | T021-T024 | 4 | JWT issuance |
| US3 (Protected API) | T025-T028 | 4 | Endpoint protection |
| US4 (Ownership) | T029-T034 | 6 | JWT-based filtering |
| US5 (Sign Out) | T035-T037 | 3 | Session termination |
| Protected Routes | T038-T042 | 5 | Frontend routing |
| Polish | T043-T046 | 4 | Documentation |
| **Total** | T001-T046 | **46** | |

---

## Notes

- JWT_SECRET must match between frontend (BETTER_AUTH_SECRET) and backend (JWT_SECRET)
- All task endpoints change from `/api/{user_id}/tasks` to `/api/tasks`
- User identity comes from JWT payload `sub` claim only
- Return 404 (not 403) for ownership failures to prevent enumeration
- Token expiry: 24 hours (no refresh tokens)
