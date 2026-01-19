# Tasks: Full-Stack Todo Web Application (Phase II - Homepage First UX)

**Input**: Design documents from `/specs/001-fullstack-todo-app/`
**Branch**: `001-fullstack-todo-app`
**Generated**: 2026-01-17
**Phase**: II - Homepage First UX

**Prerequisites Used**:
- plan.md v2.0.0 (Homepage First UX architecture)
- spec.md v2.0.0 (10 user stories with priorities)
- data-model.md (User, Task entities)
- contracts/auth.yaml (authentication endpoints)
- contracts/tasks.yaml (task CRUD endpoints)

**Tests**: Manual verification via quickstart.md. Unit tests optional.

**Organization**: Tasks organized by SPEC (feature area) to enable focused implementation.

---

## Format: `[ID] [P?] [SPEC?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[SPEC]**: Which specification area this task belongs to (e.g., SPEC1, SPEC2)
- All paths are relative to repository root

---

## SPEC 1: Frontend UX & Routing

**Purpose**: Public homepage with auth-gated feature buttons

**Goal**: Visitors see a welcoming homepage with 5 feature buttons. Clicking buttons triggers auth flow if not logged in.

---

### Task 1.1 — Public Homepage

- [X] T101 [SPEC1] Create `frontend/src/app/page.tsx` - Public homepage route (/)
- [X] T102 [SPEC1] Create `frontend/src/components/home/HeroSection.tsx` - App introduction with title and subtitle
- [X] T103 [P] [SPEC1] Create `frontend/src/components/home/FeatureButton.tsx` - Reusable auth-gated button component
- [X] T104 [SPEC1] Add 5 feature buttons to homepage: Add Task, View Tasks, Edit Task, Delete Task, Complete Task
- [X] T105 [P] [SPEC1] Style homepage with responsive grid layout for feature buttons
- [X] T106 [SPEC1] Create `frontend/src/components/layout/Header.tsx` - Navigation with Signin/Signup buttons
- [X] T107 [SPEC1] Update `frontend/src/app/layout.tsx` - Include Header component globally

**Checkpoint**: Homepage displays with all elements. No auth functionality yet.

---

### Task 1.2 — Auth State Detection

- [X] T108 [SPEC1] Create `frontend/src/context/AuthContext.tsx` - AuthProvider with user state, isAuthenticated, isLoading
- [X] T109 [SPEC1] Implement `frontend/src/lib/auth.ts` - getStoredToken, setToken, removeToken, decodeToken functions
- [X] T110 [SPEC1] Implement token expiry check in AuthContext - validate exp claim on mount
- [X] T111 [SPEC1] Create `frontend/src/hooks/useAuth.ts` - useContext wrapper for AuthContext
- [X] T112 [SPEC1] Update `frontend/src/app/layout.tsx` - Wrap app with AuthProvider

**Checkpoint**: App can detect if user is authenticated via stored token.

---

### Task 1.3 — Auth-Gated Buttons

- [X] T113 [SPEC1] Update `FeatureButton.tsx` - Check isAuthenticated before navigation
- [X] T114 [SPEC1] Implement redirect logic - If unauthenticated, redirect to `/signin?returnUrl=<target>`
- [X] T115 [SPEC1] If authenticated, navigate directly to target route
- [X] T116 [SPEC1] Update `Header.tsx` - Show user email + Signout when authenticated
- [X] T117 [SPEC1] Update `Header.tsx` - Show Signin/Signup buttons when not authenticated

**Checkpoint**: Feature buttons redirect unauthenticated users to signin with returnUrl preserved.

---

## SPEC 2: Authentication & Security

**Purpose**: Secure JWT-based authentication system

**Goal**: Users can signup, signin, and receive JWT tokens for protected operations.

---

### Task 2.1 — User Model

- [X] T201 [SPEC2] Implement `backend/app/models/user.py` - User SQLModel with id (UUID), email (unique, indexed), hashed_password, created_at
- [X] T202 [SPEC2] Add relationship to Task model (one-to-many)
- [X] T203 [SPEC2] Update `backend/app/models/__init__.py` - Export User model

**Checkpoint**: User model ready for database operations.

---

### Task 2.2 — Signup Endpoint

