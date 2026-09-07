/**
 * Fetches Figma Variables and writes W3C Design Tokens to packages/tokens/src/
 *
 * Usage: FIGMA_TOKEN=xxx FIGMA_FILE_KEY=xxx pnpm sync:figma
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
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

interface FigmaVariable {
  id: string;
  name: string;
  variableCollectionId: string;
  resolvedType: 'BOOLEAN' | 'FLOAT' | 'STRING' | 'COLOR';
  valuesByMode: Record<string, unknown>;
  description?: string;
  codeSyntax?: Record<string, string>;
}

interface FigmaVariablesResponse {
  meta: {
    variables: Record<string, FigmaVariable>;
    variableCollections: Record<
      string,
      { id: string; name: string; modes: Array<{ modeId: string; name: string }> }
    >;
  };
}

function figmaColorToHex(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'r' in value) {
    const { r, g, b, a = 1 } = value as { r: number; g: number; b: number; a?: number };
    const toHex = (n: number) =>
      Math.round(n * 255)
        .toString(16)
        .padStart(2, '0');
    if (a < 1) {
      return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
    }
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  return String(value);
}

function figmaNameToTokenPath(name: string): string[] {
  return name.split('/').map((s) => s.trim().toLowerCase().replace(/\s+/g, '-'));
}

function tokenPathToCssVar(path: string[]): string {
  return `var(--${path.join('-')})`;
}

function setNestedToken(obj: Record<string, unknown>, path: string[], token: unknown): void {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[path[path.length - 1]] = token;
}

function resolvedTypeToW3C(type: FigmaVariable['resolvedType']): string {
  switch (type) {
    case 'COLOR':
      return 'color';
    case 'FLOAT':
      return 'dimension';
    case 'STRING':
      return 'string';
    case 'BOOLEAN':
      return 'boolean';
    default:
      return 'string';
  }
}

function formatValue(type: FigmaVariable['resolvedType'], value: unknown): unknown {
  if (type === 'COLOR') return figmaColorToHex(value);
  if (type === 'FLOAT') {
    const num = Number(value);
    if (num <= 2 && num > 0 && !Number.isInteger(num)) return num;
    return `${num}px`;
  }
  return value;
}

async function fetchFigmaVariables(): Promise<FigmaVariablesResponse> {
  if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
    console.log('⚠ FIGMA_TOKEN or FIGMA_FILE_KEY not set — using local token files only.');
    process.exit(0);
  }

  const res = await fetch(
    `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`,
    { headers: { 'X-Figma-Token': FIGMA_TOKEN } },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API error ${res.status}: ${body}`);
  }

  return res.json() as Promise<FigmaVariablesResponse>;
}

function groupTokensByCollection(
  data: FigmaVariablesResponse,
): Record<string, Record<string, unknown>> {
  const collections: Record<string, Record<string, unknown>> = {};
  const { variables, variableCollections } = data.meta;

  const collectionById = new Map(
    Object.values(variableCollections).map((c) => [c.id, c.name.toLowerCase().replace(/\s+/g, '-')]),
  );

  for (const variable of Object.values(variables)) {
    const collectionName = collectionById.get(variable.variableCollectionId) ?? 'tokens';
    const collectionMeta = Object.values(variableCollections).find(
      (c) => c.id === variable.variableCollectionId,
    );
    const lightMode =
      collectionMeta?.modes.find((m) => /light/i.test(m.name))?.modeId ??
      collectionMeta?.modes[0]?.modeId;
    const modeId = lightMode ?? Object.keys(variable.valuesByMode)[0];
    const rawValue = variable.valuesByMode[modeId];

    if (!collections[collectionName]) {
      collections[collectionName] = {};
    }

    const path = figmaNameToTokenPath(variable.name);
    const w3cType = resolvedTypeToW3C(variable.resolvedType);

    const token: Record<string, unknown> = {
      $type: w3cType,
      $value: formatValue(variable.resolvedType, rawValue),
    };
    if (variable.description) token.$description = variable.description;

    setNestedToken(collections[collectionName], path, token);
  }

  return collections;
}

async function main() {
  mkdirSync(TOKENS_DIR, { recursive: true });
  mkdirSync(join(ROOT, 'figma'), { recursive: true });

  const data = await fetchFigmaVariables();
  const collections = groupTokensByCollection(data);

  const writtenFiles: string[] = [];

  for (const [name, tokens] of Object.entries(collections)) {
    const filename = `${name}.json`;
    const filepath = join(TOKENS_DIR, filename);
    writeFileSync(filepath, JSON.stringify(tokens, null, 2) + '\n');
    writtenFiles.push(filename);
    console.log(`✓ Wrote ${filepath}`);
  }

  const state = {
    lastSync: new Date().toISOString(),
    fileKey: FIGMA_FILE_KEY,
    variableCount: Object.keys(data.meta.variables).length,
    writtenFiles,
  };
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + '\n');
  console.log(`✓ Sync complete — ${state.variableCount} variables → ${writtenFiles.length} files`);
}

main().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
