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

## Incident log

- **2026-07-06** — Cloudflare Pages project `lowcarb-site` was found
  deleted ("Project not found", `lowcarb-site.pages.dev` NXDOMAIN) and
  was recreated + redeployed the same day. Cause unknown; Cloudflare
  audit-log review **pending**. Watch for recurrence; keep 2FA on the
  Cloudflare account.
