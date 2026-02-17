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
    <div className="min-h-screen bg-brand-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-brand-primary mb-4">404</h1>
        <p className="text-gray-400 mb-8">Página não encontrada</p>
        <a
          href="/"
          className="text-brand-primary hover:underline"
        >
          Voltar para o início
        </a>
      </div>
    </div>
  );
};

export default App;
