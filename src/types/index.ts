// Types for the AI tutoring platform
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  role: 'student' | 'admin';
  created_at: string;
  updated_at: string;
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

// New types for diagnostic assessment and learning analytics
export interface DiagnosticAssessment {
  id: string;
  user_id: string;
  subject_id: string;
  questions: DiagnosticQuestion[];
  results: AssessmentResult;
  learning_style: LearningStyle;
  knowledge_level: KnowledgeLevel;
  completed_at: string;
  created_at: string;
}

export interface DiagnosticQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
  explanation: string;
}

export interface AssessmentResult {
  score: number;
  total_questions: number;
  correct_answers: number;
  time_taken: number; // in seconds
  topic_scores: Record<string, number>;
  recommended_level: KnowledgeLevel;
}

export interface LearningStyle {
  visual: number; // 0-100
  auditory: number; // 0-100
  kinesthetic: number; // 0-100
  reading_writing: number; // 0-100
  dominant_style: 'visual' | 'auditory' | 'kinesthetic' | 'reading_writing';
}

export interface KnowledgeLevel {
  overall: 'beginner' | 'intermediate' | 'advanced';
  topics: Record<string, 'beginner' | 'intermediate' | 'advanced'>;
  confidence_score: number; // 0-100
}

export interface UserProgress {
  id: string;
  user_id: string;
  subject_id: string;
  current_level: number;
  experience_points: number;
  topics_completed: string[];
  topics_in_progress: string[];
  learning_streak: number;
  last_activity: string;
  achievements: Achievement[];
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'streak' | 'completion' | 'mastery' | 'speed' | 'consistency';
  earned_at: string;
}

export interface LearningPath {
  id: string;
  subject_id: string;
  name: string;
  description: string;
  topics: LearningTopic[];
  prerequisites: string[];
  estimated_duration: number; // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface LearningTopic {
  id: string;
  name: string;
  description: string;
  content: string;
  prerequisites: string[];
  estimated_time: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  resources: LearningResource[];
}

export interface LearningResource {
  id: string;
  type: 'video' | 'article' | 'exercise' | 'quiz' | 'simulation';
  title: string;
  url: string;
  description: string;
  duration?: number; // in minutes
}

export interface FeedbackData {
  message_id: string;
  user_understanding: 'confused' | 'partial' | 'understood' | 'mastered';
  difficulty_rating: number; // 1-5
  helpfulness_rating: number; // 1-5
  preferred_explanation_style: 'simple' | 'detailed' | 'visual' | 'practical';
  additional_help_needed: boolean;
}

export interface StudySession {
  id: string;
  user_id: string;
  subject_id: string;
  topic: string;
  start_time: string;
  end_time?: string;
  duration?: number; // in seconds
  messages_count: number;
  understanding_level: number; // 0-100
  engagement_score: number; // 0-100
}