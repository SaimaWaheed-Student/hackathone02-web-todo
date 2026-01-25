'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/lib/types';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export function MessageList({ messages, isLoading, error }: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div
      ref={listRef}
      className="h-full overflow-y-auto p-4 space-y-6 scroll-smooth"
    >
      {messages.length === 0 && !isLoading && !error && (
        <EmptyState />
      )}

      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex gap-3">
          {/* AI Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
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
          </div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex justify-center px-4">
          <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm max-w-[90%] flex items-start gap-2 border border-red-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 flex-shrink-0 mt-0.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Invisible element for scrolling to bottom */}
      <div ref={bottomRef} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8">
      {/* Animated AI Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"
              />
            </svg>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Hello! I'm your Todo Assistant
      </h3>
      <p className="text-gray-500 text-sm mb-6 max-w-xs">
        I can help you manage your tasks using natural language. Just tell me what you need!
      </p>

      {/* Quick action suggestions */}
      <div className="flex flex-wrap justify-center gap-2">
        <QuickAction text="Add a new task" />
        <QuickAction text="Show my tasks" />
        <QuickAction text="Mark task done" />
      </div>
    </div>
  );
}

function QuickAction({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
      {text}
    </span>
  );
}
