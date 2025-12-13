import { useState } from 'react';
import { X, Save, MapPin, Navigation, Loader2, Plus } from 'lucide-react';
import type { StoryLocation } from '../../lib/types';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<StoryLocation, 'id' | 'storyUuid' | 'createdAt'>) => Promise<void>;
}

export function LocationModal({ isOpen, onClose, onSave }: LocationModalProps) {
  const [formData, setFormData] = useState<Partial<StoryLocation>>({
    name: '',
    address: '',
    notes: ''
  });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({ name: '', address: '', notes: '', lat: undefined, lng: undefined });
  };

  const handleGetGPS = () => {
    setGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }));
          setGpsLoading(false);
        },
        (error) => {
          alert("Could not get location: " + error.message);
          setGpsLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setGpsLoading(false);
    }
  };

  const handleSave = async (keepOpen: boolean) => {
    if (!formData.name) return;
    setSaving(true);
    await onSave({
      name: formData.name || '',
      address: formData.address || '',
      notes: formData.notes || '',
      lat: formData.lat,
      lng: formData.lng
    });
    resetForm();
    setSaving(false);
    if (!keepOpen) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white w-full max-w-lg rounded-t-2xl sm:rounded-xl p-4 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <MapPin className="text-brand" size={20} />
            Add Location
          </h3>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* GPS Button */}
          <button
            type="button"
            onClick={handleGetGPS}
            disabled={gpsLoading}
            className="w-full py-3 bg-blue-50 text-blue-700 font-semibold rounded-xl flex items-center justify-center gap-2 border border-blue-100 active:scale-95 transition-transform disabled:opacity-50"
          >
            {gpsLoading ? <Loader2 className="animate-spin" size={18} /> : <Navigation size={18} />}
            {formData.lat ? `GPS: ${formData.lat.toFixed(5)}, ${formData.lng?.toFixed(5)}` : "Use Current GPS Location"}
          </button>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Place Name *</label>
            <input
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
              placeholder="e.g. Crime Scene"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Address / Description</label>
            <input
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
              placeholder="12 Main St / Under the bridge"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Notes</label>
            <textarea
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand outline-none"
              rows={2}
              placeholder="Difficult access, entry via side door..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving || !formData.name}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
            >
              <Plus size={18} /> Save & Add Another
            </button>
            <button
              type="submit"
              disabled={saving || !formData.name}
              className="flex-1 py-3 bg-brand text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
            >
              <Save size={18} /> Save & Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
