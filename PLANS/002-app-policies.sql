-- ═══════════════════════════════════════════════════════════════════
-- LOW CARB — 002: customer-app policies (Phase A0/A1, app-first)
-- Run AFTER seed.sql in the Supabase SQL editor.
-- Self-registration: the app creates the auth user (alias email
-- {9647...}@lowcarb.app, email confirmation disabled), inserts its own
-- customers row, and places subscriptions as pending/source='app'.
-- Lesson from English Gate: Postgres needs BOTH a GRANT and a policy;
-- verify through PostgREST curl as real users — never the MCP/postgres
-- connection (BYPASSRLS).
-- ═══════════════════════════════════════════════════════════════════

-- ── helper: my customer id (SECURITY DEFINER = recursion-safe) ────────
create or replace function my_customer_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select id from customers where auth_uid = auth.uid()
$$;

grant execute on function my_customer_id() to authenticated;

-- ── customers ─────────────────────────────────────────────────────────
-- INSERT: only a row linked to the caller's auth account
create policy "app insert own customer" on customers
  for insert to authenticated
  with check (auth_uid = auth.uid());

-- SELECT: only own row
create policy "app select own customer" on customers
  for select to authenticated
  using (auth_uid = auth.uid());

-- UPDATE: only own row; writable columns limited by the column GRANT
create policy "app update own customer" on customers
  for update to authenticated
  using (auth_uid = auth.uid())
  with check (auth_uid = auth.uid());

grant select, insert on customers to authenticated;
-- column-level: app may edit name/zone/address only (not phone/auth_uid)
grant update (name, zone, address) on customers to authenticated;

-- ── subscriptions ─────────────────────────────────────────────────────
-- INSERT: own customer only, and forced pending/'app' until the order
-- system exists (team activates manually in Supabase Studio)
create policy "app insert own pending subscription" on subscriptions
  for insert to authenticated
  with check (
    customer_id = my_customer_id()
    and status = 'pending'
    and source = 'app'
  );

-- SELECT: own subscriptions only
create policy "app select own subscriptions" on subscriptions
  for select to authenticated
  using (customer_id = my_customer_id());

grant select, insert on subscriptions to authenticated;

-- NOTE: no policies for deliveries/payments/staff — still locked to
-- everyone but postgres. Verification (PostgREST curl, two throwaway
-- accounts):
--   1. anon GET /rest/v1/customers|subscriptions        → []/401
--   2. customer A GET own rows                          → 1 row / own subs
--   3. customer A GET with filter on customer B's id    → []
--   4. customer A INSERT subscription status!='pending' → 403