- [X] T204 [SPEC2] Create `backend/app/schemas/user.py` - SignupRequest (email, password), UserResponse Pydantic schemas
- [X] T205 [SPEC2] Implement `backend/app/auth/password.py` - hash_password using passlib bcrypt
- [X] T206 [SPEC2] Create `backend/app/routers/auth.py` - POST /api/auth/signup endpoint
- [X] T207 [SPEC2] Validate email format in signup request
- [X] T208 [SPEC2] Enforce minimum password length (8 characters)
- [X] T209 [SPEC2] Check email uniqueness - return 400 if email exists
- [X] T210 [SPEC2] Hash password before storing user
- [X] T211 [SPEC2] Return UserResponse with id and email (never password)

**Checkpoint**: Users can create accounts via API.

---

### Task 2.3 — Signin Endpoint

- [X] T212 [SPEC2] Add SigninRequest (email, password), TokenResponse (access_token, token_type) to schemas
- [X] T213 [SPEC2] Implement `backend/app/auth/password.py` - verify_password function
- [X] T214 [SPEC2] Add POST /api/auth/signin to auth router
- [X] T215 [SPEC2] Find user by email - return "Invalid credentials" (401) if not found
- [X] T216 [SPEC2] Verify password - return same "Invalid credentials" (401) if wrong
- [X] T217 [SPEC2] Implement `backend/app/auth/jwt.py` - create_access_token with user_id, email, exp claims
- [X] T218 [SPEC2] Return TokenResponse with JWT on successful signin

**Checkpoint**: Users can signin and receive JWT tokens.

---

### Task 2.4 — JWT Middleware

- [X] T219 [SPEC2] Implement `backend/app/auth/jwt.py` - verify_token function with python-jose
- [X] T220 [SPEC2] Create `backend/app/auth/dependencies.py` - get_current_user FastAPI dependency
- [X] T221 [SPEC2] Extract token from Authorization header (Bearer scheme)
- [X] T222 [SPEC2] Verify token signature and expiry - return 401 if invalid
- [X] T223 [SPEC2] Fetch user from database using token sub claim
- [X] T224 [SPEC2] Return User object for use in route handlers
- [X] T225 [SPEC2] Register auth router in main.py with prefix /api/auth

**Checkpoint**: Protected endpoints can use get_current_user dependency.

---

## SPEC 3: Task API Implementation

**Purpose**: RESTful task CRUD with ownership enforcement

**Goal**: Authenticated users can create, read, update, delete, and complete their own tasks.

---

### Task 3.1 — Task Model

- [X] T301 [SPEC3] Implement `backend/app/models/task.py` - Task SQLModel with id (UUID), user_id (FK), title (max 255), description (nullable), completed (default false), created_at, updated_at
- [X] T302 [SPEC3] Add relationship back to User model
- [X] T303 [SPEC3] Update `backend/app/models/__init__.py` - Export Task model
- [X] T304 [SPEC3] Create `backend/app/schemas/task.py` - TaskCreate, TaskUpdate, TaskResponse, TaskListResponse schemas

**Checkpoint**: Task model and schemas ready.

---

### Task 3.2 — Create Task Endpoint

- [X] T305 [SPEC3] Create `backend/app/routers/tasks.py` - POST /api/tasks endpoint
- [X] T306 [SPEC3] Require authentication via get_current_user dependency
- [X] T307 [SPEC3] Validate TaskCreate (title required, max 255 chars)
- [X] T308 [SPEC3] Set user_id from authenticated user (NOT from request body)
- [X] T309 [SPEC3] Return TaskResponse with 201 Created

**Checkpoint**: Authenticated users can create tasks.

---

### Task 3.3 — List Tasks Endpoint

- [X] T310 [SPEC3] Add GET /api/tasks to tasks router
- [X] T311 [SPEC3] Require authentication
- [X] T312 [SPEC3] Query tasks WHERE user_id = current_user.id (ownership enforcement)
- [X] T313 [SPEC3] Order by created_at DESC (newest first)
- [X] T314 [SPEC3] Return TaskListResponse with tasks array and count

**Checkpoint**: Users can view only their own tasks.

---

### Task 3.4 — Get Single Task Endpoint

- [X] T315 [SPEC3] Add GET /api/tasks/{task_id} to tasks router
- [X] T316 [SPEC3] Require authentication
- [X] T317 [SPEC3] Query task WHERE id = task_id AND user_id = current_user.id
- [X] T318 [SPEC3] Return 404 if not found (includes unauthorized access)
- [X] T319 [SPEC3] Return TaskResponse

