---
id: 001
title: Phase 3 AI Chatbot Implementation Planning
stage: plan
date: 2026-01-22
surface: agent
model: claude-opus-4-5-20251101
feature: 002-todo-ai-chatbot
branch: 002-todo-ai-chatbot
user: saima waheed
command: /sp.plan
labels: ["planning", "ai-chatbot", "phase3", "openai-agents", "architecture"]
links:
  spec: specs/002-todo-ai-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/002-todo-ai-chatbot/plan.md
  - specs/002-todo-ai-chatbot/research.md
  - specs/002-todo-ai-chatbot/data-model.md
  - specs/002-todo-ai-chatbot/quickstart.md
  - specs/002-todo-ai-chatbot/contracts/chat-api.yaml
  - specs/002-todo-ai-chatbot/contracts/tool-specifications.md
tests:
  - None (planning phase)
---

## Prompt

Phase 3 – Todo AI Chatbot Integration

Objective:
Design and implement Phase 3 of the Todo App by adding an AI-powered chatbot
that integrates seamlessly into the existing Phase 2 application without
breaking current functionality.

Context:
- Phase 2 already includes:
  - Homepage with professional UI
  - JWT-based authentication (signup/signin)
  - Backend APIs for task CRUD (add, remove, update, complete)
- Phase 3 will be developed inside the Phase 2 project folder
- Chatbot must be visible in Phase 2 UI (homepage/dashboard)

Tech stack:
- Frontend: Next.js 16+ (App Router)
- Backend: FastAPI
- AI: OpenAI Agents SDK
- Tooling: MCP Server for task actions
- Database: Neon Serverless PostgreSQL
- ORM: SQLModel
- Auth: Existing Phase 2 JWT (no new auth system)

Planning requirements:
Break the work into clear, ordered steps covering:

1. Architecture planning
   - Identify where Phase 3 code lives inside Phase 2
   - Define boundaries between existing task APIs and AI layer
   - Decide chatbot UI placement (floating button or embedded)

2. Backend planning
   - Define database schema for chat sessions and messages
   - Plan stateless chat endpoint (/api/{user_id}/chat)
   - Design MCP tools:
     - add_task
     - list_tasks
     - complete_task
     - delete_task
     - update_task
   - Map natural language intents to MCP tools
   - Error handling and validation strategy

3. AI agent planning
   - Define system prompt and behavior rules
   - Plan how agent selects tools based on user intent
   - Define response style (friendly, professional, confirmation-based)

4. Frontend planning
   - Chatbot component structure (ChatWindow, MessageList, InputBox)
   - State management for messages
   - JWT-secured API calls to backend
   - Professional UI theme consistent with Phase 2
   - Loading, error, and success states

5. Integration planning
   - Connect chatbot UI to backend chat endpoint
   - Ensure task actions reflect immediately in UI
   - Verify chatbot does not interfere with existing task flows

6. Testing & validation
   - Test all task commands via chat
   - Validate user isolation (no cross-user data)
   - Test refresh/restart conversation recovery
   - UX testing for responsiveness and clarity

7. Final checks
   - Folder structure review

## Response snapshot

Generated comprehensive implementation plan for Phase 3 AI Chatbot integration:

**Phase 0 Research (research.md)**:
- Selected OpenAI Agents SDK with function tools over MCP protocol
- Rationale: Simpler for single-app use case, automatic schema generation
- Documented alternatives: FastAPI-MCP, LangChain, direct OpenAI API

**Phase 1 Design Artifacts**:

1. **data-model.md**: Database schema for Conversation (1:1 with user) and Message (role: user/assistant/tool) tables with SQLModel definitions

2. **contracts/chat-api.yaml**: OpenAPI 3.1 specification for:
   - POST /api/chat (send message, get AI response)
   - GET /api/chat/history (retrieve conversation)
   - DELETE /api/chat/history (clear conversation)

3. **contracts/tool-specifications.md**: Function tool interfaces for add_task, list_tasks, complete_task, delete_task, update_task with input/output schemas

4. **quickstart.md**: Implementation getting started guide with file structure and verification tests

5. **plan.md**: Full implementation plan with:
   - Architecture diagrams
   - Data flow sequences
   - Key design decisions (5 major decisions documented)
   - Constitution compliance check (all 8 principles passed)
   - Testing strategy
   - Implementation phases (3.1-3.5)

**Key Architecture Decisions**:
- Function tools (not MCP) for simplicity
- Single conversation per user
- Tools call existing TaskService (not direct DB)
- Database-backed state (stateless backend)
- Floating chat widget (bottom-right)

## Outcome

- ✅ Impact: Complete planning artifacts for Phase 3 AI chatbot feature
- 🧪 Tests: N/A (planning phase, no code written)
- 📁 Files: 6 files created (plan.md, research.md, data-model.md, quickstart.md, chat-api.yaml, tool-specifications.md)
- 🔁 Next prompts: /sp.tasks to generate implementation tasks
- 🧠 Reflection: Used OpenAI Agents SDK function tools instead of full MCP protocol per research findings - simpler integration for this use case

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Constitution check PASS (8/8 principles)
- Prompt variant (if applicable): Standard /sp.plan command
- Next experiment (smallest change to try): Consider adding rate limiting design in future iteration
