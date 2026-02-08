'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TaskCard from '@/components/ui/TaskCard';
import TaskForm from '@/components/ui/TaskForm';
import ProtectedRoute from '@/components/ui/ProtectedRoute';
import Navbar from '@/components/ui/Navbar';
import EmptyState from '@/components/ui/EmptyState';
import { apiClient } from '@/lib/api-client';

interface Task {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    fetchTasks();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const sessionResponse = await fetch('/api/auth/session', {
        credentials: 'include',
      });

      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();

        if (sessionData?.user?.email) {
          setUserEmail(sessionData.user.email);
          return;
        }
      }

      const data = await apiClient.getCurrentUser();
      const email = data.user?.email || data.email || 'User';
      setUserEmail(email);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setUserEmail('User');
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await apiClient.getTasks();
      setTasks(data.tasks || []);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: { title: string; description?: string }) => {
    try {
      const newTask = await apiClient.createTask(taskData);
      setTasks([newTask, ...tasks]);
      setShowForm(false);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (taskId: string, taskData: { title: string; description?: string }) => {
    try {
      const updatedTask = await apiClient.updateTask(taskId, taskData);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      setEditingTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      const updatedTask = await apiClient.toggleTaskCompletion(taskId);
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await apiClient.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  // Calculate task statistics
  const completedCount = tasks.filter(t => t.is_completed).length;
  const totalCount = tasks.length;
  const remainingCount = totalCount - completedCount;

  const taskStats = {
    total: totalCount,
    completed: completedCount,
    remaining: remainingCount,
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Navbar userEmail={userEmail} taskStats={taskStats} />
            <div className="flex justify-center items-center py-32">
              <div className="text-center">
                <div className="relative mb-4">
                  <div className="w-20 h-20 mx-auto rounded-full border-4 border-slate-200 dark:border-slate-700"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full border-4 border-transparent border-t-primary-500 border-r-accent-500 animate-spin"></div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">Loading your tasks...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Navbar userEmail={userEmail} taskStats={taskStats} />

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                  My Tasks
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {totalCount === 0
                    ? 'No tasks yet. Start by creating your first task!'
                    : `${completedCount} of ${totalCount} completed`}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingTask(null);
                }}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add New Task
              </button>
            </div>

            {/* Progress bar */}
            {totalCount > 0 && (
              <div className="glass-card p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Progress</span>
                  <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {Math.round((completedCount / totalCount) * 100)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Task Form */}
          {showForm && !editingTask && (
            <div className="mb-8">
              <TaskForm
                onSubmit={handleCreateTask}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {editingTask && (
            <div className="mb-8">
              <TaskForm
                task={editingTask}
                onSubmit={(data) => handleUpdateTask(editingTask.id, data)}
                onCancel={() => setEditingTask(null)}
              />
            </div>
          )}

          {/* Task List */}
          {tasks.length === 0 ? (
            <div className="glass-card p-12 rounded-3xl">
              <EmptyState
                title="No tasks yet"
                description="Get started by creating your first task and begin organizing your workflow"
                action={
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setEditingTask(null);
                    }}
                    className="btn-primary flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Create Your First Task
                  </button>
                }
              />
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-fade-in"
                >
                  <TaskCard
                    task={task}
                    onToggleComplete={() => handleToggleComplete(task.id)}
                    onEdit={() => {
                      setEditingTask(task);
                      setShowForm(false);
                    }}
                    onDelete={() => handleDeleteTask(task.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}