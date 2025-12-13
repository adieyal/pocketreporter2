import Dexie, { type Table } from 'dexie';
import type { Story, MediaItem } from './types';

class PocketReporterDB extends Dexie {
  stories!: Table<Story>;
  media!: Table<MediaItem>;

  constructor() {
    super('PocketReporterDB');
    // Version 1: stories only
    this.version(1).stores({
      stories: '++id, uuid, status, updatedAt'
    });
    // Version 2: added media table
    this.version(2).stores({
      stories: '++id, uuid, status, updatedAt',
      media: '++id, storyUuid, type, createdAt'
    });
  }
}

export const db = new PocketReporterDB();
