import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { 
  User as UserIcon, 
  Mail, 
  Trash2, 
  Save, 
  TrendingUp, 
  Hash, 
  Calendar,
  AlertTriangle,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { deleteAccount } from '../services/authService';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const navigate = useNavigate();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setStatus(null);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: displayName
      });
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (window.confirm('WARNING: THIS IS PERMANENT. This will delete your account and all your log entries. Are you absolutely sure?')) {
      const confirmText = window.prompt('Please type "DELETE" to confirm:');
      if (confirmText === 'DELETE') {
        setDeleting(true);
        try {
          await deleteAccount(user.uid);
          navigate('/');
        } catch (err: any) {
          alert('Failed to delete account. You may need to re-authenticate first.');
          setDeleting(false);
        }
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-grow lg:pl-64">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
            <p className="text-text-muted">Manage your profile and account preferences.</p>
          </header>

          <div className="space-y-8">
            {/* Profile Info */}
            <div className="card p-8 bg-white shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                Personal Information
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-text-muted">Email Address</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg text-text-muted">
                    <Mail className="h-4 w-4" />
                    {user?.email}
                  </div>
                  <p className="text-[10px] text-text-muted mt-1 italic uppercase">Email cannot be changed from this dashboard.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1" htmlFor="displayName">Display Name</label>
                  <input 
                    id="displayName"
                    type="text"
                    className="input"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>

                {status && (
                  <div className={cn(
                    "p-4 rounded-lg border flex items-center gap-2 text-sm",
                    status.type === 'success' ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"
                  )}>
                    {status.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    {status.message}
                  </div>
                )}

                <button type="submit" disabled={saving} className="btn btn-primary gap-2 px-6">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </button>
              </form>
            </div>

            {/* Stats */}
            <div className="card p-8 bg-white shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Account Statistics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background/50">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-muted uppercase">Member Since</p>
                    <p className="font-bold">{profile?.createdAt ? format(profile.createdAt.toDate(), 'MMMM yyyy') : 'Recently joined'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background/50">
                   <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Hash className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-muted uppercase">Total Entries</p>
                    <p className="font-bold">{profile?.totalEntries || 0} Entries Logged</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="card p-8 bg-red-50/30 border-red-100">
              <h2 className="text-xl font-bold mb-2 text-red-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Danger Zone
              </h2>
              <p className="text-red-700/70 text-sm mb-6">Once you delete your account, there is no going back. All your data will be permanently removed.</p>
              
              <button 
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="btn bg-red-600 text-white hover:bg-red-700 gap-2 px-6 shadow-lg shadow-red-200"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete My Account
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
