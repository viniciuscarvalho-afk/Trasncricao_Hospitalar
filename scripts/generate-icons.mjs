import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const logoPath = join(rootDir, 'public', 'logo-original.png');
const outputDir = join(rootDir, 'public');

async function generateIcons() {
  try {
    if (!existsSync(logoPath)) {
      console.error('❌ Arquivo logo-original.png não encontrado em public/');
      console.log('Por favor, coloque a imagem Gemini_Generated_Image_6wtbbi6wtbbi6wtb.png em public/logo-original.png');
      process.exit(1);
    }

    console.log('🖼️  Gerando ícones PWA...');

    // Gerar ícone 192x192
    await sharp(logoPath)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFile(join(outputDir, 'icon-192x192.png'));

    console.log('✅ icon-192x192.png criado');

    // Gerar ícone 512x512
    await sharp(logoPath)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFile(join(outputDir, 'icon-512x512.png'));

    console.log('✅ icon-512x512.png criado');

    // Gerar favicon
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFile(join(outputDir, 'favicon.png'));

    console.log('✅ favicon.png criado');
    console.log('\n🎉 Todos os ícones foram gerados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao gerar ícones:', error);
    process.exit(1);
  }
}

generateIcons();

