import { loadEnv } from './load-env.ts';

loadEnv();

const token = (process.env.FIGMA_TOKEN ?? '').trim();
const key = process.env.FIGMA_FILE_KEY ?? 'iVt954yRRUlVSlWU4HJygU';

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
}

async function get(path: string) {
  const res = await fetch(`https://api.figma.com/v1${path}`, {
    headers: { 'X-Figma-Token': token },
  });
  return { status: res.status, data: await res.json() };
}

function walk(node: FigmaNode, out: Array<{ id: string; name: string; type: string }> = []) {
  if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
    out.push({ id: node.id, name: node.name, type: node.type });
  }
  for (const child of node.children ?? []) walk(child, out);
  return out;
}

async function main() {
  const [file, vars, nodeRes, componentsMeta] = await Promise.all([
    get(`/files/${key}?depth=4`),
    get(`/files/${key}/variables/local`),
    get(`/files/${key}/nodes?ids=4:73`),
    get(`/files/${key}/components`),
  ]);

  console.log('\n=== Figma File ===');
  console.log('status:', file.status);
  console.log('name:', file.data.name);
  console.log('lastModified:', file.data.lastModified);

  const components = walk(file.data.document as FigmaNode);
  console.log('\n=== Components / Component Sets ===');
  for (const c of components) {
    const meta = componentsMeta.data?.meta?.components?.[c.id];
    console.log(`- [${c.type}] ${c.name}`);
    console.log(`  nodeId: ${c.id}`);
    if (meta?.key) console.log(`  componentKey: ${meta.key}`);
  }

  const variables = Object.values(vars.data?.meta?.variables ?? {}) as Array<{ name: string }>;
  const collections = Object.values(vars.data?.meta?.variableCollections ?? {}) as Array<{
    name: string;
    modes: Array<{ name: string }>;
  }>;
  console.log('\n=== Variables ===');
  console.log('count:', variables.length, '| collections:', collections.length);
  for (const col of collections) {
    console.log(`- ${col.name} (modes: ${col.modes.map((m) => m.name).join(', ')})`);
  }
  if (variables.length) {
    console.log('sample:', variables.slice(0, 8).map((v) => v.name).join(', '));
  }

  const target = nodeRes.data?.nodes?.['4:73']?.document;
  console.log('\n=== Linked node (4:73) ===');
  console.log('status:', nodeRes.status);
  if (target) console.log(`type: ${target.type} | name: ${target.name} | id: ${target.id}`);
}

main().catch(console.error);
