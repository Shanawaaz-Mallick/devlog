import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  createdAt: any; // Timestamp
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
}

export interface LogEntry {
  id?: string;
  date: string; // ISO format 'YYYY-MM-DD'
  createdAt: any;
  updatedAt: any;
  did: string;
  blockers: string;
  next: string;
  mood: number;
  tags: string[];
  uid: string;
}

export interface FilterState {
  tags: string[];
  dateRange: { from: string; to: string } | null;
  searchQuery: string;
}
