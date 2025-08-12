-- Complete schema for TPCO web app with roles, content tables, timestamps, and RLS

-- 1) Roles enum and user_roles table
create type if not exists public.app_role as enum ('admin','editor','user');

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer function to check roles (bypasses RLS safely)
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

-- Policies for user_roles
create policy if not exists "Users can view their own roles"
  on public.user_roles
  for select
  to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins can manage roles"
  on public.user_roles
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- 2) Common updated_at trigger
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 3) Content tables
-- News articles
create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image_url text,
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at timestamptz,
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_news_articles_published on public.news_articles(published);
create index if not exists idx_news_articles_published_at on public.news_articles(published_at);
alter table public.news_articles enable row level security;
create or replace trigger trg_news_articles_updated_at
  before update on public.news_articles
  for each row execute function public.update_updated_at_column();

-- Services
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  order_num int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_services_order on public.services(order_num);
create index if not exists idx_services_published on public.services(published);
alter table public.services enable row level security;
create or replace trigger trg_services_updated_at
  before update on public.services
  for each row execute function public.update_updated_at_column();

-- Technologies
create table if not exists public.technologies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  website_url text,
  logo_url text,
  featured boolean not null default false,
  order_num int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_technologies_featured on public.technologies(featured);
create index if not exists idx_technologies_order on public.technologies(order_num);
create index if not exists idx_technologies_published on public.technologies(published);
alter table public.technologies enable row level security;
create or replace trigger trg_technologies_updated_at
  before update on public.technologies
  for each row execute function public.update_updated_at_column();

-- Partners
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website_url text,
  logo_url text,
  description text,
  order_num int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_partners_order on public.partners(order_num);
create index if not exists idx_partners_published on public.partners(published);
alter table public.partners enable row level security;
create or replace trigger trg_partners_updated_at
  before update on public.partners
  for each row execute function public.update_updated_at_column();

-- Team members
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role_title text,
  bio text,
  avatar_url text,
  email text,
  linkedin_url text,
  order_num int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_team_members_order on public.team_members(order_num);
create index if not exists idx_team_members_published on public.team_members(published);
alter table public.team_members enable row level security;
create or replace trigger trg_team_members_updated_at
  before update on public.team_members
  for each row execute function public.update_updated_at_column();

-- Portfolio items
create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  image_url text,
  link_url text,
  category text,
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_portfolio_items_published on public.portfolio_items(published);
create index if not exists idx_portfolio_items_published_at on public.portfolio_items(published_at);
alter table public.portfolio_items enable row level security;
create or replace trigger trg_portfolio_items_updated_at
  before update on public.portfolio_items
  for each row execute function public.update_updated_at_column();

-- Resources
create type if not exists public.resource_type as enum ('article','guide','video','download','link');

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  type public.resource_type not null default 'article',
  url text,
  content text,
  file_url text,
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_resources_type on public.resources(type);
create index if not exists idx_resources_published on public.resources(published);
create index if not exists idx_resources_published_at on public.resources(published_at);
alter table public.resources enable row level security;
create or replace trigger trg_resources_updated_at
  before update on public.resources
  for each row execute function public.update_updated_at_column();

-- Impact stats
create table if not exists public.impact_stats (
  id uuid primary key default gen_random_uuid(),
  metric_key text not null,
  metric_name text not null,
  value numeric not null,
  trend numeric,
  period_start date,
  period_end date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (metric_key, period_start, period_end)
);
create index if not exists idx_impact_stats_metric_key on public.impact_stats(metric_key);
alter table public.impact_stats enable row level security;
create or replace trigger trg_impact_stats_updated_at
  before update on public.impact_stats
  for each row execute function public.update_updated_at_column();

-- Milestones (timeline)
create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  milestone_date date not null,
  icon text,
  order_num int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_milestones_date on public.milestones(milestone_date);
create index if not exists idx_milestones_order on public.milestones(order_num);
create index if not exists idx_milestones_published on public.milestones(published);
alter table public.milestones enable row level security;
create or replace trigger trg_milestones_updated_at
  before update on public.milestones
  for each row execute function public.update_updated_at_column();

-- Site settings (key/value JSON)
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;

-- 4) RLS Policies for content tables
-- Helper: readable by anyone if published, admins can read all; only admins can manage

-- news_articles
create policy if not exists "Public can view published news"
  on public.news_articles
  for select
  to anon, authenticated
  using (published = true or public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins manage news"
  on public.news_articles
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- services
create policy if not exists "Public can view published services"
  on public.services
  for select
  to anon, authenticated
  using (published = true or public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins manage services"
  on public.services
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- technologies
create policy if not exists "Public can view published technologies"
  on public.technologies
  for select
  to anon, authenticated
  using (published = true or public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins manage technologies"
  on public.technologies
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- partners
create policy if not exists "Public can view published partners"
  on public.partners
  for select
  to anon, authenticated
  using (published = true or public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins manage partners"
  on public.partners
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- team_members
create policy if not exists "Public can view published team members"
  on public.team_members
  for select
  to anon, authenticated
  using (published = true or public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins manage team members"
  on public.team_members
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- portfolio_items
create policy if not exists "Public can view published portfolio"
  on public.portfolio_items
  for select
  to anon, authenticated
  using (published = true or public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins manage portfolio"
  on public.portfolio_items
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- resources
create policy if not exists "Public can view published resources"
  on public.resources
  for select
  to anon, authenticated
  using (published = true or public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins manage resources"
  on public.resources
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- impact_stats (public view)
create policy if not exists "Public can view impact stats"
  on public.impact_stats
  for select
  to anon, authenticated
  using (true);

create policy if not exists "Admins manage impact stats"
  on public.impact_stats
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- milestones (public view)
create policy if not exists "Public can view published milestones"
  on public.milestones
  for select
  to anon, authenticated
  using (published = true or public.has_role(auth.uid(), 'admin'));

create policy if not exists "Admins manage milestones"
  on public.milestones
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- site_settings (public view)
create policy if not exists "Public can view site settings"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

create policy if not exists "Admins manage site settings"
  on public.site_settings
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
