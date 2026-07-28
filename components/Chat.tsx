'use client';

import { useChat } from 'ai/react';
import { AlertTriangle } from 'lucide-react';
import Header from './Header';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

export default function Chat() {
  const {
    messages,
    input,
    isLoading,
    error,
    handleInputChange,
    handleSubmit,
    setMessages,
    setInput,
  } = useChat({
    api: '/api/chat',
  });

  const handleClear = () => setMessages([]);

  // Allow starter prompts to populate input and submit
  const handleStarterClick = (text: string) => {
    setInput(text);
    // Submit on next tick so input is updated
    setTimeout(() => {
      const form = document.querySelector('form');
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }, 50);
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
