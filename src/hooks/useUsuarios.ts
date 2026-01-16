import { useState, useEffect } from 'react';
import { Usuario, Internacao } from '../types';
import { db } from '../services/database/db';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      const all = await db.usuarios.toArray();
      // Remover senhas dos usuários para segurança
      const usuariosSemSenha = all.map(({ senha, ...usuario }) => usuario as Usuario);
      setUsuarios(usuariosSemSenha);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const atualizarUsuario = async (id: string, dados: Partial<Usuario>): Promise<void> => {
    try {
      const usuarioExistente = await db.usuarios.get(id);
      if (!usuarioExistente) {
        throw new Error('Usuário não encontrado');
      }

      const usuarioAtualizado = {
        ...usuarioExistente,
        ...dados
      };

      await db.usuarios.put(usuarioAtualizado);
      await loadUsuarios();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  return {
    usuarios,
    loading,
    atualizarUsuario,
    refresh: loadUsuarios
  };
}

export function useHospitaisDisponiveis() {
  const [hospitais, setHospitais] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHospitais();
  }, []);

  const loadHospitais = async () => {
    try {
      const internacoes = await db.internacoes.toArray();
      const hospitaisUnicos = Array.from(
        new Set(internacoes.map((int: Internacao) => int.nomeHospital))
      ).sort();
      setHospitais(hospitaisUnicos);
    } catch (error) {
      console.error('Erro ao carregar hospitais:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    hospitais,
    loading,
    refresh: loadHospitais
  };
}

