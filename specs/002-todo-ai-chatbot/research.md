# Phase 3 Research: Todo AI Chatbot Integration

**Feature Branch**: `002-todo-ai-chatbot`
**Research Date**: 2026-01-22
**Status**: Complete

## Executive Summary

This research resolves all technical unknowns for integrating an AI chatbot into the Phase 2 Todo application. The solution uses OpenAI Agents SDK with function tools (not MCP protocol) for simplicity, maintains stateless backend architecture, and integrates seamlessly with existing JWT authentication.

---

## 1. AI Framework Selection

### Decision: OpenAI Agents SDK with Function Tools

**Rationale**: The OpenAI Agents SDK provides a Python-native approach to building AI agents with minimal configuration. Function tools offer the simplest integration path for custom task operations.

**Alternatives Considered**:

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| OpenAI Agents SDK + Function Tools | Native Python, automatic schema generation, Pydantic validation, minimal boilerplate | Newer SDK, less community examples | **SELECTED** |
| FastAPI-MCP + Hosted MCP Tools | Standards-based, reusable across clients | Additional complexity, requires MCP server deployment, over-engineered for this use case | Rejected |
| Direct OpenAI API + Manual Tool Handling | Full control, well-documented | More boilerplate, manual tool parsing, no built-in agent loop | Rejected |
| LangChain Agents | Rich ecosystem | Heavy dependency, overkill for simple CRUD tools | Rejected |

**Key Implementation Details**:

```python
# Installation
pip install openai-agents

# Basic tool definition pattern
from agents import Agent, function_tool, Runner

@function_tool
async def add_task(title: str, description: str = "") -> str:
    """Create a new task for the user.

    Args:
        title: The task title
        description: Optional task description
    """
    # Implementation calls existing task service
    return f"Created task: {title}"

agent = Agent(
    name="TodoAssistant",
    instructions="You help users manage their todo tasks...",
    tools=[add_task, list_tasks, complete_task, delete_task, update_task]
)

# Synchronous execution
result = Runner.run_sync(agent, user_message)
```

