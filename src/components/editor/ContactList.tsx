import { Phone, Trash2, User, Pencil } from 'lucide-react';
import type { SourceContact } from '../../lib/types';

export function ContactList({ contacts, onDelete, onEdit }: { contacts: SourceContact[], onDelete: (id: number) => void, onEdit: (contact: SourceContact) => void }) {
  if (contacts.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">Sources ({contacts.length})</h3>
      <div className="space-y-2">
        {contacts.map(contact => (
          <div key={contact.id} className="bg-white border border-gray-200 rounded-lg p-3 flex justify-between items-start shadow-sm">
            <div className="flex gap-3">
              <div className="bg-brand-light text-brand p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                <User size={20} />
              </div>
              <div>
                <div className="font-bold text-gray-900">{contact.name}</div>
                {(contact.role || contact.organization) && (
                  <div className="text-xs text-gray-500 mb-1">
                    {contact.role} {contact.role && contact.organization && '•'} {contact.organization}
                  </div>
                )}
                <div className="flex gap-2 text-xs text-gray-600 font-mono">
                  {contact.phone && <span>Tel: {contact.phone}</span>}
                  {contact.email && <span>Email: {contact.email}</span>}
                </div>
                {contact.notes && (
                  <div className="text-xs text-gray-400 mt-1 italic">"{contact.notes}"</div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100"
                >
                  <Phone size={16} />
                </a>
              )}
              <button
                onClick={() => onEdit(contact)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => contact.id && onDelete(contact.id)}
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
