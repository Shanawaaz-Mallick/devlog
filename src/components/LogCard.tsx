import React from 'react';
import { LogEntry } from '../types';
import { format, parseISO } from 'date-fns';
import { Edit2, Trash2, Tag, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogCardProps {
  log: LogEntry;
  onDelete: (id: string) => void;
}

const moodEmojis: Record<number, string> = {
  1: '😴',
  2: '😐',
  3: '🙂',
  4: '🚀',
  5: '🔥'
};

const LogCard: React.FC<LogCardProps> = ({ log, onDelete }) => {
  const truncatedDid = log.did.length > 120 ? log.did.substring(0, 120) + '...' : log.did;

  return (
    <div className="bento-card p-6 flex flex-col gap-4 group hover:ring-2 hover:ring-accent/10 transition-all bg-white relative">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <Calendar className="h-3 w-3" />
          <span>{format(parseISO(log.date), 'MMM d, yyyy')}</span>
          <span className="text-sm ml-1 grayscale group-hover:grayscale-0 transition-all">{moodEmojis[log.mood] || '✨'}</span>
        </div>
        <div className="flex gap-2">
          <Link to={`/log/edit/${log.id}`} className="transition-colors text-gray-300 hover:text-accent">
            <Edit2 className="h-3.5 w-3.5" />
          </Link>
          <button 
            onClick={() => log.id && onDelete(log.id)}
            className="transition-colors text-gray-300 hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-grow">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 italic tracking-tight">{truncatedDid}</h3>
        {log.blockers && (
          <p className="text-xs text-gray-400 font-medium line-clamp-1">
            <span className="text-red-400 font-black uppercase mr-1">Err:</span> {log.blockers}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-gray-50 mt-auto">
        {log.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-gray-50 rounded-md text-[9px] font-black uppercase tracking-tighter text-gray-500 border border-gray-100">
            {tag}
          </span>
        ))}
        <Link 
          to={`/log/${log.id}`}
          className="ml-auto bg-gray-100 p-1.5 rounded-lg text-gray-400 hover:bg-black hover:text-white transition-all shadow-sm"
        >
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};

export default React.memo(LogCard); // Memoized as per PRD p13
