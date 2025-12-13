import { useState, useEffect } from 'react';
import { PlayCircle, Image as ImageIcon, Mic, FileText } from 'lucide-react';
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

  // Document thumbnail
  if (item.type === 'document') {
    return (
      <div className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-200 group">
        <div className="absolute inset-0 p-2 opacity-50 blur-[1px]">
          {previewUrl && <img src={previewUrl} alt="Document" className="w-full h-full object-cover" />}
        </div>
        <div className="absolute inset-0 bg-white/80 p-3 flex flex-col">
          <FileText className="text-brand mb-2" size={24} />
          <p className="text-[10px] text-gray-800 line-clamp-4 font-mono leading-tight">
            {item.extractedText || "No text"}
          </p>
        </div>
        <div className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full z-10">
          <FileText size={12} />
        </div>
      </div>
    );
  }

  // Photo/Audio thumbnail
  return (
    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
      {item.type === 'photo' ? (
        previewUrl && <img src={previewUrl} alt="Attachment" className="w-full h-full object-cover" />
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
