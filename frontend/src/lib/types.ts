// User types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface UserResponse {
  id: string;
  email: string;
}

// Task types
export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  due_date: string | null;
  due_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string | null;
  due_date?: string | null;
  due_time?: string | null;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  due_date?: string | null;
  due_time?: string | null;
}

export interface TaskCompleteToggle {
  completed: boolean;
}

export interface TaskListResponse {
  tasks: Task[];
  count: number;
}

// Auth types
export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
}

// Error types
export interface ErrorResponse {
  detail: string;
}

export interface ValidationError {
  detail: Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

// Chat types
export type MessageRole = 'user' | 'assistant' | 'tool';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  tool_name?: string | null;
  tool_call_id?: string | null;
  created_at: string;
}

export interface ToolCallResult {
  tool: string;
  result: 'success' | 'error';
  task_id?: string;
  count?: number;
  error_message?: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
  tool_calls: ToolCallResult[];
  error?: boolean;
}

export interface ChatHistoryResponse {
  messages: ChatMessage[];
  has_more: boolean;
}
