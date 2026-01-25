"""Chat service for AI-powered task management.

Implements OpenRouter API integration with function tools for task operations.
"""

import json
from datetime import datetime
from typing import List, Optional, Union
from uuid import UUID
from sqlmodel import Session, select
from openai import AsyncOpenAI

from app.config import get_settings
from app.models.conversation import Conversation
from app.models.message import Message, MessageRole
from app.models.task import Task
from app.models.user import User
from app.schemas.chat import ChatResponse, ToolCallResult

# Get settings
settings = get_settings()

# Initialize OpenRouter client (OpenAI-compatible)
openrouter_client = AsyncOpenAI(
    base_url=settings.openrouter_base_url,
    api_key=settings.openrouter_api_key,
    default_headers={
        "HTTP-Referer": "https://todo-app.com",
        "X-Title": "Todo AI Assistant"
    }
)

# System prompt for the AI agent
SYSTEM_PROMPT = """You are a helpful todo assistant. You help users manage their tasks through natural conversation.

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
- You cannot batch delete or batch complete tasks"""

# Tool definitions for OpenAI-compatible function calling
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "add_task",
            "description": "Create a new task for the user",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {
                        "type": "string",
                        "description": "The task title (required, 1-200 characters)"
                    },
                    "description": {
                        "type": "string",
                        "description": "Optional task description (0-1000 characters)"
                    }
                },
                "required": ["title"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "list_tasks",
            "description": "List user's tasks",
            "parameters": {
                "type": "object",
                "properties": {
                    "filter": {
                        "type": "string",
                        "enum": ["all", "pending", "completed"],
                        "description": "Filter tasks by status"
                    }
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "complete_task",
            "description": "Mark a task as completed",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_identifier": {
                        "type": "string",
                        "description": "Task ID (UUID) or task title to match"
                    }
                },
                "required": ["task_identifier"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "delete_task",
            "description": "Delete a task permanently",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_identifier": {
                        "type": "string",
                        "description": "Task ID (UUID) or task title to match"
                    }
                },
                "required": ["task_identifier"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_task",
            "description": "Update a task's title or description",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_identifier": {
                        "type": "string",
                        "description": "Task ID (UUID) or current title to match"
                    },
                    "new_title": {
                        "type": "string",
                        "description": "New title for the task"
                    },
                    "new_description": {
                        "type": "string",
                        "description": "New description for the task"
                    }
                },
                "required": ["task_identifier"]
            }
        }
    }
]


