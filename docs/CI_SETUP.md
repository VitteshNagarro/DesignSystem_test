# CI & Webhook Setup Guide

Automated pipeline: **Figma changes → GitHub PR → Storybook deploy**

## Overview

| Trigger | What happens |
|---------|----------------|
| Every 15 min (cron) | Pull Figma tokens → open PR if changed |
| Figma library publish (webhook) | Token sync + component sync signal |
| Merge to `main` | Deploy Storybook to GitHub Pages |
| Token file edit on `main` | Push tokens back to Figma |

---

## Step 1 — Push code to GitHub

```bash
cd DesignSystem_Demo
git init -b main
git add .
git commit -m "Initial design system with Figma sync"
```

Create a new repo on GitHub (e.g. `DesignSystem_Demo`), then:

```bash
git remote add origin https://github.com/YOUR_ORG/DesignSystem_Demo.git
git push -u origin main
```

---

## Step 2 — Add GitHub Secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value |
|--------|-------|
| `FIGMA_TOKEN` | Your Figma personal access token |
| `FIGMA_FILE_KEY` | `iVt954yRRUlVSlWU4HJygU` |

---

## Step 3 — Enable GitHub Pages

1. Repo → **Settings → Pages**
2. **Source:** GitHub Actions
3. After first push to `main`, the `deploy-storybook.yml` workflow publishes Storybook

Your public URL will be:
`https://YOUR_ORG.github.io/DesignSystem_Demo/`

---

## Step 4 — Deploy webhook receiver (Vercel)

```bash
npm i -g vercel
cd webhook-receiver
vercel login
vercel deploy --prod
```

Set Vercel environment variables:

| Variable | Value |
|----------|-------|
| `GITHUB_TOKEN` | GitHub PAT with `repo` scope |
| `GITHUB_REPO` | `YOUR_ORG/DesignSystem_Demo` |
| `FIGMA_WEBHOOK_PASSCODE` | A random secret string you choose |

Note the deployed URL, e.g. `https://design-system-webhook.vercel.app`

---

## Step 5 — Register Figma webhook

Add to `.env`:

```env
FIGMA_TEAM_ID=your_team_id
WEBHOOK_ENDPOINT=https://your-app.vercel.app/api/figma-webhook
FIGMA_WEBHOOK_PASSCODE=same_secret_as_vercel
```

Find your team ID:

```bash
pnpm register:webhook
# If FIGMA_TEAM_ID is missing, the script lists available teams
```

Register:

```bash
pnpm register:webhook
```

---

## Step 6 — Test the pipeline

### Token sync (manual)

```bash
# Change a color in Figma, then:
pnpm sync:figma && pnpm build:tokens
```

Or wait 15 minutes for the cron job to open a PR.

### Library publish (webhook)

1. Publish your Figma library
2. Check GitHub **Actions** tab — `Sync Design Tokens` and `Sync Components` should run
3. A PR appears if tokens changed

### Component sync (agent)

When `sync-components` runs, open the repo in Cursor and say:

> Sync Button from Figma using the manifest

---

## Workflows reference

| File | Trigger |
|------|---------|
| `.github/workflows/sync-tokens.yml` | Cron + `figma-token-change` dispatch |
| `.github/workflows/sync-components.yml` | `figma-library-publish` dispatch |
| `.github/workflows/push-tokens.yml` | Push token files to `main` |
| `.github/workflows/deploy-storybook.yml` | Push to `main` |

---

## Without webhook (fallback)

The **15-minute cron** in `sync-tokens.yml` still pulls token changes automatically.
Component sync remains manual via Cursor agent.
