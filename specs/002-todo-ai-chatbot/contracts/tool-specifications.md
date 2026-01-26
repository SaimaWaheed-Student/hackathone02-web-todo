# AI Agent Tool Specifications

**Feature Branch**: `002-todo-ai-chatbot`
**Date**: 2026-01-22
**Status**: Design Complete

## Overview

This document defines the tool interfaces for the AI chatbot agent. Tools bridge natural language intent to task operations via the existing task service layer.

---

## Tool Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        AI Agent (OpenAI)                         │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    System Prompt                         │    │
│  │  "You are a helpful todo assistant..."                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  │ add_task │  │list_tasks│  │ complete │  │  delete  │  │  update  │
│  │          │  │          │  │  _task   │  │  _task   │  │  _task   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
└───────┼─────────────┼─────────────┼─────────────┼─────────────┼─────┘
        │             │             │             │             │
        ▼             ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Task Service Layer                          │
│                (existing Phase 2 implementation)                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tool Definitions

### 1. add_task

**Purpose**: Create a new task for the authenticated user.

**Function Signature**:
```python
@function_tool
async def add_task(
    title: str,
    description: str = ""
) -> dict:
    """Create a new task for the user.

    Args:
        title: The task title (required, 1-200 characters)
        description: Optional task description (0-1000 characters)

    Returns:
        dict with status, task_id, and title
    """
```

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "minLength": 1,
      "maxLength": 200,
      "description": "The task title"
    },
    "description": {
      "type": "string",
      "maxLength": 1000,
      "default": "",
      "description": "Optional task description"
    }
  },
  "required": ["title"]
}
```

**Output Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": { "type": "string", "enum": ["success", "error"] },
    "task_id": { "type": "string", "format": "uuid" },
    "title": { "type": "string" },
    "error_message": { "type": "string" }
  },
  "required": ["status"]
}
```

**Example Invocations**:
| User Message | Tool Call | Result |
|--------------|-----------|--------|
| "Add task buy groceries" | `add_task(title="buy groceries")` | `{"status": "success", "task_id": "...", "title": "buy groceries"}` |
| "Create a task: Call mom with description Remember birthday" | `add_task(title="Call mom", description="Remember birthday")` | `{"status": "success", ...}` |
| "Add task " (empty) | N/A | Tool not called, agent asks for task name |

---

### 2. list_tasks

**Purpose**: Retrieve the user's tasks with optional filtering.

**Function Signature**:
```python
@function_tool
async def list_tasks(
    filter: str = "all"
) -> dict:
    """List user's tasks.

    Args:
        filter: Filter tasks by status. Options: "all", "pending", "completed"

    Returns:
        dict with status, count, and tasks array
    """
```

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "filter": {
      "type": "string",
      "enum": ["all", "pending", "completed"],
      "default": "all",
      "description": "Filter tasks by completion status"
    }
  }
}
```

**Output Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": { "type": "string", "enum": ["success", "error"] },
    "count": { "type": "integer" },
    "tasks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "format": "uuid" },
          "title": { "type": "string" },
          "description": { "type": "string" },
          "completed": { "type": "boolean" },
          "created_at": { "type": "string", "format": "date-time" }
        }
      }
    },
    "error_message": { "type": "string" }
  },
  "required": ["status"]
}
```

**Example Invocations**:
| User Message | Tool Call | Result |
|--------------|-----------|--------|
| "Show my tasks" | `list_tasks()` | `{"status": "success", "count": 3, "tasks": [...]}` |
| "What tasks are pending?" | `list_tasks(filter="pending")` | `{"status": "success", "count": 2, "tasks": [...]}` |
| "Show completed tasks" | `list_tasks(filter="completed")` | `{"status": "success", "count": 1, "tasks": [...]}` |

---

### 3. complete_task

**Purpose**: Mark a task as completed.

