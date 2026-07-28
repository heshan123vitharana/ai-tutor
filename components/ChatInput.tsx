'use client';

import { useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ChatInput({ input, isLoading, onChange, onSubmit }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 180)}px`;
  }, [input]);

  // Focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends, Shift+Enter adds newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  const canSend = input.trim().length > 0 && !isLoading;

  return (
    <div className="input-area">
      <form onSubmit={onSubmit}>
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            id="chat-input"
            className="chat-textarea"
            value={input}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything to learn…"
            rows={1}
            disabled={isLoading}
            aria-label="Chat message input"
          />
          <button
            type="submit"
            className={`send-btn ${isLoading ? 'loading' : ''}`}
            disabled={!canSend}
            aria-label="Send message"
          >
            {isLoading ? <Loader2 size={16} /> : <Send size={16} />}
          </button>
        </div>
      </form>
      <div className="input-footer">
        <span className="input-hint">
          Enter to send · Shift+Enter for new line
        </span>
      </div>
    </div>
  );
}
