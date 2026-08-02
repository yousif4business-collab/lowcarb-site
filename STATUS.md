# Low Carb — STATUS

> Snapshot of what's live, what's built, and what still needs a real-world input.
> Updated: 2026-08-02 (sprint RESILIENCE-1; DOMAIN-1 parked — see DEFERRED below).

## Live surfaces

| Surface | URL | Repo |
|---|---|---|
| Marketing site (primary) | https://lowcarb-site.pages.dev | `lowcarb-site` (this repo) |
| Marketing site (mirror) | https://lowcarb-site.netlify.app — **404, never published** | `lowcarb-site` (this repo) |
| Order management system (staff) | https://lowcarb-system.pages.dev | `lowcarb-system` |
| Customer app (PWA) | https://lowcarb-app.pages.dev | `lowcarb-app` |

**The canonical origin is still `https://lowcarb-site.pages.dev`.**
`lowcarb-iq.com` is bought and its zone is live on Cloudflare, but the zone
is empty and no hostname resolves — nothing in this repo points at it.

This repo deploys through `.github/workflows/deploy.yml` on push to `main`
(qa → build → 92 e2e → artifact check → Cloudflare → Netlify). The other two
repos still deploy by hand with
`npx wrangler pages deploy dist --project-name <repo>`.
Shared schema/seeds: `PLANS/seed.sql`. Deploy architecture, rollback runbook
and monitoring: `RESILIENCE.md`.

## BLOCKED — Netlify mirror (billing, not configuration)

Discovered 2026-08-02 while driving the first CI run. The Netlify site
`lowcarb-site` (`6e6c4708-2f3a-4a04-9116-ea371c920a31`) exists and is owned by
the right account, the auth token is valid and can read it — but **every deploy
is refused at the account level**:

```
POST /api/v1/sites/<id>/deploys → 403
{"error":"Account credit usage exceeded - new deploys are blocked until credits are added"}
```

`lowcarb-site.netlify.app` therefore returns **404 — it has never published a
deploy**. This was misdiagnosed twice as a secrets problem; it is not. Both
`NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` have since been re-set from
locally-verified values and are correct.

**Unblock:** add credits to the *Yousif* (free-tier) Netlify account, or free
up usage, then re-run the deploy workflow — nothing in this repo needs editing.

Until then every push to `main` goes red at the last step, with the quality
gate (qa → build → 92 e2e → artifact check) passing green above it. If that
noise becomes a problem, add `continue-on-error: true` to the *Deploy to
Netlify (mirror)* step — one line, and it must be removed again the day
credits are added, or a genuinely broken mirror will deploy silently.

This also blocks **(d)** below: the failover Worker must not go up while the
mirror it fails over to is a 404.

## DEFERRED — DOMAIN & CI-CLOUDFLARE

Parked 2026-08-02 by owner decision. Everything below is blocked on (a), and
the steps are in dependency order — **a future session executes them
top-to-bottom and should not re-litigate any of it.** Do not start at (c) or
later; each step assumes the ones above it are done and verified.

The single fact that shapes all of it: **the three `lowcarb-*` Pages projects
live on `yousifabdulkareem4business@gmail.com` (account
`1e548e685d0e40eb49b2b8683a02c3a3`), while the `lowcarb-iq.com` zone lives on
`yousif.hisoka09@gmail.com`.** Verified three times against the live API.
Cloudflare refuses a Custom Domain on a zone its Pages account does not own,
and a cross-account CNAME returns **Error 1014 · CNAME Cross-User Banned** —
so (b) is a prerequisite for (e), not an optimisation.

### (a) `CLOUDFLARE_API_TOKEN` — mint it, then everything else unlocks

Not set. Confirmed absent across all 25 repos on the GitHub account, with 0
environments and 0 orgs, so it is not hiding anywhere. Meanwhile CI skips the
Cloudflare deploy cleanly and publishes the Netlify mirror only; Cloudflare
production is published by hand (see *Manual Cloudflare deploy* below).

Mint at **dash.cloudflare.com → My Profile → API Tokens → Create Token →
Custom token**, signed in as **yousifabdulkareem4business@gmail.com**:

| | |
|---|---|
| Permission | **Account · Cloudflare Pages · Edit** |
| Permission | **Zone · DNS · Edit** (needed later for (c) and (e)) |
| Account Resources | Include · *Yousifabdulkareem4business@gmail.com's Account* |
| Zone Resources | Include · All zones from that account |

Then run `bash scripts/ops/set-cf-token.sh`. It prompts for the token with a
hidden read, prints which account the token belongs to, **refuses to set the
GitHub secret unless the token can actually see the `lowcarb-site` Pages
project**, and never echoes or writes the value. A token minted on hisoka will
be rejected by that check — which is the whole point, since
`CLOUDFLARE_ACCOUNT_ID` is already set to the 4business ID.

Nothing in `.github/workflows/deploy.yml` needs editing afterwards: the
Cloudflare step resumes by itself on the first push after the secret lands.

### (b) Move the `lowcarb-iq.com` zone hisoka → 4business — DECIDED, NOT EXECUTED

Chosen over the alternative (recreating three Pages projects on hisoka, which
would mean three redeploys and a change to `CLOUDFLARE_ACCOUNT_ID`). One
transfer, and every later step works as originally designed.