**Function Signature**:
```python
@function_tool
async def complete_task(
    task_identifier: str
) -> dict:
    """Mark a task as completed.

    Args:
        task_identifier: Task ID (UUID) or task title to match

    Returns:
        dict with status, task_id, and title
    """
```

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "task_identifier": {
      "type": "string",
      "description": "Task ID (UUID) or title to find and complete"
    }
  },
  "required": ["task_identifier"]
}
```

**Output Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": { "type": "string", "enum": ["success", "error"] },
    "task_id": { "type": "string", "format": "uuid" },
    "title": { "type": "string" },
    "error_message": { "type": "string" }
  },
  "required": ["status"]
}
```

**Task Resolution Logic**:
1. If `task_identifier` is a valid UUID, find by ID
2. Otherwise, search by title (case-insensitive, partial match)
3. If multiple matches, return error asking for clarification
4. If no match, return error with suggestion

**Example Invocations**:
| User Message | Tool Call | Result |
|--------------|-----------|--------|
| "Mark buy groceries as done" | `complete_task(task_identifier="buy groceries")` | `{"status": "success", ...}` |
| "Complete task 550e8400-..." | `complete_task(task_identifier="550e8400-...")` | `{"status": "success", ...}` |
| "Complete it" | N/A | Agent asks "Which task?" |
| "Complete xyz" | `complete_task(task_identifier="xyz")` | `{"status": "error", "error_message": "No task found matching 'xyz'"}` |

---

### 4. delete_task

**Purpose**: Permanently remove a task.

**Function Signature**:
```python
@function_tool
async def delete_task(
    task_identifier: str
) -> dict:
    """Delete a task permanently.

    Args:
        task_identifier: Task ID (UUID) or task title to match

    Returns:
        dict with status and deleted task info
    """
```

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "task_identifier": {
      "type": "string",
      "description": "Task ID (UUID) or title to find and delete"
    }
  },
  "required": ["task_identifier"]
}
```

**Output Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": { "type": "string", "enum": ["success", "error"] },
    "task_id": { "type": "string", "format": "uuid" },
    "title": { "type": "string" },
    "error_message": { "type": "string" }
  },
  "required": ["status"]
}
```

**Example Invocations**:
| User Message | Tool Call | Result |
|--------------|-----------|--------|
| "Delete buy groceries" | `delete_task(task_identifier="buy groceries")` | `{"status": "success", ...}` |
| "Remove the old task" | `delete_task(task_identifier="old task")` | `{"status": "success", ...}` |
| "Delete all tasks" | N/A | Agent clarifies: "I can only delete one task at a time..." |

---

### 5. update_task

**Purpose**: Modify an existing task's title or description.

**Function Signature**:
```python
@function_tool
async def update_task(
    task_identifier: str,
    new_title: str = None,
    new_description: str = None
) -> dict:
    """Update a task's title or description.

    Args:
        task_identifier: Task ID (UUID) or current title to match
        new_title: New title for the task (optional)
        new_description: New description for the task (optional)

    Returns:
        dict with status and updated task info
    """
```

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "task_identifier": {
      "type": "string",
      "description": "Task ID (UUID) or current title to find"
    },
    "new_title": {
      "type": "string",
      "maxLength": 200,
      "description": "New title for the task"
    },
    "new_description": {
      "type": "string",
      "maxLength": 1000,
      "description": "New description for the task"
    }
  },
  "required": ["task_identifier"]
}
```

**Output Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": { "type": "string", "enum": ["success", "error"] },
    "task_id": { "type": "string", "format": "uuid" },
    "title": { "type": "string" },
    "description": { "type": "string" },
    "error_message": { "type": "string" }
  },
  "required": ["status"]
}
```

**Example Invocations**:
| User Message | Tool Call | Result |
|--------------|-----------|--------|
| "Change buy groceries to buy organic groceries" | `update_task(task_identifier="buy groceries", new_title="buy organic groceries")` | `{"status": "success", ...}` |
| "Add description 'for the party' to buy groceries" | `update_task(task_identifier="buy groceries", new_description="for the party")` | `{"status": "success", ...}` |
| "Rename task" | N/A | Agent asks "Which task and what's the new name?" |

