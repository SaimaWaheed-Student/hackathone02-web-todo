---
id: 001
title: Initial Constitution Ratification
stage: constitution
date: 2026-01-13
surface: agent
model: claude-opus-4-5
feature: none
branch: master
user: saima waheed
command: /sp.constitution
labels: ["constitution", "governance", "hackathon", "phase-ii"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A (governance document)
---

## Prompt

Project: Todo Full-Stack Web Application (Phase II – Hackathon)

Objective:
Transform an existing single-user console-based todo application into a modern, secure, multi-user full-stack web application with persistent storage, authentication, and user-isolated data access, using a fully spec-driven and agentic development workflow.

Development Philosophy:
- Spec-first, agentic development (no manual coding)
- Clear separation of concerns between frontend, backend, and authentication
- Deterministic, reproducible architecture and behavior
- Security-by-design and user data isolation

Core Principles:
- Accuracy: All system behaviors must align exactly with the written spec
- Consistency: API contracts, auth rules, and data models must remain stable across layers
- Security: Every request must be authenticated and authorized
- User Isolation: No user may access or modify another user's data
- Reproducibility: The entire system can be regenerated from specs and prompts
- Simplicity: Use the minimal viable design to satisfy all requirements

Key Standards:
- RESTful API design following HTTP semantics
- Stateless authentication using JWT
- Passwords must never be stored in plaintext
- JWT tokens must be verified on every protected request
- Task ownership must be enforced at the database query level
- Environment variables must be used for secrets and configuration
- No frontend-to-backend session coupling

Technology Constraints:
Frontend:
- Next.js 16+
- App Router architecture
- Responsive UI
- API communication via fetch or equivalent client

Backend:
- Python FastAPI
- SQLModel ORM
- Neon Serverless PostgreSQL
- JWT-based authentication (custom implementation)
- No use of Better Auth or third-party hosted auth services

Authentication Rules:
- Custom authentication system is required
- Features must include:
  - User signup
  - User signin
  - Secure password hashing
  - JWT issuance on successful login
  - JWT verification middleware/dependencies
- JWT tokens must:
  - Be signed using a shared secret
  - Include user identifier claims
  - Have an expiration time
- Requests without valid JWT must return HTTP 401
- User ID in JWT must match the user context used in all operations

API Standards:
- All endpoints must require authentication
- All task operations must be scoped to the authenticated user
- API endpoints to implement:

  GET    /api/{user_id}/tasks
  POST   /api/{user_id}/tasks
  GET    /api/{user_id}/tasks/{id}
  PUT    /api/{user_id}/tasks/{id}
  DELETE /api/{user_id}/tasks/{id}
  PATCH  /api/{user_id}/tasks/{id}/complete

- The backend must validate:
  - JWT authenticity
  - Token expiration
  - User ownership before any DB operation

Data & Persistence:
- All data must be stored in Neon Serverless PostgreSQL
- ORM layer must be SQLModel
- Entities must include:
  - User
  - Task (linked to user via foreign key)
- Database schema must enforce relational integrity

Frontend Behavior:
- Users must authenticate before accessing tasks
- JWT must be attached to every API request via Authorization header
- UI must only display tasks belonging to the logged-in user
- All CRUD operations must reflect backend state accurately
- Layout must be responsive and usable on multiple screen sizes

Process Constraints (Hackathon Rules):
- Follow Agentic Dev Stack workflow strictly:
  1. Write spec
  2. Generate plan
  3. Break into tasks
  4. Implement via Claude Code
- No manual code writing
- Prompts, specs, and iterations are part of evaluation
- Each phase must be reviewable independently

Success Criteria:
- All 5 basic todo features work correctly in a multi-user environment
- All API endpoints are protected and user-scoped
- JWT-based auth works end-to-end without Better Auth
- Users cannot access or affect other users' tasks
- Frontend and backend communicate securely and correctly
- The project can be fully regenerated from specs alone
- Passes hackathon technical and architectural review

## Response snapshot

Created and ratified the initial project constitution v1.0.0 with:

**6 Core Principles**:
1. Accuracy - System behaviors align with spec
2. Consistency - Stable contracts across layers
3. Security - Authenticated and authorized requests
4. User Isolation - No cross-user data access
5. Reproducibility - Regeneratable from specs
6. Simplicity - Minimal viable design

**3 Additional Sections**:
- Technology Constraints (Next.js 16+, FastAPI, SQLModel, Neon PostgreSQL, custom JWT)
- Development Workflow (Agentic Dev Stack: specify → plan → tasks → implement)
- Governance (amendment process, versioning policy, compliance review)

All dependent templates verified compatible. No follow-up TODOs required.

## Outcome

- ✅ Impact: Established foundational governance document for hackathon project
- 🧪 Tests: N/A (governance document)
- 📁 Files: .specify/memory/constitution.md (created/updated)
- 🔁 Next prompts: /sp.specify to create feature specifications
- 🧠 Reflection: Clean initial ratification with all user requirements captured

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
