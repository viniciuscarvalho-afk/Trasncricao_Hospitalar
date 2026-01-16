import Dexie, { Table } from 'dexie';
import { Internacao, Transcricao, Usuario } from '../../types';

export class AppDatabase extends Dexie {
  usuarios!: Table<Usuario>;
  internacoes!: Table<Internacao>;
  transcricoes!: Table<Transcricao>;

  constructor() {
    super('AuditoriaDB');
    this.version(1).stores({
      usuarios: 'id, email',
      internacoes: 'id, dataInternacao, auditorId, nomePaciente',
      transcricoes: 'id, internacaoId, dataAnotacao, status'
    });
    // Versão 2: Adiciona novos campos (numeroGuia, matriculaPaciente, dataAlta)
    this.version(2).stores({
      usuarios: 'id, email',
      internacoes: 'id, dataInternacao, auditorId, nomePaciente, nomeHospital',
      transcricoes: 'id, internacaoId, dataAnotacao, status'
    }).upgrade(async (tx) => {
      // Migration: adicionar campos padrão para internações existentes
      const internacoes = await tx.table('internacoes').toCollection().toArray();
      for (const internacao of internacoes) {
        if (!internacao.numeroGuia) {
          internacao.numeroGuia = `GUIA-${internacao.id.substring(0, 8).toUpperCase()}`;
        }
        if (!internacao.matriculaPaciente) {
          internacao.matriculaPaciente = `MAT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        }
        await tx.table('internacoes').put(internacao);
      }
    });
    // Versão 3: Adiciona campo hospitaisPermitidos aos usuários
    this.version(3).stores({
      usuarios: 'id, email',
      internacoes: 'id, dataInternacao, auditorId, nomePaciente, nomeHospital',
      transcricoes: 'id, internacaoId, dataAnotacao, status'
    }).upgrade(async (tx) => {
      // Migration: adicionar campo hospitaisPermitidos aos usuários existentes
      // Se não existir, deixa undefined para permitir acesso a todos os hospitais
      const usuarios = await tx.table('usuarios').toCollection().toArray();
      for (const usuario of usuarios) {
        if (!('hospitaisPermitidos' in usuario)) {
          // Manter undefined para permitir acesso a todos os hospitais (compatibilidade)
          await tx.table('usuarios').put(usuario);
        }
      }
    });
  }
}

export const db = new AppDatabase();

// Inicializar banco de dados
export async function initDatabase() {
  try {
    await db.open();
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}
