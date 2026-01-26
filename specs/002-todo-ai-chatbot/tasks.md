# Tasks: Todo AI Chatbot

**Input**: Design documents from `/specs/002-todo-ai-chatbot/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/chat-api.yaml, contracts/tool-specifications.md

**Tests**: Tests are NOT explicitly requested in this feature specification. Tasks focus on implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/app/` for FastAPI, `frontend/src/` for Next.js
- Follows existing Phase 2 project structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [x] T001 Add `openai-agents` dependency to backend/requirements.txt
- [x] T002 Add `OPENAI_API_KEY` to backend/.env.example with placeholder
- [x] T003 [P] Create backend/app/models/conversation.py with Conversation SQLModel per data-model.md
- [x] T004 [P] Create backend/app/models/message.py with Message SQLModel and MessageRole enum per data-model.md
- [x] T005 Update backend/app/models/__init__.py to export Conversation and Message models
- [x] T006 Update backend/app/database.py to import new models for table creation

**Checkpoint**: Database models ready, dependencies installed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Create backend/app/schemas/chat.py with ChatRequest, ChatResponse, ToolCallResult, MessageResponse, ChatHistoryResponse per contracts/chat-api.yaml
- [x] T008 Update backend/app/schemas/__init__.py to export new chat schemas
- [x] T009 Create backend/app/services/chat.py with ChatService skeleton (get_or_create_conversation, get_recent_messages, save_chat_turn)
- [x] T010 Create backend/app/routers/chat.py with route stubs (POST /chat, GET /chat/history, DELETE /chat/history) using existing JWT auth dependency
- [x] T011 Update backend/app/routers/__init__.py to export chat router
- [x] T012 Update backend/app/main.py to include chat router with /api prefix
- [x] T013 Create frontend/src/lib/types.ts additions for ChatMessage, ChatResponse, ChatHistoryResponse types
- [x] T014 Create frontend/src/hooks/useChat.ts skeleton with state management (messages, isLoading, sendMessage, loadHistory, clearHistory)

**Checkpoint**: Foundation ready - API routes exist (returning stubs), frontend hook exists, user story implementation can now begin

---

## Phase 3: User Story 7 - Auth Guard for Chatbot (Priority: P1)

**Goal**: Ensure unauthenticated users cannot access chatbot

**Independent Test**: Attempt to access chat endpoints without JWT, verify 401 response. Attempt to see chat widget when logged out, verify hidden.

### Implementation for User Story 7

- [x] T015 [US7] Verify backend/app/routers/chat.py uses get_current_user dependency on all endpoints (already in T010 stub)
- [x] T016 [US7] Create frontend/src/components/chat/ChatWidget.tsx that only renders when user is authenticated (uses AuthContext)
- [x] T017 [US7] Add ChatWidget to frontend/src/app/layout.tsx conditionally (only when isAuthenticated is true)

**Checkpoint**: Chat widget hidden for logged-out users, API returns 401 for unauthenticated requests

---

## Phase 4: User Story 2 - Open/Close Chat Widget (Priority: P1)

**Goal**: User can click floating button to open/close chat window

**Independent Test**: Click floating button, verify chat window opens with welcome message. Click close, verify window closes.

### Implementation for User Story 2

- [x] T018 [P] [US2] Create frontend/src/components/chat/ChatButton.tsx (floating action button, bottom-right, chat icon)
- [x] T019 [P] [US2] Create frontend/src/components/chat/ChatWindow.tsx (container with header, close button, message area, input area)
- [x] T020 [US2] Update frontend/src/components/chat/ChatWidget.tsx to manage open/close state and render ChatButton + ChatWindow
- [x] T021 [US2] Add CSS styles for floating button positioning (bottom: 24px, right: 24px, z-index: 1000) in ChatButton.tsx
- [x] T022 [US2] Add slide-up animation for ChatWindow open/close transitions
- [x] T023 [US2] Display welcome message when chat opens ("Hi! I'm your todo assistant. How can I help?")

**Checkpoint**: Floating button visible, clicking opens/closes chat window with animation

---

## Phase 5: User Story 1 - Send Message and Receive AI Response (Priority: P1) - MVP

**Goal**: User sends message, AI responds (with task operations if applicable)

**Independent Test**: Type "Hello" and receive contextual greeting. Type "Add task buy groceries" and see task created with confirmation.

