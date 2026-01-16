import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-logo-title">
          <img 
            src="/logo-original.png" 
            alt="Leve saúde" 
            className="header-logo"
          />
          <h1 className="header-title">Auditoria de Leito</h1>
        </div>
        <div className="header-user">
          <span className="user-name">{user?.nome}</span>
          <button onClick={handleLogout} className="btn-logout">
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}

