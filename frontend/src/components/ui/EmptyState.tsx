'use client';

import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && (
        <button className="empty-state-action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
      <style jsx>{`
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-3xl) var(--spacing-lg);
          text-align: center;
        }
        .empty-state-icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          border-radius: var(--radius-full);
          color: var(--muted);
          margin-bottom: var(--spacing-lg);
        }
        .empty-state-icon :global(svg) {
          width: 32px;
          height: 32px;
        }
        .empty-state-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: var(--foreground);
          margin-bottom: var(--spacing-sm);
        }
        .empty-state-description {
          font-size: var(--font-size-sm);
          color: var(--muted);
          max-width: 300px;
          margin-bottom: var(--spacing-lg);
        }
        .empty-state-action {
          padding: var(--spacing-sm) var(--spacing-lg);
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-sm);
        }
        .empty-state-action:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
        .empty-state-action:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
