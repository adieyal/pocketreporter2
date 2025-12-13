import { useState } from 'react';
import { Shield, Trash2, AlertTriangle } from 'lucide-react';
import { useSecurity } from '../hooks/useSecurity';
import { db } from '../lib/db';

export function SettingsPage() {
  const { hasPin, setPin, triggerPanic } = useSecurity();
  const [showPanicConfirm, setShowPanicConfirm] = useState(false);

  const handleSetPin = () => {
    const newPin = prompt("Enter a new 4-digit PIN:");
    if (newPin && newPin.length === 4 && /^\d+$/.test(newPin)) {
      setPin(newPin);
      alert("PIN set successfully.");
    } else {
      alert("Invalid PIN. Must be 4 digits.");
    }
  };

  const handleClearData = async () => {
    if (confirm("Are you sure? This deletes ALL stories.")) {
      await db.stories.clear();
      await db.media.clear();
      alert("All stories deleted.");
    }
  };

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Security Section */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Security</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

          <button
            onClick={handleSetPin}
            className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 text-left border-b border-gray-200"
          >
            <div className="bg-brand-light p-2 rounded-lg text-brand">
              <Shield size={20} />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{hasPin ? "Change App PIN" : "Set App PIN"}</div>
              <div className="text-xs text-gray-500">Protect access to your stories</div>
            </div>
          </button>

          <button
            onClick={() => setShowPanicConfirm(true)}
            className="w-full flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 text-left"
          >
            <div className="bg-red-100 p-2 rounded-lg text-red-600">
              <AlertTriangle size={20} />
            </div>
            <div className="flex-1">
              <div className="font-medium text-red-700">Panic Button</div>
              <div className="text-xs text-red-600/70">Instantly wipe all data</div>
            </div>
          </button>
        </div>
      </section>

      {/* Panic Confirmation Modal */}
      {showPanicConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-red-600 mb-2">Extreme Danger</h3>
            <p className="text-gray-600 mb-6">
              This will permanently delete ALL stories, photos, and settings. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPanicConfirm(false)}
                className="flex-1 py-3 bg-gray-100 font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={triggerPanic}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg"
              >
                WIPE EVERYTHING
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Section */}
      <section>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Data</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button onClick={handleClearData} className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 text-left">
            <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
              <Trash2 size={20} />
            </div>
            <div className="font-medium text-gray-900">Clear Storage</div>
          </button>
        </div>
      </section>
    </div>
  );
}
