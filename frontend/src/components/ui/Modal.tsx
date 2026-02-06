'use client';

import { ReactNode, useEffect, useCallback } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  showCloseButton?: boolean;
}

const sizes = {
  sm: 'var(--modal-max-width-sm, 400px)',
  md: 'var(--modal-max-width-md, 500px)',
  lg: 'var(--modal-max-width-lg, 640px)',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  // Handle escape key
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // Lock body scroll and add escape listener
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && (
              <h2 id="modal-title" className="modal-title">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                className="modal-close"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, var(--opacity-backdrop, 0.5));
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: var(--z-modal-backdrop, 150);
          padding: var(--spacing-md);
          animation: fadeIn 200ms var(--ease-out-expo, ease-out);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .modal-content {
          background: var(--background);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-modal, var(--shadow-xl));
          width: 100%;
          max-width: ${sizes[size]};
          max-height: calc(100vh - var(--spacing-2xl));
          overflow: hidden;
          display: flex;
          flex-direction: column;
          z-index: var(--z-modal, 200);
          animation: scaleIn 200ms var(--ease-out-expo, ease-out);
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--border);
        }
        .modal-title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: var(--foreground);
          margin: 0;
        }
        .modal-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          padding: 0;
          background: transparent;
          border: none;
          border-radius: var(--radius-md);
          color: var(--muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .modal-close:hover {
          background: var(--bg-secondary);
          color: var(--foreground);
        }
        .modal-body {
          padding: var(--spacing-lg);
          overflow-y: auto;
        }
        @media (max-width: 639px) {
          .modal-content {
            max-width: 100%;
            max-height: 90vh;
            margin: auto;
          }
        }
      `}</style>
    </div>
  );
}
