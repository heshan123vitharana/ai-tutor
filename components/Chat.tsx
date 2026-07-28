'use client';

import { useChat } from '@ai-sdk/react';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import Header from './Header';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

export default function Chat() {
  const {
    messages,
    status,
    error,
    sendMessage,
    setMessages,
  } = useChat();

  const [input, setInput] = useState('');
  const isLoading = status === 'submitted' || status === 'streaming';

  const handleClear = () => setMessages([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ content: input, role: 'user' } as any);
    setInput('');
  };

  // Allow starter prompts to populate input and submit
  const handleStarterClick = (text: string) => {
    sendMessage({ content: text, role: 'user' } as any);
  };

  return (
    <div className="app-shell">
      <Header onClear={handleClear} messageCount={messages.length} />

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
  );
}
