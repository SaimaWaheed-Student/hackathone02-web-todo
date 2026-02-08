'use client';

import { ReactNode, useEffect, useRef, useState, useCallback } from 'react';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  footer: ReactNode;
  onClearHistory?: () => void;
}

// T056-T058, T066 - Slide-in chat panel with backdrop and animations
export function ChatPanel({ isOpen, onClose, children, footer, onClearHistory }: ChatPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  // T066 - Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen && !isClosing) {
      handleClose();
    }
  }, [isOpen, isClosing]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 280);
  };

  // T066 - Close on backdrop click
  const handleBackdropClick = () => {
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* T058 - Backdrop overlay with fade animation */}
      <div
        className={`chat-backdrop ${isClosing ? 'closing' : ''}`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* T056-T057 - Slide-in panel */}
      <div
        ref={panelRef}
        className={`chat-panel ${isClosing ? 'closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Chat assistant panel"
      >
        {/* Header */}
        <div className="chat-panel-header">
          <div className="chat-panel-info">
            <div className="chat-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </div>
            <div className="chat-panel-title">
              <h3>Todo Assistant</h3>
              <div className="chat-status">
                <span className="status-dot" />
                <span>Online</span>
              </div>
            </div>
          </div>

          <div className="chat-panel-actions">
            {onClearHistory && (
              <button
                onClick={onClearHistory}
                className="panel-action-btn clear-btn"
                aria-label="Clear chat history"
                title="Clear history"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            )}
            <button
              onClick={handleClose}
              className="panel-action-btn close-btn"
              aria-label="Close chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Message area */}
        <div className="chat-panel-content">{children}</div>

        {/* Input area */}
        <div className="chat-panel-footer">{footer}</div>
      </div>

      <style jsx>{`
        .chat-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, var(--opacity-backdrop));
          z-index: calc(var(--z-chat) - 1);
          animation: fadeIn 200ms var(--ease-out-expo);
        }
        .chat-backdrop.closing {
          animation: fadeOut 280ms var(--ease-out-expo) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .chat-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: var(--chat-panel-width);
          max-width: 100vw;
          background: var(--background);
          z-index: var(--z-chat);
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-chat-panel);
          animation: slideInRight 300ms var(--ease-out-expo);
        }
        .chat-panel.closing {
          animation: slideOutRight 280ms var(--ease-out-expo) forwards;
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        .chat-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-md) var(--spacing-lg);
          border-bottom: 1px solid var(--border);
          background: var(--background);
        }
        .chat-panel-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }
        .chat-avatar {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-xl);
          background: var(--gradient-chat-bot);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
        .chat-panel-title h3 {
          margin: 0;
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          color: var(--foreground);
        }
        .chat-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: var(--font-size-xs);
          color: var(--muted);
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
          background: var(--success);
          animation: pulse 2s ease-in-out infinite;
        }
        .chat-panel-actions {
          display: flex;
          gap: var(--spacing-xs);
        }
        .panel-action-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          border-radius: var(--radius-lg);
          color: var(--muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .panel-action-btn:hover {
          background: var(--bg-secondary);
        }
        .clear-btn:hover {
          color: var(--error);
          background: var(--error-light);
        }
        .close-btn:hover {
          color: var(--foreground);
        }
        .chat-panel-content {
          flex: 1;
          overflow: hidden;
          background: var(--bg-secondary);
        }
        .chat-panel-footer {
          border-top: 1px solid var(--border);
          background: var(--background);
        }
        @media (max-width: 639px) {
          .chat-panel {
            width: var(--chat-panel-width-mobile);
          }
        }
      `}</style>
    </>
  );
}
