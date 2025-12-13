import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import type { StoryLocation } from '../lib/types';

export function useLocations(storyUuid: string) {
  const [locations, setLocations] = useState<StoryLocation[]>([]);

  useEffect(() => {
    if (!storyUuid) return;
    db.locations.where('storyUuid').equals(storyUuid).toArray().then(setLocations);
  }, [storyUuid]);

  const addLocation = async (data: Omit<StoryLocation, 'id' | 'storyUuid' | 'createdAt'>) => {
    const newLoc: StoryLocation = {
      ...data,
      storyUuid,
      createdAt: new Date().toISOString()
    };
    const id = await db.locations.add(newLoc);
    setLocations(prev => [...prev, { ...newLoc, id: Number(id) }]);
  };

  const updateLocation = async (id: number, data: Omit<StoryLocation, 'id' | 'storyUuid' | 'createdAt'>) => {
    await db.locations.update(id, data);
    setLocations(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const deleteLocation = async (id: number) => {
    await db.locations.delete(id);
    setLocations(prev => prev.filter(l => l.id !== id));
  };

  return { locations, addLocation, updateLocation, deleteLocation };
}
