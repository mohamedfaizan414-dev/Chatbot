import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useServerHealth() {
  const [health, setHealth] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api.health()
      .then(setHealth)
      .catch(() => setHealth(null))
      .finally(() => setChecking(false));
  }, []);

  return { health, checking };
}
