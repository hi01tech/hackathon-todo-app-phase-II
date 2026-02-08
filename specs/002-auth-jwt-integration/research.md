# Research: Authentication & Security Integration

**Feature**: 002-auth-jwt-integration
**Date**: 2026-01-25
**Status**: Complete

## Research Questions

### RQ-1: Better Auth JWT Configuration

**Decision**: Use Better Auth with JWT plugin, HS256 algorithm, and shared secret.

**Rationale**:
- Better Auth is the constitution-mandated auth library
- JWT plugin provides stateless tokens suitable for cross-service verification
- HS256 (HMAC-SHA256) allows shared secret between Next.js and FastAPI
- Simpler than RS256 (no key pair management needed)

**Alternatives Considered**:
- RS256 (asymmetric): Rejected - requires public/private key management, overkill for single backend
- Session-based auth: Rejected - requires server-side session storage, not stateless

**Configuration Pattern**:
```typescript
// Better Auth server config
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [jwt()],
  jwt: {
    expiresIn: "24h",
  },
  // ... database adapter
});
```

---

### RQ-2: Token Storage Strategy

**Decision**: Store JWT in httpOnly cookie for security, extract and send via Authorization header for API calls.

**Rationale**:
- httpOnly cookies are inaccessible to JavaScript (XSS protection)
- Better Auth handles cookie management automatically
- API calls extract token from cookie and add to Authorization header
- Backend expects standard Bearer token format

**Alternatives Considered**:
- localStorage: Rejected - vulnerable to XSS attacks
- sessionStorage: Rejected - vulnerable to XSS, clears on tab close
- Memory only: Rejected - lost on page refresh

**Pattern**:
```typescript
// API client extracts token from Better Auth session
const session = await auth.getSession();
const token = session?.accessToken;
fetch(apiUrl, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

### RQ-3: PyJWT Backend Verification

**Decision**: Use PyJWT library with FastAPI dependency injection for token verification.

**Rationale**:
- PyJWT is the standard Python JWT library
- Supports HS256 algorithm matching Better Auth
- FastAPI Depends() pattern provides clean separation
- Can be added as middleware or per-route dependency

**Alternatives Considered**:
- python-jose: Similar capability, PyJWT more widely used
- Custom implementation: Rejected - security risk, reinventing wheel
- authlib: More complex, designed for OAuth flows

**Pattern**:
```python
import jwt
from fastapi import Depends, HTTPException

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        return payload["sub"]  # user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
```

---

### RQ-4: JWT Payload Structure

**Decision**: Minimal payload with `sub` (user_id), `email`, `iat`, `exp`.

**Rationale**:
- `sub` (subject): Standard JWT claim for user identifier
- `email`: Useful for display, debugging
- `iat` (issued at): Standard claim for token age
- `exp` (expiration): Required for token expiry (FR-009)
- Keep payload small for performance

**Payload Structure**:
```json
{
  "sub": "user_uuid_here",
  "email": "user@example.com",
  "iat": 1706140800,
  "exp": 1706227200
}
```

---

### RQ-5: API Route Changes

**Decision**: Remove `{user_id}` from URL paths; use JWT payload identity exclusively.

**Rationale**:
- FR-018: Backend MUST NOT rely on user_id from URL path
- Prevents user spoofing by changing URL
- Cleaner API design
- Single source of truth for user identity

**URL Changes**:
| Old (Spec 1) | New (Spec 2) |
|--------------|--------------|
| `/api/{user_id}/tasks` | `/api/tasks` |
| `/api/{user_id}/tasks/{id}` | `/api/tasks/{id}` |

---

### RQ-6: Error Response Strategy

**Decision**: Return 401 for auth failures, 404 for ownership failures (never 403).

**Rationale**:
- 401 Unauthorized: Clear signal for missing/invalid/expired token
- 404 Not Found: Prevents information leakage about task existence
- FR-019: Return 404 (not 403) for ownership failures
- Consistent with Spec 1 behavior

**Error Responses**:
```json
// 401 - Authentication failure
{"detail": "Not authenticated"}
{"detail": "Token expired"}
{"detail": "Invalid token"}

// 404 - Task not found or wrong owner
{"detail": "Task not found"}
```

---

### RQ-7: Next.js Middleware for Route Protection

**Decision**: Use Next.js middleware.ts with Better Auth session check.

**Rationale**:
- Runs on edge before page renders
- Can redirect unauthenticated users to sign-in
- Protects entire route groups (e.g., `/dashboard/*`)
- Better UX than client-side redirects

**Pattern**:
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  return NextResponse.next();
}
```

---

## Dependencies Confirmed

| Package | Version | Purpose |
|---------|---------|---------|
| better-auth | latest | Frontend authentication |
| @better-auth/jwt | latest | JWT plugin for Better Auth |
| pyjwt | >=2.8.0 | Backend JWT verification |
| python-dotenv | >=1.0.0 | Environment variable loading |

---

## Risks Identified

1. **Secret Synchronization**: Frontend and backend must share exact same JWT_SECRET. Mitigation: Single source in deployment config.
2. **Token Expiry During Session**: User may lose unsaved work. Mitigation: Clear UX messaging, auto-save.
3. **Clock Skew**: Server time differences can cause false expiry. Mitigation: Use same time source, add small leeway.
