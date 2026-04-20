import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import React, { Suspense, lazy } from 'react';

// Lazy load pages for performance (per PRD p13)
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LogEditorPage = lazy(() => import('./pages/LogEditorPage'));
const LogDetailPage = lazy(() => import('./pages/LogDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1D4ED8] border-t-transparent"></div>
  </div>
);

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/log/new" element={
              <ProtectedRoute>
                <LogEditorPage />
              </ProtectedRoute>
            } />
            
            <Route path="/log/:entryId" element={
              <ProtectedRoute>
                <LogDetailPage />
              </ProtectedRoute>
            } />
            
            <Route path="/log/edit/:entryId" element={
              <ProtectedRoute>
                <LogEditorPage />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}
