import { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../lib/db';
import type { Story } from '../lib/types';

export function useEditor(storyId: string) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Ref to track if we have pending changes to save
  const saveTimeoutRef = useRef<number | null>(null);

  // 1. Load Story on Mount
  useEffect(() => {
    async function load() {
      if (!storyId) return;
      const found = await db.stories.where('uuid').equals(storyId).first();
      if (found) {
        setStory(found);
      }
      setLoading(false);
    }
    load();
  }, [storyId]);

  // 2. Persist to DB (Debounced)
  const triggerSave = useCallback((updatedStory: Story) => {
    setSaving(true);
    setStory(updatedStory); // Update UI immediately

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(async () => {
      await db.stories.put(updatedStory);
      setSaving(false);
      saveTimeoutRef.current = null;
    }, 1000); // Wait 1 second after last keystroke
  }, []);

  // 3. Update Helpers
  const updateHeadline = (text: string) => {
    if (!story) return;
    triggerSave({ ...story, headline: text, updatedAt: new Date().toISOString() });
  };

  const updateAnswer = (questionId: string, value: string | boolean) => {
    if (!story) return;
    const newAnswers = { ...story.answers };
    newAnswers[questionId] = {
      questionId,
      value,
      updatedAt: new Date().toISOString()
    };

    triggerSave({
      ...story,
      answers: newAnswers,
      updatedAt: new Date().toISOString()
    });
  };

  const setStatus = (status: 'draft' | 'complete') => {
    if (!story) return;
    triggerSave({ ...story, status, updatedAt: new Date().toISOString() });
  };

  return { story, loading, saving, updateHeadline, updateAnswer, setStatus };
}
