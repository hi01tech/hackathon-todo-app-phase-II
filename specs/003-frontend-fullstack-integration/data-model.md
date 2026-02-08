# Data Model: Frontend Application & Full-Stack Integration

**Feature**: Frontend Application & Full-Stack Integration
**Date**: 2026-02-01

## Entity Definitions

### User Entity
Represents an authenticated user in the system with associated account information.

**Fields:**
- `id` (string): Unique identifier for the user
- `email` (string): User's email address, used for authentication
- `createdAt` (Date): Timestamp when the account was created
- `updatedAt` (Date): Timestamp when the account was last updated

**Validation Rules:**
- Email must be a valid email format
- Email must be unique across all users
- ID must be non-empty and unique

**Relationships:**
- One-to-many relationship with Task entities (one user can have many tasks)

### Task Entity
Represents a task owned by a specific user, containing information about the task and its completion status.

**Fields:**
- `id` (string): Unique identifier for the task
- `userId` (string): Foreign key referencing the owning user
- `title` (string): Title or brief description of the task
- `description` (string, optional): Detailed description of the task
- `completed` (boolean): Flag indicating whether the task is completed
- `createdAt` (Date): Timestamp when the task was created
- `updatedAt` (Date): Timestamp when the task was last updated

**Validation Rules:**
- Title must be non-empty
- UserId must reference an existing user
- Completed defaults to false
- Description is optional with maximum length of 1000 characters

**State Transitions:**
- New task: `completed = false`
- Task completion: `completed = true`
- Task reopening: `completed = false`

**Relationships:**
- Many-to-one relationship with User entity (many tasks belong to one user)

## API Contract Models

### AuthResponse Model
Model for authentication API responses.

**Fields:**
- `user` (User): The authenticated user object
- `token` (string): JWT token for subsequent API requests

### TaskListResponse Model
Model for task list API responses.

**Fields:**
- `tasks` (Task[]): Array of tasks belonging to the authenticated user

### ErrorResponse Model
Model for API error responses.

**Fields:**
- `error` (string): Error message for the client
- `details` (object, optional): Additional error details for debugging

## Frontend State Models

### TaskFormData Model
Model for task form input data.

**Fields:**
- `title` (string): Task title input
- `description` (string, optional): Task description input

**Validation:**
- Title must be 1-100 characters
- Description must be 0-1000 characters if provided

### AuthFormData Model
Model for authentication form input data.

**Fields:**
- `email` (string): User email input
- `password` (string): User password input

**Validation:**
- Email must be valid email format
- Password must be 8+ characters with complexity requirements