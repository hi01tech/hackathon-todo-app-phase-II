"""FastAPI application entry point for Task Management API."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .routers.tasks import router as tasks_router
from .routers.better_auth import router as better_auth_router
from .routers.auth import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler for startup/shutdown events."""
    # Startup: Initialize database tables
    try:
        await init_db()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Database init error (will retry on first request): {e}")
    yield
    # Shutdown: Cleanup (if needed)


app = FastAPI(
    title="Task Management API",
    description="RESTful API for managing user tasks with user-scoped data isolation.",
    version="1.0.0",
    lifespan=lifespan,
)


# Define the exact origin of your Next.js app


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for monitoring and load balancers."""
    print("DEBUG: Health check endpoint called!")
    return {"status": "healthy"}


@app.get("/api/test", tags=["Test"])
async def test_endpoint():
    """Simple test endpoint without auth."""
    print("DEBUG: Test endpoint called!")
    return {"message": "Backend is working!"}


# Include routers
app.include_router(tasks_router, prefix="/api", tags=["Tasks"])
app.include_router(better_auth_router, prefix="/api", tags=["Authentication"])
app.include_router(auth_router, prefix="/api", tags=["Authentication"])
