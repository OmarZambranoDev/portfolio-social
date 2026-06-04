import { writeFileSync, existsSync, unlinkSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, '..', '.canonical-versions.json');

const HOST_VERSIONS_URL =
  'https://raw.githubusercontent.com/OmarZambranoDev/portfolio-landing-vite/main/versions.json?t=' + Date.now();

// Delete cached file so we always get the latest
if (existsSync(outputPath)) {
  unlinkSync(outputPath);
  console.log('🗑️  Removed cached .canonical-versions.json');
}

try {
  const response = await fetch(HOST_VERSIONS_URL);
  if (!response.ok) {
    console.error(`Failed to fetch versions.json: ${response.status}`);
    process.exit(1);
  }
  const versions = await response.json();
  writeFileSync(outputPath, JSON.stringify(versions, null, 2));
  console.log('✅ Fetched canonical versions from host');
} catch (error) {
  console.error('Failed to fetch versions.json from host:', error.message);
  process.exit(1);
}