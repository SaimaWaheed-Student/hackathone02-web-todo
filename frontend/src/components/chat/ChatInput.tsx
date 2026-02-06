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
    <div className="chat-input-wrapper">
      {/* Input container with focus ring */}
      <div
        className={`chat-input-container ${isFocused ? 'focused' : ''} ${disabled ? 'disabled' : ''}`}
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
          className="chat-textarea"
          aria-label="Chat message input"
        />

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={isButtonDisabled}
          className={`chat-send-btn ${isButtonDisabled ? 'disabled' : ''}`}
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
      <div className="chat-input-hints">
        <span className="hint-text">
          <kbd className="hint-kbd">Enter</kbd> to send
        </span>
        {showCharCount && (
          <span className={`char-count ${charCount >= maxLength ? 'limit-reached' : ''}`}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>

      <style jsx>{`
        .chat-input-wrapper {
          padding: 16px;
          background: white;
        }
        .chat-input-container {
          position: relative;
          display: flex;
          align-items: flex-end;
          gap: 12px;
          padding: 8px 8px 8px 16px;
          border-radius: 20px;
          border: 2px solid #e5e7eb;
          background: #f8fafc;
          transition: all 0.2s ease;
        }
        .chat-input-container:hover {
          border-color: #d1d5db;
          background: white;
        }
        .chat-input-container.focused {
          border-color: #818cf8;
          background: white;
          box-shadow: 0 0 0 4px rgba(129, 140, 248, 0.1), 0 4px 12px rgba(99, 102, 241, 0.1);
        }
        .chat-input-container.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .chat-textarea {
          flex: 1;
          background: transparent;
          resize: none;
          outline: none;
          font-size: 14px;
          color: #1f2937;
          padding: 10px 0;
          min-height: 44px;
          max-height: 120px;
          line-height: 1.5;
        }
        .chat-textarea::placeholder {
          color: #9ca3af;
        }
        .chat-send-btn {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
          transition: all 0.2s ease;
        }
        .chat-send-btn:hover:not(.disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
        }
        .chat-send-btn:active:not(.disabled) {
          transform: translateY(0) scale(0.95);
        }
        .chat-send-btn.disabled {
          background: #e5e7eb;
          color: #9ca3af;
          box-shadow: none;
          cursor: not-allowed;
        }
        .chat-input-hints {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          padding: 0 4px;
        }
        .hint-text {
          font-size: 11px;
          color: #9ca3af;
        }
        .hint-kbd {
          padding: 2px 6px;
          background: #f3f4f6;
          border-radius: 4px;
          font-size: 10px;
          font-family: monospace;
        }
        .char-count {
          font-size: 11px;
          font-weight: 500;
          color: #9ca3af;
        }
        .char-count.limit-reached {
          color: #ef4444;
        }
      `}</style>
    </div>
  );
}
