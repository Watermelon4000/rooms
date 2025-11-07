create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  created_at timestamptz default now()
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  title text not null default '我的房间',
  is_public boolean not null default true,
  grid_size int not null default 20,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_rooms_owner on public.rooms(owner);

create table if not exists public.item_catalog(
  id text primary key,
  label text not null,
  icon text not null,
  solid boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists public.room_tiles(
  room_id uuid not null references public.rooms(id) on delete cascade,
  x smallint not null,
  y smallint not null,
  item_id text not null references public.item_catalog(id),
  meta jsonb not null default '{}',
  primary key(room_id, x, y)
);

create or replace function enforce_one_room_per_user()
returns trigger language plpgsql as $$
begin
  if exists(select 1 from public.rooms where owner = new.owner) then
    raise exception '每个账号只能创建一个房间';
  end if;
  return new;
end; $$;

drop trigger if exists trg_one_room_per_user on public.rooms;
create trigger trg_one_room_per_user
before insert on public.rooms
for each row execute function enforce_one_room_per_user();

alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.room_tiles enable row level security;

drop policy if exists p_profiles_self_read_write on public.profiles;
create policy p_profiles_self_read_write on public.profiles for select using (true);
drop policy if exists p_profiles_self_update on public.profiles;
create policy p_profiles_self_update on public.profiles for update using (auth.uid() = id);

drop policy if exists p_rooms_public_read on public.rooms;
create policy p_rooms_public_read on public.rooms for select using (is_public = true or auth.uid() = owner);
drop policy if exists p_rooms_owner_write on public.rooms;
create policy p_rooms_owner_write on public.rooms for insert with check (auth.uid() = owner);
drop policy if exists p_rooms_owner_update on public.rooms;
create policy p_rooms_owner_update on public.rooms for update using (auth.uid() = owner);
drop policy if exists p_rooms_owner_delete on public.rooms;
create policy p_rooms_owner_delete on public.rooms for delete using (auth.uid() = owner);

drop policy if exists p_tiles_public_read on public.room_tiles;
create policy p_tiles_public_read on public.room_tiles
for select using (exists(select 1 from public.rooms r where r.id = room_id and (r.is_public = true or r.owner = auth.uid())));
drop policy if exists p_tiles_owner_write on public.room_tiles;
create policy p_tiles_owner_write on public.room_tiles
for all using (exists(select 1 from public.rooms r where r.id = room_id and r.owner = auth.uid()))
with check (exists(select 1 from public.rooms r where r.id = room_id and r.owner = auth.uid()));

insert into public.item_catalog(id,label,icon,solid) values
  ('fridge','冰箱','fridge',true),
  ('tv','电视','tv',true),
  ('bookshelf','书架','书架',true),
  ('plant','绿植','plant',true)
on conflict (id) do nothing;
