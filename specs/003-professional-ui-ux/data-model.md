# Component Structure: Professional UI/UX Enhancement

**Feature**: 003-professional-ui-ux
**Date**: 2026-02-05
**Status**: Complete

## Overview

This document defines the component structure and interfaces for the UI/UX enhancement. Note: This is a frontend-only feature with no database schema changes.

---

## Component Hierarchy

```
frontend/src/
├── app/
│   ├── globals.css                 # Extended theme tokens
│   ├── layout.tsx                  # Root layout (unchanged)
│   ├── page.tsx                    # Home page (enhanced)
│   ├── (auth)/
│   │   ├── signin/page.tsx         # Redesigned
│   │   └── signup/page.tsx         # Redesigned
│   ├── (protected)/
│   │   ├── layout.tsx              # Auth redirect logic
│   │   └── dashboard/page.tsx      # Minor styling
│   └── tasks/
│       ├── page.tsx                # Enhanced list view
│       └── new/page.tsx            # Now uses modal
│
├── components/
│   ├── ui/                         # Reusable UI primitives
│   │   ├── Modal.tsx               # NEW
│   │   ├── EmptyState.tsx          # NEW
│   │   ├── LoadingSpinner.tsx      # NEW
│   │   ├── DatePicker.tsx          # Enhanced
│   │   ├── TimePicker.tsx          # Enhanced
│   │   └── Toast.tsx               # Unchanged
│   │
│   ├── auth/
│   │   └── AuthGuard.tsx           # Enhanced redirect
│   │
│   ├── home/
│   │   ├── HeroSection.tsx         # Enhanced styling
│   │   ├── ActionCard.tsx          # NEW (replaces FeatureButton)
│   │   ├── ActionCardGrid.tsx      # NEW
│   │   ├── FeatureCard.tsx         # Enhanced styling
│   │   └── FeaturesSection.tsx     # Minor updates
│   │
│   ├── tasks/
│   │   ├── TaskList.tsx            # Enhanced with empty state
│   │   ├── TaskItem.tsx            # Enhanced with date/time
│   │   ├── TaskForm.tsx            # Enhanced styling
│   │   └── TaskModal.tsx           # NEW
│   │
│   ├── chat/
│   │   ├── ChatWidget.tsx          # Slide-in integration
│   │   ├── ChatButton.tsx          # Enhanced floating button
│   │   ├── ChatPanel.tsx           # NEW (slide-in panel)
│   │   ├── ChatWindow.tsx          # Refactored
│   │   ├── ChatInput.tsx           # Enhanced styling
│   │   ├── MessageItem.tsx         # Enhanced bubbles
│   │   └── MessageList.tsx         # Enhanced layout
│   │
│   └── layout/
│       └── Header.tsx              # Minor refinements
│
└── context/
    └── AuthContext.tsx             # Redirect enhancement
```

---

## New Component Interfaces

### 1. Modal Component

**File**: `components/ui/Modal.tsx`

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  showCloseButton?: boolean;
}

// Default values
const defaults = {
  size: 'md',
  showCloseButton: true,
};

// Size mappings
const sizes = {
  sm: '400px',
  md: '500px',
  lg: '640px',
};
```

**Behavior**:
- Backdrop click closes modal (unless prevented)
- Escape key closes modal
- Focus trap within modal
- Body scroll lock when open
- Slide-up + fade-in animation

---

### 2. EmptyState Component

**File**: `components/ui/EmptyState.tsx`

```typescript
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Usage Examples**:
- Task list empty: "No tasks yet" + "Create your first task" button
- Chat empty: "Start a conversation" + suggestion chips

---

### 3. LoadingSpinner Component

**File**: `components/ui/LoadingSpinner.tsx`

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'muted';
}

// Size mappings
const sizes = {
  sm: '16px',
  md: '24px',
  lg: '32px',
};
```

---

### 4. ActionCard Component

**File**: `components/home/ActionCard.tsx`

```typescript
interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  href: string;
  variant?: 'default' | 'primary' | 'success' | 'accent';
  badge?: string | number;
}

// Variant color mappings
const variants = {
  default: {
    iconBg: 'var(--primary-light)',
    iconColor: 'var(--primary)',
  },
  primary: {
    iconBg: 'var(--gradient-primary)',
    iconColor: 'white',
  },
  success: {
    iconBg: 'var(--success-light)',
    iconColor: 'var(--success)',
  },
  accent: {
    iconBg: 'var(--gradient-secondary)',
    iconColor: 'white',
  },
};
```

---

### 5. ActionCardGrid Component

**File**: `components/home/ActionCardGrid.tsx`

```typescript
interface ActionCardGridProps {
  children: React.ReactNode;
}
```

**Responsive Layout**:
```css
.grid {
  display: grid;
  gap: var(--spacing-md);
  grid-template-columns: repeat(2, 1fr); /* Mobile */
}

@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(3, 1fr); /* Tablet */
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(5, 1fr); /* Desktop */
  }
}
```

---

### 6. TaskModal Component

**File**: `components/tasks/TaskModal.tsx`

```typescript
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: TaskInput) => Promise<void>;
  initialData?: Partial<TaskInput>;
  mode?: 'create' | 'edit';
}

