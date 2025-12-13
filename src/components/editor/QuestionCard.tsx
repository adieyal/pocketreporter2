import { HelpCircle } from 'lucide-react';
import type { Question } from '../../lib/types';

interface QuestionCardProps {
  question: Question;
  value: string | boolean | undefined;
  onChange: (val: string | boolean) => void;
}

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  // Case 1: Tips (No Input)
  if (question.isTip) {
    return (
      <div className="p-4 bg-brand-light border-l-4 border-brand rounded-r-lg mb-6">
        <div className="flex items-start gap-3">
          <HelpCircle className="text-brand shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-brand-dark text-sm uppercase tracking-wide mb-1">Tip</h4>
            <p className="text-sm text-gray-800 leading-relaxed">{question.text}</p>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Standard Inputs
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
      <label className="block mb-2">
        <span className="text-gray-900 font-semibold text-lg block leading-snug">
          {question.text}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </span>
        {question.helperText && (
          <span className="text-gray-500 text-sm mt-1 block">{question.helperText}</span>
        )}
      </label>

      <div className="mt-3">
        {question.type === 'textarea' && (
          <textarea
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none min-h-[120px] resize-y"
            placeholder="Type your answer here..."
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        )}

        {question.type === 'text' && (
          <input
            type="text"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        )}

        {question.type === 'date' && (
          <input
            type="date"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        )}

        {question.type === 'checkbox' && (
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <input
              type="checkbox"
              className="w-6 h-6 text-brand rounded focus:ring-brand"
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
            />
            <span className="text-gray-700">Yes, this is confirmed</span>
          </label>
        )}
      </div>
    </div>
  );
}
