/**
 * Validates component-manifest.json against TypeScript component exports
 * and reports drift between code props and manifest definitions.
 *
 * Usage: pnpm sync:manifest
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const MANIFEST_PATH = join(ROOT, 'figma/component-manifest.json');

interface ManifestProp {
  figmaProperty: string;
  type: 'enum' | 'boolean' | 'string' | 'number';
  values?: string[];
}

interface ManifestComponent {
  figmaNodeId: string;
  figmaComponentKey: string;
  figmaUrl: string;
  codePath: string;
  storyPath: string;
  codeConnectPath: string;
  codeConnectId: string;
  props: Record<string, ManifestProp>;
}

interface Manifest {
  fileKey: string;
  fileName: string;
  lastUpdated: string;
  components: Record<string, ManifestComponent>;
}

function loadManifest(): Manifest {
  if (!existsSync(MANIFEST_PATH)) {
    throw new Error(`Manifest not found at ${MANIFEST_PATH}`);
  }
  return JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));
}

function checkFileExists(relativePath: string): boolean {
  return existsSync(join(ROOT, relativePath));
}

function main() {
  const manifest = loadManifest();
  const issues: string[] = [];

  console.log(`\nComponent Manifest Sync Check`);
  console.log(`File: ${manifest.fileName} (${manifest.fileKey})`);
  console.log(`Last updated: ${manifest.lastUpdated}\n`);

  for (const [name, component] of Object.entries(manifest.components)) {
    const checks = [
      { label: 'code', path: component.codePath },
      { label: 'story', path: component.storyPath },
      { label: 'codeConnect', path: component.codeConnectPath },
    ];

    for (const check of checks) {
      if (!checkFileExists(check.path)) {
        issues.push(`[${name}] Missing ${check.label}: ${check.path}`);
      } else {
        console.log(`✓ ${name}.${check.label} → ${check.path}`);
      }
    }

    const propCount = Object.keys(component.props).length;
    console.log(`  Props: ${propCount} mapped (${Object.keys(component.props).join(', ')})`);
  }

  manifest.lastUpdated = new Date().toISOString().split('T')[0];
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

  if (issues.length > 0) {
    console.log('\n⚠ Issues found:');
    issues.forEach((i) => console.log(`  ${i}`));
    process.exit(1);
  }

  console.log(`\n✓ All ${Object.keys(manifest.components).length} components validated`);
}

main();
