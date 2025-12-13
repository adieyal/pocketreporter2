import { useState, useEffect, useRef } from 'react';

const TIMER_KEY = 'pocket_reporter_safety_deadline';

export function useSafetyTimer() {
  const [deadline, setDeadline] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Restore timer from storage on load
    const stored = localStorage.getItem(TIMER_KEY);
    if (stored) {
      const target = parseInt(stored, 10);
      if (target > Date.now()) {
        setDeadline(target);
      } else {
        // Timer expired while app was closed
        setIsExpired(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!deadline) {
      setTimeLeft('');
      return;
    }

    const tick = () => {
      const now = Date.now();
      const diff = deadline - now;

      if (diff <= 0) {
        setIsExpired(true);
        setDeadline(null);
        localStorage.removeItem(TIMER_KEY);
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        // Format MM:SS
        const mins = Math.floor((diff / 1000 / 60) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
      }
    };

    tick(); // Run immediately
    intervalRef.current = window.setInterval(tick, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [deadline]);

  const startTimer = (minutes: number) => {
    const target = Date.now() + minutes * 60 * 1000;
    setDeadline(target);
    setIsExpired(false);
    localStorage.setItem(TIMER_KEY, target.toString());
  };

  const checkIn = () => {
    // Reset the timer (add the original duration back, or just clear it)
    // For this implementation, we'll just stop it, requiring a manual restart
    stopTimer();
  };

  const stopTimer = () => {
    setDeadline(null);
    setIsExpired(false);
    setTimeLeft('');
    localStorage.removeItem(TIMER_KEY);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return { timeLeft, isExpired, startTimer, stopTimer, checkIn, isActive: !!deadline };
}