interface TaskInput {
  title: string;
  description: string;
  dueDate: string | null;
  dueTime: string | null;
}
```

**Form Validation**:
- Title: Required, max 255 characters
- Description: Optional, max 1000 characters
- Date: Optional, must be today or future
- Time: Optional, requires date if set

---

### 7. ChatPanel Component

**File**: `components/chat/ChatPanel.tsx`

```typescript
interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Internal State**:
- Messages from useChatHistory hook
- Loading state for message submission
- Error state for failed messages

**Animation**:
```css
.panel {
  transform: translateX(100%);
  transition: transform 300ms var(--ease-out-expo);
}

.panel.open {
  transform: translateX(0);
}
```

---

## Enhanced Component Interfaces

### TaskItem Enhancements

**File**: `components/tasks/TaskItem.tsx`

```typescript
// Existing interface extended with display helpers
interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

// New display helpers
function formatTaskDate(date: string | null): string {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function formatTaskTime(time: string | null): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}
```

---

### Auth Page Enhancements

**File**: `app/(auth)/signin/page.tsx` and `signup/page.tsx`

```typescript
// Enhanced form state
interface AuthFormState {
  email: string;
  password: string;
  confirmPassword?: string; // signup only
  isLoading: boolean;
  error: string | null;
  fieldErrors: {
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
}

// Redirect behavior
useEffect(() => {
  if (isAuthenticated) {
    const returnUrl = searchParams.get('returnUrl') || '/';
    router.push(returnUrl);
  }
}, [isAuthenticated]);
```

---

## State Management

### No New Context Required

All UI enhancements work with existing state:

| Feature | State Source |
|---------|-------------|
| Auth redirect | AuthContext (existing) |
| Task display | useTasks hook (existing) |
| Chat messages | useChat hook (existing) |
| Modal open/close | Local useState |
| Form validation | Local useState |

### Local Component State Additions

```typescript
// TaskList page
const [isModalOpen, setIsModalOpen] = useState(false);

// Chat widget
const [isPanelOpen, setIsPanelOpen] = useState(false);

// TaskItem
const [isCompleting, setIsCompleting] = useState(false);
```

---

## CSS Architecture

### Token Extension Strategy

```css
/* globals.css - New tokens added after existing */

:root {
  /* ... existing tokens ... */

  /* === Phase 3 UI Enhancement Tokens === */

  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --gradient-chat-user: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  --gradient-chat-bot: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  --gradient-auth-bg: linear-gradient(135deg, var(--primary-light) 0%, var(--bg-secondary) 100%);

  /* Enhanced Shadows */
  --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
  --shadow-card-hover: 0 10px 20px -5px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.06);
  --shadow-modal: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-button: 0 4px 14px 0 rgba(37, 99, 235, 0.25);
  --shadow-chat-panel: -4px 0 20px rgba(0, 0, 0, 0.15);

  /* Animation Timing */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out-expo: cubic-bezier(0.87, 0, 0.13, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* Z-Index Scale */
  --z-dropdown: 100;
  --z-modal-backdrop: 150;
  --z-modal: 200;
  --z-chat: 300;
  --z-toast: 400;

  /* Component-Specific */
  --chat-panel-width: 420px;
  --modal-max-width-sm: 400px;
  --modal-max-width-md: 500px;
  --modal-max-width-lg: 640px;
  --action-card-min-width: 160px;
}
```

### Scoped Styles Pattern

Each component uses styled-jsx for scoped styles:

```jsx
export function ActionCard({ icon, title, href, variant = 'default' }) {
  return (
    <Link href={href} className="card">
      <div className="icon-wrapper">{icon}</div>
      <span className="title">{title}</span>

      <style jsx>{`
        .card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--spacing-lg);
          background: var(--background);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-card);
          transition: all var(--transition-normal);
          text-decoration: none;
          color: inherit;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-card-hover);
        }

        /* ... more styles ... */
      `}</style>
    </Link>
  );
}
```

---

## File Change Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `globals.css` | MODIFY | Add new design tokens |
| `page.tsx` (home) | MODIFY | Add ActionCardGrid |
| `signin/page.tsx` | MODIFY | Redesign layout and styling |
| `signup/page.tsx` | MODIFY | Redesign layout and styling |
| `TaskList.tsx` | MODIFY | Add EmptyState, enhanced styling |
| `TaskItem.tsx` | MODIFY | Add date/time display, completion animation |
| `TaskForm.tsx` | MODIFY | Enhanced form styling |
| `ChatWidget.tsx` | MODIFY | Integrate ChatPanel |
| `ChatWindow.tsx` | MODIFY | Refactor to slide-in panel |
| `ChatButton.tsx` | MODIFY | Enhanced floating button |
| `ChatInput.tsx` | MODIFY | Enhanced input styling |
| `MessageItem.tsx` | MODIFY | Enhanced bubble styling |
| `MessageList.tsx` | MODIFY | Enhanced layout |
| `HeroSection.tsx` | MODIFY | Refined styling |
| `FeatureCard.tsx` | MODIFY | Enhanced card styling |
| `AuthContext.tsx` | MODIFY | Add redirect helpers |
| `Modal.tsx` | CREATE | New reusable modal |
| `EmptyState.tsx` | CREATE | New empty state component |
| `LoadingSpinner.tsx` | CREATE | New loading indicator |
| `ActionCard.tsx` | CREATE | New action card component |
| `ActionCardGrid.tsx` | CREATE | New grid layout |
| `TaskModal.tsx` | CREATE | New task creation modal |
| `ChatPanel.tsx` | CREATE | New slide-in chat panel |

**Total**: 16 files modified, 7 files created
