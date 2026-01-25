'use client';

import { useState, useCallback, KeyboardEvent, ChangeEvent, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export function ChatInput({
  onSendMessage,
  isLoading,
  disabled = false,
  placeholder = 'Type your message...',
  maxLength = 2000,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);
    }
  }, [maxLength]);

  const handleSubmit = useCallback(async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading || disabled) return;

    setMessage('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    await onSendMessage(trimmedMessage);
  }, [message, isLoading, disabled, onSendMessage]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  const isButtonDisabled = disabled || isLoading || !message.trim();
  const charCount = message.length;
  const showCharCount = charCount > maxLength * 0.8;

  return (
    <div className="p-4">
      {/* Input container with focus ring */}
      <div
        className={`relative flex items-end gap-2 p-2 rounded-2xl border-2 transition-all duration-200 ${
          isFocused
            ? 'border-purple-400 bg-white shadow-lg shadow-purple-100'
            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {/* Textarea */}
        <textarea
          ref={inputRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          rows={1}
          className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 placeholder-gray-400 py-2 px-2 min-h-[40px] max-h-[120px]"
          aria-label="Chat message input"
        />

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={isButtonDisabled}
          className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
            isButtonDisabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-200 hover:scale-105 active:scale-95'
          }`}
          aria-label="Send message"
        >
          {isLoading ? (
            <svg
              className="w-5 h-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          )}
        </button>
      </div>

      {/* Character count and hints */}
      <div className="flex items-center justify-between mt-2 px-2">
        <span className="text-[10px] text-gray-400">
          Press Enter to send, Shift+Enter for new line
        </span>
        {showCharCount && (
          <span
            className={`text-[10px] font-medium ${
              charCount >= maxLength ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
