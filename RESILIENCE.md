# Low Carb — site resilience

> How the marketing site is deployed, mirrored, rolled back and watched.
> Sprint RESILIENCE-1. Updated: 2026-07-25.

**The headline:** every deploy publishes the same `dist/` to two independent
hosts on two independent providers. Losing either one — outage, billing lapse,
a project deleted by accident — costs a rollback, not a rebuild. The site's
whole state lives in git, so **restoring from total loss is one `git push`.**

---

## Architecture

```
                    push to main
                         │
              ┌──────────▼───────────┐
              │  GitHub Actions      │
              │  .github/workflows/  │
              │      deploy.yml      │
              │                      │
              │  npm ci              │
              │  npm run build       │
              │  npm run e2e ────────┼──► 92 tests, fails closed
              │  verify artifact     │
              └──────────┬───────────┘
                         │  same dist/, one build
             ┌───────────┴────────────┐
             ▼ (1st)                  ▼ (2nd, only if 1st passed)
   ┌────────────────────┐   ┌────────────────────────┐
   │ Cloudflare Pages   │   │ Netlify                │
   │ PRIMARY            │   │ MIRROR                 │
   │ lowcarb-site       │   │ lowcarb-site           │
   │ *.pages.dev        │   │ *.netlify.app          │
   └────────────────────┘   └────────────────────────┘
             ▲                          ▲
             └──────────┬───────────────┘
                        │
            infra/failover-worker.js
            (DORMANT — needs a real zone;
             activation steps in the file header)
```

| Surface | URL | Role |
|---|---|---|
| Primary | https://lowcarb-site.pages.dev | Cloudflare Pages, what visitors get today |
| Mirror | https://lowcarb-site.netlify.app | Netlify, warm standby, same bundle |
| Failover Worker | not deployed | `infra/failover-worker.js`, waiting on `lowcarb-iq.com` |

### Why Cloudflare stays primary

Cloudflare Pages is where the site already lives, where the analytics beacon
reports, and where the eventual apex domain will terminate. Netlify is a
mirror, not a peer: it is deployed second and only on a green Cloudflare
deploy, so the mirror can never be *ahead* of the primary. If the pipeline
dies midway, the worst case is a mirror one commit behind — stale, but serving
a bundle that passed the same 92 tests.

### Deploy gate

`deploy.yml` fails closed at every step. No deploy happens unless `npm ci`,
`npm run build`, all 92 Playwright tests (chromium + webkit × 1280 / 390) and
the artifact check pass. The artifact check specifically asserts `_headers` and
`_redirects` survived into `dist/` — silently losing either would strip the CSP
or break every deep link, and neither shows up as a test failure.

`concurrency: deploy-main` with `cancel-in-progress: false` serialises deploys,
so a slow older run can never overwrite a newer one, and no run is ever killed
between the Cloudflare and Netlify steps.

### Host parity notes

All three points below were verified empirically against a Netlify draft deploy
on 2026-07-25, not assumed from documentation.

- **`public/_headers`** — same syntax on both hosts (`/*` pattern, indented
  `Key: value`). Our file uses no host-specific features (no Cloudflare
  `:placeholders`, no Netlify `!` force), so all seven headers apply on both.
- **`public/_redirects`** — **required for parity.** Cloudflare Pages serves
  `index.html` with a `200` for unmatched paths when a project has no
  `404.html`; Netlify hard-404s them. `/* /index.html 200` makes both hosts
  behave the way react-router needs. Static files still win on both — verified
  that `/robots.txt` keeps serving `text/plain` and does not fall through.
- **Two headers legitimately differ. Do not "fix" them:**
  - `strict-transport-security` — Netlify appends `; preload` to ours, because
    `*.netlify.app` is on the HSTS preload list and Netlify enforces it for
    every subdomain. Strictly stronger than what we asked for; harmless.
  - Host noise — Cloudflare adds `access-control-allow-origin: *`, `cf-ray`,
    `report-to`, `nel`; Netlify adds `x-nf-request-id`. Platform-level, not ours.

  Parity checks should therefore compare the *values we set* on the six
  non-HSTS headers, and assert HSTS matches ignoring a trailing `; preload`.
- **CSP inline-script hash** — `index.html` carries one inline script. Change it
  and the `sha256-…` in `_headers` must be regenerated, or the site breaks on
  *both* hosts simultaneously. This is the one change that defeats the mirror.

---

## Rollback runbook

