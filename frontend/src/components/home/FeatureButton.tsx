'use client';

import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { ReactNode } from 'react';

interface FeatureButtonProps {
  label: string;
  href: string;
  icon: ReactNode;
  description?: string;
}

export function FeatureButton({ label, href, icon, description }: FeatureButtonProps) {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();

  const handleClick = () => {
    if (isAuthenticated) {
      // Navigate directly to target route
      router.push(href);
    } else {
      // Redirect to signin with returnUrl
      router.push(`/signin?returnUrl=${encodeURIComponent(href)}`);
    }
  };

  return (
    <button onClick={handleClick} className={`feature-button ${isAuthenticated ? 'authenticated' : ''}`}>
      <span className="feature-icon">{icon}</span>
      <span className="feature-label">{label}</span>
      {description && <span className="feature-description">{description}</span>}
      {!isAuthenticated && (
        <span className="auth-hint">Sign in required</span>
      )}

      <style jsx>{`
        .feature-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.5rem 1rem;
          background: white;
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 140px;
          width: 100%;
          position: relative;
        }
        .feature-button:hover {
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
          transform: translateY(-2px);
        }
        .feature-button:active {
          transform: translateY(0);
        }
        .feature-button.authenticated {
          border-color: var(--primary-light);
          background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
        }
        .feature-button.authenticated:hover {
          border-color: var(--primary);
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.2);
        }
        .feature-icon {
          font-size: 2rem;
          color: var(--primary);
        }
        .feature-label {
          font-size: 1rem;
          font-weight: 600;
          color: var(--foreground);
        }
        .feature-description {
          font-size: 0.75rem;
          color: var(--muted);
          text-align: center;
        }
        .auth-hint {
          font-size: 0.625rem;
          color: var(--muted-light);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 0.25rem;
        }
        @media (min-width: 640px) {
          .feature-button {
            padding: 2rem 1.5rem;
            min-height: 160px;
          }
          .feature-icon {
            font-size: 2.5rem;
          }
          .feature-label {
            font-size: 1.125rem;
          }
          .feature-description {
            font-size: 0.875rem;
          }
          .auth-hint {
            font-size: 0.6875rem;
          }
        }
      `}</style>
    </button>
  );
}
