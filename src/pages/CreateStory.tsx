import { useState } from 'react';
import { useTemplates } from '../hooks/useTemplates';
import { useStoryActions } from '../hooks/useStoryActions';
import { ChevronRight, Loader2 } from 'lucide-react';

export function CreateStoryPage() {
  const { categories, storyTypes, loading } = useTemplates();
  const { createStory } = useStoryActions();
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

  // Step 1: Category Selection
  if (!selectedCat) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Select Category</h2>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className="aspect-square bg-gray-50 border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform hover:border-brand hover:bg-brand/5"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-xs font-medium text-center px-1">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Story Type Selection
  const filteredTypes = storyTypes.filter(t => t.categoryId === selectedCat);
  const categoryName = categories.find(c => c.id === selectedCat)?.name;

  return (
    <div className="p-4">
      <button
        onClick={() => setSelectedCat(null)}
        className="text-sm text-gray-500 mb-4 hover:text-brand flex items-center gap-1"
      >
        ← Back to Categories
      </button>

      <h2 className="text-xl font-bold mb-1">{categoryName}</h2>
      <p className="text-sm text-gray-500 mb-6">Select a story type to begin</p>

      <div className="space-y-3">
        {filteredTypes.map(type => (
          <button
            key={type.id}
            onClick={() => createStory(type)}
            className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-brand shadow-sm active:scale-[0.99] transition-all group"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-brand transition-colors">
                  {type.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {type.description}
                </p>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-brand" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
