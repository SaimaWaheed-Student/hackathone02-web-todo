'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useChat } from '@/hooks/useChat';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';

export default function ChatPage() {
  const { isAuthenticated } = useAuthContext();
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

  useEffect(() => {
    if (!hasLoadedHistory && isAuthenticated) {
      loadHistory().then(() => setHasLoadedHistory(true));
    }
  }, [hasLoadedHistory, isAuthenticated, loadHistory]);

  const handleSendMessage = useCallback(async (content: string) => {
    await sendMessage(content);
  }, [sendMessage]);

  const handleClearHistory = useCallback(async () => {
    if (window.confirm('Are you sure you want to clear your chat history? This action cannot be undone.')) {
      await clearHistory();
    }
  }, [clearHistory]);

  return (
    <div className="chat-page">
      {/* Sidebar */}
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <div className="bot-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
            </svg>
          </div>
          <div>
            <h2 className="sidebar-title">Todo Assistant</h2>
            <div className="status-badge">
              <span className="status-dot" />
              Online
            </div>
          </div>
        </div>

        <div className="sidebar-info">
          <h3>What I can do</h3>
          <ul>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              Create new tasks
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
              Show all tasks
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              Mark tasks complete
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
              Delete tasks
            </li>
          </ul>
        </div>

        {messages.length > 0 && (
          <button onClick={handleClearHistory} className="clear-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            Clear History
          </button>
        )}
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        <div className="chat-messages">
          <MessageList messages={messages} isLoading={isLoading} error={error} />
        </div>
        <div className="chat-input-area">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} disabled={isLoading} />
        </div>
      </main>

      <style jsx>{`
        .chat-page {
          display: flex;
          height: calc(100vh - 65px);
          background: #f8fafc;
        }

        /* Sidebar */
        .chat-sidebar {
          width: 280px;
          background: white;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          gap: 1.5rem;
          overflow-y: auto;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .bot-avatar {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #6366f1, #9333ea);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
          flex-shrink: 0;
        }

        .sidebar-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 2px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          animation: pulse 2s infinite;
        }

        .sidebar-info {
          flex: 1;
        }

        .sidebar-info h3 {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #9ca3af;
          margin: 0 0 0.75rem;
        }

        .sidebar-info ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .sidebar-info li {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.85rem;
          color: #4b5563;
          padding: 0.5rem 0.75rem;
          border-radius: 10px;
          background: #f9fafb;
          border: 1px solid #f3f4f6;
        }

        .clear-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-btn:hover {
          background: #fee2e2;
          border-color: #fca5a5;
        }

        /* Main Chat */
        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .chat-messages {
          flex: 1;
          overflow: hidden;
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
        }

        .chat-input-area {
          border-top: 1px solid #e5e7eb;
          background: white;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Mobile: hide sidebar, full-width chat */
        @media (max-width: 768px) {
          .chat-sidebar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
