import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInternacoes, useTranscricoes } from '../../hooks/useInternacao';
import { Internacao } from '../../types';
import { PacienteCard } from './PacienteCard';
import { MessageModal } from './MessageModal';
import './PacienteList.css';

export function PacienteList() {
  const navigate = useNavigate();
  const { internacoes, loading } = useInternacoes();
  const { transcricoes } = useTranscricoes();
  const [selectedHospital, setSelectedHospital] = useState<string>('');
  const [selectedPaciente, setSelectedPaciente] = useState<string>('');
  const [modalInternacao, setModalInternacao] = useState<Internacao | null>(null);

  // Extrair lista única de hospitais
  const hospitais = useMemo(() => {
    const hospitaisUnicos = Array.from(new Set(internacoes.map(int => int.nomeHospital)));
    return hospitaisUnicos.sort();
  }, [internacoes]);

  // Filtrar internações por hospital
  const internacoesPorHospital = useMemo(() => {
    if (!selectedHospital) return internacoes;
    return internacoes.filter(int => int.nomeHospital === selectedHospital);
  }, [internacoes, selectedHospital]);

  // Extrair lista de pacientes do hospital selecionado
  const pacientesDoHospital = useMemo(() => {
    if (!selectedHospital) return [];
    const pacientesUnicos = Array.from(
      new Set(internacoesPorHospital.map(int => int.nomePaciente))
    );
    return pacientesUnicos.sort();
  }, [internacoesPorHospital, selectedHospital]);

  // Filtrar internações por paciente (se selecionado)
  const filteredInternacoes = useMemo(() => {
    if (!selectedPaciente) return internacoesPorHospital;
    return internacoesPorHospital.filter(int => int.nomePaciente === selectedPaciente);
  }, [internacoesPorHospital, selectedPaciente]);

  // Resetar filtro de paciente quando hospital mudar
  useEffect(() => {
    setSelectedPaciente('');
    setModalInternacao(null);
  }, [selectedHospital]);

  // Não abrir modal automaticamente - apenas ao clicar no card

  const getTranscricoesCount = (internacaoId: string) => {
    return transcricoes.filter((t) => t.internacaoId === internacaoId).length;
  };

  const handleCardClick = (internacao: Internacao) => {
    setModalInternacao(internacao);
  };

  const handleModalClose = () => {
    setModalInternacao(null);
  };

  const handleModalSuccess = () => {
    // Recarregar dados se necessário
    // O hook useTranscricoes já atualiza automaticamente
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Carregando pacientes...</p>
      </div>
    );
  }

  return (
    <div className="paciente-list-container">
      <div className="paciente-list-header">
        <h2>Pacientes</h2>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="hospital-filter">Hospital</label>
          <select
            id="hospital-filter"
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
            className="filter-select"
          >
            <option value="">Selecione um hospital</option>
            {hospitais.map((hospital) => (
              <option key={hospital} value={hospital}>
                {hospital}
              </option>
            ))}
          </select>
        </div>

        {selectedHospital && (
          <div className="filter-group">
            <label htmlFor="paciente-filter">Paciente</label>
            <select
              id="paciente-filter"
              value={selectedPaciente}
              onChange={(e) => setSelectedPaciente(e.target.value)}
              className="filter-select"
            >
              <option value="">Selecione um paciente</option>
              {pacientesDoHospital.map((paciente) => (
                <option key={paciente} value={paciente}>
                  {paciente}
                </option>
              ))}
            </select>
          </div>
        )}

        {(selectedHospital || selectedPaciente) && (
          <button
            onClick={() => {
              setSelectedHospital('');
              setSelectedPaciente('');
            }}
            className="btn-clear-filters"
          >
            Limpar Filtros
          </button>
        )}
      </div>

      {!selectedHospital ? (
        <div className="empty-state">
          <p>Selecione um hospital para visualizar os pacientes</p>
        </div>
      ) : !selectedPaciente ? (
        <div className="empty-state">
          <p>Selecione um paciente para visualizar as informações</p>
        </div>
      ) : filteredInternacoes.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum paciente encontrado com os filtros selecionados</p>
        </div>
      ) : (
        <div className="paciente-grid">
          {filteredInternacoes.map((internacao) => (
            <PacienteCard
              key={internacao.id}
              internacao={internacao}
              onCardClick={() => handleCardClick(internacao)}
              onViewDetails={() => navigate(`/pacientes/${internacao.id}`)}
            />
          ))}
        </div>
      )}

      {modalInternacao && (
        <MessageModal
          internacao={modalInternacao}
          isOpen={!!modalInternacao}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
