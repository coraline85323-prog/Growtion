-- Run once in Supabase: SQL Editor → New query → paste → Run.
create table if not exists public.events (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);
alter table public.events enable row level security;
create policy "own events" on public.events for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
alter publication supabase_realtime add table public.events;
