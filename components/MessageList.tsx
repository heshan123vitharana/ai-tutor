'use client';

import { useEffect, useRef } from 'react';
import type { UIMessage } from 'ai';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const STARTER_PROMPTS = [
  { icon: '🧮', text: 'Explain recursion with a simple example' },
  { icon: '📐', text: 'Help me understand calculus derivatives' },
  { icon: '⚛️',  text: 'How does quantum entanglement work?' },
  { icon: '📝', text: 'Give me tips to write better essays' },
];

interface MessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
  onStarterClick: (text: string) => void;
}

export default function MessageList({ messages, isLoading, onStarterClick }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="message-list">
        <div className="empty-state">
          <div className="empty-avatar">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10" />
              <path d="M12 6v6l4 2" />
              <circle cx="19" cy="5" r="3" fill="white" stroke="none" />
              <path d="M17.5 3.5 19 5l1.5-1.5" stroke="#1f6feb" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <h1 className="empty-title">Hi, I&apos;m Aria 👋</h1>
            <p className="empty-subtitle">
              Your personal AI tutor. Ask me anything — I&apos;ll help you understand it, step by step.
            </p>
          </div>
          <div className="starter-grid">
            {STARTER_PROMPTS.map((p) => (
              <button
                key={p.text}
                className="starter-card"
                onClick={() => onStarterClick(p.text)}
              >
                <div className="starter-card-icon">{p.icon}</div>
                <div className="starter-card-text">{p.text}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
