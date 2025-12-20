export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  educationLevel?: string;
  primaryGoal?: string;
  preferredDuration?: number;
  studyTimes?: string[];
  learningStyle?: string;
  weeklyHours?: number;
  commitments?: string[];
  onboardingCompleted?: boolean;
}

export interface StudySession {
  id: string;
  planId: string;
  title: string;
  subject: string;
  topic: string;
  date: string;
  startTime: string;
  duration: number;
  technique?: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'skipped';
  notes?: string;
}

export interface StudyPlan {
  id: string;
  userId: string;
  title: string;
  subjects: string[];
  goal: string;
  deadline?: string;
  knowledgeLevel: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  weeklyHours: number;
  techniques: string[];
  sessionLength: number;
  includeBreaks: boolean;
  sessions: StudySession[];
  status: 'active' | 'completed' | 'archived';
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface DailyStats {
  date: string;
  hours: number;
  sessions: number;
}

export interface UserStats {
  totalHoursThisWeek: number;
  currentStreak: number;
  sessionsCompletedToday: number;
  completionRate: number;
  weeklyData: DailyStats[];
}
