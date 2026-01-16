export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha?: string; // hash
  tipo: 'medico' | 'auditor';
}

export interface Internacao {
  id: string;
  dataInternacao: Date;
  nomePaciente: string;
  nomeHospital: string;
  numeroGuia: string;
  matriculaPaciente: string;
  dataAlta?: Date;
  auditorId: string;
  auditorNome: string;
  createdAt: Date;
}

export interface Transcricao {
  id: string;
  internacaoId: string;
  dataAnotacao: Date;
  usuarioAuditor: string;
  anotacoes: string; // Transcrição
  audioUrl?: string;
  arquivoUrl?: string;
  arquivoNome?: string;
  status: 'pendente' | 'processando' | 'concluido' | 'erro';
  createdAt: Date;
}

export interface ArquivoUpload {
  file: File;
  tipo: 'audio' | 'documento';
  url?: string;
}

