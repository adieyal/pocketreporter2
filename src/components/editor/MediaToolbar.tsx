import { Camera, Mic, Paperclip } from 'lucide-react';
import { useMedia } from '../../hooks/useMedia';

export function MediaToolbar({ storyUuid }: { storyUuid: string }) {
  const { addMedia, uploading } = useMedia(storyUuid);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'audio') => {
    const file = e.target.files?.[0];
    if (file) {
      addMedia(file, type);
    }
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-3 flex justify-around items-center z-40">
      {/* Photo Input */}
      <label className="flex flex-col items-center gap-1 text-gray-600 active:scale-95 transition-transform">
        <div className={`bg-gray-100 p-3 rounded-full ${uploading ? 'opacity-50' : ''}`}>
          <Camera size={24} />
        </div>
        <span className="text-xs">Photo</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'photo')}
          disabled={uploading}
        />
      </label>

      {/* Audio Input */}
      <label className="flex flex-col items-center gap-1 text-gray-600 active:scale-95 transition-transform">
        <div className="bg-gray-100 p-3 rounded-full">
          <Mic size={24} />
        </div>
        <span className="text-xs">Audio Note</span>
        <input
          type="file"
          accept="audio/*"
          capture="user"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'audio')}
        />
      </label>

      <button className="flex flex-col items-center gap-1 text-gray-400">
        <div className="bg-gray-50 p-3 rounded-full">
          <Paperclip size={24} />
        </div>
        <span className="text-xs">Attach</span>
      </button>
    </div>
  );
}
