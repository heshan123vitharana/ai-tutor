'use client';

import { useChat } from '@ai-sdk/react';
import { type UIMessage as Message } from 'ai';
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
  const { messages, status, error, sendMessage, setMessages } = useChat({
    id,
    initialMessages, // in v4 it's initialMessages on the react hook
    api: '/api/chat',
  } as any);

  const [input, setInput] = useState('');
  const isLoading = status === 'submitted' || status === 'streaming';

  // Force load initial messages if useChat's internal cache ignored them
  useEffect(() => {
    if (initialMessages.length > 0 && messages.length === 0) {
      setMessages(initialMessages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessages, id]);

  const lastSavedMessagesRef = useRef<Message[]>([]);

  // Sync messages back to parent when they change (bulletproof against loops)
  useEffect(() => {
    if (!onMessagesChange || messages.length === 0) return;
    
    // Only save if the length changed, or the parts changed (e.g. streaming)
    const lastSaved = lastSavedMessagesRef.current;
    
    // Helper to safely get stringified parts
    const getPartsStr = (m?: Message) => JSON.stringify(m?.parts || (m as any)?.content || '');
    
    const isDifferent = 
      messages.length !== lastSaved.length || 
      getPartsStr(messages[messages.length - 1]) !== getPartsStr(lastSaved[lastSaved.length - 1]);

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
    sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] } as any);
    setInput('');
  };

  const handleStarterClick = (text: string) => {
    sendMessage({ role: 'user', parts: [{ type: 'text', text }] } as any);
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
