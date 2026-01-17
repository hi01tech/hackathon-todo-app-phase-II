<!--
SYNC IMPACT REPORT
Version change: 0.0.0 -> 1.0.0
- Initial Constitution Ratification
- Added Principles: Spec-First, Correctness, Security-By-Design, Reproducibility, Separation of Concerns
- Added Sections: Technology & Architecture Constraints, Security & Quality Standards
- Templates requiring updates: ✅ None (Alignment verified)
-->

# Todo Full-Stack Web Application (Spec-Driven, Agentic Development) Constitution

## Core Principles

### I. Spec-First Development (NON-NEGOTIABLE)
All implementation must be derived strictly from specs. No manual coding is permitted; all code must be generated via Claude Code from approved specs. If a requirement is not in the spec, it does not exist. Database schema changes must be reflected in specs before implementation.

### II. Correctness Over Speed
No assumptions outside the spec are allowed. It is better to stop and ask for clarification than to guess. All API behavior must match the written specification exactly.

### III. Security-By-Design
Authentication and authorization are enforced at every layer. All API endpoints require valid JWT authentication. Requests without valid tokens must return 401 Unauthorized. Users may only access and modify their own tasks. No trust in client-provided user identifiers.

### IV. Reproducibility
All steps, prompts, and decisions must be traceable. The workflow of Spec → Plan → Tasks → Implementation must be followed strictly.

### V. Separation of Concerns
Frontend, backend, and auth boundaries must be clearly defined. Authentication must be stateless using JWTs. User data isolation must be enforced at the backend level.

## Technology & Architecture Constraints

### Stack Requirements
- **Frontend**: Next.js 16+ using App Router
- **Backend**: Python FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth (JWT-based)

### Workflow Constraints
- Must follow the Agentic Dev Stack workflow: Spec → Plan → Tasks → Implementation.
- REST APIs must follow proper HTTP semantics and status codes.
- Environment-based configuration (no secrets hardcoded).

## Security & Quality Standards

### Security Standards
- JWT signature must be verified using shared secret.
- Token expiry must be enforced.
- All database queries must be user-scoped (row-level security logic in application).

### Quality Standards
- Clear, deterministic API contracts.
- Proper request/response validation.
- Consistent error handling.
- Readable, maintainable generated code.
- Logging for authentication and critical operations.

## Governance

This constitution supersedes all other technical practices.
- Amendments require documentation and approval.
- All PRs and reviews must verify compliance with these principles.
- Complexity must be justified against the "Correctness Over Speed" and "Separation of Concerns" principles.

**Version**: 1.0.0 | **Ratified**: 2026-01-17 | **Last Amended**: 2026-01-17
