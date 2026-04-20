import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLogs } from '../hooks/useLogs';
import { useFilter } from '../hooks/useFilter';
import { useHeatmap } from '../hooks/useHeatmap';
import { FilterProvider, useFilterContext } from '../context/FilterContext';
import Sidebar from '../components/Sidebar';
import StatsBar from '../components/StatsBar';
import Heatmap from '../components/Heatmap';
import FilterBar from '../components/FilterBar';
import LogCard from '../components/LogCard';
import { deleteLog } from '../services/logService';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Coffee, Calendar, SearchX, Loader2, TrendingUp, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isToday, parseISO, format } from 'date-fns';

const DashboardContent = () => {
  const { user, profile } = useAuth();
  const { logs, loading: logsLoading } = useLogs(user?.uid);
  const { filters } = useFilterContext();
  const [visibleCount, setVisibleCount] = React.useState(20);

  const filteredLogs = useFilter(logs, filters);
  const paginatedLogs = useMemo(() => filteredLogs.slice(0, visibleCount), [filteredLogs, visibleCount]);
  
  const weeks = useHeatmap(logs);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    logs.forEach(log => log.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [logs]);

  const hasLoggedToday = useMemo(() => {
    return logs.some(l => isToday(parseISO(l.date)));
  }, [logs]);

  const handleDelete = React.useCallback(async (id: string) => {
    if (!user) return;
    if (window.confirm('Are you sure you want to delete this log?')) {
      try {
        await deleteLog(user.uid, id);
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  }, [user]);

  const loadMore = () => setVisibleCount(prev => prev + 20);

  return (
    <div className="lg:pl-64 min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Main Summary - Top Left (Large) */}
          <div className="md:col-span-2 md:row-span-1 bento-card-header p-8 text-white flex flex-col justify-between group">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider">
                {hasLoggedToday ? 'Daily Goal Met' : 'Action Required'}
              </span>
              <p className="text-[10px] opacity-60 font-medium">EST. {format(new Date(), 'HH:mm')}</p>
            </div>
            <div className="mt-8">
              <h2 className="text-4xl font-black italic tracking-tighter leading-tight">
                Developer <br/> Momentum
              </h2>
              <p className="text-sm opacity-70 mt-2 max-w-xs font-medium">
                {hasLoggedToday 
                  ? "Great job! You've logged your progress for today."
                  : "Don't break the chain. You haven't logged today's standup yet."}
              </p>
            </div>
            {!hasLoggedToday && !logsLoading && (
              <Link to="/log/new" className="mt-8 bg-white text-black py-3 rounded-xl font-bold text-center text-sm hover:bg-gray-100 transition-all hover:scale-[1.02] active:scale-95">
                Log Today's Standup
              </Link>
            )}
            {hasLoggedToday && (
              <div className="mt-8 flex gap-2">
                 <div className="flex-1 bg-white/10 p-3 rounded-xl border border-white/10">
                   <p className="text-[10px] uppercase font-bold opacity-50 mb-1">Total Logs</p>
                   <p className="text-xl font-mono font-bold leading-none">{logs.length}</p>
                 </div>
                 <div className="flex-1 bg-white/10 p-3 rounded-xl border border-white/10">
                   <p className="text-[10px] uppercase font-bold opacity-50 mb-1">Win Rate</p>
                   <p className="text-xl font-mono font-bold leading-none">94%</p>
                 </div>
              </div>
            )}
          </div>

          {/* Current Streak - Top Right (Tall) */}
          <div className="md:col-span-1 bg-accent rounded-[24px] p-6 text-white flex flex-col justify-between shadow-lg shadow-accent/20">
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-black uppercase tracking-wider opacity-70">Current Streak</p>
              <TrendingUp className="h-4 w-4 opacity-70" />
            </div>
            <div className="text-6xl font-black italic tracking-tighter">{profile?.currentStreak || 0}</div>
            <div>
              <p className="text-xs font-bold opacity-70 mb-2">Longest: {profile?.longestStreak || 0} Days</p>
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(((profile?.currentStreak || 0) / (profile?.longestStreak || 1)) * 100, 100)}%` }}
                  className="bg-white h-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
                />
              </div>
            </div>
          </div>

          {/* Pending/Tags Context - Top Right (Small) */}
          <div className="md:col-span-1 bento-card p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-2 shadow-inner border border-orange-200">
               <Hash className="text-orange-600 h-6 w-6" />
            </div>
            <p className="text-xs font-bold uppercase tracking-tight text-gray-500 mb-1">Active Projects</p>
            <p className="text-3xl font-black italic tracking-tighter">{availableTags.length}</p>
          </div>

          {/* Heatmap Card (Wide) */}
          <div className="md:col-span-4 bento-card p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="text-accent h-4 w-4" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Productivity Map</h3>
              </div>
              <div className="flex gap-3">
                 <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-400">
                   <div className="w-2 h-2 rounded-full bg-accent/20"></div> Maintenance
                 </div>
                 <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-400">
                   <div className="w-2 h-2 rounded-full bg-accent"></div> High Output
                 </div>
              </div>
            </div>
            <Heatmap weeks={weeks} />
          </div>

          {/* Activity Feed Header */}
          <div className="md:col-span-4 mt-4">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black italic tracking-tighter">Journal Feed</h2>
                <div className="h-px flex-1 bg-border mx-8 hidden md:block"></div>
             </div>
             <FilterBar availableTags={availableTags} />
          </div>

          {/* Log Feed List */}
          <div className="md:col-span-4">
            {logsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-accent" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">Establishing Connection...</p>
              </div>
            ) : paginatedLogs.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence mode="popLayout">
                    {paginatedLogs.map(log => (
                      <motion.div 
                        key={log.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        layout
                      >
                        <LogCard log={log} onDelete={handleDelete} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                {filteredLogs.length > paginatedLogs.length && (
                  <div className="flex justify-center pt-8 pb-12">
                    <button 
                      onClick={loadMore}
                      className="btn btn-secondary px-12 py-4 rounded-[20px] font-black uppercase text-xs tracking-[0.2em]"
                    >
                      Retrieve Older Entries
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bento-card p-20 flex flex-col items-center justify-center text-center border-dashed border-2 bg-gray-50">
                <div className="bg-white p-6 rounded-3xl mb-6 shadow-sm">
                  <SearchX className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Empty Database</h3>
                <p className="text-sm text-gray-400 max-w-xs font-medium">
                  {logs.length === 0 
                    ? "Your personal development index is currently void. Initialize your first log to begin tracking."
                    : "Query returned zero results. Broaden your search criteria."}
                </p>
                <Link to="/log/new" className="btn btn-primary mt-8 px-10">Initialize Log 001</Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default function DashboardPage() {
  return (
    <FilterProvider>
      <div className="flex">
        <Sidebar />
        <DashboardContent />
      </div>
    </FilterProvider>
  );
}
