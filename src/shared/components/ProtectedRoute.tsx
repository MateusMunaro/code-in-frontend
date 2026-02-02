import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@shared/stores';
import { LoadingScreen } from '@shared/components/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen message="Verificando autenticação..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen message="Carregando..." />;
  }

  if (isAuthenticated) {
    const from = (location.state as { from?: Location })?.from?.pathname || '/app';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
