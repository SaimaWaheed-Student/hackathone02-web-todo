---
id: 006
title: Homepage First UX Implementation Plan
stage: plan
date: 2026-01-17
surface: agent
model: claude-opus-4-5-20251101
feature: 001-fullstack-todo-app
branch: 001-fullstack-todo-app
user: saima waheed
command: /sp.plan
labels: ["homepage-first", "architecture", "routing", "auth-gated", "phase-ii"]
links:
  spec: specs/001-fullstack-todo-app/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-fullstack-todo-app/plan.md
tests:
  - null
---

## Prompt

/sp.plan add Todo Full-Stack Web Application (Homepage First)

Phase 1 — UX & Routing Design
- Define public vs protected routes
- Design homepage-first navigation flow
- Define auth-gated button behavior

Phase 2 — Backend Foundation
- Initialize FastAPI project
- Setup Neon PostgreSQL connection
- Define User and Task models
- Implement database relationships

Phase 3 — Authentication System
- Implement signup and signin endpoints
- Add password hashing
- Implement JWT creation and verification
- Secure all task endpoints with JWT

Phase 4 — Task API Implementation
- Implement all RESTful task endpoints
- Enforce task ownership at query level
- Return proper HTTP responses

Phase 5 — Frontend Application
- Create public homepage
- Add Signin and Signup pages
- Implement JWT storage and handling
- Attach JWT to API requests
- Build task CRUD UI

Phase 6 — Auth-Gated UX
- Detect auth state on frontend
- Redirect unauthenticated users to signin
- Enable buttons post-login
- Handle logout and token expiry

## Response snapshot

Updated plan.md (v2.0.0) with comprehensive 6-phase implementation architecture:

**Phase 1 - UX & Routing Design:**
- Route classification table (public vs protected)
- Homepage button mapping with redirect behaviors
- Auth-gated flow diagram (ASCII art)
- Frontend auth state management interface

**Phase 2 - Backend Foundation:**
- FastAPI project structure
- SQLModel User and Task models with relationships
- Neon PostgreSQL connection setup
- Environment configuration template

**Phase 3 - Authentication System:**
- bcrypt password hashing with passlib
- JWT creation and verification with python-jose
- FastAPI auth dependencies (HTTPBearer)
- Signup and signin endpoint signatures

**Phase 4 - Task API Implementation:**
- 6 RESTful endpoints with auth requirements
- Ownership enforcement pattern (user_id query scoping)
- Response schemas (TaskResponse, TaskListResponse)

**Phase 5 - Frontend Application:**
- Next.js App Router structure with public/protected separation
- Homepage component with FeatureButton grid
- Auth-gated FeatureButton implementation (client component)

**Phase 6 - Auth-Gated UX:**
- AuthContext provider with token validation
- AuthGuard protected route wrapper
- Signin with returnUrl handling
- Header auth state display
- Token expiry handling with auto-redirect

**Risk Analysis Added:**
- localStorage XSS vulnerability mitigation
- CORS misconfiguration prevention
- Open redirect vulnerability protection

## Outcome

- ✅ Impact: Complete architectural plan for Homepage First UX pattern
- 🧪 Tests: Architecture validated against constitution (all 6 principles pass)
- 📁 Files: 1 file modified (plan.md updated to v2.0.0)
- 🔁 Next prompts: /sp.tasks to generate implementation task list
- 🧠 Reflection: User prompt was cut off but all 6 phases were provided; comprehensive plan covers all aspects

## Evaluation notes (flywheel)

- Failure modes observed: None - complete prompt received
- Graders run and results (PASS/FAIL): Constitution Check: PASS (6/6 principles)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Run /sp.tasks to break down phases into atomic implementation tasks
