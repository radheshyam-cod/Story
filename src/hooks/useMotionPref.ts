import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export function useMotionPref() {
  const prefersReduced = useReducedMotion();
  const [isFinePointer, setIsFinePointer] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return { prefersReduced, isFinePointer };
}
