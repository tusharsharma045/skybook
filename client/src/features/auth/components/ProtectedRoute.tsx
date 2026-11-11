import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../auth.store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
}) => {
  const { isAuthenticated, isInitialized, setPendingRedirect } = useAuthStore();
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Authenticating SkyBook session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve target path and state
    const currentTarget = location.pathname + location.search;
    setPendingRedirect(currentTarget, (location.state as any)?.flight);

    return <Navigate to={`/login?redirect=${encodeURIComponent(currentTarget)}`} replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
