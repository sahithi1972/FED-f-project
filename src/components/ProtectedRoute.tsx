import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { useAuthModal } from '../contexts/auth-modal-context';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { openModal } = useAuthModal();

  // Don't do anything while auth is loading
  if (loading) {
    return null;
  }

  // Check if user is authenticated
  if (!user) {
    // Open the auth modal and redirect to home page
    openModal('signin');
    return <Navigate to="/" replace />;
  }

  // If children prop is provided, render it, otherwise render outlet
  return children ? <>{children}</> : <Outlet />;
}