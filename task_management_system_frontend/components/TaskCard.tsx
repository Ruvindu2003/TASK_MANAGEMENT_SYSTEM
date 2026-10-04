'use client';

import React from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import {
  Calendar,
  Clock,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Edit2,
  AlertCircle,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const priorityStyles: Record<TaskPriority, { bg: string; text: string; border: string }> = {
  LOW: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  MEDIUM: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  HIGH: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  URGENT: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
};

const statusLabels: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  IN_REVIEW: 'In Review',
  DONE: 'Done',
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'DONE';

  const priorityStyle = priorityStyles[task.priority] || priorityStyles.MEDIUM;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null;
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return null;
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl p-3.5 sm:p-4 border transition-all duration-200 shadow-xs hover:shadow-md group overflow-hidden ${
        task.status === 'DONE'
          ? 'border-slate-200/60 opacity-75'
          : 'border-slate-200 hover:border-blue-200'
      }`}
    >
      {/* Top Header: Priority & Action buttons */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
        >
          {task.priority}
        </span>

        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            title="Edit task"
            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this task?')) {
                onDelete(task.id);
              }
            }}
            title="Delete task"
            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Task Title */}
      <h4
        className={`text-sm sm:text-base font-semibold leading-snug tracking-tight mb-1 text-slate-900 break-words ${
          task.status === 'DONE' ? 'line-through text-slate-400' : ''
        }`}
      >
        {task.title}
      </h4>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed break-words">
          {task.description}
        </p>
      )}

      {/* Footer Info: Due Date, Category, and Status changer */}
      <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-y-2 gap-x-1.5 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          {task.dueDate ? (
            <span
              className={`inline-flex items-center gap-1 font-medium whitespace-nowrap text-[11px] ${
                isOverdue
                  ? 'text-rose-600 font-semibold'
                  : 'text-slate-500'
              }`}
            >
              {isOverdue ? (
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
              ) : (
                <Calendar className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="whitespace-nowrap">{formatDate(task.dueDate)}</span>
            </span>
          ) : (
            <span className="text-slate-400 text-[11px] whitespace-nowrap">No due date</span>
          )}

          {task.category && (
            <span
              className="px-1.5 py-0.5 rounded-md text-[10px] font-medium truncate max-w-[70px] whitespace-nowrap"
              title={task.category.name}
              style={{
                backgroundColor: `${task.category.color}15`,
                color: task.category.color,
              }}
            >
              {task.category.name}
            </span>
          )}
        </div>

        {/* Quick status selector */}
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          className="text-[11px] font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 outline-hidden cursor-pointer max-w-[105px] truncate shrink-0 ml-auto"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="DONE">Done</option>
        </select>
      </div>
    </div>
  );
};
