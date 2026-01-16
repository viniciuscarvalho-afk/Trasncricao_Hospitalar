import { useState, useRef } from 'react';
import { ACCEPTED_AUDIO_TYPES, ACCEPTED_DOCUMENT_TYPES, MAX_FILE_SIZE } from '../../utils/constants';
import './FileUploader.css';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  acceptAudio?: boolean;
  acceptDocuments?: boolean;
}

export function FileUploader({ 
  onFileSelect, 
  disabled,
  acceptAudio = true,
  acceptDocuments = true
}: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptedTypes = () => {
    const types: string[] = [];
    if (acceptAudio) types.push(...ACCEPTED_AUDIO_TYPES);
    if (acceptDocuments) types.push(...ACCEPTED_DOCUMENT_TYPES);
    return types.join(',');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Validar tamanho
    if (file.size > MAX_FILE_SIZE) {
      setError(`Arquivo muito grande. Tamanho máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      return;
    }

    // Validar tipo
    const isAudio = ACCEPTED_AUDIO_TYPES.includes(file.type);
    const isDocument = ACCEPTED_DOCUMENT_TYPES.includes(file.type);
    
    if (!isAudio && !isDocument) {
      setError('Tipo de arquivo não suportado. Use áudio (mp3, wav) ou documentos (pdf, doc, docx)');
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="file-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptedTypes()}
        onChange={handleFileChange}
        disabled={disabled}
        className="file-input"
        id="file-upload"
      />
      <label htmlFor="file-upload" className={`file-label ${disabled ? 'disabled' : ''}`}>
        <span className="icon-upload">📁</span>
        {selectedFile ? 'Arquivo selecionado' : 'Selecionar arquivo'}
      </label>

      {selectedFile && (
        <div className="file-info">
          <div className="file-details">
            <span className="file-name">{selectedFile.name}</span>
            <span className="file-size">{formatFileSize(selectedFile.size)}</span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="btn-remove-file"
          >
            ✕
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

