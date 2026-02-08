"""Task CRUD endpoints with user-scoped data isolation."""

import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Path, Body, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from ..database import get_session
from ..models.task import Task, TaskCreate, TaskUpdate, TaskRead
from ..auth.dependencies import get_current_user

router = APIRouter()  # Router prefix will be set in main.py if needed (not per user)


def validate_uuid(task_id: str) -> uuid.UUID:
    """Validate and convert task_id string to UUID.

    Args:
        task_id: String representation of UUID

    Returns:
        uuid.UUID: Parsed UUID object

    Raises:
        HTTPException: 422 if task_id is not a valid UUID
    """
    try:
        return uuid.UUID(task_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid task ID format: {task_id}"
        )


# T014: POST /api/tasks - Create a new task (JWT auth required)
@router.post(
    "/tasks",
    response_model=TaskRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new task",
    description="Creates a new task for the authenticated user."
)
async def create_task(
    task_data: TaskCreate = Body(...),
    session: AsyncSession = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
) -> TaskRead:
    """Create a new task for the authenticated user.

    Args:
        task_data: Task creation data from request body
        session: Database session (injected)
        current_user_id: User identifier from JWT (injected)

    Returns:
        TaskRead: Created task with generated ID and timestamps
    """
    task = Task(
        title=task_data.title,
        description=task_data.description,
        user_id=current_user_id,
    )

    session.add(task)
    await session.commit()
    await session.refresh(task)

    return TaskRead.model_validate(task)


# T015: GET /api/tasks - List all tasks for authenticated user
@router.get(
    "/tasks",
    response_model=List[TaskRead],
    summary="List all tasks for authenticated user",
    description="Returns all tasks belonging to the authenticated user."
)
async def list_tasks(
    session: AsyncSession = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
) -> List[TaskRead]:
    """List all tasks for the authenticated user.

    Args:
        session: Database session (injected)
        current_user_id: User identifier from JWT (injected)

    Returns:
        List[TaskRead]: All tasks belonging to the user
    """
    statement = select(Task).where(Task.user_id == current_user_id)
    result = await session.execute(statement)
    tasks = result.scalars().all()

    return [TaskRead.model_validate(task) for task in tasks]


# T016: GET /api/tasks/{task_id} - Get specific task
@router.get(
    "/tasks/{task_id}",
    response_model=TaskRead,
    summary="Get a specific task",
    description="Returns a single task if it belongs to the authenticated user."
)
async def get_task(
    task_id: str = Path(..., description="Task UUID"),
    session: AsyncSession = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
) -> TaskRead:
    """Get a specific task by ID, scoped to authenticated user.

    Args:
        task_id: Task UUID from URL path
        session: Database session (injected)
        current_user_id: User identifier from JWT (injected)

    Returns:
        TaskRead: Task details

    Raises:
        HTTPException: 404 if task not found OR user mismatch
        HTTPException: 422 if task_id is not a valid UUID
    """
    # T028: Validate UUID format
    parsed_id = validate_uuid(task_id)

    # T023: Compound lookup - user_id from JWT AND task_id
    statement = select(Task).where(
        Task.id == parsed_id,
        Task.user_id == current_user_id  # T027: Always include user_id filter from JWT
    )
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    # T027: Return 404 for both "not found" AND "wrong user"
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return TaskRead.model_validate(task)


# T017: PUT /api/tasks/{task_id} - Update task
@router.put(
    "/tasks/{task_id}",
    response_model=TaskRead,
    summary="Update a task",
    description="Updates a task if it belongs to the authenticated user."
)
async def update_task(
    task_id: str = Path(..., description="Task UUID"),
    task_data: TaskUpdate = Body(...),
    session: AsyncSession = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
) -> TaskRead:
    """Update an existing task, scoped to authenticated user.

    Args:
        task_id: Task UUID from URL path
        task_data: Update data from request body
        session: Database session (injected)
        current_user_id: User identifier from JWT (injected)

    Returns:
        TaskRead: Updated task

    Raises:
        HTTPException: 404 if task not found OR user mismatch
        HTTPException: 422 if task_id is invalid or empty body
    """
    # T028: Validate UUID format
    parsed_id = validate_uuid(task_id)

    # T024: Compound lookup - user_id from JWT AND task_id
    statement = select(Task).where(
        Task.id == parsed_id,
        Task.user_id == current_user_id
    )
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # T029: Handle empty body - at least one field must be provided
    update_data = task_data.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No fields to update"
        )

    # Apply updates
    for key, value in update_data.items():
        setattr(task, key, value)

    # T031: Update timestamp
    task.updated_at = datetime.utcnow()

    await session.commit()
    await session.refresh(task)

    return TaskRead.model_validate(task)


# T018: DELETE /api/tasks/{task_id} - Delete task
@router.delete(
    "/tasks/{task_id}",
    summary="Delete a task",
    description="Deletes a task if it belongs to the authenticated user."
)
async def delete_task(
    task_id: str = Path(..., description="Task UUID"),
    session: AsyncSession = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
) -> dict:
    """Delete a task, scoped to authenticated user.

    Args:
        task_id: Task UUID from URL path
        session: Database session (injected)
        current_user_id: User identifier from JWT (injected)

    Returns:
        dict: Success message

    Raises:
        HTTPException: 404 if task not found OR user mismatch
        HTTPException: 422 if task_id is not a valid UUID
    """
    # T028: Validate UUID format
    parsed_id = validate_uuid(task_id)

    # T025: Compound lookup - user_id from JWT AND task_id
    statement = select(Task).where(
        Task.id == parsed_id,
        Task.user_id == current_user_id
    )
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    await session.delete(task)
    await session.commit()

    return {"message": "Task deleted successfully"}


# T019: PATCH /api/tasks/{task_id}/complete - Toggle completion
@router.patch(
    "/tasks/{task_id}/complete",
    response_model=TaskRead,
    summary="Toggle task completion",
    description="Toggles the is_completed status of a task for the authenticated user."
)
async def toggle_task_complete(
    task_id: str = Path(..., description="Task UUID"),
    session: AsyncSession = Depends(get_session),
    current_user_id: str = Depends(get_current_user)
) -> TaskRead:
    """Toggle task completion status, scoped to authenticated user.

    Args:
        task_id: Task UUID from URL path
        session: Database session (injected)
        current_user_id: User identifier from JWT (injected)

    Returns:
        TaskRead: Task with toggled completion status

    Raises:
        HTTPException: 404 if task not found OR user mismatch
        HTTPException: 422 if task_id is not a valid UUID
    """
    # T028: Validate UUID format
    parsed_id = validate_uuid(task_id)

    # T026: Compound lookup - user_id from JWT AND task_id
    statement = select(Task).where(
        Task.id == parsed_id,
        Task.user_id == current_user_id
    )
    result = await session.execute(statement)
    task = result.scalar_one_or_none()

    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Toggle completion status
    task.is_completed = not task.is_completed

    # T031: Update timestamp
    task.updated_at = datetime.utcnow()

    await session.commit()
    await session.refresh(task)

    return TaskRead.model_validate(task)
