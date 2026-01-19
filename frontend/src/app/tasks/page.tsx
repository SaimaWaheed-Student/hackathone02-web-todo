'use client';

import Link from 'next/link';
import { useTasks } from '@/hooks/useTasks';
import { TaskList } from '@/components/tasks/TaskList';

export default function TasksPage() {
  const {
    tasks,
    loading,
    error,
    toggleComplete,
    updateTask,
    deleteTask,
  } = useTasks();

  return (
    <div className="tasks-page">
      <div className="tasks-container">
        <header className="tasks-header">
          <div>
            <h1>My Tasks</h1>
            <p className="tasks-subtitle">
              {tasks.length === 0
                ? 'No tasks yet'
                : `${tasks.length} task${tasks.length === 1 ? '' : 's'}`}
            </p>
          </div>
          <Link href="/tasks/new" className="btn-create">
            + New Task
          </Link>
        </header>

        {error && <div className="error-banner">{error}</div>}

        <TaskList
          tasks={tasks}
          loading={loading}
          onToggleComplete={toggleComplete}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      </div>

      <style jsx>{`
        .tasks-page {
          min-height: calc(100vh - 80px);
          background: var(--bg-secondary);
          padding: 1.5rem 1rem;
        }
        .tasks-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .tasks-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .tasks-header h1 {
          font-size: 1.5rem;
          margin: 0 0 0.25rem 0;
        }
        .tasks-subtitle {
          color: var(--muted);
          font-size: 0.875rem;
          margin: 0;
        }
        .btn-create {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: var(--primary);
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.875rem;
          transition: background 0.15s;
        }
        .btn-create:hover {
          background: var(--primary-hover);
        }
        .error-banner {
          background: #fef2f2;
          color: var(--error);
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}
