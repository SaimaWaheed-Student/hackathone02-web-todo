'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useChat } from '@/hooks/useChat';
import { ChatButton } from './ChatButton';
import { ChatPanel } from './ChatPanel';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

interface ChatWidgetProps {
  className?: string;
}

export function ChatWidget({ className }: ChatWidgetProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    loadHistory,
    clearHistory,
    clearError,
  } = useChat();

  // Load history when chat opens for the first time
  useEffect(() => {
    if (isOpen && !hasLoadedHistory && isAuthenticated) {
      loadHistory().then(() => {
        setHasLoadedHistory(true);
      });
    }
  }, [isOpen, hasLoadedHistory, isAuthenticated, loadHistory]);

  // Reset loaded state when auth changes
  useEffect(() => {
    if (!isAuthenticated) {
      setHasLoadedHistory(false);
    }
  }, [isAuthenticated]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    clearError();
  }, [clearError]);

  const handleSendMessage = useCallback(async (content: string) => {
    await sendMessage(content);
  }, [sendMessage]);

  const handleClearHistory = useCallback(async () => {
    if (window.confirm('Are you sure you want to clear your chat history? This action cannot be undone.')) {
      await clearHistory();
    }
  }, [clearHistory]);

  // Don't render if not authenticated or still loading auth state
  if (authLoading || !isAuthenticated) {
    return null;
  }

  // T064-T065 - Integrated ChatPanel with auth check
  return (
    <div className={className}>
      {/* T065 - Chat button only visible for authenticated users */}
      <ChatButton onClick={handleOpen} isOpen={isOpen} />

      <ChatPanel
        isOpen={isOpen}
        onClose={handleClose}
        onClearHistory={messages.length > 0 ? handleClearHistory : undefined}
        footer={
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={isLoading}
          />
        }
      >
        <MessageList
          messages={messages}
          isLoading={isLoading}
          error={error}
        />
      </ChatPanel>
    </div>
  );
}
