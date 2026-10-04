'use client';

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { CheckSquare, Plus, LogOut, User as UserIcon, LogIn } from 'lucide-react';

interface NavbarProps {
  onOpenCreateModal: () => void;
  onOpenLoginModal: () => void;
  activeView: 'dashboard' | 'kanban' | 'list';
  setActiveView: (view: 'dashboard' | 'kanban' | 'list') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCreateModal,
  onOpenLoginModal,
  activeView,
  setActiveView,
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <CheckSquare className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-700 tracking-tight">
                TaskPulse
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200/60">
                Pro
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          {user && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  activeView === 'dashboard'
                    ? 'bg-white text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('kanban')}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  activeView === 'kanban'
                    ? 'bg-white text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kanban Board
              </button>
              <button
                onClick={() => setActiveView('list')}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  activeView === 'list'
                    ? 'bg-white text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                List View
              </button>
            </nav>
          )}

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={onOpenCreateModal}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm shadow-blue-600/30 hover:shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span className="hidden sm:inline">Add Task</span>
                </button>

                <div className="h-6 w-px bg-slate-200 mx-1" />

                {/* User Profile */}
                <div className="flex items-center gap-3">
                  {user.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt={user.displayName || 'User'}
                      className="w-9 h-9 rounded-full ring-2 ring-slate-200 object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 ring-2 ring-slate-200 flex items-center justify-center text-slate-600">
                      <UserIcon className="w-5 h-5" />
                    </div>
                  )}

                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-slate-800 leading-tight">
                      {user.displayName || 'Google User'}
                    </p>
                    <p className="text-xs text-slate-400 truncate max-w-[150px]">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
