import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public');
const logoPath = path.join(publicDir, 'logo.png');

// Check if logo.png exists
if (!fs.existsSync(logoPath)) {
  console.error('❌ logo.png not found in public directory');
  process.exit(1);
}

const sizes = [16, 48, 128];

async function generateIcons() {
  console.log('Generating icons from logo.png...\n');

  for (const size of sizes) {
    const outputPath = path.join(publicDir, `icon-${size}.png`);

    try {
      await sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated icon-${size}.png (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Failed to generate icon-${size}.png:`, error.message);
      process.exit(1);
    }
  }

  console.log('\n✅ All icons generated successfully!');
}

generateIcons();
