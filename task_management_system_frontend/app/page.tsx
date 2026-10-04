'use client';

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { useTaskStats } from '../hooks/useTaskStats';
import { Navbar } from '../components/Navbar';
import { StatsOverview } from '../components/StatsOverview';
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskList } from '../components/TaskList';
import { TaskModal } from '../components/TaskModal';
import { LoginModal } from '../components/LoginModal';
import { Task, TaskStatus, CreateTaskInput } from '../types';
import {
  CheckSquare,
  Sparkles,
  ArrowRight,
  Database,
  ShieldCheck,
  Zap,
  Kanban,
  ListTodo,
  LayoutDashboard,
} from 'lucide-react';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'kanban' | 'list'>('dashboard');

  // Task data & mutations
  const {
    tasks,
    loading: tasksLoading,
    filters,
    updateFilter,
    refetch: refetchTasks,
  } = useTasks();

  const { stats, loading: statsLoading, refreshStats } = useTaskStats();

  const handleMutationSuccess = () => {
    refetchTasks();
    refreshStats();
  };

  const {
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  } = useTaskMutations(handleMutationSuccess);

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleOpenCreateModal = (defaultStatus?: TaskStatus) => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = async (data: CreateTaskInput) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">
            Initializing TaskPulse...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 text-slate-900">
      <Navbar
        onOpenCreateModal={() => handleOpenCreateModal()}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          /* Unauthenticated Landing / Hero View */
          <div className="py-12 lg:py-20 flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Fullstack Architecture Complete & Live</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Manage Tasks with <br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600">
                Speed, Precision & Flow
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Engineered with <strong>NestJS</strong> modular backend, <strong>PostgreSQL</strong> database, <strong>Google Firebase Auth</strong>, and reactive <strong>Next.js</strong> custom hooks.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-2xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Sign In with Google</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-6 py-3.5 rounded-2xl shadow-xs transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Instant Demo Mode</span>
              </button>
            </div>

            {/* Architecture Highlights */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left w-full">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  PostgreSQL & TypeORM
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Connected to <code className="bg-slate-100 px-1 py-0.5 rounded">task_management_system</code> on port 5432 with auto-synchronized relational schemas.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Google & Firebase Auth
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  OAuth popup flow with Firebase Web SDK and verified by NestJS backend Bearer tokens.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Custom React Hooks
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Dedicated hooks (<code className="bg-slate-100 px-1 py-0.5 rounded">useTasks</code>, <code className="bg-slate-100 px-1 py-0.5 rounded">useTaskMutations</code>, <code className="bg-slate-100 px-1 py-0.5 rounded">useTaskStats</code>) for reactive UI.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard / Views */
          <div>
            {/* Top view controls on mobile */}
            <div className="flex md:hidden items-center justify-between mb-6 bg-slate-100 p-1 rounded-2xl">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                  activeView === 'dashboard'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('kanban')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                  activeView === 'kanban'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                Kanban
              </button>
              <button
                onClick={() => setActiveView('list')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                  activeView === 'list'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                List View
              </button>
            </div>

            {/* Dashboard View */}
            {activeView === 'dashboard' && (
              <div className="space-y-8">
                {/* Stats cards & completion progress */}
                <StatsOverview stats={stats} loading={statsLoading} />

                {/* Split Section: Kanban Quick Preview & Recent Tasks */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Kanban Quick View (2 cols) */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Kanban className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-bold text-slate-900">
                          Active Sprint Board
                        </h2>
                      </div>
                      <button
                        onClick={() => setActiveView('kanban')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Expand Kanban <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <KanbanBoard
                      tasks={tasks}
                      onEdit={handleOpenEditModal}
                      onDelete={deleteTask}
                      onStatusChange={updateTaskStatus}
                      onQuickAdd={handleOpenCreateModal}
                    />
                  </div>

                  {/* Task Table Preview (1 col) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ListTodo className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-bold text-slate-900">
                          Quick Task List
                        </h2>
                      </div>
                      <button
                        onClick={() => setActiveView('list')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        View All <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <TaskList
                      tasks={tasks.slice(0, 6)}
                      filters={filters}
                      onUpdateFilter={updateFilter}
                      onEdit={handleOpenEditModal}
                      onDelete={deleteTask}
                      onStatusChange={updateTaskStatus}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Dedicated Kanban View */}
            {activeView === 'kanban' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Kanban Board
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Drag, track and transition tasks across development stages
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenCreateModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    + Add New Task
                  </button>
                </div>

                <KanbanBoard
                  tasks={tasks}
                  onEdit={handleOpenEditModal}
                  onDelete={deleteTask}
                  onStatusChange={updateTaskStatus}
                  onQuickAdd={handleOpenCreateModal}
                />
              </div>
            )}

            {/* Dedicated List View */}
            {activeView === 'list' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      All Tasks
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Search, sort, filter and manage tasks in a clean tabular view
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenCreateModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    + Add New Task
                  </button>
                </div>

                <TaskList
                  tasks={tasks}
                  filters={filters}
                  onUpdateFilter={updateFilter}
                  onEdit={handleOpenEditModal}
                  onDelete={deleteTask}
                  onStatusChange={updateTaskStatus}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Task Create / Edit Dialog */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleTaskSubmit}
        initialTask={editingTask}
      />

      {/* Google Login Dialog */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        canClose={true}
      />
    </div>
  );
}
