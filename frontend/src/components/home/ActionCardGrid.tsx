'use client';

import { ReactNode } from 'react';

interface ActionCardGridProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function ActionCardGrid({ children, title, subtitle }: ActionCardGridProps) {
  return (
    <section className="action-card-section">
      {(title || subtitle) && (
        <div className="action-card-header">
          {title && <h2 className="action-card-title">{title}</h2>}
          {subtitle && <p className="action-card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="action-card-grid">{children}</div>

      <style jsx>{`
        .action-card-section {
          margin-bottom: var(--spacing-2xl);
        }
        .action-card-header {
          text-align: center;
          margin-bottom: var(--spacing-xl);
        }
        .action-card-title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
          color: var(--foreground);
          margin: 0 0 var(--spacing-xs);
        }
        .action-card-subtitle {
          font-size: var(--font-size-sm);
          color: var(--muted);
          margin: 0;
        }
        .action-card-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--spacing-md);
        }
        @media (min-width: 640px) {
          .action-card-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: var(--spacing-lg);
          }
          .action-card-title {
            font-size: var(--font-size-2xl);
          }
          .action-card-subtitle {
            font-size: var(--font-size-base);
          }
        }
        @media (min-width: 1024px) {
          .action-card-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }
      `}</style>
    </section>
  );
}
