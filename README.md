# DesignSystem Demo

A Figma-connected design system with bidirectional token sync, agent-driven component sync, and Storybook documentation.

## Architecture

- **Figma** — source of truth for design tokens and component specs
- **packages/tokens** — W3C design tokens → CSS variables, Tailwind theme, TypeScript
- **packages/ui** — React + TypeScript + Tailwind components
- **apps/storybook** — component documentation and visual testing
- **figma/** — component manifest, setup guide, sync state
- **scripts/** — Figma sync automation
- **webhook-receiver/** — Figma LIBRARY_PUBLISH → GitHub dispatch

## Quick Start

```bash
# Install dependencies
pnpm install

# Build design tokens
pnpm build:tokens

# Start Storybook
pnpm storybook
# → http://localhost:6006
```

## Components

| Component | Variants | Storybook |
|-----------|----------|-----------|
| Button | primary, secondary, ghost, danger × sm/md/lg | Components/Button |
| Input | default, error, disabled × sm/md/lg | Components/Input |
| Badge | default, primary, success, warning, danger | Components/Badge |
| Card | elevated, outlined, filled | Components/Card |
| Typography | display, h1–h3, body, caption, label | Components/Typography |

## Figma Sync

### Pull tokens from Figma

```bash
FIGMA_TOKEN=xxx FIGMA_FILE_KEY=xxx pnpm sync:figma
pnpm build:tokens
```

### Push tokens to Figma (bidirectional)

```bash
FIGMA_TOKEN=xxx FIGMA_FILE_KEY=xxx pnpm push:figma
```

### Validate component manifest

```bash
pnpm sync:manifest
```

### Publish Code Connect to Figma Dev Mode

```bash
npx figma connect publish --token=$FIGMA_TOKEN
```

## Setup Checklist

Full automation guide: **[docs/CI_SETUP.md](docs/CI_SETUP.md)**

1. Create Figma file following [figma/SETUP.md](figma/SETUP.md)
2. Update `figma/component-manifest.json` with your file key and node IDs
3. Push to GitHub and set secrets: `FIGMA_TOKEN`, `FIGMA_FILE_KEY`
4. Enable GitHub Pages (Settings → Pages → GitHub Actions)
5. Deploy webhook receiver from [webhook-receiver/](webhook-receiver/)
6. Run `pnpm register:webhook` to connect Figma library publish → GitHub
7. Configure Figma MCP in Cursor: `https://mcp.figma.com/mcp`

## GitHub Actions

| Workflow | Trigger | Action |
|----------|---------|--------|
| `sync-tokens.yml` | Cron (15 min) + webhook | Pull Figma variables → PR |
| `sync-components.yml` | LIBRARY_PUBLISH webhook | Validate manifest → agent PR |
| `deploy-storybook.yml` | Push to main | Deploy Storybook to GitHub Pages |

## Project Structure

```
DesignSystem_Demo/
├── packages/
│   ├── tokens/          # W3C tokens + Style Dictionary
│   └── ui/              # React components + Code Connect
├── apps/
│   └── storybook/       # Storybook 8
├── scripts/             # Figma sync scripts
├── figma/               # Manifest + setup guide
├── webhook-receiver/    # Figma webhook → GitHub dispatch
└── .cursor/rules/       # Agent workflow rules
```

## License

Private — internal design system demo.
