import { useState, useRef, useCallback } from 'react';

export function formatTime(ms: number): string {
  const totalMs = Math.floor(ms);
  const minutes = Math.floor(totalMs / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const millis  = Math.floor((totalMs % 1000) / 10);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(2, '0')}`;
}

export function useTimer() {
  const [elapsed, setElapsed]   = useState(0);
  const [running, setRunning]   = useState(false);
  const [finished, setFinished] = useState(false);
  const startRef  = useRef<number | null>(null);
  const rafRef    = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (startRef.current !== null) {
      setElapsed(performance.now() - startRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  const start = useCallback(() => {
    if (running) return;
    startRef.current = performance.now() - elapsed;
    setRunning(true);
    setFinished(false);
    rafRef.current = requestAnimationFrame(tick);
  }, [running, elapsed, tick]);

  const stop = useCallback(() => {
    if (!running) return;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    setRunning(false);
    setFinished(true);
  }, [running]);

  const reset = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    setElapsed(0);
    setRunning(false);
    setFinished(false);
  }, []);

  return { elapsed, running, finished, start, stop, reset, formatted: formatTime(elapsed) };
}