Rolling back is per-host and independent. **Roll back the primary first** —
that is what visitors hit — then match the mirror so the two do not drift.

### 1. Cloudflare Pages (primary) — ~30 seconds

**Dashboard:** Workers & Pages → **lowcarb-site** → **Deployments** → find the
last known-good deployment → **⋯** → **Rollback** → confirm.

**CLI:** Cloudflare has no rollback verb; redeploy the good tree instead:

```bash
git checkout <good-sha>
npm ci && npm run build
npx wrangler pages deploy dist --project-name=lowcarb-site --branch=main
git checkout main
```

### 2. Netlify (mirror) — ~30 seconds

**Dashboard:** app.netlify.com → **lowcarb-site** → **Deploys** → pick the
older deploy → **Publish deploy** → confirm.

**CLI:**

```bash
netlify api listSiteDeploys --data '{"site_id":"<SITE_ID>"}' \
  | jq -r '.[] | "\(.id)  \(.created_at)  \(.title)"' | head
netlify api restoreSiteDeploy --data '{"site_id":"<SITE_ID>","deploy_id":"<DEPLOY_ID>"}'
```

### 3. Fix forward

A dashboard rollback does **not** change `main`. The next push redeploys the
broken commit to both hosts. Always follow a rollback with either a revert
commit or a fix on `main`:

```bash
git revert <bad-sha> && git push origin main
```

### 4. Verify both

```bash
curl -sI https://lowcarb-site.pages.dev/ | grep -i etag
curl -sI https://lowcarb-site.netlify.app/ | grep -i etag
```

Different `etag`s after a rollback mean the hosts have drifted — redeploy the
lagging one before walking away.

### 5. Total loss (project deleted, account lost)

The site is a static build from a git tree; nothing lives only on a host.

```bash
# Cloudflare: recreate the project, then push
npx wrangler pages project create lowcarb-site --production-branch=main
git commit --allow-empty -m "chore: rebuild <host>" && git push origin main
```

Re-attach any custom domain and re-add the analytics token afterwards. The
secrets in GitHub are the only thing not reproducible from the repo — losing
them means minting new tokens, not losing the site.

---

## Monitoring

**UptimeRobot** (free tier), one monitor per host:

| Setting | Value |
|---|---|
| Type | HTTP(s) — keyword |
| Keyword | `Low Carb` (must exist — alerts if absent) |
| Interval | 5 minutes |
| Monitor 1 | https://lowcarb-site.pages.dev |
| Monitor 2 | https://lowcarb-site.netlify.app |
| Alerts | email |

Keyword rather than plain status-code monitoring: a host can return `200` with
a blank page or a JS-error shell, and only a content check catches that.

**Reading the alerts:**

| Alert | Meaning | Action |
|---|---|---|
| Primary down, mirror up | Cloudflare outage or bad deploy | Roll back primary; if the platform is down, this is the day to activate the failover Worker |
| Mirror down, primary up | Netlify issue — no visitor impact | Fix at leisure; re-run `deploy.yml` via workflow_dispatch |
| Both down | Almost certainly a bad bundle, not two outages | Roll back both; check the last green run |
| Keyword missing, 200 OK | Build shipped a broken shell | Roll back — the e2e gate missed something; add a test |

---

## Secrets

Four repository secrets drive `deploy.yml`. They exist only in GitHub Actions;
none are written to the repo.

| Secret | Source | Scope |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | dash.cloudflare.com/profile/api-tokens | Account → Cloudflare Pages → **Edit** only |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard sidebar / `wrangler whoami` | not secret, stored as one for tidiness |
| `NETLIFY_AUTH_TOKEN` | app.netlify.com/user/applications | personal access token |
| `NETLIFY_SITE_ID` | `netlify sites:list` | site identifier, not secret |

Rotation: mint the new token, `gh secret set <NAME>`, re-run `deploy.yml` via
**Actions → deploy → Run workflow**, then revoke the old token once green.

---

## What this sprint did not cover

- The failover Worker is written but **dormant** — it needs `lowcarb-iq.com`.
- No synthetic check on `/menu` or `/subscribe`; the monitors hit `/` only.
  Worth adding a third monitor on a deep link, since that is what `_redirects`
  protects and what would break most silently.
- `npm run qa` (nutrition coverage, wa.me hygiene, router/sitemap integrity)
  is **not** in CI — only `npm run e2e` is. Adding it is a two-line step.
- The `app` and `system` repos have no CI yet. This pattern is meant to be
  cloned to both in follow-up sprints.
