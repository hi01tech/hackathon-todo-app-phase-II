import { formatDate } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TaskCardProps {
  task: Task;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className={`card card-hover p-6 relative overflow-hidden transition-all duration-300 ${
      task.is_completed ? 'opacity-75' : ''
    }`}>
      {/* Status indicator bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
        task.is_completed
          ? 'bg-gradient-to-b from-emerald-500 to-green-600'
          : 'bg-gradient-to-b from-primary-500 to-accent-600'
      }`}></div>

      <div className="flex items-start justify-between gap-4">
        {/* Checkbox and content */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <button
            onClick={onToggleComplete}
            className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
              task.is_completed
                ? 'bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-500 shadow-lg shadow-emerald-500/30'
                : 'border-slate-300 dark:border-slate-600 hover:border-primary-500 dark:hover:border-primary-400 hover:shadow-md'
            }`}
            aria-label={task.is_completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {task.is_completed && (
              <svg className="w-4 h-4 text-white animate-fade-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold mb-1 transition-all duration-200 ${
              task.is_completed
                ? 'line-through text-slate-500 dark:text-slate-400'
                : 'text-slate-900 dark:text-slate-100'
            }`}>
              {task.title}
            </h3>

            {task.description && (
              <p className={`text-sm mb-3 transition-all duration-200 ${
                task.is_completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-600 dark:text-slate-300'
              }`}>
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Created {formatDate(task.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 group"
            aria-label="Edit task"
          >
            <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </button>

          <button
            onClick={onDelete}
            className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
            aria-label="Delete task"
          >
            <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Completion badge */}
      {task.is_completed && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            Done
          </span>
        </div>
      )}
    </div>
  );
}