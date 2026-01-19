---
id: 008
title: Homepage First UX Implementation
stage: green
date: 2026-01-17
surface: agent
model: claude-opus-4-5-20251101
feature: 001-fullstack-todo-app
branch: 001-fullstack-todo-app
user: saima waheed
command: /sp.implement
labels: ["homepage-first", "implementation", "frontend", "backend", "phase-ii"]
links:
  spec: specs/001-fullstack-todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/app/page.tsx
  - frontend/src/app/layout.tsx
  - frontend/src/app/(auth)/signin/page.tsx
  - frontend/src/app/(auth)/signup/page.tsx
  - frontend/src/app/tasks/layout.tsx
  - frontend/src/app/tasks/page.tsx
  - frontend/src/app/tasks/new/page.tsx
  - frontend/src/context/AuthContext.tsx
  - frontend/src/components/layout/Header.tsx
  - frontend/src/components/home/HeroSection.tsx
  - frontend/src/components/home/FeatureButton.tsx
  - frontend/src/components/auth/AuthGuard.tsx
  - frontend/src/components/tasks/TaskList.tsx
  - frontend/src/components/tasks/TaskItem.tsx
  - frontend/src/hooks/useTasks.ts
  - frontend/src/lib/types.ts
  - backend/app/routers/tasks.py
tests:
  - null
---

## Prompt

/sp.implement first frontend usky bad backend

(Interpreted as: Implement frontend first, then backend)

## Response snapshot

Implemented the Homepage First UX pattern with comprehensive frontend and backend changes:

**Frontend Changes (SPEC 1, 4, 5):**

1. **Public Homepage** (`frontend/src/app/page.tsx`)
   - HeroSection with app introduction
   - 5 FeatureButtons (Add, View, Edit, Delete, Complete Task)
   - Responsive grid layout (2 cols mobile, 3 tablet, 5 desktop)

2. **Auth Context** (`frontend/src/context/AuthContext.tsx`)
   - Global auth state management
   - Token validation with expiry check
   - Login/logout functions

3. **Auth-Gated Navigation**
   - FeatureButton checks isAuthenticated before navigation
   - Unauthenticated clicks redirect to `/signin?returnUrl=<target>`
   - Header displays user email + Signout when authenticated

4. **Auth Pages with returnUrl**
   - Signin reads returnUrl from query params
   - Signup auto-signs in user after registration
   - Both redirect to returnUrl (or `/`) after auth

5. **Protected Task Routes**
   - AuthGuard component wraps `/tasks/*` routes
   - Redirects to signin with returnUrl preserved
   - Task list, create, edit pages implemented

**Backend Changes (SPEC 2, 3):**

1. **Simplified Task API Routes**
   - Changed from `/{user_id}/tasks` to `/tasks`
   - User ID extracted from JWT token
   - Ownership enforced at query level

**API Contract:**
```
GET    /api/tasks           # List user's tasks
POST   /api/tasks           # Create task
GET    /api/tasks/{id}      # Get single task
PUT    /api/tasks/{id}      # Update task
DELETE /api/tasks/{id}      # Delete task
PATCH  /api/tasks/{id}/complete  # Toggle completion
```

## Outcome

- ✅ Impact: Complete Homepage First UX implementation
- 🧪 Tests: Manual verification required - run frontend and backend servers
- 📁 Files: 17 files created/modified
- 🔁 Next prompts: Run `npm run dev` (frontend) and `uvicorn app.main:app --reload` (backend) to test
- 🧠 Reflection: Implementation follows spec v2.0.0; API simplified to extract user from JWT

## Evaluation notes (flywheel)

- Failure modes observed: None - successful implementation
- Graders run and results (PASS/FAIL): Pending manual verification
- Prompt variant (if applicable): User prompt typo interpreted correctly
- Next experiment (smallest change to try): Test full auth flow with returnUrl
