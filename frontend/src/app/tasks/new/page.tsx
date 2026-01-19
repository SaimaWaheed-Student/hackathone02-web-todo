'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTasks } from '@/hooks/useTasks';

export default function NewTaskPage() {
  const router = useRouter();
  const { createTask, loading } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate title
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (title.length > 255) {
      setError('Title must be less than 255 characters');
      return;
    }

    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || null,
      });
      router.push('/tasks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  return (
    <div className="new-task-page">
      <div className="new-task-container">
        <header className="page-header">
          <Link href="/tasks" className="back-link">
            &larr; Back to tasks
          </Link>
          <h1>Create New Task</h1>
        </header>

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
              required
              disabled={loading}
              maxLength={255}
            />
            <span className="char-count">{title.length}/255</span>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              disabled={loading}
              rows={4}
            />
          </div>

          <div className="form-actions">
            <Link href="/tasks" className="btn-cancel">
              Cancel
            </Link>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .new-task-page {
          min-height: calc(100vh - 80px);
          background: var(--bg-secondary);
          padding: 1.5rem 1rem;
        }
        .new-task-container {
          max-width: 600px;
          margin: 0 auto;
        }
        .page-header {
          margin-bottom: 1.5rem;
        }
        .back-link {
          display: inline-block;
          color: var(--muted);
          text-decoration: none;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        .back-link:hover {
          color: var(--foreground);
        }
        .page-header h1 {
          font-size: 1.5rem;
          margin: 0;
        }
        .task-form {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .form-group {
          margin-bottom: 1.25rem;
          position: relative;
        }
        .form-group label {
          display: block;
          font-weight: 500;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }
        .char-count {
          position: absolute;
          right: 0;
          top: 0;
          font-size: 0.75rem;
          color: var(--muted);
        }
        .error-message {
          background: #fef2f2;
          color: var(--error);
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }
        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
        .btn-cancel {
          padding: 0.75rem 1.25rem;
          background: white;
          color: var(--foreground);
          border: 1px solid var(--border);
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.875rem;
        }
        .btn-cancel:hover {
          background: var(--bg-secondary);
        }
        .btn-submit {
          padding: 0.75rem 1.25rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
        }
        .btn-submit:hover:not(:disabled) {
          background: var(--primary-hover);
        }
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
