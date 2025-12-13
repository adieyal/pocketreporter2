import Dexie, { type Table } from 'dexie';
import type { Story, MediaItem, SourceContact } from './types';

class PocketReporterDB extends Dexie {
  stories!: Table<Story>;
  media!: Table<MediaItem>;
  contacts!: Table<SourceContact>;

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
    // Version 3: added contacts table
    this.version(3).stores({
      stories: '++id, uuid, status, updatedAt',
      media: '++id, storyUuid, type, createdAt',
      contacts: '++id, storyUuid'
    });
  }
}

export const db = new PocketReporterDB();
