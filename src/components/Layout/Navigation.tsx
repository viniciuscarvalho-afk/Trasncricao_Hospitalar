import { NavLink } from 'react-router-dom';
import { AuthService } from '../../services/auth/authService';
import './Navigation.css';

export function Navigation() {
  const isAdmin = AuthService.isAdmin();

  return (
    <nav className="app-navigation">
      <NavLink to="/pacientes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Pacientes
      </NavLink>
      <NavLink to="/internacao/nova" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Nova Internação
      </NavLink>
      {isAdmin && (
        <NavLink to="/admin/usuarios" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Administração
        </NavLink>
      )}
    </nav>
  );
}

