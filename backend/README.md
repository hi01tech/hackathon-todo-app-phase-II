# Task Management API Backend

RESTful API for managing user tasks with user-scoped data isolation using FastAPI, SQLModel, and Neon PostgreSQL.

## Features

- Full CRUD operations for tasks
- User-scoped data isolation (all queries filtered by user_id)
- UUID primary keys for security
- Async database operations
- Automatic timestamp management

## Prerequisites

- Python 3.11+
- Neon PostgreSQL database (or local PostgreSQL)

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Linux/Mac
source venv/bin/activate

# Windows
.\venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Neon connection string:
```env
DATABASE_URL=postgresql+asyncpg://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

### 4. Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/{user_id}/tasks` | List all tasks for user |
| POST | `/api/{user_id}/tasks` | Create new task |
| GET | `/api/{user_id}/tasks/{task_id}` | Get specific task |
| PUT | `/api/{user_id}/tasks/{task_id}` | Update task |
| DELETE | `/api/{user_id}/tasks/{task_id}` | Delete task |
| PATCH | `/api/{user_id}/tasks/{task_id}/complete` | Toggle completion |

## API Documentation

Once running:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Quick Test

```bash
# Health check
curl http://localhost:8000/health

# Create task
curl -X POST http://localhost:8000/api/user_123/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "My first task"}'

# List tasks
curl http://localhost:8000/api/user_123/tasks
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI app entry point
│   ├── config.py         # Environment configuration
│   ├── database.py       # Database connection
│   ├── models/
│   │   └── task.py       # Task model + schemas
│   └── routers/
│       └── tasks.py      # Task endpoints
├── tests/
│   └── conftest.py       # Test fixtures
├── requirements.txt
├── .env.example
└── README.md
```

## Running Tests

```bash
pip install pytest pytest-asyncio httpx aiosqlite
pytest -v
```

## Security Notes

- All queries are user-scoped via `user_id` path parameter
- Returns 404 (not 403) for user mismatch to prevent enumeration
- UUID primary keys prevent task ID guessing
- Authentication is deferred to a separate spec
