'use client';

import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { Check, Copy } from 'lucide-react';
import type { UIMessage } from 'ai';
import MermaidChart from './MermaidChart';

interface MessageBubbleProps {
  message: UIMessage;
}

// Code block with copy button
function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  // Extract language from className like "language-python"
  const lang = className?.replace('language-', '') ?? 'code';

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [children]);

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-lang-label">{lang}</span>
        <button
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? (
            <><Check size={12} /> Copied!</>
          ) : (
            <><Copy size={12} /> Copy</>
          )}
        </button>
      </div>
      <pre>
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  // Extract text from parts array or fallback to content string
  const textContent = message.parts
    ? message.parts.filter(p => p.type === 'text').map(p => (p as any).text).join('')
    : (message as any).content || '';

  return (
    <div className={`message-row ${isUser ? 'user' : 'assistant'}`}>
      {/* Avatar */}
      <div className={`message-avatar ${isUser ? 'user' : 'assistant'}`}>
        {isUser ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
          </svg>
        )}
      </div>

      {/* Bubble */}
      <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
        {isUser ? (
          // User messages: plain text, preserve newlines
          <span style={{ whiteSpace: 'pre-wrap' }}>{textContent}</span>
        ) : (
          // Assistant messages: render markdown
          <div className="markdown-content">
            <ReactMarkdown
              rehypePlugins={[rehypeHighlight]}
              components={{
                // Custom code block renderer with copy button
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const lang = match ? match[1].toLowerCase() : '';
                  const contentStr = String(children).trim();
                  
                  // Auto-detect mermaid if the model forgot the language tag
                  const isMermaid = lang === 'mermaid' || 
                                    (!lang && (contentStr.startsWith('graph ') || contentStr.startsWith('flowchart ') || contentStr.startsWith('sequenceDiagram') || contentStr.startsWith('pie') || contentStr.startsWith('stateDiagram') || contentStr.startsWith('classDiagram')));
                  
                  if (isMermaid) {
                    return <MermaidChart chart={contentStr} />;
                  }

                  // It's a block if it has a language or contains newlines
                  const isBlock = !!match || contentStr.includes('\n');

                  if (isBlock) {
                    return (
                      <CodeBlock className={className || 'language-text'}>
                        {String(children).replace(/\n$/, '')}
                      </CodeBlock>
                    );
                  }

                  return <code className={className} {...props}>{children}</code>;
                },
                // Open links in new tab
                a({ href, children }) {
                  return (
                    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                      {children}
                    </a>
                  );
                },
              }}
            >
              {textContent}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
