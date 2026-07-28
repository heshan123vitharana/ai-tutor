import { Message } from 'ai';

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

const STORAGE_KEY = 'ai_tutor_sessions';

export function getSessions(): ChatSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to parse sessions from local storage', error);
    return [];
  }
}

export function saveSessions(sessions: ChatSession[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save sessions to local storage', error);
  }
}

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Generate a simple title based on the first user message
export function generateTitle(messages: Message[]): string {
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (!firstUserMessage) return 'New Chat';
  
  const text = firstUserMessage.content || 'New Chat';
  // Return the first 30 characters
  return text.length > 30 ? text.substring(0, 30) + '...' : text;
}
