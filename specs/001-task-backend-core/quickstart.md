# Quickstart: Core Task Management Backend

**Feature**: 001-task-backend-core
**Date**: 2026-01-24

## Prerequisites

- Python 3.11+
- Neon PostgreSQL database (or local PostgreSQL)
- pip or uv for package management

## Setup

### 1. Clone and Navigate

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# OR
.\venv\Scripts\activate   # Windows
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

Copy the example environment file and update with your Neon connection string:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql+asyncpg://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

### 5. Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Verify Installation

### Health Check

```bash
curl http://localhost:8000/health
# Expected: {"status": "healthy"}
```

### Create a Task

```bash
curl -X POST http://localhost:8000/api/user_123/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "My first task", "description": "Testing the API"}'
```

### List Tasks

```bash
curl http://localhost:8000/api/user_123/tasks
```

## API Documentation

Once running, access the interactive API docs:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Running Tests

```bash
# Install test dependencies (if not already)
pip install pytest pytest-asyncio httpx

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_tasks.py
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
│   ├── conftest.py       # Test fixtures
│   ├── test_tasks.py     # Endpoint tests
│   └── test_models.py    # Model tests
├── requirements.txt
├── .env.example
└── README.md
```

## Common Issues

### Connection Refused

Ensure your Neon database is accessible and the connection string is correct. Neon requires SSL (`sslmode=require`).

### ModuleNotFoundError

Ensure you've activated the virtual environment and installed dependencies.

### Port Already in Use

Change the port: `uvicorn app.main:app --port 8001`

## Next Steps

After verifying the backend works:

1. Run `/sp.tasks` to generate implementation tasks
2. Implement each task following TDD (Red → Green → Refactor)
3. Run tests after each task completion
