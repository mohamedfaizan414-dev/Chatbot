import { useState, useCallback, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { api } from '../services/api';

function makeMessage(role, content, extra = {}) {
  return { id: uuid(), role, content, timestamp: new Date(), ...extra };
}

const INITIAL_MESSAGE = makeMessage(
  'assistant',
  "Hey! I'm NeuralChat, powered by Groq. Ask me anything."
);

export function useChatSession() {
  const sessionId = useRef(uuid());
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const abortStream = useRef(null);

  const historyForApi = useCallback((msgs) => {
    return msgs
      .filter(m => m.role !== 'system' && !m.error && m.id !== INITIAL_MESSAGE.id)
      .map(({ role, content }) => ({ role, content }));
  }, []);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    setError(null);
    const userMsg = makeMessage('user', trimmed);
    const assistantId = uuid();

    setMessages(prev => [
      ...prev,
      userMsg,
      makeMessage('assistant', '', { id: assistantId, streaming: true }),
    ]);

    setIsStreaming(true);

    abortStream.current = api.streamMessage(
      sessionId.current,
      trimmed,
      historyForApi([...messages, userMsg]),
      {
        onToken: (delta) => {
          setMessages(prev => prev.map(m =>
            m.id === assistantId ? { ...m, content: m.content + delta } : m
          ));
        },
        onDone: () => {
          setMessages(prev => prev.map(m =>
            m.id === assistantId ? { ...m, streaming: false } : m
          ));
          setIsStreaming(false);
          abortStream.current = null;
        },
        onError: (err) => {
          setMessages(prev => prev.map(m =>
            m.id === assistantId
              ? { ...m, content: 'Something went wrong. Check your API key and try again.', streaming: false, error: true }
              : m
          ));
          setError(err.message);
          setIsStreaming(false);
        },
      }
    );
  }, [isStreaming, messages, historyForApi]);

  const clearSession = useCallback(async () => {
    abortStream.current?.();
    setIsStreaming(false);
    setError(null);
    await api.clearSession(sessionId.current).catch(() => {});
    sessionId.current = uuid();
    setMessages([makeMessage('assistant', "Chat cleared. Fresh start — what's on your mind?")]);
  }, []);

  const stopStreaming = useCallback(() => {
    abortStream.current?.();
    setMessages(prev => prev.map(m => m.streaming ? { ...m, streaming: false } : m));
    setIsStreaming(false);
  }, []);

  return {
    messages,
    isStreaming,
    error,
    sessionId: sessionId.current,
    sendMessage,
    clearSession,
    stopStreaming,
  };
}