**Checkpoint**: Users can view individual task details.

---

### Task 3.5 — Update Task Endpoint

- [X] T320 [SPEC3] Add PUT /api/tasks/{task_id} to tasks router
- [X] T321 [SPEC3] Require authentication + ownership verification
- [X] T322 [SPEC3] Validate TaskUpdate (title required if provided, max 255 chars)
- [X] T323 [SPEC3] Update title, description, updated_at fields
- [X] T324 [SPEC3] Return TaskResponse

**Checkpoint**: Users can update their own tasks.

---

### Task 3.6 — Delete Task Endpoint

- [X] T325 [SPEC3] Add DELETE /api/tasks/{task_id} to tasks router
- [X] T326 [SPEC3] Require authentication + ownership verification
- [X] T327 [SPEC3] Delete task from database
- [X] T328 [SPEC3] Return 204 No Content

**Checkpoint**: Users can delete their own tasks.

---

### Task 3.7 — Toggle Complete Endpoint

- [X] T329 [SPEC3] Add PATCH /api/tasks/{task_id}/complete to tasks router
- [X] T330 [SPEC3] Require authentication + ownership verification
- [X] T331 [SPEC3] Toggle completed boolean (true → false, false → true)
- [X] T332 [SPEC3] Update updated_at timestamp
- [X] T333 [SPEC3] Return TaskResponse
- [X] T334 [SPEC3] Register tasks router in main.py with prefix /api

**Checkpoint**: Full task CRUD API complete with ownership enforcement.

---

## SPEC 4: Frontend Authentication Pages

**Purpose**: Signin and Signup pages with returnUrl handling

**Goal**: Users can register and login, then be redirected to their intended destination.

---

### Task 4.1 — Signup Page

- [X] T401 [SPEC4] Create `frontend/src/app/signup/page.tsx` - Signup form page
- [X] T402 [P] [SPEC4] Create `frontend/src/components/auth/SignupForm.tsx` - Form with email, password, confirm password fields
- [X] T403 [SPEC4] Add client-side validation: email format, password min 8 chars, passwords match
- [X] T404 [SPEC4] Implement form submission - POST to /api/auth/signup
- [X] T405 [SPEC4] Handle success: auto-signin user and redirect to returnUrl or homepage
- [X] T406 [SPEC4] Handle errors: display "Email already taken" or validation errors
- [X] T407 [SPEC4] Add link to signin page: "Already have an account? Sign in"

**Checkpoint**: Users can register via frontend.

---

### Task 4.2 — Signin Page

- [X] T408 [SPEC4] Create `frontend/src/app/signin/page.tsx` - Signin form page
- [X] T409 [P] [SPEC4] Create `frontend/src/components/auth/SigninForm.tsx` - Form with email, password fields
- [X] T410 [SPEC4] Read returnUrl from query params using useSearchParams
- [X] T411 [SPEC4] Implement form submission - POST to /api/auth/signin
- [X] T412 [SPEC4] On success: store token, update AuthContext, redirect to returnUrl or "/"
- [X] T413 [SPEC4] Handle errors: display "Invalid credentials" message
- [X] T414 [SPEC4] Add link to signup page: "Don't have an account? Sign up"

**Checkpoint**: Users can signin and are redirected to intended destination.

---

### Task 4.3 — Signout Functionality

- [X] T415 [SPEC4] Add logout function to AuthContext - removeToken, clear user state
- [X] T416 [SPEC4] Update Header Signout button - call logout, redirect to homepage
- [X] T417 [SPEC4] Ensure AuthContext resets isAuthenticated to false on logout

**Checkpoint**: Users can signout and are redirected to homepage.

---

## SPEC 5: Frontend Task UI

**Purpose**: Task list and CRUD operations

**Goal**: Authenticated users can view, create, edit, delete, and complete tasks.

---

### Task 5.1 — Protected Route Wrapper

- [X] T501 [SPEC5] Create `frontend/src/components/auth/AuthGuard.tsx` - Protected route wrapper
- [X] T502 [SPEC5] Check isAuthenticated in AuthGuard
- [X] T503 [SPEC5] If not authenticated, redirect to /signin?returnUrl=<current path>
- [X] T504 [SPEC5] Show loading spinner while auth state is loading
- [X] T505 [SPEC5] Create `frontend/src/app/tasks/layout.tsx` - Wrap children with AuthGuard

