import { useState, useEffect } from 'react';

interface Task {
  id?: string;
  title: string;
  description?: string;
  completed?: boolean;
}

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: { title: string; description?: string }) => void;
  onCancel: () => void;
}

export default function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
    });
  };

  return (
    <div className="glass-card p-6 md:p-8 rounded-2xl animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          task
            ? 'bg-gradient-to-br from-primary-500 to-accent-600 shadow-lg shadow-primary-500/30'
            : 'bg-gradient-to-br from-primary-500 to-accent-600 shadow-lg shadow-primary-500/30'
        }`}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {task ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            )}
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {task ? 'Update the details of your task' : 'Add a new task to your list'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input-field"
            placeholder="e.g., Complete project documentation"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Description <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="input-field resize-none"
            placeholder="Add any additional details or notes about this task..."
          />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Provide context or additional information to help you complete this task
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            <span className="flex items-center justify-center">
              {task ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Update Task
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Create Task
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}