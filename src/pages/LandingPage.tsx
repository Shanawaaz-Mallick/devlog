import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Github, Layout, CheckCircle, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans select-none">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Layout className="text-white h-4 w-4" />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase italic">DevLog</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="px-5 py-2 text-sm font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">Login</Link>
          <Link to="/register" className="px-5 py-2 text-sm font-bold bg-black text-white rounded-xl hover:bg-black/90 transition-all shadow-lg shadow-black/10">Join Now</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-12 mb-12 text-center"
          >
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.9] mb-8">
               CODE. LOG. <br/> <span className="text-accent underline decoration-4 underline-offset-8">REFLECT.</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
              The high-performance journal for developers. Track your daily standups, archive your struggles, and visualize your evolution through a structured bento interface.
            </p>
          </motion.div>

          {/* Bento Grid Features */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 bento-card-header p-8 text-white flex flex-col justify-between">
               <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest self-start">Phase 01</span>
               <div className="mt-12">
                 <h3 className="text-3xl font-black italic tracking-tighter mb-2">Total Control.</h3>
                 <p className="text-sm opacity-70 font-medium">Full CRUD operations with real-time Firestore sync. Your data, your rules, your momentum.</p>
               </div>
            </div>

            <div className="md:col-span-1 bento-card p-8 flex flex-col justify-between shadow-xl shadow-blue-50/50">
               <div className="bg-accent/10 p-3 rounded-2xl w-fit">
                 <TrendingUp className="text-accent h-6 w-6" />
               </div>
               <div>
                  <h3 className="font-black italic text-xl mb-1 tracking-tighter">Peak Streaks.</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Consistency Enforced</p>
               </div>
            </div>

            <div className="md:col-span-1 bg-[#1A1A1A] rounded-[24px] p-8 text-white flex flex-col items-center justify-center text-center">
               <div className="bg-white/10 p-4 rounded-3xl mb-4 border border-white/5">
                 <CheckCircle className="h-8 w-8" />
               </div>
               <h3 className="font-bold text-lg mb-1">Verify Growth.</h3>
               <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Archive Every Win</p>
            </div>

            <div className="md:col-span-3 bento-card p-10 flex items-center justify-between group">
               <div className="max-w-md">
                 <h3 className="text-3xl font-black italic tracking-tighter mb-3">52-Week Map.</h3>
                 <p className="text-sm text-gray-500 font-medium">Visualize your productivity through an interactive contribution grid. Every day counts toward the final build.</p>
               </div>
               <div className="h-24 w-48 bg-gray-50 rounded-2xl border border-gray-100 p-2 flex overflow-hidden gap-1 items-end">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-accent/20" style={{ height: `${Math.random() * 100}%` }}></div>
                  ))}
               </div>
            </div>

            <div className="md:col-span-1 bento-card p-8 flex flex-col justify-end bg-orange-50 border-orange-100">
               <div className="text-orange-600 mb-4 h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                 <Github h-6 w-6 />
               </div>
               <h3 className="font-black italic text-xl tracking-tighter text-orange-900">Open Core.</h3>
            </div>
          </div>
          
          <div className="lg:col-span-12 flex justify-center pt-8">
            <Link to="/register" className="btn btn-primary px-16 py-5 text-xl rounded-[28px] shadow-2xl shadow-primary/40">
              Launch Your Journal
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
          <p>© 2026 DevLog Architecture</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-black transition-colors">Documentation</a>
            <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-black transition-colors">Changelog</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
