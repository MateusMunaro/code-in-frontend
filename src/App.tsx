import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuthStore } from '@shared/stores';
import { ProtectedRoute, PublicOnlyRoute } from '@shared/components/ProtectedRoute';

// Public Pages
import { LandingPage, LoginPage, SignupPage } from '@public/pages';

// Auth Pages
import AuthLayout from '@/(auth)/layout';
import { Dashboard, NewAnalysis, JobDetail, Settings } from '@/(auth)';

const App: React.FC = () => {
  const { checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        }
      />

      {/* Protected Routes (App) */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AuthLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="new" element={<NewAnalysis />} />
        <Route path="jobs/:jobId" element={<JobDetail />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center font-mono">
      <div className="text-center border border-[#333] p-12 bg-brand-dark shadow-retro">
        <h1 className="text-7xl font-display text-brand-primary mb-4 tracking-widest">404</h1>
        <p className="text-gray-400 mb-2 uppercase tracking-wider text-sm">&gt; ERROR: Page not found</p>
        <p className="text-gray-500 mb-8 text-xs">// O recurso solicitado não existe</p>
        <a
          href="/"
          className="text-brand-primary hover:text-white border border-brand-primary px-6 py-3 inline-block uppercase tracking-widest text-sm font-bold transition-colors hover:bg-brand-primary hover:text-black"
        >
          &gt; Voltar ao início_
        </a>
      </div>
    </div>
  );
};

export default App;