### Implementation for User Story 1 - Backend Tools

- [x] T024 [US1] Implement add_task function tool in backend/app/services/chat.py per tool-specifications.md
- [x] T025 [P] [US1] Implement list_tasks function tool in backend/app/services/chat.py per tool-specifications.md
- [x] T026 [P] [US1] Implement complete_task function tool in backend/app/services/chat.py per tool-specifications.md
- [x] T027 [P] [US1] Implement delete_task function tool in backend/app/services/chat.py per tool-specifications.md
- [x] T028 [P] [US1] Implement update_task function tool in backend/app/services/chat.py per tool-specifications.md
- [x] T029 [US1] Implement resolve_task helper function for finding tasks by ID or title in backend/app/services/chat.py

### Implementation for User Story 1 - AI Agent

- [x] T030 [US1] Define system prompt constant in backend/app/services/chat.py per tool-specifications.md
- [x] T031 [US1] Implement create_tools_for_user factory function that creates tools bound to user context
- [x] T032 [US1] Implement ChatService.process_message method using OpenAI Agents SDK (Agent + Runner.run_sync)
- [x] T033 [US1] Implement POST /api/chat endpoint in backend/app/routers/chat.py calling ChatService.process_message
- [x] T034 [US1] Add error handling for OpenAI API failures (return friendly error message per spec)

### Implementation for User Story 1 - Frontend

- [x] T035 [P] [US1] Create frontend/src/components/chat/MessageList.tsx to display list of messages
- [x] T036 [P] [US1] Create frontend/src/components/chat/MessageItem.tsx to render individual message bubble (user right, assistant left)
- [x] T037 [P] [US1] Create frontend/src/components/chat/ChatInput.tsx with input field and send button
- [x] T038 [US1] Implement useChat.sendMessage to POST to /api/chat with JWT and update messages state
- [x] T039 [US1] Add optimistic UI update (show user message immediately before API response)
- [x] T040 [US1] Add loading indicator (typing dots) while waiting for AI response
- [x] T041 [US1] Connect ChatWindow to useChat hook (MessageList, ChatInput, loading state)
- [x] T042 [US1] Create frontend/src/components/chat/index.ts to export all chat components

**Checkpoint**: Full chat flow working - user sends message, AI responds, tasks can be created/listed via natural language

---

## Phase 6: User Story 6 - Conversation History Persistence (Priority: P3)

**Goal**: Conversation history persists across page refresh

**Independent Test**: Send messages, refresh page, reopen chat, verify previous messages appear.

### Implementation for User Story 6

- [x] T043 [US6] Implement GET /api/chat/history endpoint in backend/app/routers/chat.py
- [x] T044 [US6] Implement useChat.loadHistory to fetch conversation history on chat open
- [x] T045 [US6] Call loadHistory when ChatWindow opens (useEffect in ChatWidget)
- [x] T046 [US6] Implement DELETE /api/chat/history endpoint in backend/app/routers/chat.py
- [x] T047 [US6] Implement useChat.clearHistory to call delete endpoint and reset messages state
- [x] T048 [US6] Add "Clear history" button to ChatWindow header (optional, if space allows)

**Checkpoint**: Messages persist in database and reload on chat open

---

## Phase 7: User Story 3 - Complete Task via Chat (Priority: P2)

**Goal**: User can mark tasks complete via natural language

**Independent Test**: Have a task, say "Mark [task] as done", verify task completed in task list.

### Implementation for User Story 3

- [x] T049 [US3] Verify complete_task tool handles partial title matching (already in T026 + T029)
- [x] T050 [US3] Add clarification response when multiple tasks match in complete_task tool
- [x] T051 [US3] Manual verification: test "Mark buy groceries as done" flow end-to-end

**Checkpoint**: Task completion via chat working with proper error handling

---

## Phase 8: User Story 4 - Delete Task via Chat (Priority: P2)

**Goal**: User can delete tasks via natural language

**Independent Test**: Have a task, say "Delete [task]", verify task removed from task list.

### Implementation for User Story 4

- [x] T052 [US4] Verify delete_task tool handles partial title matching (already in T027 + T029)
- [x] T053 [US4] Add clarification response when multiple tasks match in delete_task tool
- [x] T054 [US4] Manual verification: test "Delete old task" flow end-to-end

**Checkpoint**: Task deletion via chat working with proper error handling

---

