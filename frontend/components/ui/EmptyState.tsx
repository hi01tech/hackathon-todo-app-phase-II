interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4 animate-fade-in">
      <div className="mx-auto flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 mb-6 shadow-lg">
        {icon || (
          <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      {description && (
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
          {description}
        </p>
      )}
      {action && <div className="mt-8 animate-slide-up">{action}</div>}
    </div>
  );
}