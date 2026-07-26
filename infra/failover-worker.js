/**
 * lowcarb-iq.com — origin failover Worker  (NOT DEPLOYED — dormant by design)
 * ============================================================================
 *
 * What it does
 * ------------
 * Sits in front of the marketing site and serves it from Cloudflare Pages.
 * If Pages does not produce a usable response within 4 seconds — timeout,
 * network error, or 5xx — it transparently re-issues the same request against
 * the Netlify mirror and returns that instead. Path, query string and request
 * headers are preserved, so the visitor sees the same URL and the same page.
 *
 * Why it is not deployed
 * ----------------------
 * A Worker route needs a real zone. Today the site is reached at
 * *.pages.dev, which cannot carry a route. This file is the pre-written
 * answer to "the primary is down and we own a domain now" — it exists so that
 * day is a 10-minute job, not a design session.
 *
 * ---------------------------------------------------------------------------
 * ACTIVATION — the day lowcarb-iq.com is bought
 * ---------------------------------------------------------------------------
 *
 *  1. Add the zone to Cloudflare
 *       Dashboard → Add a site → lowcarb-iq.com → Free plan.
 *       Point the registrar's nameservers at the two Cloudflare gives you.
 *       Wait for the zone to report "Active" (minutes to a few hours).
 *
 *  2. Attach the apex to Pages (this alone gets the site live — do it first
 *     and confirm it works before adding any Worker)
 *       Pages → lowcarb-site → Custom domains → Set up a domain
 *         → lowcarb-iq.com, then repeat for www.lowcarb-iq.com.
 *       Verify:  curl -sI https://lowcarb-iq.com/ | head -1   → HTTP/2 200
 *
 *  3. Only once step 2 is green, deploy this Worker
 *       cd infra
 *       cp failover-worker.wrangler.jsonc.example wrangler.jsonc   # or write it:
 *         {
 *           "name": "lowcarb-failover",
 *           "main": "failover-worker.js",
 *           "compatibility_date": "2026-07-25",
 *           "vars": {
 *             "PRIMARY_ORIGIN": "https://lowcarb-site.pages.dev",
 *             "MIRROR_ORIGIN":  "https://lowcarb-site.netlify.app"
 *           }
 *         }
 *       npx wrangler deploy
 *
 *  4. Route the zone through it
 *       Workers & Pages → lowcarb-failover → Settings → Domains & Routes
 *         → Add route:  lowcarb-iq.com/*        (zone: lowcarb-iq.com)
 *         → Add route:  www.lowcarb-iq.com/*
 *       IMPORTANT: with a Worker route on the apex, the Pages custom domain from
 *       step 2 becomes the *fallback path only*. Keep it attached — this Worker
 *       fetches PRIMARY_ORIGIN by its pages.dev hostname, not through the route,
 *       so there is no recursion.
 *
 *  5. Prove both legs before walking away
 *       curl -sI https://lowcarb-iq.com/menu | grep -i x-lc-origin   → primary
 *       # force the mirror leg for one request:
 *       npx wrangler tail lowcarb-failover        # in a second terminal
 *       # temporarily set PRIMARY_ORIGIN to https://127.0.0.1 and redeploy,
 *       # curl again — expect x-lc-origin: mirror — then restore and redeploy.
 *
 *  6. Update RESILIENCE.md: mark the Worker ACTIVE and record the deploy date.
 *
 * ---------------------------------------------------------------------------
 * Deliberate limits
 * ---------------------------------------------------------------------------
 *  · Only GET and HEAD fail over. The site is static; anything else is
 *    unexpected, and silently replaying a mutating request against a second
 *    origin is worse than returning the error.
 *  · A 4xx from the primary is passed through untouched. "Not found" is a real
 *    answer, not an outage — failing over would hide genuine routing bugs and
 *    could serve a stale mirror page for a URL that was deliberately removed.
 *  · If the mirror also fails, the visitor gets the primary's error (or a 502
 *    when the primary never answered at all). The mirror's failure is never
 *    the one surfaced — the primary's is the more useful signal.
 */

const TIMEOUT_MS = 4000
const FAILOVER_METHODS = new Set(['GET', 'HEAD'])

/** Rewrite the incoming URL onto another origin, keeping path + query intact. */
function onOrigin(request, origin) {
  const incoming = new URL(request.url)
  const target = new URL(origin)
  target.pathname = incoming.pathname
  target.search = incoming.search
  return new Request(target, request)
}

/** Tag a response so `curl -I` says which origin answered. */
function tag(response, origin) {
  const tagged = new Response(response.body, response)
  tagged.headers.set('x-lc-origin', origin)
  return tagged
}

export default {
  async fetch(request, env, ctx) {
    const primary = env.PRIMARY_ORIGIN || 'https://lowcarb-site.pages.dev'
    const mirror = env.MIRROR_ORIGIN || 'https://lowcarb-site.netlify.app'

    if (!FAILOVER_METHODS.has(request.method)) {
      return fetch(onOrigin(request, primary))
    }

    let primaryFailure = null

    try {
      const response = await fetch(onOrigin(request, primary), {
        signal: AbortSignal.timeout(TIMEOUT_MS)
      })

      // 5xx means the origin is unhealthy; 4xx is a real answer — pass it on.
      if (response.status < 500) return tag(response, 'primary')

      primaryFailure = response
      ctx.waitUntil(
        Promise.resolve(console.warn(`failover: primary returned ${response.status} for ${request.url}`))
      )
    } catch (error) {
      // TimeoutError after TIMEOUT_MS, or any network-level failure.
      ctx.waitUntil(
        Promise.resolve(console.warn(`failover: primary ${error.name} for ${request.url}`))
      )
    }

    try {
      const fallback = await fetch(onOrigin(request, mirror), {
        signal: AbortSignal.timeout(TIMEOUT_MS)
      })
      if (fallback.status < 500) return tag(fallback, 'mirror')
    } catch (error) {
      console.error(`failover: mirror ${error.name} for ${request.url}`)
    }

    // Both origins are down. Surface the primary's response if we ever got one.
    if (primaryFailure) return tag(primaryFailure, 'primary')
    return new Response('الموقع غير متاح مؤقتاً — حاول بعد قليل.', {
      status: 502,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'x-lc-origin': 'none' }
    })
  }
}
