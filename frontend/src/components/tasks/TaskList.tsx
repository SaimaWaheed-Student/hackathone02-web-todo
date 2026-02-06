'use client';

import { TaskItem } from './TaskItem';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Task } from '@/lib/types';

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  onToggleComplete: (taskId: string, completed: boolean) => Promise<unknown>;
  onUpdate: (taskId: string, title: string, description?: string, due_date?: string | null, due_time?: string | null) => Promise<unknown>;
  onDelete: (taskId: string) => Promise<unknown>;
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

  // T043 - Use EmptyState component for empty task list
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={
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
        }
        title="No tasks yet!"
        description="Create your first task to get started and stay organized."
      />
    );
  }

  // T044 - Enhanced TaskList container with consistent spacing
  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="task-item-wrapper"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <TaskItem
            task={task}
            onToggleComplete={onToggleComplete}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </div>
      ))}

      <style jsx>{`
        .task-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }
        .task-item-wrapper {
          animation: slideInUp 0.3s var(--ease-out-expo) both;
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
