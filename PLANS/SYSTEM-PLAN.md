# LOW CARB — ORDER MANAGEMENT SYSTEM PLAN (`lowcarb-system`)

The panel the Low Carb team uses daily. It replaces WhatsApp chaos with one
screen per job: what the kitchen cooks today, who receives what, who paid.
This is the highest-value surface — it ships BEFORE the customer app.

## Stack
- React + Vite + Tailwind (RTL Arabic only), same brand tokens as the site:
  grape `#482465`, lemon `#F2EA4F`, fonts Baloo Bhaijaan 2 / Tajawal.
- Supabase: Postgres + Auth (email/password for staff) + RLS.
- Schema: `PLANS/seed.sql` in this repo is the single source of truth.
- Hosting: Cloudflare Pages (wrangler direct upload), separate project
  `lowcarb-system`, ideally behind Cloudflare Access later.

## Roles
| role | sees | does |
|---|---|---|
| owner | everything | manage subscriptions, payments, menu, staff |
| kitchen | today's meal counts + dishes | mark `prepared` |
| delivery | today's delivery list by zone | mark `out` / `delivered` |

## Core mechanic — daily deliveries generation
A Supabase Edge Function (`generate-deliveries`, cron 02:00 Asia/Baghdad):
1. For every `active` subscription where today ∈ [start_date, end_date]:
   - skip Friday unless `include_friday`
   - compute `week_no` = ((days since start_date's Saturday) / 7) % 4 + 1
   - upsert a `deliveries` row (unique on subscription_id + date)
2. Idempotent — safe to re-run. Manual "generate today" button for owner.

## Phases (each = one Claude Code batch, verified before commit)

### S1 — Read + manual entry (first working day for the team)
- Staff login (email/password), `staff` table gate: no staff row → no access.
- **Today board**: deliveries for today grouped by zone → customer, plan,
  meals_count, today's dishes (join menu_days), status chips.
- **New subscription** form: pick/create customer (name, phone, zone,
  address), plan, start date, Friday toggle → auto total (base + 15 if
  Friday), creates subscription `active` + generates its delivery rows
  client-side for the remaining period (Edge Function replaces this in S2).
- RLS: staff-only policies on customers/subscriptions/deliveries/payments
  (`exists (select 1 from staff where auth_uid = auth.uid())`).
- ✅ Accept: curl as anon → 0 rows on all protected tables; curl as a
  staff JWT → rows visible; a real subscription entered from a WhatsApp
  order shows on the Today board.

### S2 — Status flow + payments + cron
- Delivery status pipeline buttons (pending → prepared → out → delivered),
  per-role permissions (kitchen only to `prepared`, delivery to `out`/`delivered`).
- Payments tab per subscription: record cash/Qi payment, unpaid list.
- Deploy `generate-deliveries` Edge Function + cron; remove client-side generation.
- **Kitchen prep card**: today's total meals per dish (sum meals across
  subscriptions) — the number the cooks actually need.
- ✅ Accept: role-restricted status writes verified by curl with each
  role's JWT; cron run produces correct rows for a Friday-included and a
  Friday-excluded subscription.

### S3 — Menu manager + reports
- Edit the 4-week `menu_days` (owner only) — the site reads the same rows
  later, so a menu change propagates everywhere.
- Reports: active subscriptions, expiring in ≤3 days (renewal WhatsApp
  shortcut `wa.me` link), revenue by month, meals/day chart.
- Pause/resume a subscription (skips generation while paused).

### S4 — Hardening
- Cloudflare Access on the domain, audit log table on status changes,
  CSV export, printable daily delivery sheet.

## Non-negotiables
- Arabic RTL only. No emojis in UI — SVG icons only. Emojis allowed inside
  WhatsApp message templates.
- Money stored in thousands IQD (int), displayed as `X ألف`.
- Verification pattern (proven 4× on English Gate): build read-only →
  eyeball as role → curl-verify isolation through PostgREST → check
  regressions → commit.
