# Quickstart Guide: Professional UI/UX Enhancement

**Feature**: 003-professional-ui-ux
**Date**: 2026-02-05

## Prerequisites

- Node.js 18+ installed
- Git repository cloned
- On branch `003-professional-ui-ux`

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

No new dependencies required - all enhancements use existing packages.

### 2. Start Development Server

```bash
npm run dev
```

Application runs at `http://localhost:3000`

### 3. Verify Current State

Before making changes, verify existing functionality:

1. **Home Page**: http://localhost:3000
   - Hero section visible
   - Feature buttons work

2. **Auth Pages**:
   - Sign in: http://localhost:3000/signin
   - Sign up: http://localhost:3000/signup

3. **Tasks**: http://localhost:3000/tasks
   - Task list loads (if authenticated)
   - Create task works

4. **Chat**: Click chat button (if authenticated)
   - Chat window opens
   - Messages send/receive

---

## Development Workflow

### Step 1: Extend Theme Tokens

Edit `frontend/src/app/globals.css`:

```css
/* Add after existing :root tokens */

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

  /* Z-Index Scale */
  --z-dropdown: 100;
  --z-modal-backdrop: 150;
  --z-modal: 200;
  --z-chat: 300;
  --z-toast: 400;

  /* Component Dimensions */
  --chat-panel-width: 420px;
  --modal-max-width-md: 500px;
  --action-card-min-width: 160px;
}
```

### Step 2: Create Base UI Components

Create these files in order:

1. `frontend/src/components/ui/LoadingSpinner.tsx`
2. `frontend/src/components/ui/Modal.tsx`
3. `frontend/src/components/ui/EmptyState.tsx`

### Step 3: Enhance Auth Pages

Update in order:
1. `frontend/src/app/(auth)/signin/page.tsx`
2. `frontend/src/app/(auth)/signup/page.tsx`

### Step 4: Enhance Home Page

Update in order:
1. `frontend/src/components/home/ActionCard.tsx` (new)
2. `frontend/src/components/home/ActionCardGrid.tsx` (new)
3. `frontend/src/app/page.tsx`

### Step 5: Enhance Task Components

Update in order:
1. `frontend/src/components/tasks/TaskItem.tsx`
2. `frontend/src/components/tasks/TaskList.tsx`
3. `frontend/src/components/tasks/TaskModal.tsx` (new)

### Step 6: Enhance Chat Components

Update in order:
1. `frontend/src/components/chat/ChatPanel.tsx` (new)
2. `frontend/src/components/chat/ChatButton.tsx`
3. `frontend/src/components/chat/ChatWindow.tsx`
4. `frontend/src/components/chat/MessageItem.tsx`
5. `frontend/src/components/chat/ChatWidget.tsx`

---

## Testing Checklist

### Visual Testing

- [ ] Auth pages: Centered form, gradient background
- [ ] Home page: 5 action cards in grid
- [ ] Task list: Date/time displayed, completion states
- [ ] Add Task: Modal opens with form
- [ ] Chat: Slide-in panel from right

### Responsive Testing

Test at these widths:
- [ ] 320px (iPhone SE)
- [ ] 375px (iPhone 12)
- [ ] 640px (tablet breakpoint)
- [ ] 1024px (desktop breakpoint)
- [ ] 1440px (large desktop)

### Interaction Testing

- [ ] Card hover effects work
- [ ] Modal open/close animations smooth
- [ ] Chat panel slide animation smooth
- [ ] Task completion animation plays
- [ ] Loading spinners appear

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Common Issues

### CSS Variables Not Working

Ensure `globals.css` is imported in `layout.tsx`:
```tsx
import './globals.css'
```

### Animations Janky on Mobile

Use only `transform` and `opacity` for animations. Avoid animating:
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `box-shadow` (use pseudo-element instead)

### Modal Not Closing on Backdrop Click

Ensure click handler is on backdrop, not content:
```tsx
<div className="backdrop" onClick={onClose}>
  <div className="content" onClick={e => e.stopPropagation()}>
    {children}
  </div>
</div>
```

### Chat Panel Behind Other Elements

Check z-index order:
```css
.chat-panel {
  z-index: var(--z-chat); /* 300 */
}
```

---

## File Structure After Enhancement

```
frontend/src/
├── app/
│   ├── globals.css              ✅ Extended
│   ├── page.tsx                 ✅ Enhanced
│   ├── (auth)/
│   │   ├── signin/page.tsx      ✅ Redesigned
│   │   └── signup/page.tsx      ✅ Redesigned
│   └── tasks/
│       └── page.tsx             ✅ Enhanced
├── components/
│   ├── ui/
│   │   ├── Modal.tsx            ✅ New
│   │   ├── EmptyState.tsx       ✅ New
│   │   └── LoadingSpinner.tsx   ✅ New
│   ├── home/
│   │   ├── ActionCard.tsx       ✅ New
│   │   └── ActionCardGrid.tsx   ✅ New
│   ├── tasks/
│   │   ├── TaskItem.tsx         ✅ Enhanced
│   │   ├── TaskList.tsx         ✅ Enhanced
│   │   └── TaskModal.tsx        ✅ New
│   └── chat/
│       ├── ChatPanel.tsx        ✅ New
│       ├── ChatButton.tsx       ✅ Enhanced
│       ├── ChatWindow.tsx       ✅ Refactored
│       └── MessageItem.tsx      ✅ Enhanced
```

---

## Next Steps

After completing the quickstart:

1. Run `/sp.tasks` to generate detailed implementation tasks
2. Implement tasks in dependency order
3. Test each component after implementation
4. Final visual polish and consistency check
