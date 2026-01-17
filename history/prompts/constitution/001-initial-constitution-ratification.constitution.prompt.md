---
id: 001
title: Initial Constitution Ratification
stage: constitution
date: 2026-01-17
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: user
command: /sp.constitution
labels: [constitution, governance, principles]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - null
---

## Prompt

/sp.constitution

Project: Todo Full-Stack Web Application (Spec-Driven, Agentic Development)

Core principles:
- Spec-first development (all implementation derived strictly from specs)
- Correctness over speed (no assumptions outside the spec)
- Security-by-design (authentication and authorization enforced at every layer)
- Reproducibility (all steps, prompts, and decisions are traceable)
- Separation of concerns (frontend, backend, auth clearly bounded)

Key standards:
- No manual coding: all code generated via Claude Code from approved specs
- All API behavior must match the written specification exactly
- REST APIs must follow proper HTTP semantics and status codes
- All database queries must be user-scoped
- All backend routes must validate JWTs and enforce task ownership
- Authentication must be stateless using JWTs
- User data isolation must be enforced at the backend level
- Environment-based configuration (no secrets hardcoded)
- Database schema changes must be reflected in specs before implementation

Technology constraints:
- Frontend: Next.js 16+ using App Router
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth (JWT-based)
- Spec-driven workflow: Spec → Plan → Tasks → Implementation

Security standards:
- All API endpoints require valid JWT authentication
- Requests without valid tokens return 401 Unauthorized
- Users may only access and modify their own tasks
- JWT signature must be verified using shared secret
- Token expiry must be enforced
- No trust in client-provided user identifiers

Quality standards:
- Clear, deterministic API contracts
- Proper request/response validation
- Consistent error handling
- Readable, maintainable generated code
- Logging for authentication and critical operations

Constraints:
- Must implement all 5 basic task features
- Must support multi-user access
- Must persist data in Neon PostgreSQL
- Must be fully functional as a web application
- Must follow the Agentic Dev Stack workflow strictly

Succes

## Response snapshot

Updated the project constitution with core principles: Spec-First, Correctness, Security-By-Design, Reproducibility, and Separation of Concerns. Established technology stack constraints (Next.js, FastAPI, SQLModel, Neon, Better Auth) and security standards.

## Outcome

- ✅ Impact: Constitution ratified and updated.
- 🧪 Tests: N/A
- 📁 Files: Updated constitution.md
- 🔁 Next prompts: /sp.spec (to start verifying/creating spec)
- 🧠 Reflection: Successfully initialized project governance.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
