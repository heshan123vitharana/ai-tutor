'use client';

export default function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <div
        className="message-avatar assistant"
        aria-label="AI Tutor avatar"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </svg>
      </div>
      <div className="typing-dots" role="status" aria-label="AI is typing">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
}
