import { Plus, MessageSquare, X } from 'lucide-react';
import { ChatSession } from '@/lib/storage';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      <div 
        className="sidebar"
        style={{
          transform: isOpen ? 'translateX(0)' : '',
          // On mobile, we use CSS media queries to hide it. 
          // But inline styles might override. We'll handle mobile responsiveness in CSS.
        }}
      >
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={() => { onNewChat(); onClose(); }}>
            <Plus size={18} />
            New Chat
          </button>
          
          {/* Close button only visible on mobile, handled by CSS or conditionally rendered if needed. For now, simple X */}
          <button className="btn-icon mobile-only" onClick={onClose} style={{ display: 'none' }} aria-label="Close sidebar">
             <X size={18} />
          </button>
        </div>

        <div className="history-list">
          {sessions.length === 0 ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No previous chats
            </div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                className={`history-item ${session.id === currentSessionId ? 'active' : ''}`}
                onClick={() => {
                  onSelectSession(session.id);
                  onClose();
                }}
                title={session.title}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={14} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {session.title}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
