import { useState, useEffect } from 'react';
import { Shield, WifiOff, FileText, ChevronRight } from 'lucide-react';
import { useSecurity } from '../../hooks/useSecurity';

export function WelcomeWizard() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const [pin, setPinInput] = useState('');
  const { setPin } = useSecurity();

  useEffect(() => {
    const seen = localStorage.getItem('onboarding_complete');
    if (!seen) {
      setShow(true);
    }
  }, []);

  const handleFinish = () => {
    if (step === 2 && pin.length === 4) {
      setPin(pin);
    }
    localStorage.setItem('onboarding_complete', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col">
      {/* Progress Bar */}
      <div className="flex gap-1 p-2">
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-brand' : 'bg-gray-100'}`} />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto w-full">

        {/* STEP 1: Intro */}
        {step === 0 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="w-20 h-20 bg-brand-light text-brand rounded-3xl flex items-center justify-center mx-auto mb-8">
              <FileText size={40} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Pocket Reporter</h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              A news editor in your pocket. Structured questions, offline storage, and secure export.
            </p>
          </div>
        )}

        {/* STEP 2: Features */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300 w-full text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Built for the Field</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-gray-100 p-3 rounded-xl h-fit"><WifiOff size={24} className="text-gray-700"/></div>
                <div>
                  <h3 className="font-bold text-gray-900">Works Offline</h3>
                  <p className="text-sm text-gray-500">No signal? No problem. All data is saved on your device.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-gray-100 p-3 rounded-xl h-fit"><Shield size={24} className="text-gray-700"/></div>
                <div>
                  <h3 className="font-bold text-gray-900">Private & Secure</h3>
                  <p className="text-sm text-gray-500">Your stories never leave your phone until you choose to export them.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Quick Security Setup */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-300 w-full">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Access</h2>
            <p className="text-gray-500 mb-8">Set a 4-digit PIN to prevent others from opening the app.</p>

            <input
              type="tel"
              maxLength={4}
              placeholder="0000"
              value={pin}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center text-4xl tracking-[1em] p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none mb-4 font-mono"
            />
            <p className="text-xs text-gray-400">You can change this later in Settings.</p>
          </div>
        )}

      </div>

      {/* Footer Actions */}
      <div className="p-6 pb-8 max-w-md mx-auto w-full">
        {step < 2 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            className="w-full py-4 bg-brand text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand/20 active:scale-95 transition-transform"
          >
            Next <ChevronRight size={20} />
          </button>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleFinish}
              disabled={pin.length > 0 && pin.length < 4}
              className="w-full py-4 bg-brand text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand/20 active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100"
            >
              {pin.length === 4 ? 'Set PIN & Get Started' : 'Get Started'}
            </button>
            {pin.length === 0 && (
              <button
                onClick={() => { localStorage.setItem('onboarding_complete', 'true'); setShow(false); }}
                className="w-full py-3 text-gray-400 font-medium text-sm"
              >
                Skip Security (Not Recommended)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
