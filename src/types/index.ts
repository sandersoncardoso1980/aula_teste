// Types for the AI tutoring platform
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  agent_description: string;
  created_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  subject_id: string;
  file_path: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  subject_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  is_ai: boolean;
  source_book?: string;
  source_chapter?: string;
  youtube_links?: string[];
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export interface YouTubeVideo {
  title: string;
  url: string;
  description?: string;
}