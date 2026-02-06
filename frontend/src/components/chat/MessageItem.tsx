'use client';

import { ChatMessage } from '@/lib/types';

interface MessageItemProps {
  message: ChatMessage;
}

// T059-T060 - Message bubbles with user/bot gradient distinction
export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user';
  const isTool = message.role === 'tool';

  // Don't render tool messages directly
  if (isTool) {
    return null;
  }

  // Check if message contains action confirmation (task operations)
  const isActionMessage = !isUser && (
    message.content.toLowerCase().includes('created') ||
    message.content.toLowerCase().includes('completed') ||
    message.content.toLowerCase().includes('deleted') ||
    message.content.toLowerCase().includes('updated') ||
    message.content.toLowerCase().includes('marked as done')
  );

  return (
    <div className={`message-row ${isUser ? 'user' : 'bot'}`}>
      {/* Avatar */}
      <div className={`message-avatar ${isUser ? 'user' : 'bot'}`}>
        {isUser ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
        )}
      </div>

      {/* Message content */}
      <div className="message-content">
        {/* T060 - Message bubble with rounded corners */}
        <div className={`message-bubble ${isUser ? 'user' : isActionMessage ? 'action' : 'bot'}`}>
          {/* Action indicator */}
          {isActionMessage && (
            <div className="action-indicator">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>Action completed</span>
            </div>
          )}
          <p className="message-text">{message.content}</p>
        </div>

        {/* Timestamp */}
        <span className="message-time">{formatTime(message.created_at)}</span>
      </div>

      <style jsx>{`
        .message-row {
          display: flex;
          gap: var(--spacing-sm);
          animation: fadeInUp 0.25s var(--ease-out-expo);
        }
        .message-row.user {
          flex-direction: row-reverse;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: white;
        }
        .message-avatar.user {
          background: var(--gradient-chat-user);
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }
        .message-avatar.bot {
          background: var(--gradient-chat-bot);
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
        }
        .message-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-width: 80%;
        }
        .message-row.user .message-content {
          align-items: flex-end;
        }
        .message-row.bot .message-content {
          align-items: flex-start;
        }
        .message-bubble {
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-xl);
          font-size: var(--font-size-sm);
          line-height: var(--line-height-relaxed);
        }
        /* T060 - Rounded corners: rounded-tr-md for user, rounded-tl-md for bot */
        .message-bubble.user {
          background: var(--gradient-chat-user);
          color: white;
          border-top-right-radius: var(--radius-sm);
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
        }
        .message-bubble.bot {
          background: var(--background);
          color: var(--foreground);
          border: 1px solid var(--border);
          border-top-left-radius: var(--radius-sm);
        }
        .message-bubble.action {
          background: var(--success-light);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-top-left-radius: var(--radius-sm);
        }
        .message-bubble.action .message-text {
          color: var(--foreground);
        }
        .action-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: var(--spacing-xs);
          color: var(--success);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-medium);
        }
        .message-text {
          margin: 0;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .message-time {
          font-size: 10px;
          color: var(--muted-light);
          padding: 0 var(--spacing-xs);
        }
      `}</style>
    </div>
  );
}

function formatTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}
