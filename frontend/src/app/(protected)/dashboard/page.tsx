'use client';

import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskList } from '@/components/tasks/TaskList';

export default function DashboardPage() {
  const { logout } = useAuth();
  const {
    tasks,
    loading,
    error,
    createTask,
    toggleComplete,
    updateTask,
    deleteTask,
  } = useTasks();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>My Tasks</h1>
        <button onClick={logout} className="btn-logout">
          Sign Out
        </button>
      </header>

      <main className="dashboard-main">
        {error && <div className="error-banner">{error}</div>}

        <TaskForm onSubmit={createTask} loading={loading} />

        <TaskList
          tasks={tasks}
          loading={loading}
          onToggleComplete={toggleComplete}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      </main>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: #f9fafb;
        }
        .dashboard-header {
          background: white;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
        }
        .dashboard-header h1 {
          font-size: 1.25rem;
          margin: 0;
        }
        .btn-logout {
          padding: 0.5rem 1rem;
          background: #f3f4f6;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          color: #374151;
        }
        .btn-logout:hover {
          background: #e5e7eb;
        }
        .dashboard-main {
          max-width: 600px;
          margin: 0 auto;
          padding: 1.5rem;
        }
        .error-banner {
          background: #fef2f2;
          color: #dc2626;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}
