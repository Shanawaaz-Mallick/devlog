import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createLog, updateLog, getLogById, getLogByDate } from '../services/logService';
import Sidebar from '../components/Sidebar';
import { 
  Save, 
  ArrowLeft, 
  Clock, 
  Calendar as CalendarIcon, 
  Tag as TagIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import { format, startOfToday } from 'date-fns';
import { motion } from 'motion/react';
import { LogEntry } from '../types';
import { cn } from '../lib/utils';

export default function LogEditorPage() {
  const { entryId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(!!entryId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState<Partial<LogEntry>>({
    date: format(startOfToday(), 'yyyy-MM-dd'),
    did: '',
    blockers: '',
    next: '',
    mood: 3,
    tags: []
  });

  const didRef = useRef<HTMLTextAreaElement>(null);
  
  // Tag input state
  const [tagInput, setTagInput] = useState('');

  // Fetch logic
  useEffect(() => {
    async function load() {
      if (!user) return;
      
      if (entryId) {
        try {
          const entry = await getLogById(user.uid, entryId);
          if (entry) {
            setForm(entry);
          } else {
            setError('Entry not found');
          }
        } catch (err) {
          setError('Failed to load entry');
        } finally {
          setLoading(false);
        }
      } else {
        // Check if today already has an entry
        try {
          const today = format(startOfToday(), 'yyyy-MM-dd');
          const existing = await getLogByDate(user.uid, today);
          if (existing) {
            navigate(`/log/edit/${existing.id}`);
            return;
          }
        } catch (err) {
          console.error("Checking existing log error:", err);
        }

        // Try load draft from localStorage
        const draft = localStorage.getItem('devlog_draft');
        if (draft) {
          try {
            const parsed = JSON.parse(draft);
            setForm(prev => ({ ...prev, ...parsed }));
          } catch(e) {}
        }
      }
    }
    load();
  }, [entryId, user, navigate]);

  // Auto-focus 'did' field on mount (per PRD p10)
  useEffect(() => {
    if (!loading && didRef.current) {
      didRef.current.focus();
    }
  }, [loading]);

  // localStorage persistence
  useEffect(() => {
    if (!entryId && !loading) {
      const draft = { ...form };
      localStorage.setItem('devlog_draft', JSON.stringify(draft));
    }
  }, [form, entryId, loading]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (form.did!.trim().length < 10) {
      setError('What I did must be at least 10 characters');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (entryId) {
        await updateLog(user.uid, entryId, form);
      } else {
        await createLog(user.uid, form);
        localStorage.removeItem('devlog_draft');
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (!form.tags?.includes(tag) && form.tags!.length < 10) {
        setForm(prev => ({ ...prev, tags: [...(prev.tags || []), tag] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tag) }));
};

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-grow lg:pl-64">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-text-muted hover:text-text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              {entryId ? 'Edit Log Entry' : 'Create New Log'}
            </h1>
            <p className="text-text-muted">Reflect on your progress and plan your next steps.</p>
          </div>

          <div className="card p-8 bg-white shadow-xl">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Date */}
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    Date
                  </label>
                  <input 
                    type="date"
                    className="input"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>

                {/* Mood */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Mood / Energy</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setForm({ ...form, mood: level })}
                        className={cn(
                          "flex-grow py-2 px-3 rounded-lg border text-xl transition-all",
                          form.mood === level 
                            ? "bg-primary/5 border-primary shadow-inner scale-95" 
                            : "bg-surface border-border hover:border-primary/50"
                        )}
                      >
                        {level === 1 && '😴'}
                        {level === 2 && '😐'}
                        {level === 3 && '🙂'}
                        {level === 4 && '🚀'}
                        {level === 5 && '🔥'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* What I did */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  What I accomplished today
                </label>
                <textarea 
                  ref={didRef}
                  className="input min-h-[120px] resize-none"
                  placeholder="Summarize your key achievements (min 10 chars)..."
                  value={form.did}
                  onChange={(e) => setForm({ ...form, did: e.target.value })}
                  required
                />
              </div>

              {/* Blockers */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  Any blockers or struggles?
                </label>
                <textarea 
                  className="input min-h-[80px] resize-none"
                  placeholder="What held you back today?"
                  value={form.blockers}
                  onChange={(e) => setForm({ ...form, blockers: e.target.value })}
                />
              </div>

              {/* Next Steps */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Plan for tomorrow
                </label>
                <textarea 
                  className="input min-h-[80px] resize-none"
                  placeholder="What's your main focus for the next session?"
                  value={form.next}
                  onChange={(e) => setForm({ ...form, next: e.target.value })}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <TagIcon className="h-4 w-4 text-purple-500" />
                  Project / Skill Tags (max 10)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.tags?.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 border border-purple-100 rounded-full text-sm text-purple-700 font-medium">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-purple-900">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <input 
                  type="text"
                  className="input"
                  placeholder="Type a tag and press Enter..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between pt-6 border-t border-border">
                <p className="text-xs text-text-muted italic flex items-center gap-1">
                  <Save className="h-3 w-3" />
                  {entryId ? 'Syncing updates to Firestore' : 'Draft saved to local storage'}
                </p>
                <div className="flex gap-4">
                   <button 
                    type="button" 
                    onClick={() => navigate('/dashboard')} 
                    className="btn btn-secondary px-6"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={saving} 
                    className="btn btn-primary px-10 gap-2"
                  >
                    {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <><Save className="h-5 w-5" /> Save Journal Entry</>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
