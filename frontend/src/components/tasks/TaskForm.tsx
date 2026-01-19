'use client';

import { useState, FormEvent } from 'react';
import { DatePicker } from '@/components/ui/DatePicker';
import { TimePicker } from '@/components/ui/TimePicker';
import type { TaskCreate } from '@/lib/types';

interface TaskFormProps {
  onSubmit: (task: TaskCreate) => Promise<unknown>;
  loading?: boolean;
  initialValues?: {
    title?: string;
    description?: string;
    due_date?: string | null;
    due_time?: string | null;
  };
  submitLabel?: string;
}

export function TaskForm({
  onSubmit,
  loading = false,
  initialValues,
  submitLabel = 'Add Task'
}: TaskFormProps) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [dueDate, setDueDate] = useState<string | null>(initialValues?.due_date || null);
  const [dueTime, setDueTime] = useState<string | null>(initialValues?.due_time || null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (title.length > 255) {
      setError('Title must be 255 characters or less');
      return;
    }

    // Validate that date is not in the past
    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(dueDate);
      if (selectedDate < today) {
        setError('Due date cannot be in the past');
        return;
      }
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        due_date: dueDate,
        due_time: dueTime,
      });
      // Clear form on success (only for new tasks)
      if (!initialValues) {
        setTitle('');
        setDescription('');
        setDueDate(null);
        setDueTime(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          disabled={loading}
          className="task-title-input"
          maxLength={255}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details (optional)"
          disabled={loading}
          rows={3}
          className="task-description-input"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Due Date</label>
          <DatePicker
            value={dueDate}
            onChange={setDueDate}
            placeholder="Select due date"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Due Time</label>
          <TimePicker
            value={dueTime}
            onChange={setDueTime}
            placeholder="Select time"
            disabled={loading}
          />
        </div>
      </div>

      <button type="submit" className="btn-submit" disabled={loading || !title.trim()}>
        {loading ? 'Saving...' : submitLabel}
      </button>

      <style jsx>{`
        .task-form {
          background: var(--background);
          padding: var(--spacing-xl);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
        }
        .form-group {
          margin-bottom: var(--spacing-lg);
        }
        .form-group label {
          display: block;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--foreground);
          margin-bottom: var(--spacing-sm);
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--spacing-md);
        }
        @media (min-width: 640px) {
          .form-row {
            grid-template-columns: 1fr 1fr;
          }
        }
        .task-title-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-size: var(--font-size-base);
          transition: all var(--transition-fast);
        }
        .task-description-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          resize: vertical;
          font-family: inherit;
          transition: all var(--transition-fast);
        }
        .task-title-input:focus,
        .task-description-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .task-title-input:disabled,
        .task-description-input:disabled {
          background: var(--bg-secondary);
          cursor: not-allowed;
        }
        .btn-submit {
          width: 100%;
          padding: 0.875rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .btn-submit:hover:not(:disabled) {
          background: var(--primary-hover);
        }
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .error-message {
          background: var(--error-light);
          color: var(--error);
          padding: 0.75rem;
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-md);
        }
      `}</style>
    </form>
  );
}
