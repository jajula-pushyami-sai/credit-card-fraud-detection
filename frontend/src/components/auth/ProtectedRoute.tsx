import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

/**
 * Wraps authenticated route groups.
 * - While auth is being validated on startup (isInitializing=true), renders
 *   a minimal loader to avoid a premature redirect to /login.
 * - Once initialization completes, redirects unauthenticated users to /login
 *   with `?from=<original path>` so LoginPage can redirect back after login.
 */
export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing, user } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    isInitializing: state.isInitializing,
    user: state.user,
  }));
  const location = useLocation();

  // Auth check is still in-flight — don't redirect yet
  if (isInitializing) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--bg-primary, #0a0a0f)',
          color: 'var(--text-secondary, #8892a4)',
          fontSize: '0.875rem',
          gap: '0.5rem',
        }}
        aria-label="Verifying session..."
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animation: 'spin 1s linear infinite' }}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        Verifying session…
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

