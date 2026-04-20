import React from 'react';
import { UserProfile, LogEntry } from '../types';
import { Flame, Star, BookOpen, Hash } from 'lucide-react';

interface StatsBarProps {
  profile: UserProfile | null;
  logs: LogEntry[];
}

const StatsBar: React.FC<StatsBarProps> = ({ profile, logs }) => {
  const uniqueTags = new Set(logs.flatMap(l => l.tags)).size;

  const stats = [
    { label: 'Total Entries', value: logs.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Current Streak', value: profile?.currentStreak || 0, icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Longest Streak', value: profile?.longestStreak || 0, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Tags Used', value: uniqueTags, icon: Hash, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="card p-4 flex flex-col items-center justify-center text-center bg-white shadow-sm">
          <div className={`${stat.bg} ${stat.color} p-2 rounded-lg mb-2`}>
            <stat.icon className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-xs text-text-muted font-medium uppercase tracking-wider">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
