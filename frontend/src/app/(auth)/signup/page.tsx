'use client';

import { useState, FormEvent, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthContext } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { TokenResponse } from '@/lib/types';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Get returnUrl from query params, default to homepage
  const returnUrl = searchParams.get('returnUrl') || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(returnUrl);
    }
  }, [isAuthenticated, router, returnUrl]);

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string; confirmPassword?: string } = {};

    // Email validation
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    // Confirm password
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Register the user
      await api.post(
        '/auth/signup',
        { email, password },
        { skipAuth: true }
      );

      // Auto-signin after successful registration
      const signinResponse = await api.post<TokenResponse>(
        '/auth/signin',
        { email, password },
        { skipAuth: true }
      );

      // Store token and redirect to intended destination
      login(signinResponse.access_token);
      router.push(returnUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
          <h1>Create Account</h1>
          <p className="auth-subtitle">Sign up to start managing your tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder="Min. 8 characters"
              disabled={loading}
              autoComplete="new-password"
            />
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          </div>

          <div className={`form-group ${fieldErrors.confirmPassword ? 'has-error' : ''}`}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: undefined });
              }}
              placeholder="Confirm your password"
              disabled={loading}
              autoComplete="new-password"
            />
            {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                <span>Creating account...</span>
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link href={`/signin${returnUrl !== '/' ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}>
            Sign in
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
          background: var(--success-light);
          border-radius: var(--radius-full);
          color: var(--success);
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
        .error-message {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          background: var(--error-light);
          color: var(--error);
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

export default function SignupPage() {
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
      <SignupForm />
    </Suspense>
  );
}
