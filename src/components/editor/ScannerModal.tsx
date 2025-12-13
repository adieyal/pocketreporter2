import { useState, useRef } from 'react';
import { X, Save, ScanLine, FileText, RefreshCw, Check } from 'lucide-react';
import { useScanner } from '../../hooks/useScanner';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (blob: Blob, extractedText: string) => Promise<void>;
}

export function ScannerModal({ isOpen, onClose, onSave }: ScannerModalProps) {
  const { scanImage, progress, status } = useScanner();

  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editableText, setEditableText] = useState('');
  const [step, setStep] = useState<'capture' | 'scanning' | 'review'>('capture');
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageBlob(file);
    setPreviewUrl(URL.createObjectURL(file));
    setStep('scanning');

    try {
      const text = await scanImage(file);
      setEditableText(text || '');
      setStep('review');
    } catch (error) {
      console.error('OCR failed:', error);
      setEditableText('');
      setStep('review');
    }
  };

  const handleOpenCamera = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    if (!imageBlob) return;

    setSaving(true);
    await onSave(imageBlob, editableText);
    handleClose();
  };

  const handleClose = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setStep('capture');
    setImageBlob(null);
    setPreviewUrl(null);
    setEditableText('');
    setSaving(false);
    onClose();
  };

  const handleRetake = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setStep('capture');
    setImageBlob(null);
    setPreviewUrl(null);
    setEditableText('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/50 pointer-events-auto" onClick={handleClose} />

      <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-xl p-4 shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <ScanLine className="text-brand" size={20} />
            Document Scanner
          </h3>
          <button onClick={handleClose} className="p-2 bg-gray-100 rounded-full text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-[300px] flex flex-col">

          {/* STEP 1: CAPTURE */}
          {step === 'capture' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
              <FileText size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 text-center mb-6">
                Take a clear photo of a document, invoice, or letter to extract the text.
              </p>
              <button
                onClick={handleOpenCamera}
                className="py-3 px-6 bg-brand text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform"
              >
                Open Camera
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleCapture}
              />
            </div>
          )}

          {/* STEP 2: SCANNING PROGRESS */}
          {step === 'scanning' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              {previewUrl && (
                <img src={previewUrl} alt="Scanning" className="w-32 h-32 object-cover rounded-lg mb-6 opacity-50 grayscale" />
              )}
              <div className="w-full max-w-xs bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                <div
                  className="bg-brand h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-brand font-bold text-lg">{status}...</p>
              <p className="text-gray-400 text-sm mt-2">{progress}%</p>
            </div>
          )}

          {/* STEP 3: REVIEW & EDIT */}
          {step === 'review' && (
            <div className="flex flex-col gap-4 h-full">
              <div className="bg-blue-50 p-3 rounded-lg flex gap-3 text-sm text-blue-700">
                <Check size={20} className="shrink-0" />
                <p>Text extracted. Please verify accuracy before saving.</p>
              </div>

              <div className="flex-1 relative">
                <textarea
                  value={editableText}
                  onChange={(e) => setEditableText(e.target.value)}
                  className="w-full h-full min-h-[200px] p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand outline-none font-mono text-sm leading-relaxed resize-none"
                  placeholder="No text detected..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step === 'review' && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3 shrink-0">
            <button
              onClick={handleRetake}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <RefreshCw size={18} /> Retake
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-[2] py-3 bg-brand text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform disabled:opacity-50"
            >
              <Save size={18} /> Save Document
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
