import { v4 as uuidv4 } from 'uuid';
import { db } from '../lib/db';
import type { Template, Story } from '../lib/types';
import { useNavigate } from 'react-router-dom';

export function useStoryActions() {
  const navigate = useNavigate();

  const createStory = async (template: Template) => {
    const storyId = uuidv4();
    const now = new Date().toISOString();

    // 1. DEEP COPY: We clone the template into the story object.
    // This snapshot will never change, even if the admin updates templates.json later.
    const newStory: Story = {
      uuid: storyId,
      headline: `New ${template.name}`,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      templateSnapshot: JSON.parse(JSON.stringify(template)), // <--- Magic happens here
      answers: {}
    };

    try {
      await db.stories.add(newStory);
      // 2. Redirect to the editor immediately
      navigate(`/story/${storyId}`);
    } catch (error) {
      console.error("Failed to create story:", error);
      alert("Could not create story. Check storage space.");
    }
  };

  return { createStory };
}
