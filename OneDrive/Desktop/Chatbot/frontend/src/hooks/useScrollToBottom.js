import { useEffect, useRef } from 'react';

export function useScrollToBottom(deps) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, deps);

  return ref;
}
