'use client';

import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';

export function HeroSection() {
  const { isAuthenticated } = useAuthContext();

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Organize Your Life,<br />
          <span className="hero-title-accent">One Task at a Time</span>
        </h1>
        <p className="hero-subtitle">
          A simple, powerful task management app that helps you stay focused,
          organized, and productive. Start managing your tasks today.
        </p>
        <div className="hero-actions">
          {isAuthenticated ? (
            <Link href="/tasks/new" className="btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create New Task
            </Link>
          ) : (
            <>
              <Link href="/signup" className="btn-primary">
                Get Started Free
              </Link>
              <Link href="/signin" className="btn-secondary">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .hero {
          text-align: center;
          padding: var(--spacing-3xl) var(--spacing-md);
          background: var(--gradient-primary);
          border-radius: var(--radius-xl);
          margin-bottom: var(--spacing-2xl);
          animation: heroFadeIn 0.6s var(--ease-out-expo);
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 40%);
          pointer-events: none;
        }
        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .hero-content {
          max-width: 700px;
          margin: 0 auto;
        }
        .hero-title {
          font-size: var(--font-size-3xl);
          font-weight: var(--font-weight-bold);
          color: #ffffff;
          margin-bottom: var(--spacing-md);
          line-height: var(--line-height-tight);
        }
        .hero-title-accent {
          color: #fbbf24;
        }
        .hero-subtitle {
          font-size: var(--font-size-lg);
          color: rgba(255, 255, 255, 0.9);
          max-width: 500px;
          margin: 0 auto var(--spacing-xl);
          line-height: var(--line-height-relaxed);
        }
        .hero-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md) var(--spacing-xl);
          background: #ffffff;
          color: #667eea;
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          text-decoration: none;
          border-radius: var(--radius-lg);
          transition: all var(--transition-normal) var(--ease-out-expo);
          box-shadow: var(--shadow-lg);
          position: relative;
          z-index: 1;
        }
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.25);
        }
        .btn-primary:active {
          transform: translateY(-1px);
        }
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          padding: var(--spacing-md) var(--spacing-xl);
          background: transparent;
          color: #ffffff;
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          text-decoration: none;
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-radius: var(--radius-lg);
          transition: all var(--transition-normal);
        }
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #ffffff;
        }
        @media (min-width: 640px) {
          .hero {
            padding: var(--spacing-3xl) var(--spacing-xl);
          }
          .hero-title {
            font-size: var(--font-size-4xl);
          }
          .hero-subtitle {
            font-size: var(--font-size-xl);
          }
        }
        @media (min-width: 1024px) {
          .hero {
            padding: 5rem var(--spacing-2xl);
          }
          .hero-title {
            font-size: var(--font-size-5xl);
          }
        }
      `}</style>
    </section>
  );
}