---

## System Prompt

```text
You are a helpful todo assistant. You help users manage their tasks through natural conversation.

CAPABILITIES:
- Add new tasks (with optional descriptions)
- List tasks (all, pending, or completed)
- Mark tasks as complete
- Delete tasks
- Update task titles or descriptions

BEHAVIOR RULES:
1. Be friendly but concise
2. Always confirm what action you took
3. If a command is ambiguous (e.g., "complete it"), ask for clarification
4. Never claim to have done something you didn't do
5. If a task operation fails, explain why and suggest alternatives
6. When listing tasks, format them clearly with numbers
7. For destructive actions (delete), include the task name in confirmation

RESPONSE STYLE:
- Keep responses under 100 words unless listing multiple tasks
- Use friendly, professional tone
- Include task details in confirmations (e.g., "I've added 'buy groceries' to your tasks")

LIMITATIONS:
- You can only manage tasks for the current user
- You cannot set due dates or priorities (not supported yet)
- You cannot batch delete or batch complete tasks
```

---

## Error Handling Matrix

| Error Scenario | Tool Response | Agent Response to User |
|----------------|---------------|------------------------|
| Task not found | `{"status": "error", "error_message": "No task found matching 'xyz'"}` | "I couldn't find a task called 'xyz'. Would you like me to show your current tasks?" |
| Multiple matches | `{"status": "error", "error_message": "Multiple tasks match 'buy'. Please be more specific."}` | "I found multiple tasks with 'buy' in the name. Which one did you mean: 'buy groceries' or 'buy milk'?" |
| Empty title | Tool not called | "Please provide a task name. For example: 'Add task buy groceries'" |
| Service unavailable | `{"status": "error", "error_message": "Database connection failed"}` | "I'm having trouble accessing your tasks right now. Please try again in a moment." |
| Title too long | `{"status": "error", "error_message": "Title must be under 200 characters"}` | "That title is too long. Could you shorten it to under 200 characters?" |

---

## Security Considerations

### User Isolation
- All tools receive `user_id` from the authenticated session
- Tools never accept `user_id` as a parameter (prevents impersonation)
- Task service validates ownership before any operation

### Input Validation
- Title: 1-200 characters, trimmed
- Description: 0-1000 characters
- Filter: strict enum validation
- Task identifier: UUID or string (sanitized)

### Audit Trail
- Every tool call is logged in the Message table
- Tool results stored for debugging and compliance
- No sensitive data in tool responses

---

## Implementation Notes

### Tool Context Injection

Tools need access to user context. Use closure pattern:

```python
def create_tools_for_user(user_id: str, session: Session):
    task_service = TaskService(session, user_id)

    @function_tool
    async def add_task(title: str, description: str = "") -> dict:
        # task_service is captured in closure
        task = task_service.create(title=title, description=description)
        return {"status": "success", "task_id": str(task.id), "title": task.title}

    # ... other tools ...

    return [add_task, list_tasks, complete_task, delete_task, update_task]
```

### Task Resolution Helper

```python
def resolve_task(task_service: TaskService, identifier: str) -> Task | list[Task] | None:
    """Resolve task by ID or title.

    Returns:
        - Single Task if exact match found
        - List of Tasks if multiple matches
        - None if no matches
    """
    # Try UUID first
    try:
        uuid_obj = UUID(identifier)
        return task_service.get_by_id(uuid_obj)
    except ValueError:
        pass

    # Search by title
    matches = task_service.search_by_title(identifier)
    if len(matches) == 1:
        return matches[0]
    elif len(matches) > 1:
        return matches
    return None
```

---

## Constitution Compliance

| Principle | Tool Compliance |
|-----------|-----------------|
| VII. AI Reliability | Tools return structured responses, no hallucinated actions |
| IV. User Isolation | All operations scoped to authenticated user_id |
| III. Security | Input validation, no user_id in parameters |
| VIII. Stateless Recovery | Tool calls logged in database |
