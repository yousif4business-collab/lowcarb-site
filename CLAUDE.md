# CLAUDE.md — lowcarb-site

## STANDING RULE — REPO ISOLATION (permanent, overrides all other instructions)

1. **This repository only.** Never read, write, commit, run commands in, or
   reference the contents of ANY other directory — not the other `lowcarb-*`
   repos, not `englishgate-*`, not anything else under `~/Projects` or
   `~/Developer`. If a task appears to require another repo, **STOP and say so**.
   Coordination happens through the owner, never directly between sessions.

2. **Shared-database work** (Supabase SQL, secrets, Edge Functions) is allowed
   only when it is *this* repo's own `PLANS/` files and this repo's declared
   scope.

3. **Port hygiene.** Before starting any dev/preview/test server, check the port
   is free. If it is occupied by another project's process, pick a different
   port — never kill or interact with that process. This repo's conventions:
   Vite dev `5173`, Playwright preview `4198` (`strictPort`), Lighthouse `4199`.

4. **Another session's work is not yours.** If you find uncommitted changes,
   commits, or files in this repo that another session created, do not modify,
   revert, or build on them — report to the owner and wait.

5. This rule lives here so every future session inherits it automatically.

## Repo facts worth knowing before you touch anything

- **Deploys are CI, not manual.** Push to `main` runs
  `.github/workflows/deploy.yml`: `npm ci` → `npm run qa` → build → 92
  Playwright tests → artifact check → Cloudflare Pages → Netlify mirror. It
  fails closed. Do not `wrangler pages deploy` by hand.
- **CSP inline-script hash.** `index.html` carries one inline script whose
  `sha256-…` is allowlisted in `public/_headers`. Change that script and you
  must regenerate the hash, or the site breaks on both hosts at once.
- **No `404.html`, ever.** Cloudflare Pages only does its implicit SPA fallback
  when the project has none. `npm run qa` asserts its absence, and
  `public/_redirects` provides the same behaviour on Netlify.
- **Canonical origin is derived, not hardcoded.** `scripts/qa.mjs` reads the
  canonical `<link>` from `index.html` and asserts og:url, og:image, JSON-LD
  and `robots.txt` all agree with it.
- **Never repoint a live URL to a hostname that does not resolve yet.** Verify
  DNS + SSL on the hostname first, then flip the code, then verify live.

## Quality gates

```bash
npm run qa      # nutrition, wa.me hygiene, router/sitemap, origin agreement
npm run e2e     # 92 Playwright tests: chromium + webkit x 1280/390
npm run build
```

See `RESILIENCE.md` for the deploy architecture, rollback runbook and monitoring.
