import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const lockPath = resolve(__dirname, '..', 'package-lock.json');
const canonicalPath = resolve(__dirname, '..', '.canonical-versions.json');

if (!existsSync(canonicalPath)) {
  console.error('\n❌ .canonical-versions.json not found. Run: npm run fetch-versions\n');
  process.exit(1);
}

const lock = JSON.parse(readFileSync(lockPath, 'utf-8'));
const canonical = JSON.parse(readFileSync(canonicalPath, 'utf-8'));

const mismatches = [];

for (const [name, expectedVersion] of Object.entries(canonical)) {
  if (name === 'react/jsx-runtime') continue;

  const key = `node_modules/${name}`;
  const pkg = lock.packages?.[key];
  const installed = pkg?.version;

  if (!installed) {
    mismatches.push(`${name}: not found in package-lock.json`);
    continue;
  }

  if (installed !== expectedVersion) {
    mismatches.push(`${name}: expected ${expectedVersion}, got ${installed}`);
  }
}

if (mismatches.length > 0) {
  console.error('\n❌ Version mismatches with host:\n');
  mismatches.forEach((m) => console.error(`  - ${m}`));
  console.error('\nUpdate package.json to match and run npm install.\n');
  process.exit(1);
}

console.log('\n✅ All versions match host\n');
