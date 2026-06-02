import React from 'react';
import { MessageBubble } from './MessageBubble';
import { useScrollToBottom } from '../../hooks/useScrollToBottom';
import styles from './MessageList.module.css';

export function MessageList({ messages, isStreaming }) {
  const ref = useScrollToBottom([messages.length, isStreaming]);

  return (
    <div className={styles.list} ref={ref}>
      <div className={styles.inner}>
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>
    </div>
  );
}
