import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { useAuthModal } from '../contexts/auth-modal-context';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const { openModal } = useAuthModal();

  if (!isAuthenticated) {
    // Open the auth modal and redirect to home page
    openModal('signin');
    return <Navigate to="/" replace />;
  }

  // If children prop is provided, render it, otherwise render outlet
  return children ? <>{children}</> : <Outlet />;
}