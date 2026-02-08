# Implementation Plan: Authentication & Security Integration

**Branch**: `002-auth-jwt-integration` | **Date**: 2026-01-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-auth-jwt-integration/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement stateless JWT-based authentication using Better Auth on the Next.js frontend and PyJWT verification on the FastAPI backend. Users register and sign in via Better Auth, receive JWT tokens, and all API requests are protected by token validation. Task ownership is enforced using user identity extracted from JWT payload, replacing the URL-based user_id from Spec 1.

## Technical Context

**Language/Version**: TypeScript 5.x (Frontend), Python 3.11+ (Backend)
**Primary Dependencies**: Better Auth, Next.js 16+, PyJWT, FastAPI
**Storage**: Neon Serverless PostgreSQL (existing), Better Auth session storage
**Testing**: Jest/Vitest (Frontend), pytest (Backend)
**Target Platform**: Web browser (Frontend), Linux server (Backend)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: Token validation <50ms overhead per request (SC-006)
**Constraints**: Stateless auth only; no refresh tokens; 24-hour token expiry
**Scale/Scope**: Multi-user concurrent access without session conflicts

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-First Development | ✅ PASS | All requirements from FR-001 to FR-021 |
| II. Correctness Over Speed | ✅ PASS | Following spec exactly; no assumptions |
| III. Security-By-Design | ✅ PASS | JWT verification at every endpoint; user isolation enforced |
| IV. Reproducibility | ✅ PASS | Following Spec → Plan → Tasks → Implementation |
| V. Separation of Concerns | ✅ PASS | Frontend auth (Better Auth), Backend verification (PyJWT) |

**Gate Result**: PASS - All constitution principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/002-auth-jwt-integration/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   └── auth-openapi.yaml
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   │   └── page.tsx
│   │   │   ├── sign-up/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (protected)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...all]/
│   │   │           └── route.ts
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   ├── auth.ts           # Better Auth client config
│   │   ├── auth-client.ts    # Client-side auth utilities
│   │   └── api-client.ts     # API client with JWT attachment
│   ├── components/
│   │   ├── auth/
│   │   │   ├── SignInForm.tsx
│   │   │   ├── SignUpForm.tsx
│   │   │   └── SignOutButton.tsx
│   │   └── ui/
│   └── middleware.ts         # Route protection middleware
├── package.json
├── .env.local.example
└── next.config.js

backend/
├── app/
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── jwt_handler.py    # JWT verification logic
│   │   └── dependencies.py   # FastAPI auth dependencies
│   ├── models/
│   │   └── task.py           # (existing from Spec 1)
│   ├── routers/
│   │   └── tasks.py          # (updated with auth dependency)
│   ├── config.py             # (add JWT_SECRET)
│   ├── database.py           # (existing)
│   └── main.py               # (existing)
├── tests/
│   └── test_auth.py
├── requirements.txt          # (add PyJWT)
└── .env                      # (add JWT_SECRET)
```

**Structure Decision**: Web application with separate frontend (Next.js) and backend (FastAPI). Backend extends existing Spec 1 structure with new `auth/` module. Frontend is new.

## Complexity Tracking

> No violations requiring justification. Design follows minimal viable approach with clear separation.

## Phase 0 Artifacts

- **[research.md](./research.md)**: Research on Better Auth JWT integration, PyJWT verification patterns, and token storage strategies.

## Phase 1 Artifacts

- **[data-model.md](./data-model.md)**: User entity for Better Auth, JWT payload structure.
- **[contracts/auth-openapi.yaml](./contracts/auth-openapi.yaml)**: Auth endpoint contracts (handled by Better Auth).
- **[quickstart.md](./quickstart.md)**: Setup guide for auth integration.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  Sign Up/Sign In Forms  →  Better Auth  →  JWT Issued           │
│                              ↓                                   │
│  Protected Routes  ←  Middleware checks session                  │
│                              ↓                                   │
│  API Client  →  Attaches JWT to Authorization header             │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ HTTP + JWT Bearer Token
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (FastAPI)                         │
├─────────────────────────────────────────────────────────────────┤
│  Auth Middleware  →  Extract JWT  →  Verify Signature            │
│                              ↓                                   │
│  Auth Dependency  →  Decode Payload  →  Extract user_id          │
│                              ↓                                   │
│  Task Endpoints  →  Filter by user_id from JWT (not URL)         │
└─────────────────────────────────────────────────────────────────┘
```

## API Endpoint Changes

### Existing Endpoints (from Spec 1) - Now Protected

| Endpoint | Change |
|----------|--------|
| `GET /api/tasks` | Remove `{user_id}` from path; use JWT identity |
| `POST /api/tasks` | Remove `{user_id}` from path; use JWT identity |
| `GET /api/tasks/{task_id}` | Verify ownership via JWT identity |
| `PUT /api/tasks/{task_id}` | Verify ownership via JWT identity |
| `DELETE /api/tasks/{task_id}` | Verify ownership via JWT identity |
| `PATCH /api/tasks/{task_id}/complete` | Verify ownership via JWT identity |

### New Response Codes

| Code | When |
|------|------|
| 401 Unauthorized | Missing token, invalid token, expired token |
| 404 Not Found | Task doesn't exist OR belongs to different user |

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth Library | Better Auth | Constitution requirement; handles password hashing |
| Token Storage | httpOnly cookie | XSS protection (FR-012) |
| Token Transport | Authorization: Bearer | Standard pattern; works with CORS |
| JWT Algorithm | HS256 | Shared secret between services (FR-008) |
| Token Expiry | 24 hours | Balance security/UX; no refresh tokens |
| User ID Source | JWT payload only | Never trust URL path (FR-018) |
| Error Response | 404 for ownership failures | Prevent enumeration (FR-019) |

## Security Considerations

1. **Shared Secret Management**: JWT_SECRET in environment variables, never in code
2. **Token Validation**: Every request validated; no caching of validation results
3. **Password Security**: Better Auth handles hashing (bcrypt/argon2)
4. **CORS Configuration**: Restrict to frontend origin in production
5. **HTTPS**: Required in production (FR-021)

## Next Steps

1. Run `/sp.tasks` to generate implementation tasks from this plan
2. Implement in order: Backend auth → Frontend auth → Integration
3. Test each user story independently

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Token expiry UX | Users lose work | Clear messaging; save state before redirect |
| Secret rotation | All users logged out | Document rotation procedure; plan maintenance window |
| CORS misconfiguration | Auth fails silently | Test cross-origin early; clear error messages |
