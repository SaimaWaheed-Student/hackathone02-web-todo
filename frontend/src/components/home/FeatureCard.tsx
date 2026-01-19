'use client';

import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>

      <style jsx>{`
        .feature-card {
          background: var(--background);
          padding: var(--spacing-xl);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border);
          text-align: center;
          transition: all var(--transition-normal);
          cursor: default;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary-light);
        }
        .feature-card:focus-within {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
        .feature-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, var(--primary-light) 0%, #c7d2fe 100%);
          border-radius: var(--radius-lg);
          margin-bottom: var(--spacing-md);
          color: var(--primary);
        }
        .feature-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: var(--foreground);
          margin-bottom: var(--spacing-sm);
        }
        .feature-description {
          font-size: var(--font-size-sm);
          color: var(--muted);
          line-height: var(--line-height-relaxed);
        }
      `}</style>
    </div>
  );
}
