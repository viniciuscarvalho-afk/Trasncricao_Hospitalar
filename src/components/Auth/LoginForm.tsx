import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../services/database/db';
import { popularDadosIniciais } from '../../utils/mockData';
import './LoginForm.css';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [dbReady, setDbReady] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Garantir que o banco está inicializado
  useEffect(() => {
    const init = async () => {
      try {
        if (!db.isOpen()) {
          await db.open();
        }
        await popularDadosIniciais();
        setDbReady(true);
      } catch (error) {
        console.error('Erro ao inicializar banco:', error);
        setErro('Erro ao inicializar aplicativo. Recarregue a página.');
      }
    };
    init();
  }, []);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/pacientes', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    
    if (!dbReady) {
      setErro('Aguardando inicialização...');
      return;
    }

    setLoading(true);

    try {
      const sucesso = await login(email, senha);
      if (sucesso) {
        // Navegar após login bem-sucedido
        navigate('/pacientes', { replace: true });
      } else {
        setErro('Email ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setErro('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    setErro('');
    
    if (!dbReady) {
      setErro('Aguardando inicialização...');
      return;
    }

    setEmail('admin@auditoria.com');
    setSenha('123456');
    setLoading(true);

    try {
      const sucesso = await login('admin@auditoria.com', '123456');
      if (sucesso) {
        // Navegar após login bem-sucedido
        navigate('/pacientes', { replace: true });
      } else {
        setErro('Erro ao fazer login como administrador');
      }
    } catch (error) {
      console.error('Erro no login admin:', error);
      setErro('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo-container">
          <img 
            src="/logo-original.png" 
            alt="Leve Saúde" 
            className="login-logo"
          />
        </div>
        <h1>Auditoria de Leito</h1>
        <p className="subtitle">Faça login para continuar</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu.email@hospital.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {erro && <div className="error-message">{erro}</div>}

          <button type="submit" className="btn-primary" disabled={loading || !dbReady}>
            {loading ? 'Entrando...' : !dbReady ? 'Inicializando...' : 'Entrar'}
          </button>
        </form>

        <div className="admin-access">
          <button
            type="button"
            onClick={handleAdminLogin}
            className="btn-admin"
            disabled={loading || !dbReady}
          >
            🔐 Acesso Administrador
          </button>
        </div>

        <div className="login-hint">
          <p>Usuários de teste:</p>
          <ul>
            <li>admin@auditoria.com / 123456 (Administrador)</li>
            <li>joao.silva@hospital.com / 123456</li>
            <li>maria.santos@hospital.com / 123456</li>
            <li>carlos.oliveira@auditoria.com / 123456</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

