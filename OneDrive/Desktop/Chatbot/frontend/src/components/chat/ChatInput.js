import React, { useRef, useEffect } from 'react';
import styles from './ChatInput.module.css';

export function ChatInput({ value, onChange, onSend, onStop, isStreaming, disabled }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && value.trim()) onSend();
    }
  };

  return (
    <div className={styles.bar}>
      <div className={styles.wrapper}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder="Message NeuralChat..."
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
        />
        <div className={styles.actions}>
          {isStreaming ? (
            <button className={styles.stopBtn} onClick={onStop} title="Stop generation">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </button>
          ) : (
            <button
              className={styles.sendBtn}
              onClick={onSend}
              disabled={!value.trim() || disabled}
              title="Send (Enter)"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <p className={styles.hint}>
        <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for newline
        {isStreaming && <span className={styles.generatingBadge}>Generating...</span>}
      </p>
    </div>
  );
}
