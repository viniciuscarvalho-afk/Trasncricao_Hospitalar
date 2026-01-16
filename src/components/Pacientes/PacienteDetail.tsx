import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInternacoes, useTranscricoes } from '../../hooks/useInternacao';
import { Internacao, Transcricao } from '../../types';
import './PacienteDetail.css';

export function PacienteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInternacao } = useInternacoes();
  const { transcricoes, loading: transcricoesLoading } = useTranscricoes(id);
  const [internacao, setInternacao] = useState<Internacao | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInternacao();
  }, [id]);

  const loadInternacao = async () => {
    if (!id) return;
    try {
      const data = await getInternacao(id);
      setInternacao(data || null);
    } catch (error) {
      console.error('Erro ao carregar internação:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Carregando detalhes...</p>
      </div>
    );
  }

  if (!internacao) {
    return (
      <div className="error-container">
        <p>Internação não encontrada</p>
        <button onClick={() => navigate('/pacientes')} className="btn-primary">
          Voltar
        </button>
      </div>
    );
  }

  const transcricoesOrdenadas = [...transcricoes].sort(
    (a, b) => new Date(b.dataAnotacao).getTime() - new Date(a.dataAnotacao).getTime()
  );

  return (
    <div className="paciente-detail-container">
      <button onClick={() => navigate('/pacientes')} className="btn-back">
        ← Voltar
      </button>

      <div className="transcricoes-section">
        <h2>Histórico de Transcrições e Mensagens</h2>
        <div className="paciente-info-header">
          <p><strong>Paciente:</strong> {internacao.nomePaciente}</p>
          <p><strong>Hospital:</strong> {internacao.nomeHospital}</p>
          <p><strong>Guia:</strong> {internacao.numeroGuia}</p>
        </div>

        {transcricoesLoading ? (
          <p>Carregando transcrições...</p>
        ) : transcricoesOrdenadas.length === 0 ? (
          <div className="empty-transcricoes">
            <p>Nenhuma transcrição ou mensagem disponível</p>
          </div>
        ) : (
          <div className="transcricoes-list">
            {transcricoesOrdenadas.map((transcricao) => (
              <TranscricaoCard key={transcricao.id} transcricao={transcricao} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TranscricaoCard({ transcricao }: { transcricao: Transcricao }) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
        return '#10b981';
      case 'processando':
        return '#f59e0b';
      case 'erro':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="transcricao-card">
      <div className="transcricao-header">
        <div className="transcricao-meta">
          <span className="transcricao-date">{formatDate(transcricao.dataAnotacao)}</span>
          <span className="transcricao-auditor">{transcricao.usuarioAuditor}</span>
        </div>
        <span
          className="transcricao-status"
          style={{ backgroundColor: getStatusColor(transcricao.status) }}
        >
          {transcricao.status}
        </span>
      </div>

      <div className="transcricao-content">
        <p>{transcricao.anotacoes}</p>
      </div>

      {(transcricao.audioUrl || transcricao.arquivoUrl) && (
        <div className="transcricao-files">
          {transcricao.audioUrl && (
            <div className="file-link">
              <span>🎵</span>
              <a href={transcricao.audioUrl} target="_blank" rel="noopener noreferrer">
                Áudio original
              </a>
            </div>
          )}
          {transcricao.arquivoUrl && (
            <div className="file-link">
              <span>📄</span>
              <a href={transcricao.arquivoUrl} target="_blank" rel="noopener noreferrer">
                {transcricao.arquivoNome || 'Arquivo original'}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
