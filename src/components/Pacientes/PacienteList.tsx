import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInternacoes } from '../../hooks/useInternacao';
import { useAuth } from '../../hooks/useAuth';
import { Internacao } from '../../types';
import { PacienteCard } from './PacienteCard';
import { MessageModal } from './MessageModal';
import './PacienteList.css';

export function PacienteList() {
  const navigate = useNavigate();
  const { internacoes, loading } = useInternacoes();
  const { user } = useAuth();
  const [selectedHospital, setSelectedHospital] = useState<string>('');
  const [selectedPaciente, setSelectedPaciente] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [modalInternacao, setModalInternacao] = useState<Internacao | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Extrair lista única de hospitais (todos disponíveis)
  const todosHospitais = useMemo(() => {
    const hospitaisUnicos = Array.from(new Set(internacoes.map(int => int.nomeHospital)));
    return hospitaisUnicos.sort();
  }, [internacoes]);

  // Filtrar hospitais baseado em hospitaisPermitidos do usuário
  const hospitais = useMemo(() => {
    if (!user?.hospitaisPermitidos || user.hospitaisPermitidos.length === 0) {
      // Se não tiver restrições, mostrar todos
      return todosHospitais;
    }
    // Filtrar apenas os hospitais permitidos
    return todosHospitais.filter(hospital => 
      user.hospitaisPermitidos!.includes(hospital)
    );
  }, [todosHospitais, user]);

  // Seleção automática quando há apenas 1 hospital permitido
  useEffect(() => {
    if (hospitais.length === 1 && !selectedHospital) {
      setSelectedHospital(hospitais[0]);
    }
  }, [hospitais, selectedHospital]);

  // Filtrar internações por hospital
  const internacoesPorHospital = useMemo(() => {
    if (!selectedHospital) return internacoes;
    return internacoes.filter(int => int.nomeHospital === selectedHospital);
  }, [internacoes, selectedHospital]);

  // Extrair lista de pacientes do hospital selecionado
  const pacientesDoHospital = useMemo(() => {
    if (!selectedHospital) return [];
    const pacientesUnicos = Array.from(
      new Set(internacoesPorHospital.map(int => int.nomePaciente))
    );
    return pacientesUnicos.sort();
  }, [internacoesPorHospital, selectedHospital]);

  // Filtrar pacientes baseado no texto digitado (busca em tempo real)
  const filteredPacientes = useMemo(() => {
    if (!searchQuery.trim()) return pacientesDoHospital;
    const query = searchQuery.toLowerCase();
    return pacientesDoHospital.filter(p => 
      p.toLowerCase().includes(query)
    );
  }, [pacientesDoHospital, searchQuery]);

  // Filtrar internações por paciente (se selecionado)
  const filteredInternacoes = useMemo(() => {
    if (!selectedPaciente) return internacoesPorHospital;
    return internacoesPorHospital.filter(int => int.nomePaciente === selectedPaciente);
  }, [internacoesPorHospital, selectedPaciente]);

  // Inicializar reconhecimento de voz
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setShowSuggestions(true);
        setIsListening(false);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, []);

  // Função para síntese de voz
  const speakPatientName = (nome: string) => {
    if (!speechEnabled) return;
    if ('speechSynthesis' in window) {
      // Cancelar qualquer fala anterior
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(nome);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.volume = 1;
      speechSynthesis.speak(utterance);
    }
  };

  // Funções para reconhecimento de voz
  const startVoiceRecognition = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Erro ao iniciar reconhecimento de voz:', error);
        setIsListening(false);
      }
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Erro ao parar reconhecimento de voz:', error);
        setIsListening(false);
      }
    }
  };

  const isVoiceRecognitionSupported = () => {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  };

  // Handler para seleção de paciente
  const handlePacienteSelect = (paciente: string) => {
    setSelectedPaciente(paciente);
    setSearchQuery(paciente);
    setShowSuggestions(false);
    setActiveIndex(-1);
    speakPatientName(paciente);
  };

  // Resetar filtro de paciente quando hospital mudar
  useEffect(() => {
    setSelectedPaciente('');
    setSearchQuery('');
    setShowSuggestions(false);
    setActiveIndex(-1);
    setModalInternacao(null);
    // Parar reconhecimento de voz se estiver ativo
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (error) {
        // Ignorar erros ao parar
      }
    }
  }, [selectedHospital, isListening]);

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Navegação por teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions && filteredPacientes.length > 0 && e.key !== 'Escape') {
      setShowSuggestions(true);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setShowSuggestions(true);
        setActiveIndex(prev => 
          prev < filteredPacientes.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < filteredPacientes.length) {
          handlePacienteSelect(filteredPacientes[activeIndex]);
        } else if (filteredPacientes.length === 1) {
          handlePacienteSelect(filteredPacientes[0]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  };

  const handleCardClick = (internacao: Internacao) => {
    setModalInternacao(internacao);
  };

  const handleModalClose = () => {
    setModalInternacao(null);
  };

  const handleModalSuccess = () => {
    // Recarregar dados se necessário
    // O hook useTranscricoes já atualiza automaticamente
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Carregando pacientes...</p>
      </div>
    );
  }

  return (
    <div className="paciente-list-container">
      <div className="paciente-list-header">
        <h2>Pacientes</h2>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="hospital-filter">Hospital</label>
          {hospitais.length === 1 ? (
            <div className="hospital-auto-selected">
              <span className="hospital-name">{hospitais[0]}</span>
              <span className="auto-badge">Selecionado automaticamente</span>
            </div>
          ) : (
            <select
              id="hospital-filter"
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              className="filter-select"
            >
              <option value="">Selecione um hospital</option>
              {hospitais.map((hospital) => (
                <option key={hospital} value={hospital}>
                  {hospital}
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedHospital && (
          <div className="filter-group">
            <label htmlFor="paciente-filter">Paciente</label>
            <div className="paciente-search-container">
              <input
                ref={searchInputRef}
                id="paciente-filter"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                  setActiveIndex(-1);
                }}
                onFocus={() => {
                  if (filteredPacientes.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onKeyDown={handleKeyDown}
                className="paciente-search-input"
                placeholder="Digite o nome do paciente ou selecione da lista"
                aria-label="Buscar paciente"
                aria-autocomplete="list"
                aria-expanded={showSuggestions}
                aria-controls="paciente-suggestions"
              />
              <div className="voice-controls">
                {isVoiceRecognitionSupported() && (
                  <button
                    type="button"
                    className={`btn-voice ${isListening ? 'listening' : ''}`}
                    onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                    title={isListening ? 'Parar gravação' : 'Falar nome do paciente'}
                    aria-label={isListening ? 'Parar gravação de voz' : 'Iniciar gravação de voz'}
                    disabled={!selectedHospital}
                  >
                    🎤
                  </button>
                )}
                <button
                  type="button"
                  className={`btn-voice-toggle ${speechEnabled ? 'active' : ''}`}
                  onClick={() => setSpeechEnabled(!speechEnabled)}
                  title={speechEnabled ? 'Desativar áudio' : 'Ativar áudio'}
                  aria-label={speechEnabled ? 'Desativar síntese de voz' : 'Ativar síntese de voz'}
                >
                  🔊 {speechEnabled ? 'Ativado' : 'Desativado'}
                </button>
              </div>
              {showSuggestions && filteredPacientes.length > 0 && (
                <div
                  ref={suggestionsRef}
                  id="paciente-suggestions"
                  className="suggestions-dropdown"
                  role="listbox"
                >
                  {filteredPacientes.map((paciente, index) => (
                    <div
                      key={paciente}
                      className={`suggestion-item ${index === activeIndex ? 'active' : ''}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      onClick={() => handlePacienteSelect(paciente)}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      {paciente}
                    </div>
                  ))}
                </div>
              )}
              {showSuggestions && searchQuery.trim() && filteredPacientes.length === 0 && (
                <div className="suggestions-dropdown">
                  <div className="suggestion-item no-results">
                    Nenhum paciente encontrado
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {(selectedHospital || selectedPaciente) && (
          <button
            onClick={() => {
              setSelectedHospital('');
              setSelectedPaciente('');
              setSearchQuery('');
              setShowSuggestions(false);
              setActiveIndex(-1);
            }}
            className="btn-clear-filters"
          >
            Limpar Filtros
          </button>
        )}
      </div>

      {!selectedHospital ? (
        <div className="empty-state">
          <p>Selecione um hospital para visualizar os pacientes</p>
        </div>
      ) : !selectedPaciente ? (
        <div className="empty-state">
          <p>Selecione um paciente para visualizar as informações</p>
        </div>
      ) : filteredInternacoes.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum paciente encontrado com os filtros selecionados</p>
        </div>
      ) : (
        <div className="paciente-grid">
          {filteredInternacoes.map((internacao) => (
            <PacienteCard
              key={internacao.id}
              internacao={internacao}
              onCardClick={() => handleCardClick(internacao)}
              onViewDetails={() => navigate(`/pacientes/${internacao.id}`)}
            />
          ))}
        </div>
      )}

      {modalInternacao && (
        <MessageModal
          internacao={modalInternacao}
          isOpen={!!modalInternacao}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
