import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { MessageList } from './components/chat/MessageList';
import { ChatInput } from './components/chat/ChatInput';
import { ChatHeader } from './components/chat/ChatHeader';
import { useChatSession } from './hooks/useChatSession';
import './styles/globals.css';
import styles from './App.module.css';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState('');
  const { messages, isStreaming, sessionId, sendMessage, clearSession, stopStreaming } = useChatSession();

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput('');
  };

  const handleSuggestion = (text) => {
    setInput(text);
    setTimeout(() => {
      sendMessage(text);
      setInput('');
    }, 0);
  };

  return (
    <div className={styles.app}>
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(o => !o)}
        onClear={clearSession}
        onSuggestion={handleSuggestion}
        messageCount={messages.length}
      />
      <div className={styles.chat}>
        <ChatHeader isStreaming={isStreaming} sessionId={sessionId} />
        <MessageList messages={messages} isStreaming={isStreaming} />
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          onStop={stopStreaming}
          isStreaming={isStreaming}
          disabled={false}
        />
      </div>
    </div>
  );
}
