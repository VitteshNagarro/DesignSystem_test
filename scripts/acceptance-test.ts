/**
 * End-to-end acceptance checks for the design system pipeline.
 * Usage: pnpm exec tsx scripts/acceptance-test.ts
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const checks: Array<{ name: string; pass: boolean; detail?: string }> = [];

function check(name: string, pass: boolean, detail?: string) {
  checks.push({ name, pass, detail });
}

// Token build outputs
check('CSS variables generated', existsSync(join(ROOT, 'packages/tokens/dist/css/variables.css')));
check('Tailwind theme generated', existsSync(join(ROOT, 'packages/tokens/dist/tailwind/theme.ts')));
check('TS tokens generated', existsSync(join(ROOT, 'packages/tokens/dist/ts/tokens.ts')));

const css = readFileSync(join(ROOT, 'packages/tokens/dist/css/variables.css'), 'utf-8');
check('CSS contains primary token', css.includes('--color-bg-primary'));

// UI package
check('UI bundle built', existsSync(join(ROOT, 'packages/ui/dist/index.js')));

// Storybook
check('Storybook static built', existsSync(join(ROOT, 'apps/storybook/storybook-static/index.html')));

// Manifest
const manifest = JSON.parse(readFileSync(join(ROOT, 'figma/component-manifest.json'), 'utf-8'));
check('Manifest has 5 components', Object.keys(manifest.components).length === 5);

// Code Connect templates
for (const name of Object.keys(manifest.components)) {
  const comp = manifest.components[name];
  check(`${name} Code Connect template`, existsSync(join(ROOT, comp.codeConnectPath)));
}

// Workflows
check('Token sync workflow', existsSync(join(ROOT, '.github/workflows/sync-tokens.yml')));
check('Component sync workflow', existsSync(join(ROOT, '.github/workflows/sync-components.yml')));
check('Storybook deploy workflow', existsSync(join(ROOT, '.github/workflows/deploy-storybook.yml')));

// Agent rules
check('Agent rules configured', existsSync(join(ROOT, '.cursor/rules/design-system.mdc')));

console.log('\nDesign System Acceptance Tests\n');
let failed = 0;
for (const c of checks) {
  const icon = c.pass ? '✓' : '✗';
  console.log(`${icon} ${c.name}${c.detail ? ` — ${c.detail}` : ''}`);
  if (!c.pass) failed++;
}

console.log(`\n${checks.length - failed}/${checks.length} passed\n`);
process.exit(failed > 0 ? 1 : 0);
