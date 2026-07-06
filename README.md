# Low Carb — Marketing Site (`lowcarb-site`)

Arabic RTL marketing site for Low Carb (Baghdad) — subscription meal prep.
One of three surfaces sharing a single Supabase backend:

| surface | repo | plan |
|---|---|---|
| Marketing site | **this repo** | live below |
| Order management system (staff) | `lowcarb-system` (next) | `PLANS/SYSTEM-PLAN.md` |
| Customer app (PWA) | `lowcarb-app` (after system) | `PLANS/APP-PLAN.md` |

Shared database schema + seeds: `PLANS/seed.sql` (single source of truth).
Claude Code subagents for the next two surfaces: `.claude/agents/`.

## Run

```bash
npm install
npm run dev        # local dev
npm run build      # production build → dist/
```

## Deploy (Cloudflare Pages, wrangler direct upload)

```bash
npm run build
npx wrangler pages deploy dist --project-name lowcarb-site
```

> Wrangler login must run in a plain terminal tab (not Claude Code's shell)
> — localhost callback times out otherwise.

## Before going live — replace these

1. **WhatsApp number** — `src/data/config.js` → `WHATSAPP` (currently
   `9647XXXXXXXXX`). Every CTA on the site builds from this one constant.
2. Confirm delivery zones wording in `src/components/Chrome.jsx` (Rules)
   once the client confirms coverage.

## Brand tokens

- Grape `#482465` · Lemon `#F2EA4F` · Paper `#FFFDF4` · Deep `#2E1543`
- Display: Baloo Bhaijaan 2 · Body: Tajawal · Latin accent: Fraunces italic
- Assets: `src/assets/brand/` (marks + lockups, incl. generated white mark),
  `src/assets/food/` (bowl photos cropped from the printed menus).

## Structure

```
src/
  data/config.js     WhatsApp number + wa() builder (single replace point)
  data/plans.js      4 subscription tiers + Friday rule
  data/menu.js       4-week menu (transcribed from the printed cards)
  components/        Hero, How, Pricing, MenuCard (signature), Chrome, ui
PLANS/               seed.sql · SYSTEM-PLAN.md · APP-PLAN.md
.claude/agents/      system-builder · app-builder (Claude Code subagents)
```

`npm run build:onefile` produces a single self-contained `dist/index.html`
(used for chat previews) — deploy the normal `npm run build` output.
