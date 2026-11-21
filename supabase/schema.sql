-- RealtyCare.io website leads + admin access.
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste everything → Run.
-- Safe to run again.

-- 1) Leads table ----------------------------------------------------------------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  form_type   text not null,                 -- strategy_call | consultation | demo_call | calculator
  status      text not null default 'new'
              check (status in ('new', 'contacted', 'booked', 'won', 'lost', 'spam')),
  first_name  text,
  last_name   text,
  email       text,
  phone       text,
  notes       text,                          -- internal notes, edited in /admin
  data        jsonb not null default '{}'    -- every field the form sent (brokerage, state, budget, UTM tags…)
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);

create or replace function public.leads_touch() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists leads_touch on public.leads;
create trigger leads_touch before update on public.leads
  for each row execute function public.leads_touch();

-- 2) Who counts as an admin -----------------------------------------------------
-- Only Supabase Auth users whose email is in this table can see and manage leads.
create table if not exists public.admin_emails (email text primary key);
alter table public.admin_emails enable row level security;  -- no policies: invisible to the public

insert into public.admin_emails (email) values ('info@realtycare.io')
  on conflict do nothing;

create or replace function public.is_admin() returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_emails where email = lower(auth.jwt() ->> 'email'));
$$;

-- 3) Row level security ---------------------------------------------------------
alter table public.leads enable row level security;

-- The website's forms (using the publishable key) may ADD a lead, but only as status 'new' and with no notes.
drop policy if exists "website can insert leads" on public.leads;
create policy "website can insert leads" on public.leads
  for insert to anon, authenticated
  with check (status = 'new' and notes is null);

-- Admins can read, update and delete leads. Nobody else can read anything.
drop policy if exists "admins read leads" on public.leads;
create policy "admins read leads" on public.leads for select to authenticated using (public.is_admin());

drop policy if exists "admins update leads" on public.leads;
create policy "admins update leads" on public.leads for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete leads" on public.leads;
create policy "admins delete leads" on public.leads for delete to authenticated using (public.is_admin());
