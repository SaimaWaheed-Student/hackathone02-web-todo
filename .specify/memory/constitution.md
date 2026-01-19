<!--
  ============================================================================
  SYNC IMPACT REPORT
  ============================================================================
  Version Change: 0.0.0 → 1.0.0 (MAJOR - initial ratification)

  Modified Principles: N/A (initial version)

  Added Sections:
    - Core Principles (6 principles)
    - Technology Constraints
    - Development Workflow
    - Governance

  Removed Sections: N/A (initial version)

  Templates Requiring Updates:
    - .specify/templates/plan-template.md: ✅ Compatible (Constitution Check section exists)
    - .specify/templates/spec-template.md: ✅ Compatible (Requirements section aligns)
    - .specify/templates/tasks-template.md: ✅ Compatible (Phase structure supports auth/security tasks)

  Follow-up TODOs: None
  ============================================================================
-->

# Todo Full-Stack Web Application Constitution

## Core Principles

### I. Accuracy

All system behaviors MUST align exactly with the written specification. No feature, endpoint,
or data flow may deviate from documented requirements. Acceptance criteria define the single
source of truth for implementation correctness.

**Rationale**: Spec-driven development requires deterministic outcomes. Ambiguity leads to
inconsistent implementations that cannot be reliably regenerated.

### II. Consistency

API contracts, authentication rules, and data models MUST remain stable across all layers
(frontend, backend, database). Changes to shared contracts require synchronized updates to
all dependent components.

**Non-negotiables**:
- RESTful API design following HTTP semantics
- JWT token structure identical across issuance and verification
- Entity schemas match between SQLModel definitions and API responses

### III. Security

Every request MUST be authenticated and authorized. Security is not an afterthought but a
foundational requirement enforced at every system boundary.

**Non-negotiables**:
- Passwords MUST never be stored in plaintext (bcrypt or equivalent hashing required)
- JWT tokens MUST be verified on every protected request
- Requests without valid JWT MUST return HTTP 401
- Environment variables MUST be used for secrets and configuration
- No frontend-to-backend session coupling (stateless authentication)

### IV. User Isolation

No user may access or modify another user's data. Task ownership MUST be enforced at the
database query level, not merely at the API layer.

**Non-negotiables**:
- All task operations MUST be scoped to the authenticated user
- User ID in JWT MUST match the user context used in all database operations
- Foreign key relationships MUST enforce referential integrity
- API endpoints MUST validate user ownership before any DB operation

### V. Reproducibility

The entire system MUST be regeneratable from specifications and prompts alone. No manual
code changes that bypass the spec-driven workflow are permitted.

**Non-negotiables**:
- Follow Agentic Dev Stack workflow: spec → plan → tasks → implement
- Prompts, specs, and iterations are part of the deliverable
- Each phase MUST be reviewable independently
- PHR (Prompt History Records) capture all development decisions

### VI. Simplicity

Use the minimal viable design to satisfy all requirements. Avoid over-engineering,
premature optimization, and speculative features.

**Non-negotiables**:
- Smallest viable diff for each change
- No abstractions without immediate concrete use
- YAGNI (You Aren't Gonna Need It) principle strictly enforced
- No third-party hosted auth services (custom JWT implementation required)

## Technology Constraints

### Frontend Stack
- **Framework**: Next.js 16+ with App Router architecture
- **UI**: Responsive design supporting multiple screen sizes
- **API Communication**: fetch or equivalent HTTP client
- **Auth**: JWT attached to every API request via Authorization header

### Backend Stack
- **Framework**: Python FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Custom JWT-based implementation
- **Prohibited**: Better Auth or third-party hosted auth services

### API Standards
All endpoints MUST require authentication. All task operations MUST be scoped to the
authenticated user.

**Required Endpoints**:
```
POST   /api/auth/signup          # User registration
POST   /api/auth/signin          # User login (returns JWT)
GET    /api/{user_id}/tasks      # List user's tasks
POST   /api/{user_id}/tasks      # Create task
GET    /api/{user_id}/tasks/{id} # Get single task
PUT    /api/{user_id}/tasks/{id} # Update task
DELETE /api/{user_id}/tasks/{id} # Delete task
PATCH  /api/{user_id}/tasks/{id}/complete # Mark complete
```

### Data Entities
- **User**: id, email, hashed_password, created_at
- **Task**: id, user_id (FK), title, description, completed, created_at, updated_at

## Development Workflow

### Agentic Dev Stack Process
1. **Specify** (`/sp.specify`): Write feature specification from requirements
2. **Plan** (`/sp.plan`): Generate architectural implementation plan
3. **Tasks** (`/sp.tasks`): Break plan into testable, ordered tasks
4. **Implement** (`/sp.implement`): Execute tasks via Claude Code agents
5. **Document** (PHR): Record all prompts and responses for traceability

### Quality Gates
- Constitution Check MUST pass before implementation begins
- Each user story MUST be independently testable
- All API contracts MUST be validated against spec
- Security requirements MUST be verified at each phase

### Prohibited Practices
- Manual code writing outside agentic workflow
- Hardcoded secrets or tokens
- Skipping specification phases
- Implementing features not in spec

## Governance

### Amendment Process
1. Propose change with rationale and impact assessment
2. Document in PHR with constitution stage
3. Update version following semantic versioning
4. Propagate changes to dependent templates
5. Create ADR if architecturally significant

### Versioning Policy
- **MAJOR**: Backward-incompatible principle changes or removals
- **MINOR**: New principles or materially expanded guidance
- **PATCH**: Clarifications, wording fixes, non-semantic refinements

### Compliance Review
- All PRs MUST verify compliance with constitution principles
- Complexity additions MUST be justified in writing
- Security violations are blocking and non-negotiable
- User isolation violations are critical defects

**Version**: 1.0.0 | **Ratified**: 2026-01-13 | **Last Amended**: 2026-01-13
