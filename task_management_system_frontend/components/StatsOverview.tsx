'use client';

import React from 'react';
import { TaskSummary } from '../types';
import { CheckCircle2, Clock, AlertTriangle, Layers, TrendingUp } from 'lucide-react';

interface StatsOverviewProps {
  stats: TaskSummary | null;
  loading: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, loading }) => {
  if (loading && !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-100 rounded-2xl border border-slate-200" />
        ))}
      </div>
    );
  }

  const s = stats || {
    total: 0,
    todo: 0,
    inProgress: 0,
    inReview: 0,
    done: 0,
    overdue: 0,
    highPriority: 0,
    completionRate: 0,
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Tasks
            </span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{s.total}</span>
            <span className="text-xs text-slate-500 font-medium">all active items</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              In Progress
            </span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {s.inProgress + s.inReview}
            </span>
            <span className="text-xs text-amber-600 font-medium">in execution</span>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completed
            </span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{s.done}</span>
            <span className="text-xs text-emerald-600 font-medium">
              {s.completionRate}% finished
            </span>
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Overdue
            </span>
            <div
              className={`p-2.5 rounded-xl ${
                s.overdue > 0
                  ? 'bg-rose-50 text-rose-600 animate-pulse'
                  : 'bg-slate-50 text-slate-400'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold ${
                s.overdue > 0 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {s.overdue}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {s.overdue > 0 ? 'needs attention' : 'on schedule'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar Widget */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-slate-800">
              Sprint Completion Rate
            </span>
          </div>
          <span className="text-sm font-bold text-slate-900">
            {s.completionRate}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-linear-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${s.completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};
