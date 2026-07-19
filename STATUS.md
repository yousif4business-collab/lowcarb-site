# Low Carb — STATUS

> Snapshot of what's live, what's built, and what still needs a real-world input.
> Updated: 2026-07-19 (sprint SITE-QUALITY).

## Live surfaces

| Surface | URL | Repo |
|---|---|---|
| Marketing site | https://lowcarb-site.pages.dev | `lowcarb-site` (this repo) |
| Order management system (staff) | https://lowcarb-system.pages.dev | `lowcarb-system` |
| Customer app (PWA) | https://lowcarb-app.pages.dev | `lowcarb-app` |

All three deploy via `npx wrangler pages deploy dist --project-name <repo>`.
Shared schema/seeds: `PLANS/seed.sql`.

## Feature inventory (site)

- **Routes** — `/` hero + trust strip + today's meals + how + stats + teasers · `/menu` · `/subscribe` · `/app` · `/gyms` · `/about` · `/faq` · friendly 404, all behind per-route error boundaries with a branded fallback.
- **Menu** — 4-week rotation card (week tabs pinned to `ROTATION_ANCHOR`), «حسب النوع» browse view, نوع filters + «الأقل كارب» badge, per-dish nutrition accordions, day totals, dish search with Arabic normalization (أإآ→ا · ة→ه · ى→ي · diacritics), «شارك منيو الأسبوع», «اطبع القائمة» + print stylesheet (logo letterhead, current week on one page).
- **Subscribe** — 4 plan cards, «ركّب اشتراكك» calculator (goal → suggested meals, weekly locks at 2 meals, Friday +15, zone + delivery-time fields) emitting a prefilled wa.me order, Qi Card payment explainer + rules + payment FAQ.
- **Chrome** — sticky nav with scroll progress + mobile burger, footer link columns, floating WhatsApp, mobile bottom CTA, «شاركنا رأيك» star modal → wa.me, welcome intro (once per session, skipped for webdriver/reduced-motion), route-chunk skeleton shimmer.
- **Perf/SEO/sec** — route code-splitting, preloaded fonts/mark, CSP + HSTS via `public/_headers` (inline-script hash — re-hash on change), sitemap, JSON-LD offers, og image, canonical.
- **Quality gates** — `npm run qa` (nutrition coverage, wa.me hygiene, router/sitemap integrity, build artifacts) · `npm run e2e` (Playwright: chromium + webkit × 1280/390 — routes, deep links, calculator pricing flows, menu interactions, search, intro, 404).

## Pending inputs (blockers to going fully live)

| What | Where | Status |
|---|---|---|
| Real WhatsApp number | `src/data/config.js` → `WHATSAPP` | placeholder `9647XXXXXXXXX` |
| Gym line WhatsApp (optional) | `src/data/config.js` → `WHATSAPP_GYM` | empty — falls back to main |
| Cloudflare Web Analytics token | `index.html` beacon | placeholder `CF_ANALYTICS_TOKEN` |
| Rotation anchor Saturday | `src/data/config.js` → `ROTATION_ANCHOR` | default `2026-07-04` — confirm with kitchen |
| Kitchen-confirmed nutrition sheet | `src/data/nutrition.js` → `NUTRITION_CONFIRMED` | estimates, flag off |
| Delivery zones wording | copy across site | awaiting client confirmation |

## Sprint history

- **S0** — brand site + 4-week menu + PLANS + Claude agents.
- **v3+v4** — today's-menu widget, goal calculator, per-dish nutrition, intro splash, stats, FAQ, mobile nav+CTA, marquee, webp perf, SEO.
- **v5 + Qi** — analytics hook, low-carb menu filters, share, sitemap, Qi payment badge.
- **v6** — zone + delivery-time in calculator order.
- **sec1** — CSP+HSTS, QA harness, a11y, SECURITY.md.
- **site (app/QR)** — app download section + QR.
- **site (browse)** — browse-by-type menu view, rate-us, dish-image plumbing.
- **site (brand facts)** — free delivery, chef, cloud kitchen, IG link, gym section.
- **site (intro v2)** — welcome intro v2 + 3D logo tilt.
- **perf-1** — CLS fix, intro paint, route splitting.
- **deps-1** — vite 7 upgrade, resolved all Dependabot advisories.
- **SITE-QUALITY** (this sprint) — Playwright e2e suite (chromium+webkit, desktop+mobile), error boundaries, skeleton shimmer route fallback, Arabic-normalized dish search, print stylesheet, STATUS.md.
