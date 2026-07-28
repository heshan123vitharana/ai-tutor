'use client';

import { useChat, Message } from '@ai-sdk/react';
import { AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Header from './Header';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

interface ChatProps {
  id?: string;
  initialMessages?: Message[];
  onMessagesChange?: (messages: Message[]) => void;
  onToggleSidebar?: () => void;
}

export default function Chat({ id, initialMessages = [], onMessagesChange, onToggleSidebar }: ChatProps) {
  const {
    messages,
    status,
    error,
    sendMessage,
    setMessages,
  } = useChat({
    id,
    initialMessages,
  });

  const [input, setInput] = useState('');
  const isLoading = status === 'submitted' || status === 'streaming';

  const lastSavedMessagesRef = useRef<Message[]>([]);

  // Sync messages back to parent when they change (bulletproof against loops)
  useEffect(() => {
    if (!onMessagesChange || messages.length === 0) return;
    
    // Only save if the length changed, or the content of the last message changed (e.g. streaming)
    const lastSaved = lastSavedMessagesRef.current;
    const isDifferent = 
      messages.length !== lastSaved.length || 
      messages[messages.length - 1]?.content !== lastSaved[lastSaved.length - 1]?.content;

    if (isDifferent) {
      lastSavedMessagesRef.current = messages;
      onMessagesChange(messages);
    }
  }, [messages, onMessagesChange]);

  const handleClear = () => {
    setMessages([]);
    if (onMessagesChange) onMessagesChange([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ content: input, role: 'user' } as any);
    setInput('');
  };

  const handleStarterClick = (text: string) => {
    sendMessage({ content: text, role: 'user' } as any);
  };

  return (
    <div className="chat-container">
      <Header onClear={handleClear} messageCount={messages.length} onToggleSidebar={onToggleSidebar} />

      <div className="app-shell">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          onStarterClick={handleStarterClick}
        />

        {error && (
          <div className="error-message" role="alert">
            <AlertTriangle size={15} />
            {error.message || 'Something went wrong. Please try again.'}
          </div>
        )}

        <ChatInput
          input={input}
          isLoading={isLoading}
          onChange={(v) => handleInputChange({ target: { value: v } } as React.ChangeEvent<HTMLTextAreaElement>)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
