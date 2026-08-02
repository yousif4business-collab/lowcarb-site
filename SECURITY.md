# SECURITY — lowcarb-site

Static marketing site on Cloudflare Pages. No server code, no secrets in
this repo; the only backend is the shared Supabase project (anon key is
public by design, protection = RLS).

## Threat model (static Pages site)

| threat | vector | mitigation |
|---|---|---|
| Framing / clickjacking | site embedded in a hostile iframe over the WhatsApp CTAs | `frame-ancestors 'none'` + `X-Frame-Options: DENY` |
| XSS | injected script exfiltrating visitors or rewriting the WhatsApp number | strict `script-src` CSP; React escaping; all user input → `wa()` builder with `encodeURIComponent` (enforced by `npm run qa`) |
| Supply chain | malicious npm package or CDN script | zero runtime deps beyond React; only whitelisted third-party origins in CSP; `package-lock.json` committed; `npm audit` + GitHub Dependabot alerts |
| Account compromise | Cloudflare/GitHub takeover → silent redeploy | 2FA on both accounts (owner action); deploys only from this repo; see incident note below |
| Downgrade / MITM | plaintext HTTP interception | HSTS + `upgrade-insecure-requests` |

## Response headers (`public/_headers`)

- **Content-Security-Policy** — only self + Google Fonts CSS (`style-src`), Google Fonts woff2 (`font-src`), Cloudflare beacon (`script-src`) and its RUM endpoint (`connect-src`); no objects, no framing, forms and `<base>` locked to self. The JSON-LD block is non-executing, so strict `script-src` is safe. `'unsafe-inline'` styles are required by React inline style attributes.
- **Strict-Transport-Security** — browsers pin HTTPS for a year, subdomains included.
- **X-Frame-Options: DENY** — legacy-browser twin of `frame-ancestors`.
- **X-Content-Type-Options: nosniff** — no MIME sniffing of responses.
- **Referrer-Policy: strict-origin-when-cross-origin** — outbound links (WhatsApp) see origin only.
- **Permissions-Policy** — camera/microphone/geolocation denied outright.
- **Cross-Origin-Opener-Policy: same-origin** — no window handle for cross-origin openers.

If a CSP directive breaks a real dependency: tune the directive, **never
delete the header**.

## QA harness

`npm run qa` (scripts/qa.mjs) — fails the run on: menu dishes missing
NUTRITION entries, raw state interpolated into `wa.me` URLs, missing
`dist/_headers`/CSP, missing SEO tags in `dist/index.html`. Warns (PENDING
table) on: leftover `console.log`, WHATSAPP placeholder, analytics-token
placeholder, unconfirmed ROTATION_ANCHOR, `NUTRITION_CONFIRMED=false`.

## RLS doctrine for the shared Supabase project

Postgres needs **BOTH a GRANT and a policy** — either alone is not
access. Verification is only real when it goes through PostgREST over
HTTP (`curl`) using actual `anon` / user JWTs; **never trust the MCP or
`postgres` connection** (BYPASSRLS makes everything readable). For
customer data: two throwaway accounts, prove A cannot read B, prove anon
gets nothing. Policy files live in `PLANS/*.sql`.

## Known advisories

### react-router 7.18.1 — GHSA-qwww-vcr4-c8h2 (high) — **accepted risk**

*"RSC Mode CSRF Bypass Allows Action Execution Before 400 Response."*
Affects `react-router` / `react-router-dom` **7.12.0 – 8.2.0**; we run 7.18.1.

**The vector is not reachable in this codebase.** Assessed 2026-07-27:

| requirement of the exploit | present here? |
|---|---|
| RSC (React Server Components) mode | no — no `@vitejs/plugin-rsc`, no react-server entry |
| Server actions to execute | no — no `action`/`loader`, no `useFetcher`, no `<Form>` |
| A data router | no — `BrowserRouter` only, all six `react-router-dom` imports are client-side |
| A server to run any of it | no — static files on a CDN, no origin, no SSR |

The exploit runs a server action before the framework returns 400. This site
has no server and defines no actions, so there is nothing to execute early.

**Decision:** stay on 7.x and upgrade to **8.3.0** when it ships. Do *not* take
npm's suggested fix — it proposes a **downgrade to 7.11.0** (`isSemVerMajor:
true`), which buys nothing against an unreachable vector while freezing us
below the line where later 7.x fixes land.

**Re-open this decision immediately if** the site ever adopts RSC, a data
router (`createBrowserRouter` + `RouterProvider`), route `action`s, SSR, or any
server runtime. At that point the vector becomes live and 8.3.0 is mandatory,
not optional.

### postcss ≤8.5.17 — GHSA-r28c-9q8g-f849 (high, CVSS 7.5) — **open, fixable**

Path traversal via `sourceMappingURL` auto-loading → arbitrary `.map` file
disclosure. Build-time dev dependency only, and it requires processing
attacker-controlled CSS, which our build never does — so exposure is low. But
unlike the react-router item **this one has a real fix available**, so it
should be patched rather than accepted.

## Incident log

- **2026-07-06** — Cloudflare Pages project `lowcarb-site` was found
  deleted ("Project not found", `lowcarb-site.pages.dev` NXDOMAIN) and
  was recreated + redeployed the same day. Cause unknown; Cloudflare
  audit-log review **pending**. Watch for recurrence; keep 2FA on the
  Cloudflare account.