## Phase 9: User Story 5 - Update Task via Chat (Priority: P2)

**Goal**: User can modify task title/description via natural language

**Independent Test**: Have a task, say "Change [task] to [new title]", verify task updated.

### Implementation for User Story 5

- [x] T055 [US5] Verify update_task tool handles partial title matching and allows title/description updates (already in T028 + T029)
- [x] T056 [US5] Add clarification response when multiple tasks match in update_task tool
- [x] T057 [US5] Manual verification: test "Change buy milk to buy almond milk" flow end-to-end

**Checkpoint**: Task updates via chat working with proper error handling

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: UI polish, error handling, and integration verification

- [x] T058 Apply professional SaaS styling to chat components (colors matching Phase 2 theme)
- [x] T059 [P] Add responsive design for mobile chat widget (full-screen on mobile)
- [x] T060 [P] Add keyboard shortcuts (Enter to send, Escape to close)
- [x] T061 Add scroll-to-bottom behavior when new messages arrive
- [x] T062 Add character limit warning for messages approaching 2000 chars
- [x] T063 Verify task operations via chat reflect immediately in Phase 2 task list UI
- [x] T064 Run full integration test: create -> list -> complete -> delete via chat
- [x] T065 Verify no interference with existing Phase 2 task buttons/functionality

**Checkpoint**: Production-ready chat widget integrated with Phase 2

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - can start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all user stories
- **Phase 3 (US7)**: Depends on Phase 2 - Security first
- **Phase 4 (US2)**: Depends on Phase 2 + Phase 3 - UI foundation
- **Phase 5 (US1)**: Depends on Phase 4 - Core chat functionality (MVP)
- **Phase 6 (US6)**: Depends on Phase 5 - Persistence
- **Phase 7-9 (US3-5)**: Depend on Phase 5 - Tool refinements (can run in parallel)
- **Phase 10 (Polish)**: Depends on all user stories

### User Story Dependencies

| Story | Priority | Dependencies | Can Parallelize With |
|-------|----------|--------------|---------------------|
| US7 | P1 | Phase 2 | None (security first) |
| US2 | P1 | US7 | None (UI before messaging) |
| US1 | P1 | US2 | None (core feature) |
| US6 | P3 | US1 | US3, US4, US5 |
| US3 | P2 | US1 | US4, US5, US6 |
| US4 | P2 | US1 | US3, US5, US6 |
| US5 | P2 | US1 | US3, US4, US6 |

### Parallel Opportunities

**Within Phase 1:**
- T003 and T004 (model files)

**Within Phase 5 (US1):**
- T025, T026, T027, T028 (tool implementations)
- T035, T036, T037 (frontend components)

**After Phase 5:**
- US3, US4, US5, US6 can all proceed in parallel

---

## Parallel Example: Phase 5 Tools

```bash
# Launch all tool implementations in parallel:
Task: "Implement list_tasks function tool in backend/app/services/chat.py"
Task: "Implement complete_task function tool in backend/app/services/chat.py"
Task: "Implement delete_task function tool in backend/app/services/chat.py"
Task: "Implement update_task function tool in backend/app/services/chat.py"
```

---

## Implementation Strategy

### MVP First (User Stories 7 + 2 + 1)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US7 (Auth Guard)
4. Complete Phase 4: US2 (Open/Close Widget)
5. Complete Phase 5: US1 (Send/Receive Messages)
6. **STOP and VALIDATE**: Test core chat flow independently
7. Deploy/demo if ready - THIS IS THE MVP

### Incremental Delivery

After MVP:
1. Add US6 (History Persistence) → Test independently
2. Add US3 (Complete Task) → Test independently
3. Add US4 (Delete Task) → Test independently
4. Add US5 (Update Task) → Test independently
5. Add Polish phase → Final integration test

### Task Count Summary

| Phase | User Story | Task Count |
|-------|------------|------------|
| 1 | Setup | 6 |
| 2 | Foundational | 8 |
| 3 | US7 (Auth) | 3 |
| 4 | US2 (Widget) | 6 |
| 5 | US1 (Chat) | 19 |
| 6 | US6 (History) | 6 |
| 7 | US3 (Complete) | 3 |
| 8 | US4 (Delete) | 3 |
| 9 | US5 (Update) | 3 |
| 10 | Polish | 8 |
| **Total** | | **65** |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Phase 2 task CRUD operations are reused via existing routers (no duplication)
