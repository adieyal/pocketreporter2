import { db } from './db';
import type { Story, MediaItem, SourceContact, StoryLocation } from './types';

interface BackupData {
  version: number;
  exportedAt: string;
  stories: Story[];
  media: (Omit<MediaItem, 'blob'> & { blobBase64: string; mimeType: string })[];
  contacts: SourceContact[];
  locations: StoryLocation[];
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix to get just the base64
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

export async function exportDatabase(): Promise<Blob> {
  const stories = await db.stories.toArray();
  const mediaItems = await db.media.toArray();
  const contacts = await db.contacts.toArray();
  const locations = await db.locations.toArray();

  // Convert media blobs to base64
  const mediaWithBase64 = await Promise.all(
    mediaItems.map(async (item) => {
      const { blob, ...rest } = item;
      const blobBase64 = await blobToBase64(blob);
      const mimeType = blob.type || 'application/octet-stream';
      return { ...rest, blobBase64, mimeType };
    })
  );

  const backup: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    stories,
    media: mediaWithBase64,
    contacts,
    locations,
  };

  const json = JSON.stringify(backup, null, 2);
  return new Blob([json], { type: 'application/json' });
}

export async function importDatabase(file: File): Promise<{ stories: number; media: number; contacts: number; locations: number }> {
  const text = await file.text();
  const backup: BackupData = JSON.parse(text);

  if (!backup.version || !backup.stories) {
    throw new Error('Invalid backup file format');
  }

  // Clear existing data
  await db.stories.clear();
  await db.media.clear();
  await db.contacts.clear();
  await db.locations.clear();

  // Import stories (without id to let Dexie auto-generate)
  for (const story of backup.stories) {
    const { id, ...storyData } = story;
    await db.stories.add(storyData as Story);
  }

  // Import media with blob conversion
  for (const item of backup.media) {
    const { id, blobBase64, mimeType, ...rest } = item;
    const blob = base64ToBlob(blobBase64, mimeType);
    await db.media.add({ ...rest, blob } as MediaItem);
  }

  // Import contacts
  for (const contact of backup.contacts) {
    const { id, ...contactData } = contact;
    await db.contacts.add(contactData as SourceContact);
  }

  // Import locations
  for (const location of backup.locations) {
    const { id, ...locationData } = location;
    await db.locations.add(locationData as StoryLocation);
  }

  return {
    stories: backup.stories.length,
    media: backup.media.length,
    contacts: backup.contacts.length,
    locations: backup.locations.length,
  };
}
