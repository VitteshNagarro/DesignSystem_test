# Deploy the webhook receiver

```bash
cd webhook-receiver
vercel deploy
```

Set environment variables in Vercel:
- `GITHUB_TOKEN` — PAT with `repo` scope
- `GITHUB_REPO` — e.g. `your-org/DesignSystem_Demo`
- `FIGMA_WEBHOOK_PASSCODE` — shared secret for webhook verification

Register in Figma (Org/Enterprise):

```bash
curl -X POST https://api.figma.com/v2/webhooks \
  -H "X-Figma-Token: $FIGMA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "LIBRARY_PUBLISH",
    "context": "team",
    "context_id": "YOUR_TEAM_ID",
    "endpoint": "https://your-app.vercel.app/api/figma-webhook",
    "passcode": "your-secret-passcode",
    "status": "ACTIVE"
  }'
```

## Cursor Automation (recommended)

Create a Cursor Automation with:

| Field | Value |
|-------|-------|
| Trigger | GitHub `repository_dispatch` → `figma-library-publish` |
| Tools | Figma MCP, GitHub, Shell |
| Instructions | Read `figma/component-manifest.json`, run Figma MCP workflow per changed component, update code + stories + Code Connect, open PR |

See `.cursor/rules/design-system.mdc` for the full agent workflow.

Without Enterprise webhooks, the 15-minute cron in `sync-tokens.yml` provides fallback token sync.
