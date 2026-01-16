# Como criar os ícones PWA

Os ícones PWA são necessários para instalação completa do app no celular.

## ⚡ Opção Rápida: Usar ferramenta online (Recomendado)

1. Acesse: **https://www.pwabuilder.com/imageGenerator**
2. Faça upload de uma imagem (mínimo 512x512px) ou use o template SVG fornecido
3. Baixe os ícones gerados
4. Coloque na pasta `public/`:
   - `icon-192x192.png`
   - `icon-512x512.png`

## 🎨 Opção 2: Criar manualmente

Use qualquer editor de imagem (Photoshop, GIMP, Canva, Figma, etc.):

1. Crie uma imagem quadrada
2. Tamanho mínimo: 512x512 pixels
3. Fundo: #667eea (roxo) ou branco
4. Adicione um ícone/símbolo relacionado a auditoria/hospital (estetoscópio, prancheta, etc.)
5. Exporte como PNG
6. Redimensione para 192x192 e 512x512
7. Salve na pasta `public/` com os nomes:
   - `icon-192x192.png`
   - `icon-512x512.png`

## 📝 Opção 3: Usar o SVG template

1. Abra o arquivo `public/icon-template.svg` em um editor de imagem
2. Personalize se desejar
3. Exporte como PNG nos tamanhos:
   - 192x192 pixels → salve como `icon-192x192.png`
   - 512x512 pixels → salve como `icon-512x512.png`
4. Coloque ambos na pasta `public/`

## ✅ Verificação

Após criar os ícones, verifique se os arquivos existem:
- `public/icon-192x192.png` ✓
- `public/icon-512x512.png` ✓

O app funcionará mesmo sem os ícones, mas para instalação completa como PWA no celular, eles são necessários.

