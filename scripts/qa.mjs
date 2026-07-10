#!/usr/bin/env node
// QA harness for lowcarb-site — run with `npm run qa`.
// Hard checks exit 1; pending placeholders only warn.
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
let failures = 0

const fail = (msg) => {
  failures++
  console.error(`✗ FAIL  ${msg}`)
}
const pass = (msg) => console.log(`✓ ok    ${msg}`)

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) yield* walk(p)
    else if (/\.(js|jsx)$/.test(name)) yield p
  }
}

// ── 1. every dish in WEEKS has a NUTRITION entry ─────────────────────
const { WEEKS } = await import(join(ROOT, 'src/data/menu.js'))
const { NUTRITION } = await import(join(ROOT, 'src/data/nutrition.js'))
const dishes = [...new Set(WEEKS.flatMap((w) => w.days.flatMap((d) => d.dishes)))]
const missing = dishes.filter((d) => !NUTRITION[d])
if (missing.length) fail(`dishes without NUTRITION entry: ${missing.join('، ')}`)
else pass(`nutrition covers all ${dishes.length} dishes`)

// ── 2. WhatsApp URLs must go through wa() / encodeURIComponent ───────
// raw interpolation into a wa.me URL (not immediately encoded) fails
const rawWa = /wa\.me\/[^'"`\n]*\$\{(?!encodeURIComponent\()/
let waViolations = 0
for (const file of walk(join(ROOT, 'src'))) {
  const rel = file.slice(ROOT.length + 1)
  if (rel === 'src/data/config.js') continue // the wa() builder itself
  const src = readFileSync(file, 'utf8')
  for (const [i, line] of src.split('\n').entries()) {
    if (rawWa.test(line)) {
      fail(`raw state interpolated into wa.me URL — ${rel}:${i + 1}`)
      waViolations++
    }
  }
}
if (!waViolations) pass('all wa.me URLs built via wa()/encodeURIComponent')

// ── 2b. router integrity — every route defined, linked, and mapped ───
const ROUTES = ['/', '/menu', '/subscribe', '/app', '/gyms', '/about', '/faq']
const appSrc = readFileSync(join(ROOT, 'src/App.jsx'), 'utf8')
const chromeSrc = readFileSync(join(ROOT, 'src/components/Chrome.jsx'), 'utf8')
const sitemap = readFileSync(join(ROOT, 'public/sitemap.xml'), 'utf8')
let routeViolations = 0
for (const r of ROUTES) {
  if (!appSrc.includes(`path="${r}"`)) {
    fail(`route ${r} has no <Route> in App.jsx`)
    routeViolations++
  }
  if (!chromeSrc.includes(`'${r}'`)) {
    fail(`route ${r} missing from nav LINKS in Chrome.jsx`)
    routeViolations++
  }
  if (!sitemap.includes(`<loc>https://lowcarb-site.pages.dev${r === '/' ? '/' : r}</loc>`)) {
    fail(`route ${r} missing from public/sitemap.xml`)
    routeViolations++
  }
}
if (!appSrc.includes('path="*"')) {
  fail('catch-all 404 route missing from App.jsx')
  routeViolations++
}
if (existsSync(join(ROOT, 'public/404.html')) || existsSync(join(ROOT, 'dist/404.html'))) {
  fail('404.html exists — it would disable Cloudflare Pages SPA fallback')
  routeViolations++
}
if (!routeViolations) pass(`router integrity: ${ROUTES.length} routes + catch-all, nav + sitemap in sync`)

// ── 3. build artifacts ───────────────────────────────────────────────
console.log('… building')
execSync('npx vite build --logLevel error', { cwd: ROOT, stdio: 'inherit' })

const headersPath = join(ROOT, 'dist/_headers')
if (!existsSync(headersPath)) fail('dist/_headers missing')
else if (!readFileSync(headersPath, 'utf8').includes('Content-Security-Policy'))
  fail('dist/_headers has no Content-Security-Policy')
else pass('dist/_headers present with CSP')

const html = readFileSync(join(ROOT, 'dist/index.html'), 'utf8')
for (const [needle, label] of [
  ['rel="canonical"', 'canonical link'],
  ['og:image', 'og:image'],
  ['application/ld+json', 'JSON-LD'],
  ['apple-touch-icon', 'apple-touch-icon']
]) {
  if (!html.includes(needle)) fail(`dist/index.html missing ${label}`)
  else pass(`dist/index.html has ${label}`)
}

// ── 4. warnings: console.log + known pending placeholders ────────────
const pending = []
for (const file of walk(join(ROOT, 'src'))) {
  const rel = file.slice(ROOT.length + 1)
  const src = readFileSync(file, 'utf8')
  for (const [i, line] of src.split('\n').entries()) {
    if (/console\.log\(/.test(line)) pending.push([`${rel}:${i + 1}`, 'leftover console.log'])
  }
}
const config = readFileSync(join(ROOT, 'src/data/config.js'), 'utf8')
if (config.includes('9647XXXXXXXXX'))
  pending.push(['src/data/config.js', 'WHATSAPP is still the 9647XXXXXXXXX placeholder'])
if (config.includes("ROTATION_ANCHOR = '2026-07-04'"))
  pending.push(['src/data/config.js', 'ROTATION_ANCHOR default — confirm week-1 Saturday with kitchen'])
if (readFileSync(join(ROOT, 'index.html'), 'utf8').includes('CF_ANALYTICS_TOKEN'))
  pending.push(['index.html', 'CF_ANALYTICS_TOKEN placeholder — create token in CF Web Analytics'])
const { NUTRITION_CONFIRMED } = await import(join(ROOT, 'src/data/nutrition.js'))
if (!NUTRITION_CONFIRMED)
  pending.push(['src/data/nutrition.js', 'NUTRITION_CONFIRMED=false — values are estimates'])

if (pending.length) {
  console.log('\nPENDING (warnings, not failures)')
  console.log('─'.repeat(72))
  for (const [where, what] of pending) console.log(`  ${where.padEnd(28)} ${what}`)
  console.log('─'.repeat(72))
}

// ── verdict ──────────────────────────────────────────────────────────
if (failures) {
  console.error(`\nQA FAILED — ${failures} failure(s)`)
  process.exit(1)
}
console.log(`\nQA PASSED — ${pending.length} pending warning(s)`)
