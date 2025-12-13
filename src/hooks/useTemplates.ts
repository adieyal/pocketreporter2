import { useState, useEffect } from 'react';
import type { Template, Category } from '../lib/types';

export function useTemplates() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [storyTypes, setStoryTypes] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}templates.json`)
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories);
        setStoryTypes(data.storyTypes);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load templates", err);
        setLoading(false);
      });
  }, []);

  return { categories, storyTypes, loading };
}
