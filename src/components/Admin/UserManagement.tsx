import { useState } from 'react';
import { useUsuarios, useHospitaisDisponiveis } from '../../hooks/useUsuarios';
import { Usuario } from '../../types';
import './UserManagement.css';

export function UserManagement() {
  const { usuarios, loading: usuariosLoading, atualizarUsuario, refresh } = useUsuarios();
  const { hospitais, loading: hospitaisLoading } = useHospitaisDisponiveis();
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [hospitaisSelecionados, setHospitaisSelecionados] = useState<string[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  const handleEditar = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setHospitaisSelecionados(usuario.hospitaisPermitidos || []);
    setMensagem(null);
  };

  const handleCancelar = () => {
    setUsuarioEditando(null);
    setHospitaisSelecionados([]);
    setMensagem(null);
  };

  const handleToggleHospital = (hospital: string) => {
    setHospitaisSelecionados(prev => {
      if (prev.includes(hospital)) {
        return prev.filter(h => h !== hospital);
      } else {
        return [...prev, hospital];
      }
    });
  };

  const handleSalvar = async () => {
    if (!usuarioEditando) return;

    setSalvando(true);
    setMensagem(null);

    try {
      await atualizarUsuario(usuarioEditando.id, {
        hospitaisPermitidos: hospitaisSelecionados.length > 0 ? hospitaisSelecionados : undefined
      });
      
      setMensagem({ tipo: 'sucesso', texto: 'Usuário atualizado com sucesso!' });
      setUsuarioEditando(null);
      setHospitaisSelecionados([]);
      await refresh();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setMensagem({ tipo: 'erro', texto: 'Erro ao atualizar usuário. Tente novamente.' });
    } finally {
      setSalvando(false);
    }
  };

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      medico: 'Médico',
      auditor: 'Auditor',
      admin: 'Administrador'
    };
    return labels[tipo] || tipo;
  };

  const getTipoBadgeClass = (tipo: string) => {
    const classes: Record<string, string> = {
      medico: 'badge-medico',
      auditor: 'badge-auditor',
      admin: 'badge-admin'
    };
    return classes[tipo] || '';
  };

  if (usuariosLoading || hospitaisLoading) {
    return (
      <div className="loading-container">
        <p>Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h2>Gerenciamento de Usuários</h2>
        <p>Gerencie os usuários e defina quais hospitais cada um pode visualizar</p>
      </div>

      {mensagem && (
        <div className={`message ${mensagem.tipo}`}>
          {mensagem.texto}
        </div>
      )}

      {usuarioEditando ? (
        <div className="edit-user-card">
          <h3>Editar Usuário: {usuarioEditando.nome}</h3>
          
          <div className="user-info">
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{usuarioEditando.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Tipo:</span>
              <span className={`badge ${getTipoBadgeClass(usuarioEditando.tipo)}`}>
                {getTipoLabel(usuarioEditando.tipo)}
              </span>
            </div>
          </div>

          <div className="hospitais-section">
            <label className="section-label">Hospitais Permitidos</label>
            <p className="section-description">
              Selecione os hospitais que este usuário pode visualizar. 
              Deixe vazio para permitir acesso a todos os hospitais.
            </p>
            
            <div className="hospitais-list">
              {hospitais.length === 0 ? (
                <p className="no-hospitais">Nenhum hospital cadastrado ainda.</p>
              ) : (
                hospitais.map(hospital => (
                  <label key={hospital} className="hospital-checkbox">
                    <input
                      type="checkbox"
                      checked={hospitaisSelecionados.includes(hospital)}
                      onChange={() => handleToggleHospital(hospital)}
                    />
                    <span>{hospital}</span>
                  </label>
                ))
              )}
            </div>

            {hospitaisSelecionados.length === 1 && (
              <div className="info-box">
                <strong>Nota:</strong> Este usuário tem apenas 1 hospital permitido. 
                O hospital será selecionado automaticamente na lista de pacientes.
              </div>
            )}
          </div>

          <div className="edit-actions">
            <button
              type="button"
              onClick={handleCancelar}
              className="btn-secondary"
              disabled={salvando}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSalvar}
              className="btn-primary"
              disabled={salvando}
            >
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      ) : (
        <div className="users-list">
          {usuarios.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum usuário cadastrado.</p>
            </div>
          ) : (
            usuarios.map(usuario => (
              <div key={usuario.id} className="user-card">
                <div className="user-card-header">
                  <div className="user-card-info">
                    <h3>{usuario.nome}</h3>
                    <p className="user-email">{usuario.email}</p>
                  </div>
                  <span className={`badge ${getTipoBadgeClass(usuario.tipo)}`}>
                    {getTipoLabel(usuario.tipo)}
                  </span>
                </div>
                
                <div className="user-card-body">
                  <div className="hospitais-info">
                    <strong>Hospitais Permitidos:</strong>
                    {!usuario.hospitaisPermitidos || usuario.hospitaisPermitidos.length === 0 ? (
                      <span className="all-hospitais">Todos os hospitais</span>
                    ) : usuario.hospitaisPermitidos.length === 1 ? (
                      <span className="single-hospital">
                        {usuario.hospitaisPermitidos[0]} (seleção automática)
                      </span>
                    ) : (
                      <span className="multiple-hospitais">
                        {usuario.hospitaisPermitidos.length} hospitais
                      </span>
                    )}
                  </div>
                  
                  {usuario.hospitaisPermitidos && usuario.hospitaisPermitidos.length > 0 && (
                    <div className="hospitais-list-preview">
                      {usuario.hospitaisPermitidos.map(hospital => (
                        <span key={hospital} className="hospital-tag">
                          {hospital}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="user-card-actions">
                  <button
                    type="button"
                    onClick={() => handleEditar(usuario)}
                    className="btn-edit"
                  >
                    Editar Hospitais
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

