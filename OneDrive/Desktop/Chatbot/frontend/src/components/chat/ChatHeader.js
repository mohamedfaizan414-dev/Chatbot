import React from 'react';
import styles from './ChatHeader.module.css';

export function ChatHeader({ isStreaming, sessionId }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={`${styles.dot} ${isStreaming ? styles.dotActive : styles.dotIdle}`} />
        <span className={styles.title}>AI Assistant</span>
      </div>
      <div className={styles.right}>
        <span className={styles.session} title={`Session: ${sessionId}`}>
          {sessionId.slice(0, 8)}
        </span>
      </div>
    </header>
  );
}
