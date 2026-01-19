'use client';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="error-message" role="alert">
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="dismiss-btn" aria-label="Dismiss error">
          &times;
        </button>
      )}

      <style jsx>{`
        .error-message {
          background: #fef2f2;
          color: #dc2626;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
        }
        .dismiss-btn {
          background: none;
          border: none;
          color: #dc2626;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          min-width: auto;
          min-height: auto;
        }
        .dismiss-btn:hover {
          color: #b91c1c;
        }
      `}</style>
    </div>
  );
}
