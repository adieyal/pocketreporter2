import { useState, useEffect } from 'react';
import { X, Save, User, Phone, Briefcase, FileText, Mail, Plus } from 'lucide-react';
import type { SourceContact } from '../../lib/types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<SourceContact, 'id' | 'storyUuid' | 'createdAt'>) => Promise<void>;
  editingContact?: SourceContact | null;
}

export function ContactModal({ isOpen, onClose, onSave, editingContact }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: '',
    organization: '',
    email: '',
    notes: ''
  });
  const [saving, setSaving] = useState(false);

  const isEditing = !!editingContact;

  const resetForm = () => {
    setFormData({ name: '', phone: '', role: '', organization: '', email: '', notes: '' });
  };

  useEffect(() => {
    if (editingContact) {
      setFormData({
        name: editingContact.name,
        phone: editingContact.phone,
        role: editingContact.role,
        organization: editingContact.organization,
        email: editingContact.email,
        notes: editingContact.notes
      });
    } else {
      resetForm();
    }
  }, [editingContact, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (keepOpen: boolean) => {
    if (!formData.name) return;

    setSaving(true);
    await onSave(formData);
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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-dark-surface w-full max-w-lg rounded-t-2xl sm:rounded-xl p-4 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2 dark:text-dark-text">
            <User className="text-brand" size={20} />
            {isEditing ? 'Edit Source' : 'New Source'}
          </h3>
          <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-dark-border rounded-full text-gray-500 dark:text-dark-text-muted">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-3 max-h-[60vh] overflow-y-auto px-1">

            {/* Name */}
            <div>
              <label className="text-xs font-bold text-gray-400 dark:text-dark-text-muted uppercase">Name *</label>
              <input
                required
                autoFocus
                className="w-full p-3 bg-gray-50 dark:bg-dark-border dark:text-dark-text border border-gray-200 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-brand outline-none"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            {/* Phone & Email Row */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 dark:text-dark-text-muted uppercase flex items-center gap-1">
                  <Phone size={12} /> Phone
                </label>
                <input
                  type="tel"
                  className="w-full p-3 bg-gray-50 dark:bg-dark-border dark:text-dark-text border border-gray-200 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  placeholder="082 555..."
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-400 dark:text-dark-text-muted uppercase flex items-center gap-1">
                  <Mail size={12} /> Email
                </label>
                <input
                  type="email"
                  className="w-full p-3 bg-gray-50 dark:bg-dark-border dark:text-dark-text border border-gray-200 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-brand outline-none"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Role & Org */}
            <div>
              <label className="text-xs font-bold text-gray-400 dark:text-dark-text-muted uppercase flex items-center gap-1">
                <Briefcase size={12} /> Role / Org
              </label>
              <input
                className="w-full p-3 bg-gray-50 dark:bg-dark-border dark:text-dark-text border border-gray-200 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-brand outline-none"
                placeholder="Witness / Resident Association"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-bold text-gray-400 dark:text-dark-text-muted uppercase flex items-center gap-1">
                <FileText size={12} /> Context Notes
              </label>
              <textarea
                className="w-full p-3 bg-gray-50 dark:bg-dark-border dark:text-dark-text border border-gray-200 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-brand outline-none"
                rows={2}
                placeholder="Met at scene, wearing red shirt..."
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>

          <div className="flex gap-2">
            {!isEditing && (
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={saving || !formData.name}
                className="flex-1 py-3 bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-dark-text font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
              >
                <Plus size={18} /> Save & Add Another
              </button>
            )}
            <button
              type="submit"
              disabled={saving || !formData.name}
              className="flex-1 py-3 bg-brand text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
            >
              <Save size={18} /> {isEditing ? 'Update' : 'Save & Close'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
