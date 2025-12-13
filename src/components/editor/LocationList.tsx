import { MapPin, Trash2, ExternalLink } from 'lucide-react';
import type { StoryLocation } from '../../lib/types';

export function LocationList({ locations, onDelete }: { locations: StoryLocation[], onDelete: (id: number) => void }) {
  if (locations.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Locations ({locations.length})</h3>
      <div className="space-y-2">
        {locations.map(loc => (
          <div key={loc.id} className="bg-white border border-gray-200 rounded-lg p-3 flex justify-between items-start shadow-sm">
            <div className="flex gap-3">
              <div className="bg-blue-50 text-blue-600 p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <div className="font-bold text-gray-900">{loc.name}</div>
                {loc.address && <div className="text-xs text-gray-500 mb-1">{loc.address}</div>}
                {loc.lat && loc.lng && (
                  <div className="font-mono text-[10px] text-gray-400 bg-gray-50 inline-block px-1 rounded">
                    {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}
                  </div>
                )}
                {loc.notes && <div className="text-xs text-gray-400 mt-1 italic">"{loc.notes}"</div>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {loc.lat && loc.lng && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  <ExternalLink size={16} />
                </a>
              )}
              <button
                onClick={() => loc.id && onDelete(loc.id)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
