import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Cloud, CheckCircle2, Share, Loader2, Check, Pencil } from 'lucide-react';

// Hooks
import { useEditor } from '../hooks/useEditor';
import { useMedia } from '../hooks/useMedia';
import { useContacts } from '../hooks/useContacts';
import { useLocations } from '../hooks/useLocations';

// Components
import { QuestionCard } from '../components/editor/QuestionCard';
import { MediaGallery } from '../components/editor/MediaGallery';
import { MediaToolbar } from '../components/editor/MediaToolbar';
import { ContactList } from '../components/editor/ContactList';
import { ContactModal } from '../components/editor/ContactModal';
import { LocationList } from '../components/editor/LocationList';
import { LocationModal } from '../components/editor/LocationModal';

// Utils
import { generateStoryZip } from '../lib/export';

export function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const storyUuid = id || '';

  // 1. Initialize all hooks
  const { story, loading, saving, updateHeadline, updateAnswer, setStatus } = useEditor(storyUuid);
  const { media } = useMedia(storyUuid);
  const { contacts, addContact, deleteContact } = useContacts(storyUuid);
  const { locations, addLocation, deleteLocation } = useLocations(storyUuid);

  // 2. Modal States
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  // 3. Handlers
  const handleExport = async () => {
    if (!story) return;
    setExporting(true);
    try {
      const zipBlob = await generateStoryZip(story);
      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${story.headline.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.zip`;
      document.body.appendChild(link);
      link.click();
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
  const inputQuestions = questions.filter(q => !q.isTip);
  const answeredCount = inputQuestions.filter(q => story.answers[q.id]?.value).length;
  const progress = Math.round((answeredCount / inputQuestions.length) * 100);

  return (
    <div className="pb-40 bg-gray-50 min-h-screen">

      {/* --- HEADER --- */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-30 px-4 py-3">
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
              className="text-brand p-2 bg-brand-light rounded-full disabled:opacity-50 active:scale-95 transition-transform"
            >
              {exporting ? <Loader2 className="animate-spin" size={20} /> : <Share size={20} />}
            </button>
          </div>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="p-4 max-w-lg mx-auto">

        {/* Headline */}
        <div className="mb-8">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Headline</label>
          <input
            type="text"
            value={story.headline}
            onChange={(e) => updateHeadline(e.target.value)}
            className="w-full text-2xl font-bold text-gray-900 placeholder-gray-300 bg-transparent border-none p-0 focus:ring-0 outline-none"
            placeholder="Enter headline..."
          />
          <div className="text-xs text-brand mt-1 font-medium bg-brand-light inline-block px-2 py-1 rounded">
            {story.templateSnapshot.name}
          </div>
        </div>

        {/* Dynamic Questions */}
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

        <hr className="my-8 border-gray-200" />

        {/* Lists & Gallery */}
        <ContactList contacts={contacts} onDelete={deleteContact} />
        <LocationList locations={locations} onDelete={deleteLocation} />
        <MediaGallery items={media} />

      </div>

      {/* --- BOTTOM TOOLBAR --- */}
      <MediaToolbar
        storyUuid={storyUuid}
        onAddSource={() => setIsContactModalOpen(true)}
        onAddLocation={() => setIsLocModalOpen(true)}
      />

      {/* --- MODALS --- */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSave={async (data) => { await addContact(data); }}
      />

      <LocationModal
        isOpen={isLocModalOpen}
        onClose={() => setIsLocModalOpen(false)}
        onSave={async (data) => { await addLocation(data); }}
      />

    </div>
  );
}
