---
name: auth-skill
description: Implement secure multi-user authentication for full-stack apps using Better Auth, password hashing, and JWT-based authorization.
---

# Authentication Skill

## Instructions

### 1. User signup
- Implement user account creation
- Support email + password registration
- Validate input and prevent duplicate accounts
- Securely handle password hashing during signup

### 2. User sign in
- Implement user login with email + password
- Verify credentials securely
- Handle invalid credentials and locked accounts
- Trigger JWT issuance on successful sign in

### 3. User authentication flows
- Maintain authenticated user sessions
- Handle logout and session expiration
- Ensure multi-user isolation

### 4. Password security
- Hash passwords using secure algorithms (bcrypt / argon2)
- Never store or transmit plaintext passwords
- Enforce password strength validation
- Use environment-based secrets

### 5. JWT-based authorization
- Issue JWT tokens on successful sign in
- Configure token expiry (e.g. 7 days)
- Include user ID and email in token claims
- Attach JWT to requests via `Authorization: Bearer <token>`

### 6. Better Auth integration
- Configure Better Auth on Next.js frontend
- Enable JWT plugin for token issuance
- Share JWT secret between frontend and backend
- Use Better Auth as the source of truth for user identity

### 7. Backend verification (FastAPI)
- Extract JWT from request headers
- Verify token signature and expiration
- Decode user identity from token
- Enforce task ownership on every request

## Best Practices
- Use HTTPS in all environments
- Store secrets in environment variables only
- Reject requests without valid JWT (401 Unauthorized)
- Do not trust user IDs from request body or params alone
- Keep auth logic centralized and reusable
- Prefer stateless authentication for scalability

## Example Auth Flow
1. User signs up via frontend
2. User signs in via frontend
3. Better Auth creates session and issues JWT
4. Frontend stores token securely
5. Frontend sends token with every API request
6. Backend verifies token and extracts user ID
7. Backend filters data by authenticated user

## Example Structure
```ts
// Frontend (Next.js + Better Auth)
- Configure Better Auth with JWT plugin
- Implement signup and sign in UI
- Retrieve session token
- Attach token to API client headers

// Backend (FastAPI)
- JWT verification dependency or middleware
- Decode user from token
- Protect all /api/* routes
