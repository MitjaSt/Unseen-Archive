import { build } from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../dist');

async function buildServiceWorker() {
  console.log('Building service worker...');

  try {
    await build({
      entryPoints: [path.join(__dirname, '../app/service-workers/background-worker.ts')],
      bundle: true,
      outfile: path.join(distDir, 'service-worker.js'),
      format: 'iife',
      platform: 'browser',
      target: 'chrome100',
    });

    console.log('✅ Service worker built successfully');
  } catch (error) {
    console.error('❌ Failed to build service worker:', error);
    process.exit(1);
  }
}

buildServiceWorker();
