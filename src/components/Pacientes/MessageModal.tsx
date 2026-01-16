import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranscricoes } from '../../hooks/useInternacao';
import { BeecloudService } from '../../services/api/beecloud';
import { Internacao, ArquivoUpload } from '../../types';
import { AudioRecorder } from '../Internacao/AudioRecorder';
import { FileUploader } from '../Internacao/FileUploader';
import './MessageModal.css';

interface MessageModalProps {
  internacao: Internacao;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function MessageModal({ internacao, isOpen, onClose, onSuccess }: MessageModalProps) {
  const { user } = useAuth();
  const { criarTranscricao } = useTranscricoes(internacao.id);
  const [mensagem, setMensagem] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que há pelo menos mensagem ou arquivo/áudio
    if (!mensagem.trim() && !audioBlob && !arquivoSelecionado) {
      setErro('Por favor, digite uma mensagem ou anexe um arquivo/áudio');
      return;
    }

    if (!user) {
      setErro('Usuário não autenticado');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      let transcricaoTexto = mensagem.trim();

      // Se houver áudio ou arquivo, enviar para transcrição
      if (audioBlob || arquivoSelecionado) {
        let arquivoUpload: ArquivoUpload;
        
        if (audioBlob) {
          const audioFile = new File([audioBlob], `audio_${Date.now()}.webm`, { type: 'audio/webm' });
          arquivoUpload = {
            file: audioFile,
            tipo: 'audio'
          };
        } else if (arquivoSelecionado) {
          const isAudio = arquivoSelecionado.type.startsWith('audio/');
          arquivoUpload = {
            file: arquivoSelecionado,
            tipo: isAudio ? 'audio' : 'documento'
          };
        } else {
          throw new Error('Nenhum arquivo selecionado');
        }

        // Enviar para Beecloud
        const transcricaoBeecloud = await BeecloudService.transcreverAudio(
          arquivoUpload,
          internacao.id,
          user.nome
        );

        // Combinar mensagem escrita com transcrição
        if (transcricaoTexto) {
          transcricaoTexto = `${transcricaoTexto}\n\n[Transcrição automática]\n${transcricaoBeecloud.anotacoes}`;
        } else {
          transcricaoTexto = transcricaoBeecloud.anotacoes;
        }

        // Criar transcrição com dados do Beecloud
        await criarTranscricao({
          internacaoId: internacao.id,
          dataAnotacao: new Date(),
          usuarioAuditor: user.nome,
          anotacoes: transcricaoTexto,
          audioUrl: transcricaoBeecloud.audioUrl,
          arquivoUrl: transcricaoBeecloud.arquivoUrl,
          arquivoNome: transcricaoBeecloud.arquivoNome,
          status: 'concluido'
        });
      } else {
        // Apenas mensagem de texto, criar transcrição simples
        await criarTranscricao({
          internacaoId: internacao.id,
          dataAnotacao: new Date(),
          usuarioAuditor: user.nome,
          anotacoes: transcricaoTexto,
          status: 'concluido'
        });
      }

      // Limpar formulário
      setMensagem('');
      setAudioBlob(null);
      setArquivoSelecionado(null);
      
      // Fechar modal e chamar callback
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setErro('Erro ao processar mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setMensagem('');
      setAudioBlob(null);
      setArquivoSelecionado(null);
      setErro('');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Enviar Mensagem/Arquivo</h2>
          <button className="modal-close" onClick={handleClose} disabled={loading}>
            ×
          </button>
        </div>

        <div className="modal-paciente-info">
          <p><strong>Paciente:</strong> {internacao.nomePaciente}</p>
          <p><strong>Hospital:</strong> {internacao.nomeHospital}</p>
          <p><strong>Guia:</strong> {internacao.numeroGuia}</p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="mensagem">Mensagem (opcional)</label>
            <textarea
              id="mensagem"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Digite sua mensagem ou anotação..."
              rows={4}
              disabled={loading}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label>Áudio ou Arquivo (opcional)</label>
            <div className="upload-section">
              <div className="upload-option">
                <h4>Gravar Áudio</h4>
                <AudioRecorder
                  onRecordingComplete={(blob) => {
                    setAudioBlob(blob);
                    setArquivoSelecionado(null);
                  }}
                  disabled={loading || !!arquivoSelecionado}
                />
              </div>

              <div className="divider">ou</div>

              <div className="upload-option">
                <h4>Enviar Arquivo</h4>
                <FileUploader
                  onFileSelect={(file) => {
                    setArquivoSelecionado(file);
                    setAudioBlob(null);
                  }}
                  disabled={loading || !!audioBlob}
                />
              </div>
            </div>
          </div>

          {erro && <div className="error-message">{erro}</div>}

          <div className="modal-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

