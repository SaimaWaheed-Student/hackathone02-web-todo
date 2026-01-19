# Data Model: Full-Stack Todo Web Application

**Feature Branch**: `001-fullstack-todo-app`
**Date**: 2026-01-13
**Status**: Complete

## Entity Relationship Diagram

```
┌─────────────────────────────────────┐
│               User                   │
├─────────────────────────────────────┤
│ id: int (PK)                        │
│ email: str (unique, not null)       │
│ hashed_password: str (not null)     │
│ created_at: datetime (not null)     │
└──────────────────┬──────────────────┘
                   │
                   │ 1:N
                   │
┌──────────────────▼──────────────────┐
│               Task                   │
├─────────────────────────────────────┤
│ id: int (PK)                        │
│ user_id: int (FK → User.id)         │
│ title: str (max 255, not null)      │
│ description: str (nullable)         │
│ completed: bool (default: false)    │
│ created_at: datetime (not null)     │
│ updated_at: datetime (not null)     │
└─────────────────────────────────────┘
```

## Entities

### User

Represents a registered account holder in the system.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Integer | Primary Key, Auto-increment | Unique user identifier |
| email | String(255) | Unique, Not Null, Indexed | User's email address for authentication |
| hashed_password | String(255) | Not Null | bcrypt-hashed password (never plaintext) |
| created_at | DateTime | Not Null, Default: now() | Account creation timestamp |

**Validation Rules**:
- Email must be valid email format
- Email must be unique across all users
- Password minimum 8 characters (validated before hashing)

**SQLModel Definition**:
```python
class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    tasks: list["Task"] = Relationship(back_populates="user")
```

---

### Task

Represents a todo item owned by a specific user.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Integer | Primary Key, Auto-increment | Unique task identifier |
| user_id | Integer | Foreign Key → User.id, Not Null, Indexed | Owner reference |
| title | String(255) | Not Null | Task title (required) |
| description | Text | Nullable | Optional task details |
| completed | Boolean | Not Null, Default: false | Completion status |
| created_at | DateTime | Not Null, Default: now() | Task creation timestamp |
| updated_at | DateTime | Not Null, Default: now(), On Update: now() | Last modification timestamp |

**Validation Rules**:
- Title required, max 255 characters
- Description optional, no length limit
- user_id must reference valid User
- completed must be boolean

**SQLModel Definition**:
```python
class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    title: str = Field(max_length=255)
    description: str | None = Field(default=None)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    user: User = Relationship(back_populates="tasks")
```

---

## State Transitions

### Task.completed

```
┌──────────┐                      ┌───────────┐
│  false   │ ─── Mark Complete ──▶│   true    │
│ (pending)│                      │(completed)│
└──────────┘ ◀── Mark Incomplete ─┘───────────┘
```

- Initial state: `false` (pending)
- User can toggle between `true` and `false`
- No other states exist

---

## Indexes

| Table | Index Name | Columns | Type | Purpose |
|-------|------------|---------|------|---------|
| User | user_email_idx | email | Unique | Fast email lookup for auth |
| Task | task_user_id_idx | user_id | Non-unique | Fast task retrieval by user |

---

## Referential Integrity

| Constraint | Parent | Child | Action |
|------------|--------|-------|--------|
| task_user_fk | User.id | Task.user_id | CASCADE DELETE |

**Note**: When a User is deleted, all their Tasks are automatically deleted (cascade). This ensures no orphan tasks exist in the database.

---

## Request/Response Schemas

### User Schemas

```python
# Registration request
class UserCreate(SQLModel):
    email: EmailStr
    password: str = Field(min_length=8)

# Login request
class UserLogin(SQLModel):
    email: EmailStr
    password: str

# User response (no password)
class UserResponse(SQLModel):
    id: int
    email: str
    created_at: datetime

# Login response
class TokenResponse(SQLModel):
    access_token: str
    token_type: str = "bearer"
```

### Task Schemas

```python
# Create task request
class TaskCreate(SQLModel):
    title: str = Field(max_length=255, min_length=1)
    description: str | None = None

# Update task request
class TaskUpdate(SQLModel):
    title: str | None = Field(default=None, max_length=255, min_length=1)
    description: str | None = None

# Task response
class TaskResponse(SQLModel):
    id: int
    user_id: int
    title: str
    description: str | None
    completed: bool
    created_at: datetime
    updated_at: datetime

# Task list response
class TaskListResponse(SQLModel):
    tasks: list[TaskResponse]
    count: int
```

---

## Database Migrations

For hackathon scope, tables will be created on application startup using SQLModel's `create_all()`. Production would use Alembic for migrations.

```python
# In database.py
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
```
