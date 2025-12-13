import { useState, useEffect } from 'react';
import { PlayCircle, Image as ImageIcon, Mic } from 'lucide-react';
import type { MediaItem } from '../../lib/types';

export function MediaGallery({ items }: { items: MediaItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mt-8 mb-4">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Attached Media ({items.length})</h3>
      <div className="grid grid-cols-3 gap-2">
        {items.map(item => (
          <MediaThumbnail key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function MediaThumbnail({ item }: { item: MediaItem }) {
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Create object URL from Blob for display
  useEffect(() => {
    const url = URL.createObjectURL(item.blob);
    setPreviewUrl(url);
    // Cleanup on unmount to prevent memory leaks
    return () => URL.revokeObjectURL(url);
  }, [item.blob]);

  return (
    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
      {item.type === 'photo' ? (
        <img src={previewUrl} alt="Attachment" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
          <PlayCircle size={32} className="mb-1" />
          <span className="text-xs font-medium">Audio</span>
        </div>
      )}
      <div className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full">
        {item.type === 'photo' ? <ImageIcon size={12} /> : <Mic size={12} />}
      </div>
    </div>
  );
}
