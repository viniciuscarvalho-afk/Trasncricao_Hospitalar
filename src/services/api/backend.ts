import axios from 'axios';
import { Internacao, Transcricao } from '../../types';

// Estrutura para integração com backend real no futuro
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export class BackendService {
  private static client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  static async salvarInternacao(internacao: Internacao): Promise<Internacao> {
    // Por enquanto, apenas retorna a internação
    // No futuro, fará POST para o backend
    return internacao;
  }

  static async salvarTranscricao(transcricao: Transcricao): Promise<Transcricao> {
    // Por enquanto, apenas retorna a transcrição
    // No futuro, fará POST para o backend
    return transcricao;
  }

  static async listarInternacoes(): Promise<Internacao[]> {
    // Por enquanto, retorna array vazio
    // No futuro, fará GET do backend
    return [];
  }

  static async listarTranscricoes(internacaoId?: string): Promise<Transcricao[]> {
    // Por enquanto, retorna array vazio
    // No futuro, fará GET do backend
    return [];
  }
}

