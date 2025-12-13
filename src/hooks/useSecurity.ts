import { useState, useEffect } from 'react';

const PIN_KEY = 'pocket_reporter_pin';
const LOCK_KEY = 'pocket_reporter_locked';

export function useSecurity() {
  const [isLocked, setIsLocked] = useState(false);
  const [hasPin, setHasPin] = useState(false);

  useEffect(() => {
    // Check if PIN exists
    const storedPin = localStorage.getItem(PIN_KEY);
    setHasPin(!!storedPin);

    // Default to locked if PIN exists and session not cleared
    if (storedPin && localStorage.getItem(LOCK_KEY) !== 'false') {
      setIsLocked(true);
    }
  }, []);

  const setPin = (pin: string) => {
    // In production, use a proper hashing library (e.g., bcryptjs)
    // For MVP, we base64 encode to prevent casual shoulder-surfing reading
    localStorage.setItem(PIN_KEY, btoa(pin));
    setHasPin(true);
  };

  const unlock = (pin: string) => {
    const stored = localStorage.getItem(PIN_KEY);
    if (stored === btoa(pin)) {
      setIsLocked(false);
      localStorage.setItem(LOCK_KEY, 'false'); // Session unlock
      return true;
    }
    return false;
  };

  const lockApp = () => {
    setIsLocked(true);
    localStorage.removeItem(LOCK_KEY);
  };

  // PANIC MODE: Wipes everything
  const triggerPanic = async () => {
    // 1. Clear LocalStorage
    localStorage.clear();

    // 2. Delete IndexedDB
    const req = window.indexedDB.deleteDatabase('PocketReporterDB');

    req.onsuccess = () => {
      window.location.href = '/'; // Hard reload
    };
  };

  return { isLocked, hasPin, setPin, unlock, lockApp, triggerPanic };
}