**Checkpoint**: /tasks/* routes are protected.

---

### Task 5.2 — Task List Page

- [X] T506 [SPEC5] Create `frontend/src/app/tasks/page.tsx` - Task list view
- [X] T507 [SPEC5] Create `frontend/src/hooks/useTasks.ts` - Hook with tasks state, fetchTasks, loading, error
- [X] T508 [SPEC5] Implement fetchTasks - GET /api/tasks with JWT in Authorization header
- [X] T509 [P] [SPEC5] Create `frontend/src/components/tasks/TaskList.tsx` - List component
- [X] T510 [P] [SPEC5] Create `frontend/src/components/tasks/TaskCard.tsx` - Single task display with title, status, actions
- [X] T511 [SPEC5] Display empty state when no tasks: "No tasks yet. Create your first task!"
- [X] T512 [SPEC5] Fetch tasks on component mount

**Checkpoint**: Users can view their task list.

---

### Task 5.3 — Create Task UI

- [X] T513 [SPEC5] Create `frontend/src/app/tasks/new/page.tsx` - Create task page
- [X] T514 [P] [SPEC5] Create `frontend/src/components/tasks/TaskForm.tsx` - Form with title (required), description (optional)
- [X] T515 [SPEC5] Add createTask to useTasks hook - POST /api/tasks
- [X] T516 [SPEC5] Validate title required, max 255 chars
- [X] T517 [SPEC5] On success: redirect to /tasks with success message
- [X] T518 [SPEC5] Handle errors: display validation messages

**Checkpoint**: Users can create tasks via UI.

---

### Task 5.4 — Edit Task UI

- [X] T519 [SPEC5] Create `frontend/src/app/tasks/[id]/edit/page.tsx` - Edit task page
- [X] T520 [SPEC5] Fetch single task on mount - GET /api/tasks/{id}
- [X] T521 [SPEC5] Pre-populate TaskForm with existing values
- [X] T522 [SPEC5] Add updateTask to useTasks hook - PUT /api/tasks/{id}
- [X] T523 [SPEC5] On success: redirect to /tasks with success message
- [X] T524 [SPEC5] Handle 404: display "Task not found" and link back to list

**Checkpoint**: Users can edit their tasks.

---

### Task 5.5 — Delete Task UI

- [X] T525 [SPEC5] Create `frontend/src/components/ui/ConfirmDialog.tsx` - Reusable confirmation modal
- [X] T526 [SPEC5] Add delete button to TaskCard
- [X] T527 [SPEC5] Show ConfirmDialog on delete click: "Are you sure you want to delete this task?"
- [X] T528 [SPEC5] Add deleteTask to useTasks hook - DELETE /api/tasks/{id}
- [X] T529 [SPEC5] On confirm: delete task, remove from list, show success message

**Checkpoint**: Users can delete tasks with confirmation.

---

### Task 5.6 — Complete Task UI

- [X] T530 [SPEC5] Add checkbox/toggle to TaskCard for completion status
- [X] T531 [SPEC5] Add toggleComplete to useTasks hook - PATCH /api/tasks/{id}/complete
- [X] T532 [SPEC5] On toggle: optimistically update UI, then sync with server
- [X] T533 [SPEC5] Apply visual distinction for completed tasks: strikethrough, muted colors
- [X] T534 [SPEC5] Handle errors: revert optimistic update if server fails

**Checkpoint**: Users can toggle task completion with visual feedback.

---

## SPEC 6: Responsive Design & Polish

**Purpose**: Mobile-friendly interface and error handling

**Goal**: Application works on all devices with proper error states.

---

### Task 6.1 — Responsive Layout

- [X] T601 [P] [SPEC6] Create `frontend/src/app/globals.css` - Mobile-first responsive styles
- [X] T602 [P] [SPEC6] Add breakpoints: mobile (default), tablet (640px), desktop (1024px)
- [X] T603 [SPEC6] Update homepage - Feature buttons in grid (2 cols mobile, 3 cols tablet, 5 cols desktop)
- [X] T604 [SPEC6] Update TaskList - Vertical stack on mobile, grid on desktop
- [X] T605 [SPEC6] Update TaskForm - Full width on mobile, max-width on desktop
- [X] T606 [SPEC6] Update auth forms - Centered, max-width 400px

**Checkpoint**: All pages responsive across devices.

---

### Task 6.2 — Loading States

- [X] T607 [SPEC6] Create `frontend/src/components/ui/LoadingSpinner.tsx` - Reusable loading indicator
- [X] T608 [SPEC6] Add loading state to AuthGuard while checking auth
- [X] T609 [SPEC6] Add loading state to task list while fetching
- [X] T610 [SPEC6] Add loading state to task forms while submitting
- [X] T611 [SPEC6] Add loading state to auth forms while submitting

**Checkpoint**: All async operations show loading indicators.

---

### Task 6.3 — Error Handling

- [X] T612 [SPEC6] Create `frontend/src/components/ui/ErrorMessage.tsx` - Reusable error display
- [X] T613 [SPEC6] Implement `frontend/src/lib/api.ts` - fetchWithAuth wrapper with 401 handling
- [X] T614 [SPEC6] On 401 response: removeToken, redirect to /signin?returnUrl=<current>
- [X] T615 [SPEC6] Display user-friendly errors for network failures
- [X] T616 [SPEC6] Add error boundary for React component crashes

**Checkpoint**: Graceful error handling throughout application.

---

### Task 6.4 — Final Validation

- [X] T617 [SPEC6] Verify all FR-001 to FR-033 requirements from spec.md
- [X] T618 [SPEC6] Test homepage loads without auth prompt (FR-001, FR-006)
- [X] T619 [SPEC6] Test feature button redirects to signin when unauthenticated (FR-007)
- [X] T620 [SPEC6] Test returnUrl preserved and used after signin (FR-008, FR-009)
- [X] T621 [SPEC6] Test task ownership enforcement - cannot access other user's tasks (FR-027)
- [X] T622 [SPEC6] Test responsive design on mobile, tablet, desktop (FR-030)
- [X] T623 [SPEC6] Remove debug console.logs and verify no hardcoded secrets

**Checkpoint**: Application passes all acceptance criteria.

---

## Dependencies & Execution Order

### SPEC Dependencies

```
SPEC 2 (Auth Backend) ──────────────────────────────────────────────►
         │
         ├─────────────────┐
         ▼                 ▼
SPEC 1 (Homepage)    SPEC 3 (Task API) ─────────────────────────────►
         │                 │
         └────────┬────────┘
                  ▼
         SPEC 4 (Auth Frontend) ────────────────────────────────────►
                  │
                  ▼
         SPEC 5 (Task Frontend) ────────────────────────────────────►
                  │
                  ▼
         SPEC 6 (Polish) ───────────────────────────────────────────►
```

### Parallel Opportunities

| Phase | Tasks | Parallel With |
|-------|-------|---------------|
| SPEC 1.1 | T103, T105 | Different component files |
| SPEC 2.2-2.3 | Backend auth | SPEC 1.1 (no dependency) |
| SPEC 3 | Task API | SPEC 1.2-1.3 (frontend auth detection) |
| SPEC 4.1-4.2 | T402, T409 | Signup and Signin forms |
| SPEC 5.2-5.3 | T509, T510, T514 | Task components |
| SPEC 6.1-6.2 | T601-T606, T607-T611 | Styling and loading states |

---

## Implementation Strategy

### MVP First (SPEC 1-4)

1. Complete SPEC 2: Backend auth (signup, signin, JWT)
2. Complete SPEC 1: Public homepage with auth-gated buttons
3. Complete SPEC 4: Frontend auth pages with returnUrl
4. **STOP and VALIDATE**: Users can visit homepage → click button → signin → return to action
5. Demo-ready with auth flow

### Core Features (SPEC 1-5)

1. Complete MVP scope
2. Complete SPEC 3: Task API
3. Complete SPEC 5: Task UI
4. **STOP and VALIDATE**: Full task CRUD working
5. Demo-ready with task management

### Production Ready (All SPECs)

1. Complete Core scope
2. Complete SPEC 6: Responsive design and polish
3. Run all validation tests
4. Ready for hackathon submission

---

## Summary

| Metric | Count |
|--------|-------|
| **Total Tasks** | 123 |
| SPEC 1 (Homepage UX) | 17 |
| SPEC 2 (Auth Backend) | 25 |
| SPEC 3 (Task API) | 34 |
| SPEC 4 (Auth Frontend) | 17 |
| SPEC 5 (Task Frontend) | 34 |
| SPEC 6 (Polish) | 23 |
| **Parallel Opportunities** | 15 tasks marked [P] |

**MVP Scope**: SPEC 1-4 (59 tasks) - Homepage First UX with auth flow
**Core Scope**: SPEC 1-5 (93 tasks) - Full task CRUD functionality
**Full Scope**: All SPECs (123 tasks) - Production-ready responsive application

---

**Version**: 2.0.0 | **Created**: 2026-01-15 | **Updated**: 2026-01-17

---

# UI Enhancement Phase (Phase III)

**Generated**: 2026-01-18
**Purpose**: Professional UI polish, date/time pickers, and responsive design enhancements

---

## SPEC 7: Theme System (Priority: P1)

**Goal**: Apply consistent professional SaaS theme across the entire application

**Independent Test**: All pages should have consistent colors, fonts, and spacing

---

### Task 7.1 — Global Theme Variables

- [X] T701 [SPEC7] Update frontend/src/app/globals.css with complete CSS custom properties:
  - Primary color: #2563eb (blue)
  - Primary hover: #1d4ed8
  - Success: #16a34a
  - Error: #dc2626
  - Warning: #f59e0b
  - Muted: #6b7280
  - Background: #f9fafb
  - Foreground: #111827
  - Border: #e5e7eb
- [X] T702 [P] [SPEC7] Define typography scale in globals.css:
  - Font family: system-ui, sans-serif
  - Font sizes: xs (0.75rem), sm (0.875rem), base (1rem), lg (1.125rem), xl (1.25rem), 2xl (1.5rem), 3xl (1.875rem)
- [X] T703 [P] [SPEC7] Define spacing scale: xs (0.25rem), sm (0.5rem), md (1rem), lg (1.5rem), xl (2rem), 2xl (3rem)
- [X] T704 [P] [SPEC7] Define shadows, border-radius, and transitions

**Checkpoint**: Theme foundation complete

---

## SPEC 8: Enhanced Homepage (Priority: P1)

**Goal**: Create attractive hero section and 5 feature cards with professional design

**Independent Test**: Homepage displays hero section and 5 feature cards with hover effects

---

### Task 8.1 — Hero Section Redesign

- [X] T801 [SPEC8] Redesign frontend/src/components/home/HeroSection.tsx:
  - Large compelling headline
  - Subheadline explaining app benefits
  - CTA buttons (Get Started, Sign In)
  - Gradient or image background
- [X] T802 [SPEC8] Add smooth fade-in animation on page load

### Task 8.2 — Feature Cards Section

- [X] T803 [SPEC8] Create frontend/src/components/home/FeaturesSection.tsx
- [X] T804 [P] [SPEC8] Create frontend/src/components/home/FeatureCard.tsx:
  - Icon display area
  - Title and description
  - Hover lift effect with shadow
- [X] T805 [SPEC8] Implement 5 feature cards with icons:
  - Card 1: Task Management icon + "Create and organize tasks"
  - Card 2: Calendar icon + "Schedule with date and time"
  - Card 3: Checkmark icon + "Track your progress"
  - Card 4: Lock icon + "Secure authentication"
  - Card 5: Mobile icon + "Works on any device"
- [X] T806 [SPEC8] Add hover and focus states with smooth transitions
- [X] T807 [SPEC8] Update frontend/src/app/page.tsx to include FeaturesSection

**Checkpoint**: Homepage displays professional hero and feature cards

---

## SPEC 9: Signup/Signin Redirect (Priority: P1)

**Goal**: After successful authentication, redirect to homepage with all features enabled

**Independent Test**: Sign up or sign in redirects to homepage; feature buttons are clickable

---

### Task 9.1 — Auth Redirect Flow

- [X] T901 [SPEC9] Verify frontend/src/app/(auth)/signup/page.tsx redirects to "/" on success
- [X] T902 [SPEC9] Verify frontend/src/app/(auth)/signin/page.tsx redirects to "/" (or returnUrl) on success
- [X] T903 [SPEC9] Update frontend/src/components/home/FeatureButton.tsx to show different styles based on auth state
- [X] T904 [SPEC9] Add visual distinction for authenticated users on homepage (e.g., "Welcome back!")
- [X] T905 [SPEC9] Ensure all 5 feature buttons navigate directly when authenticated

**Checkpoint**: Authentication flow completes with homepage redirect

---

## SPEC 10: Add Task Form UI (Priority: P2)

**Goal**: Professional task creation form with calendar date picker and time picker

**Independent Test**: Can create task with title, description, date, and time selection

---

### Task 10.1 — Backend Updates for Date/Time

- [X] T1001 [SPEC10] Update backend/app/models/task.py to add:
  - due_date: Optional[date] (nullable)
  - due_time: Optional[time] (nullable)
- [X] T1002 [SPEC10] Update backend/app/schemas/task.py:
  - TaskCreate: add due_date, due_time optional fields
  - TaskResponse: add due_date, due_time fields
- [X] T1003 [SPEC10] Update backend/app/routers/tasks.py create_task to handle new fields
- [X] T1004 [SPEC10] Run database migration or recreate tables for new fields

### Task 10.2 — Frontend Date/Time Pickers

- [X] T1005 [SPEC10] Update frontend/src/lib/types.ts with due_date and due_time types
- [X] T1006 [P] [SPEC10] Create frontend/src/components/ui/DatePicker.tsx:
  - Calendar grid display
  - Month/year navigation
  - Day selection with visual feedback
  - Minimum date = today
- [X] T1007 [P] [SPEC10] Create frontend/src/components/ui/TimePicker.tsx:
  - Hour/minute selection
  - AM/PM toggle
  - 15-minute increments
- [X] T1008 [SPEC10] Update frontend/src/components/tasks/TaskForm.tsx:
  - Add DatePicker for due date
  - Add TimePicker for due time
  - Professional form layout with labels
- [X] T1009 [SPEC10] Add form validation:
  - Title required (max 255 chars)
  - Date cannot be in the past
  - Show error messages below fields
- [X] T1010 [SPEC10] Update frontend/src/app/tasks/new/page.tsx layout

**Checkpoint**: Task form allows date and time selection

---

## SPEC 11: Task Card Design (Priority: P2)

**Goal**: Card-based task layout displaying date, time, status, and complete button

**Independent Test**: Tasks display in cards with all details and Complete button visible

---

### Task 11.1 — Task Card Redesign

- [X] T1101 [SPEC11] Redesign frontend/src/components/tasks/TaskItem.tsx as card layout:
  - Card container with shadow and border
  - Title prominently displayed
  - Description below title (muted color)
  - Due date formatted (e.g., "Jan 18, 2026")
  - Due time formatted (e.g., "2:30 PM")
  - Status badge (Pending = blue, Completed = green)
- [X] T1102 [SPEC11] Add "Complete Task" button:
  - Prominent placement on card
  - Blue primary color
  - Changes to "Completed" (disabled, green) when done
- [X] T1103 [SPEC11] Add edit and delete action buttons (smaller, secondary style)
- [X] T1104 [SPEC11] Update frontend/src/components/tasks/TaskList.tsx for card grid layout
- [X] T1105 [SPEC11] Add card hover effect (subtle lift, shadow increase)
- [X] T1106 [SPEC11] Create empty state with illustration in TaskList.tsx:
  - "No tasks yet" message
  - "Create your first task" CTA button

**Checkpoint**: Tasks display in professional cards

---

## SPEC 12: Complete Task Interaction (Priority: P2)

**Goal**: Toggle task completion with disabled state and visual confirmation

**Independent Test**: Click Complete button toggles task, button disables, visual feedback shown

---

### Task 12.1 — Completion Interaction

- [X] T1201 [SPEC12] Update toggleComplete in frontend/src/hooks/useTasks.ts for optimistic update
- [X] T1202 [SPEC12] Add loading state to Complete button during API call
- [X] T1203 [SPEC12] Change button text/style after completion:
  - Before: "Complete Task" (blue)
  - After: "Completed" (green, disabled)
- [X] T1204 [SPEC12] Add visual feedback on completion:
  - Checkmark animation or confetti
  - Brief success message
- [X] T1205 [SPEC12] Apply completed task styling:
  - Title strikethrough
  - Card background slightly muted
  - Status badge changes to green "Completed"
- [X] T1206 [P] [SPEC12] Create frontend/src/components/ui/Toast.tsx for success notifications

**Checkpoint**: Task completion works smoothly with feedback

---

## SPEC 13: Responsive Design (Priority: P3)

**Goal**: Mobile and desktop layouts with touch-friendly controls

**Independent Test**: Application works well on mobile (375px) and desktop (1200px+)

---

### Task 13.1 — Responsive Breakpoints

- [X] T1301 [SPEC13] Add responsive breakpoints to frontend/src/app/globals.css:
  - Mobile: default (< 640px)
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- [X] T1302 [P] [SPEC13] Update Header.tsx for mobile:
  - Hamburger menu icon
  - Slide-out navigation drawer
  - Touch-friendly menu items
- [X] T1303 [P] [SPEC13] Update HeroSection.tsx for mobile:
  - Smaller text sizes
  - Stacked CTA buttons
  - Reduced padding
- [X] T1304 [P] [SPEC13] Update FeaturesSection.tsx for mobile:
  - Single column card layout
  - Swipe-able carousel option
- [X] T1305 [SPEC13] Update TaskList.tsx for mobile:
  - Single column layout
  - Full-width task cards
  - Larger touch targets
- [X] T1306 [SPEC13] Update TaskForm.tsx for mobile:
  - Full-width inputs
  - Larger date/time picker buttons
  - Native date/time inputs fallback
- [X] T1307 [SPEC13] Ensure all touch targets minimum 44x44px
- [X] T1308 [SPEC13] Test and fix overflow/scroll issues on mobile

**Checkpoint**: Application is fully responsive

---

## SPEC 14: Polish & Final Touches

**Purpose**: Cross-cutting improvements for production readiness

---

### Task 14.1 — Visual Polish

- [X] T1401 [P] [SPEC14] Add loading skeleton animations for task list
- [X] T1402 [P] [SPEC14] Add favicon.ico to frontend/public/
- [X] T1403 [P] [SPEC14] Update meta tags in frontend/src/app/layout.tsx for SEO
- [X] T1404 [SPEC14] Ensure color contrast meets WCAG AA accessibility standards
- [X] T1405 [SPEC14] Add keyboard navigation support (Tab, Enter, Escape)
- [X] T1406 [SPEC14] Cross-browser testing (Chrome, Firefox, Safari, Edge)

**Checkpoint**: Application is polished and accessible

---

## UI Enhancement Dependencies

### Phase Dependencies

```
SPEC 7 (Theme) ─────────────────────────────────────────────────────►
         │
         ├─────────────────┬─────────────────┬─────────────────┐
         ▼                 ▼                 ▼                 ▼
SPEC 8 (Homepage)    SPEC 9 (Redirect)   SPEC 10 (Form)   SPEC 13 (Responsive)
         │                 │                 │
         └────────┬────────┴─────────────────┘
                  ▼
         SPEC 11 (Cards) ──────────────────────────────────────────►
                  │
                  ▼
         SPEC 12 (Complete) ───────────────────────────────────────►
                  │
                  ▼
         SPEC 14 (Polish) ─────────────────────────────────────────►
```

### Parallel Opportunities

After SPEC 7 (Theme) completes:
- SPEC 8, SPEC 9, SPEC 10, SPEC 13 can run in parallel

---

## UI Enhancement Summary

| SPEC | Story | Tasks | Description |
|------|-------|-------|-------------|
| 7 | UI.1 | 4 | Theme System |
| 8 | UI.2 | 7 | Enhanced Homepage |
| 9 | UI.3 | 5 | Signup/Signin Redirect |
| 10 | UI.4 | 10 | Add Task Form with Date/Time |
| 11 | UI.5 | 6 | Task Card Design |
| 12 | UI.6 | 6 | Complete Task Interaction |
| 13 | UI.7 | 8 | Responsive Design |
| 14 | Polish | 6 | Final Touches |
| **Total** | - | **52** | - |

---

## Implementation Strategy for UI Enhancement

### MVP First (SPEC 7-9)

1. Complete SPEC 7: Theme system foundation
2. Complete SPEC 8: Enhanced homepage with feature cards
3. Complete SPEC 9: Auth redirect flow
4. **STOP and VALIDATE**: Professional look with working auth

### Full Feature (SPEC 7-12)

1. Complete MVP scope
2. Complete SPEC 10: Date/time pickers in task form
3. Complete SPEC 11: Task card design
4. Complete SPEC 12: Complete task interaction
5. **STOP and VALIDATE**: Full task lifecycle with professional UI

### Production Ready (All SPECs)

1. Complete Full Feature scope
2. Complete SPEC 13: Responsive design
3. Complete SPEC 14: Polish
4. Ready for production/demo

---

**Version**: 3.1.0 | **Updated**: 2026-01-18 | **Status**: All Phase III tasks COMPLETE
