const BASE_URL = process.env.REACT_APP_API_URL || '';

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  async health() {
    const res = await fetch(`${BASE_URL}/api/v1/health`);
    return handleResponse(res);
  },

  async sendMessage(sessionId, message, history = []) {
    const res = await fetch(`${BASE_URL}/api/v1/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, message, history }),
    });
    return handleResponse(res);
  },

  streamMessage(sessionId, message, history = [], { onToken, onDone, onError } = {}) {
    const controller = new AbortController();

    fetch(`${BASE_URL}/api/v1/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, message, history }),
      signal: controller.signal,
    }).then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const lines = decoder.decode(value).split('\n');
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.error) { onError?.(new Error(payload.error)); return; }
            if (payload.done) { onDone?.(); return; }
            if (payload.delta) onToken?.(payload.delta);
          } catch {
            // malformed chunk — skip
          }
        }
      }
    }).catch((err) => {
      if (err.name !== 'AbortError') onError?.(err);
    });

    return () => controller.abort();
  },

  async clearSession(sessionId) {
    const res = await fetch(`${BASE_URL}/api/v1/session/${sessionId}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },
};
