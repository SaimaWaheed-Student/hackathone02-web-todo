# Implementation Plan: Full-Stack Todo Web Application (Phase II - Homepage First UX)

**Branch**: `001-fullstack-todo-app` | **Date**: 2026-01-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification v2.0.0 from `/specs/001-fullstack-todo-app/spec.md`
**Phase**: II - Homepage First UX

## Summary

Build a secure multi-user todo web application with **Homepage First UX** pattern. The application opens on a public homepage displaying five feature buttons (Add Task, View Tasks, Edit Task, Delete Task, Complete Task). Authentication is triggered contextually when unauthenticated users click feature buttons, with automatic return to intended action after signin. The system comprises a Python FastAPI backend with SQLModel ORM connected to Neon Serverless PostgreSQL, and a Next.js 16+ frontend with App Router implementing auth-gated navigation.

## Technical Context

**Language/Version**: Python 3.11+ (backend), TypeScript/JavaScript (frontend)
**Primary Dependencies**: FastAPI, SQLModel, python-jose, passlib[bcrypt], Next.js 16+
**Storage**: Neon Serverless PostgreSQL
**Testing**: pytest (backend), Jest/React Testing Library (frontend)
**Target Platform**: Web (Linux server for backend, CDN/Edge for frontend)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: <2s homepage load, <5s page load, <2s API response, <500ms validation feedback
**Constraints**: Stateless JWT auth, no third-party auth services, user data isolation, homepage-first UX
**Scale/Scope**: Multi-user hackathon demo, 10 user stories, 33 functional requirements

## Constitution Check

*GATE: Must pass before Phase 1 research. Re-check after Phase 2 design.*

| Principle | Requirement | Status |
|-----------|-------------|--------|
| I. Accuracy | All behaviors align with spec v2.0.0 | ✅ PASS - Homepage First UX fully specified |
| II. Consistency | Stable contracts across layers | ✅ PASS - contracts/ defines shared schemas |
| III. Security | Auth on every protected request | ✅ PASS - JWT middleware + public homepage route |
| IV. User Isolation | DB-level ownership enforcement | ✅ PASS - user_id extracted from JWT, query scoped |
| V. Reproducibility | Agentic workflow compliance | ✅ PASS - spec → plan → tasks flow |
| VI. Simplicity | Minimal viable design | ✅ PASS - returnUrl query param, no complex state |

**Gate Result**: PASS - All constitution principles satisfied

---

## Implementation Phases

### Phase 1 — UX & Routing Design

**Objective**: Define public vs protected routes and design the homepage-first navigation flow.

#### 1.1 Route Classification

| Route | Type | Auth Required | Description |
|-------|------|---------------|-------------|
| `/` | Public | No | Homepage with feature buttons |
| `/signin` | Public | No | User login page |
| `/signup` | Public | No | User registration page |
| `/tasks` | Protected | Yes | View all user's tasks |
| `/tasks/new` | Protected | Yes | Create new task |
| `/tasks/[id]` | Protected | Yes | View/Edit single task |
| `/tasks/[id]/edit` | Protected | Yes | Edit task form |
| `/tasks/[id]/delete` | Protected | Yes | Delete confirmation |

#### 1.2 Homepage Button Mapping

| Button | Target Route | Unauthenticated Behavior |
|--------|--------------|-------------------------|
| Add Task | `/tasks/new` | Redirect to `/signin?returnUrl=/tasks/new` |
| View Tasks | `/tasks` | Redirect to `/signin?returnUrl=/tasks` |
| Edit Task | `/tasks` | Redirect to `/signin?returnUrl=/tasks` (select task first) |
| Delete Task | `/tasks` | Redirect to `/signin?returnUrl=/tasks` (select task first) |
| Complete Task | `/tasks` | Redirect to `/signin?returnUrl=/tasks` (toggle on list) |

