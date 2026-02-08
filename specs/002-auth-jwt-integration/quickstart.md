# Quickstart: Authentication & Security Integration

**Feature**: 002-auth-jwt-integration
**Date**: 2026-01-25

## Prerequisites

- Node.js 18+ (for Next.js frontend)
- Python 3.11+ (for FastAPI backend)
- Neon PostgreSQL database (from Spec 1)
- Backend from Spec 1 running

## Environment Setup

### Shared Secret

Generate a secure JWT secret (use the same value for both frontend and backend):

```bash
# Generate a 256-bit secret
openssl rand -base64 32
# Example output: K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=
```

### Frontend Environment (.env.local)

```env
# Better Auth
BETTER_AUTH_SECRET=your_generated_secret_here
BETTER_AUTH_URL=http://localhost:3000

# Database (Better Auth needs this for user storage)
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend Environment (.env)

```env
# Existing from Spec 1
DATABASE_URL=postgresql://...

# New for Spec 2
JWT_SECRET=your_generated_secret_here  # Same as BETTER_AUTH_SECRET
JWT_ALGORITHM=HS256
JWT_EXPIRY_HOURS=24
```

## Setup Steps

### 1. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install better-auth @better-auth/jwt

# Copy environment file
cp .env.local.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

### 2. Backend Setup

```bash
cd backend

# Install new dependencies
pip install pyjwt

# Update .env with JWT_SECRET

# Run server (existing from Spec 1)
uvicorn app.main:app --reload
```

## Verification Tests

### Test 1: User Registration

1. Open http://localhost:3000/sign-up
2. Enter email and password (min 8 characters)
3. Submit form
4. **Expected**: Account created, redirected to sign-in or dashboard

### Test 2: User Sign In

1. Open http://localhost:3000/sign-in
2. Enter registered credentials
3. Submit form
4. **Expected**: JWT issued, redirected to dashboard

### Test 3: Protected API Access

```bash
# Without token (should fail)
curl http://localhost:8000/api/tasks
# Expected: 401 {"detail": "Not authenticated"}

# With valid token (from browser dev tools)
curl http://localhost:8000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
# Expected: 200 with task list
```

### Test 4: Task Ownership

1. Sign in as User A
2. Create a task
3. Sign out, sign in as User B
4. Try to access User A's task by ID
5. **Expected**: 404 Not Found (not 403)

### Test 5: Token Expiry

1. Sign in and note the token
2. Wait 24 hours (or manually expire in dev)
3. Make API request with expired token
4. **Expected**: 401 with "Token expired"

## Common Issues

### "Not authenticated" on all requests

- Check that JWT_SECRET matches between frontend and backend
- Verify Authorization header is being sent (check browser dev tools)
- Ensure CORS allows Authorization header

### "Invalid token" error

- JWT secrets don't match
- Token was tampered with
- Wrong algorithm (must be HS256)

### User data not persisting

- Check DATABASE_URL in frontend .env.local
- Better Auth needs database access for user storage
- Run Better Auth migrations if needed

## Architecture Summary

```
Browser                    Frontend (Next.js)              Backend (FastAPI)
   │                            │                              │
   │  1. Sign Up/Sign In        │                              │
   │ ─────────────────────────▶ │                              │
   │                            │  2. Better Auth              │
   │                            │     validates & stores user  │
   │                            │     issues JWT               │
   │  3. JWT in cookie          │                              │
   │ ◀───────────────────────── │                              │
   │                            │                              │
   │  4. API Request            │                              │
   │ ─────────────────────────▶ │                              │
   │                            │  5. Extract JWT,             │
   │                            │     add to Auth header       │
   │                            │ ────────────────────────────▶│
   │                            │                              │ 6. Verify JWT
   │                            │                              │    Extract user_id
   │                            │                              │    Filter tasks
   │                            │  7. Response                 │
   │  8. Display tasks          │ ◀────────────────────────────│
   │ ◀───────────────────────── │                              │
```

## Next Steps

1. Run `/sp.tasks` to generate implementation tasks
2. Implement backend auth module first
3. Implement frontend auth pages
4. Integrate and test end-to-end
