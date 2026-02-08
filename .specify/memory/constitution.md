<!--
  ============================================================================
  SYNC IMPACT REPORT
  ============================================================================
  Version Change: 1.0.0 → 2.0.0 (MAJOR - Phase 3 AI Chatbot integration)

  Modified Principles:
    - Accuracy: Extended for AI tool call reliability
    - Reproducibility: Extended for tool call logging
    - Security: Extended for AI/MCP context

  Added Sections:
    - Core Principles: VII. AI Reliability (new)
    - Core Principles: VIII. Stateless Recovery (new)
    - Technology Constraints: AI/Chatbot Stack (new)
    - API Standards: Chat API endpoints (new)
    - Data Entities: Conversation, Message (new)
    - MCP Tool Specifications (new section)

  Removed Sections: None

  Templates Requiring Updates:
    - .specify/templates/plan-template.md: ✅ Compatible (Constitution Check section exists)
    - .specify/templates/spec-template.md: ✅ Compatible (Requirements section aligns)
    - .specify/templates/tasks-template.md: ✅ Compatible (Phase structure supports AI/MCP tasks)

  Follow-up TODOs:
    - Create Phase 3 feature spec in specs/phase3-chatbot/
    - Update plan template for AI integration patterns
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

### VII. AI Reliability

The AI chatbot MUST perform task operations reliably via MCP tools. Every tool call
MUST map to a user message and execute the correct operation. Chatbot responses MUST
be friendly, clear, and informative.

**Rationale**: Users trust the AI assistant to correctly interpret intent and execute
actions. Reliability builds confidence in the system.

**Non-negotiables**:
- All tool calls MUST be mapped to user messages according to agent behavior specification
- Tool execution MUST succeed or provide clear, actionable error messages
- Chatbot responses MUST accurately reflect the operation performed
- No hallucinated actions (claiming to do something that wasn't done)
- MCP tools are the ONLY mechanism for task CRUD operations via chat

### VIII. Stateless Recovery

The backend MUST remain stateless. All conversation context MUST be stored in the
database and recoverable from storage alone. No in-memory session state is permitted.

**Rationale**: Stateless backends enable horizontal scaling, resilience to restarts,
and deterministic behavior across requests.

**Non-negotiables**:
- Conversation history MUST be persisted to database
- All tool calls MUST be logged in database for auditability
- Server restart MUST NOT lose any conversation context
- Each request MUST be independently verifiable from stored state
- No reliance on in-memory caches for correctness (cache for performance only)

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

### AI/Chatbot Stack (Phase 3)
- **Agent Framework**: OpenAI Agents SDK
- **Tool Protocol**: Model Context Protocol (MCP)
- **Chat UI**: React/Next.js ChatKit component (floating button UX)
- **LLM Provider**: OpenAI (GPT-4 or equivalent)
- **Conversation Storage**: PostgreSQL via SQLModel
- **Domain Allowlist**: Configured for ChatKit frontend security

### API Standards
All endpoints MUST require authentication. All task operations MUST be scoped to the
authenticated user.

**Required Endpoints (Phase 1-2)**:
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

**Required Endpoints (Phase 3 - Chat API)**:
```
POST   /api/chat                 # Send message, receive AI response (JWT secured)
GET    /api/chat/history         # Retrieve conversation history (JWT secured)
DELETE /api/chat/history         # Clear conversation history (JWT secured)
```

### Data Entities

**Core Entities (Phase 1-2)**:
- **User**: id, email, hashed_password, created_at
- **Task**: id, user_id (FK), title, description, completed, created_at, updated_at

**Chat Entities (Phase 3)**:
- **Conversation**: id, user_id (FK), created_at, updated_at
- **Message**: id, conversation_id (FK), role (user|assistant|tool), content, tool_call_id (nullable), tool_name (nullable), created_at

### MCP Tool Specifications (Phase 3)

The AI chatbot MUST use MCP tools for all task operations. Tool calls are the bridge
between natural language and database operations.

**Required MCP Tools**:
```
add_task(title, description?)     # Create a new task for the user
list_tasks(filter?)               # List user's tasks (optional: completed/pending filter)
complete_task(task_id)            # Mark a task as completed
delete_task(task_id)              # Remove a task permanently
update_task(task_id, title?, description?, completed?)  # Modify task properties
```

**Tool Behavior Contract**:
- Every tool MUST validate user ownership before execution
- Every tool MUST return structured success/error responses
- Every tool call MUST be logged in the Message table with role="tool"
- Tool errors MUST be user-friendly and actionable
- Tools MUST NOT perform operations on tasks owned by other users

**Integration Requirements**:
- MCP server runs as part of the FastAPI backend
- OpenAI Agents SDK orchestrates tool selection and execution
- All tool calls are scoped to the authenticated user's context
- Tool results are formatted for natural language response generation

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

**Version**: 2.0.0 | **Ratified**: 2026-01-13 | **Last Amended**: 2026-01-20
