
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Roles
create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "user_roles_select_own" on public.user_roles for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

-- Auto-create profile + grant admin to first user
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare user_count int;
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', new.email));

  select count(*) into user_count from auth.users;
  if user_count <= 1 then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Media items
create table public.media_items (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid references auth.users(id) on delete set null,
  section text not null default 'gallery', -- 'gallery' | 'hero' | 'events'
  media_type text not null default 'image', -- 'image' | 'video'
  storage_path text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.media_items enable row level security;

create policy "media_public_read" on public.media_items for select using (true);
create policy "media_admin_insert" on public.media_items for insert with check (public.has_role(auth.uid(), 'admin'));
create policy "media_admin_update" on public.media_items for update using (public.has_role(auth.uid(), 'admin'));
create policy "media_admin_delete" on public.media_items for delete using (public.has_role(auth.uid(), 'admin'));

-- Storage bucket
insert into storage.buckets (id, name, public) values ('media', 'media', true);

create policy "media_storage_public_read" on storage.objects for select using (bucket_id = 'media');
create policy "media_storage_admin_insert" on storage.objects for insert with check (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "media_storage_admin_update" on storage.objects for update using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "media_storage_admin_delete" on storage.objects for delete using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
