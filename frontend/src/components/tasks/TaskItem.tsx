'use client';

import { useState } from 'react';
import type { Task } from '@/lib/types';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => Promise<unknown>;
  onUpdate: (taskId: string, title: string, description?: string, due_date?: string | null, due_time?: string | null) => Promise<unknown>;
  onDelete: (taskId: string) => Promise<unknown>;
}

// T036 - Date formatting helper
const formatTaskDate = (dateStr: string | null): string | null => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Check if it's today
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  // Check if it's tomorrow
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  // Otherwise return formatted date
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

// T037 - Time formatting helper
const formatTaskTime = (timeStr: string | null): string | null => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(':').map(Number);
  const isPM = hours >= 12;
  const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`;
};

export function TaskItem({
  task,
  onToggleComplete,
  onUpdate,
  onDelete,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggleComplete(task.id, !task.completed);
    } catch {
      // Error handled in parent
    } finally {
      setIsToggling(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;

    try {
      await onUpdate(
        task.id,
        editTitle.trim(),
        editDescription.trim() || undefined
      );
      setIsEditing(false);
    } catch {
      // Error handled in parent
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancelEdit();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      handleSaveEdit();
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(task.id);
    } catch {
      // Error handled in parent
    }
    setShowDeleteConfirm(false);
  };

  if (isEditing) {
    return (
      <div className="task-card editing" onKeyDown={handleKeyDown}>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="edit-title"
          autoFocus
          maxLength={255}
          aria-label="Task title"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="edit-description"
          rows={2}
          placeholder="Description (optional)"
          aria-label="Task description"
        />
        <div className="edit-actions">
          <button onClick={handleSaveEdit} className="btn-save">
            Save
          </button>
          <button onClick={handleCancelEdit} className="btn-cancel">
            Cancel
          </button>
        </div>
        <p className="keyboard-hint">Ctrl+Enter to save, Esc to cancel</p>

        <style jsx>{`
          .task-card {
            background: var(--background);
            padding: var(--spacing-lg);
            border-radius: var(--radius-lg);
            border: 1px solid var(--border);
            box-shadow: var(--shadow-sm);
            transition: all var(--transition-normal);
          }
          .task-card.editing {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);
          }
          .edit-title,
          .edit-description {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            font-size: var(--font-size-sm);
            font-family: inherit;
          }
          .edit-title:focus,
          .edit-description:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .edit-actions {
            display: flex;
            gap: var(--spacing-sm);
          }
          .btn-save,
          .btn-cancel {
            padding: var(--spacing-sm) var(--spacing-md);
            border: none;
            border-radius: var(--radius-md);
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-medium);
            cursor: pointer;
            transition: all var(--transition-fast);
          }
          .btn-save {
            background: var(--primary);
            color: white;
          }
          .btn-save:hover {
            background: var(--primary-hover);
          }
          .btn-cancel {
            background: var(--bg-secondary);
            color: var(--foreground);
          }
          .btn-cancel:hover {
            background: var(--border);
          }
          .keyboard-hint {
            font-size: var(--font-size-xs);
            color: var(--muted-light);
            text-align: center;
            margin-top: var(--spacing-sm);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="card-header">
        <span className={`status-badge ${task.completed ? 'done' : 'pending'}`}>
          {task.completed ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Completed
            </>
          ) : 'Pending'}
        </span>
        {/* T038 - Date and time with icons */}
        <div className="due-info-container">
          {task.due_date && (
            <div className="due-info">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{formatTaskDate(task.due_date)}</span>
            </div>
          )}
          {task.due_time && (
            <div className="due-info">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{formatTaskTime(task.due_time)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-body">
        <h3 className="task-title">{task.title}</h3>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
      </div>

      <div className="card-footer">
        <button
          onClick={handleToggle}
          className={`btn-complete ${task.completed ? 'completed' : ''}`}
          disabled={isToggling}
        >
          {isToggling ? (
            <span className="loading-spinner"></span>
          ) : task.completed ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Completed
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
              Complete Task
            </>
          )}
        </button>

        <div className="secondary-actions">
          <button onClick={() => setIsEditing(true)} className="btn-action btn-edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit
          </button>
          <button onClick={() => setShowDeleteConfirm(true)} className="btn-action btn-delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Delete
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-overlay">
          <div className="delete-modal">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>Are you sure you want to delete this task?</p>
            <div className="modal-actions">
              <button onClick={handleDelete} className="btn-confirm-delete">
                Delete
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-confirm-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* T042 - Enhanced task card with hover effects */
        .task-card {
          background: var(--background);
          padding: var(--spacing-lg);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-card);
          transition: all var(--transition-normal) var(--ease-out-expo);
          position: relative;
        }
        .task-card:hover {
          box-shadow: var(--shadow-card-hover);
          transform: translateY(-4px);
          border-color: var(--primary-light);
        }
        /* T040 - Completed task state styling */
        .task-card.completed {
          background: var(--bg-secondary);
          opacity: var(--opacity-completed);
          border-color: var(--success-light);
        }
        .task-card.completed:hover {
          opacity: 1;
          border-color: var(--success);
        }
        .task-card.completed .task-title {
          text-decoration: line-through;
          color: var(--muted);
          position: relative;
        }
        /* T041 - Strikethrough animation */
        .task-card.completed .task-title::after {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 100%;
          height: 2px;
          background: var(--muted);
          animation: strikethrough 0.3s var(--ease-out-expo) forwards;
        }
        @keyframes strikethrough {
          from { width: 0; }
          to { width: 100%; }
        }
        .task-card.completed .task-description {
          color: var(--muted-light);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-md);
          flex-wrap: wrap;
          gap: var(--spacing-sm);
        }
        /* T040 - Status badge with checkmark */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-semibold);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .status-badge.pending {
          background: var(--primary-light);
          color: var(--primary);
        }
        .status-badge.done {
          background: var(--success-light);
          color: var(--success);
        }
        /* T041 - Checkmark animation */
        .status-badge.done svg {
          animation: checkmark 0.4s var(--ease-spring) forwards;
        }
        @keyframes checkmark {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
        /* T038 - Date/time info container */
        .due-info-container {
          display: flex;
          gap: var(--spacing-md);
          flex-wrap: wrap;
        }
        .due-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: var(--font-size-xs);
          color: var(--muted);
          background: var(--bg-secondary);
          padding: 4px var(--spacing-sm);
          border-radius: var(--radius-md);
        }
        .due-info svg {
          color: var(--muted-light);
        }
        .card-body {
          margin-bottom: var(--spacing-lg);
        }
        .task-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: var(--foreground);
          margin: 0 0 var(--spacing-sm);
          word-break: break-word;
          line-height: var(--line-height-tight);
        }
        .task-description {
          font-size: var(--font-size-sm);
          color: var(--muted);
          margin: 0;
          line-height: var(--line-height-relaxed);
          word-break: break-word;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--spacing-md);
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--border);
        }
        /* T039 - Prominent Mark as Complete button */
        .btn-complete {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-lg);
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          transition: all var(--transition-fast) var(--ease-out-expo);
          box-shadow: var(--shadow-button);
        }
        .btn-complete:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
        }
        .btn-complete:active:not(:disabled) {
          transform: translateY(0);
        }
        .btn-complete:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .btn-complete.completed {
          background: var(--success);
          box-shadow: var(--shadow-button-success);
          cursor: default;
        }
        .btn-complete.completed:hover {
          background: var(--success);
          transform: none;
          box-shadow: var(--shadow-button-success);
        }
        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .secondary-actions {
          display: flex;
          gap: var(--spacing-sm);
        }
        .btn-action {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-sm) var(--spacing-md);
          border: none;
          border-radius: var(--radius-md);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: all var(--transition-fast) var(--ease-out-expo);
        }
        .btn-edit {
          background: var(--bg-tertiary);
          color: var(--foreground);
        }
        .btn-edit:hover {
          background: var(--border);
          transform: translateY(-1px);
        }
        .btn-delete {
          background: var(--error-light);
          color: var(--error);
        }
        .btn-delete:hover {
          background: #fee2e2;
          transform: translateY(-1px);
        }
        .delete-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.95);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .delete-modal {
          text-align: center;
          padding: var(--spacing-lg);
        }
        .delete-modal svg {
          color: var(--warning);
          margin-bottom: var(--spacing-md);
        }
        .delete-modal p {
          font-weight: var(--font-weight-medium);
          margin: 0 0 var(--spacing-lg);
        }
        .modal-actions {
          display: flex;
          gap: var(--spacing-sm);
          justify-content: center;
        }
        .btn-confirm-delete,
        .btn-confirm-cancel {
          padding: var(--spacing-sm) var(--spacing-lg);
          border: none;
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .btn-confirm-delete {
          background: var(--error);
          color: white;
        }
        .btn-confirm-delete:hover {
          background: #b91c1c;
        }
        .btn-confirm-cancel {
          background: var(--bg-secondary);
          color: var(--foreground);
        }
        .btn-confirm-cancel:hover {
          background: var(--border);
        }
      `}</style>
    </div>
  );
}
