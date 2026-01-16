import { Usuario, Internacao, Transcricao } from '../types';

export const usuariosMock: Usuario[] = [
  {
    id: 'user_1',
    nome: 'Dr. João Silva',
    email: 'joao.silva@hospital.com',
    senha: '123456',
    tipo: 'medico',
    hospitaisPermitidos: ['Hospital São Paulo'] // Apenas 1 hospital - será selecionado automaticamente
  },
  {
    id: 'user_2',
    nome: 'Dra. Maria Santos',
    email: 'maria.santos@hospital.com',
    senha: '123456',
    tipo: 'medico',
    hospitaisPermitidos: ['Hospital Central', 'Hospital Regional'] // Múltiplos hospitais
  },
  {
    id: 'user_3',
    nome: 'Carlos Oliveira',
    email: 'carlos.oliveira@auditoria.com',
    senha: '123456',
    tipo: 'auditor',
    // Sem hospitaisPermitidos - pode ver todos os hospitais
  },
  {
    id: 'user_4',
    nome: 'Ana Costa',
    email: 'ana.costa@auditoria.com',
    senha: '123456',
    tipo: 'auditor',
    hospitaisPermitidos: ['Hospital Universitário'] // Apenas 1 hospital
  },
  {
    id: 'user_5',
    nome: 'Dr. Pedro Almeida',
    email: 'pedro.almeida@hospital.com',
    senha: '123456',
    tipo: 'medico',
    // Sem hospitaisPermitidos - pode ver todos os hospitais
  },
  {
    id: 'user_admin',
    nome: 'Administrador',
    email: 'admin@auditoria.com',
    senha: '123456',
    tipo: 'admin',
    // Admin pode ver todos os hospitais
  }
];

export const pacientesMock = [
  {
    nome: 'Roberto Mendes',
    hospital: 'Hospital São Paulo',
    dataInternacao: new Date('2024-01-15'),
    numeroGuia: 'GUIA-2024-001',
    matriculaPaciente: 'MAT-12345678',
    dataAlta: undefined
  },
  {
    nome: 'Fernanda Lima',
    hospital: 'Hospital Central',
    dataInternacao: new Date('2024-01-18'),
    numeroGuia: 'GUIA-2024-002',
    matriculaPaciente: 'MAT-23456789',
    dataAlta: new Date('2024-01-25')
  },
  {
    nome: 'José Carlos Pereira',
    hospital: 'Hospital Universitário',
    dataInternacao: new Date('2024-01-20'),
    numeroGuia: 'GUIA-2024-003',
    matriculaPaciente: 'MAT-34567890',
    dataAlta: undefined
  },
  {
    nome: 'Amanda Rodrigues',
    hospital: 'Hospital Regional',
    dataInternacao: new Date('2024-01-22'),
    numeroGuia: 'GUIA-2024-004',
    matriculaPaciente: 'MAT-45678901',
    dataAlta: new Date('2024-02-01')
  },
  {
    nome: 'Marcos Antônio Souza',
    hospital: 'Hospital São Paulo',
    dataInternacao: new Date('2024-01-25'),
    numeroGuia: 'GUIA-2024-005',
    matriculaPaciente: 'MAT-56789012',
    dataAlta: undefined
  },
  {
    nome: 'Juliana Ferreira',
    hospital: 'Hospital Central',
    dataInternacao: new Date('2024-01-28'),
    numeroGuia: 'GUIA-2024-006',
    matriculaPaciente: 'MAT-67890123',
    dataAlta: undefined
  },
  {
    nome: 'Ricardo Nunes',
    hospital: 'Hospital Universitário',
    dataInternacao: new Date('2024-02-01'),
    numeroGuia: 'GUIA-2024-007',
    matriculaPaciente: 'MAT-78901234',
    dataAlta: undefined
  },
  {
    nome: 'Patrícia Alves',
    hospital: 'Hospital Regional',
    dataInternacao: new Date('2024-02-03'),
    numeroGuia: 'GUIA-2024-008',
    matriculaPaciente: 'MAT-89012345',
    dataAlta: undefined
  },
  {
    nome: 'Lucas Martins',
    hospital: 'Hospital São Paulo',
    dataInternacao: new Date('2024-02-05'),
    numeroGuia: 'GUIA-2024-009',
    matriculaPaciente: 'MAT-90123456',
    dataAlta: undefined
  },
  {
    nome: 'Camila Barbosa',
    hospital: 'Hospital Central',
    dataInternacao: new Date('2024-02-08'),
    numeroGuia: 'GUIA-2024-010',
    matriculaPaciente: 'MAT-01234567',
    dataAlta: undefined
  }
];

export async function popularDadosIniciais() {
  try {
    const { db } = await import('../services/database/db');
    
    // Aguardar banco estar aberto
    if (!db.isOpen()) {
      await db.open();
    }
    
    // Popular usuários
    const usuariosExistentes = await db.usuarios.count();
    if (usuariosExistentes === 0) {
      await db.usuarios.bulkAdd(usuariosMock);
    } else {
      // Garantir que o usuário admin sempre exista
      const adminExistente = await db.usuarios.where('email').equals('admin@auditoria.com').first();
      if (!adminExistente) {
        const adminUser = usuariosMock.find(u => u.email === 'admin@auditoria.com');
        if (adminUser) {
          await db.usuarios.add(adminUser);
        }
      }
    }

    // Popular internações de teste
    const internacoesExistentes = await db.internacoes.count();
    if (internacoesExistentes === 0) {
      const internacoesMock: Internacao[] = pacientesMock.map((paciente, index) => ({
        id: `int_mock_${index + 1}`,
        dataInternacao: paciente.dataInternacao,
        nomePaciente: paciente.nome,
        nomeHospital: paciente.hospital,
        numeroGuia: paciente.numeroGuia,
        matriculaPaciente: paciente.matriculaPaciente,
        dataAlta: paciente.dataAlta,
        auditorId: usuariosMock[index % usuariosMock.length].id,
        auditorNome: usuariosMock[index % usuariosMock.length].nome,
        createdAt: new Date(paciente.dataInternacao.getTime() + Math.random() * 86400000)
      }));

      await db.internacoes.bulkAdd(internacoesMock);

      // Criar algumas transcrições de exemplo
      const transcricoesMock: Transcricao[] = [];
      for (let i = 0; i < 5; i++) {
        const internacao = internacoesMock[i];
        transcricoesMock.push({
          id: `trans_mock_${i + 1}`,
          internacaoId: internacao.id,
          dataAnotacao: new Date(internacao.dataInternacao.getTime() + 86400000),
          usuarioAuditor: internacao.auditorNome,
          anotacoes: `Transcrição de exemplo para ${internacao.nomePaciente}. Paciente internado em ${internacao.nomeHospital} com quadro clínico estável. Exames complementares realizados e tratamento iniciado conforme protocolo.`,
          status: 'concluido',
          createdAt: new Date(internacao.dataInternacao.getTime() + 86400000)
        });
      }

      await db.transcricoes.bulkAdd(transcricoesMock);
    }
  } catch (error) {
    console.error('Erro ao popular dados iniciais:', error);
  }
}
