export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  courseName: string;
  currentDay: number;
  totalDays: number;
  latestScore: number;
  needsMentor: boolean;
  unreadCount: number;
  lastActivity: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
  enrollmentDate: string;
  progress: number;
}

export interface ChatMessage {
  id: string;
  studentId: string;
  sender: 'student' | 'admin';
  content: string;
  timestamp: string;
  isAdminNote?: boolean;
}

export interface AdminNote {
  id: string;
  studentId: string;
  content: string;
  timestamp: string;
  adminName: string;
}
