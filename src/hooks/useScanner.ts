import { useState, useCallback } from 'react';
import { createWorker } from 'tesseract.js';
import type { LoggerMessage } from 'tesseract.js';

export function useScanner() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('idle');
  const [result, setResult] = useState<string>('');

  const scanImage = useCallback(async (imageBlob: Blob) => {
    setStatus('initializing');
    setProgress(0);
    setResult('');

    try {
      // In Tesseract.js v5+, createWorker takes (langs, oem, options)
      // Language data is automatically cached in IndexedDB for offline use
      const worker = await createWorker('eng', 1, {
        logger: (m: LoggerMessage) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
            setStatus('processing');
          } else {
            setStatus(m.status);
          }
        }
      });

      const ret = await worker.recognize(imageBlob);
      setResult(ret.data.text);

      await worker.terminate();
      setStatus('complete');
      return ret.data.text;
    } catch (error) {
      console.error("OCR Error:", error);
      setStatus('error');
      return null;
    }
  }, []);

  const reset = () => {
    setProgress(0);
    setStatus('idle');
    setResult('');
  };

  return { scanImage, progress, status, result, reset };
}
