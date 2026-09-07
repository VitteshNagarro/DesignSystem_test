# Figma Library Setup Guide

This guide walks through creating the Figma file that pairs with this design system.

## 1. Create the Figma File

1. In Figma, create a new file named **DesignSystem_Demo**
2. Copy the file key from the URL: `figma.com/design/{FILE_KEY}/DesignSystem_Demo`
3. Update `figma/component-manifest.json` → replace `PLACEHOLDER_FILE_KEY` with your file key
4. Set GitHub secret `FIGMA_FILE_KEY` to the same value

## 2. Variable Collections (Design Tokens)

Create these variable collections with the exact names and paths below.
Apply **Variable Code Syntax** (WEB platform) on every variable using the pattern shown.

### Collection: `color` (modes: light, dark)

| Variable Name | Light Value | Code Syntax |
|--------------|-------------|-------------|
| `color/bg/primary` | `#2563eb` | `var(--color-bg-primary)` |
| `color/bg/secondary` | `#f1f5f9` | `var(--color-bg-secondary)` |
| `color/bg/surface` | `#ffffff` | `var(--color-bg-surface)` |
| `color/bg/danger` | `#dc2626` | `var(--color-bg-danger)` |
| `color/text/default` | `#0f172a` | `var(--color-text-default)` |
| `color/text/muted` | `#64748b` | `var(--color-text-muted)` |
| `color/text/inverse` | `#ffffff` | `var(--color-text-inverse)` |
| `color/text/danger` | `#dc2626` | `var(--color-text-danger)` |
| `color/border/default` | `#e2e8f0` | `var(--color-border-default)` |
| `color/border/focus` | `#2563eb` | `var(--color-border-focus)` |
| `color/border/danger` | `#fca5a5` | `var(--color-border-danger)` |

### Collection: `spacing`

| Variable Name | Value | Code Syntax |
|--------------|-------|-------------|
| `spacing/xs` | `4` | `var(--spacing-xs)` |
| `spacing/sm` | `8` | `var(--spacing-sm)` |
| `spacing/md` | `12` | `var(--spacing-md)` |
| `spacing/lg` | `16` | `var(--spacing-lg)` |
| `spacing/xl` | `24` | `var(--spacing-xl)` |
| `spacing/2xl` | `32` | `var(--spacing-2xl)` |

### Collection: `radius`

| Variable Name | Value | Code Syntax |
|--------------|-------|-------------|
| `radius/sm` | `4` | `var(--radius-sm)` |
| `radius/md` | `8` | `var(--radius-md)` |
| `radius/lg` | `12` | `var(--radius-lg)` |
| `radius/full` | `9999` | `var(--radius-full)` |

### Collection: `typography`

| Variable Name | Value | Code Syntax |
|--------------|-------|-------------|
| `font/size/xs` | `12` | `var(--font-size-xs)` |
| `font/size/sm` | `14` | `var(--font-size-sm)` |
| `font/size/md` | `16` | `var(--font-size-md)` |
| `font/size/lg` | `18` | `var(--font-size-lg)` |
| `font/size/xl` | `24` | `var(--font-size-xl)` |
| `font/size/2xl` | `32` | `var(--font-size-2xl)` |

## 3. Component Sets

Create a **Component Set** for each component with properties matching the manifest in `figma/component-manifest.json`.

### Button
- **Variant** (enum): Primary, Secondary, Ghost, Danger
- **Size** (enum): Small, Medium, Large
- **Disabled** (boolean): true/false
- **Loading** (boolean): true/false
- **Label** (text): "Button"

### Input
- **Size** (enum): Small, Medium, Large
- **State** (enum): Default, Error, Disabled

### Badge
- **Variant** (enum): Default, Primary, Success, Warning, Danger
- **Size** (enum): Small, Medium

### Card
- **Variant** (enum): Elevated, Outlined, Filled

### Typography
- **Variant** (enum): Display, H1, H2, H3, Body, Body Small, Caption, Label
- **Weight** (enum): Regular, Medium, Semibold, Bold
- **Color** (enum): Default, Muted, Inverse, Danger

## 4. Publish as Library

1. Select all component sets → right-click → **Publish as library**
2. Note each component's node ID (right-click → Copy link → extract `node-id=X-Y`)
3. Update `figma/component-manifest.json` with real node IDs and component keys

## 5. Connect Code Connect

After setting up the repo:

```bash
npx figma connect init
npx figma connect publish --token=$FIGMA_TOKEN
```

## 6. Configure Webhook (Org/Enterprise)

Register a `LIBRARY_PUBLISH` webhook pointing to your deployed webhook receiver:

```bash
curl -X POST https://api.figma.com/v2/webhooks \
  -H "X-Figma-Token: $FIGMA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "LIBRARY_PUBLISH",
    "context": "team",
    "context_id": "YOUR_TEAM_ID",
    "endpoint": "https://your-webhook-receiver.vercel.app/api/figma-webhook",
    "passcode": "your-secret-passcode",
    "status": "ACTIVE"
  }'
```

Without Enterprise: use the 15-minute cron fallback in `.github/workflows/sync-tokens.yml`.
