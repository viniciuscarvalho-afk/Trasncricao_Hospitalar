import { NavLink } from 'react-router-dom';
import './Navigation.css';

export function Navigation() {
  return (
    <nav className="app-navigation">
      <NavLink to="/pacientes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Pacientes
      </NavLink>
      <NavLink to="/internacao/nova" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Nova Internação
      </NavLink>
    </nav>
  );
}

