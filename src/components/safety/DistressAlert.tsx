import { useEffect, useState } from 'react';
import { AlertTriangle, Share, XCircle, MapPin } from 'lucide-react';
import { generateStoryZip } from '../../lib/export';
import type { Story } from '../../lib/types';

interface DistressAlertProps {
  story: Story;
  onDismiss: () => void;
}

export function DistressAlert({ story, onDismiss }: DistressAlertProps) {
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);

  // 1. Vibrate phone immediately on mount
  useEffect(() => {
    if (navigator.vibrate) {
      // SOS Pattern: ... --- ...
      navigator.vibrate([100,30,100,30,100,200,200,30,200,30,200,200,100,30,100,30,100]);
    }

    // Attempt to get location in background
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
  }, []);

  const handleShareDistress = async () => {
    const mapLink = coords
      ? `https://maps.google.com/?q=${coords.lat},${coords.lng}`
      : 'Location unavailable';

    const text = `DISTRESS SIGNAL
I have missed my safety check-in.
Last Known Location: ${mapLink}
Draft Story: "${story.headline}" attached.`;

    try {
      if (navigator.share) {
        const zipBlob = await generateStoryZip(story);
        const file = new File([zipBlob], 'report.zip', { type: 'application/zip' });

        await navigator.share({
          title: 'URGENT: Reporter Distress Signal',
          text: text,
          files: [file]
        });
      } else {
        // Fallback for desktops/unsupported browsers
        window.location.href = `mailto:editor@newsroom.com?subject=DISTRESS SIGNAL&body=${encodeURIComponent(text)}`;
      }
    } catch {
      alert("Could not share. Taking you to message app...");
      window.location.href = `sms:?body=${encodeURIComponent(text)}`;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-red-600 text-white flex flex-col items-center justify-center p-6">
      <div className="bg-white/20 p-6 rounded-full mb-6 animate-pulse">
        <AlertTriangle size={64} />
      </div>

      <h1 className="text-3xl font-black uppercase tracking-widest text-center mb-2">Check-in Missed</h1>
      <p className="text-red-100 text-center mb-12 max-w-xs">
        Your safety timer has expired. Send a distress signal to your editor immediately.
      </p>

      <button
        onClick={handleShareDistress}
        className="w-full max-w-sm py-6 bg-white text-red-600 font-black text-xl rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform mb-6"
      >
        <Share size={28} />
        SEND SIGNAL
      </button>

      {coords && (
        <div className="flex items-center gap-2 text-sm text-red-200 mb-12">
           <MapPin size={16} /> Location Locked: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
        </div>
      )}

      <button
        onClick={onDismiss}
        className="text-red-200 font-semibold flex items-center gap-2 px-6 py-3 border-2 border-red-400 rounded-full"
      >
        <XCircle size={20} />
        I'm Safe (Dismiss)
      </button>
    </div>
  );
}
