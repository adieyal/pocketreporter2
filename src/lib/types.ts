export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Question {
  id: string;
  text: string;
  helperText?: string;
  type: 'text' | 'textarea' | 'date' | 'checkbox' | 'note';
  required: boolean;
  isTip?: boolean;
}

export interface Template {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  questions: Question[];
}

export interface Answer {
  questionId: string;
  value: string | boolean;
  updatedAt: string;
}

export interface Story {
  id?: number;
  uuid: string;
  headline: string;
  status: 'draft' | 'complete';
  createdAt: string;
  updatedAt: string;
  templateSnapshot: Template;
  answers: Record<string, Answer>;
}

export interface MediaItem {
  id?: number;
  storyUuid: string;
  type: 'photo' | 'audio';
  blob: Blob;
  caption: string;
  createdAt: string;
}
