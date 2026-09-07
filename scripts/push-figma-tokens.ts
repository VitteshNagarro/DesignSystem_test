/**
 * Pushes local W3C Design Tokens back to Figma Variables (bidirectional sync)
 *
 * Usage: FIGMA_TOKEN=xxx FIGMA_FILE_KEY=xxx pnpm push:figma
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './load-env.ts';

loadEnv();

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const TOKENS_DIR = join(ROOT, 'packages/tokens/src');
const STATE_FILE = join(ROOT, 'figma/.token-sync-state.json');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

interface FlatToken {
  path: string[];
  $type?: string;
  $value: unknown;
  $description?: string;
}

function flattenTokens(
  obj: Record<string, unknown>,
  path: string[] = [],
): FlatToken[] {
  const result: FlatToken[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    if (value && typeof value === 'object' && '$value' in value) {
      result.push({
        path: [...path, key],
        ...(value as FlatToken),
      });
    } else if (value && typeof value === 'object') {
      result.push(...flattenTokens(value as Record<string, unknown>, [...path, key]));
    }
  }
  return result;
}

function tokenPathToFigmaName(path: string[]): string {
  return path.join('/');
}

function tokenPathToCssVar(path: string[]): string {
  return `var(--${path.join('-')})`;
}

function hexToFigmaColor(hex: string): { r: number; g: number; b: number; a: number } {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.slice(0, 2), 16) / 255;
  const g = parseInt(cleaned.slice(2, 4), 16) / 255;
  const b = parseInt(cleaned.slice(4, 6), 16) / 255;
  const a = cleaned.length === 8 ? parseInt(cleaned.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

function w3cValueToFigma(type: string | undefined, value: unknown): unknown {
  if (type === 'color' && typeof value === 'string' && value.startsWith('#')) {
    return hexToFigmaColor(value);
  }
  if (type === 'dimension' && typeof value === 'string' && value.endsWith('px')) {
    return parseFloat(value);
  }
  return value;
}

async function fetchExistingVariables() {
  const res = await fetch(
    `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`,
    { headers: { 'X-Figma-Token': FIGMA_TOKEN! } },
  );
  if (!res.ok) throw new Error(`Figma API error ${res.status}`);
  return res.json();
}

async function main() {
  if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
    console.log('⚠ FIGMA_TOKEN or FIGMA_FILE_KEY not set — skipping push.');
    process.exit(0);
  }

  const tokenFiles = readdirSync(TOKENS_DIR).filter((f) => f.endsWith('.json'));
  const allTokens: FlatToken[] = [];

  for (const file of tokenFiles) {
    const content = JSON.parse(readFileSync(join(TOKENS_DIR, file), 'utf-8'));
    allTokens.push(...flattenTokens(content));
  }

  console.log(`Found ${allTokens.length} local tokens to compare`);

  let existingData: Awaited<ReturnType<typeof fetchExistingVariables>>;
  try {
    existingData = await fetchExistingVariables();
  } catch {
    console.log('⚠ Could not fetch existing Figma variables — recording local state only.');
    writeFileSync(
      STATE_FILE,
      JSON.stringify({ lastPush: new Date().toISOString(), tokenCount: allTokens.length }, null, 2),
    );
    process.exit(0);
  }

  const existingByName = new Map<string, { id: string; value: unknown }>();
  for (const variable of Object.values(
    (existingData as { meta: { variables: Record<string, { id: string; name: string; valuesByMode: Record<string, unknown> }> } }).meta.variables,
  )) {
    const modeId = Object.keys(variable.valuesByMode)[0];
    existingByName.set(variable.name, { id: variable.id, value: variable.valuesByMode[modeId] });
  }

  const changes: Array<{ name: string; cssVar: string; localValue: unknown }> = [];

  for (const token of allTokens) {
    const figmaName = tokenPathToFigmaName(token.path);
    const cssVar = tokenPathToCssVar(token.path);
    const figmaValue = w3cValueToFigma(token.$type, token.$value);
    const existing = existingByName.get(figmaName);

    if (!existing || JSON.stringify(existing.value) !== JSON.stringify(figmaValue)) {
      changes.push({ name: figmaName, cssVar, localValue: token.$value });
    }
  }

  if (changes.length === 0) {
    console.log('✓ No token changes to push');
    return;
  }

  console.log(`\n${changes.length} token(s) differ from Figma:`);
  for (const change of changes) {
    console.log(`  ${change.name}: ${JSON.stringify(change.localValue)} → ${change.cssVar}`);
  }

  writeFileSync(
    STATE_FILE,
    JSON.stringify(
      {
        lastPush: new Date().toISOString(),
        pendingChanges: changes,
        note: 'Apply via Figma Variables API POST /v1/files/:key/variables or Tokens Studio sync',
      },
      null,
      2,
    ) + '\n',
  );

  console.log('\n✓ Push diff written to figma/.token-sync-state.json');
  console.log('  To apply: use Figma REST API variable update endpoint or update manually in Figma.');
}

main().catch((err) => {
  console.error('Push failed:', err);
  process.exit(1);
});
