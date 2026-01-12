import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../dist');
const publicDir = path.join(__dirname, '../public');

// Copy manifest.json to dist directory
const manifestSrc = path.join(publicDir, 'manifest.json');
const manifestDest = path.join(distDir, 'manifest.json');

if (fs.existsSync(manifestSrc)) {
  fs.copyFileSync(manifestSrc, manifestDest);
  console.log('✓ Copied manifest.json to dist directory');
} else {
  console.error('✗ manifest.json not found in public directory');
  process.exit(1);
}

// Copy icons to dist directory
const iconSizes = [16, 48, 128];
iconSizes.forEach(size => {
  const iconPath = path.join(distDir, `icon-${size}.png`);
  const publicIconPath = path.join(publicDir, `icon-${size}.png`);

  if (fs.existsSync(publicIconPath)) {
    fs.copyFileSync(publicIconPath, iconPath);
    console.log(`✅ Copied icon-${size}.png to dist directory`);
  } else {
    console.log(`❌ Warning: icon-${size}.png not found in public directory`);
  }
});

// Copy logo.png if it exists
const logoSrc = path.join(publicDir, 'logo.png');
const logoDest = path.join(distDir, 'logo.png');
if (fs.existsSync(logoSrc)) {
  fs.copyFileSync(logoSrc, logoDest);
  console.log('✅ Copied logo.png to dist directory');
}

// Copy icon.png if it exists
const iconSrc = path.join(publicDir, 'icon.png');
const iconDest = path.join(distDir, 'icon.png');
if (fs.existsSync(iconSrc)) {
  fs.copyFileSync(iconSrc, iconDest);
  console.log('✅ Copied icon.png to dist directory');
}

console.log('\n✅ Extension build prepared in ./dist directory');
console.log('  To load in Chrome:');
console.log('  1. Go to chrome://extensions/');
console.log('  2. Enable "Developer mode"');
console.log('  3. Click "Load unpacked"');
console.log('  4. Select the ./dist directory\n');
