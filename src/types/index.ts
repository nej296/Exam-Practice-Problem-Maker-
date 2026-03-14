export interface Exam {
  id: string;
  label: string;
  date: string;
  time: string;
  location: string;
}

export interface Problem {
  id: string;
  type: 'open-ended' | 'multiple-choice' | 'true-false';
  question: string;
  answer: string;
  options?: string[];
  correctOption?: number;
  questionPdfFileName?: string;
  questionPdfData?: string;
  answerPdfFileName?: string;
  answerPdfData?: string;
}

export interface PracticeSet {
  id: string;
  name: string;
  createdAt: string;
  pdfFileName?: string;
  pdfData?: string;
  problems: Problem[];
}

export interface ClassData {
  id: string;
  name: string;
  instructor?: string;
  exams: Record<string, Exam>;
  practiceSets: Record<string, PracticeSet>;
}

export interface SemesterData {
  id: string;
  name: string;
  classes: Record<string, ClassData>;
}

export interface AppData {
  semesters: Record<string, SemesterData>;
}

export type StudyMode = 'flashcards' | 'quiz' | 'practice-exam';

export interface StudyConfig {
  mode: StudyMode;
  questionCount?: number;
  shuffle?: boolean;
  timeLimit?: number;
}
