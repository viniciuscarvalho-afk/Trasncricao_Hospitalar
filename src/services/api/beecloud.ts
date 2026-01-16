import { Transcricao, ArquivoUpload } from '../../types';

// Mock da API Beecloud
export class BeecloudService {
  private static readonly MOCK_DELAY = 2000; // 2 segundos de simulação

  static async transcreverAudio(
    arquivo: ArquivoUpload,
    internacaoId: string,
    usuarioAuditor: string
  ): Promise<Transcricao> {
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, this.MOCK_DELAY));

    // Simular transcrição baseada no nome do arquivo e tipo
    const transcricaoMock = this.gerarTranscricaoMock(arquivo.file.name);

    const transcricao: Transcricao = {
      id: `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      internacaoId,
      dataAnotacao: new Date(),
      usuarioAuditor,
      anotacoes: transcricaoMock,
      audioUrl: arquivo.tipo === 'audio' ? URL.createObjectURL(arquivo.file) : undefined,
      arquivoUrl: arquivo.tipo === 'documento' ? URL.createObjectURL(arquivo.file) : undefined,
      arquivoNome: arquivo.file.name,
      status: 'concluido',
      createdAt: new Date()
    };

    return transcricao;
  }

  private static gerarTranscricaoMock(nomeArquivo: string): string {
    const transcricoesMock = [
      `Paciente apresentou quadro de febre alta e tosse persistente. Exame físico revelou taquicardia e pressão arterial elevada. Solicitado exames complementares: hemograma completo, radiografia de tórax e eletrocardiograma. Iniciado tratamento com antibiótico de amplo espectro e antitérmico.`,
      `Internação realizada para investigação de dor abdominal. Paciente relata dor há 3 dias, localizada em região epigástrica. Exame físico mostra sensibilidade à palpação. Solicitado ultrassonografia de abdome e exames laboratoriais. Mantido em observação.`,
      `Paciente com histórico de hipertensão arterial e diabetes mellitus tipo 2. Apresentou descompensação glicêmica com glicemia de 350 mg/dL. Iniciado protocolo de insulina e monitoramento glicêmico a cada 2 horas. Orientado sobre dieta e medicações.`,
      `Admissão para tratamento de pneumonia adquirida na comunidade. Exame físico: ausculta pulmonar com crepitações em base direita. Radiografia confirma infiltrado pulmonar. Iniciado antibioticoterapia empírica. Oxigenoterapia mantida conforme necessidade.`,
      `Paciente idoso com quadro de confusão mental e desidratação. Exame neurológico sem déficits focais. Exames laboratoriais mostram desequilíbrio hidroeletrolítico. Iniciada reposição volêmica e correção de eletrólitos. Avaliação geriátrica solicitada.`,
      `Internação para tratamento de insuficiência cardíaca descompensada. Paciente com dispneia aos esforços e edema de membros inferiores. Ecocardiograma mostra fração de ejeção reduzida. Otimizada medicação cardíaca e diuréticos.`,
      `Paciente com suspeita de apendicite aguda. Dor em fossa ilíaca direita com sinais de irritação peritoneal. Exames laboratoriais mostram leucocitose. Cirurgia geral acionada para avaliação cirúrgica.`,
      `Admissão para controle de crise asmática. Paciente com dispneia e sibilos à ausculta. Iniciado tratamento com broncodilatadores e corticoides. Oxigenoterapia mantida. Melhora progressiva do quadro respiratório.`,
      `Paciente com insuficiência renal aguda. Creatinina elevada e débito urinário reduzido. Avaliação nefrológica solicitada. Iniciado protocolo de hidratação e monitoramento da função renal.`,
      `Internação para investigação de anemia. Hemograma mostra hemoglobina de 7,5 g/dL. Solicitado estudo de ferro, vitamina B12 e ácido fólico. Transfusão sanguínea avaliada conforme necessidade.`
    ];

    // Selecionar transcrição baseada no hash do nome do arquivo
    const index = nomeArquivo.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % transcricoesMock.length;
    return transcricoesMock[index];
  }
}

