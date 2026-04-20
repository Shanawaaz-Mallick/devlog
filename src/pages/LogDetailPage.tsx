import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLogById, deleteLog } from '../services/logService';
import Sidebar from '../components/Sidebar';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Tag as TagIcon, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRightCircle,
  Loader2
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { LogEntry } from '../types';

export default function LogDetailPage() {
  const { entryId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [log, setLog] = useState<LogEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user || !entryId) return;
      try {
        const data = await getLogById(user.uid, entryId);
        setLog(data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, entryId]);

  const handleDelete = async () => {
    if (!user || !entryId) return;
    if (window.confirm('Are you sure you want to delete this log?')) {
      try {
        await deleteLog(user.uid, entryId);
        navigate('/dashboard');
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!log) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-grow lg:pl-64 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Log not found</h1>
          <Link to="/dashboard" className="btn btn-primary">Go back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-grow lg:pl-64">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors font-medium border border-border px-4 py-2 rounded-lg bg-surface"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Feed
            </button>
            <div className="flex gap-2">
              <Link to={`/log/edit/${log.id}`} className="btn btn-secondary gap-2">
                <Edit2 className="h-4 w-4" />
                Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-secondary text-red-600 border-red-100 hover:bg-red-50 gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>

          <article className="card p-8 md:p-12 bg-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-12 -mt-12 pointer-events-none"></div>
            
            <header className="mb-10 relative">
              <div className="flex items-center gap-3 text-text-muted mb-4 uppercase tracking-[0.2em] font-semibold text-xs">
                <Calendar className="h-4 w-4" />
                {format(parseISO(log.date), 'EEEE, MMMM do, yyyy')}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-text-primary leading-tight mb-6">
                Journal Reflection
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-full border border-border">
                  <span className="text-2xl">
                    {log.mood === 1 && '😴'}
                    {log.mood === 2 && '😐'}
                    {log.mood === 3 && '🙂'}
                    {log.mood === 4 && '🚀'}
                    {log.mood === 5 && '🔥'}
                  </span>
                  <span className="text-sm font-bold text-text-primary uppercase tracking-wider">
                    {log.mood === 1 && 'Burned Out'}
                    {log.mood === 2 && 'Meh'}
                    {log.mood === 3 && 'Steady'}
                    {log.mood === 4 && 'On a Roll'}
                    {log.mood === 5 && 'On Fire'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-text-muted text-sm italic">
                  <Clock className="h-4 w-4" />
                  Last updated {format(log.updatedAt.toDate(), 'h:mm a')}
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-12 border-t border-border pt-12">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold uppercase tracking-tight">What I Accomplished</h2>
                </div>
                <div className="text-xl text-text-primary leading-relaxed whitespace-pre-wrap pl-11">
                  {log.did}
                </div>
              </section>

              {log.blockers && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-red-100 text-red-600 p-2 rounded-lg">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold uppercase tracking-tight text-red-900/80">Challenges & Blockers</h2>
                  </div>
                  <div className="text-lg text-red-900/60 leading-relaxed whitespace-pre-wrap pl-11">
                    {log.blockers}
                  </div>
                </section>
              )}

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <ArrowRightCircle className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold uppercase tracking-tight text-blue-900/80">Path Forward</h2>
                </div>
                <div className="text-lg text-blue-900/60 leading-relaxed whitespace-pre-wrap pl-11 italic">
                  {log.next || "Planning for tomorrow..."}
                </div>
              </section>

              <section className="pt-8 border-t border-border flex flex-wrap gap-3">
                 <div className="w-full text-xs font-black uppercase tracking-[0.2em] text-text-muted mb-2">
                   Associated Projects & Skills
                 </div>
                 {log.tags.map(tag => (
                   <span key={tag} className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-bold text-text-primary hover:border-primary transition-colors cursor-default">
                     <TagIcon className="h-4 w-4 text-primary" />
                     {tag}
                   </span>
                 ))}
                 {log.tags.length === 0 && (
                   <span className="text-text-muted italic text-sm">No tags associated with this entry</span>
                 )}
              </section>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
