import { Camera, Mic, MapPin, Users, Loader2, ScanLine } from 'lucide-react';

interface MediaToolbarProps {
  onAddMedia: (file: File, type: 'photo' | 'audio') => void;
  uploading: boolean;
  onAddSource: () => void;
  onAddLocation: () => void;
  onScanDocument: () => void;
}

export function MediaToolbar({ onAddMedia, uploading, onAddSource, onAddLocation, onScanDocument }: MediaToolbarProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'audio') => {
    const file = e.target.files?.[0];
    if (file) {
      onAddMedia(file, type);
    }
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-md border-t border-gray-200 dark:border-dark-border p-2 pb-safe z-40">
      <div className="flex justify-around items-center max-w-md mx-auto">

        {/* 1. PHOTO ACTION */}
        <label className="flex flex-col items-center gap-1 p-2 rounded-xl active:bg-gray-100 dark:active:bg-dark-border transition-colors cursor-pointer">
          <div className={`bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-full ${uploading ? 'opacity-50' : ''}`}>
            {uploading ? <Loader2 className="animate-spin" size={24} /> : <Camera size={24} />}
          </div>
          <span className="text-[10px] font-medium text-gray-500 dark:text-dark-text-muted uppercase tracking-wide">Photo</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFileChange(e, 'photo')}
            disabled={uploading}
          />
        </label>

        {/* 2. AUDIO ACTION */}
        <label className="flex flex-col items-center gap-1 p-2 rounded-xl active:bg-gray-100 dark:active:bg-dark-border transition-colors cursor-pointer">
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-full">
            <Mic size={24} />
          </div>
          <span className="text-[10px] font-medium text-gray-500 dark:text-dark-text-muted uppercase tracking-wide">Audio</span>
          <input
            type="file"
            accept="audio/*"
            capture
            className="hidden"
            onChange={(e) => handleFileChange(e, 'audio')}
          />
        </label>

        {/* 3. SCAN ACTION */}
        <button
          onClick={onScanDocument}
          className="flex flex-col items-center gap-1 p-2 rounded-xl active:bg-gray-100 dark:active:bg-dark-border transition-colors"
        >
          <div className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 p-3 rounded-full shadow-lg">
            <ScanLine size={24} />
          </div>
          <span className="text-[10px] font-medium text-gray-500 dark:text-dark-text-muted uppercase tracking-wide">Scan</span>
        </button>

        {/* 4. SOURCE ACTION */}
        <button
          onClick={onAddSource}
          className="flex flex-col items-center gap-1 p-2 rounded-xl active:bg-gray-100 dark:active:bg-dark-border transition-colors"
        >
          <div className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-3 rounded-full">
            <Users size={24} />
          </div>
          <span className="text-[10px] font-medium text-gray-500 dark:text-dark-text-muted uppercase tracking-wide">Source</span>
        </button>

        {/* 5. LOCATION ACTION */}
        <button
          onClick={onAddLocation}
          className="flex flex-col items-center gap-1 p-2 rounded-xl active:bg-gray-100 dark:active:bg-dark-border transition-colors"
        >
          <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-full">
            <MapPin size={24} />
          </div>
          <span className="text-[10px] font-medium text-gray-500 dark:text-dark-text-muted uppercase tracking-wide">Location</span>
        </button>

      </div>
    </div>
  );
}
