import { Internacao } from '../../types';
import './PacienteCard.css';

interface PacienteCardProps {
  internacao: Internacao;
  onCardClick: () => void;
  onViewDetails: () => void;
}

export function PacienteCard({ internacao, onCardClick, onViewDetails }: PacienteCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const handleEyeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails();
  };

  return (
    <div className="paciente-card" onClick={onCardClick}>
      <div className="paciente-header">
        <h3 className="paciente-nome">{internacao.nomePaciente}</h3>
        <div className="paciente-header-right">
          <span className="paciente-data">{formatDate(internacao.dataInternacao)}</span>
          <button
            className="btn-eye"
            onClick={handleEyeClick}
            title="Ver detalhes"
            aria-label="Ver detalhes do paciente"
          >
            👁️
          </button>
        </div>
      </div>
      
      <div className="paciente-info-simple">
        <div className="info-item-simple">
          <span className="info-label-simple">Hospital:</span>
          <span className="info-value-simple">{internacao.nomeHospital}</span>
        </div>
        <div className="info-item-simple">
          <span className="info-label-simple">Data Internação:</span>
          <span className="info-value-simple">{formatDate(internacao.dataInternacao)}</span>
        </div>
      </div>
    </div>
  );
}
