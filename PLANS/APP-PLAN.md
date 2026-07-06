# LOW CARB — CUSTOMER APP PLAN (`lowcarb-app`)

The customer-facing PWA. Ships AFTER the order system (S1–S2), because it
reads the same subscriptions/deliveries the team manages there.

## Stack
- React + Vite **PWA** + Tailwind, RTL Arabic only, brand tokens identical
  to the site. Capacitor stays the escape hatch if a store build is ever
  needed (same pattern locked for English Gate).
- Supabase shared project — schema is `PLANS/seed.sql`. No new tables
  except `pause_requests` (Phase A2).
- Hosting: Cloudflare Pages, project `lowcarb-app`.

## Auth decision (make once, in A1)
SMS OTP in Iraq is costly/unreliable, so default to **staff-provisioned
accounts**: when the team activates a subscription in the order system,
it creates the Supabase auth user (phone-as-email alias
`9647...@lowcarb.app` + generated password) and sends the customer their
login over WhatsApp. `customers.auth_uid` links the account. Revisit real
phone OTP only if a provider (e.g. Twilio Verify/WhatsApp OTP) is approved
later — the schema already supports it.

## Screens

### A1 — Read-only "my subscription" (first release)
- Login (phone + password from WhatsApp).
- **Home**: plan name, meals/day, start → end, days remaining ring,
  Friday included or not, status badge.
- **This week**: today's dishes highlighted, rest of the current
  `week_no` from `menu_days`.
- **Deliveries**: today's status (pending/prepared/out/delivered) — the
  "وين وجبتي؟" answer that kills half the WhatsApp messages.
- RLS: customer reads ONLY own rows —
  `customer_id = (select id from customers where auth_uid = auth.uid())`
  wrapped in a SECURITY DEFINER helper `my_customer_id()` (the exact
  recursion-safe pattern proven with `teacher_group_ids()` /
  `parent_group_ids()` on English Gate).
- ✅ Accept: curl with customer A's JWT cannot read customer B's
  subscription/deliveries (cross-customer isolation verified like the
  Student panel was).

### A2 — Actions
- Pause a day (creates `pause_requests` row → owner approves in the
  system → delivery marked `skipped`).
- Add Friday to an active subscription (request → owner confirms +15).
- Renew: one tap → prefilled WhatsApp renewal message.

### A3 — Payments (after Wayl onboarding via Rawafid business)
- Wayl checkout (`https://api.thewayl.com/api/v1/checkout`) for renewals:
  Cards / Super Qi / ZainCash / FIB / FastPay, IQD, Arabic.
- Until then: manual Qi Card / cash flow stays, recorded by staff in the
  order system.

### A4 — Polish
- PWA install prompt, offline shell for menu, push notifications
  ("وجبتك طلعت للتوصيل") via web push.

## Non-negotiables
- Arabic RTL only, no emojis in UI (SVG icons), Baloo Bhaijaan 2 headings.
- Never write to `deliveries` or `subscriptions` directly from the app —
  requests tables + staff approval only (kitchen stays in control).
- Same verification loop: build read-only → eyeball as customer →
  curl-verify isolation → commit.
