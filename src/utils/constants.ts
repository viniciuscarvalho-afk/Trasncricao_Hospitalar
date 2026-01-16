export const API_BEECLOUD_BASE_URL = import.meta.env.VITE_BEECLOUD_API_URL || 'https://api.beecloud.com';

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const ACCEPTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/webm',
  'audio/ogg',
  'audio/m4a'
];

export const ACCEPTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user'
};

