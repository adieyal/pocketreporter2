import { useState } from 'react';
import { Timer, AlertCircle } from 'lucide-react';

interface SafetyWidgetProps {
  timeLeft: string;
  isActive: boolean;
  onStart: (mins: number) => void;
  onStop: () => void;
  onCheckIn: () => void;
}

export function SafetyWidget({ timeLeft, isActive, onStart, onStop, onCheckIn }: SafetyWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Minified View (Floating Pill) - when timer is active
  if (!isOpen && isActive) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 z-40 bg-gray-900/90 backdrop-blur text-white pl-3 pr-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-red-500/50 animate-pulse"
      >
        <div className="w-2 h-2 bg-red-500 rounded-full" />
        <span className="font-mono font-bold tabular-nums">{timeLeft}</span>
      </button>
    );
  }

  // Collapsed View (Icon only) - when timer is inactive
  if (!isOpen && !isActive) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 z-40 bg-white/90 backdrop-blur text-gray-600 p-2 rounded-full shadow-md border border-gray-200"
      >
        <Timer size={24} />
      </button>
    );
  }

  // Expanded View (Modal)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-xs rounded-2xl shadow-2xl p-4">
        <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold">
          <AlertCircle className="text-brand" />
          Safety Check-in
        </div>

        {isActive ? (
          <div className="text-center py-4">
            <div className="text-5xl font-mono font-bold text-gray-900 tabular-nums mb-2">
              {timeLeft}
            </div>
            <p className="text-gray-500 text-sm mb-6">Until distress alert</p>

            <div className="grid gap-3">
              <button
                onClick={() => { onCheckIn(); setIsOpen(false); }}
                className="w-full py-3 bg-brand text-white font-bold rounded-xl active:scale-95 transition-transform"
              >
                I'm OK (Check In)
              </button>
              <button
                onClick={() => { onStop(); setIsOpen(false); }}
                className="w-full py-3 text-red-500 font-semibold text-sm"
              >
                Cancel Timer
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 text-sm mb-4">
              If you don't check in within this time, the app will prompt you to send an emergency alert.
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[15, 30, 60].map(m => (
                <button
                  key={m}
                  onClick={() => { onStart(m); setIsOpen(false); }}
                  className="py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-gray-700"
                >
                  {m}m
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2 text-gray-400 text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
