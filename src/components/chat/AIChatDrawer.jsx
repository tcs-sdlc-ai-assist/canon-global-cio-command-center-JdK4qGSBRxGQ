import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useUI } from '../../context/UIProvider';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { processMessage } from '../../services/chatEngine';
import { logChatMessage } from '../../services/logger';
import { COLORS } from '../../app.config';

const DRAWER_WIDTH = 400;
const DRAWER_HEIGHT = 500;
const TOGGLE_BUTTON_SIZE = 48;

function ToggleButton({ isOpen, onClick, unreadCount }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        fixed bottom-6 right-6 z-[100] flex items-center justify-center rounded-full
        shadow-lg transition-all duration-200 ease-out
        hover:shadow-xl hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-[#0070C0] focus:ring-offset-2
      `}
      style={{
        width: TOGGLE_BUTTON_SIZE,
        height: TOGGLE_BUTTON_SIZE,
        backgroundColor: isOpen ? COLORS.DANGER : COLORS.PRIMARY,
      }}
      aria-label={isOpen ? 'Close chat' : 'Open AI chat assistant'}
      aria-expanded={isOpen}
      aria-controls="ai-chat-drawer"
    >
      {isOpen ? (
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      )}
      {!isOpen && unreadCount > 0 && (
        <span
          className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white rounded-full"
          style={{ backgroundColor: COLORS.DANGER }}
          aria-label={`${unreadCount} unread messages`}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}

ToggleButton.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  unreadCount: PropTypes.number,
};

function WelcomeMessage() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center" role="status">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: COLORS.SECONDARY }}
        aria-hidden="true"
      >
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-[#323130] mb-2">
        AI Command Assistant
      </h3>
      <p className="text-sm text-[#605E5C] leading-relaxed max-w-xs">
        Ask me anything about your dashboard — metrics, trends, regional performance, or strategic insights.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <span className="px-3 py-1.5 text-xs font-medium bg-[#E8F4FD] text-[#004578] rounded-full border border-[#B3D9F2]">
          Q4 Board Summary
        </span>
        <span className="px-3 py-1.5 text-xs font-medium bg-[#E8F4FD] text-[#004578] rounded-full border border-[#B3D9F2]">
          TCS Partnership
        </span>
        <span className="px-3 py-1.5 text-xs font-medium bg-[#E8F4FD] text-[#004578] rounded-full border border-[#B3D9F2]">
          Regional Performance
        </span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-2" role="status" aria-label="AI assistant is typing">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: COLORS.SECONDARY }}
        aria-hidden="true"
      >
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div className="flex items-center gap-1 px-4 py-2.5 bg-[#F3F2F1] rounded-2xl rounded-bl-md">
        <span
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ backgroundColor: COLORS.TEXT_SECONDARY, animationDelay: '0ms' }}
          aria-hidden="true"
        />
        <span
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ backgroundColor: COLORS.TEXT_SECONDARY, animationDelay: '150ms' }}
          aria-hidden="true"
        />
        <span
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ backgroundColor: COLORS.TEXT_SECONDARY, animationDelay: '300ms' }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export function AIChatDrawer({ className = '' }) {
  const { chatDrawerOpen, closeChatDrawer, openChatDrawer, chatInputPrefill, setChatInputPrefill } = useUI();
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const drawerRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, []);

  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      scrollToBottom();
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length, scrollToBottom]);

  useEffect(() => {
    if (chatDrawerOpen) {
      setUnreadCount(0);
    }
  }, [chatDrawerOpen]);

  useEffect(() => {
    if (!chatDrawerOpen && messages.length > 0) {
      setUnreadCount((prev) => prev + 1);
    }
  }, [messages.length, chatDrawerOpen]);

  const handleToggle = useCallback(() => {
    if (chatDrawerOpen) {
      closeChatDrawer();
    } else {
      openChatDrawer();
    }
  }, [chatDrawerOpen, closeChatDrawer, openChatDrawer]);

  const handleSendMessage = useCallback(
    async (content) => {
      if (!content || !content.trim() || isProcessing) return;

      const userMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      logChatMessage('user', content.trim());

      setIsProcessing(true);
      setChatInputPrefill('');

      try {
        const response = await processMessage(content.trim());

        const assistantMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        logChatMessage('assistant', response);
      } catch (error) {
        console.error('Chat processing error:', error);

        const errorMessage = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          role: 'assistant',
          content: "I'm sorry, I encountered an error processing your request. Please try again.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, setChatInputPrefill]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && chatDrawerOpen) {
        closeChatDrawer();
      }
    },
    [chatDrawerOpen, closeChatDrawer]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <ToggleButton
        isOpen={chatDrawerOpen}
        onClick={handleToggle}
        unreadCount={unreadCount}
      />

      <div
        id="ai-chat-drawer"
        ref={drawerRef}
        className={`
          fixed bottom-24 right-6 z-[99] bg-white rounded-lg border border-[#EDEBE9] shadow-2xl
          transition-all duration-300 ease-out
          ${chatDrawerOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}
          ${className}
        `}
        style={{
          width: DRAWER_WIDTH,
          height: DRAWER_HEIGHT,
          maxWidth: 'calc(100vw - 48px)',
          maxHeight: 'calc(100vh - 160px)',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="AI chat assistant"
        aria-hidden={!chatDrawerOpen}
      >
        <div className="flex flex-col h-full">
          <div
            className="flex items-center justify-between px-4 py-3 border-b border-[#EDEBE9] flex-shrink-0"
            style={{ backgroundColor: COLORS.PRIMARY }}
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-semibold text-white">AI Command Assistant</span>
            </div>
            <button
              type="button"
              onClick={closeChatDrawer}
              className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 transition-colors"
              aria-label="Close chat"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto"
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.length === 0 ? (
              <WelcomeMessage />
            ) : (
              <div className="py-4 space-y-4">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    role={msg.role}
                    content={msg.content}
                    timestamp={msg.timestamp}
                    userInitials="MD"
                  />
                ))}
                {isProcessing && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <ChatInput
            onSend={handleSendMessage}
            disabled={isProcessing}
            prefill={chatInputPrefill}
            placeholder="Ask about your dashboard..."
          />
        </div>
      </div>
    </>
  );
}

AIChatDrawer.propTypes = {
  className: PropTypes.string,
};