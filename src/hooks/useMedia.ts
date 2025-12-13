import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import type { MediaItem } from '../lib/types';

export function useMedia(storyUuid: string) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);

  // 1. Load Media for this Story
  useEffect(() => {
    if (!storyUuid) return;

    db.media.where('storyUuid').equals(storyUuid).toArray()
      .then(setMedia)
      .catch(err => console.error("Failed to load media", err));

  }, [storyUuid]);

  // 2. Add a Photo/Audio Blob
  const addMedia = async (file: File, type: 'photo' | 'audio') => {
    setUploading(true);
    const newItem: MediaItem = {
      storyUuid,
      type,
      blob: file, // Store the raw File/Blob object
      caption: '',
      createdAt: new Date().toISOString()
    };

    try {
      const id = await db.media.add(newItem);
      // Update local state to show immediately
      setMedia(prev => [...prev, { ...newItem, id: Number(id) }]);
    } catch (error) {
      console.error("Failed to save media", error);
      alert("Could not save media. Check storage space.");
    } finally {
      setUploading(false);
    }
  };

  // 3. Add a Document with extracted text
  const addDocument = async (file: Blob, extractedText: string) => {
    setUploading(true);
    const newItem: MediaItem = {
      storyUuid,
      type: 'document',
      blob: file,
      caption: '',
      extractedText,
      createdAt: new Date().toISOString()
    };

    try {
      const id = await db.media.add(newItem);
      setMedia(prev => [...prev, { ...newItem, id: Number(id) }]);
    } catch (error) {
      console.error("Failed to save document", error);
      alert("Could not save document. Check storage space.");
    } finally {
      setUploading(false);
    }
  };

  return { media, addMedia, addDocument, uploading };
}
