# Low Carb — Meal-Subscription Platform (Baghdad)

A three-part platform built for **Low Carb**, a low-carb meal-subscription kitchen in Baghdad: a public marketing site, a customer app, and a staff order-management system, all on one Supabase backend.

**This repository is the marketing site.** The customer app and the staff system live in private repositories; what they do is described below.

**Live:** [lowcarb-site.pages.dev](https://lowcarb-site.pages.dev)

## The platform

| Part | Who uses it | Repository |
|---|---|---|
| Marketing site | The public | this repo (public) |
| Customer app (PWA) | Subscribers | `lowcarb-app` (private) |
| Order-management system | Kitchen, office and delivery staff | `lowcarb-system` (private) |

### Marketing site (this repo)

- Arabic right-to-left site: home, menu, subscribe, app, gyms, about and FAQ pages, each behind its own error boundary.
- **4-week rotating menu** with week tabs, browse-by-type view, filters, a "lowest-carb" badge, per-dish nutrition, day totals, and dish search with Arabic text normalisation.
- **Subscription calculator**: pick a goal, meals per day, Friday add-on, zone and delivery time; the order is sent as a pre-filled WhatsApp message. Qi Card payment explainer and FAQ.
- Share and print the weekly menu (print stylesheet with letterhead).
- **Performance and security:** route code-splitting, preloaded fonts, Content-Security-Policy and HSTS headers, sitemap, JSON-LD, Open Graph tags.
- **Quality gates:** a QA script (nutrition coverage, WhatsApp-link hygiene, router and sitemap integrity) and 92 Playwright end-to-end tests across Chromium and WebKit at desktop and phone widths.
- **CI/CD:** GitHub Actions pipeline (QA → build → end-to-end tests → artifact check → Cloudflare Pages → Netlify mirror) that fails closed, plus a written failover Worker and rollback runbook (`RESILIENCE.md`).

### Customer app (private repo)

- Installable Arabic PWA for subscribers: sign-up and login with an Iraqi phone number, home with the current subscription, weekly menu, subscribe and account pages.
- Subscriptions started in the app arrive as *pending* for the team to activate.
- **Row-Level Security** so each customer reads only their own data, proven against the live database with 28 isolation checks run as a real signed-in user.
- 84 Playwright end-to-end tests on Chromium and WebKit at phone width.

### Order-management system (private repo)

- Staff panel used daily: today's board with deliveries by zone, **expiring subscriptions with one-tap WhatsApp reminders**, frozen subscriptions, a filterable subscriptions table, new-subscription entry with price calculation, approval of requests from the app and site.
- Finance: monthly revenue by plan, unpaid balances with payment reminders, CSV export.
- Owner settings: alert days, message templates with live preview, working days, delivery zones and drivers.
- Customer profiles, global search by name or number, printable delivery sheet, and a phone view for drivers showing only their own stops.
- **Automation:** Supabase Edge Functions on a schedule (pg_cron) for the nightly expiry scan, daily delivery generation, and a morning digest sent to the staff Telegram group; an AI assistant with a daily usage cap.
- **Security:** staff-only Row-Level Security, a delivery role that can see nothing but its own stops, and nightly verified database backups with 14-day retention.

### Stack

React · Vite · Tailwind CSS · Supabase (PostgreSQL, Auth, Row-Level Security, Edge Functions, pg_cron) · Cloudflare Pages · GitHub Actions · Playwright

---

## Developer notes

Arabic RTL marketing site for Low Carb (Baghdad) — subscription meal prep.
One of three surfaces sharing a single Supabase backend:

| surface | repo | plan |
|---|---|---|
| Marketing site | **this repo** | live below |
| Order management system (staff) | `lowcarb-system` (private) | `PLANS/SYSTEM-PLAN.md` |
| Customer app (PWA) | `lowcarb-app` (private) | `PLANS/APP-PLAN.md` |

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
2. Confirm delivery zones wording once the client confirms coverage.
3. **Cloudflare Web Analytics** — `index.html` has a beacon with the literal
   placeholder `CF_ANALYTICS_TOKEN`. Create the token at dash.cloudflare.com
   → Web Analytics → Add site → `lowcarb-site.pages.dev` and swap it in.
4. **Rotation anchor** — `src/data/config.js` → `ROTATION_ANCHOR`: confirm
   with the kitchen which Saturday starts "الأسبوع الأول".

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
