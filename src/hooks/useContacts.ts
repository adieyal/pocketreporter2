import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import type { SourceContact } from '../lib/types';

export function useContacts(storyUuid: string) {
  const [contacts, setContacts] = useState<SourceContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storyUuid) return;

    db.contacts.where('storyUuid').equals(storyUuid).toArray()
      .then((data) => {
        setContacts(data);
        setLoading(false);
      })
      .catch(err => console.error("Failed to load contacts", err));
  }, [storyUuid]);

  const addContact = async (data: Omit<SourceContact, 'id' | 'storyUuid' | 'createdAt'>) => {
    const newContact: SourceContact = {
      ...data,
      storyUuid,
      createdAt: new Date().toISOString()
    };

    const id = await db.contacts.add(newContact);
    setContacts(prev => [...prev, { ...newContact, id: Number(id) }]);
    return id;
  };

  const updateContact = async (id: number, data: Omit<SourceContact, 'id' | 'storyUuid' | 'createdAt'>) => {
    await db.contacts.update(id, data);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteContact = async (id: number) => {
    await db.contacts.delete(id);
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return { contacts, addContact, updateContact, deleteContact, loading };
}
