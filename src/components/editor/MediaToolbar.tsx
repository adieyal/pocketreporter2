import { Camera, Mic, MapPin, Users, Loader2 } from 'lucide-react';
import { useMedia } from '../../hooks/useMedia';

interface MediaToolbarProps {
  storyUuid: string;
  onAddSource: () => void;
  onAddLocation: () => void;
}

export function MediaToolbar({ storyUuid, onAddSource, onAddLocation }: MediaToolbarProps) {
  const { addMedia, uploading } = useMedia(storyUuid);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'audio') => {
    const file = e.target.files?.[0];
    if (file) {
      addMedia(file, type);
    }
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-2 pb-safe z-40">
      <div className="flex justify-around items-center max-w-md mx-auto">

        {/* 1. PHOTO ACTION */}
        <label className="flex flex-col items-center gap-1 p-2 rounded-xl active:bg-gray-100 transition-colors cursor-pointer">
          <div className={`bg-blue-50 text-blue-600 p-3 rounded-full ${uploading ? 'opacity-50' : ''}`}>
            {uploading ? <Loader2 className="animate-spin" size={24} /> : <Camera size={24} />}
          </div>
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Photo</span>
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
        <label className="flex flex-col items-center gap-1 p-2 rounded-xl active:bg-gray-100 transition-colors cursor-pointer">
          <div className="bg-red-50 text-red-600 p-3 rounded-full">
            <Mic size={24} />
          </div>
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Audio</span>
          <input
            type="file"
            accept="audio/*"
            capture
            className="hidden"
            onChange={(e) => handleFileChange(e, 'audio')}
          />
        </label>

        {/* 3. SOURCE ACTION */}
        <button
          onClick={onAddSource}
          className="flex flex-col items-center gap-1 p-2 rounded-xl active:bg-gray-100 transition-colors"
        >
          <div className="bg-purple-50 text-purple-600 p-3 rounded-full">
            <Users size={24} />
          </div>
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Source</span>
        </button>

        {/* 4. LOCATION ACTION */}
        <button
          onClick={onAddLocation}
          className="flex flex-col items-center gap-1 p-2 rounded-xl active:bg-gray-100 transition-colors"
        >
          <div className="bg-green-50 text-green-600 p-3 rounded-full">
            <MapPin size={24} />
          </div>
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Location</span>
        </button>

      </div>
    </div>
  );
}
