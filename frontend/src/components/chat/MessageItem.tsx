'use client';

import { ChatMessage } from '@/lib/types';

interface MessageItemProps {
  message: ChatMessage;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user';
  const isTool = message.role === 'tool';

  // Don't render tool messages directly
  if (isTool) {
    return null;
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-blue-600' : 'bg-gray-900'
        }`}
      >
        {isUser ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
            />
          </svg>
        )}
      </div>

      {/* Message content */}
      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Sender name */}
        <span className="text-xs font-medium text-gray-500 px-1">
          {isUser ? 'You' : 'Assistant'}
        </span>

        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-2.5 ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-md'
              : 'bg-white text-gray-800 rounded-tl-md shadow-sm border border-gray-100'
          }`}
        >
          <p className="text-[14px] leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-gray-400 px-1">
          {formatTime(message.created_at)}
        </span>
      </div>
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
