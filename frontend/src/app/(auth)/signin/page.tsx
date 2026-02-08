'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthContext } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { TokenResponse } from '@/lib/types';

function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // Get returnUrl from query params, default to homepage
  const returnUrl = searchParams.get('returnUrl') || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(returnUrl);
    }
  }, [isAuthenticated, router, returnUrl]);

  useEffect(() => {
    // Show success message if redirected after registration
    if (searchParams.get('registered') === 'true') {
      setSuccess('Account created successfully! Please sign in.');
    }
  }, [searchParams]);

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post<TokenResponse>(
        '/auth/signin',
        { email, password },
        { skipAuth: true }
      );

      // Store token via context and redirect to returnUrl
      login(response.access_token);
      router.push(returnUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-scale-in">
        <div className="auth-header">
          <div className="auth-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          </div>
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Sign in to access your tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {success && (
            <div className="success-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              {success}
            </div>
          )}
          {error && (
            <div className="error-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {error}
            </div>
          )}

          <div className={`form-group ${fieldErrors.email ? 'has-error' : ''}`}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
              }}
              placeholder="you@example.com"
              disabled={loading}
              autoComplete="email"
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>

          <div className={`form-group ${fieldErrors.password ? 'has-error' : ''}`}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
              }}
              placeholder="Enter your password"
              disabled={loading}
              autoComplete="current-password"
            />
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                <span>Signing in...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link href={`/signup${returnUrl !== '/' ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}>
            Sign up
          </Link>
        </p>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-lg);
          background: var(--gradient-auth-bg);
        }
        .auth-card {
          width: 100%;
          max-width: var(--modal-max-width-sm);
          background: var(--background);
          padding: var(--spacing-2xl);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
        }
        .auth-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }
        .auth-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto var(--spacing-md);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-light);
          border-radius: var(--radius-full);
          color: var(--primary);
        }
        h1 {
          margin: 0 0 var(--spacing-xs);
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          color: var(--foreground);
        }
        .auth-subtitle {
          color: var(--muted);
          font-size: var(--font-size-sm);
          margin: 0;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        .form-group.has-error input {
          border-color: var(--error);
        }
        label {
          font-weight: var(--font-weight-medium);
          font-size: var(--font-size-sm);
          color: var(--foreground);
        }
        input {
          padding: var(--spacing-md);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-size: var(--font-size-base);
          height: var(--input-height);
          transition: all var(--transition-fast);
          background: var(--background);
        }
        input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: var(--shadow-input-focus);
        }
        input:disabled {
          background: var(--bg-secondary);
          cursor: not-allowed;
        }
        input::placeholder {
          color: var(--muted-light);
        }
        .field-error {
          font-size: var(--font-size-xs);
          color: var(--error);
        }
        .btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          height: var(--button-height);
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          margin-top: var(--spacing-sm);
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-button);
        }
        .btn-primary:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }
        .btn-primary:active:not(:disabled) {
          transform: translateY(0);
        }
        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        .error-message,
        .success-message {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
        }
        .error-message {
          background: var(--error-light);
          color: var(--error);
        }
        .success-message {
          background: var(--success-light);
          color: var(--success);
        }
        .auth-footer {
          text-align: center;
          margin-top: var(--spacing-xl);
          color: var(--muted);
          font-size: var(--font-size-sm);
        }
        .auth-footer :global(a) {
          color: var(--primary);
          text-decoration: none;
          font-weight: var(--font-weight-medium);
          transition: color var(--transition-fast);
        }
        .auth-footer :global(a:hover) {
          color: var(--primary-hover);
          text-decoration: underline;
        }
        @media (max-width: 639px) {
          .auth-container {
            padding: var(--spacing-md);
          }
          .auth-card {
            padding: var(--spacing-lg);
          }
        }
      `}</style>
    </div>
  );
}

export default function SigninPage() {
  return (
    <Suspense fallback={
      <div className="auth-loading">
        <LoadingSpinner size="lg" color="primary" />
        <style jsx>{`
          .auth-loading {
            min-height: calc(100vh - 80px);
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--gradient-auth-bg);
          }
        `}</style>
      </div>
    }>
      <SigninForm />
    </Suspense>
  );
}
