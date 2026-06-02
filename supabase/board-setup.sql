-- ════════════════════════════════════════════════════════════════════════
--  "the board" — shared canvas backend for utku's space
--  Run this once in your Supabase project:  SQL Editor → paste → Run.
--  Then paste your project URL + anon key into src/components/Board.astro
--  (the SUPABASE_URL / SUPABASE_ANON_KEY constants near the top of <script>).
--
--  Model: ONE bounded image stored in a single row. Saving uses an atomic
--  compare-and-swap so simultaneous painters merge instead of clobbering.
--  Storage stays ~constant forever (it's one image, overwritten in place).
-- ════════════════════════════════════════════════════════════════════════

-- the single board row (the whole canvas as a base64 PNG)
create table if not exists public.board (
  id         int  primary key default 1,
  png        text,                          -- 'data:image/png;base64,...' of the canvas
  version    bigint not null default 0,
  updated_at timestamptz not null default now(),
  constraint board_singleton check (id = 1)
);
insert into public.board (id, version) values (1, 0) on conflict (id) do nothing;

-- owner secret used by the in-app "clear board" button — CHANGE THIS VALUE
create table if not exists public.board_config (k text primary key, v text);
insert into public.board_config (k, v)
  values ('clear_secret', 'change-me-to-something-only-you-know')
  on conflict (k) do nothing;

-- ── row level security ───────────────────────────────────────────────────
alter table public.board        enable row level security;
alter table public.board_config enable row level security;

-- anyone may READ the board image…
drop policy if exists "board read" on public.board;
create policy "board read" on public.board for select using (true);
grant select on public.board to anon;

-- …but there are NO write policies: all writes go through the functions below.
-- board_config has RLS enabled with no policies, so anon can't read the secret.

-- ── atomic save (compare-and-swap) ───────────────────────────────────────
-- writes only if the caller's version still matches. on conflict it returns
-- the current image so the client can re-apply its strokes and retry.
create or replace function public.board_save(p_png text, p_expected bigint)
returns table (ok boolean, version bigint, png text)
language plpgsql security definer set search_path = public as $$
declare cur bigint;
begin
  if length(coalesce(p_png, '')) > 6000000 then
    raise exception 'board image too large';
  end if;
  select b.version into cur from public.board b where b.id = 1 for update;
  if cur is distinct from p_expected then
    return query select false, b.version, b.png from public.board b where b.id = 1;
  else
    update public.board set png = p_png, version = board.version + 1, updated_at = now() where id = 1;
    return query select true, b.version, null::text from public.board b where b.id = 1;
  end if;
end; $$;
grant execute on function public.board_save(text, bigint) to anon;

-- ── owner clear (wipes the board only with the right secret) ─────────────
create or replace function public.board_clear(p_secret text)
returns table (ok boolean, version bigint)
language plpgsql security definer set search_path = public as $$
declare s text;
begin
  select v into s from public.board_config where k = 'clear_secret';
  if p_secret is distinct from s then
    return query select false, b.version from public.board b where b.id = 1;
  else
    update public.board set png = null, version = board.version + 1, updated_at = now() where id = 1;
    return query select true, b.version from public.board b where b.id = 1;
  end if;
end; $$;
grant execute on function public.board_clear(text) to anon;
