/**
 * Figma LIBRARY_PUBLISH webhook receiver
 *
 * Deploy to Vercel/Cloudflare and register as Figma webhook endpoint.
 * On receive, dispatches a GitHub repository_dispatch event to trigger sync workflows.
 *
 * Environment variables:
 *   GITHUB_TOKEN      - GitHub PAT with repo scope
 *   GITHUB_REPO       - owner/repo (e.g. myorg/DesignSystem_Demo)
 *   FIGMA_WEBHOOK_PASSCODE - Must match the passcode set in Figma webhook config
 */
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const passcode = req.headers.get('x-figma-passcode');
  const expectedPasscode = process.env.FIGMA_WEBHOOK_PASSCODE;

  if (expectedPasscode && passcode !== expectedPasscode) {
    return new Response('Unauthorized', { status: 401 });
  }

  let payload: { event_type?: string; file_key?: string };
  try {
    payload = await req.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const eventType = payload.event_type;

  if (eventType === 'PING') {
    return new Response(JSON.stringify({ ok: true, message: 'Webhook active' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (eventType === 'LIBRARY_PUBLISH') {
    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO;

    if (!githubToken || !githubRepo) {
      console.error('Missing GITHUB_TOKEN or GITHUB_REPO');
      return new Response('Server misconfigured', { status: 500 });
    }

    const dispatchRes = await fetch(
      `https://api.github.com/repos/${githubRepo}/dispatches`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: 'figma-library-publish',
          client_payload: {
            file_key: payload.file_key,
            timestamp: new Date().toISOString(),
          },
        }),
      },
    );

    if (!dispatchRes.ok) {
      const body = await dispatchRes.text();
      console.error('GitHub dispatch failed:', body);
      return new Response('GitHub dispatch failed', { status: 502 });
    }

    await fetch(
      `https://api.github.com/repos/${githubRepo}/dispatches`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: 'figma-token-change',
          client_payload: { file_key: payload.file_key },
        }),
      },
    );

    return new Response(JSON.stringify({ ok: true, dispatched: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, ignored: eventType }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