Cloudflare dashboard, signed in as hisoka: select `lowcarb-iq.com` → Overview
→ **Advanced Actions → Move to another account** → target the 4business
account, then accept the transfer from the 4business side. The nameservers
(`mira.ns.cloudflare.com` / `piotr.ns.cloudflare.com`) do not change and the
zone is empty, so there is nothing live to break. Confirm with
`npx wrangler whoami` that the zone is visible from 4business before (c).

### (c) DNS hygiene records — the zone is empty today

Verified 2026-08-02: zone delegated and active, **no A, MX or TXT records at
all**. Add these three first — they are independent of any hostname and stop
the domain being used to spoof mail while it sits unused:

| Type | Name | Value | Priority |
|---|---|---|---|
| TXT | `@` | `v=spf1 -all` | — |
| TXT | `_dmarc` | `v=DMARC1; p=reject; adkim=s; aspf=s` | — |
| MX | `@` | `.` (null MX) | 0 |

`p=reject` and `-all` are correct **because the domain sends no mail**. If a
real mailbox is ever added on this domain, both must be relaxed first or its
mail will be rejected. Verify:

```bash
dig +short lowcarb-iq.com TXT @1.1.1.1
dig +short _dmarc.lowcarb-iq.com TXT @1.1.1.1
dig +short lowcarb-iq.com MX @1.1.1.1
```

### (d) Failover Worker — only after the Netlify mirror serves real content

`infra/failover-worker.js` is written and reviewed but **not deployed**. Its
header carries the 6-step activation runbook. 4s timeout on the primary, then
transparent fallback to the mirror, path and query preserved, `x-lc-origin`
response header tagging which origin answered. Deploy on route
`lowcarb-iq.com/*` — which means it cannot go up before (b) and (c).

Gate: the mirror must be confirmed serving the real bundle, not a placeholder,
or the Worker will fail over to a broken page.

### (e) Custom domains — one hostname at a time, each verified before the next

Requires (a) and (b). For each: Cloudflare dashboard → Workers & Pages →
*project* → Custom domains → Set up a domain. With the zone on the same
account the CNAME is created automatically; SSL takes a few minutes.

| Hostname | Pages project |
|---|---|
| `lowcarb-iq.com` (apex) | `lowcarb-site` |
| `www.lowcarb-iq.com` | `lowcarb-site` |
| `app.lowcarb-iq.com` | `lowcarb-app` |
| `system.lowcarb-iq.com` | `lowcarb-system-asq` |

**Do not proceed to the next hostname until the current one both resolves and
serves valid TLS:**

```bash
h=lowcarb-iq.com
dig +short "$h"
curl -sI -o /dev/null -w 'http %{http_code}\n' --max-time 10 "https://$h"
```

`pages.dev` keeps working throughout — no redirect from it, by decision.

### (f) Replay `domain-1-hold` (`cdce518`) — ONLY after apex + www verify live

The DOMAIN-1 URL flip for **this repo only** is parked on branch
`domain-1-hold`. It moves canonical, `og:url`, `og:image`, JSON-LD `url`,
`public/sitemap.xml` and `public/robots.txt` to `https://lowcarb-iq.com`,
regenerates the QR to `https://app.lowcarb-iq.com`, and updates `APP_URL`.

`scripts/qa.mjs` derives the origin from the canonical `<link>` and asserts
og:url, og:image, JSON-LD and `robots.txt` all agree with it, so a partial
replay fails `npm run qa` rather than shipping a mixed-origin site. The QR
regeneration is deterministic — compare hashes before and after.

An earlier attempt at this shipped `lowcarb-iq.com` URLs to production while
no DNS existed and the links were dead in the live bundle. **The rule that came
out of that: DNS and SSL verified live on a hostname FIRST, then repoint code
at it, then verify the live bundle carries the new hostname.**

### (g) `app.` and `system.` URL flips — NOT this repo's work

When those two hostnames verify live, **report it to the owner and stop.**
`lowcarb-app` and `lowcarb-system` change their own constants from their own
sessions. Under the repo-isolation rule in `CLAUDE.md`, this session must not
read, write or run anything in those directories.

### Manual Cloudflare deploy, while (a) is outstanding

```bash
npm run qa && npm run build
env -u CLOUDFLARE_API_TOKEN -u CLOUDFLARE_ACCOUNT_ID \
  npx wrangler pages deploy dist --project-name lowcarb-site --branch main
```

`env -u` matters: a `CLOUDFLARE_API_TOKEN` in the shell belongs to a different
account and silently shadows the correct wrangler OAuth login.

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
- **SITE-QUALITY** — Playwright e2e suite (chromium+webkit, desktop+mobile), error boundaries, skeleton shimmer route fallback, Arabic-normalized dish search, print stylesheet, STATUS.md.
- **RESILIENCE-1** (this sprint) — GitHub Actions deploy pipeline (qa → build → 92 e2e → artifact check → Cloudflare → Netlify, fails closed), `public/_redirects` for Netlify SPA parity, Netlify mirror at `lowcarb-site.netlify.app`, `infra/failover-worker.js` (written, not deployed), `RESILIENCE.md` runbook, CI-only Playwright retries, `scripts/ops/set-cf-token.sh`, react-router advisory assessed as unreachable (`SECURITY.md`), repo-isolation rule written into `CLAUDE.md`.
- **DOMAIN-1** — parked, see *DEFERRED — DOMAIN & CI-CLOUDFLARE* above. The URL flip lives on branch `domain-1-hold` (`cdce518`) and must not be replayed until the hostnames verify live.
