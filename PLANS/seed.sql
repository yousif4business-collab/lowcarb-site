-- ═══════════════════════════════════════════════════════════════════
-- LOW CARB — shared Supabase schema (single source of truth)
-- Run once in the Supabase SQL editor (or via migration) before
-- Phase S1 / A1. Website, order system, and customer app all read
-- from these tables.
-- ═══════════════════════════════════════════════════════════════════

-- ── plans ────────────────────────────────────────────────────────────
create table if not exists plans (
  id             text primary key,           -- 'weekly-2', 'monthly-1' ...
  name_ar        text not null,
  duration       text not null check (duration in ('weekly','monthly')),
  meals_per_day  int  not null check (meals_per_day between 1 and 3),
  base_price_iqd int  not null,               -- in thousands (100 = 100,000 IQD)
  sort           int  not null default 0
);

insert into plans (id, name_ar, duration, meals_per_day, base_price_iqd, sort) values
  ('weekly-2',  'اسبوعي — وجبتين يومياً',      'weekly',  2, 100, 1),
  ('monthly-1', 'شهري — وجبة يومياً',          'monthly', 1, 175, 2),
  ('monthly-2', 'شهري — وجبتين يومياً',        'monthly', 2, 325, 3),
  ('monthly-3', 'شهري — ثلاث وجبات يومياً',    'monthly', 3, 425, 4)
on conflict (id) do nothing;

-- ── menu (4-week rotation) ───────────────────────────────────────────
create table if not exists menu_days (
  id       bigint generated always as identity primary key,
  week_no  int  not null check (week_no between 1 and 4),
  day      text not null check (day in ('sat','sun','mon','tue','wed','thu','fri')),
  dishes   text[] not null,                   -- Arabic dish names
  unique (week_no, day)
);

insert into menu_days (week_no, day, dishes) values
  (1,'sat', array['بول دجاج','تاجينة لحم']),
  (1,'sun', array['ستيك رز بالراشي','دجاج بالكريمة والخضار']),
  (1,'mon', array['داوود باشا ورز','دجاج بالفطر مع برغل']),
  (1,'tue', array['برياني دجاج','كباب دجاج','معكرونة باللحم']),
  (1,'wed', array['ستيك دجاج مع سوتيه خضار ورز','بتر جكن']),
  (1,'thu', array['مجدرة ولحم','فوتوشيني ستيك دجاج']),
  (2,'sat', array['دجاج بالراشي','معكرونة بالراشي ودجاج']),
  (2,'sun', array['ماش بطاطا ودجاج','بول لحم']),
  (2,'mon', array['رز باكله وستيك دجاج','سندويش دجاج']),
  (2,'tue', array['رز بالحمص واللحمة','معكرونة دجاج']),
  (2,'wed', array['ستيك دجاج','بول دجاج']),
  (2,'thu', array['كرات دجاج بالخضار','بركر لحم']),
  (3,'sat', array['كاري دجاج','سندويش مسخن']),
  (3,'sun', array['كرات لحم بالراشي','برغل مع دجاج']),
  (3,'mon', array['برياني دجاج','بتر جكن']),
  (3,'tue', array['دجاج بالسبانغ','سباكتي باللحم والراشي']),
  (3,'wed', array['ستيك دجاج بالراشي','تاجينة جزر وبزاليا']),
  (3,'thu', array['رز باكله مع ستيك دجاج','سندويش دجاج']),
  (4,'sat', array['كباب دجاج وبرغل احمر','فوتوشيني وستيك دجاج']),
  (4,'sun', array['بول لحم','دجاج بالجبن مع رز']),
  (4,'mon', array['ماش بطاطا مع كوردون دجاج','رز عدس مع ستيك']),
  (4,'tue', array['دجاج بالكريمة','داوود باشا لحم']),
  (4,'wed', array['ستيك دجاج مع سوتيه خضار','سندويش دجاج']),
  (4,'thu', array['بول دجاج','بركر لحم'])
on conflict (week_no, day) do nothing;

-- ── customers ────────────────────────────────────────────────────────
create table if not exists customers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text not null unique,            -- 9647XXXXXXXXX
  zone       text,                            -- منطقة التوصيل
  address    text,
  notes      text,
  auth_uid   uuid unique,                     -- linked when the app account is created (Phase A1)
  created_at timestamptz not null default now()
);

-- ── subscriptions ────────────────────────────────────────────────────
create table if not exists subscriptions (
  id               uuid primary key default gen_random_uuid(),
  customer_id      uuid not null references customers(id),
  plan_id          text not null references plans(id),
  start_date       date not null,
  end_date         date not null,
  include_friday   boolean not null default false,
  friday_surcharge int not null default 15,   -- thousands IQD
  total_iqd        int not null,              -- thousands IQD
  status           text not null default 'pending'
                   check (status in ('pending','active','paused','expired','cancelled')),
  source           text not null default 'whatsapp'
                   check (source in ('whatsapp','website','app')),
  created_at       timestamptz not null default now()
);

-- ── deliveries (one row = one day's drop for one subscription) ───────
create table if not exists deliveries (
  id              uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references subscriptions(id),
  date            date not null,
  week_no         int  not null check (week_no between 1 and 4),
  day             text not null,
  meals_count     int  not null,
  status          text not null default 'pending'
                  check (status in ('pending','prepared','out','delivered','skipped')),
  notes           text,
  unique (subscription_id, date)
);
create index if not exists deliveries_date_idx on deliveries(date);

-- ── payments ─────────────────────────────────────────────────────────
create table if not exists payments (
  id              uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references subscriptions(id),
  amount_iqd      int  not null,              -- thousands IQD
  method          text not null default 'cash'
                  check (method in ('cash','qi','zaincash','wayl','other')),
  status          text not null default 'unpaid'
                  check (status in ('unpaid','paid','refunded')),
  paid_at         timestamptz,
  created_at      timestamptz not null default now()
);

-- ── staff roles (order-system access) ────────────────────────────────
create table if not exists staff (
  auth_uid   uuid primary key,
  name       text not null,
  role       text not null check (role in ('owner','kitchen','delivery')),
  created_at timestamptz not null default now()
);

-- ── RLS: enable now, policies land per-phase ─────────────────────────
-- Lesson from English Gate: Postgres needs BOTH a GRANT and a policy,
-- and real verification must go through PostgREST HTTP (curl) as
-- anon/authenticated — never the MCP connection (postgres/BYPASSRLS).
alter table plans         enable row level security;
alter table menu_days     enable row level security;
alter table customers     enable row level security;
alter table subscriptions enable row level security;
alter table deliveries    enable row level security;
alter table payments      enable row level security;
alter table staff         enable row level security;

-- public read for marketing surfaces (site shows plans + menu)
create policy "public read plans"     on plans     for select to anon, authenticated using (true);
create policy "public read menu"      on menu_days for select to anon, authenticated using (true);
grant select on plans, menu_days to anon, authenticated;

-- everything else: NO anon access. Staff/customer policies are written
-- in Phase S1 (staff) and Phase A1 (customers) with curl verification.
