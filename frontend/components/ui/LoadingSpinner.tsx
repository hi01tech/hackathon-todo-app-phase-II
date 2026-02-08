export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-700"></div>
        {/* Spinning gradient ring */}
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary-500 border-r-accent-500 animate-spin"></div>
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-br from-primary-500 to-accent-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}