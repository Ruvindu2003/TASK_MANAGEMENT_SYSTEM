'use client';

import React from 'react';
import { Task, TaskPriority, TaskStatus, TaskFilters } from '../types';
import {
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Calendar,
  Trash2,
  Edit2,
  ArrowUpDown,
  AlertCircle,
} from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  filters: TaskFilters;
  onUpdateFilter: (key: keyof TaskFilters, value: any) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filters,
  onUpdateFilter,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Search and Filters Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={filters.search || ''}
            onChange={(e) => onUpdateFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={filters.status || ''}
            onChange={(e) => onUpdateFilter('status', e.target.value || undefined)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DONE">Done</option>
          </select>

          {/* Priority filter */}
          <select
            value={filters.priority || ''}
            onChange={(e) =>
              onUpdateFilter('priority', e.target.value || undefined)
            }
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          {/* Sort By */}
          <select
            value={filters.sortBy || 'createdAt'}
            onChange={(e) => onUpdateFilter('sortBy', e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="createdAt">Newest First</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Task Rows */}
      <div className="divide-y divide-slate-100">
        {tasks.length > 0 ? (
          tasks.map((task) => {
            const isDone = task.status === 'DONE';
            const isOverdue =
              task.dueDate &&
              new Date(task.dueDate) < new Date() &&
              !isDone;

            return (
              <div
                key={task.id}
                className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition group"
              >
                {/* Left: Complete toggle + Title/Description */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() =>
                      onStatusChange(task.id, isDone ? 'TODO' : 'DONE')
                    }
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <h4
                      className={`text-sm font-semibold truncate ${
                        isDone ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Badges & Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Priority Badge */}
                  <span
                    className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                      task.priority === 'URGENT'
                        ? 'bg-rose-50 text-rose-700'
                        : task.priority === 'HIGH'
                        ? 'bg-amber-50 text-amber-700'
                        : task.priority === 'LOW'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {task.priority}
                  </span>

                  {/* Due Date */}
                  {task.dueDate && (
                    <span
                      className={`hidden md:inline-flex items-center gap-1 text-xs ${
                        isOverdue
                          ? 'text-rose-600 font-semibold'
                          : 'text-slate-500'
                      }`}
                    >
                      {isOverdue && <AlertCircle className="w-3.5 h-3.5" />}
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(task.dueDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  )}

                  {/* Status Dropdown */}
                  <select
                    value={task.status}
                    onChange={(e) =>
                      onStatusChange(task.id, e.target.value as TaskStatus)
                    }
                    className="text-xs bg-slate-100 hover:bg-slate-200/70 border-0 rounded-lg px-2.5 py-1 font-medium text-slate-700 outline-hidden cursor-pointer"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="DONE">Done</option>
                  </select>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(task)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this task?')) onDelete(task.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center text-slate-400 text-sm">
            <p>No tasks match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};
