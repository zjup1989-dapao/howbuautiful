create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '新用户',
  avatar_url text,
  bio text,
  created_at timestamptz not null default now()
);

create table if not exists public.uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  original_filename text,
  is_private boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.style_assets (
  id text primary key,
  type text not null check (type in ('hair', 'top', 'bottom', 'outerwear', 'shoes', 'accessory')),
  name text not null,
  tone text not null,
  color text not null,
  image_url text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.outfit_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  upload_id uuid references public.uploads(id) on delete set null,
  title text not null,
  ai_score integer not null check (ai_score between 0 and 100),
  recommendation jsonb not null,
  selected_assets jsonb not null,
  tuning jsonb not null default '{}',
  preview_image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  outfit_plan_id uuid references public.outfit_plans(id) on delete set null,
  title text not null,
  caption text not null,
  image_url text not null,
  tags text[] not null default '{}',
  ai_score integer not null check (ai_score between 0 and 100),
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  score numeric(2, 1) not null check (score >= 1 and score <= 5),
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create or replace view public.post_stats as
select
  p.*,
  coalesce(pr.display_name, '匿名用户') as author_name,
  coalesce(op.title, 'AI 搭配方案') as plan_title,
  coalesce(avg(r.score), 0) as average_user_score,
  count(distinct c.id) as comment_count
from public.posts p
left join public.profiles pr on pr.id = p.user_id
left join public.outfit_plans op on op.id = p.outfit_plan_id
left join public.ratings r on r.post_id = p.id
left join public.comments c on c.post_id = p.id
group by p.id, pr.display_name, op.title;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'New user'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.uploads enable row level security;
alter table public.style_assets enable row level security;
alter table public.outfit_plans enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.ratings enable row level security;

drop policy if exists "Public profiles are readable" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;
drop policy if exists "Users read own uploads" on public.uploads;
drop policy if exists "Users insert own uploads" on public.uploads;
drop policy if exists "Assets are public" on public.style_assets;
drop policy if exists "Users manage own outfit plans" on public.outfit_plans;
drop policy if exists "Posts are public readable" on public.posts;
drop policy if exists "Users create own posts" on public.posts;
drop policy if exists "Users update own posts" on public.posts;
drop policy if exists "Comments are public readable" on public.comments;
drop policy if exists "Users create own comments" on public.comments;
drop policy if exists "Ratings are public readable" on public.ratings;
drop policy if exists "Users upsert own ratings" on public.ratings;
drop policy if exists "Users update own ratings" on public.ratings;

create policy "Public profiles are readable" on public.profiles for select using (true);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users read own uploads" on public.uploads for select using (auth.uid() = user_id);
create policy "Users insert own uploads" on public.uploads for insert with check (auth.uid() = user_id);

create policy "Assets are public" on public.style_assets for select using (true);

create policy "Users manage own outfit plans" on public.outfit_plans for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Posts are public readable" on public.posts for select using (true);
create policy "Users create own posts" on public.posts for insert with check (auth.uid() = user_id);
create policy "Users update own posts" on public.posts for update using (auth.uid() = user_id);

create policy "Comments are public readable" on public.comments for select using (true);
create policy "Users create own comments" on public.comments for insert with check (auth.uid() = user_id);

create policy "Ratings are public readable" on public.ratings for select using (true);
create policy "Users upsert own ratings" on public.ratings for insert with check (auth.uid() = user_id);
create policy "Users update own ratings" on public.ratings for update using (auth.uid() = user_id);

drop policy if exists "Users upload own private photos" on storage.objects;
drop policy if exists "Users read own private photos" on storage.objects;
drop policy if exists "Users update own private photos" on storage.objects;
drop policy if exists "Public outfit images are readable" on storage.objects;
drop policy if exists "Users upload public outfit images" on storage.objects;

create policy "Users upload own private photos"
on storage.objects for insert
with check (
  bucket_id = 'private-uploads'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users read own private photos"
on storage.objects for select
using (
  bucket_id = 'private-uploads'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users update own private photos"
on storage.objects for update
using (
  bucket_id = 'private-uploads'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Public outfit images are readable"
on storage.objects for select
using (bucket_id = 'public-outfits');

create policy "Users upload public outfit images"
on storage.objects for insert
with check (
  bucket_id = 'public-outfits'
  and auth.uid()::text = (storage.foldername(name))[1]
);
