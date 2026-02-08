'use client';

import Link from 'next/link';
import AuthForm from '@/components/ui/AuthForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-accent-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to home link */}
        <Link
          href="/"
          className="inline-flex items-center text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to home
        </Link>

        {/* Card with glassmorphism */}
        <div className="glass-card p-8 md:p-10 rounded-3xl animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent-500 to-primary-600 rounded-2xl shadow-lg shadow-accent-500/50 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h1>
            <p className="text-slate-600 dark:text-slate-400">Join TaskFlow and start organizing today</p>
          </div>

          {/* Form */}
          <AuthForm type="signup" />

          {/* Terms */}
          <p className="mt-6 text-xs text-center text-slate-500 dark:text-slate-400">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/70 dark:bg-slate-900/70 text-slate-500 dark:text-slate-400">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login link */}
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400">
              <Link
                href="/login"
                className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-xs">
            <div className="text-2xl mb-1">🚀</div>
            <p className="text-slate-600 dark:text-slate-400">Fast Setup</p>
          </div>
          <div className="text-xs">
            <div className="text-2xl mb-1">🔒</div>
            <p className="text-slate-600 dark:text-slate-400">Secure</p>
          </div>
          <div className="text-xs">
            <div className="text-2xl mb-1">💯</div>
            <p className="text-slate-600 dark:text-slate-400">Free Forever</p>
          </div>
        </div>
      </div>
    </div>
  );
}