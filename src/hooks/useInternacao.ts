import { useState, useEffect } from 'react';
import { Internacao, Transcricao } from '../types';
import { db } from '../services/database/db';

export function useInternacoes() {
  const [internacoes, setInternacoes] = useState<Internacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInternacoes();
  }, []);

  const loadInternacoes = async () => {
    try {
      const all = await db.internacoes.toArray();
      setInternacoes(all);
    } catch (error) {
      console.error('Erro ao carregar internações:', error);
    } finally {
      setLoading(false);
    }
  };

  const criarInternacao = async (internacao: Omit<Internacao, 'id' | 'createdAt'>) => {
    const novaInternacao: Internacao = {
      ...internacao,
      id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };
    
    await db.internacoes.add(novaInternacao);
    await loadInternacoes();
    return novaInternacao;
  };

  const getInternacao = async (id: string): Promise<Internacao | undefined> => {
    return await db.internacoes.get(id);
  };

  return {
    internacoes,
    loading,
    criarInternacao,
    getInternacao,
    refresh: loadInternacoes
  };
}

export function useTranscricoes(internacaoId?: string) {
  const [transcricoes, setTranscricoes] = useState<Transcricao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTranscricoes();
  }, [internacaoId]);

  const loadTranscricoes = async () => {
    try {
      let all: Transcricao[];
      if (internacaoId) {
        all = await db.transcricoes.where('internacaoId').equals(internacaoId).toArray();
      } else {
        all = await db.transcricoes.toArray();
      }
      setTranscricoes(all);
    } catch (error) {
      console.error('Erro ao carregar transcrições:', error);
    } finally {
      setLoading(false);
    }
  };

  const criarTranscricao = async (transcricao: Omit<Transcricao, 'id' | 'createdAt'>) => {
    const novaTranscricao: Transcricao = {
      ...transcricao,
      id: `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };
    
    await db.transcricoes.add(novaTranscricao);
    await loadTranscricoes();
    return novaTranscricao;
  };

  return {
    transcricoes,
    loading,
    criarTranscricao,
    refresh: loadTranscricoes
  };
}

