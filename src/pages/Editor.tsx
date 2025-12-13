import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Cloud, CheckCircle2, Share, Loader2, Check, Pencil } from 'lucide-react';
import { useEditor } from '../hooks/useEditor';
import { useMedia } from '../hooks/useMedia';
import { useContacts } from '../hooks/useContacts';
import { useLocations } from '../hooks/useLocations';
import { QuestionCard } from '../components/editor/QuestionCard';
import { MediaToolbar } from '../components/editor/MediaToolbar';
import { MediaGallery } from '../components/editor/MediaGallery';
import { ContactModal } from '../components/editor/ContactModal';
import { ContactList } from '../components/editor/ContactList';
import { LocationModal } from '../components/editor/LocationModal';
import { LocationList } from '../components/editor/LocationList';
import { generateStoryZip } from '../lib/export';

export function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const storyUuid = id || '';
  const { story, loading, saving, updateHeadline, updateAnswer, setStatus } = useEditor(storyUuid);
  const { media } = useMedia(storyUuid);
  const { contacts, addContact, deleteContact } = useContacts(storyUuid);
  const { locations, addLocation, deleteLocation } = useLocations(storyUuid);

  const [exporting, setExporting] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const handleExport = async () => {
    if (!story) return;
    setExporting(true);
    try {
      const zipBlob = await generateStoryZip(story);

      // Create a download link programmatically
      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      // Filename: story-headline.zip
      link.download = `${story.headline.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.zip`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading story...</div>;
  if (!story) return <div className="p-8 text-center text-red-500">Story not found.</div>;

  const questions = story.templateSnapshot.questions;

  // Calculate Progress
  const inputQuestions = questions.filter(q => !q.isTip);
  const answeredCount = inputQuestions.filter(q => story.answers[q.id]?.value).length;
  const progress = Math.round((answeredCount / inputQuestions.length) * 100);

  return (
    <div className="pb-32"> {/* Extra padding for media toolbar */}

      {/* Sticky Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-10 px-4 py-3">
        <div className="flex justify-between items-center mb-2">
          <Link to="/" className="text-gray-500 hover:text-gray-900">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
              {saving ? (
                <span className="flex items-center gap-1 text-gray-500"><Cloud size={14} /> Saving...</span>
              ) : (
                <span className="flex items-center gap-1 text-brand"><CheckCircle2 size={14} /> Saved</span>
              )}
            </div>
            <button
              onClick={handleExport}
              disabled={exporting || saving}
              className="text-brand p-2 bg-brand-light rounded-full disabled:opacity-50"
            >
              {exporting ? <Loader2 className="animate-spin" size={20} /> : <Share size={20} />}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="p-4 max-w-lg mx-auto">
        {/* Headline Input */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Headline / Working Title</label>
          <input
            type="text"
            value={story.headline}
            onChange={(e) => updateHeadline(e.target.value)}
            className="w-full text-2xl font-bold text-gray-900 placeholder-gray-300 bg-transparent border-none p-0 focus:ring-0 outline-none"
            placeholder="Enter headline..."
          />
          <div className="text-sm text-brand mt-1 font-medium">
            {story.templateSnapshot.name}
          </div>
        </div>

        {/* Question List */}
        <div>
          {questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              value={story.answers[q.id]?.value}
              onChange={(val) => updateAnswer(q.id, val)}
            />
          ))}
        </div>

        {/* Status Toggle */}
        <div className="mt-6 mb-8">
          {story.status === 'draft' ? (
            <button
              onClick={() => setStatus('complete')}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-4 bg-brand text-white font-semibold rounded-xl active:scale-[0.99] transition-all disabled:opacity-50"
            >
              <Check size={20} />
              Mark as Complete
            </button>
          ) : (
            <button
              onClick={() => setStatus('draft')}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl active:scale-[0.99] transition-all disabled:opacity-50"
            >
              <Pencil size={20} />
              Revert to Draft
            </button>
          )}
        </div>

        {/* Contacts List */}
        <ContactList contacts={contacts} onDelete={deleteContact} />

        {/* Locations List */}
        <LocationList locations={locations} onDelete={deleteLocation} />

        {/* Media Gallery */}
        <MediaGallery items={media} />

        {/* End of Form Area */}
        <div className="h-12" />
      </div>

      {/* Media Toolbar */}
      <MediaToolbar
        storyUuid={storyUuid}
        onSourceClick={() => setIsContactModalOpen(true)}
        onLocationClick={() => setIsLocationModalOpen(true)}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSave={async (data) => { await addContact(data); }}
      />

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSave={async (data) => { await addLocation(data); }}
      />
    </div>
  );
}
