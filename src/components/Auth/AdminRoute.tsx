import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AuthService } from '../../services/auth/authService';
import '../../App.css';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const isAdmin = AuthService.isAdmin();

  if (loading) {
    return (
      <div className="loading-container">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/pacientes" replace />;
  }

  return <>{children}</>;
}