#### 1.3 Auth-Gated Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         HOMEPAGE (/)                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │Add Task │ │View Task│ │Edit Task│ │Delete   │ │Complete │   │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘   │
│       │           │           │           │           │         │
│       └───────────┴───────────┴───────────┴───────────┘         │
│                               │                                  │
│                    ┌──────────┴──────────┐                      │
│                    │  Check Auth State   │                      │
│                    └──────────┬──────────┘                      │
│                    ┌──────────┴──────────┐                      │
│              ┌─────┴─────┐         ┌─────┴─────┐                │
│              │Authenticated│       │Not Auth'd │                │
│              └─────┬─────┘         └─────┬─────┘                │
│                    │                     │                       │
│              ┌─────┴─────┐         ┌─────┴─────┐                │
│              │Navigate to│         │Redirect to│                │
│              │  Target   │         │/signin?   │                │
│              │  Route    │         │returnUrl= │                │
│              └───────────┘         └─────┬─────┘                │
└──────────────────────────────────────────┼──────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    │              SIGNIN PAGE                     │
                    │  ┌────────────────────────────────────────┐ │
                    │  │         Email: [___________]           │ │
                    │  │         Password: [___________]        │ │
                    │  │         [Sign In]  [Sign Up →]         │ │
                    │  └────────────────────────────────────────┘ │
                    │                      │                       │
                    │           ┌──────────┴──────────┐           │
                    │           │  On Success: Read   │           │
                    │           │  returnUrl param    │           │
                    │           └──────────┬──────────┘           │
                    │                      │                       │
                    │           ┌──────────┴──────────┐           │
                    │           │  Navigate to        │           │
                    │           │  returnUrl || '/'   │           │
                    │           └─────────────────────┘           │
                    └─────────────────────────────────────────────┘
```

#### 1.4 Frontend Auth State Management

```typescript
// lib/auth.ts - Auth state detection
interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; email: string } | null;
  token: string | null;
}

// Token storage: localStorage for persistence
// Auth check: Validate JWT expiry client-side
// Protected route: Redirect with returnUrl on auth failure
```

---

### Phase 2 — Backend Foundation

**Objective**: Initialize FastAPI project with database models and Neon PostgreSQL connection.

#### 2.1 Project Initialization

```bash
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app with CORS
│   ├── config.py            # Settings from environment
│   └── database.py          # Neon PostgreSQL engine
├── requirements.txt
└── .env.example
```

#### 2.2 Database Models

**User Model** (`app/models/user.py`):
```python
class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    tasks: list["Task"] = Relationship(back_populates="user")
```

**Task Model** (`app/models/task.py`):
```python
class Task(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", index=True)
    title: str = Field(max_length=255)
    description: str | None = None
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user: User = Relationship(back_populates="tasks")
```

#### 2.3 Database Connection

```python
# app/database.py
from sqlmodel import create_engine, Session
from app.config import settings

# Neon PostgreSQL connection string from environment
engine = create_engine(settings.DATABASE_URL, echo=settings.DEBUG)

def get_session():
    with Session(engine) as session:
        yield session
```

#### 2.4 Environment Configuration

```bash
# .env.example
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET_KEY=your-secret-key-min-32-chars
JWT_ALGORITHM=HS256
JWT_EXPIRY_HOURS=24
DEBUG=false
```

---

### Phase 3 — Authentication System

**Objective**: Implement secure JWT-based authentication with signup and signin endpoints.

#### 3.1 Password Handling

```python
# app/auth/password.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
```

#### 3.2 JWT Implementation

```python
# app/auth/jwt.py
from jose import jwt, JWTError
from datetime import datetime, timedelta

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(hours=settings.JWT_EXPIRY_HOURS),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def verify_token(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
```

#### 3.3 Auth Dependencies

```python
# app/auth/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
) -> User:
    try:
        payload = verify_token(credentials.credentials)
        user = session.get(User, payload["sub"])
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

#### 3.4 Auth Endpoints

```python
# app/routers/auth.py
@router.post("/signup", response_model=AuthResponse)
async def signup(data: SignupRequest, session: Session = Depends(get_session)):
    # Check email uniqueness
    # Hash password
    # Create user
    # Return JWT token

@router.post("/signin", response_model=AuthResponse)
async def signin(data: SigninRequest, session: Session = Depends(get_session)):
    # Find user by email
    # Verify password
    # Return JWT token (or "Invalid credentials" for any failure)
```

---

### Phase 4 — Task API Implementation

**Objective**: Implement RESTful task endpoints with ownership enforcement.

#### 4.1 API Contract

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tasks` | List user's tasks | Required |
| POST | `/api/tasks` | Create new task | Required |
| GET | `/api/tasks/{id}` | Get single task | Required + Owner |
| PUT | `/api/tasks/{id}` | Update task | Required + Owner |
| DELETE | `/api/tasks/{id}` | Delete task | Required + Owner |
| PATCH | `/api/tasks/{id}/complete` | Toggle completion | Required + Owner |

#### 4.2 Ownership Enforcement

```python
# All task queries MUST be scoped to authenticated user
def get_user_task(task_id: UUID, user: User, session: Session) -> Task:
    task = session.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user.id)
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task
```

#### 4.3 Response Schemas

```python
class TaskResponse(BaseModel):
    id: UUID
    title: str
    description: str | None
    completed: bool
    created_at: datetime
    updated_at: datetime