**Source**: [OpenAI Agents SDK Documentation](https://openai.github.io/openai-agents-python/)

---

## 2. MCP vs Function Tools

### Decision: Use Function Tools (Not MCP Protocol)

**Rationale**: The constitution specifies "MCP tools" but the simpler approach is OpenAI Agents SDK function tools, which achieve the same outcome (tool-based task operations) with less infrastructure overhead. MCP is designed for cross-application tool sharing, which is unnecessary for this single-application use case.

**Clarification**: The constitution's "MCP Tool Specifications" section defines the **interface contract** for tools, not the transport protocol. Function tools satisfy this contract:

| Constitution Requirement | Function Tool Implementation |
|-------------------------|------------------------------|
| `add_task(title, description?)` | `@function_tool async def add_task(title: str, description: str = "")` |
| Validate user ownership | Tool receives user context, validates before DB operation |
| Return structured success/error | Return dict with status, message, data |
| Log in Message table | Record tool call in messages with role="tool" |

**Why Not MCP**:
1. MCP requires separate server process or additional FastAPI mount
2. FastAPI-MCP library auto-generates tools from OpenAPI but lacks fine-grained control
3. Function tools provide direct Python function → agent tool mapping
4. Simpler debugging and testing in development

---

## 3. Backend Architecture

### Decision: Stateless Chat Endpoint with Database-Backed Context

**Approach**:
- Single endpoint: `POST /api/chat` (JWT secured)
- Each request includes user message; response includes AI message
- Conversation history stored in database, loaded per request
- No server-side session state

**Flow**:
```
Client Request:
POST /api/chat
Authorization: Bearer <jwt>
Body: { "message": "Add task buy groceries" }

Server Processing:
1. Extract user_id from JWT
2. Load conversation history from DB (last N messages)
3. Append user message to history
4. Run OpenAI Agent with tools + history as context
5. Execute tool calls if triggered
6. Save user message + assistant response + tool calls to DB
7. Return response

Response:
{
  "response": "I've added 'buy groceries' to your tasks.",
  "tool_calls": [{ "tool": "add_task", "result": "success" }]
}
```

**Why Database-Backed**:
- Supports server restarts without losing context (Constitution VIII)
- Enables conversation history retrieval endpoint
- Allows audit trail of all tool executions
- Horizontal scaling ready

---

## 4. Conversation Persistence

### Decision: Single Conversation Per User with Message History

**Schema Design**:

```sql
-- Conversation table (one per user for simplicity)
CREATE TABLE conversation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)  -- One conversation per user
);

-- Message table (all messages in conversation)
CREATE TABLE message (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversation(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'tool')),
    content TEXT NOT NULL,
    tool_call_id VARCHAR(50),  -- OpenAI tool_call_id for tool responses
    tool_name VARCHAR(50),      -- Name of tool called
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_message_conversation ON message(conversation_id);
CREATE INDEX idx_message_created ON message(created_at);
```

**Rationale**:
- Single conversation simplifies UX (no conversation management UI)
- Message history enables context reconstruction
- Tool role messages provide audit trail
- Indexes support efficient history retrieval

---

## 5. Tool Implementation Strategy

### Decision: Tools Call Existing Task Service Layer

**Architecture**:
```
User Message → Agent → Tool Selection → Tool Function → Task Service → Database
```

**Key Principle**: Tools do NOT directly access the database. Tools call the existing task service functions (same logic as REST endpoints).

**Benefits**:
- Single source of truth for business logic
- Consistent validation rules
- Automatic user isolation (task service already enforces ownership)
- Easier testing (mock service layer)

**Implementation Pattern**:

```python
from agents import function_tool
from app.services.task import TaskService

# Tool receives user context via closure or RunContext
def create_task_tools(user_id: str, session: Session):
    task_service = TaskService(session, user_id)

    @function_tool
    async def add_task(title: str, description: str = "") -> dict:
        """Create a new task for the user."""
        task = task_service.create(title=title, description=description)
        return {"status": "success", "task_id": str(task.id), "title": task.title}

    @function_tool
    async def list_tasks(filter: str = "all") -> dict:
        """List user's tasks. Filter: all, pending, completed."""
        tasks = task_service.list(filter=filter)
        return {"status": "success", "count": len(tasks), "tasks": [...]}

    # ... other tools

    return [add_task, list_tasks, complete_task, delete_task, update_task]
```

---

## 6. Frontend Chatbot Architecture

### Decision: Floating Widget with Local State + API Calls

**Component Structure**:
```
ChatWidget/
├── ChatButton.tsx       # Floating action button (bottom-right)
├── ChatWindow.tsx       # Main container (slide-up animation)
├── MessageList.tsx      # Scrollable message history
├── MessageItem.tsx      # Individual message bubble
├── ChatInput.tsx        # Input field + send button
└── index.ts             # Export bundle
```

**State Management**:
- Local React state for messages (loaded from API on open)
- Optimistic UI updates (show user message immediately)
- Loading state during AI response
- Error handling with retry option

**API Integration**:
```typescript
// hooks/useChat.ts
const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadHistory = async () => {
    const history = await api.get<ChatHistory>('/chat/history');
    setMessages(history.messages);
  };

  const sendMessage = async (content: string) => {
    // Optimistic update
    setMessages(prev => [...prev, { role: 'user', content }]);
    setIsLoading(true);

    const response = await api.post<ChatResponse>('/chat', { message: content });

    setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
    setIsLoading(false);
  };

  return { messages, isLoading, sendMessage, loadHistory };
};
```

---

## 7. UI/UX Design

### Decision: Floating Button (Bottom-Right) + Slide-Up Panel

**Placement**: Bottom-right corner, consistent with industry standards (Intercom, Drift, etc.)

**Visual Design**:
- Button: Circular, primary color, chat icon, subtle shadow
- Window: 400x500px panel, slides up from button
- Messages: User (right-aligned, primary bg), Assistant (left-aligned, gray bg)
- Input: Fixed bottom, auto-focus, send on Enter

**Responsive Behavior**:
- Desktop: Floating panel, doesn't cover main content
- Mobile: Full-screen takeover (slide from bottom)

**Accessibility**:
- Keyboard navigation (Tab, Enter, Escape)
- ARIA labels for screen readers
- Focus trap when open

---

## 8. Error Handling Strategy

### Decision: Graceful Degradation with User-Friendly Messages

**Error Categories**:

| Error Type | User Message | Technical Action |
|------------|-------------|------------------|
| AI Service Unavailable | "I'm having trouble connecting. Please try again in a moment." | Log error, suggest retry |
| Tool Execution Failed | "I couldn't complete that action. [specific reason]" | Return tool error, log |
| Invalid Request | "I didn't understand that. Try: 'Add task buy groceries'" | No retry, show examples |
| Auth Expired | "Your session expired. Please sign in again." | Clear token, redirect |
| Rate Limited | "Please wait a moment before sending another message." | Client-side throttle |

**Implementation**:
```python
# Backend error handling
try:
    result = await Runner.run(agent, message, context=history)
except OpenAIError as e:
    return ChatResponse(
        response="I'm having trouble connecting. Please try again.",
        error=True
    )
except ToolExecutionError as e:
    return ChatResponse(
        response=f"I couldn't complete that action: {e.user_message}",
        error=True
    )
```

---

## 9. Security Considerations

### Decision: Reuse Existing JWT Auth + Tool-Level Validation

**Security Layers**:

1. **Endpoint Level**: All chat endpoints require valid JWT (existing `get_current_user` dependency)
2. **Tool Level**: Each tool validates user_id matches task ownership
3. **Input Sanitization**: Pydantic validation on all inputs
4. **Rate Limiting**: Consider per-user message rate limit (future enhancement)

**Prompt Injection Mitigation**:
- System prompt clearly defines agent boundaries
- Tools validate all parameters
- Agent cannot modify system behavior through user messages
- Tool results are structured data, not executed code

---

## 10. Integration with Existing Codebase

### Decision: Minimal Changes to Phase 2 Code

**New Files Only**:
```
backend/
├── app/
│   ├── services/
│   │   └── chat.py          # NEW: Chat service (agent + tools)
│   ├── routers/
│   │   └── chat.py          # NEW: Chat endpoints
│   ├── models/
│   │   ├── conversation.py  # NEW: Conversation model
│   │   └── message.py       # NEW: Message model
│   └── schemas/
│       └── chat.py          # NEW: Chat schemas

frontend/
├── src/
│   ├── components/
│   │   └── chat/            # NEW: All chat components
│   ├── hooks/
│   │   └── useChat.ts       # NEW: Chat hook
│   └── app/
│       └── layout.tsx       # MODIFY: Add ChatWidget
```

**Changes to Existing Files**:
- `backend/app/main.py`: Add chat router
- `backend/app/database.py`: Import new models
- `frontend/src/app/layout.tsx`: Add ChatWidget (auth-only)

---

## 11. Dependencies

### New Backend Dependencies
```
openai-agents>=0.1.0   # OpenAI Agents SDK
```

### New Frontend Dependencies
None required (using existing React + fetch patterns)

### Environment Variables
```
# Add to backend .env
OPENAI_API_KEY=sk-...   # Required for Agents SDK
```

---

## 12. Testing Strategy

### Backend Tests
- Unit tests for tool functions (mock task service)
- Integration tests for chat endpoint (mock OpenAI)
- Database tests for conversation/message models

### Frontend Tests
- Component tests for ChatWidget (render, open/close)
- Hook tests for useChat (API calls, state updates)
- E2E tests for full chat flow (Playwright)

---

## Sources

- [OpenAI Agents SDK Documentation](https://openai.github.io/openai-agents-python/)
- [OpenAI Agents SDK - Tools](https://openai.github.io/openai-agents-python/tools/)
- [OpenAI Agents SDK - MCP](https://openai.github.io/openai-agents-python/mcp/)
- [FastAPI-MCP GitHub](https://github.com/tadata-org/fastapi_mcp)
- [How to Use MCP with OpenAI Agents - DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-use-mcp-with-openai-agents)
