'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/api';
import { Task, TaskFilters } from '../types';
import { useAuth } from './useAuth';

export function useTasks(initialFilters: TaskFilters = {}) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>(initialFilters);

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Clean query params
      const params: Record<string, string> = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.search) params.search = filters.search;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.sortOrder) params.sortOrder = filters.sortOrder;

      const data: any = await apiClient.get('/tasks', { params });
      setTasks(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const updateFilter = useCallback((key: keyof TaskFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    tasks,
    loading,
    error,
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    refetch: fetchTasks,
  };
}
