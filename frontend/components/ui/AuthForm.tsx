'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/auth-client';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSuccess?: () => void;
}

export default function AuthForm({ type, onSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (type === 'login') {
        const result = await signIn.email({
          email,
          password,
          fetchOptions: {
            credentials: 'include', // Ensure cookies are included
          },
        });

        if (result.error) {
          throw new Error(result.error.message || 'Sign in failed');
        }

        // Better Auth manages sessions via cookies automatically
        // No need to manually store tokens
        onSuccess?.();

        // Small delay to ensure session is established
        await new Promise(resolve => setTimeout(resolve, 100));

        router.push('/dashboard');
        router.refresh();
      } else {
        const result = await signUp.email({
          email,
          password,
          name: email.split('@')[0], // Use email prefix as name
          fetchOptions: {
            credentials: 'include', // Ensure cookies are included
          },
        });

        if (result.error) {
          throw new Error(result.error.message || 'Sign up failed');
        }

        // Better Auth manages sessions via cookies automatically
        // No need to manually store tokens
        onSuccess?.();

        // Small delay to ensure session is established
        await new Promise(resolve => setTimeout(resolve, 100));

        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || `Failed to ${type}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-slide-down">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
            </svg>
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field pl-12"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="input-field pl-12"
            placeholder="••••••••"
          />
        </div>
        {type === 'signup' && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Must be at least 6 characters long
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {type === 'login' ? 'Signing in...' : 'Creating account...'}
          </span>
        ) : (
          <span className="flex items-center justify-center">
            {type === 'login' ? 'Sign In' : 'Create Account'}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </span>
        )}
      </button>
    </form>
  );
}