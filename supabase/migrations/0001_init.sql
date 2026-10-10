-- Upright Pictures Concepts: initial schema
--
-- Images are stored as jsonb "ImageAsset" objects so the app can treat
-- Cloudinary uploads and external URLs the same way:
--   { "src": text, "width": int, "height": int, "alt": text,
--     "publicId": text|null, "color": text|null }
--
-- Access model
--   * anon/authenticated visitors: read published / visible content only
--   * admin (row in public.admins): full read/write, checked by private.is_admin()
--   * inquiries: written only by the server with the secret key (bypasses RLS)

create schema if not exists private;

-- ---------------------------------------------------------------- helpers

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------- admins

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

grant usage on schema private to anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;

create policy "admins can see own row" on public.admins
  for select to authenticated
  using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------- site settings (singleton)

create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  business_name text not null,
  short_name text not null default '',
  tagline text not null default '',
  logo jsonb,
  email text not null default '',
  phones text[] not null default '{}',
  whatsapp text not null default '',
  location text not null default '',
  socials jsonb not null default '{}'::jsonb,
  footer_note text not null default '',
  show_packages boolean not null default true,
  show_prices boolean not null default true,
  show_testimonials boolean not null default true,
  seo jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- editable page sections

create table public.page_content (
  page text not null,
  section text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (page, section)
);

-- ---------------------------------------------------------------- portfolio

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category_id uuid references public.categories (id) on delete set null,
  summary text not null default '',
  story text,
  location text,
  shot_on date,
  cover jsonb not null,
  published boolean not null default false,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index albums_category_id_idx on public.albums (category_id);
create index albums_published_sort_idx on public.albums (published, sort_order);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums (id) on delete cascade,
  kind text not null check (kind in ('image', 'video')),
  image jsonb,
  video_url text,
  poster jsonb,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint media_kind_payload check (
    (kind = 'image' and image is not null) or (kind = 'video' and video_url is not null)
  )
);

create index media_album_sort_idx on public.media (album_id, sort_order);

-- ---------------------------------------------------------------- services & packages

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  body text,
  cover jsonb,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.packages (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services (id) on delete set null,
  name text not null,
  description text,
  price_label text not null default '',
  features text[] not null default '{}',
  highlighted boolean not null default false,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index packages_service_id_idx on public.packages (service_id);

-- ---------------------------------------------------------------- testimonials

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  context text not null default '',
  quote text not null,
  avatar jsonb,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- inquiries

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 80),
  email text check (char_length(email) <= 120),
  phone text not null check (char_length(phone) <= 20),
  service text check (char_length(service) <= 80),
  event_date date,
  location text check (char_length(location) <= 120),
  message text not null check (char_length(message) <= 2000),
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  client_hash text,
  created_at timestamptz not null default now()
);

create index inquiries_created_at_idx on public.inquiries (created_at desc);
create index inquiries_client_hash_created_idx on public.inquiries (client_hash, created_at desc);

-- ---------------------------------------------------------------- updated_at triggers

create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function private.set_updated_at();
create trigger page_content_updated_at before update on public.page_content
  for each row execute function private.set_updated_at();
create trigger albums_updated_at before update on public.albums
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------- row level security

alter table public.site_settings enable row level security;
alter table public.page_content enable row level security;
alter table public.categories enable row level security;
alter table public.albums enable row level security;
alter table public.media enable row level security;
alter table public.services enable row level security;
alter table public.packages enable row level security;
alter table public.testimonials enable row level security;
alter table public.inquiries enable row level security;

-- Public reads
create policy "public read settings" on public.site_settings
  for select to anon, authenticated using (true);

create policy "public read page content" on public.page_content
  for select to anon, authenticated using (true);

create policy "public read categories" on public.categories
  for select to anon, authenticated using (true);

create policy "read published albums" on public.albums
  for select to anon, authenticated
  using (published or (select private.is_admin()));

create policy "read media of published albums" on public.media
  for select to anon, authenticated
  using (
    exists (select 1 from public.albums a where a.id = album_id and a.published)
    or (select private.is_admin())
  );

create policy "read visible services" on public.services
  for select to anon, authenticated
  using (visible or (select private.is_admin()));

create policy "read visible packages when enabled" on public.packages
  for select to anon, authenticated
  using (
    (visible and coalesce((select s.show_packages from public.site_settings s where s.id = 1), false))
    or (select private.is_admin())
  );

create policy "read visible testimonials when enabled" on public.testimonials
  for select to anon, authenticated
  using (
    (visible and coalesce((select s.show_testimonials from public.site_settings s where s.id = 1), false))
    or (select private.is_admin())
  );

create policy "admin read inquiries" on public.inquiries
  for select to authenticated using ((select private.is_admin()));

-- Admin writes (one policy per command keeps intent explicit)
do $$
declare
  t text;
begin
  foreach t in array array[
    'site_settings', 'page_content', 'categories', 'albums', 'media',
    'services', 'packages', 'testimonials'
  ] loop
    execute format(
      'create policy "admin insert %1$s" on public.%1$I for insert to authenticated with check ((select private.is_admin()))', t);
    execute format(
      'create policy "admin update %1$s" on public.%1$I for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))', t);
    execute format(
      'create policy "admin delete %1$s" on public.%1$I for delete to authenticated using ((select private.is_admin()))', t);
  end loop;
end;
$$;

create policy "admin update inquiries" on public.inquiries
  for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

create policy "admin delete inquiries" on public.inquiries
  for delete to authenticated using ((select private.is_admin()));
