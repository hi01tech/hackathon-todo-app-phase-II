# Todo App - Quick Start Guide

This guide will help you run the full-stack Todo application locally.

## Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Access to Neon PostgreSQL database (already configured)

## Setup & Run

### 1. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Environment is already configured in .env
# Database: Neon PostgreSQL
# JWT Secret: Configured

# Run the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### 2. Frontend Setup (Next.js)

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Dependencies are already installed
# If needed: npm install

# Environment is configured in .env.local

# Run the frontend development server
npm run dev
```

The frontend will be available at: `http://localhost:3000`

## Testing the Application

### 1. Test Authentication

1. Open your browser to `http://localhost:3000`
2. Click "Sign Up" to create a new account
3. Enter email and password (min 6 characters)
4. You should be redirected to the dashboard

### 2. Test Task Management

**Create a Task:**
1. Click "Add Task" button
2. Enter title and description
3. Click "Create Task"

**Update a Task:**
1. Click the edit icon on any task card
2. Modify the title/description
3. Click "Update Task"

**Toggle Task Completion:**
1. Click the checkbox on any task card
2. Task should toggle between completed/incomplete

**Delete a Task:**
1. Click the delete icon on any task card
2. Confirm deletion
3. Task should be removed

### 3. Test User Isolation

1. Create tasks with one user account
2. Sign out (reload page and clear localStorage)
3. Create a new account with different email
4. Verify you don't see the first user's tasks

## API Endpoints

### Authentication
- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - Login user
- `GET /api/auth/me` - Get current user info

### Tasks
- `GET /api/tasks` - Get all tasks for current user
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/complete` - Toggle task completion

## Troubleshooting

### Port Already in Use

**Frontend (Port 3000):**
```bash
# Kill Node.js processes (Windows)
taskkill /F /IM node.exe

# Then restart
npm run dev
```

**Backend (Port 8000):**
```bash
# Find process using port
netstat -ano | findstr :8000

# Kill process by PID
taskkill /F /PID <PID>
```

### Module Not Found Errors

If you see import errors in the frontend:
- Verify `tsconfig.json` has `"@/*": ["./*"]` in paths
- Restart the dev server with `Ctrl+C` and `npm run dev`

### Database Connection Issues

- Verify `DATABASE_URL` in `backend/.env` is correct
- Check Neon dashboard for database status
- Ensure SSL mode is enabled in connection string

### CORS Issues

If API calls fail with CORS errors:
- Verify backend CORS is configured for `http://localhost:3000`
- Check `backend/app/main.py` CORS middleware settings

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌────────────┐
│   Browser   │ ──────> │   Next.js    │ ──────> │  FastAPI   │
│ (localhost: │  HTTP   │  Frontend    │   API   │  Backend   │
│    3000)    │ <────── │              │ <────── │            │
└─────────────┘         └──────────────┘         └────────────┘
                              │                         │
                              │                         │
                              ▼                         ▼
                        localStorage              Neon PostgreSQL
                         (JWT Token)              (Tasks & Users)
```

## Environment Variables

### Backend (backend/.env)
- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing
- `JWT_ALGORITHM` - HS256
- `JWT_EXPIRY_HOURS` - 24

### Frontend (frontend/.env.local)
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (http://localhost:8000/api)
- `BETTER_AUTH_SECRET` - Must match backend JWT_SECRET
- `DATABASE_URL` - Neon PostgreSQL connection string

## Tech Stack

- **Frontend**: Next.js 16+ (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Python FastAPI, SQLModel (ORM)
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT tokens, Better Auth compatible
- **Testing**: Jest (Frontend), Pytest (Backend)

## Next Steps

- Run backend tests: `cd backend && pytest`
- Run frontend tests: `cd frontend && npm test`
- View API documentation: `http://localhost:8000/docs`
- Create a production build: `cd frontend && npm run build`

## Support

For issues or questions, check:
- Backend API docs: http://localhost:8000/docs
- Frontend console for errors (F12 in browser)
- Backend logs in terminal
- specs/ directory for detailed specifications
