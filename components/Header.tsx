'use client';

import { Trash2, Zap, Menu } from 'lucide-react';

interface HeaderProps {
  onClear: () => void;
  messageCount: number;
  onToggleSidebar?: () => void;
}

export default function Header({ onClear, messageCount, onToggleSidebar }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-brand">
        {onToggleSidebar && (
          <button className="btn-icon mobile-only" onClick={onToggleSidebar} aria-label="Toggle Sidebar" style={{ marginRight: '8px' }}>
            <Menu size={18} />
          </button>
        )}
        <div className="header-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10" />
            <path d="M12 6v6l4 2" />
            <circle cx="18" cy="6" r="3" fill="white" stroke="none" />
            <path d="M16.5 4.5 18 6l1.5-1.5" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>
        <div>
          <div className="header-title">AI Tutor</div>
          <div className="header-subtitle">Powered by Groq · LLaMA 3.3 70B</div>
        </div>
      </div>

      <div className="header-actions">
        <div className="groq-badge">
          <div className="groq-dot" />
          <Zap size={10} />
          Groq
        </div>

        {messageCount > 0 && (
          <button
            className="btn-icon"
            onClick={onClear}
            title="Clear conversation"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </header>
  );
}
