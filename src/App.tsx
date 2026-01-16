import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { LoginForm } from './components/Auth/LoginForm';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { InternacaoForm } from './components/Internacao/InternacaoForm';
import { PacienteList } from './components/Pacientes/PacienteList';
import { PacienteDetail } from './components/Pacientes/PacienteDetail';
import { popularDadosIniciais } from './utils/mockData';
import './App.css';

function App() {
  useEffect(() => {
    // Popular dados iniciais quando o app carregar
    popularDadosIniciais();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginForm />}
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <Header />
                <Navigation />
                <main className="app-main">
                  <Routes>
                    <Route path="/pacientes" element={<PacienteList />} />
                    <Route path="/pacientes/:id" element={<PacienteDetail />} />
                    <Route path="/internacao/nova" element={<InternacaoForm />} />
                    <Route path="/" element={<Navigate to="/pacientes" replace />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

