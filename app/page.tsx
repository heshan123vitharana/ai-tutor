'use client';

import { useState, useEffect, useCallback } from 'react';
import Chat from '@/components/Chat';
import Sidebar from '@/components/Sidebar';
import { ChatSession, getSessions, saveSessions, generateSessionId, generateTitle } from '@/lib/storage';
import { type UIMessage as Message } from 'ai';

export default function Home() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const loadedSessions = getSessions();
    setSessions(loadedSessions);
    setIsMounted(true);
    
    // Automatically select the first session or start a new one
    if (loadedSessions.length > 0) {
      setCurrentSessionId(loadedSessions[0].id);
    } else {
      handleNewChat();
    }
  }, []);

  const handleNewChat = () => {
    const newId = generateSessionId();
    setCurrentSessionId(newId);
  };

  const handleMessagesChange = useCallback((id: string, messages: Message[]) => {
    setSessions(prev => {
      const existingIdx = prev.findIndex(s => s.id === id);
      const updated = [...prev];
      
      if (existingIdx >= 0) {
        updated[existingIdx] = {
          ...updated[existingIdx],
          messages,
          title: messages.length > 0 ? generateTitle(messages) : updated[existingIdx].title,
        };
      } else {
        updated.unshift({
          id,
          title: messages.length > 0 ? generateTitle(messages) : 'New Chat',
          messages,
          createdAt: Date.now(),
        });
      }
      
      saveSessions(updated);
      return updated;
    });
  }, []);

  const handleChatMessagesChange = useCallback((messages: Message[]) => {
    if (currentSessionId) {
      handleMessagesChange(currentSessionId, messages);
    }
  }, [currentSessionId, handleMessagesChange]);

  if (!isMounted) return null; // Prevent hydration mismatch

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const initialMessages = currentSession?.messages || [];

  return (
    <div className="layout-container">
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onNewChat={handleNewChat}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="main-content">
        <Chat 
          key={currentSessionId} 
          id={currentSessionId || undefined}
          initialMessages={initialMessages}
          onMessagesChange={handleChatMessagesChange}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        />
      </div>
    </div>
  );
}
