import JSZip from 'jszip';
import { db } from './db';
import type { Story } from './types';

export async function generateStoryZip(story: Story): Promise<Blob> {
  const zip = new JSZip();

  // 1. Create sane folder name (e.g., "2023-10-27_Corruption_Case")
  const dateStr = story.createdAt.split('T')[0];
  const safeTitle = story.headline.replace(/[^a-z0-9]/gi, '_').substring(0, 30);
  const folderName = `${dateStr}_${safeTitle}`;
  const root = zip.folder(folderName);
  if (!root) throw new Error("Failed to create zip folder");

  // 2. Generate Markdown Content
  let mdContent = `# ${story.headline}\n\n`;
  mdContent += `**Date Created:** ${new Date(story.createdAt).toLocaleString()}\n`;
  mdContent += `**Last Modified:** ${new Date(story.updatedAt).toLocaleString()}\n`;
  mdContent += `**Template:** ${story.templateSnapshot.name}\n`;
  mdContent += `**Status:** ${story.status}\n\n---\n\n`;

  story.templateSnapshot.questions.forEach((q, index) => {
    if (q.isTip) return;
    const answer = story.answers[q.id]?.value;
    const answerText = answer ? String(answer) : '(No answer provided)';
    mdContent += `### ${index + 1}. ${q.text}\n${answerText}\n\n`;
  });

  // 3. Fetch Contacts and append to markdown
  const contacts = await db.contacts.where('storyUuid').equals(story.uuid).toArray();

  if (contacts.length > 0) {
    mdContent += `---\n## Sources & Contacts\n\n`;
    contacts.forEach(c => {
      mdContent += `### ${c.name}\n`;
      if (c.role || c.organization) mdContent += `**Role:** ${c.role} ${c.organization ? `(${c.organization})` : ''}\n`;
      if (c.phone) mdContent += `**Phone:** ${c.phone}\n`;
      if (c.email) mdContent += `**Email:** ${c.email}\n`;
      if (c.notes) mdContent += `**Notes:** ${c.notes}\n\n`;
    });
  }

  root.file('story.md', mdContent);

  // 4. Create contacts CSV for spreadsheet import
  if (contacts.length > 0) {
    let csvContent = "Name,Role,Organization,Phone,Email,Notes\n";
    contacts.forEach(c => {
      // Escape quotes by doubling them, wrap fields in quotes
      const safe = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
      const row = [
        safe(c.name),
        safe(c.role),
        safe(c.organization),
        safe(c.phone),
        safe(c.email),
        safe(c.notes)
      ].join(",");
      csvContent += row + "\n";
    });

    root.file('sources.csv', csvContent);
  }

  // 5. Fetch and Add Media Blobs
  const mediaItems = await db.media.where('storyUuid').equals(story.uuid).toArray();

  if (mediaItems.length > 0) {
    const mediaFolder = root.folder('media');
    mediaItems.forEach((item, index) => {
      // Determine extension from blob type if possible, or default
      const ext = item.blob.type.includes('image') ? 'jpg' : 'mp3';
      // Pad index for neat sorting: media_01.jpg
      const filename = `media_${String(index + 1).padStart(2, '0')}.${ext}`;
      // Add the raw blob directly to the zip
      mediaFolder?.file(filename, item.blob);
    });
  }

  // 6. Generate the final ZIP blob
  const content = await zip.generateAsync({ type: 'blob' });
  return content;
}
