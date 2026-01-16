# Auditoria de Leito - PWA

Aplicativo PWA para registro de internações com transcrição de áudios e arquivos via API Beecloud.

## Funcionalidades

- ✅ Autenticação de usuários (médicos/auditores)
- ✅ Formulário de internação com dados do paciente
- ✅ Gravação de áudio diretamente no app
- ✅ Upload de arquivos (áudio e documentos)
- ✅ Integração com API Beecloud (mock) para transcrição
- ✅ Armazenamento local (IndexedDB) para funcionamento offline
- ✅ Visualização de pacientes e transcrições
- ✅ Busca e filtros
- ✅ 10 pacientes de teste pré-cadastrados

## Tecnologias

- React 18 + TypeScript
- Vite
- React Router
- Dexie.js (IndexedDB)
- React Hook Form
- Service Worker (PWA)

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Usuários de Teste

- Email: `joao.silva@hospital.com` / Senha: `123456`
- Email: `maria.santos@hospital.com` / Senha: `123456`
- Email: `carlos.oliveira@auditoria.com` / Senha: `123456`

## Estrutura

```
src/
├── components/       # Componentes React
├── services/         # Serviços (API, DB, Auth)
├── hooks/           # Custom hooks
├── types/           # TypeScript types
└── utils/           # Utilitários e dados mock
```

## PWA

O aplicativo é instalável como PWA no celular. Para instalar:

1. Acesse o app no navegador mobile
2. Selecione "Adicionar à tela inicial" ou "Instalar app"
3. O app será instalado e funcionará offline

### Ícones PWA

Os ícones PWA já foram gerados a partir da logo fornecida:
- ✅ `icon-192x192.png` (192x192 pixels)
- ✅ `icon-512x512.png` (512x512 pixels)
- ✅ `favicon.png` (32x32 pixels)

Para regenerar os ícones, execute:
```bash
npm run generate-icons
```

## Dados de Teste

O aplicativo vem com 10 pacientes pré-cadastrados:
1. Roberto Mendes - Hospital São Paulo
2. Fernanda Lima - Hospital Central
3. José Carlos Pereira - Hospital Universitário
4. Amanda Rodrigues - Hospital Regional
5. Marcos Antônio Souza - Hospital São Paulo
6. Juliana Ferreira - Hospital Central
7. Ricardo Nunes - Hospital Universitário
8. Patrícia Alves - Hospital Regional
9. Lucas Martins - Hospital São Paulo
10. Camila Barbosa - Hospital Central

Os dados são carregados automaticamente na primeira execução.

