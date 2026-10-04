'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/api';
import { TaskSummary } from '../types';
import { useAuth } from './useAuth';

export function useTaskStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<TaskSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user) {
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data: any = await apiClient.get('/analytics/summary');
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch task metrics');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats,
  };
}
