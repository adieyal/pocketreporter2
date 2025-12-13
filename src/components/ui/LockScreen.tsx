import { useState } from 'react';
import { Lock, AlertTriangle } from 'lucide-react';
import { useSecurity } from '../../hooks/useSecurity';

export function LockScreen() {
  const { isLocked, unlock } = useSecurity();
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(false);

  if (!isLocked) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlock(pinInput);
    if (success) {
      setPinInput('');
      setError(false);
    } else {
      setError(true);
      setPinInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-dark z-[100] flex flex-col items-center justify-center p-4 text-white">
      <div className="mb-8 p-4 bg-white/10 rounded-full">
        <Lock size={48} />
      </div>

      <h1 className="text-2xl font-bold mb-6">Pocket Reporter Locked</h1>

      <form onSubmit={handleUnlock} className="w-full max-w-xs space-y-4">
        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value)}
          placeholder="Enter 4-digit PIN"
          className="w-full text-center text-3xl tracking-[1em] p-4 bg-black/20 border border-white/20 rounded-xl focus:ring-2 focus:ring-brand-light outline-none placeholder:tracking-normal placeholder:text-base placeholder:text-white/50"
          autoFocus
        />

        <button
          type="submit"
          className="w-full py-4 bg-white text-brand-dark font-bold rounded-xl active:scale-95 transition-transform"
        >
          Unlock
        </button>
      </form>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-300 animate-pulse">
          <AlertTriangle size={20} />
          <span>Incorrect PIN</span>
        </div>
      )}
    </div>
  );
}
