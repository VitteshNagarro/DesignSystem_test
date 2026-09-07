# Cursor Automation — Figma Library Publish Sync

Create this automation in Cursor (Automations editor) to complete the agent-driven component sync pipeline.

## Draft Configuration

| Field | Value |
|-------|-------|
| **Name** | Figma Design System Sync |
| **Description** | Sync Figma component changes to React code and Storybook when library is published |
| **Trigger** | GitHub repository dispatch — event type `figma-library-publish` |
| **Tools** | Figma MCP, GitHub, Shell |

## Agent Instructions

When triggered by a Figma library publish event:

1. Read `figma/component-manifest.json` for all component mappings
2. For each component in the manifest:
   a. Run Figma MCP `get_design_context` with `fileKey` and `figmaNodeId`
   b. Run Figma MCP `get_screenshot` for visual reference
   c. Compare Figma props/variants with current React component props
   d. If changed, update:
      - `codePath` (React component)
      - `storyPath` (Storybook stories with all variants)
      - `codeConnectPath` (Code Connect template)
   e. Update `figma/component-manifest.json` if props changed
3. Run `pnpm build:tokens && pnpm --filter @design-system/ui build`
4. Run `pnpm sync:manifest` to validate
5. Create a PR with title "feat: sync components from Figma library publish"
6. Include before/after notes in PR body listing which components changed

## Prerequisites

- Figma MCP connected in Cursor (`https://mcp.figma.com/mcp`, OAuth login)
- GitHub repo secrets: `FIGMA_TOKEN`, `FIGMA_FILE_KEY`
- Webhook receiver deployed and registered (see `webhook-receiver/README.md`)
- Replace `PLACEHOLDER_FILE_KEY` in manifest and Code Connect templates with real file key

## Fallback (no Enterprise webhooks)

Without Figma Org/Enterprise webhooks:
- Token sync runs every 15 minutes via cron in `.github/workflows/sync-tokens.yml`
- Manually trigger component sync: `gh workflow run sync-components.yml`
- Or ask Cursor agent: "Sync all components from Figma using the manifest"
