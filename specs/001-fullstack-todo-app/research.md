# Research: Full-Stack Todo Web Application (Phase II)

**Feature Branch**: `001-fullstack-todo-app`
**Date**: 2026-01-13
**Status**: Complete

## Overview

This document consolidates research findings for all technical decisions required to implement the full-stack todo application per the specification and constitution.

---

## 1. Backend Framework: FastAPI

**Decision**: Use FastAPI as the Python web framework

**Rationale**:
- Constitution mandates Python FastAPI for backend
- Built-in OpenAPI/Swagger documentation generation
- Native async support for database operations
- Pydantic integration for request/response validation
- Dependency injection system ideal for auth middleware

**Alternatives Considered**:
- Flask: Simpler but lacks native async and automatic docs
- Django: Too heavy for hackathon scope, includes ORM we don't need
- Starlette: FastAPI is built on it, provides higher-level abstractions

**Best Practices**:
- Use dependency injection for auth verification
- Organize routes in separate router modules
- Use Pydantic schemas for all request/response bodies
- Return appropriate HTTP status codes (201 for create, 204 for delete)

---

## 2. ORM: SQLModel

**Decision**: Use SQLModel for database models and queries

**Rationale**:
- Constitution mandates SQLModel ORM
- Combines SQLAlchemy and Pydantic in single model definitions
- Type-safe queries with IDE autocomplete
- Easy relationship definitions with foreign keys
- Compatible with async database drivers

**Alternatives Considered**:
- SQLAlchemy alone: More verbose, requires separate Pydantic schemas
- Tortoise ORM: Good async support but less FastAPI integration
- Raw SQL: Not maintainable, no type safety

**Best Practices**:
- Define models with `table=True` for database tables
- Use `Optional` for nullable fields
- Define relationships with `Relationship` and `back_populates`
- Use `Field(foreign_key="table.column")` for FK relationships

---

## 3. Database: Neon Serverless PostgreSQL

**Decision**: Use Neon Serverless PostgreSQL for data persistence

**Rationale**:
- Constitution mandates Neon Serverless PostgreSQL
- Serverless scaling for hackathon demo
- PostgreSQL compatibility for SQLModel/SQLAlchemy
- Connection pooling built-in
- Free tier available for development

**Alternatives Considered**:
- Local PostgreSQL: Requires setup, not serverless
- Supabase: PostgreSQL but adds unnecessary features
- SQLite: Not suitable for multi-user production

**Connection Pattern**:
```python
# Use connection string from environment
DATABASE_URL = os.getenv("DATABASE_URL")
# For Neon, use ?sslmode=require
engine = create_engine(DATABASE_URL, echo=True)
```

**Best Practices**:
- Store connection string in environment variable
- Use connection pooling for serverless
- Enable SSL for Neon connections
- Create tables on startup if not exists

---

## 4. Authentication: Custom JWT Implementation

**Decision**: Implement custom JWT authentication using python-jose and passlib

**Rationale**:
- Constitution prohibits third-party hosted auth services (Better Auth)
- JWT provides stateless authentication (constitution requirement)
- python-jose is well-maintained JWT library
- passlib provides secure bcrypt password hashing

**Alternatives Considered**:
- Better Auth: Prohibited by constitution
- Auth0/Firebase Auth: Third-party hosted, prohibited
- Session-based auth: Violates stateless requirement
- FastAPI-Users: Too opinionated, adds complexity

**JWT Structure**:
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "exp": 1234567890,
  "iat": 1234567890
}
```

**Best Practices**:
- Use HS256 algorithm with shared secret
- Set reasonable expiration (24 hours for hackathon)
- Store JWT secret in environment variable
- Never include sensitive data in JWT payload
- Use bcrypt with appropriate work factor (12)

---

## 5. Password Security

**Decision**: Use bcrypt via passlib for password hashing

**Rationale**:
- Constitution requires passwords never stored in plaintext
- bcrypt is industry standard for password hashing
- passlib provides clean API and handles salt automatically
- Work factor can be adjusted for security/performance tradeoff

**Implementation**:
```python
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
```

---

## 6. Frontend Framework: Next.js 16+ App Router

**Decision**: Use Next.js 16+ with App Router architecture

**Rationale**:
- Constitution mandates Next.js 16+ with App Router
- Server Components for improved performance
- Built-in routing with file-based conventions
- Easy protected route implementation via layouts
- Excellent TypeScript support

**Alternatives Considered**:
- Pages Router: Legacy, App Router is the standard
- React (CRA): No SSR, worse SEO
- Remix: Good alternative but Next.js mandated

**Best Practices**:
- Use route groups `(auth)` and `(protected)` for organization
- Implement auth check in protected layout
- Use server actions for form submissions where appropriate
- Store JWT in localStorage (httpOnly cookies more secure but complex)

---

## 7. API Client & JWT Handling

**Decision**: Custom fetch wrapper with JWT injection

**Rationale**:
- Constitution requires JWT attached to every protected request
- Simple fetch wrapper provides full control
- No external dependencies needed
- Easy to handle token expiration and refresh

**Implementation Pattern**:
```typescript
async function apiClient(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Handle token expiration
    localStorage.removeItem('token');
    window.location.href = '/signin';
  }

  return response;
}
```

---

## 8. Responsive Design

**Decision**: CSS-based responsive design with mobile-first approach

**Rationale**:
- Constitution requires responsive interface
- CSS media queries are standard approach
- Mobile-first ensures core functionality works everywhere
- No heavy UI library dependency needed

**Breakpoints**:
- Mobile: < 640px (default)
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Best Practices**:
- Use CSS Grid and Flexbox for layouts
- Test on multiple screen sizes
- Ensure touch targets are large enough (44x44px minimum)
- Stack layouts vertically on mobile

---

## 9. Error Handling Strategy

**Decision**: Consistent error response format across API

**Rationale**:
- Constitution requires appropriate error messages
- FR-023 requires identical error for wrong email/password
- Consistent format simplifies frontend handling

**Error Response Format**:
```json
{
  "detail": "Human-readable error message"
}
```

**HTTP Status Codes**:
- 200: Success (GET, PUT, PATCH)
- 201: Created (POST)
- 204: No Content (DELETE)
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid/missing JWT)
- 403: Forbidden (accessing another user's resource)
- 404: Not Found (resource doesn't exist)
- 422: Unprocessable Entity (Pydantic validation)

---

## 10. User Isolation Implementation

**Decision**: Enforce at database query level with user_id scoping

**Rationale**:
- Constitution requires DB-level enforcement (Principle IV)
- All task queries MUST include user_id filter
- User ID extracted from JWT in auth dependency

**Implementation Pattern**:
```python
# In every task query
def get_user_tasks(db: Session, user_id: int):
    return db.exec(
        select(Task).where(Task.user_id == user_id)
    ).all()

def get_task(db: Session, task_id: int, user_id: int):
    task = db.exec(
        select(Task).where(Task.id == task_id, Task.user_id == user_id)
    ).first()
    if not task:
        raise HTTPException(status_code=401)  # Not 404 to prevent enumeration
    return task
```

---

## Summary

All technical decisions have been made with no remaining NEEDS CLARIFICATION items. The technology stack is:

| Component | Technology | Version |
|-----------|------------|---------|
| Backend Framework | FastAPI | Latest |
| ORM | SQLModel | Latest |
| Database | Neon PostgreSQL | Serverless |
| Auth | python-jose + passlib | Custom JWT |
| Frontend | Next.js | 16+ |
| Styling | CSS (responsive) | Mobile-first |

Ready to proceed to Phase 1: Design & Contracts.
