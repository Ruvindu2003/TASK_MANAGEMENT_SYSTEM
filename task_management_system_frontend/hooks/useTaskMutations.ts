'use client';

import { useState } from 'react';
import { apiClient } from '../lib/api';
import { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from '../types';

export function useTaskMutations(onSuccess?: () => void) {
  const [isMutating, setIsMutating] = useState<boolean>(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const createTask = async (input: CreateTaskInput): Promise<Task> => {
    try {
      setIsMutating(true);
      setMutationError(null);
      const created: any = await apiClient.post('/tasks', input);
      if (onSuccess) onSuccess();
      return created;
    } catch (err: any) {
      setMutationError(err.message || 'Failed to create task');
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const updateTask = async (id: string, input: UpdateTaskInput): Promise<Task> => {
    try {
      setIsMutating(true);
      setMutationError(null);
      const updated: any = await apiClient.patch(`/tasks/${id}`, input);
      if (onSuccess) onSuccess();
      return updated;
    } catch (err: any) {
      setMutationError(err.message || 'Failed to update task');
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const updateTaskStatus = async (
    id: string,
    status: TaskStatus,
  ): Promise<Task> => {
    try {
      setIsMutating(true);
      setMutationError(null);
      const updated: any = await apiClient.patch(`/tasks/${id}/status`, { status });
      if (onSuccess) onSuccess();
      return updated;
    } catch (err: any) {
      setMutationError(err.message || 'Failed to update task status');
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    try {
      setIsMutating(true);
      setMutationError(null);
      await apiClient.delete(`/tasks/${id}`);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setMutationError(err.message || 'Failed to delete task');
      throw err;
    } finally {
      setIsMutating(false);
    }
  };

  return {
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    isMutating,
    mutationError,
  };
}
