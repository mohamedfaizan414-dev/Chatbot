import React from 'react';
import { useServerHealth } from '../../hooks/useServerHealth';
import styles from './Sidebar.module.css';

const SUGGESTIONS = [
  'Explain async/await in Python',
  'Write a React custom hook',
  'What is LangGraph?',
  'Debug this code for me',
  'Tell me a programming joke',
];

export function Sidebar({ open, onToggle, onClear, onSuggestion, messageCount }) {
  const { health, checking } = useServerHealth();

  return (
    <aside className={`${styles.sidebar} ${!open ? styles.closed : ''}`}>
      <div className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="var(--accent-2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {open && <span className={styles.brandText}>NeuralChat</span>}
        </div>
        <button className={styles.toggleBtn} onClick={onToggle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            {open ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className={styles.body}>
          <div className={styles.serverCard}>
            <div className={styles.serverRow}>
              <span className={`${styles.dot} ${checking ? styles.dotYellow : health ? styles.dotGreen : styles.dotRed}`} />
              <span className={styles.serverLabel}>
                {checking ? 'Connecting...' : health ? 'Backend online' : 'Backend offline'}
              </span>
            </div>
            {health && (
              <span className={styles.modelBadge}>{health.model}</span>
            )}
          </div>

          <div className={styles.section}>
            <p className={styles.sectionTitle}>Try asking</p>
            <ul className={styles.suggestions}>
              {SUGGESTIONS.map(s => (
                <li key={s}>
                  <button className={styles.suggestionBtn} onClick={() => onSuggestion(s)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.footer}>
            <div className={styles.statRow}>
              <span className={styles.statNum}>{messageCount}</span>
              <span className={styles.statLabel}>messages</span>
            </div>
            <button className={styles.clearBtn} onClick={onClear}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              New chat
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
