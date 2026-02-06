'use client';

import { useState, FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { DatePicker } from '@/components/ui/DatePicker';
import { TimePicker } from '@/components/ui/TimePicker';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { TaskCreate } from '@/lib/types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: TaskCreate) => Promise<unknown>;
  loading?: boolean;
  initialValues?: {
    title?: string;
    description?: string;
    due_date?: string | null;
    due_time?: string | null;
  };
  mode?: 'create' | 'edit';
}

export function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  initialValues,
  mode = 'create',
}: TaskModalProps) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [dueDate, setDueDate] = useState<string | null>(initialValues?.due_date || null);
  const [dueTime, setDueTime] = useState<string | null>(initialValues?.due_time || null);
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    date?: string;
  }>({});
  const [submitError, setSubmitError] = useState('');

  const validateForm = (): boolean => {
    const errors: { title?: string; date?: string } = {};

    // T049 - Form validation
    if (!title.trim()) {
      errors.title = 'Title is required';
    } else if (title.length > 255) {
      errors.title = 'Title must be 255 characters or less';
    }

    // Date constraint validation
    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(dueDate);
      if (selectedDate < today) {
        errors.date = 'Due date cannot be in the past';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        due_date: dueDate,
        due_time: dueTime,
      });
      // Clear form and close on success
      setTitle('');
      setDescription('');
      setDueDate(null);
      setDueTime(null);
      setFieldErrors({});
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save task');
    }
  };

  const handleClose = () => {
    // Reset form on close
    if (mode === 'create') {
      setTitle('');
      setDescription('');
      setDueDate(null);
      setDueTime(null);
    }
    setFieldErrors({});
    setSubmitError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'create' ? 'Create New Task' : 'Edit Task'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="task-modal-form">
        {/* T050 - Inline error messages */}
        {submitError && (
          <div className="error-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {submitError}
          </div>
        )}

        <div className={`form-group ${fieldErrors.title ? 'has-error' : ''}`}>
          <label htmlFor="task-title">
            Title <span className="required">*</span>
          </label>
          <input
            type="text"
            id="task-title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (fieldErrors.title) setFieldErrors({ ...fieldErrors, title: undefined });
            }}
            placeholder="What needs to be done?"
            disabled={loading}
            maxLength={255}
            autoFocus
          />
          {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
          <span className="char-count">{title.length}/255</span>
        </div>

        <div className="form-group">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details (optional)"
            disabled={loading}
            rows={3}
          />
        </div>

        <div className={`form-row ${fieldErrors.date ? 'has-error' : ''}`}>
          <div className="form-group">
            <label>Due Date</label>
            <DatePicker
              value={dueDate}
              onChange={(date) => {
                setDueDate(date);
                if (fieldErrors.date) setFieldErrors({ ...fieldErrors, date: undefined });
              }}
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
        {fieldErrors.date && <span className="field-error date-error">{fieldErrors.date}</span>}

        {/* T051 - Modal buttons styling */}
        <div className="modal-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={loading || !title.trim()}
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                <span>Saving...</span>
              </>
            ) : mode === 'create' ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Create Task
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .task-modal-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }
        .error-banner {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          background: var(--error-light);
          color: var(--error);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
          position: relative;
        }
        .form-group.has-error input,
        .form-group.has-error textarea {
          border-color: var(--error);
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
        label {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--foreground);
        }
        .required {
          color: var(--error);
        }
        input,
        textarea {
          width: 100%;
          padding: var(--spacing-md);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-size: var(--font-size-base);
          font-family: inherit;
          background: var(--background);
          transition: all var(--transition-fast);
        }
        input:focus,
        textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: var(--shadow-input-focus);
        }
        input:disabled,
        textarea:disabled {
          background: var(--bg-secondary);
          cursor: not-allowed;
        }
        textarea {
          resize: vertical;
          min-height: 80px;
        }
        .field-error {
          font-size: var(--font-size-xs);
          color: var(--error);
        }
        .date-error {
          margin-top: calc(-1 * var(--spacing-sm));
        }
        .char-count {
          position: absolute;
          right: 0;
          top: 0;
          font-size: var(--font-size-xs);
          color: var(--muted-light);
        }
        .modal-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: flex-end;
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--border);
        }
        .btn-cancel {
          padding: var(--spacing-sm) var(--spacing-lg);
          background: transparent;
          color: var(--foreground);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .btn-cancel:hover:not(:disabled) {
          background: var(--bg-secondary);
          border-color: var(--muted-light);
        }
        .btn-cancel:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-xl);
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
        .btn-submit:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
    </Modal>
  );
}
