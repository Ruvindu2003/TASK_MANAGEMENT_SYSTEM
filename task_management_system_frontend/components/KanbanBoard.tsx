'use client';

import React from 'react';
import { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onQuickAdd: (status: TaskStatus) => void;
}

interface ColumnConfig {
  status: TaskStatus;
  label: string;
  badgeBg: string;
  badgeText: string;
  dotColor: string;
}

const columns: ColumnConfig[] = [
  {
    status: 'TODO',
    label: 'To Do',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    dotColor: 'bg-slate-400',
  },
  {
    status: 'IN_PROGRESS',
    label: 'In Progress',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    dotColor: 'bg-blue-500',
  },
  {
    status: 'IN_REVIEW',
    label: 'In Review',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    dotColor: 'bg-purple-500',
  },
  {
    status: 'DONE',
    label: 'Done',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    dotColor: 'bg-emerald-500',
  },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onQuickAdd,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.status);

        return (
          <div
            key={col.status}
            className="bg-slate-50/70 rounded-3xl p-4 border border-slate-200/70 flex flex-col min-h-[500px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                <h3 className="font-semibold text-slate-800 text-sm">
                  {col.label}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${col.badgeBg} ${col.badgeText}`}
                >
                  {columnTasks.length}
                </span>
              </div>

              <button
                onClick={() => onQuickAdd(col.status)}
                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition shadow-2xs"
                title={`Add task to ${col.label}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Task Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {columnTasks.length > 0 ? (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))
              ) : (
                <div className="h-36 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
                  <span>No tasks in {col.label.toLowerCase()}</span>
                  <button
                    onClick={() => onQuickAdd(col.status)}
                    className="mt-2 text-blue-600 hover:underline font-medium text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add one
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
