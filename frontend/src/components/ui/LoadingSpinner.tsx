'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'muted';
}

const sizes = {
  sm: '16px',
  md: '24px',
  lg: '32px',
};

const colors = {
  primary: 'var(--primary)',
  white: '#ffffff',
  muted: 'var(--muted)',
};

export function LoadingSpinner({ size = 'md', color = 'primary' }: LoadingSpinnerProps) {
  return (
    <div className="spinner" aria-label="Loading">
      <style jsx>{`
        .spinner {
          width: ${sizes[size]};
          height: ${sizes[size]};
          border: 2px solid transparent;
          border-top-color: ${colors[color]};
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