class TaskListResponse(BaseModel):
    tasks: list[TaskResponse]
    count: int
```

---

### Phase 5 — Frontend Application

**Objective**: Create Next.js frontend with public homepage and auth pages.

#### 5.1 Updated Project Structure

```text
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with auth provider
│   │   ├── page.tsx             # PUBLIC: Homepage with feature buttons
│   │   ├── signin/
│   │   │   └── page.tsx         # PUBLIC: Signin form
│   │   ├── signup/
│   │   │   └── page.tsx         # PUBLIC: Signup form
│   │   └── tasks/
│   │       ├── layout.tsx       # PROTECTED: Auth check wrapper
│   │       ├── page.tsx         # Task list view
│   │       ├── new/
│   │       │   └── page.tsx     # Create task form
│   │       └── [id]/
│   │           ├── page.tsx     # View single task
│   │           └── edit/
│   │               └── page.tsx # Edit task form
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx       # Nav with auth buttons
│   │   │   └── Footer.tsx
│   │   ├── home/
│   │   │   ├── FeatureButton.tsx   # Auth-gated button
│   │   │   └── HeroSection.tsx
│   │   ├── auth/
│   │   │   ├── SigninForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── AuthGuard.tsx    # Protected route wrapper
│   │   └── tasks/
│   │       ├── TaskList.tsx
│   │       ├── TaskCard.tsx
│   │       ├── TaskForm.tsx
│   │       └── DeleteConfirm.tsx
│   ├── lib/
│   │   ├── api.ts               # Fetch wrapper with JWT
│   │   ├── auth.ts              # Token storage/retrieval
│   │   └── types.ts             # TypeScript interfaces
│   ├── hooks/
│   │   ├── useAuth.ts           # Auth state management
│   │   └── useTasks.ts          # Task CRUD operations
│   └── context/
│       └── AuthContext.tsx      # Global auth state
├── public/
├── package.json
├── tsconfig.json
├── next.config.js
└── .env.local.example
```

#### 5.2 Homepage Component

```tsx
// app/page.tsx - Public homepage
export default function HomePage() {
  return (
    <main>
      <HeroSection
        title="Todo App"
        subtitle="Manage your tasks efficiently"
      />
      <div className="feature-grid">
        <FeatureButton
          label="Add Task"
          href="/tasks/new"
          icon={<PlusIcon />}
        />
        <FeatureButton
          label="View Tasks"
          href="/tasks"
          icon={<ListIcon />}
        />
        <FeatureButton
          label="Edit Task"
          href="/tasks"
          icon={<EditIcon />}
        />
        <FeatureButton
          label="Delete Task"
          href="/tasks"
          icon={<TrashIcon />}
        />
        <FeatureButton
          label="Complete Task"
          href="/tasks"
          icon={<CheckIcon />}
        />
      </div>
    </main>
  );
}
```

#### 5.3 Auth-Gated Feature Button

```tsx
// components/home/FeatureButton.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';

