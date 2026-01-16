import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useInternacoes, useTranscricoes } from '../../hooks/useInternacao';
import { BeecloudService } from '../../services/api/beecloud';
import { ArquivoUpload } from '../../types';
import { AudioRecorder } from './AudioRecorder';
import { FileUploader } from './FileUploader';
import './InternacaoForm.css';

interface FormData {
  dataInternacao: string;
  nomePaciente: string;
  nomeHospital: string;
  numeroGuia: string;
  matriculaPaciente: string;
}

export function InternacaoForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { criarInternacao } = useInternacoes();
  const { criarTranscricao } = useTranscricoes();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const onSubmit = async (data: FormData) => {
    if (!audioBlob && !arquivoSelecionado) {
      setErro('Por favor, grave um áudio ou selecione um arquivo');
      return;
    }

    if (!user) {
      setErro('Usuário não autenticado');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      // Criar internação
      const internacao = await criarInternacao({
        dataInternacao: new Date(data.dataInternacao),
        nomePaciente: data.nomePaciente,
        nomeHospital: data.nomeHospital,
        numeroGuia: data.numeroGuia,
        matriculaPaciente: data.matriculaPaciente,
        auditorId: user.id,
        auditorNome: user.nome
      });

      // Preparar arquivo para envio
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

      // Enviar para Beecloud e receber transcrição
      const transcricao = await BeecloudService.transcreverAudio(
        arquivoUpload,
        internacao.id,
        user.nome
      );

      // Salvar transcrição
      await criarTranscricao(transcricao);

      // Redirecionar para lista
      navigate('/pacientes');
    } catch (error) {
      console.error('Erro ao criar internação:', error);
      setErro('Erro ao processar internação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="internacao-form-container">
      <div className="internacao-form-card">
        <h2>Nova Internação</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="internacao-form">
          <div className="form-group">
            <label htmlFor="dataInternacao">Data da Internação</label>
            <input
              id="dataInternacao"
              type="date"
              {...register('dataInternacao', { required: 'Data da internação é obrigatória' })}
              className={errors.dataInternacao ? 'error' : ''}
            />
            {errors.dataInternacao && (
              <span className="error-text">{errors.dataInternacao.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="nomePaciente">Nome Completo do Paciente</label>
            <input
              id="nomePaciente"
              type="text"
              {...register('nomePaciente', { 
                required: 'Nome do paciente é obrigatório',
                minLength: { value: 3, message: 'Nome deve ter pelo menos 3 caracteres' }
              })}
              className={errors.nomePaciente ? 'error' : ''}
              placeholder="Ex: João Silva"
            />
            {errors.nomePaciente && (
              <span className="error-text">{errors.nomePaciente.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="nomeHospital">Nome do Hospital</label>
            <input
              id="nomeHospital"
              type="text"
              {...register('nomeHospital', { 
                required: 'Nome do hospital é obrigatório',
                minLength: { value: 3, message: 'Nome do hospital deve ter pelo menos 3 caracteres' }
              })}
              className={errors.nomeHospital ? 'error' : ''}
              placeholder="Ex: Hospital São Paulo"
            />
            {errors.nomeHospital && (
              <span className="error-text">{errors.nomeHospital.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="numeroGuia">Número da Guia</label>
            <input
              id="numeroGuia"
              type="text"
              {...register('numeroGuia', { 
                required: 'Número da guia é obrigatório',
                minLength: { value: 3, message: 'Número da guia deve ter pelo menos 3 caracteres' }
              })}
              className={errors.numeroGuia ? 'error' : ''}
              placeholder="Ex: GUIA-2024-001"
            />
            {errors.numeroGuia && (
              <span className="error-text">{errors.numeroGuia.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="matriculaPaciente">Matrícula do Paciente</label>
            <input
              id="matriculaPaciente"
              type="text"
              {...register('matriculaPaciente', { 
                required: 'Matrícula do paciente é obrigatória',
                minLength: { value: 3, message: 'Matrícula deve ter pelo menos 3 caracteres' }
              })}
              className={errors.matriculaPaciente ? 'error' : ''}
              placeholder="Ex: MAT-12345678"
            />
            {errors.matriculaPaciente && (
              <span className="error-text">{errors.matriculaPaciente.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Áudio ou Arquivo</label>
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

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/pacientes')}
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
              {loading ? 'Processando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

