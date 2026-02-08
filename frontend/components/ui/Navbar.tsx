'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signOut } from '@/lib/auth-client';

interface NavbarProps {
  userEmail?: string;
  taskStats?: {
    total: number;
    completed: number;
    remaining: number;
  };
}

export default function Navbar({ userEmail, taskStats }: NavbarProps) {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
      router.refresh();
    } catch (err) {
      // Handle sign out error silently or show user notification
      router.push('/login');
    }
  };

  return (
    <nav className="glass-card p-4 mb-8 rounded-2xl sticky top-4 z-50 animate-slide-down">
      <div className="flex justify-between items-center">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl shadow-lg shadow-primary-500/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              TaskFlow
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Stay organized</p>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3 relative">
          {/* User profile indicator - clickable */}
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 group"
            aria-label="View profile"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Profile</span>
            <svg
              className={`w-4 h-4 text-slate-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {/* Profile dropdown menu */}
          {showProfileMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              ></div>

              {/* Dropdown card */}
              <div className="absolute top-14 right-0 z-50 w-80 glass-card rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-fade-in">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">Profile Overview</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {userEmail && userEmail !== 'User' ? userEmail : 'Loading...'}
                      </p>
                    </div>
                  </div>

                  {/* Task Statistics */}
                  {taskStats && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Task Statistics</h4>

                      {/* Total Tasks */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Total Tasks</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{taskStats.total}</p>
                          </div>
                        </div>
                      </div>

                      {/* Completed Tasks */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400">Completed</p>
                            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{taskStats.completed}</p>
                          </div>
                        </div>
                      </div>

                      {/* Remaining Tasks */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-amber-600 dark:text-amber-400">Remaining</p>
                            <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{taskStats.remaining}</p>
                          </div>
                        </div>
                      </div>

                      {/* Completion Rate */}
                      {taskStats.total > 0 && (
                        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Completion Rate</span>
                            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                              {Math.round((taskStats.completed / taskStats.total) * 100)}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary-500 to-accent-600 rounded-full transition-all duration-500"
                              style={{ width: `${(taskStats.completed / taskStats.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {!taskStats && (
                    <div className="text-center py-4">
                      <p className="text-sm text-slate-500 dark:text-slate-400">No task statistics available</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 font-medium group"
            aria-label="Logout"
          >
            <svg className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}