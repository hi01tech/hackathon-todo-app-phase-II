# Data Model: Authentication & Security Integration

**Feature**: 002-auth-jwt-integration
**Date**: 2026-01-25
**Status**: Complete

## Entities

### User (Managed by Better Auth)

Better Auth manages the User entity with its own database adapter. This entity is stored in the same Neon PostgreSQL database.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID/STRING | PK, NOT NULL | Unique user identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| `emailVerified` | BOOLEAN | DEFAULT FALSE | Email verification status |
| `name` | VARCHAR(255) | NULLABLE | Display name |
| `image` | TEXT | NULLABLE | Profile image URL |
| `createdAt` | TIMESTAMP | NOT NULL | Account creation time |
| `updatedAt` | TIMESTAMP | NOT NULL | Last update time |

### Account (Managed by Better Auth)

Links authentication providers to users.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID/STRING | PK | Account identifier |
| `userId` | UUID/STRING | FK → User.id | Owner reference |
| `type` | VARCHAR(50) | NOT NULL | Provider type |
| `provider` | VARCHAR(50) | NOT NULL | Provider name |
| `providerAccountId` | VARCHAR(255) | NOT NULL | External ID |
| `password` | TEXT | NULLABLE | Hashed password (credential auth) |

### Session (Managed by Better Auth)

Server-side session tracking (optional with JWT).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID/STRING | PK | Session identifier |
| `userId` | UUID/STRING | FK → User.id | Owner reference |
| `token` | TEXT | NOT NULL | Session token |
| `expiresAt` | TIMESTAMP | NOT NULL | Expiration time |

---

## JWT Token Structure

### Payload (Claims)

| Claim | Type | Required | Description |
|-------|------|----------|-------------|
| `sub` | STRING | YES | Subject - User ID |
| `email` | STRING | YES | User email |
| `name` | STRING | NO | User display name |
| `iat` | NUMBER | YES | Issued At timestamp |
| `exp` | NUMBER | YES | Expiration timestamp |
| `iss` | STRING | NO | Issuer identifier |

### Example JWT Payload

```json
{
  "sub": "clx1abc123def456",
  "email": "user@example.com",
  "name": "John Doe",
  "iat": 1706140800,
  "exp": 1706227200,
  "iss": "todo-app"
}
```

### Token Lifecycle

```
┌─────────────┐     Sign In      ┌─────────────┐
│  No Token   │ ─────────────────▶│   Valid     │
│  (Guest)    │                   │   Token     │
└─────────────┘                   └──────┬──────┘
       ▲                                 │
       │                          24 hours pass
       │                                 │
       │         Sign Out                ▼
       │◀────────────────────────┌─────────────┐
       │                         │   Expired   │
       └─────────────────────────│   Token     │
                                 └─────────────┘
```

---

## Task Entity Update (from Spec 1)

The Task entity remains unchanged, but how `user_id` is assigned changes:

### Before (Spec 1)
- `user_id` from URL path parameter
- Trusted as-is (no authentication)

### After (Spec 2)
- `user_id` extracted from JWT `sub` claim
- Never from URL or request body
- Enforced by auth dependency

### Task-User Relationship

```
┌─────────────┐         ┌─────────────┐
│    User     │ 1     * │    Task     │
│  (id: UUID) │─────────│  (user_id)  │
└─────────────┘         └─────────────┘

User.id = Task.user_id (enforced via JWT)
```

---

## Validation Rules

| Rule | Entity | Validation | Error |
|------|--------|------------|-------|
| VR-001 | User.email | Valid email format | 422 |
| VR-002 | User.email | Unique in database | 409/422 |
| VR-003 | Account.password | Minimum 8 characters | 422 |
| VR-004 | JWT | Valid signature | 401 |
| VR-005 | JWT | Not expired | 401 |
| VR-006 | JWT | Contains `sub` claim | 401 |

---

## Database Schema (Better Auth Tables)

Better Auth auto-creates these tables. For Neon PostgreSQL:

```sql
-- Users table
CREATE TABLE "user" (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    "emailVerified" BOOLEAN DEFAULT FALSE,
    name TEXT,
    image TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Accounts table (for credentials)
CREATE TABLE account (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    password TEXT,
    UNIQUE(provider, "providerAccountId")
);

-- Sessions table (optional with JWT)
CREATE TABLE session (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    "expiresAt" TIMESTAMP NOT NULL
);

-- Index for user lookup
CREATE INDEX idx_user_email ON "user"(email);
```

**Note**: Better Auth's database adapter handles schema creation automatically. Manual SQL is for reference only.