class ChatService:
    """Service for managing chat conversations and AI interactions."""

    def __init__(self, session: Session, user: User):
        """Initialize chat service with database session and user context.

        Args:
            session: SQLModel database session
            user: Authenticated user
        """
        self.session = session
        self.user = user

    def get_or_create_conversation(self) -> Conversation:
        """Get existing conversation for user or create new one.

        Returns:
            Conversation instance for the user
        """
        conversation = self.session.exec(
            select(Conversation).where(Conversation.user_id == self.user.id)
        ).first()

        if not conversation:
            conversation = Conversation(user_id=self.user.id)
            self.session.add(conversation)
            self.session.commit()
            self.session.refresh(conversation)

        return conversation

    def get_recent_messages(
        self,
        conversation_id: UUID,
        limit: int = 20
    ) -> List[Message]:
        """Load recent messages from conversation for context window.

        Args:
            conversation_id: UUID of conversation
            limit: Maximum number of messages to return

        Returns:
            List of messages in chronological order (oldest first)
        """
        messages = self.session.exec(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.desc())
            .limit(limit)
        ).all()
        # Reverse to get chronological order
        return list(reversed(messages))

    def save_chat_turn(
        self,
        conversation_id: UUID,
        user_message: str,
        assistant_response: str,
        tool_calls: Optional[List[dict]] = None
    ) -> List[Message]:
        """Save a complete chat turn (user message + tool calls + assistant response).

        Args:
            conversation_id: UUID of conversation
            user_message: User's input text
            assistant_response: AI's response text
            tool_calls: Optional list of tool execution results

        Returns:
            List of created Message instances
        """
        messages = []

        # Save user message
        user_msg = Message(
            conversation_id=conversation_id,
            role=MessageRole.USER,
            content=user_message
        )
        messages.append(user_msg)

        # Save tool calls (if any)
        if tool_calls:
            for tc in tool_calls:
                tool_msg = Message(
                    conversation_id=conversation_id,
                    role=MessageRole.TOOL,
                    content=tc.get("result_content", ""),
                    tool_call_id=tc.get("id"),
                    tool_name=tc.get("name")
                )
                messages.append(tool_msg)

        # Save assistant response
        assistant_msg = Message(
            conversation_id=conversation_id,
            role=MessageRole.ASSISTANT,
            content=assistant_response
        )
        messages.append(assistant_msg)

        # Save all in single transaction
        self.session.add_all(messages)

        # Update conversation timestamp
        conversation = self.session.get(Conversation, conversation_id)
        if conversation:
            conversation.updated_at = datetime.utcnow()

        self.session.commit()
        return messages

    def get_conversation_history(
        self,
        limit: int = 50,
        before: Optional[UUID] = None
    ) -> tuple[List[Message], bool]:
        """Get conversation history with pagination.

        Args:
            limit: Maximum number of messages to return
            before: Return messages before this message ID

        Returns:
            Tuple of (messages list, has_more boolean)
        """
        conversation = self.get_or_create_conversation()

        query = select(Message).where(
            Message.conversation_id == conversation.id
        )

        if before:
            # Get the timestamp of the 'before' message
            before_msg = self.session.get(Message, before)
            if before_msg:
                query = query.where(Message.created_at < before_msg.created_at)

        # Get one extra to check if there are more
        messages = self.session.exec(
            query.order_by(Message.created_at.asc()).limit(limit + 1)
        ).all()

        has_more = len(messages) > limit
        if has_more:
            messages = messages[:limit]

        return list(messages), has_more

    def clear_conversation_history(self) -> None:
        """Delete all messages in the user's conversation."""
        conversation = self.session.exec(
            select(Conversation).where(Conversation.user_id == self.user.id)
        ).first()

        if conversation:
            messages = self.session.exec(
                select(Message).where(Message.conversation_id == conversation.id)
            ).all()
            for msg in messages:
                self.session.delete(msg)
            self.session.commit()

    def _resolve_task(self, identifier: str) -> Union[Task, List[Task], None]:
        """Resolve a task by ID or title.

        Args:
            identifier: Task ID (UUID) or title to search

        Returns:
            Single Task if exact match, list if multiple matches, None if no match
        """
        # Try UUID first
        try:
            task_uuid = UUID(identifier)
            task = self.session.exec(
                select(Task).where(
                    Task.id == task_uuid,
                    Task.user_id == self.user.id
                )
            ).first()
            if task:
                return task
        except ValueError:
            pass

        # Search by title (case-insensitive, partial match)
        search_term = identifier.lower()
        all_tasks = self.session.exec(
            select(Task).where(Task.user_id == self.user.id)
        ).all()

        matches = [t for t in all_tasks if search_term in t.title.lower()]

        if len(matches) == 1:
            return matches[0]
        elif len(matches) > 1:
            return matches
        return None

    def _execute_tool(self, tool_name: str, arguments: dict) -> str:
        """Execute a tool function and return result.

        Args:
            tool_name: Name of the tool to execute
            arguments: Tool arguments

        Returns:
            JSON string with result
        """
        if tool_name == "add_task":
            return self._add_task(
                arguments.get("title", ""),
                arguments.get("description", "")
            )
        elif tool_name == "list_tasks":
            return self._list_tasks(arguments.get("filter", "all"))
        elif tool_name == "complete_task":
            return self._complete_task(arguments.get("task_identifier", ""))
        elif tool_name == "delete_task":
            return self._delete_task(arguments.get("task_identifier", ""))
        elif tool_name == "update_task":
            return self._update_task(
                arguments.get("task_identifier", ""),
                arguments.get("new_title"),
                arguments.get("new_description")
            )
        else:
            return json.dumps({"status": "error", "error_message": f"Unknown tool: {tool_name}"})

    def _add_task(self, title: str, description: str = "") -> str:
        """Create a new task."""
        try:
            if not title or len(title.strip()) == 0:
                return json.dumps({
                    "status": "error",
                    "error_message": "Title cannot be empty"
                })

            title = title.strip()[:200]
            description = (description or "").strip()[:1000]

            task = Task(
                user_id=self.user.id,
                title=title,
                description=description if description else None
            )
            self.session.add(task)
            self.session.commit()
            self.session.refresh(task)

            return json.dumps({
                "status": "success",
                "task_id": str(task.id),
                "title": task.title
            })
        except Exception as e:
            return json.dumps({
                "status": "error",
                "error_message": str(e)
            })

    def _list_tasks(self, filter: str = "all") -> str:
        """List user's tasks."""
        try:
            query = select(Task).where(Task.user_id == self.user.id)

            if filter == "pending":
                query = query.where(Task.completed == False)
            elif filter == "completed":
                query = query.where(Task.completed == True)

            tasks = self.session.exec(
                query.order_by(Task.created_at.desc())
            ).all()

            task_list = [
                {
                    "id": str(t.id),
                    "title": t.title,
                    "description": t.description,
                    "completed": t.completed,
                    "created_at": t.created_at.isoformat()
                }
                for t in tasks
            ]

            return json.dumps({
                "status": "success",
                "count": len(task_list),
                "tasks": task_list
            })
        except Exception as e:
            return json.dumps({
                "status": "error",
                "error_message": str(e)
            })

    def _complete_task(self, task_identifier: str) -> str:
        """Mark a task as completed."""
        try:
            result = self._resolve_task(task_identifier)

            if result is None:
                return json.dumps({
                    "status": "error",
                    "error_message": f"No task found matching '{task_identifier}'"
                })

            if isinstance(result, list):
                titles = [f"'{t.title}'" for t in result[:5]]
                return json.dumps({
                    "status": "error",
                    "error_message": f"Multiple tasks match '{task_identifier}'. Please be more specific. Found: {', '.join(titles)}"
                })

            task = result
            task.completed = True
            task.updated_at = datetime.utcnow()
            self.session.add(task)
            self.session.commit()

            return json.dumps({
                "status": "success",
                "task_id": str(task.id),
                "title": task.title
            })
        except Exception as e:
            return json.dumps({
                "status": "error",
                "error_message": str(e)
            })

    def _delete_task(self, task_identifier: str) -> str:
        """Delete a task permanently."""
        try:
            result = self._resolve_task(task_identifier)

            if result is None:
                return json.dumps({
                    "status": "error",
                    "error_message": f"No task found matching '{task_identifier}'"
                })

            if isinstance(result, list):
                titles = [f"'{t.title}'" for t in result[:5]]
                return json.dumps({
                    "status": "error",
                    "error_message": f"Multiple tasks match '{task_identifier}'. Please be more specific. Found: {', '.join(titles)}"
                })

            task = result
            task_id = str(task.id)
            task_title = task.title
            self.session.delete(task)
            self.session.commit()

            return json.dumps({
                "status": "success",
                "task_id": task_id,
                "title": task_title
            })
        except Exception as e:
            return json.dumps({
                "status": "error",
                "error_message": str(e)
            })

    def _update_task(
        self,
        task_identifier: str,
        new_title: str = None,
        new_description: str = None
    ) -> str:
        """Update a task's title or description."""
        try:
            if not new_title and new_description is None:
                return json.dumps({
                    "status": "error",
                    "error_message": "Please provide new_title or new_description to update"
                })

            result = self._resolve_task(task_identifier)

            if result is None:
                return json.dumps({
                    "status": "error",
                    "error_message": f"No task found matching '{task_identifier}'"
                })

            if isinstance(result, list):
                titles = [f"'{t.title}'" for t in result[:5]]
                return json.dumps({
                    "status": "error",
                    "error_message": f"Multiple tasks match '{task_identifier}'. Please be more specific. Found: {', '.join(titles)}"
                })

            task = result

            if new_title:
                task.title = new_title.strip()[:200]
            if new_description is not None:
                task.description = new_description.strip()[:1000] if new_description else None

            task.updated_at = datetime.utcnow()
            self.session.add(task)
            self.session.commit()
            self.session.refresh(task)

            return json.dumps({
                "status": "success",
                "task_id": str(task.id),
                "title": task.title,
                "description": task.description
            })
        except Exception as e:
            return json.dumps({
                "status": "error",
                "error_message": str(e)
            })

    async def process_message(self, user_message: str) -> ChatResponse:
        """Process user message through AI and return response.

        Args:
            user_message: User's natural language input

        Returns:
            ChatResponse with AI response and any tool calls
        """
        try:
            # Get or create conversation
            conversation = self.get_or_create_conversation()

            # Load recent messages for context
            recent_messages = self.get_recent_messages(conversation.id)

            # Build conversation history for the API
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]

            for msg in recent_messages:
                if msg.role == MessageRole.USER:
                    messages.append({"role": "user", "content": msg.content})
                elif msg.role == MessageRole.ASSISTANT:
                    messages.append({"role": "assistant", "content": msg.content})

            # Add current user message
            messages.append({"role": "user", "content": user_message})

            # Call OpenRouter API
            response = await openrouter_client.chat.completions.create(
                model=settings.openrouter_model,
                messages=messages,
                tools=TOOLS,
                tool_choice="auto",
                max_tokens=1024
            )

            # Process response
            assistant_message = response.choices[0].message
            tool_call_results = []
            raw_tool_calls = []

            # Handle tool calls if present
            if assistant_message.tool_calls:
                tool_messages = []

                for tool_call in assistant_message.tool_calls:
                    tool_name = tool_call.function.name
                    try:
                        arguments = json.loads(tool_call.function.arguments)
                    except json.JSONDecodeError:
                        arguments = {}

                    # Execute the tool
                    tool_result = self._execute_tool(tool_name, arguments)

                    # Parse result for response
                    try:
                        result_data = json.loads(tool_result)
                        tool_call_results.append(ToolCallResult(
                            tool=tool_name,
                            result=result_data.get("status", "success"),
                            task_id=result_data.get("task_id"),
                            count=result_data.get("count"),
                            error_message=result_data.get("error_message")
                        ))
                    except json.JSONDecodeError:
                        pass

                    raw_tool_calls.append({
                        "id": tool_call.id,
                        "name": tool_name,
                        "result_content": tool_result
                    })

                    tool_messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": tool_result
                    })

                # Add assistant message with tool calls and tool results
                messages.append({
                    "role": "assistant",
                    "content": assistant_message.content or "",
                    "tool_calls": [
                        {
                            "id": tc.id,
                            "type": "function",
                            "function": {
                                "name": tc.function.name,
                                "arguments": tc.function.arguments
                            }
                        }
                        for tc in assistant_message.tool_calls
                    ]
                })
                messages.extend(tool_messages)

                # Get final response after tool execution
                final_response = await openrouter_client.chat.completions.create(
                    model=settings.openrouter_model,
                    messages=messages,
                    max_tokens=1024
                )
                response_text = final_response.choices[0].message.content or "Done!"
            else:
                response_text = assistant_message.content or "I processed your request."

            # Save the chat turn to database
            self.save_chat_turn(
                conversation.id,
                user_message,
                response_text,
                raw_tool_calls if raw_tool_calls else None
            )

            return ChatResponse(
                response=response_text,
                tool_calls=tool_call_results,
                error=False
            )

        except Exception as e:
            # Log the error
            print(f"Chat processing error: {e}")

            # Determine user-friendly error message
            error_str = str(e).lower()
            if "insufficient_quota" in error_str or "429" in error_str:
                error_message = "The AI service quota has been exceeded. Please try again later."
            elif "invalid_api_key" in error_str or "401" in error_str or "unauthorized" in error_str:
                error_message = "Invalid API key. Please check the OpenRouter API key configuration."
            elif "rate_limit" in error_str:
                error_message = "Rate limit exceeded. Please wait a moment and try again."
            else:
                error_message = f"I'm having trouble connecting right now. Please try again in a moment. Error: {str(e)}"

            return ChatResponse(
                response=error_message,
                tool_calls=[],
                error=True
            )
