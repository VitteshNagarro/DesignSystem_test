/**
 * Register Figma LIBRARY_PUBLISH webhook → GitHub repository_dispatch
 *
 * Required in .env:
 *   FIGMA_TOKEN
 *   FIGMA_TEAM_ID
 *   WEBHOOK_ENDPOINT   (e.g. https://your-app.vercel.app/api/figma-webhook)
 *   FIGMA_WEBHOOK_PASSCODE
 */
import { loadEnv } from './load-env.ts';

loadEnv();

const FIGMA_TOKEN = process.env.FIGMA_TOKEN?.trim();
const TEAM_ID = process.env.FIGMA_TEAM_ID?.trim();
const ENDPOINT = process.env.WEBHOOK_ENDPOINT?.trim();
const PASSCODE = process.env.FIGMA_WEBHOOK_PASSCODE?.trim();

async function listTeams() {
  const res = await fetch('https://api.figma.com/v1/teams', {
    headers: { 'X-Figma-Token': FIGMA_TOKEN! },
  });
  if (!res.ok) {
    console.log('Could not list teams:', res.status, await res.text());
    return;
  }
  const data = await res.json();
  console.log('\nAvailable teams:');
  for (const team of data.teams ?? []) {
    console.log(`  - ${team.name}: ${team.id}`);
  }
}

async function main() {
  if (!FIGMA_TOKEN) {
    console.error('Missing FIGMA_TOKEN in .env');
    process.exit(1);
  }

  if (!TEAM_ID) {
    console.error('Missing FIGMA_TEAM_ID in .env');
    await listTeams();
    process.exit(1);
  }

  if (!ENDPOINT || !PASSCODE) {
    console.error('Missing WEBHOOK_ENDPOINT or FIGMA_WEBHOOK_PASSCODE in .env');
    process.exit(1);
  }

  const res = await fetch('https://api.figma.com/v2/webhooks', {
    method: 'POST',
    headers: {
      'X-Figma-Token': FIGMA_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event_type: 'LIBRARY_PUBLISH',
      context: 'team',
      context_id: TEAM_ID,
      endpoint: ENDPOINT,
      passcode: PASSCODE,
      status: 'ACTIVE',
      description: 'DesignSystem_Test → GitHub Actions sync',
    }),
  });

  const body = await res.text();
  if (!res.ok) {
    console.error(`Webhook registration failed (${res.status}):`, body);
    process.exit(1);
  }

  console.log('✓ Figma webhook registered');
  console.log(JSON.stringify(JSON.parse(body), null, 2));
  console.log('\nOn library publish, GitHub will receive:');
  console.log('  - figma-library-publish → sync-components.yml');
  console.log('  - figma-token-change → (sync locally with pnpm sync:figma)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
