# Design Tokens Contract: Professional UI/UX Enhancement

**Feature**: 003-professional-ui-ux
**Date**: 2026-02-05
**Status**: Complete

## Overview

This document specifies the enhanced design tokens to be added to `globals.css`. These tokens extend the existing system without breaking changes.

---

## Token Categories

### 1. Gradient Tokens

```css
/* Primary gradient - Hero backgrounds, primary CTAs */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Secondary gradient - Accent elements */
--gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

/* Chat user message gradient */
--gradient-chat-user: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);

/* Chat bot message gradient */
--gradient-chat-bot: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);

/* Auth page background gradient */
--gradient-auth-bg: linear-gradient(135deg, var(--primary-light) 0%, var(--bg-secondary) 100%);

/* Success action gradient */
--gradient-success: linear-gradient(135deg, #10b981 0%, #34d399 100%);
```

### 2. Enhanced Shadow Tokens

```css
/* Standard card shadow - cards, panels */
--shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.08),
               0 2px 4px -1px rgba(0, 0, 0, 0.04);

/* Card hover state - elevated appearance */
--shadow-card-hover: 0 10px 20px -5px rgba(0, 0, 0, 0.12),
                     0 4px 6px -2px rgba(0, 0, 0, 0.06);

/* Modal shadow - highest elevation */
--shadow-modal: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Primary button glow */
--shadow-button: 0 4px 14px 0 rgba(37, 99, 235, 0.25);

/* Success button glow */
--shadow-button-success: 0 4px 14px 0 rgba(16, 185, 129, 0.25);

/* Chat panel shadow */
--shadow-chat-panel: -4px 0 20px rgba(0, 0, 0, 0.15);

/* Input focus shadow */
--shadow-input-focus: 0 0 0 3px rgba(37, 99, 235, 0.15);
```

### 3. Animation Timing Functions

```css
/* Smooth deceleration - modals, panels opening */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

/* Smooth acceleration and deceleration */
--ease-in-out-expo: cubic-bezier(0.87, 0, 0.13, 1);

/* Subtle bounce - completion animations */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Spring effect - button feedback */
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### 4. Z-Index Scale

```css
/* Dropdown menus, tooltips */
--z-dropdown: 100;

/* Modal backdrop layer */
--z-modal-backdrop: 150;

/* Modal content layer */
--z-modal: 200;

/* Chat panel (always accessible) */
--z-chat: 300;

/* Toast notifications (highest priority) */
--z-toast: 400;
```

### 5. Component Dimension Tokens

```css
/* Chat panel width */
--chat-panel-width: 420px;
--chat-panel-width-mobile: 100vw;

/* Modal max widths */
--modal-max-width-sm: 400px;
--modal-max-width-md: 500px;
--modal-max-width-lg: 640px;

/* Action card dimensions */
--action-card-min-width: 160px;
--action-card-icon-size: 48px;

/* Form field heights */
--input-height: 48px;
--input-height-sm: 40px;

/* Button heights */
--button-height: 48px;
--button-height-sm: 40px;
--button-height-lg: 56px;
```

### 6. Opacity Tokens

```css
/* Completed task opacity */
--opacity-completed: 0.7;

/* Disabled state opacity */
--opacity-disabled: 0.5;

/* Backdrop overlay opacity */
--opacity-backdrop: 0.5;

/* Hover overlay opacity */
--opacity-hover: 0.04;
```

---

## Animation Keyframes

Add to `globals.css`:

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes checkmark {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes strikethrough {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

---

## Utility Classes

Add to `globals.css`:

```css
/* Animation utilities */
.animate-fade-in {
  animation: fadeIn var(--transition-normal) var(--ease-out-expo);
}

.animate-slide-in-right {
  animation: slideInRight 300ms var(--ease-out-expo);
}

.animate-slide-in-up {
  animation: slideInUp var(--transition-normal) var(--ease-out-expo);
}

.animate-scale-in {
  animation: scaleIn var(--transition-normal) var(--ease-out-expo);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

/* Transition utilities */
.transition-transform {
  transition: transform var(--transition-normal);
}

.transition-opacity {
  transition: opacity var(--transition-normal);
}

.transition-shadow {
  transition: box-shadow var(--transition-normal);
}

.transition-all {
  transition: all var(--transition-normal);
}

/* Hover utilities */
.hover-lift:hover {
  transform: translateY(-4px);
}

.hover-scale:hover {
  transform: scale(1.02);
}

.hover-shadow:hover {
  box-shadow: var(--shadow-card-hover);
}

/* State utilities */
.is-completed {
  opacity: var(--opacity-completed);
}

.is-disabled {
  opacity: var(--opacity-disabled);
  pointer-events: none;
}
```

---

## Color Reference Chart

| Token | Value | Usage |
|-------|-------|-------|
| `--gradient-primary` | #667eea → #764ba2 | Hero, primary CTAs |
| `--gradient-secondary` | #f093fb → #f5576c | Accent elements |
| `--gradient-chat-user` | #2563eb → #3b82f6 | User message bubbles |
| `--gradient-chat-bot` | #6366f1 → #8b5cf6 | Bot message bubbles |
| `--gradient-success` | #10b981 → #34d399 | Success actions |

---

## Shadow Reference Chart

| Token | Elevation | Usage |
|-------|-----------|-------|
| `--shadow-card` | Low | Default cards, panels |
| `--shadow-card-hover` | Medium | Hovered cards |
| `--shadow-modal` | High | Modal dialogs |
| `--shadow-button` | Glow | Primary buttons |
| `--shadow-chat-panel` | Directional | Chat slide-in panel |

---

## Backward Compatibility

All new tokens are additive. Existing tokens remain unchanged:

| Existing Token | Status | Notes |
|---------------|--------|-------|
| `--primary` | Unchanged | #2563eb |
| `--shadow-sm/md/lg/xl` | Unchanged | Keep for backward compat |
| `--radius-*` | Unchanged | All radius values preserved |
| `--spacing-*` | Unchanged | All spacing values preserved |
| `--font-size-*` | Unchanged | All typography preserved |
| `--transition-*` | Unchanged | fast/normal/slow preserved |

---

## Implementation Notes

1. **Add tokens at end of `:root`** - Keep existing tokens first for clarity
2. **Use semantic names** - Tokens describe purpose, not visual property
3. **Keyframes go after `:root`** - Before utility classes
4. **Utility classes are optional** - Components can use tokens directly
5. **Test in all browsers** - Especially gradients and animations
