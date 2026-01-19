'use client';

import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';
import type {
  Task,
  TaskCreate,
  TaskUpdate,
  TaskListResponse,
  TaskCompleteToggle,
} from '@/lib/types';

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export function useTasks() {
  const [state, setState] = useState<TasksState>({
    tasks: [],
    loading: false,
    error: null,
  });

  const fetchTasks = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await api.get<TaskListResponse>('/tasks');
      setState({ tasks: response.tasks, loading: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch tasks',
      }));
    }
  }, []);

  const createTask = useCallback(
    async (task: TaskCreate) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const newTask = await api.post<Task>('/tasks', task);
        setState((prev) => ({
          tasks: [newTask, ...prev.tasks],
          loading: false,
          error: null,
        }));
        return newTask;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to create task',
        }));
        throw err;
      }
    },
    []
  );

  const updateTask = useCallback(
    async (taskId: string, title: string, description?: string, due_date?: string | null, due_time?: string | null) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const updatedTask = await api.put<Task>(`/tasks/${taskId}`, {
          title,
          description,
          due_date,
          due_time,
        });
        setState((prev) => ({
          tasks: prev.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
          loading: false,
          error: null,
        }));
        return updatedTask;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to update task',
        }));
        throw err;
      }
    },
    []
  );

  const toggleComplete = useCallback(async (taskId: string, completed: boolean) => {
    // Optimistic update
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, completed } : t
      ),
    }));

    try {
      const toggleData: TaskCompleteToggle = { completed };
      const updatedTask = await api.patch<Task>(
        `/tasks/${taskId}/complete`,
        toggleData
      );
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
      }));
      return updatedTask;
    } catch (err) {
      // Revert optimistic update on error
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !completed } : t
        ),
        error: err instanceof Error ? err.message : 'Failed to toggle task',
      }));
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      await api.delete(`/tasks/${taskId}`);
      setState((prev) => ({
        tasks: prev.tasks.filter((t) => t.id !== taskId),
        loading: false,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to delete task',
      }));
      throw err;
    }
  }, []);

  const getTask = useCallback(async (taskId: string): Promise<Task | null> => {
    try {
      return await api.get<Task>(`/tasks/${taskId}`);
    } catch {
      return null;
    }
  }, []);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    ...state,
    fetchTasks,
    createTask,
    updateTask,
    toggleComplete,
    deleteTask,
    getTask,
  };
}
