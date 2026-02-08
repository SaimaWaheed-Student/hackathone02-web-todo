'use client';

import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { ReactNode } from 'react';

interface ActionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  color?: 'primary' | 'success' | 'warning' | 'purple';
}

const colorStyles = {
  primary: {
    iconBg: 'var(--primary-light)',
    iconColor: 'var(--primary)',
    hoverShadow: 'rgba(37, 99, 235, 0.2)',
  },
  success: {
    iconBg: 'var(--success-light)',
    iconColor: 'var(--success)',
    hoverShadow: 'rgba(16, 185, 129, 0.2)',
  },
  warning: {
    iconBg: 'var(--warning-light)',
    iconColor: 'var(--warning)',
    hoverShadow: 'rgba(245, 158, 11, 0.2)',
  },
  purple: {
    iconBg: '#f3e8ff',
    iconColor: '#9333ea',
    hoverShadow: 'rgba(147, 51, 234, 0.2)',
  },
};

export function ActionCard({
  icon,
  title,
  description,
  href,
  color = 'primary',
}: ActionCardProps) {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  const colors = colorStyles[color];

  const handleClick = () => {
    if (isAuthenticated) {
      router.push(href);
    } else {
      router.push(`/signin?returnUrl=${encodeURIComponent(href)}`);
    }
  };

  return (
    <button onClick={handleClick} className="action-card">
      <div className="action-card-icon">{icon}</div>
      <h3 className="action-card-title">{title}</h3>
      <p className="action-card-description">{description}</p>
      {!isAuthenticated && (
        <span className="action-card-hint">Sign in to access</span>
      )}

      <style jsx>{`
        .action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-lg);
          min-width: var(--action-card-min-width);
          min-height: 160px;
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          cursor: pointer;
          transition: all var(--transition-normal);
          box-shadow: var(--shadow-card);
          position: relative;
          width: 100%;
        }
        .action-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -8px ${colors.hoverShadow}, var(--shadow-card-hover);
          border-color: ${colors.iconColor};
        }
        .action-card:active {
          transform: translateY(-2px);
        }
        .action-card:focus-visible {
          outline: 2px solid ${colors.iconColor};
          outline-offset: 2px;
        }
        .action-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: var(--action-card-icon-size);
          height: var(--action-card-icon-size);
          background: ${colors.iconBg};
          border-radius: var(--radius-lg);
          color: ${colors.iconColor};
          transition: transform var(--transition-normal) var(--ease-spring);
        }
        .action-card:hover .action-card-icon {
          transform: scale(1.1);
        }
        .action-card-title {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          color: var(--foreground);
          margin: 0;
          text-align: center;
        }
        .action-card-description {
          font-size: var(--font-size-xs);
          color: var(--muted);
          margin: 0;
          text-align: center;
          line-height: var(--line-height-normal);
        }
        .action-card-hint {
          position: absolute;
          bottom: var(--spacing-sm);
          font-size: 10px;
          color: var(--muted-light);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        @media (min-width: 640px) {
          .action-card {
            padding: var(--spacing-xl);
            min-height: 180px;
          }
          .action-card-title {
            font-size: var(--font-size-lg);
          }
          .action-card-description {
            font-size: var(--font-size-sm);
          }
        }
      `}</style>
    </button>
  );
}
