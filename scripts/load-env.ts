import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Load .env into process.env. Figma keys always use .env values when present. */
export function loadEnv(): void {
  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) return;

  const figmaKeys = new Set([
    'FIGMA_TOKEN',
    'FIGMA_FILE_KEY',
    'FIGMA_TEAM_ID',
    'WEBHOOK_ENDPOINT',
    'FIGMA_WEBHOOK_PASSCODE',
  ]);

  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (figmaKeys.has(key) || process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
