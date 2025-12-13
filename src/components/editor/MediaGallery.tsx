import { useState, useEffect, useRef } from 'react';
import { PlayCircle, PauseCircle, Image as ImageIcon, Mic, FileText, X } from 'lucide-react';
import type { MediaItem } from '../../lib/types';

export function MediaGallery({ items }: { items: MediaItem[] }) {
  const [fullscreenPhoto, setFullscreenPhoto] = useState<MediaItem | null>(null);

  if (items.length === 0) return null;

  return (
    <div className="mt-8 mb-4">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Attached Media ({items.length})</h3>
      <div className="grid grid-cols-3 gap-2">
        {items.map(item => (
          <MediaThumbnail key={item.id} item={item} onPhotoClick={setFullscreenPhoto} />
        ))}
      </div>

      {/* Fullscreen Photo Lightbox */}
      {fullscreenPhoto && (
        <PhotoLightbox item={fullscreenPhoto} onClose={() => setFullscreenPhoto(null)} />
      )}
    </div>
  );
}

function PhotoLightbox({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(item.blob);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [item.blob]);

  return (
    <div
      className="fixed inset-0 z-[70] bg-black flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white z-10"
      >
        <X size={24} />
      </button>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Full size"
          className="max-w-full max-h-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}

function MediaThumbnail({ item, onPhotoClick }: { item: MediaItem; onPhotoClick: (item: MediaItem) => void }) {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create object URL from Blob for display
  useEffect(() => {
    const url = URL.createObjectURL(item.blob);
    setPreviewUrl(url);
    // Cleanup on unmount to prevent memory leaks
    return () => URL.revokeObjectURL(url);
  }, [item.blob]);

  const handleAudioClick = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(previewUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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

  // Audio thumbnail
  if (item.type === 'audio') {
    return (
      <button
        onClick={handleAudioClick}
        className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 w-full"
      >
        <div className={`w-full h-full flex flex-col items-center justify-center ${isPlaying ? 'text-brand' : 'text-gray-500'}`}>
          {isPlaying ? (
            <PauseCircle size={32} className="mb-1" />
          ) : (
            <PlayCircle size={32} className="mb-1" />
          )}
          <span className="text-xs font-medium">{isPlaying ? 'Playing' : 'Audio'}</span>
        </div>
        <div className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full">
          <Mic size={12} />
        </div>
      </button>
    );
  }

  // Photo thumbnail
  return (
    <button
      onClick={() => onPhotoClick(item)}
      className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 w-full"
    >
      {previewUrl && <img src={previewUrl} alt="Attachment" className="w-full h-full object-cover" />}
      <div className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full">
        <ImageIcon size={12} />
      </div>
    </button>
  );
}
