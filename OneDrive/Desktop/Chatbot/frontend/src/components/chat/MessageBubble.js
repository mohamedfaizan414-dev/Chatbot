import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './MessageBubble.module.css';

function CodeBlock({ children, className }) {
  const language = /language-(\w+)/.exec(className || '')?.[1] || 'text';
  return (
    <div className={styles.codeWrapper}>
      <div className={styles.codeMeta}>
        <span className={styles.codeLang}>{language}</span>
        <button
          className={styles.copyBtn}
          onClick={() => navigator.clipboard.writeText(String(children).trim())}
        >
          Copy
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        customStyle={{ margin: 0, borderRadius: '0 0 8px 8px', fontSize: '13px', background: '#0d0d18' }}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`${styles.row} ${isUser ? styles.user : styles.assistant}`}>
      {!isUser && (
        <div className={styles.avatar}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="var(--accent-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <div className={styles.content}>
        <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.assistantBubble} ${message.error ? styles.errorBubble : ''}`}>
          {isUser ? (
            <p className={styles.userText}>{message.content}</p>
          ) : (
            <div className="md-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children }) {
                    return inline
                      ? <code className={styles.inlineCode}>{children}</code>
                      : <CodeBlock className={className}>{children}</CodeBlock>;
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
              {message.streaming && <span className={styles.cursor} />}
            </div>
          )}
        </div>
        <span className={styles.time}>{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
}
