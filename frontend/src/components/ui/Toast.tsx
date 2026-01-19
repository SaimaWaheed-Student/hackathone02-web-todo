'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </div>
      <style jsx>{`
        .toast-container {
          position: fixed;
          bottom: var(--spacing-lg);
          right: var(--spacing-lg);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        @media (max-width: 639px) {
          .toast-container {
            left: var(--spacing-md);
            right: var(--spacing-md);
            bottom: var(--spacing-md);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: () => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onRemove, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onRemove]);

  const icons = {
    success: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    error: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    ),
    info: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    ),
  };

  return (
    <div className={`toast toast-${toast.type} ${isExiting ? 'exit' : ''}`}>
      <span className="toast-icon">{icons[toast.type]}</span>
      <span className="toast-message">{toast.message}</span>
      <button onClick={() => { setIsExiting(true); setTimeout(onRemove, 300); }} className="toast-close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <style jsx>{`
        .toast {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md) var(--spacing-lg);
          background: var(--background);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          border-left: 4px solid;
          animation: slideIn 0.3s ease-out;
          min-width: 280px;
          max-width: 400px;
        }
        .toast.exit {
          animation: slideOut 0.3s ease-in forwards;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        .toast-success {
          border-color: var(--success);
        }
        .toast-success .toast-icon {
          color: var(--success);
        }
        .toast-error {
          border-color: var(--error);
        }
        .toast-error .toast-icon {
          color: var(--error);
        }
        .toast-info {
          border-color: var(--primary);
        }
        .toast-info .toast-icon {
          color: var(--primary);
        }
        .toast-icon {
          flex-shrink: 0;
        }
        .toast-message {
          flex: 1;
          font-size: var(--font-size-sm);
          color: var(--foreground);
        }
        .toast-close {
          flex-shrink: 0;
          padding: var(--spacing-xs);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--muted);
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }
        .toast-close:hover {
          background: var(--bg-secondary);
          color: var(--foreground);
        }
        @media (max-width: 639px) {
          .toast {
            min-width: 100%;
          }
          @keyframes slideIn {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          @keyframes slideOut {
            from {
              transform: translateY(0);
              opacity: 1;
            }
            to {
              transform: translateY(100%);
              opacity: 0;
            }
          }
        }
      `}</style>
    </div>
  );
}
