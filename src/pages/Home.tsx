import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, ChevronRight } from 'lucide-react';
import { db } from '../lib/db';
import type { Story } from '../lib/types';

export function HomePage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadStories() {
      const allStories = await db.stories.orderBy('updatedAt').reverse().toArray();
      setStories(allStories);
      setLoading(false);
    }
    loadStories();
  }, []);

  const filteredStories = stories.filter(story =>
    story.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.templateSnapshot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Pocket Reporter</h1>
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
      </header>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search stories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-brand/50 outline-none"
        />
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No stories yet.</p>
            <p className="text-sm">Tap + to start a new report.</p>
          </div>
        ) : (
          filteredStories.map(story => (
            <Link
              key={story.uuid}
              to={`/story/${story.uuid}`}
              className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-brand shadow-sm active:scale-[0.99] transition-all group"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-brand transition-colors truncate">
                    {story.headline}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{story.templateSnapshot.name}</span>
                    <span className="text-xs text-gray-300">•</span>
                    <span className="text-xs text-gray-400">{formatDate(story.updatedAt)}</span>
                  </div>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      story.status === 'complete'
                        ? 'bg-brand-light text-brand-dark'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {story.status === 'complete' ? 'Complete' : 'Draft'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-brand shrink-0" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
