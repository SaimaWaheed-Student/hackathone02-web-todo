# Phase 3 Quickstart: Todo AI Chatbot

**Feature Branch**: `002-todo-ai-chatbot`
**Date**: 2026-01-22

## Prerequisites

Before implementing Phase 3, ensure:

- [ ] Phase 2 backend is running (`backend/` directory)
- [ ] Phase 2 frontend is running (`frontend/` directory)
- [ ] PostgreSQL database (Neon) is accessible
- [ ] Valid OpenAI API key with GPT-4 access

## Environment Setup

### Backend (.env additions)

Add to `backend/.env`:

```bash
# OpenAI Configuration (Phase 3)
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### Install New Dependencies

```bash
# Backend
cd backend
pip install openai-agents
```

No new frontend dependencies required.

---

## File Structure Overview

### New Backend Files

```
backend/app/
├── models/
│   ├── conversation.py    # Conversation SQLModel
│   └── message.py         # Message SQLModel
├── schemas/
│   └── chat.py            # ChatRequest, ChatResponse, etc.
├── services/
│   └── chat.py            # ChatService (agent + tools)
└── routers/
    └── chat.py            # Chat API endpoints
```

### New Frontend Files

```
frontend/src/
├── components/
│   └── chat/
│       ├── ChatWidget.tsx     # Main container
│       ├── ChatButton.tsx     # Floating button
│       ├── ChatWindow.tsx     # Chat panel
│       ├── MessageList.tsx    # Message display
│       ├── MessageItem.tsx    # Single message
│       ├── ChatInput.tsx      # Input field
│       └── index.ts           # Exports
└── hooks/
    └── useChat.ts             # Chat state management
```

### Modified Files

```
backend/app/main.py          # Add chat router
backend/app/database.py      # Import new models
frontend/src/app/layout.tsx  # Add ChatWidget
```

---

## Implementation Order

### Phase 3.1: Backend Models & Database

1. Create `backend/app/models/conversation.py`
2. Create `backend/app/models/message.py`
3. Update `backend/app/models/__init__.py`
4. Run database migration (SQLModel creates tables)

### Phase 3.2: Backend Schemas

1. Create `backend/app/schemas/chat.py`
   - ChatRequest
   - ChatResponse
   - MessageResponse
   - ChatHistoryResponse

### Phase 3.3: Chat Service & Tools

1. Create `backend/app/services/chat.py`
   - Tool definitions (add_task, list_tasks, etc.)
   - ChatService class
   - Agent configuration

### Phase 3.4: Chat API Routes

1. Create `backend/app/routers/chat.py`
   - POST /api/chat
   - GET /api/chat/history
   - DELETE /api/chat/history

2. Update `backend/app/main.py`
   - Import and include chat router

### Phase 3.5: Frontend Chat Components

1. Create chat component files
2. Create useChat hook
3. Add ChatWidget to layout (auth-only)

### Phase 3.6: Integration & Testing

1. End-to-end testing
2. Error handling verification
3. UI polish

---

## Quick Verification Tests

### Backend Health Check

```bash
# After implementing chat endpoints
curl -X POST http://localhost:8000/api/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

Expected response:
```json
{
  "response": "Hello! I'm your todo assistant. I can help you...",
  "tool_calls": []
}
```

### Task Creation Test

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Add a task to buy groceries"}'
```

Expected response:
```json
{
  "response": "I've added 'buy groceries' to your tasks.",
  "tool_calls": [{"tool": "add_task", "result": "success", "task_id": "..."}]
}
```

### History Retrieval Test

```bash
curl -X GET http://localhost:8000/api/chat/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Key Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| AI Framework | OpenAI Agents SDK | Native Python, function tools, minimal setup |
| Tool Protocol | Function Tools (not MCP) | Simpler for single-app use case |
| Chat State | Database-backed | Stateless backend, survives restarts |
| Conversation Model | One per user | Simpler UX, no conversation management |
| Tool Implementation | Via Task Service | Reuse existing business logic |

---

## Common Issues & Solutions

### "OpenAI API key not found"
- Ensure `OPENAI_API_KEY` is set in `backend/.env`
- Restart backend after adding key

### "Module 'agents' not found"
- Run `pip install openai-agents` in backend directory
- Check virtual environment is activated

### "CORS error on chat request"
- Chat endpoints should use same CORS config as task endpoints
- Verify `allow_origins` in `main.py`

### "JWT token expired during chat"
- Frontend should handle 401 and redirect to login
- Clear chat state on logout

---

## Next Steps

After quickstart verification:

1. Run `/sp.tasks` to generate detailed implementation tasks
2. Follow task order (dependencies respected)
3. Test each task before proceeding
4. Create PHR records as you go
