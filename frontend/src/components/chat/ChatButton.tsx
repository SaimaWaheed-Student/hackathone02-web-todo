'use client';

interface ChatButtonProps {
  onClick: () => void;
  isOpen?: boolean;
}

// T054-T055 - Enhanced floating chatbot button with pulse animation
export function ChatButton({ onClick, isOpen = false }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className="chat-button"
      aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
      aria-expanded={isOpen}
    >
      <span className="chat-button-icon">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </span>

      {/* T055 - Pulse animation notification dot */}
      <span className="notification-dot">
        <span className="notification-ping" />
        <span className="notification-badge" />
      </span>

      <style jsx>{`
        .chat-button {
          position: fixed;
          bottom: var(--spacing-xl);
          right: var(--spacing-xl);
          width: 60px;
          height: 60px;
          background: var(--gradient-chat-bot);
          color: white;
          border: none;
          border-radius: var(--radius-xl);
          box-shadow: 0 8px 24px -4px rgba(99, 102, 241, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: var(--z-chat);
          transition: all var(--transition-normal) var(--ease-out-expo);
        }
        .chat-button:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 12px 32px -4px rgba(99, 102, 241, 0.5);
        }
        .chat-button:active {
          transform: scale(0.98);
        }
        .chat-button-icon {
          display: flex;
          transition: transform var(--transition-normal) var(--ease-spring);
        }
        .chat-button:hover .chat-button-icon {
          transform: scale(1.1);
        }
        .notification-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          display: flex;
          width: 14px;
          height: 14px;
        }
        .notification-ping {
          position: absolute;
          inset: 0;
          border-radius: var(--radius-full);
          background: var(--success);
          opacity: 0.75;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .notification-badge {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: var(--radius-full);
          background: var(--success);
          border: 2px solid white;
        }
        @media (max-width: 639px) {
          .chat-button {
            bottom: var(--spacing-md);
            right: var(--spacing-md);
            width: 56px;
            height: 56px;
          }
        }
      `}</style>
    </button>
  );
}