export function FeatureButton({ label, href, icon }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (isAuthenticated) {
      router.push(href);
    } else {
      router.push(`/signin?returnUrl=${encodeURIComponent(href)}`);
    }
  };

  return (
    <button onClick={handleClick} className="feature-button">
      {icon}
      <span>{label}</span>
    </button>
  );
}
```

---

### Phase 6 — Auth-Gated UX Implementation

**Objective**: Complete the auth-gated user experience with proper redirects and token handling.

#### 6.1 Auth Context Provider

```tsx
// context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getStoredToken, removeToken, decodeToken } from '@/lib/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: string; email: string } | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({ id: decoded.sub, email: decoded.email });
      } else {
        removeToken(); // Expired
      }
    }
    setIsLoading(false);
  }, []);

  // ... login, logout implementations
}
```

#### 6.2 Protected Route Wrapper

```tsx
// components/auth/AuthGuard.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/signin?returnUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;

  return children;
}
```

#### 6.3 Signin with Return URL

```tsx
// app/signin/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function SigninPage() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (data) => {
    const response = await api.signin(data);
    login(response.token);
    router.push(returnUrl); // Return to intended destination
  };

  return <SigninForm onSubmit={handleSubmit} />;
}
```

#### 6.4 Header Auth State

```tsx
// components/layout/Header.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header>
      <Link href="/">Todo App</Link>
      <nav>
        {isAuthenticated ? (
          <>
            <span>{user?.email}</span>
            <button onClick={logout}>Sign Out</button>
          </>
        ) : (
          <>
            <Link href="/signin">Sign In</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
```

#### 6.5 Token Expiry Handling

```tsx
// lib/api.ts
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getStoredToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    removeToken();
    window.location.href = `/signin?returnUrl=${encodeURIComponent(window.location.pathname)}`;
    throw new Error('Session expired');
  }

  return response;
}
```

---

## Project Structure

### Documentation (this feature)

```text
specs/001-fullstack-todo-app/
├── spec.md              # Feature specification v2.0.0
├── plan.md              # This file (Homepage First UX)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (OpenAPI specs)
│   ├── auth.yaml        # Authentication endpoints
│   └── tasks.yaml       # Task CRUD endpoints
├── checklists/          # Quality validation
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/sp.tasks command)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry
│   ├── config.py            # Environment configuration
│   ├── database.py          # Neon PostgreSQL connection
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py          # User SQLModel
│   │   └── task.py          # Task SQLModel
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py          # /api/auth/* endpoints
│   │   └── tasks.py         # /api/tasks/* endpoints
│   ├── auth/
│   │   ├── __init__.py
│   │   ├── jwt.py           # JWT creation/verification
│   │   ├── password.py      # Password hashing (bcrypt)
│   │   └── dependencies.py  # FastAPI auth dependencies
│   └── schemas/
│       ├── __init__.py
│       ├── user.py          # Pydantic request/response schemas
│       └── task.py          # Pydantic request/response schemas
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Test fixtures
│   ├── test_auth.py         # Authentication tests
│   └── test_tasks.py        # Task CRUD tests
├── requirements.txt
└── .env.example

frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with AuthProvider
│   │   ├── page.tsx             # Homepage with feature buttons
│   │   ├── signin/
│   │   │   └── page.tsx         # Signin with returnUrl handling
│   │   ├── signup/
│   │   │   └── page.tsx         # Signup with auto-signin
│   │   └── tasks/
│   │       ├── layout.tsx       # AuthGuard wrapper
│   │       ├── page.tsx         # Task list
│   │       ├── new/
│   │       │   └── page.tsx     # Create task
│   │       └── [id]/
│   │           ├── page.tsx     # View task
│   │           └── edit/
│   │               └── page.tsx # Edit task
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   ├── layout/              # Header, Footer
│   │   ├── home/                # FeatureButton, HeroSection
│   │   ├── auth/                # Forms, AuthGuard
│   │   └── tasks/               # TaskList, TaskCard, TaskForm
│   ├── lib/
│   │   ├── api.ts               # API client with JWT
│   │   ├── auth.ts              # Token storage/retrieval
│   │   └── types.ts             # TypeScript interfaces
│   ├── hooks/
│   │   ├── useAuth.ts           # Auth state hook
│   │   └── useTasks.ts          # Tasks CRUD hook
│   └── context/
│       └── AuthContext.tsx      # Global auth state
├── public/
├── package.json
├── tsconfig.json
├── next.config.js
└── .env.local.example
```

**Structure Decision**: Web application structure with `backend/` (FastAPI) and `frontend/` (Next.js App Router). Frontend updated to support homepage-first pattern with public routes at root level and protected task routes under `/tasks/`.

---

## Complexity Tracking

> No constitution violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

---

## Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| Token storage in localStorage | XSS vulnerability | Sanitize all inputs, use httpOnly cookies in production |
| CORS misconfiguration | API inaccessible from frontend | Explicit origin whitelist in FastAPI CORS middleware |
| Return URL manipulation | Open redirect vulnerability | Validate returnUrl starts with `/` (relative paths only) |

---

## Next Steps

1. Run `/sp.tasks` to generate implementation task list
2. Execute Phase 2 first (Backend Foundation)
3. Execute Phases 3-6 in sequence
4. Validate against spec v2.0.0 acceptance criteria

---

**Version**: 2.0.0 | **Created**: 2026-01-13 | **Updated**: 2026-01-17
