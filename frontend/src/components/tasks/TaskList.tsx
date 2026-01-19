'use client';

import { TaskItem } from './TaskItem';
import type { Task } from '@/lib/types';

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  onToggleComplete: (taskId: string, completed: boolean) => Promise<void>;
  onUpdate: (taskId: string, title: string, description?: string) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

function TaskSkeleton() {
  return (
    <div className="task-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-badge"></div>
        <div className="skeleton-date"></div>
      </div>
      <div className="skeleton-title"></div>
      <div className="skeleton-description"></div>
      <div className="skeleton-footer">
        <div className="skeleton-button"></div>
        <div className="skeleton-actions">
          <div className="skeleton-action"></div>
          <div className="skeleton-action"></div>
        </div>
      </div>

      <style jsx>{`
        .task-skeleton {
          background: var(--background);
          padding: var(--spacing-lg);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
        }
        .skeleton-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--spacing-md);
        }
        .skeleton-badge {
          width: 70px;
          height: 20px;
          background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-tertiary) 50%, var(--bg-secondary) 75%);
          background-size: 200% 100%;
          border-radius: var(--radius-full);
          animation: shimmer 1.5s infinite;
        }
        .skeleton-date {
          width: 100px;
          height: 16px;
          background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-tertiary) 50%, var(--bg-secondary) 75%);
          background-size: 200% 100%;
          border-radius: var(--radius-sm);
          animation: shimmer 1.5s infinite;
        }
        .skeleton-title {
          width: 80%;
          height: 24px;
          background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-tertiary) 50%, var(--bg-secondary) 75%);
          background-size: 200% 100%;
          border-radius: var(--radius-sm);
          margin-bottom: var(--spacing-sm);
          animation: shimmer 1.5s infinite;
        }
        .skeleton-description {
          width: 60%;
          height: 16px;
          background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-tertiary) 50%, var(--bg-secondary) 75%);
          background-size: 200% 100%;
          border-radius: var(--radius-sm);
          margin-bottom: var(--spacing-lg);
          animation: shimmer 1.5s infinite;
        }
        .skeleton-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .skeleton-button {
          width: 120px;
          height: 36px;
          background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-tertiary) 50%, var(--bg-secondary) 75%);
          background-size: 200% 100%;
          border-radius: var(--radius-md);
          animation: shimmer 1.5s infinite;
        }
        .skeleton-actions {
          display: flex;
          gap: var(--spacing-sm);
        }
        .skeleton-action {
          width: 60px;
          height: 28px;
          background: linear-gradient(90deg, var(--bg-secondary) 25%, var(--bg-tertiary) 50%, var(--bg-secondary) 75%);
          background-size: 200% 100%;
          border-radius: var(--radius-md);
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}

export function TaskList({
  tasks,
  loading = false,
  onToggleComplete,
  onUpdate,
  onDelete,
}: TaskListProps) {
  if (loading && tasks.length === 0) {
    return (
      <div className="task-list">
        <TaskSkeleton />
        <TaskSkeleton />
        <TaskSkeleton />
        <style jsx>{`
          .task-list {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);
          }
        `}</style>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="empty-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="2" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
        </div>
        <p className="empty-title">No tasks yet!</p>
        <p className="empty-hint">Create your first task to get started.</p>
        <style jsx>{`
          .task-list-empty {
            text-align: center;
            padding: 3rem 1rem;
            color: var(--muted);
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .empty-icon {
            margin-bottom: 1rem;
            opacity: 0.5;
          }
          .empty-title {
            font-weight: 500;
            color: var(--foreground);
            margin: 0 0 0.25rem 0;
          }
          .empty-hint {
            font-size: 0.875rem;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}

      <style jsx>{`
        .task-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
      `}</style>
    </div>
  );
}
