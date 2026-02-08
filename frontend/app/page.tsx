import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col px-4 py-6 relative overflow-hidden">
      {/* Top Navigation with Sign In / Sign Up */}
      <nav className="flex justify-end items-center gap-4 mb-8 relative z-20">
        <Link
          href="/login"
          className="btn-primary px-8 py-3 text-lg"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="btn-secondary px-8 py-3 text-lg"
        >
          Sign Up
        </Link>
      </nav>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto relative z-10 animate-fade-in">
        {/* Logo/Icon */}
        <div className="mb-8 inline-block">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl shadow-2xl shadow-primary-500/50 flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
            </svg>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent leading-tight">
          Welcome to TaskFlow
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-4 max-w-2xl mx-auto font-light">
          Your modern, intuitive task management solution
        </p>

        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-xl mx-auto">
          Stay organized, boost productivity, and accomplish more with our beautifully designed todo application featuring secure authentication and real-time sync.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          {/* Secure Authentication Card */}
          <div className="glass-card p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Secure Authentication
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              JWT-based authentication with Better Auth for maximum security
            </p>
          </div>

          {/* Real-time Sync Card */}
          <div className="glass-card p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Real-time Sync
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your tasks sync instantly across all your devices
            </p>
          </div>

          {/* Beautiful UI Card */}
          <div className="glass-card p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Beautiful UI
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Modern, intuitive interface designed for productivity
            </p>
          </div>
        </div>

        {/* Additional info */}
        <p className="mt-12 text-sm text-slate-500 dark:text-slate-400">
          Free to use. No credit card required.
        </p>
      </div>
    </div>
  );
}