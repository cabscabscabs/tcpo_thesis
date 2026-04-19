-- Local PostgreSQL Schema
-- Generated from Supabase migrations

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- From 20250306000000_create_admin_tables.sql
-- Migration: Create admin tables for localStorage migration
-- This creates dedicated tables for admin-managed content

-- 1) Admin Homepage Content
CREATE TABLE public.admin_homepage_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title TEXT NOT NULL DEFAULT 'Accelerating Innovation Through Technology Transfer',
  hero_subtitle TEXT NOT NULL DEFAULT 'Bridging the gap between research and commercialization...',
  hero_image_url TEXT,
  patents_count INTEGER NOT NULL DEFAULT 24,
  partners_count INTEGER NOT NULL DEFAULT 50,
  startups_count INTEGER NOT NULL DEFAULT 15,
  technologies_count INTEGER NOT NULL DEFAULT 8,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Only one row should exist for homepage content
CREATE UNIQUE INDEX idx_admin_homepage_content_single ON public.admin_homepage_content ((id IS NOT NULL));

ALTER TABLE public.admin_homepage_content ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_admin_homepage_content_updated_at
  BEFORE UPDATE ON public.admin_homepage_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Admin Technologies (featured technologies managed by admin)
CREATE TABLE public.admin_technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  field TEXT,
  status TEXT NOT NULL DEFAULT 'Available',
  inventors TEXT,
  year TEXT,
  abstract TEXT,
  image_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT TRUE,
  order_num INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_technologies_featured ON public.admin_technologies(featured);
CREATE INDEX idx_admin_technologies_order ON public.admin_technologies(order_num);
CREATE INDEX idx_admin_technologies_published ON public.admin_technologies(published);

ALTER TABLE public.admin_technologies ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_admin_technologies_updated_at
  BEFORE UPDATE ON public.admin_technologies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Admin News (news articles managed by admin)
CREATE TABLE public.admin_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  author TEXT,
  status TEXT NOT NULL DEFAULT 'Draft',
  date DATE,
  cover_image_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_news_status ON public.admin_news(status);
CREATE INDEX idx_admin_news_date ON public.admin_news(date);
CREATE INDEX idx_admin_news_published ON public.admin_news(published);

ALTER TABLE public.admin_news ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_admin_news_updated_at
  BEFORE UPDATE ON public.admin_news
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) Admin Patents (patent portfolio items)
CREATE TABLE public.admin_patents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  patent_number TEXT,
  inventors TEXT,
  field TEXT,
  abstract TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  year TEXT,
  licensing_info TEXT,
  applications TEXT[] NOT NULL DEFAULT '{}',
  contact TEXT,
  technology_fields TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_patents_status ON public.admin_patents(status);
CREATE INDEX idx_admin_patents_field ON public.admin_patents(field);
CREATE INDEX idx_admin_patents_published ON public.admin_patents(published);

ALTER TABLE public.admin_patents ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_admin_patents_updated_at
  BEFORE UPDATE ON public.admin_patents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Admin Events
CREATE TABLE public.admin_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'workshop',
  date DATE,
  time TEXT,
  location TEXT,
  capacity INTEGER,
  description TEXT,
  image_url TEXT,
  registration_open BOOLEAN NOT NULL DEFAULT TRUE,
  attendees_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Upcoming',
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_events_date ON public.admin_events(date);
CREATE INDEX idx_admin_events_status ON public.admin_events(status);
CREATE INDEX idx_admin_events_published ON public.admin_events(published);

ALTER TABLE public.admin_events ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_admin_events_updated_at
  BEFORE UPDATE ON public.admin_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6) Admin Service Requests
CREATE TABLE public.admin_service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  service_type TEXT,
  service_title TEXT,
  preferred_date TEXT,
  participants TEXT,
  specific_needs TEXT,
  budget TEXT,
  timeline TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_service_requests_status ON public.admin_service_requests(status);
CREATE INDEX idx_admin_service_requests_submitted ON public.admin_service_requests(submitted_at);

ALTER TABLE public.admin_service_requests ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_admin_service_requests_updated_at
  BEFORE UPDATE ON public.admin_service_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7) Admin Dashboard Stats
CREATE TABLE public.admin_dashboard_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_patents INTEGER NOT NULL DEFAULT 0,
  patents_this_month INTEGER NOT NULL DEFAULT 0,
  published_news INTEGER NOT NULL DEFAULT 0,
  news_this_week INTEGER NOT NULL DEFAULT 0,
  upcoming_events INTEGER NOT NULL DEFAULT 0,
  next_event_date TEXT,
  service_requests_count INTEGER NOT NULL DEFAULT 0,
  pending_requests INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Only one row should exist for dashboard stats
CREATE UNIQUE INDEX idx_admin_dashboard_stats_single ON public.admin_dashboard_stats ((id IS NOT NULL));

ALTER TABLE public.admin_dashboard_stats ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_admin_dashboard_stats_updated_at
  BEFORE UPDATE ON public.admin_dashboard_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for all admin tables

-- admin_homepage_content
CREATE POLICY "Public can view homepage content"
  ON public.admin_homepage_content
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins manage homepage content"
  ON public.admin_homepage_content
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- admin_technologies
CREATE POLICY "Public can view published technologies"
  ON public.admin_technologies
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage technologies"
  ON public.admin_technologies
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- admin_news
CREATE POLICY "Public can view published news"
  ON public.admin_news
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage news"
  ON public.admin_news
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- admin_patents
CREATE POLICY "Public can view published patents"
  ON public.admin_patents
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage patents"
  ON public.admin_patents
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- admin_events
CREATE POLICY "Public can view published events"
  ON public.admin_events
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage events"
  ON public.admin_events
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- admin_service_requests
CREATE POLICY "Admins manage service requests"
  ON public.admin_service_requests
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow anonymous users to insert service requests
CREATE POLICY "Anyone can submit service requests"
  ON public.admin_service_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

-- admin_dashboard_stats
CREATE POLICY "Public can view dashboard stats"
  ON public.admin_dashboard_stats
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins manage dashboard stats"
  ON public.admin_dashboard_stats
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Grant permissions
GRANT ALL ON public.admin_homepage_content TO authenticated;
GRANT ALL ON public.admin_technologies TO authenticated;
GRANT ALL ON public.admin_news TO authenticated;
GRANT ALL ON public.admin_patents TO authenticated;
GRANT ALL ON public.admin_events TO authenticated;
GRANT ALL ON public.admin_service_requests TO authenticated;
GRANT ALL ON public.admin_dashboard_stats TO authenticated;

-- Grant select for anon users on public tables
GRANT SELECT ON public.admin_homepage_content TO anon;
GRANT SELECT ON public.admin_technologies TO anon;
GRANT SELECT ON public.admin_news TO anon;
GRANT SELECT ON public.admin_patents TO anon;
GRANT SELECT ON public.admin_events TO anon;
GRANT SELECT ON public.admin_dashboard_stats TO anon;
GRANT INSERT ON public.admin_service_requests TO anon;


-- From 20250306100000_create_admin_tables_v2.sql
-- Migration: Create admin tables for localStorage migration (idempotent)
-- This creates dedicated tables for admin-managed content

-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS public.admin_homepage_content CASCADE;
DROP TABLE IF EXISTS public.admin_technologies CASCADE;
DROP TABLE IF EXISTS public.admin_news CASCADE;
DROP TABLE IF EXISTS public.admin_patents CASCADE;
DROP TABLE IF EXISTS public.admin_events CASCADE;
DROP TABLE IF EXISTS public.admin_service_requests CASCADE;
DROP TABLE IF EXISTS public.admin_dashboard_stats CASCADE;

-- Create user_roles table first (needed for has_role function)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Create has_role function (needed for RLS policies)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- 1) Admin Homepage Content
CREATE TABLE public.admin_homepage_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title TEXT NOT NULL DEFAULT 'Accelerating Innovation Through Technology Transfer',
  hero_subtitle TEXT NOT NULL DEFAULT 'Bridging the gap between research and commercialization...',
  hero_image_url TEXT,
  patents_count INTEGER NOT NULL DEFAULT 24,
  partners_count INTEGER NOT NULL DEFAULT 50,
  startups_count INTEGER NOT NULL DEFAULT 15,
  technologies_count INTEGER NOT NULL DEFAULT 8,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_homepage_content ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_admin_homepage_content_updated_at
  BEFORE UPDATE ON public.admin_homepage_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Admin Technologies (featured technologies managed by admin)
CREATE TABLE public.admin_technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  field TEXT,
  status TEXT NOT NULL DEFAULT 'Available',
  inventors TEXT,
  year TEXT,
  abstract TEXT,
  image_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT TRUE,
  order_num INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_technologies_featured ON public.admin_technologies(featured);
CREATE INDEX idx_admin_technologies_order ON public.admin_technologies(order_num);
CREATE INDEX idx_admin_technologies_published ON public.admin_technologies(published);

ALTER TABLE public.admin_technologies ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_admin_technologies_updated_at
  BEFORE UPDATE ON public.admin_technologies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Admin News (news articles managed by admin)
CREATE TABLE public.admin_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  author TEXT,
  status TEXT NOT NULL DEFAULT 'Draft',
  date DATE,
  cover_image_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_news_status ON public.admin_news(status);
CREATE INDEX idx_admin_news_date ON public.admin_news(date);
CREATE INDEX idx_admin_news_published ON public.admin_news(published);

ALTER TABLE public.admin_news ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_admin_news_updated_at
  BEFORE UPDATE ON public.admin_news
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) Admin Patents (patent portfolio items)
CREATE TABLE public.admin_patents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  patent_number TEXT,
  inventors TEXT,
  field TEXT,
  abstract TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  year TEXT,
  licensing_info TEXT,
  applications TEXT[] NOT NULL DEFAULT '{}',
  contact TEXT,
  technology_fields TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_patents_status ON public.admin_patents(status);
CREATE INDEX idx_admin_patents_field ON public.admin_patents(field);
CREATE INDEX idx_admin_patents_published ON public.admin_patents(published);

ALTER TABLE public.admin_patents ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_admin_patents_updated_at
  BEFORE UPDATE ON public.admin_patents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Admin Events
CREATE TABLE public.admin_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'workshop',
  date DATE,
  time TEXT,
  location TEXT,
  capacity INTEGER,
  description TEXT,
  image_url TEXT,
  registration_open BOOLEAN NOT NULL DEFAULT TRUE,
  attendees_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Upcoming',
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_events_date ON public.admin_events(date);
CREATE INDEX idx_admin_events_status ON public.admin_events(status);
CREATE INDEX idx_admin_events_published ON public.admin_events(published);

ALTER TABLE public.admin_events ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_admin_events_updated_at
  BEFORE UPDATE ON public.admin_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6) Admin Service Requests
CREATE TABLE public.admin_service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  service_type TEXT,
  service_title TEXT,
  preferred_date TEXT,
  participants TEXT,
  specific_needs TEXT,
  budget TEXT,
  timeline TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_service_requests_status ON public.admin_service_requests(status);
CREATE INDEX idx_admin_service_requests_submitted ON public.admin_service_requests(submitted_at);

ALTER TABLE public.admin_service_requests ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_admin_service_requests_updated_at
  BEFORE UPDATE ON public.admin_service_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7) Admin Dashboard Stats
CREATE TABLE public.admin_dashboard_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_patents INTEGER NOT NULL DEFAULT 0,
  patents_this_month INTEGER NOT NULL DEFAULT 0,
  published_news INTEGER NOT NULL DEFAULT 0,
  news_this_week INTEGER NOT NULL DEFAULT 0,
  upcoming_events INTEGER NOT NULL DEFAULT 0,
  next_event_date TEXT,
  service_requests_count INTEGER NOT NULL DEFAULT 0,
  pending_requests INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_dashboard_stats ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_admin_dashboard_stats_updated_at
  BEFORE UPDATE ON public.admin_dashboard_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for all admin tables

-- admin_homepage_content
CREATE POLICY "Public can view homepage content"
  ON public.admin_homepage_content
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins manage homepage content"
  ON public.admin_homepage_content
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- admin_technologies
CREATE POLICY "Public can view published technologies"
  ON public.admin_technologies
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage technologies"
  ON public.admin_technologies
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- admin_news
CREATE POLICY "Public can view published news"
  ON public.admin_news
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage news"
  ON public.admin_news
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- admin_patents
CREATE POLICY "Public can view published patents"
  ON public.admin_patents
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage patents"
  ON public.admin_patents
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- admin_events
CREATE POLICY "Public can view published events"
  ON public.admin_events
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage events"
  ON public.admin_events
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- admin_service_requests
CREATE POLICY "Admins manage service requests"
  ON public.admin_service_requests
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow anonymous users to insert service requests
CREATE POLICY "Anyone can submit service requests"
  ON public.admin_service_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

-- admin_dashboard_stats
CREATE POLICY "Public can view dashboard stats"
  ON public.admin_dashboard_stats
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins manage dashboard stats"
  ON public.admin_dashboard_stats
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Grant permissions
GRANT ALL ON public.admin_homepage_content TO authenticated;
GRANT ALL ON public.admin_technologies TO authenticated;
GRANT ALL ON public.admin_news TO authenticated;
GRANT ALL ON public.admin_patents TO authenticated;
GRANT ALL ON public.admin_events TO authenticated;
GRANT ALL ON public.admin_service_requests TO authenticated;
GRANT ALL ON public.admin_dashboard_stats TO authenticated;

-- Grant select for anon users on public tables
GRANT SELECT ON public.admin_homepage_content TO anon;
GRANT SELECT ON public.admin_technologies TO anon;
GRANT SELECT ON public.admin_news TO anon;
GRANT SELECT ON public.admin_patents TO anon;
GRANT SELECT ON public.admin_events TO anon;
GRANT SELECT ON public.admin_dashboard_stats TO anon;
GRANT INSERT ON public.admin_service_requests TO anon;


-- From 20250306110000_seed_admin_data.sql
-- Seed data for admin tables

-- 1. Seed homepage content
INSERT INTO public.admin_homepage_content (hero_title, hero_subtitle, patents_count, partners_count, startups_count, technologies_count)
VALUES ('Accelerating Innovation Through Technology Transfer', 'Bridging the gap between research and commercialization...', 24, 50, 15, 8);

-- 2. Seed technologies
INSERT INTO public.admin_technologies (title, description, field, status, inventors, year, abstract, featured, published) VALUES
('Smart Irrigation System', 'IoT-based irrigation system that reduces water usage by 40% while optimizing crop yields.', 'Agriculture', 'Licensed', 'Dr. Maria Santos, Dr. Juan dela Cruz', '2024', 'Revolutionary smart irrigation technology using AI-powered sensors.', true, true),
('Bio-plastic Innovation', 'Biodegradable plastic made from agricultural waste that decomposes within 6 months.', 'Materials Science', 'Available', 'Dr. Roberto Mendez, Dr. Anna Garcia', '2023', 'Sustainable packaging solution using local agricultural byproducts.', true, true),
('Food Processing Tech', 'Advanced food preservation method that extends shelf life by 300% naturally.', 'Food Technology', 'Pending', 'Dr. Carmen Reyes, Dr. Luis Torres', '2024', 'Natural preservation technology combining traditional methods with modern science.', true, true);

-- 3. Seed news
INSERT INTO public.admin_news (title, excerpt, content, category, author, status, date, published) VALUES
('TPCO-CET Convergence 2025 Announced', 'Join us for the premier technology commercialization event in Northern Mindanao.', 'The TPCO-CET Convergence 2025 will bring together researchers, industry partners, and innovators...', 'Events', 'Admin', 'Published', '2024-01-15', true),
('New Patent Filing Workshop Series', 'Learn the fundamentals of patent filing and intellectual property protection.', 'Our comprehensive workshop series covers all aspects of patent filing...', 'Education', 'Dr. Maria Santos', 'Draft', '2024-01-10', false),
('Industry Partnership with ABC Corp', 'Exciting new partnership opens doors for technology commercialization.', 'We are pleased to announce our strategic partnership with ABC Corp...', 'Partnerships', 'Admin', 'Published', '2024-01-08', true);

-- 4. Seed patents
INSERT INTO public.admin_patents (title, patent_number, inventors, field, abstract, status, year, published) VALUES
('Smart Irrigation System', 'PH-2024-001', 'Dr. Maria Santos, Dr. Juan dela Cruz', 'Agriculture', 'Revolutionary smart irrigation technology using AI-powered sensors.', 'Granted', '2024', true),
('Bio-degradable Packaging', 'PH-2024-002', 'Dr. Roberto Mendez, Dr. Anna Garcia', 'Materials Science', 'Sustainable packaging solution using local agricultural byproducts.', 'Pending', '2024', true),
('Food Preservation Method', 'PH-2023-003', 'Dr. Carmen Reyes, Dr. Luis Torres', 'Food Technology', 'Natural preservation technology combining traditional methods with modern science.', 'Granted', '2023', true);

-- 5. Seed events
INSERT INTO public.admin_events (title, type, date, location, status, attendees_count, registration_open, published) VALUES
('Morning with IP Workshop', 'workshop', '2024-02-15', 'TPCO Training Center', 'Upcoming', 45, true, true),
('Technology Showcase 2024', 'showcase', '2024-03-20', 'University Gymnasium', 'Planning', 120, true, true),
('Innovation Forum', 'forum', '2024-01-20', 'Conference Hall', 'Completed', 85, false, true);

-- 6. Seed dashboard stats
INSERT INTO public.admin_dashboard_stats (total_patents, patents_this_month, published_news, news_this_week, upcoming_events, next_event_date, service_requests_count, pending_requests)
VALUES (24, 3, 18, 5, 6, 'Feb 15', 12, 8);


-- From 20250812025909_fe3c4761-3c32-41c3-b915-3c6bb2f1b312.sql
-- Fixed schema for TPCO web app with roles, content tables, timestamps, and RLS

-- 1) Roles enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (bypasses RLS safely)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Policies for user_roles - Fixed to avoid infinite recursion
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    -- Check if the current user is an admin without recursively calling has_role
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  )
  WITH CHECK (
    -- Check if the current user is an admin without recursively calling has_role
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT ALL ON public.user_roles TO authenticated;

-- 2) Common updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3) Content tables
-- News articles
CREATE TABLE public.news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_news_articles_published ON public.news_articles(published);
CREATE INDEX idx_news_articles_published_at ON public.news_articles(published_at);
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_news_articles_updated_at
  BEFORE UPDATE ON public.news_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  order_num INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_services_order ON public.services(order_num);
CREATE INDEX idx_services_published ON public.services(published);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Technologies
CREATE TABLE public.technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  website_url TEXT,
  logo_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  order_num INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_technologies_featured ON public.technologies(featured);
CREATE INDEX idx_technologies_order ON public.technologies(order_num);
CREATE INDEX idx_technologies_published ON public.technologies(published);
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_technologies_updated_at
  BEFORE UPDATE ON public.technologies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Partners
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website_url TEXT,
  logo_url TEXT,
  description TEXT,
  order_num INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_partners_order ON public.partners(order_num);
CREATE INDEX idx_partners_published ON public.partners(published);
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Team members
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  role_title TEXT,
  bio TEXT,
  avatar_url TEXT,
  email TEXT,
  linkedin_url TEXT,
  order_num INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_team_members_order ON public.team_members(order_num);
CREATE INDEX idx_team_members_published ON public.team_members(published);
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Portfolio items
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  category TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_portfolio_items_published ON public.portfolio_items(published);
CREATE INDEX idx_portfolio_items_published_at ON public.portfolio_items(published_at);
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_portfolio_items_updated_at
  BEFORE UPDATE ON public.portfolio_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Resources
CREATE TYPE public.resource_type AS ENUM ('article', 'guide', 'video', 'download', 'link');

CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type public.resource_type NOT NULL DEFAULT 'article',
  url TEXT,
  content TEXT,
  file_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_resources_type ON public.resources(type);
CREATE INDEX idx_resources_published ON public.resources(published);
CREATE INDEX idx_resources_published_at ON public.resources(published_at);
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Impact stats
CREATE TABLE public.impact_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  trend NUMERIC,
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (metric_key, period_start, period_end)
);
CREATE INDEX idx_impact_stats_metric_key ON public.impact_stats(metric_key);
ALTER TABLE public.impact_stats ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_impact_stats_updated_at
  BEFORE UPDATE ON public.impact_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Milestones (timeline)
CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  milestone_date DATE NOT NULL,
  icon TEXT,
  order_num INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_milestones_date ON public.milestones(milestone_date);
CREATE INDEX idx_milestones_order ON public.milestones(order_num);
CREATE INDEX idx_milestones_published ON public.milestones(published);
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_milestones_updated_at
  BEFORE UPDATE ON public.milestones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Site settings (key/value JSON)
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 4) RLS Policies for content tables
-- Helper: readable by anyone if published, admins can read all; only admins can manage

-- news_articles
CREATE POLICY "Public can view published news"
  ON public.news_articles
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage news"
  ON public.news_articles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- services
CREATE POLICY "Public can view published services"
  ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage services"
  ON public.services
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- technologies
CREATE POLICY "Public can view published technologies"
  ON public.technologies
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage technologies"
  ON public.technologies
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- partners
CREATE POLICY "Public can view published partners"
  ON public.partners
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage partners"
  ON public.partners
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- team_members
CREATE POLICY "Public can view published team members"
  ON public.team_members
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage team members"
  ON public.team_members
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- portfolio_items
CREATE POLICY "Public can view published portfolio"
  ON public.portfolio_items
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage portfolio"
  ON public.portfolio_items
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- resources
CREATE POLICY "Public can view published resources"
  ON public.resources
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage resources"
  ON public.resources
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- impact_stats (public view)
CREATE POLICY "Public can view impact stats"
  ON public.impact_stats
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins manage impact stats"
  ON public.impact_stats
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- milestones (public view)
CREATE POLICY "Public can view published milestones"
  ON public.milestones
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage milestones"
  ON public.milestones
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- site_settings (public view)
CREATE POLICY "Public can view site settings"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins manage site settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- From 20250917092931_280459c9-8adf-4b3f-9fcf-b709e3dd90ae.sql
-- Create enums safely
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE app_role AS ENUM ('admin', 'editor', 'user');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'resource_type') THEN
        CREATE TYPE resource_type AS ENUM ('article', 'guide', 'video', 'download', 'link');
    END IF;
END $$;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News articles table
CREATE TABLE IF NOT EXISTS news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    author_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    order_num INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Technologies table
CREATE TABLE IF NOT EXISTS technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    website_url TEXT,
    logo_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    order_num INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partners table
CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    website_url TEXT,
    logo_url TEXT,
    description TEXT,
    order_num INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    role_title TEXT,
    bio TEXT,
    avatar_url TEXT,
    email TEXT,
    linkedin_url TEXT,
    order_num INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio items table
CREATE TABLE IF NOT EXISTS portfolio_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    link_url TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type resource_type DEFAULT 'article',
    url TEXT,
    content TEXT,
    file_url TEXT,
    tags TEXT[] DEFAULT '{}',
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Impact stats table
CREATE TABLE IF NOT EXISTS impact_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_key TEXT UNIQUE NOT NULL,
    metric_name TEXT NOT NULL,
    value NUMERIC NOT NULL,
    trend NUMERIC,
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Milestones table
CREATE TABLE IF NOT EXISTS milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    milestone_date DATE NOT NULL,
    icon TEXT,
    order_num INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access and admin management
CREATE POLICY "Public read access" ON news_articles FOR SELECT USING (published = true);
CREATE POLICY "Admins manage news" ON news_articles FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public read access" ON services FOR SELECT USING (published = true);
CREATE POLICY "Admins manage services" ON services FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public read access" ON technologies FOR SELECT USING (published = true);
CREATE POLICY "Admins manage technologies" ON technologies FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public read access" ON partners FOR SELECT USING (published = true);
CREATE POLICY "Admins manage partners" ON partners FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public read access" ON team_members FOR SELECT USING (published = true);
CREATE POLICY "Admins manage team" ON team_members FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public read access" ON portfolio_items FOR SELECT USING (published = true);
CREATE POLICY "Admins manage portfolio" ON portfolio_items FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public read access" ON resources FOR SELECT USING (published = true);
CREATE POLICY "Admins manage resources" ON resources FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public read access" ON impact_stats FOR SELECT USING (true);
CREATE POLICY "Admins manage stats" ON impact_stats FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public read access" ON milestones FOR SELECT USING (published = true);
CREATE POLICY "Admins manage milestones" ON milestones FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Public read access" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON site_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users manage own roles" ON user_roles FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins manage all roles" ON user_roles FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technologies_updated_at BEFORE UPDATE ON technologies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON portfolio_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_impact_stats_updated_at BEFORE UPDATE ON impact_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- From 20250919162000_fix_user_roles_policies.sql
-- Fix infinite recursion in user_roles policies
-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Create new policies that avoid infinite recursion
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    -- Check if the current user is an admin without recursively calling has_role
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  )
  WITH CHECK (
    -- Check if the current user is an admin without recursively calling has_role
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

-- From 20250919163000_ensure_user_roles_policies.sql
-- Ensure user_roles policies are correctly set up to avoid infinite recursion
-- First, drop any existing policies on user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Create clean policies that avoid infinite recursion
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    -- Check if the current user is an admin by directly querying the table
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  )
  WITH CHECK (
    -- Check if the current user is an admin by directly querying the table
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT ALL ON public.user_roles TO authenticated;

-- From 20250919164000_complete_user_roles_fix.sql
-- Complete fix for infinite recursion in user_roles policies
-- This migration completely resets the user_roles table policies to avoid any recursion

-- First, disable RLS temporarily to avoid conflicts
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Re-enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create clean policies that avoid infinite recursion by using auth.uid() directly
-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can manage roles - using a direct check that avoids recursion
CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    -- Direct check for admin role without recursion
    EXISTS (
      SELECT 1 
      FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
      -- Add a limit to prevent infinite loops
      LIMIT 1
    )
  )
  WITH CHECK (
    -- Direct check for admin role without recursion
    EXISTS (
      SELECT 1 
      FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
      -- Add a limit to prevent infinite loops
      LIMIT 1
    )
  );

-- Grant necessary permissions
GRANT ALL ON public.user_roles TO authenticated;

-- Also ensure the has_role function is properly defined to avoid recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- From 20250919165000_fixed_main_schema.sql
-- Fixed schema for TPCO web app with roles, content tables, timestamps, and RLS

-- 1) Roles enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (bypasses RLS safely)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Policies for user_roles - Fixed to avoid infinite recursion
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    -- Check if the current user is an admin without recursively calling has_role
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  )
  WITH CHECK (
    -- Check if the current user is an admin without recursively calling has_role
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

-- Grant necessary permissions
GRANT ALL ON public.user_roles TO authenticated;

-- 2) Common updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3) Content tables
-- News articles
CREATE TABLE public.news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_news_articles_published ON public.news_articles(published);
CREATE INDEX idx_news_articles_published_at ON public.news_articles(published_at);
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_news_articles_updated_at
  BEFORE UPDATE ON public.news_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  order_num INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_services_order ON public.services(order_num);
CREATE INDEX idx_services_published ON public.services(published);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Technologies
CREATE TABLE public.technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  website_url TEXT,
  logo_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  order_num INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_technologies_featured ON public.technologies(featured);
CREATE INDEX idx_technologies_order ON public.technologies(order_num);
CREATE INDEX idx_technologies_published ON public.technologies(published);
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_technologies_updated_at
  BEFORE UPDATE ON public.technologies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Partners
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  website_url TEXT,
  logo_url TEXT,
  description TEXT,
  order_num INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_partners_order ON public.partners(order_num);
CREATE INDEX idx_partners_published ON public.partners(published);
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Team members
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  role_title TEXT,
  bio TEXT,
  avatar_url TEXT,
  email TEXT,
  linkedin_url TEXT,
  order_num INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_team_members_order ON public.team_members(order_num);
CREATE INDEX idx_team_members_published ON public.team_members(published);
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Portfolio items
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  category TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_portfolio_items_published ON public.portfolio_items(published);
CREATE INDEX idx_portfolio_items_published_at ON public.portfolio_items(published_at);
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_portfolio_items_updated_at
  BEFORE UPDATE ON public.portfolio_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Resources
CREATE TYPE public.resource_type AS ENUM ('article', 'guide', 'video', 'download', 'link');

CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type public.resource_type NOT NULL DEFAULT 'article',
  url TEXT,
  content TEXT,
  file_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_resources_type ON public.resources(type);
CREATE INDEX idx_resources_published ON public.resources(published);
CREATE INDEX idx_resources_published_at ON public.resources(published_at);
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Impact stats
CREATE TABLE public.impact_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  trend NUMERIC,
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (metric_key, period_start, period_end)
);
CREATE INDEX idx_impact_stats_metric_key ON public.impact_stats(metric_key);
ALTER TABLE public.impact_stats ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_impact_stats_updated_at
  BEFORE UPDATE ON public.impact_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Milestones (timeline)
CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  milestone_date DATE NOT NULL,
  icon TEXT,
  order_num INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_milestones_date ON public.milestones(milestone_date);
CREATE INDEX idx_milestones_order ON public.milestones(order_num);
CREATE INDEX idx_milestones_published ON public.milestones(published);
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_milestones_updated_at
  BEFORE UPDATE ON public.milestones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Site settings (key/value JSON)
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 4) RLS Policies for content tables
-- Helper: readable by anyone if published, admins can read all; only admins can manage

-- news_articles
CREATE POLICY "Public can view published news"
  ON public.news_articles
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage news"
  ON public.news_articles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- services
CREATE POLICY "Public can view published services"
  ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage services"
  ON public.services
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- technologies
CREATE POLICY "Public can view published technologies"
  ON public.technologies
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage technologies"
  ON public.technologies
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- partners
CREATE POLICY "Public can view published partners"
  ON public.partners
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage partners"
  ON public.partners
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- team_members
CREATE POLICY "Public can view published team members"
  ON public.team_members
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage team members"
  ON public.team_members
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- portfolio_items
CREATE POLICY "Public can view published portfolio"
  ON public.portfolio_items
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage portfolio"
  ON public.portfolio_items
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- resources
CREATE POLICY "Public can view published resources"
  ON public.resources
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage resources"
  ON public.resources
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- impact_stats (public view)
CREATE POLICY "Public can view impact stats"
  ON public.impact_stats
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins manage impact stats"
  ON public.impact_stats
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- milestones (public view)
CREATE POLICY "Public can view published milestones"
  ON public.milestones
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage milestones"
  ON public.milestones
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- site_settings (public view)
CREATE POLICY "Public can view site settings"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins manage site settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- From 20250920100000_final_user_roles_fix.sql
-- Final fix for infinite recursion in user_roles policies
-- This migration completely resolves the recursion issue by restructuring the approach

-- First, disable RLS temporarily to avoid conflicts during policy changes
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on user_roles to ensure clean slate
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow authorized access" ON public.user_roles;

-- Re-enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a simplified policy that avoids any recursion
-- Users can view their own roles (simple direct comparison)
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can manage roles - using a more direct approach
CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    -- Check if the current user is an admin by looking for the admin role
    -- This avoids recursion by not calling the has_role function
    EXISTS (
      SELECT 1 
      FROM public.user_roles admin_check
      WHERE admin_check.user_id = auth.uid() 
      AND admin_check.role = 'admin'
      LIMIT 1
    )
  )
  WITH CHECK (
    -- Same check for INSERT/UPDATE operations
    EXISTS (
      SELECT 1 
      FROM public.user_roles admin_check
      WHERE admin_check.user_id = auth.uid() 
      AND admin_check.role = 'admin'
      LIMIT 1
    )
  );

-- Ensure proper permissions
GRANT ALL ON public.user_roles TO authenticated;

-- Also update the has_role function to be safer
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      -- Add a limit to prevent any potential issues
      LIMIT 1
  );
$$;

-- Grant usage on the enum type
GRANT USAGE ON TYPE public.app_role TO authenticated;

-- From 20250920110000_direct_user_roles_fix.sql
-- Direct fix for infinite recursion in user_roles policies
-- This migration completely resolves the recursion issue by restructuring the approach

-- First, disable RLS temporarily to avoid conflicts during policy changes
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on user_roles to ensure clean slate
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow authorized access" ON public.user_roles;

-- Re-enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a simplified policy that avoids any recursion
-- Users can view their own roles (simple direct comparison)
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can manage roles - using a more direct approach
CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    -- Check if the current user is an admin by looking for the admin role
    -- This avoids recursion by not calling the has_role function
    EXISTS (
      SELECT 1 
      FROM public.user_roles admin_check
      WHERE admin_check.user_id = auth.uid() 
      AND admin_check.role = 'admin'
      LIMIT 1
    )
  )
  WITH CHECK (
    -- Same check for INSERT/UPDATE operations
    EXISTS (
      SELECT 1 
      FROM public.user_roles admin_check
      WHERE admin_check.user_id = auth.uid() 
      AND admin_check.role = 'admin'
      LIMIT 1
    )
  );

-- Ensure proper permissions
GRANT ALL ON public.user_roles TO authenticated;

-- From 20250920120000_user_roles_final_fix.sql
-- Final fix for infinite recursion in user_roles policies
-- This migration completely resolves the recursion issue by restructuring the approach

-- First, disable RLS temporarily to avoid conflicts during policy changes
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on user_roles to ensure clean slate
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow authorized access" ON public.user_roles;

-- Re-enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a simplified policy that avoids any recursion
-- Users can view their own roles (simple direct comparison)
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can manage roles - using a more direct approach
CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    -- Check if the current user is an admin by looking for the admin role
    -- This avoids recursion by not calling the has_role function
    EXISTS (
      SELECT 1 
      FROM public.user_roles admin_check
      WHERE admin_check.user_id = auth.uid() 
      AND admin_check.role = 'admin'
      LIMIT 1
    )
  )
  WITH CHECK (
    -- Same check for INSERT/UPDATE operations
    EXISTS (
      SELECT 1 
      FROM public.user_roles admin_check
      WHERE admin_check.user_id = auth.uid() 
      AND admin_check.role = 'admin'
      LIMIT 1
    )
  );

-- Ensure proper permissions
GRANT ALL ON public.user_roles TO authenticated;

-- Also update the has_role function to be safer
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      -- Add a limit to prevent any potential issues
      LIMIT 1
  );
$$;

-- Grant usage on the enum type
GRANT USAGE ON TYPE public.app_role TO authenticated;

-- From 20250920130000_comprehensive_user_roles_fix.sql
-- Comprehensive fix for infinite recursion in user_roles policies
-- This migration completely resolves all recursion issues by restructuring the approach

-- First, disable RLS temporarily to avoid conflicts during policy changes
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on user_roles to ensure clean slate
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow authorized access" ON public.user_roles;

-- Re-enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a simplified policy that avoids any recursion
-- Users can view their own roles (simple direct comparison)
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can manage roles - using a more direct approach without calling has_role
CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    -- Check if the current user is an admin by looking for the admin role
    -- This avoids recursion by not calling the has_role function
    EXISTS (
      SELECT 1 
      FROM public.user_roles admin_check
      WHERE admin_check.user_id = auth.uid() 
      AND admin_check.role = 'admin'
      LIMIT 1
    )
  )
  WITH CHECK (
    -- Same check for INSERT/UPDATE operations
    EXISTS (
      SELECT 1 
      FROM public.user_roles admin_check
      WHERE admin_check.user_id = auth.uid() 
      AND admin_check.role = 'admin'
      LIMIT 1
    )
  );

-- Ensure proper permissions
GRANT ALL ON public.user_roles TO authenticated;

-- Also update the has_role function to be safer and avoid recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      -- Add a limit to prevent any potential issues
      LIMIT 1
  );
$$;

-- Grant usage on the enum type
GRANT USAGE ON TYPE public.app_role TO authenticated;

-- Fix all other policies that were using has_role to avoid recursion
-- news_articles
DROP POLICY IF EXISTS "Public can view published news" ON public.news_articles;
DROP POLICY IF EXISTS "Admins manage news" ON public.news_articles;

CREATE POLICY "Public can view published news"
  ON public.news_articles
  FOR SELECT
  TO anon, authenticated
  USING (
    published = TRUE OR 
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  );

CREATE POLICY "Admins manage news"
  ON public.news_articles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  );

-- services
DROP POLICY IF EXISTS "Public can view published services" ON public.services;
DROP POLICY IF EXISTS "Admins manage services" ON public.services;

CREATE POLICY "Public can view published services"
  ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (
    published = TRUE OR 
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  );

CREATE POLICY "Admins manage services"
  ON public.services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  );

-- technologies
DROP POLICY IF EXISTS "Public can view published technologies" ON public.technologies;
DROP POLICY IF EXISTS "Admins manage technologies" ON public.technologies;

CREATE POLICY "Public can view published technologies"
  ON public.technologies
  FOR SELECT
  TO anon, authenticated
  USING (
    published = TRUE OR 
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  );

CREATE POLICY "Admins manage technologies"
  ON public.technologies
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  );

-- partners
DROP POLICY IF EXISTS "Public can view published partners" ON public.partners;
DROP POLICY IF EXISTS "Admins manage partners" ON public.partners;

CREATE POLICY "Public can view published partners"
  ON public.partners
  FOR SELECT
  TO anon, authenticated
  USING (
    published = TRUE OR 
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  );

CREATE POLICY "Admins manage partners"
  ON public.partners
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  );

-- team_members
DROP POLICY IF EXISTS "Public can view published team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins manage team members" ON public.team_members;

CREATE POLICY "Public can view published team members"
  ON public.team_members
  FOR SELECT
  TO anon, authenticated
  USING (
    published = TRUE OR 
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  );

CREATE POLICY "Admins manage team members"
  ON public.team_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  );

-- portfolio_items
DROP POLICY IF EXISTS "Public can view published portfolio" ON public.portfolio_items;
DROP POLICY IF EXISTS "Admins manage portfolio" ON public.portfolio_items;

CREATE POLICY "Public can view published portfolio"
  ON public.portfolio_items
  FOR SELECT
  TO anon, authenticated
  USING (
    published = TRUE OR 
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  );

CREATE POLICY "Admins manage portfolio"
  ON public.portfolio_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  );

-- resources
DROP POLICY IF EXISTS "Public can view published resources" ON public.resources;
DROP POLICY IF EXISTS "Admins manage resources" ON public.resources;

CREATE POLICY "Public can view published resources"
  ON public.resources
  FOR SELECT
  TO anon, authenticated
  USING (
    published = TRUE OR 
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  );

CREATE POLICY "Admins manage resources"
  ON public.resources
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  );

-- impact_stats
DROP POLICY IF EXISTS "Public can view impact stats" ON public.impact_stats;
DROP POLICY IF EXISTS "Admins manage impact stats" ON public.impact_stats;

CREATE POLICY "Public can view impact stats"
  ON public.impact_stats
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins manage impact stats"
  ON public.impact_stats
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  );

-- milestones
DROP POLICY IF EXISTS "Public can view published milestones" ON public.milestones;
DROP POLICY IF EXISTS "Admins manage milestones" ON public.milestones;

CREATE POLICY "Public can view published milestones"
  ON public.milestones
  FOR SELECT
  TO anon, authenticated
  USING (
    published = TRUE OR 
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  );

CREATE POLICY "Admins manage milestones"
  ON public.milestones
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  );

-- site_settings
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins manage site settings" ON public.site_settings;

CREATE POLICY "Public can view site settings"
  ON public.site_settings
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins manage site settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  );

-- From 20250924084500_create_activity_logs_table.sql
-- Create activity_logs table for tracking admin dashboard activities
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL, -- e.g., 'news', 'technology', 'service', etc.
  action TEXT NOT NULL, -- e.g., 'created', 'updated', 'deleted', 'published', etc.
  title TEXT NOT NULL, -- title of the item the activity relates to
  description TEXT, -- optional additional details about the activity
  metadata JSONB, -- additional data related to the activity
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_activity_type ON public.activity_logs(activity_type);
CREATE INDEX idx_activity_logs_action ON public.activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at);

-- Enable Row Level Security
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create trigger for automatic updated_at
CREATE TRIGGER trg_activity_logs_updated_at
  BEFORE UPDATE ON public.activity_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Policies: Admins can manage all activity logs, authenticated users can only view their own
CREATE POLICY "Admins manage all activity logs"
  ON public.activity_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

CREATE POLICY "Authenticated users view their own activity logs"
  ON public.activity_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Public can view published activity logs"
  ON public.activity_logs
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

-- From 20260224084527_create_activity_logs_table.sql


-- From 20260306000000_create_event_registrations.sql
-- Create event_registrations table for storing user event registrations

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.admin_events(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  position TEXT,
  dietary_requirements TEXT,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'attended')),
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_email ON public.event_registrations(email);
CREATE INDEX idx_event_registrations_status ON public.event_registrations(status);
CREATE INDEX idx_event_registrations_registered_at ON public.event_registrations(registered_at);

-- Enable Row Level Security
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Public can insert their own registrations
CREATE POLICY "Anyone can register for events"
  ON public.event_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

-- Public can view their own registrations by email
CREATE POLICY "Users can view their own registrations"
  ON public.event_registrations
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

-- Admins can manage all registrations
CREATE POLICY "Admins manage registrations"
  ON public.event_registrations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER trg_event_registrations_updated_at
  BEFORE UPDATE ON public.event_registrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.event_registrations TO authenticated;
GRANT SELECT, INSERT ON public.event_registrations TO anon;

-- Create function to update attendees_count in admin_events
CREATE OR REPLACE FUNCTION update_event_attendees_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.admin_events
    SET attendees_count = (
      SELECT COUNT(*) 
      FROM public.event_registrations 
      WHERE event_id = NEW.event_id AND status != 'cancelled'
    )
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.admin_events
    SET attendees_count = (
      SELECT COUNT(*) 
      FROM public.event_registrations 
      WHERE event_id = OLD.event_id AND status != 'cancelled'
    )
    WHERE id = OLD.event_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.admin_events
    SET attendees_count = (
      SELECT COUNT(*) 
      FROM public.event_registrations 
      WHERE event_id = NEW.event_id AND status != 'cancelled'
    )
    WHERE id = NEW.event_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating attendees count
CREATE TRIGGER trg_update_attendees_count
  AFTER INSERT OR UPDATE OR DELETE ON public.event_registrations
  FOR EACH ROW EXECUTE FUNCTION update_event_attendees_count();


-- From 20260306120000_create_user_profiles.sql
-- Create user_profiles table for Admin User Management
-- This table stores extended profile data linked to Supabase Auth users

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT,
  employee_id TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'faculty', 'admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(email),
  UNIQUE(employee_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON public.user_profiles(status);

-- RLS Policies

-- Policy: Allow anyone to read their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Allow admins to do everything
CREATE POLICY "Admins have full access" ON public.user_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Allow service role full access (for backend operations)
CREATE POLICY "Service role has full access" ON public.user_profiles
  FOR ALL USING (auth.role() = 'service_role');

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create a trigger to automatically create a user_profile when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists, then create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;


-- From 20260322000000_resource_management_enhancements.sql
-- Add category column to resources table for better categorization
ALTER TABLE public.resources 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Guidelines';

-- Add additional fields for tutorials
ALTER TABLE public.resources
ADD COLUMN IF NOT EXISTS duration TEXT,
ADD COLUMN IF NOT EXISTS modules_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'Beginner';

-- Add additional fields for facilities
ALTER TABLE public.resources
ADD COLUMN IF NOT EXISTS capacity TEXT,
ADD COLUMN IF NOT EXISTS hourly_rate TEXT,
ADD COLUMN IF NOT EXISTS booking_lead_time TEXT,
ADD COLUMN IF NOT EXISTS equipment TEXT[] DEFAULT '{}';

-- Create facility_booking_inquiries table
CREATE TABLE IF NOT EXISTS public.facility_booking_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID REFERENCES public.resources(id) ON DELETE SET NULL,
  facility_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  purpose TEXT,
  additional_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for facility_booking_inquiries
CREATE INDEX IF NOT EXISTS idx_facility_booking_status ON public.facility_booking_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_facility_booking_created_at ON public.facility_booking_inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_facility_booking_facility_id ON public.facility_booking_inquiries(facility_id);

-- Enable RLS on facility_booking_inquiries
ALTER TABLE public.facility_booking_inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for facility_booking_inquiries
CREATE POLICY "Admins can view all booking inquiries"
ON public.facility_booking_inquiries
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can manage booking inquiries"
ON public.facility_booking_inquiries
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Public can insert booking inquiries"
ON public.facility_booking_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER trg_facility_booking_inquiries_updated_at
BEFORE UPDATE ON public.facility_booking_inquiries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update resources policies to allow proper management
DROP POLICY IF EXISTS "Public can view published resources" ON public.resources;
CREATE POLICY "Public can view published resources"
ON public.resources
FOR SELECT
TO anon, authenticated
USING (published = true);

DROP POLICY IF EXISTS "Admins manage resources" ON public.resources;
CREATE POLICY "Admins manage resources"
ON public.resources
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Insert default templates if they don't exist
INSERT INTO public.resources (title, slug, type, category, content, published, tags)
VALUES 
  ('Non-Disclosure Agreement (NDA)', 'non-disclosure-agreement-nda', 'download', 'Templates', 'Standard template for protecting confidential information during technology discussions', true, ARRAY['Templates', 'Legal']),
  ('Memorandum of Understanding (MOU)', 'memorandum-of-understanding-mou', 'download', 'Templates', 'Framework for establishing research partnerships and collaboration agreements', true, ARRAY['Templates', 'Legal'])
ON CONFLICT (slug) DO NOTHING;

-- Insert default tutorials if they don't exist
INSERT INTO public.resources (title, slug, type, category, content, published, tags, duration, modules_count, level)
VALUES 
  ('Introduction to Intellectual Property', 'introduction-to-intellectual-property', 'video', 'IP 101 Tutorials', 'Fundamentals of IP protection, types of IP, and why it matters for researchers', true, ARRAY['IP 101 Tutorials', 'Beginner'], '45 minutes', 6, 'Beginner'),
  ('Patent Application Process', 'patent-application-process', 'video', 'IP 101 Tutorials', 'Step-by-step guide through the patent application process from idea to grant', true, ARRAY['IP 101 Tutorials', 'Intermediate'], '60 minutes', 8, 'Intermediate')
ON CONFLICT (slug) DO NOTHING;

-- Insert default guidelines if they don't exist
INSERT INTO public.resources (title, slug, type, category, content, published, tags)
VALUES 
  ('USTP Research Ethics Guidelines', 'ustp-research-ethics-guidelines', 'guide', 'Guidelines', 'Comprehensive guide to ethical considerations in research and development', true, ARRAY['Guidelines', 'Research']),
  ('IP Protection Best Practices', 'ip-protection-best-practices', 'guide', 'Guidelines', 'Best practices for protecting intellectual property throughout the research process', true, ARRAY['Guidelines', 'IP'])
ON CONFLICT (slug) DO NOTHING;

-- Insert default facilities if they don't exist
INSERT INTO public.resources (title, slug, type, category, content, published, tags, capacity, hourly_rate, booking_lead_time, equipment)
VALUES 
  ('Advanced Materials Testing Lab', 'advanced-materials-testing-lab', 'download', 'SSF Booking', 'State-of-the-art equipment for materials characterization and testing', true, ARRAY['SSF Booking', 'Facility'], '10 researchers', '500', '48 hours', ARRAY['SEM-EDS', 'XRD', 'FTIR', 'Universal Testing Machine', 'Hardness Tester']),
  ('Biotechnology Research Facility', 'biotechnology-research-facility', 'download', 'SSF Booking', 'Fully equipped lab for biotechnology and life sciences research', true, ARRAY['SSF Booking', 'Facility'], '8 researchers', '400', '72 hours', ARRAY['PCR Machines', 'Spectrophotometer', 'Centrifuges', 'Incubators', 'Biosafety Cabinet']),
  ('Food Technology Laboratory', 'food-technology-laboratory', 'download', 'SSF Booking', 'Comprehensive facility for food processing and analysis research', true, ARRAY['SSF Booking', 'Facility'], '12 researchers', '350', '24 hours', ARRAY['Texture Analyzer', 'Color Meter', 'pH Meter', 'Packaging Equipment', 'Sensory Testing Booth']),
  ('Environmental Analysis Center', 'environmental-analysis-center', 'download', 'SSF Booking', 'Specialized lab for environmental monitoring and analysis', true, ARRAY['SSF Booking', 'Facility'], '6 researchers', '600', '96 hours', ARRAY['GC-MS', 'HPLC', 'Ion Chromatograph', 'Water Quality Analyzers', 'Air Sampling Equipment'])
ON CONFLICT (slug) DO NOTHING;


-- From 20260323000000_fix_user_profiles_rls.sql
-- Fix RLS policy for user_profiles to check user_profiles.role instead of user_roles
-- This resolves the chicken-and-egg problem where new users don't have user_roles entry yet

-- Drop the existing policy that checks user_roles
DROP POLICY IF EXISTS "Admins have full access" ON public.user_profiles;

-- Create new policy that checks both user_profiles.role AND user_roles
-- This allows:
-- 1. Users with role='admin' or 'faculty' in user_profiles to manage users
-- 2. Users with entry in user_roles table (backward compatibility)
CREATE POLICY "Admins and faculty have full access" ON public.user_profiles
  FOR ALL USING (
    -- Check user_profiles.role directly
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() 
      AND up.role IN ('admin', 'faculty')
    )
    OR
    -- Also check user_roles for backward compatibility
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('admin', 'faculty')
    )
  );

-- Also update the trigger to use the role from metadata if provided
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- From 20260331000000_create_dashboard_stats_function.sql
-- Create a function to calculate real-time dashboard statistics
-- This function computes stats dynamically from the actual tables instead of relying on static values

CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE (
  total_patents INTEGER,
  patents_this_month INTEGER,
  published_news INTEGER,
  news_this_week INTEGER,
  upcoming_events INTEGER,
  next_event_date TEXT,
  service_requests_count INTEGER,
  pending_requests INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_patents INTEGER;
  v_patents_this_month INTEGER;
  v_published_news INTEGER;
  v_news_this_week INTEGER;
  v_upcoming_events INTEGER;
  v_next_event_date TEXT;
  v_service_requests_count INTEGER;
  v_pending_requests INTEGER;
BEGIN
  -- Count total patents
  SELECT COUNT(*) INTO v_total_patents
  FROM public.admin_patents;

  -- Count patents created this month
  SELECT COUNT(*) INTO v_patents_this_month
  FROM public.admin_patents
  WHERE created_at >= DATE_TRUNC('month', NOW());

  -- Count published news
  SELECT COUNT(*) INTO v_published_news
  FROM public.admin_news
  WHERE status = 'Published';

  -- Count news published this week
  SELECT COUNT(*) INTO v_news_this_week
  FROM public.admin_news
  WHERE status = 'Published'
    AND date >= DATE_TRUNC('week', NOW());

  -- Count upcoming events (events with date >= today)
  SELECT COUNT(*) INTO v_upcoming_events
  FROM public.admin_events
  WHERE date >= CURRENT_DATE;

  -- Get the next upcoming event date
  SELECT TO_CHAR(date, 'Mon DD') INTO v_next_event_date
  FROM public.admin_events
  WHERE date >= CURRENT_DATE
  ORDER BY date ASC
  LIMIT 1;

  -- Count total service requests
  SELECT COUNT(*) INTO v_service_requests_count
  FROM public.admin_service_requests;

  -- Count pending service requests
  SELECT COUNT(*) INTO v_pending_requests
  FROM public.admin_service_requests
  WHERE status = 'Pending';

  RETURN QUERY SELECT 
    COALESCE(v_total_patents, 0),
    COALESCE(v_patents_this_month, 0),
    COALESCE(v_published_news, 0),
    COALESCE(v_news_this_week, 0),
    COALESCE(v_upcoming_events, 0),
    COALESCE(v_next_event_date, 'No upcoming events'),
    COALESCE(v_service_requests_count, 0),
    COALESCE(v_pending_requests, 0);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats() TO anon;

-- Add comment for documentation
COMMENT ON FUNCTION public.get_dashboard_stats() IS 'Calculates real-time dashboard statistics from patents, news, events, and service requests tables';


-- From 20260331000001_create_activity_log_triggers.sql
-- Create triggers to automatically log activities when patents, news, events, or service requests are created/updated/deleted

-- Function to log patent activities
CREATE OR REPLACE FUNCTION public.log_patent_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
    VALUES (
      auth.uid(),
      'technology',
      'added',
      NEW.title,
      'New patent/technology added',
      jsonb_build_object('patent_id', NEW.id, 'status', NEW.status, 'field', NEW.field)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
    VALUES (
      auth.uid(),
      'technology',
      'updated',
      NEW.title,
      'Patent/technology updated',
      jsonb_build_object('patent_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
    VALUES (
      auth.uid(),
      'technology',
      'deleted',
      OLD.title,
      'Patent/technology deleted',
      jsonb_build_object('patent_id', OLD.id)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Function to log news activities
CREATE OR REPLACE FUNCTION public.log_news_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
    VALUES (
      auth.uid(),
      'news',
      'created',
      NEW.title,
      'News article created',
      jsonb_build_object('news_id', NEW.id, 'category', NEW.category, 'status', NEW.status)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Only log if status changed to published
    IF NEW.status = 'Published' AND OLD.status != 'Published' THEN
      INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
      VALUES (
        auth.uid(),
        'news',
        'published',
        NEW.title,
        'News article published',
        jsonb_build_object('news_id', NEW.id, 'category', NEW.category)
      );
    ELSIF NEW.status != OLD.status THEN
      INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
      VALUES (
        auth.uid(),
        'news',
        'updated',
        NEW.title,
        'News article status updated to ' || NEW.status,
        jsonb_build_object('news_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status)
      );
    ELSE
      INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
      VALUES (
        auth.uid(),
        'news',
        'updated',
        NEW.title,
        'News article updated',
        jsonb_build_object('news_id', NEW.id, 'category', NEW.category)
      );
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
    VALUES (
      auth.uid(),
      'news',
      'deleted',
      OLD.title,
      'News article deleted',
      jsonb_build_object('news_id', OLD.id)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Function to log event activities
CREATE OR REPLACE FUNCTION public.log_event_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
    VALUES (
      auth.uid(),
      'event',
      'created',
      NEW.title,
      'New event created',
      jsonb_build_object('event_id', NEW.id, 'type', NEW.type, 'date', NEW.date)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
    VALUES (
      auth.uid(),
      'event',
      'updated',
      NEW.title,
      'Event updated',
      jsonb_build_object('event_id', NEW.id, 'type', NEW.type)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
    VALUES (
      auth.uid(),
      'event',
      'deleted',
      OLD.title,
      'Event deleted',
      jsonb_build_object('event_id', OLD.id)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Function to log service request activities
CREATE OR REPLACE FUNCTION public.log_service_request_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
    VALUES (
      auth.uid(),
      'service',
      'received',
      NEW.service_title,
      'New service request from ' || NEW.name,
      jsonb_build_object('request_id', NEW.id, 'service_type', NEW.service_type, 'organization', NEW.organization)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status != OLD.status THEN
      INSERT INTO public.activity_logs (user_id, activity_type, action, title, description, metadata)
      VALUES (
        auth.uid(),
        'service',
        'updated',
        NEW.service_title,
        'Service request status changed to ' || NEW.status,
        jsonb_build_object('request_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status)
      );
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS trg_patent_activity ON public.admin_patents;
CREATE TRIGGER trg_patent_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.admin_patents
  FOR EACH ROW EXECUTE FUNCTION public.log_patent_activity();

DROP TRIGGER IF EXISTS trg_news_activity ON public.admin_news;
CREATE TRIGGER trg_news_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.admin_news
  FOR EACH ROW EXECUTE FUNCTION public.log_news_activity();

DROP TRIGGER IF EXISTS trg_event_activity ON public.admin_events;
CREATE TRIGGER trg_event_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.admin_events
  FOR EACH ROW EXECUTE FUNCTION public.log_event_activity();

DROP TRIGGER IF EXISTS trg_service_request_activity ON public.admin_service_requests;
CREATE TRIGGER trg_service_request_activity
  AFTER INSERT OR UPDATE ON public.admin_service_requests
  FOR EACH ROW EXECUTE FUNCTION public.log_service_request_activity();

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.log_patent_activity() TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_news_activity() TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_event_activity() TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_service_request_activity() TO authenticated;


-- From 20260331000002_fix_admin_rls_and_tables.sql
-- Fix RLS policies and create missing tables for Admin Dashboard

-- ============================================
-- 1. Fix admin_homepage_content RLS policies
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view homepage content" ON public.admin_homepage_content;
DROP POLICY IF EXISTS "Admins manage homepage content" ON public.admin_homepage_content;

-- Create new policies that allow both admin and faculty roles
CREATE POLICY "Public can view homepage content"
  ON public.admin_homepage_content
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins and faculty manage homepage content"
  ON public.admin_homepage_content
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

-- ============================================
-- 2. Fix admin_news RLS policies
-- ============================================

DROP POLICY IF EXISTS "Public can view published news" ON public.admin_news;
DROP POLICY IF EXISTS "Admins manage news" ON public.admin_news;

CREATE POLICY "Public can view published news"
  ON public.admin_news
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

CREATE POLICY "Admins and faculty manage news"
  ON public.admin_news
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

-- ============================================
-- 3. Fix admin_patents RLS policies
-- ============================================

DROP POLICY IF EXISTS "Public can view published patents" ON public.admin_patents;
DROP POLICY IF EXISTS "Admins manage patents" ON public.admin_patents;

CREATE POLICY "Public can view published patents"
  ON public.admin_patents
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

CREATE POLICY "Admins and faculty manage patents"
  ON public.admin_patents
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

-- ============================================
-- 4. Fix admin_events RLS policies
-- ============================================

DROP POLICY IF EXISTS "Public can view published events" ON public.admin_events;
DROP POLICY IF EXISTS "Admins manage events" ON public.admin_events;

CREATE POLICY "Public can view published events"
  ON public.admin_events
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

CREATE POLICY "Admins and faculty manage events"
  ON public.admin_events
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

-- ============================================
-- 5. Fix admin_service_requests RLS policies
-- ============================================

DROP POLICY IF EXISTS "Admins manage service requests" ON public.admin_service_requests;

CREATE POLICY "Admins and faculty manage service requests"
  ON public.admin_service_requests
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

-- ============================================
-- 6. Fix admin_technologies RLS policies
-- ============================================

DROP POLICY IF EXISTS "Public can view published technologies" ON public.admin_technologies;
DROP POLICY IF EXISTS "Admins manage technologies" ON public.admin_technologies;

CREATE POLICY "Public can view published technologies"
  ON public.admin_technologies
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

CREATE POLICY "Admins and faculty manage technologies"
  ON public.admin_technologies
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

-- ============================================
-- 7. Fix admin_dashboard_stats RLS policies
-- ============================================

DROP POLICY IF EXISTS "Public can view dashboard stats" ON public.admin_dashboard_stats;
DROP POLICY IF EXISTS "Admins manage dashboard stats" ON public.admin_dashboard_stats;

CREATE POLICY "Public can view dashboard stats"
  ON public.admin_dashboard_stats
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

CREATE POLICY "Admins and faculty manage dashboard stats"
  ON public.admin_dashboard_stats
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

-- ============================================
-- 8. Create activity_logs table if it doesn't exist
-- ============================================

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL,
  action TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_activity_type ON public.activity_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at);

-- Enable Row Level Security
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create trigger for automatic updated_at
DROP TRIGGER IF EXISTS trg_activity_logs_updated_at ON public.activity_logs;
CREATE TRIGGER trg_activity_logs_updated_at
  BEFORE UPDATE ON public.activity_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Policies for activity_logs
DROP POLICY IF EXISTS "Admins manage all activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Authenticated users view their own activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Public can view published activity logs" ON public.activity_logs;

CREATE POLICY "Admins and faculty manage all activity logs"
  ON public.activity_logs
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

CREATE POLICY "Authenticated users view their own activity logs"
  ON public.activity_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Public can view activity logs"
  ON public.activity_logs
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

-- ============================================
-- 9. Seed initial homepage content if not exists
-- ============================================

INSERT INTO public.admin_homepage_content (hero_title, hero_subtitle, patents_count, partners_count, startups_count, technologies_count)
SELECT 'Accelerating Innovation Through Technology Transfer', 'Bridging the gap between research and commercialization...', 24, 50, 15, 8
WHERE NOT EXISTS (SELECT 1 FROM public.admin_homepage_content);

-- ============================================
-- 10. Seed initial dashboard stats if not exists
-- ============================================

INSERT INTO public.admin_dashboard_stats (total_patents, patents_this_month, published_news, news_this_week, upcoming_events, next_event_date, service_requests_count, pending_requests)
SELECT 0, 0, 0, 0, 0, 'No upcoming events', 0, 0
WHERE NOT EXISTS (SELECT 1 FROM public.admin_dashboard_stats);

-- Grant permissions
GRANT ALL ON public.activity_logs TO authenticated;
GRANT SELECT ON public.activity_logs TO anon;


-- From 20260331000003_add_description_to_admin_patents.sql
-- Add description column to admin_patents table
ALTER TABLE admin_patents ADD COLUMN IF NOT EXISTS description TEXT;

-- Update the updated_at trigger to include the new column
COMMENT ON COLUMN admin_patents.description IS 'Brief description of the patent';


-- From 20260331000003_add_services_and_archive.sql
-- Migration: Add services table and archived column to service requests
-- Date: 2026-03-31

-- ============================================
-- 1. Add archived column to admin_service_requests
-- ============================================

ALTER TABLE public.admin_service_requests 
ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index for faster queries on archived status
CREATE INDEX IF NOT EXISTS idx_admin_service_requests_archived 
ON public.admin_service_requests(archived);

-- ============================================
-- 2. Create services table if not exists
-- ============================================

CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  order_num INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_services_order ON public.services(order_num);
CREATE INDEX IF NOT EXISTS idx_services_published ON public.services(published);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_services_updated_at ON public.services;
CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 3. RLS Policies for services table
-- ============================================

-- Public can view published services
DROP POLICY IF EXISTS "Public can view published services" ON public.services;
CREATE POLICY "Public can view published services"
ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

-- Admins manage services
DROP POLICY IF EXISTS "Admins manage services" ON public.services;
CREATE POLICY "Admins manage services"
ON public.services
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- 4. Grant permissions
-- ============================================

GRANT ALL ON public.services TO authenticated;
GRANT SELECT ON public.services TO anon;

-- ============================================
-- 5. Seed default services if table is empty
-- ============================================

INSERT INTO public.services (name, slug, description, icon, order_num, published)
SELECT * FROM (VALUES
  ('IP Protection', 'ip-protection', 'Intellectual property protection services including patent filing, trademark registration, and copyright protection.', 'Shield', 1, TRUE),
  ('Technology Licensing', 'technology-licensing', 'License your technologies to industry partners for commercialization and revenue generation.', 'Handshake', 2, TRUE),
  ('Industry Matching', 'industry-matching', 'Connect with potential industry partners and collaborators for research and development.', 'Users', 3, TRUE)
) AS v(name, slug, description, icon, order_num, published)
WHERE NOT EXISTS (SELECT 1 FROM public.services);


-- From 20260331000004_add_events_archive_column.sql
-- Migration: Add archived column to admin_events table
-- Date: 2026-03-31

-- ============================================
-- 1. Add archived column to admin_events
-- ============================================

ALTER TABLE public.admin_events 
ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index for faster queries on archived status
CREATE INDEX IF NOT EXISTS idx_admin_events_archived 
ON public.admin_events(archived);

-- ============================================
-- 2. Update RLS policies if needed
-- ============================================

-- Ensure the existing policy allows updating the archived column
-- The existing "Admins and faculty manage events" policy should cover this

-- ============================================
-- 3. Grant permissions
-- ============================================

-- Permissions are already granted via existing policies


-- From 20260331000005_add_news_archive_column.sql
-- Migration: Add archived column to admin_news table
-- Date: 2026-03-31

-- ============================================
-- 1. Add archived column to admin_news
-- ============================================

ALTER TABLE public.admin_news 
ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index for faster queries on archived status
CREATE INDEX IF NOT EXISTS idx_admin_news_archived 
ON public.admin_news(archived);

-- ============================================
-- 2. Update RLS policies if needed
-- ============================================

-- Ensure the existing policy allows updating the archived column
-- The existing "Admins manage news" policy should cover this

-- ============================================
-- 3. Grant permissions
-- ============================================

-- Permissions are already granted via existing policies


-- From 20260402000000_enhance_services_table.sql
-- ============================================
-- Enhance services table with additional fields
-- ============================================

-- Add new columns to services table
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS features TEXT[],
ADD COLUMN IF NOT EXISTS process_steps TEXT[],
ADD COLUMN IF NOT EXISTS timeline TEXT,
ADD COLUMN IF NOT EXISTS pricing TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_services_order ON public.services(order_num);

-- Clear existing services and insert the exact TPCO services
DELETE FROM public.services;

-- Insert the 4 exact TPCO services
INSERT INTO public.services (name, slug, description, icon, order_num, published, features, process_steps, timeline, pricing) VALUES
(
  'IP Protection Services',
  'ip-protection',
  'Comprehensive intellectual property protection and management services',
  'Shield',
  1,
  true,
  ARRAY[
    'Patent Application Assistance',
    'Trademark Registration',
    'Copyright Protection',
    'Prior Art Search & Analysis',
    'IP Portfolio Management',
    'Freedom to Operate Analysis',
    'Patent Landscape Studies',
    'IP Strategy Development'
  ],
  ARRAY[
    'Initial IP Assessment',
    'Prior Art Search',
    'Application Preparation',
    'Filing & Prosecution',
    'Grant & Maintenance'
  ],
  '3-6 months',
  'Consultation fees apply'
),
(
  'Technology Licensing',
  'technology-licensing',
  'Facilitate technology transfer and commercialization opportunities',
  'Handshake',
  2,
  true,
  ARRAY[
    'Technology Valuation',
    'Market Analysis',
    'Licensing Negotiations',
    'Partnership Facilitation',
    'Due Diligence Support',
    'Contract Management',
    'Royalty Management',
    'Post-License Support'
  ],
  ARRAY[
    'Technology Assessment',
    'Market Evaluation',
    'Partner Matching',
    'Negotiation',
    'Agreement Execution'
  ],
  '2-4 months',
  'Success-based fees'
),
(
  'Industry-Academe Matching',
  'industry-matching',
  'Bridge academic research with industry innovation needs',
  'BookOpen',
  3,
  true,
  ARRAY[
    'Collaboration Matching',
    'Joint Research Projects',
    'Technical Consulting',
    'Research Partnerships',
    'Innovation Challenges',
    'Expert Networks',
    'Technology Scouting',
    'Partnership Development'
  ],
  ARRAY[
    'Needs Assessment',
    'Capability Mapping',
    'Partner Identification',
    'Introduction & Facilitation',
    'Collaboration Support'
  ],
  '1-3 months',
  'Project-based'
),
(
  'Startup Incubation',
  'startup-incubation',
  'Support researchers in launching technology-based startups',
  'Rocket',
  4,
  true,
  ARRAY[
    'Business Model Development',
    'Mentorship Programs',
    'Funding Assistance',
    'Market Entry Support',
    'Product Development',
    'Regulatory Guidance',
    'Investor Connections',
    'Scale-up Support'
  ],
  ARRAY[
    'Application & Selection',
    'Incubation Program',
    'Mentorship & Support',
    'Market Validation',
    'Launch & Scale'
  ],
  '6-12 months',
  'Equity participation'
);

-- Update the updated_at trigger
DROP TRIGGER IF EXISTS trg_services_updated_at ON public.services;
CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- From 20260416000000_create_ip_applications_schema.sql
-- Faculty IP Filing System - Database Schema
-- IPOPHL-compliant IP Application Management

-- ============================================
-- 1. IP APPLICATIONS TABLE (Main Records)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ip_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_number TEXT UNIQUE NOT NULL, -- Format: IP-YYYY-XXXXX
  faculty_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- IP Type
  ip_type TEXT NOT NULL CHECK (ip_type IN ('Patent', 'Utility Model', 'Industrial Design', 'Copyright')),
  
  -- Status Workflow
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN (
    'Draft',
    'Submitted for Internal Review',
    'Needs Revision',
    'Approved for IPOPHL Filing',
    'Filed to IPOPHL',
    'Under IPOPHL Examination',
    'Granted',
    'Rejected'
  )),
  
  -- Applicant Information
  applicant_full_name TEXT NOT NULL,
  applicant_address TEXT NOT NULL,
  applicant_nationality TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT,
  
  -- Invention/Work Details
  title TEXT NOT NULL CHECK (length(title) <= 200),
  abstract TEXT CHECK (length(abstract) >= 150 AND length(abstract) <= 250),
  field_of_technology TEXT,
  background_of_invention TEXT,
  detailed_description TEXT,
  summary_of_invention TEXT,
  
  -- Declaration
  declaration_confirmed BOOLEAN DEFAULT FALSE,
  declaration_date TIMESTAMPTZ,
  
  -- Co-inventors (stored as JSON array)
  co_inventors JSONB DEFAULT '[]'::jsonb,
  
  -- IPOPHL Filing Information (filled by admin)
  ipophl_filing_date DATE,
  ipophl_application_number TEXT,
  ipophl_publication_date DATE,
  ipophl_grant_date DATE,
  ipophl_office_actions JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  current_version INTEGER DEFAULT 1,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ
);

-- Indexes for ip_applications
CREATE INDEX IF NOT EXISTS idx_ip_applications_faculty_id ON public.ip_applications(faculty_id);
CREATE INDEX IF NOT EXISTS idx_ip_applications_status ON public.ip_applications(status);
CREATE INDEX IF NOT EXISTS idx_ip_applications_ip_type ON public.ip_applications(ip_type);
CREATE INDEX IF NOT EXISTS idx_ip_applications_application_number ON public.ip_applications(application_number);
CREATE INDEX IF NOT EXISTS idx_ip_applications_created_at ON public.ip_applications(created_at DESC);

-- ============================================
-- 2. IP APPLICATION CLAIMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ip_application_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.ip_applications(id) ON DELETE CASCADE,
  claim_number INTEGER NOT NULL,
  claim_type TEXT NOT NULL CHECK (claim_type IN ('independent', 'dependent')),
  claim_text TEXT NOT NULL,
  depends_on INTEGER, -- For dependent claims, references claim_number
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ip_application_claims_application_id ON public.ip_application_claims(application_id);
CREATE INDEX IF NOT EXISTS idx_ip_application_claims_claim_number ON public.ip_application_claims(application_id, claim_number);

-- ============================================
-- 3. IP APPLICATION ATTACHMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ip_application_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.ip_applications(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('drawing', 'document', 'supporting')),
  file_path TEXT NOT NULL, -- Supabase Storage path
  file_size INTEGER, -- in bytes
  mime_type TEXT,
  description TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ip_application_attachments_application_id ON public.ip_application_attachments(application_id);
CREATE INDEX IF NOT EXISTS idx_ip_application_attachments_file_type ON public.ip_application_attachments(file_type);

-- ============================================
-- 4. IP APPLICATION VERSIONS TABLE (Version Control)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ip_application_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.ip_applications(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  
  -- Snapshot of application data
  title TEXT,
  abstract TEXT,
  field_of_technology TEXT,
  background_of_invention TEXT,
  detailed_description TEXT,
  summary_of_invention TEXT,
  co_inventors JSONB,
  
  -- Change metadata
  change_summary TEXT,
  changed_by UUID REFERENCES auth.users(id),
  change_type TEXT CHECK (change_type IN ('auto_save', 'manual_save', 'revision')),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(application_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_ip_application_versions_application_id ON public.ip_application_versions(application_id);
CREATE INDEX IF NOT EXISTS idx_ip_application_versions_version_number ON public.ip_application_versions(application_id, version_number DESC);

-- ============================================
-- 5. IP APPLICATION STATUS HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ip_application_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.ip_applications(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  change_reason TEXT,
  ipophl_reference TEXT, -- For IPOPHL-related updates
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ip_application_status_history_application_id ON public.ip_application_status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_ip_application_status_history_created_at ON public.ip_application_status_history(created_at DESC);

-- ============================================
-- 6. IP APPLICATION COMMENTS TABLE (Reviewer Feedback)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ip_application_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.ip_applications(id) ON DELETE CASCADE,
  section TEXT CHECK (section IN ('general', 'applicant_info', 'abstract', 'claims', 'description', 'drawings')),
  comment TEXT NOT NULL,
  commented_by UUID REFERENCES auth.users(id),
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  parent_comment_id UUID REFERENCES public.ip_application_comments(id), -- For threaded comments
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ip_application_comments_application_id ON public.ip_application_comments(application_id);
CREATE INDEX IF NOT EXISTS idx_ip_application_comments_is_resolved ON public.ip_application_comments(is_resolved);

-- ============================================
-- 7. FACULTY NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.faculty_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.ip_applications(id) ON DELETE CASCADE,
  
  notification_type TEXT NOT NULL CHECK (notification_type IN (
    'submission_confirmed',
    'status_changed',
    'revision_required',
    'approved_for_filing',
    'filed_to_ipophl',
    'ipophl_update',
    'comment_added',
    'deadline_reminder'
  )),
  
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Action link
  action_url TEXT,
  action_text TEXT,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faculty_notifications_faculty_id ON public.faculty_notifications(faculty_id);
CREATE INDEX IF NOT EXISTS idx_faculty_notifications_is_read ON public.faculty_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_faculty_notifications_created_at ON public.faculty_notifications(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.ip_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_application_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_application_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_application_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_application_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_notifications ENABLE ROW LEVEL SECURITY;

-- IP Applications Policies
CREATE POLICY "Faculty can view own applications" ON public.ip_applications
  FOR SELECT USING (auth.uid() = faculty_id);

CREATE POLICY "Faculty can insert own applications" ON public.ip_applications
  FOR INSERT WITH CHECK (auth.uid() = faculty_id);

CREATE POLICY "Faculty can update own applications" ON public.ip_applications
  FOR UPDATE USING (auth.uid() = faculty_id AND status IN ('Draft', 'Needs Revision'));

CREATE POLICY "Admins can view all applications" ON public.ip_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all applications" ON public.ip_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Claims Policies
CREATE POLICY "Faculty can manage claims for own applications" ON public.ip_application_claims
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.ip_applications 
      WHERE id = application_id AND faculty_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all claims" ON public.ip_application_claims
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Attachments Policies
CREATE POLICY "Faculty can manage attachments for own applications" ON public.ip_application_attachments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.ip_applications 
      WHERE id = application_id AND faculty_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all attachments" ON public.ip_application_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Versions Policies
CREATE POLICY "Faculty can view versions for own applications" ON public.ip_application_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ip_applications 
      WHERE id = application_id AND faculty_id = auth.uid()
    )
  );

-- Status History Policies
CREATE POLICY "Faculty can view status history for own applications" ON public.ip_application_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ip_applications 
      WHERE id = application_id AND faculty_id = auth.uid()
    )
  );

-- Comments Policies
CREATE POLICY "Faculty can view comments for own applications" ON public.ip_application_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ip_applications 
      WHERE id = application_id AND faculty_id = auth.uid()
    )
  );

-- Notifications Policies
CREATE POLICY "Faculty can view own notifications" ON public.faculty_notifications
  FOR SELECT USING (auth.uid() = faculty_id);

CREATE POLICY "Faculty can update own notifications" ON public.faculty_notifications
  FOR UPDATE USING (auth.uid() = faculty_id);

-- ============================================
-- TRIGGERS AND FUNCTIONS
-- ============================================

-- Function to generate application number
CREATE OR REPLACE FUNCTION public.generate_application_number()
RETURNS TRIGGER AS $$
DECLARE
  year TEXT;
  sequence_num INTEGER;
  new_number TEXT;
BEGIN
  year := TO_CHAR(NOW(), 'YYYY');
  
  -- Get the next sequence number for this year
  SELECT COUNT(*) + 1 INTO sequence_num
  FROM public.ip_applications
  WHERE application_number LIKE 'IP-' || year || '-%';
  
  new_number := 'IP-' || year || '-' || LPAD(sequence_num::TEXT, 5, '0');
  
  NEW.application_number := new_number;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate application number
CREATE TRIGGER trigger_generate_application_number
  BEFORE INSERT ON public.ip_applications
  FOR EACH ROW
  WHEN (NEW.application_number IS NULL)
  EXECUTE FUNCTION public.generate_application_number();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_ip_applications_updated_at
  BEFORE UPDATE ON public.ip_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_ip_application_claims_updated_at
  BEFORE UPDATE ON public.ip_application_claims
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_ip_application_comments_updated_at
  BEFORE UPDATE ON public.ip_application_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to log status changes
CREATE OR REPLACE FUNCTION public.log_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.ip_application_status_history (
      application_id,
      from_status,
      to_status,
      changed_by,
      change_reason
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      auth.uid(),
      TG_ARGV[0]
    );
    
    -- Create notification for faculty
    INSERT INTO public.faculty_notifications (
      faculty_id,
      application_id,
      notification_type,
      title,
      message,
      action_url,
      action_text
    ) VALUES (
      NEW.faculty_id,
      NEW.id,
      'status_changed',
      'Application Status Updated',
      'Your application ' || NEW.application_number || ' status changed from ' || COALESCE(OLD.status, 'N/A') || ' to ' || NEW.status,
      '/faculty/applications/' || NEW.id,
      'View Application'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log status changes
CREATE TRIGGER trigger_log_status_change
  AFTER UPDATE ON public.ip_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.log_status_change();

-- Function to create initial version on application insert
CREATE OR REPLACE FUNCTION public.create_initial_version()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.ip_application_versions (
    application_id,
    version_number,
    title,
    abstract,
    field_of_technology,
    background_of_invention,
    detailed_description,
    summary_of_invention,
    co_inventors,
    change_summary,
    changed_by,
    change_type
  ) VALUES (
    NEW.id,
    1,
    NEW.title,
    NEW.abstract,
    NEW.field_of_technology,
    NEW.background_of_invention,
    NEW.detailed_description,
    NEW.summary_of_invention,
    NEW.co_inventors,
    'Initial version created',
    NEW.faculty_id,
    'manual_save'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create initial version
CREATE TRIGGER trigger_create_initial_version
  AFTER INSERT ON public.ip_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.create_initial_version();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.ip_applications TO authenticated;
GRANT ALL ON public.ip_application_claims TO authenticated;
GRANT ALL ON public.ip_application_attachments TO authenticated;
GRANT ALL ON public.ip_application_versions TO authenticated;
GRANT ALL ON public.ip_application_status_history TO authenticated;
GRANT ALL ON public.ip_application_comments TO authenticated;
GRANT ALL ON public.faculty_notifications TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;



-- Data Migration

-- Data for user_profiles
TRUNCATE TABLE user_profiles CASCADE;
INSERT INTO user_profiles (id, full_name, email, department, employee_id, phone, role, status, created_at, updated_at) VALUES ('533709e8-10c7-4b0d-868b-ef2419824223', 'kenneth cabibil', 'johnkenneth.cabibil@ustp.edu.ph', 'College of Engineering and Architecture', '2020306794', '09758843692', 'admin', 'active', '2026-03-23T01:56:06.441081+00:00', '2026-03-23T06:19:45.807701+00:00');
INSERT INTO user_profiles (id, full_name, email, department, employee_id, phone, role, status, created_at, updated_at) VALUES ('03ce847d-2260-4d28-8cc2-0f9b1849f445', 'Zebedee', 'eurizebedee19@gmail.com', 'Computer Engineering Department', '2020306794', '09758843692', 'faculty', 'active', '2026-04-02T06:41:16.869052+00:00', '2026-04-02T06:41:19.544792+00:00');

-- Data for activity_logs
TRUNCATE TABLE activity_logs CASCADE;
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('df37b391-47ce-42cf-9bec-76953172699f', '533709e8-10c7-4b0d-868b-ef2419824223', 'news', 'created', 'Data Management System Web Application in Philippine Port Authority Lanao del Norte/Iligan Could Possibly Get a Data Management System By This Week', 'News article created', '{"status":"Published","news_id":"0767477d-181c-4ef9-abc2-b697a6b7a26c","category":"Innovation"}'::jsonb, '2026-03-31T08:08:51.680377+00:00', '2026-03-31T08:08:51.680377+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('9ea6117d-11fc-4061-a366-76b54d52bd74', NULL, 'news', 'published', 'Data Management System Web Application in Philippine Port Authority Lanao del Norte/Iligan Could Possibly Get a Data Management System By This Week', NULL, NULL, '2026-03-31T08:08:53.059285+00:00', '2026-03-31T08:08:53.059285+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('0e71f566-d99a-42a6-a7ae-b52001af1285', '533709e8-10c7-4b0d-868b-ef2419824223', 'service', 'updated', 'IP Protection Services', 'Service request status changed to Done', '{"new_status":"Done","old_status":"Pending","request_id":"22fcd5bc-e58e-4b30-bfce-ff1f53a68e33"}'::jsonb, '2026-03-31T08:42:00.03247+00:00', '2026-03-31T08:42:00.03247+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('b5395371-bdab-49fe-a593-d21d5fc159c3', NULL, 'service', 'updated status', 'IP Protection Services', NULL, NULL, '2026-03-31T08:42:01.960909+00:00', '2026-03-31T08:42:01.960909+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('2e6874ae-441f-40a6-bffd-5de9ed2b59f3', NULL, 'service', 'archived', 'Service request archived', NULL, NULL, '2026-03-31T08:42:02.215245+00:00', '2026-03-31T08:42:02.215245+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('8376978f-2955-436a-8dfd-b686b536f09c', '533709e8-10c7-4b0d-868b-ef2419824223', 'event', 'created', 'Dummy Event', 'New event created', '{"date":"2026-04-02","type":"seminar","event_id":"4f8b7766-9862-4f31-898b-9931a84edd78"}'::jsonb, '2026-04-01T05:38:41.279934+00:00', '2026-04-01T05:38:41.279934+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('319aca76-0494-4d86-8817-17ffabca9fd7', NULL, 'event', 'created', 'Dummy Event', NULL, NULL, '2026-04-01T05:38:43.494563+00:00', '2026-04-01T05:38:43.494563+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('6f87482a-1323-4e3a-9116-a02337171222', '533709e8-10c7-4b0d-868b-ef2419824223', 'event', 'created', 'Dummy Event 2', 'New event created', '{"date":"2026-04-03","type":"conference","event_id":"dbfe2ca5-63d9-4da7-9774-10bdd4289974"}'::jsonb, '2026-04-01T05:46:38.947381+00:00', '2026-04-01T05:46:38.947381+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('48aa0515-176a-4097-8f99-a7a2a365d380', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'updated', 'Device Scanner', 'Patent/technology updated', '{"patent_id":"1cea8abe-cdc9-4819-ac00-8b8876a4c588","new_status":"Available","old_status":"Available"}'::jsonb, '2026-04-01T06:08:17.21012+00:00', '2026-04-01T06:08:17.21012+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('d806788a-a68d-4720-82df-00bf2d8a8685', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'added', 'Mobile Platform', 'New patent/technology added', '{"field":"information-technology","status":"Under Review","patent_id":"2774c527-cd85-468d-b64d-b460501216e7"}'::jsonb, '2026-04-01T06:09:43.962694+00:00', '2026-04-01T06:09:43.962694+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('0e079101-356f-4162-ab31-ae82bd2cb0cf', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'updated', 'Mobile Platform External', 'Patent/technology updated', '{"patent_id":"2774c527-cd85-468d-b64d-b460501216e7","new_status":"Under Review","old_status":"Under Review"}'::jsonb, '2026-04-01T06:11:09.685703+00:00', '2026-04-01T06:11:09.685703+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('16f9b230-3d43-4151-9ab6-9df38cc19c39', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'updated', 'Mobile Device Platform External', 'Patent/technology updated', '{"patent_id":"2774c527-cd85-468d-b64d-b460501216e7","new_status":"Under Review","old_status":"Under Review"}'::jsonb, '2026-04-01T06:28:56.280326+00:00', '2026-04-01T06:28:56.280326+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('413a43bd-1c97-457c-91ea-35d943a2b8d4', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'updated', 'Device Scanner', 'Patent/technology updated', '{"patent_id":"1cea8abe-cdc9-4819-ac00-8b8876a4c588","new_status":"Available","old_status":"Available"}'::jsonb, '2026-04-01T06:30:07.827947+00:00', '2026-04-01T06:30:07.827947+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('cc7612e7-ce62-4cad-a555-defe7a756792', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'deleted', 'Mobile Device Platform External', 'Patent/technology deleted', '{"patent_id":"2774c527-cd85-468d-b64d-b460501216e7"}'::jsonb, '2026-04-01T06:42:37.807523+00:00', '2026-04-01T06:42:37.807523+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('0a2e7fe3-0351-4419-a1ca-9604f5057257', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'added', 'Mobile Device Platform External', 'New patent/technology added', '{"field":"information-technology","status":"Under Review","patent_id":"86719d24-da0f-4a7e-9d7d-d7173aeba37a"}'::jsonb, '2026-04-01T06:49:01.407406+00:00', '2026-04-01T06:49:01.407406+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('cbf1e700-9dde-4498-bf78-592e1a781ad8', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'updated', 'Mobile Device Platform External', 'Patent/technology updated', '{"patent_id":"86719d24-da0f-4a7e-9d7d-d7173aeba37a","new_status":"Under Review","old_status":"Under Review"}'::jsonb, '2026-04-01T06:54:17.758104+00:00', '2026-04-01T06:54:17.758104+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('b646089e-d17a-4e9a-b3d1-f369840fd931', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'updated', 'Device Scanner', 'Patent/technology updated', '{"patent_id":"1cea8abe-cdc9-4819-ac00-8b8876a4c588","new_status":"Available","old_status":"Available"}'::jsonb, '2026-04-01T06:55:15.304211+00:00', '2026-04-01T06:55:15.304211+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('77b46747-6b8f-4193-9afe-8e230da1d98b', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'updated', 'Device Scanner', 'Patent/technology updated', '{"patent_id":"1cea8abe-cdc9-4819-ac00-8b8876a4c588","new_status":"Available","old_status":"Available"}'::jsonb, '2026-04-01T06:57:31.58734+00:00', '2026-04-01T06:57:31.58734+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('15f44f4b-a72c-4627-9b1a-13af10817ff4', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'updated', 'Device Scanner External', 'Patent/technology updated', '{"patent_id":"1cea8abe-cdc9-4819-ac00-8b8876a4c588","new_status":"Available","old_status":"Available"}'::jsonb, '2026-04-01T07:06:12.306815+00:00', '2026-04-01T07:06:12.306815+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('e861a7ad-ff29-4e78-8a40-54ce2698eafe', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'updated', 'Mobile Device Platform External', 'Patent/technology updated', '{"patent_id":"86719d24-da0f-4a7e-9d7d-d7173aeba37a","new_status":"Under Review","old_status":"Under Review"}'::jsonb, '2026-04-01T07:15:37.122842+00:00', '2026-04-01T07:15:37.122842+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('a12398c7-5d80-458f-b0e3-1b2f64bbeba8', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'updated', 'Mobile Device Platform External', 'Patent/technology updated', '{"patent_id":"86719d24-da0f-4a7e-9d7d-d7173aeba37a","new_status":"Under Review","old_status":"Under Review"}'::jsonb, '2026-04-01T07:32:50.179022+00:00', '2026-04-01T07:32:50.179022+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('ddc26a3d-3d89-4148-97d1-1abc85d686de', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'updated', 'Mobile Device Platform External', 'Patent/technology updated', '{"patent_id":"86719d24-da0f-4a7e-9d7d-d7173aeba37a","new_status":"Under Review","old_status":"Under Review"}'::jsonb, '2026-04-01T07:34:30.180197+00:00', '2026-04-01T07:34:30.180197+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('f1c3c463-b3e6-4827-be92-993ba9b26be8', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'updated', 'Mobile Device Platform Externalllll', 'Patent/technology updated', '{"patent_id":"86719d24-da0f-4a7e-9d7d-d7173aeba37a","new_status":"Under Review","old_status":"Under Review"}'::jsonb, '2026-04-01T07:36:05.841319+00:00', '2026-04-01T07:36:05.841319+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('0a43a855-bf40-4915-a8dc-8cfe611cf4fd', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'updated', 'Device Scanner External', 'Patent/technology updated', '{"patent_id":"1cea8abe-cdc9-4819-ac00-8b8876a4c588","new_status":"Available","old_status":"Available"}'::jsonb, '2026-04-01T07:36:27.348534+00:00', '2026-04-01T07:36:27.348534+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('812690c0-d78e-4fb8-8586-dd1aa5fa5332', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'updated', 'Device Scanner Externallll', 'Patent/technology updated', '{"patent_id":"1cea8abe-cdc9-4819-ac00-8b8876a4c588","new_status":"Available","old_status":"Available"}'::jsonb, '2026-04-01T07:36:54.132331+00:00', '2026-04-01T07:36:54.132331+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('70b95074-194b-4cf2-a504-6026ebc83100', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'added', 'Agriculture Database Management System', 'New patent/technology added', '{"field":"agriculture","status":"Available","patent_id":"9e3828e5-0c4e-4a31-a6bb-fb1b55e9e54e"}'::jsonb, '2026-04-02T03:13:09.688777+00:00', '2026-04-02T03:13:09.688777+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('b1efd0c8-039e-413d-b680-fc0bc8f6a1ec', '533709e8-10c7-4b0d-868b-ef2419824223', 'service', 'received', 'Technology Assessment', 'New service request from Dekel Bar', '{"request_id":"b999604d-aa43-4a11-82d8-70ff7f01a08e","organization":"LGU","service_type":"assessment"}'::jsonb, '2026-04-02T03:28:07.559438+00:00', '2026-04-02T03:28:07.559438+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('af97d306-9fa0-40c9-a8dc-54a05793cee3', NULL, 'user', 'deleted', 'cathy', NULL, NULL, '2026-04-02T06:38:19.058284+00:00', '2026-04-02T06:38:19.058284+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('602536ff-21b0-4f54-8951-de003e7c4941', NULL, 'user', 'deleted', 'zeb zeb', NULL, NULL, '2026-04-02T06:40:14.897834+00:00', '2026-04-02T06:40:14.897834+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('f1d52a3e-fffb-4c59-b470-d9639e74383d', NULL, 'user', 'created', 'Zebedee', NULL, NULL, '2026-04-02T06:41:22.429414+00:00', '2026-04-02T06:41:22.429414+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('b1b442c1-74f5-47df-9224-a29cbe322688', '533709e8-10c7-4b0d-868b-ef2419824223', 'service', 'received', 'IP Protection Services', 'New service request from Kenneth Cabibil', '{"request_id":"5cec9b8c-289e-4182-b842-281484f24749","organization":"Department of Computer Engineering (USTP-CDO)","service_type":"ip-protection"}'::jsonb, '2026-04-02T07:28:26.709303+00:00', '2026-04-02T07:28:26.709303+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('13303fb4-5ef1-431a-bd07-f839daa6f8b7', '533709e8-10c7-4b0d-868b-ef2419824223', 'service', 'updated', 'IP Protection Services', 'Service request status changed to In Progress', '{"new_status":"In Progress","old_status":"Pending","request_id":"5cec9b8c-289e-4182-b842-281484f24749"}'::jsonb, '2026-04-02T07:31:28.764702+00:00', '2026-04-02T07:31:28.764702+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('5218e279-f421-4ef1-8831-a3e6fb1adc64', NULL, 'service', 'updated status', 'IP Protection Services', NULL, NULL, '2026-04-02T07:31:29.03743+00:00', '2026-04-02T07:31:29.03743+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('a35ee260-a6a2-4129-809f-b76b4f1ed2a6', '533709e8-10c7-4b0d-868b-ef2419824223', 'service', 'received', 'IP Protection Services', 'New service request from Migs Johns', '{"request_id":"cb47bd1f-3ae1-4874-8978-f8af182515ff","organization":"LGU-Iligan","service_type":"ip-protection"}'::jsonb, '2026-04-02T08:09:57.502112+00:00', '2026-04-02T08:09:57.502112+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('73b21c85-e287-4bf1-be0a-a1435bd836b1', NULL, 'resource', 'added', 'IP Procedure Oroquieta and Panaon', NULL, NULL, '2026-04-18T07:38:47.242661+00:00', '2026-04-18T07:38:47.242661+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('922915c9-32dd-4cf0-a218-e6baee71aebe', NULL, 'resource', 'added', 'Patent Search Strategies', NULL, NULL, '2026-04-18T07:41:04.93198+00:00', '2026-04-18T07:41:04.93198+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('02547896-074a-45cb-86ea-1b04cc39cf17', '03ce847d-2260-4d28-8cc2-0f9b1849f445', 'news', 'created', 'Artemis II''s moon-traveling astronauts return home to cheers after a record-breaking trip', 'News article created', '{"status":"Published","news_id":"221c8d61-9474-4563-b027-0c86941d96ce","category":"Innovation"}'::jsonb, '2026-04-13T02:17:28.804921+00:00', '2026-04-13T02:17:28.804921+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('a8346092-def6-4a2a-b5ff-1792cc9885f6', '03ce847d-2260-4d28-8cc2-0f9b1849f445', 'news', 'updated', 'Artemis II''s moon-traveling astronauts return home to cheers after a record-breaking trip', 'News article updated', '{"news_id":"221c8d61-9474-4563-b027-0c86941d96ce","category":"Innovation"}'::jsonb, '2026-04-13T02:18:18.457894+00:00', '2026-04-13T02:18:18.457894+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('4795767b-2b4e-44eb-b7bf-8204c38b2155', '03ce847d-2260-4d28-8cc2-0f9b1849f445', 'news', 'updated', 'Artemis II''s moon-traveling astronauts return home to cheers after a record-breaking trip', 'News article updated', '{"news_id":"221c8d61-9474-4563-b027-0c86941d96ce","category":"Innovation"}'::jsonb, '2026-04-13T02:19:05.267096+00:00', '2026-04-13T02:19:05.267096+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('8b339cc3-1079-4795-a77a-b5392991a78a', '533709e8-10c7-4b0d-868b-ef2419824223', 'service', 'received', 'IP Protection Services', 'New service request from Cate Cate', '{"request_id":"4fdef272-3225-4d60-acf8-86b21a0b5c48","organization":"CPE Department","service_type":"ip-protection"}'::jsonb, '2026-04-16T06:00:24.732882+00:00', '2026-04-16T06:00:24.732882+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('bb36460c-6584-4770-b91a-a79425708b38', '533709e8-10c7-4b0d-868b-ef2419824223', 'service', 'updated', 'IP Protection Services', 'Service request status changed to In Progress', '{"new_status":"In Progress","old_status":"Pending","request_id":"4fdef272-3225-4d60-acf8-86b21a0b5c48"}'::jsonb, '2026-04-16T06:05:36.23387+00:00', '2026-04-16T06:05:36.23387+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('b0c123ba-645d-47d3-b896-0ac72a483ee9', NULL, 'service', 'updated status', 'IP Protection Services', NULL, NULL, '2026-04-16T06:05:36.994506+00:00', '2026-04-16T06:05:36.994506+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('752e2f8a-a4ac-4cc2-8752-8bb1d76e1871', '533709e8-10c7-4b0d-868b-ef2419824223', 'service', 'updated', 'IP Protection Services', 'Service request status changed to Completed', '{"new_status":"Completed","old_status":"In Progress","request_id":"4fdef272-3225-4d60-acf8-86b21a0b5c48"}'::jsonb, '2026-04-16T06:05:37.391789+00:00', '2026-04-16T06:05:37.391789+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('9b18b469-ccd2-4fc2-a79c-6f961e45d678', NULL, 'service', 'updated status', 'IP Protection Services', NULL, NULL, '2026-04-16T06:05:47.366639+00:00', '2026-04-16T06:05:47.366639+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('54d3b873-9699-44ae-99b8-5dec32b464ad', '533709e8-10c7-4b0d-868b-ef2419824223', 'service', 'received', 'Technology Licensing', 'New service request from Lloyd', '{"request_id":"088b2a6b-ab84-4108-a0ea-54ae55b0ce04","organization":"IT Department","service_type":"technology-licensing"}'::jsonb, '2026-04-18T05:58:39.092726+00:00', '2026-04-18T05:58:39.092726+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('d4875dcb-2c09-4f37-a208-244acbaf4a3d', '533709e8-10c7-4b0d-868b-ef2419824223', 'service', 'received', 'Technology Licensing', 'New service request from Vincent Uy', '{"request_id":"482bde40-b2ad-4619-856f-ebc1ee841eb3","organization":"PPA","service_type":"technology-licensing"}'::jsonb, '2026-04-18T06:04:58.966363+00:00', '2026-04-18T06:04:58.966363+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('eda2d59c-87c8-4385-989f-84aa706f834f', '533709e8-10c7-4b0d-868b-ef2419824223', 'service', 'updated', 'IP Protection Services', 'Service request status changed to Done', '{"new_status":"Done","old_status":"In Progress","request_id":"5cec9b8c-289e-4182-b842-281484f24749"}'::jsonb, '2026-04-18T06:05:29.639874+00:00', '2026-04-18T06:05:29.639874+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('63b46053-3fba-4135-b4de-48c38ed254b4', NULL, 'service', 'updated status', 'IP Protection Services', NULL, NULL, '2026-04-18T06:05:32.012957+00:00', '2026-04-18T06:05:32.012957+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('b8b27d7a-4c3b-4017-aab2-a8d6e894049b', '533709e8-10c7-4b0d-868b-ef2419824223', 'service', 'updated', 'Technology Assessment', 'Service request status changed to Completed', '{"new_status":"Completed","old_status":"Pending","request_id":"b999604d-aa43-4a11-82d8-70ff7f01a08e"}'::jsonb, '2026-04-18T06:05:37.566172+00:00', '2026-04-18T06:05:37.566172+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('db56c94d-37e6-4610-baf0-f014835239a8', NULL, 'service', 'updated status', 'Technology Assessment', NULL, NULL, '2026-04-18T06:05:42.624837+00:00', '2026-04-18T06:05:42.624837+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('ce3ff9a4-8ad7-4e8a-a643-21cd9ed10036', '533709e8-10c7-4b0d-868b-ef2419824223', 'service', 'updated', 'IP Protection Services', 'Service request status changed to Done', '{"new_status":"Done","old_status":"Pending","request_id":"cb47bd1f-3ae1-4874-8978-f8af182515ff"}'::jsonb, '2026-04-18T06:05:59.504332+00:00', '2026-04-18T06:05:59.504332+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('8b65a2b9-b7c6-4f06-832c-18b6fcedf994', NULL, 'service', 'updated status', 'IP Protection Services', NULL, NULL, '2026-04-18T06:06:00.621338+00:00', '2026-04-18T06:06:00.621338+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('554b038b-b22e-47be-a976-d75e151ba9df', '533709e8-10c7-4b0d-868b-ef2419824223', 'service', 'received', 'Startup Incubation', 'New service request from Michael Bright', '{"request_id":"c4c0b934-78ad-42e8-bc0b-2cff05a36add","organization":"Space Agency Philippines","service_type":"startup-incubation"}'::jsonb, '2026-04-18T06:06:38.496473+00:00', '2026-04-18T06:06:38.496473+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('2d544f20-f3ee-4ab5-9d73-fa1489efbca5', '533709e8-10c7-4b0d-868b-ef2419824223', 'service', 'received', 'Startup Incubation', 'New service request from John Benns', '{"request_id":"a7726327-2762-48ee-ac51-8591610b4671","organization":"Department of National Irrigation","service_type":"startup-incubation"}'::jsonb, '2026-04-18T06:07:28.646177+00:00', '2026-04-18T06:07:28.646177+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('df18656e-749e-4554-9d1f-384be695ad15', '533709e8-10c7-4b0d-868b-ef2419824223', 'service', 'received', 'Technology Licensing', 'New service request from Anna Leight', '{"request_id":"2759b1af-d322-4e2c-967c-f4800ed21e7f","organization":"Philippine PB ","service_type":"technology-licensing"}'::jsonb, '2026-04-18T06:08:11.142269+00:00', '2026-04-18T06:08:11.142269+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('c328ef81-fff0-404e-b4d6-7c8f6366ace0', '533709e8-10c7-4b0d-868b-ef2419824223', 'service', 'updated', 'Technology Licensing', 'Service request status changed to Done', '{"new_status":"Done","old_status":"Pending","request_id":"088b2a6b-ab84-4108-a0ea-54ae55b0ce04"}'::jsonb, '2026-04-18T06:08:23.000417+00:00', '2026-04-18T06:08:23.000417+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('acc25551-44a5-4730-aef9-fa3db7460f0e', NULL, 'service', 'updated status', 'Technology Licensing', NULL, NULL, '2026-04-18T06:08:24.354407+00:00', '2026-04-18T06:08:24.354407+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('2a44a2be-1e04-4766-9442-5cf61741939d', NULL, 'resource', 'deleted', 'Memorandum of Understanding (MOU)', NULL, NULL, '2026-04-18T06:11:23.980888+00:00', '2026-04-18T06:11:23.980888+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('7167a4c2-c2fa-422f-9970-855c9059a708', NULL, 'resource', 'deleted', 'Non-Disclosure Agreement (NDA)', NULL, NULL, '2026-04-18T06:11:56.402103+00:00', '2026-04-18T06:11:56.402103+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('1c3a8513-9a2e-40ac-a900-5081d6866f9b', NULL, 'resource', 'deleted', 'Non-Disclosure Agreement (NDA)', NULL, NULL, '2026-04-18T06:43:41.711162+00:00', '2026-04-18T06:43:41.711162+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('613703d9-37a4-4013-aaea-c5713b8937e7', '533709e8-10c7-4b0d-868b-ef2419824223', 'service', 'received', 'IP Training & Workshops', 'New service request from Zane Nade', '{"request_id":"f11bad45-64ae-44d0-96e7-85fc4eaed71a","organization":"Barangay Council Lapasan","service_type":"training"}'::jsonb, '2026-04-18T06:57:27.364646+00:00', '2026-04-18T06:57:27.364646+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('dcd799d3-5849-4d01-b920-685b8f050db9', NULL, 'resource', 'deleted', 'Non-Disclosure Agreement (NDA)', NULL, NULL, '2026-04-18T07:06:57.064481+00:00', '2026-04-18T07:06:57.064481+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('45dfe262-e8e6-49d4-bc5b-afe0fde4524f', NULL, 'resource', 'added', 'Deed of Assignment 2026', NULL, NULL, '2026-04-18T07:18:27.233393+00:00', '2026-04-18T07:18:27.233393+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('7e06cab0-ef4b-4af1-9112-6ee8d2962580', NULL, 'resource', 'added', 'Joint Affidavit of Inventorship and Contribution', NULL, NULL, '2026-04-18T07:19:39.761452+00:00', '2026-04-18T07:19:39.761452+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('2ff780f2-25a1-46e1-b9e2-f1bf5d35cf94', NULL, 'resource', 'added', 'Patent Specification Template with Guide', NULL, NULL, '2026-04-18T07:20:46.140324+00:00', '2026-04-18T07:20:46.140324+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('74dabb5e-949c-4afb-8493-f2f791f362bd', NULL, 'resource', 'added', 'Technology Utilization Plan', NULL, NULL, '2026-04-18T07:22:01.101244+00:00', '2026-04-18T07:22:01.101244+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('515ce6cf-baa0-4317-bff6-cd26102932ad', NULL, 'resource', 'updated', 'ITSOS Request Form MD1', NULL, NULL, '2026-04-18T07:22:41.579618+00:00', '2026-04-18T07:22:41.579618+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('5f38efcb-9305-4a1e-91d6-48a1d42cc460', NULL, 'resource', 'added', 'ITSOS REQUEST FORM', NULL, NULL, '2026-04-18T07:23:11.419422+00:00', '2026-04-18T07:23:11.419422+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('607f0cdd-f6f0-4da1-b761-2067c482ac91', NULL, 'resource', 'updated', 'IPHOPHL Fillable Form', NULL, NULL, '2026-04-18T07:24:41.357117+00:00', '2026-04-18T07:24:41.357117+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('12d3a957-dfff-41d9-817c-13646d4c4edc', NULL, 'resource', 'updated', 'IPHOPHL Fillable Form 100', NULL, NULL, '2026-04-18T07:25:17.000645+00:00', '2026-04-18T07:25:17.000645+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('adaf6739-e1e9-4824-8d0b-e69387b268b2', NULL, 'resource', 'added', 'IPOPHL Fillable Form 110', NULL, NULL, '2026-04-18T07:25:57.354023+00:00', '2026-04-18T07:25:57.354023+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('234d78e9-1e46-4606-bcd1-5535f3332f61', NULL, 'resource', 'added', 'IPHOPHL Fillable Form 300', NULL, NULL, '2026-04-18T07:26:34.760682+00:00', '2026-04-18T07:26:34.760682+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('1f510a99-f250-40f5-80e5-96144298bed9', NULL, 'resource', 'added', 'IPOPHL Fillable Form 400', NULL, NULL, '2026-04-18T07:27:11.037662+00:00', '2026-04-18T07:27:11.037662+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('fc1b5541-2ad2-4e7e-bbfc-dab8dfcc4542', NULL, 'resource', 'added', 'Copyright Registry Enrollment Form 2025', NULL, NULL, '2026-04-18T07:28:05.000383+00:00', '2026-04-18T07:28:05.000383+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('d3078da4-dced-47ff-9e51-2395c2f7a13a', NULL, 'resource', 'added', 'Supplemental Form 2025', NULL, NULL, '2026-04-18T07:28:54.452071+00:00', '2026-04-18T07:28:54.452071+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('3a1ea145-c09e-47d4-a688-1d29b22cec21', NULL, 'resource', 'added', 'TRL Assessment Form', NULL, NULL, '2026-04-18T07:29:23.088791+00:00', '2026-04-18T07:29:23.088791+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('d47b1b92-3edb-4b12-be80-38dd7d213aa4', NULL, 'resource', 'added', 'Patent Overview and Patent Information', NULL, NULL, '2026-04-18T07:31:11.559133+00:00', '2026-04-18T07:31:11.559133+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('796edc5e-cdfe-4d87-b1b7-8ecae54eb3fb', NULL, 'resource', 'added', 'Keyword Searching', NULL, NULL, '2026-04-18T07:31:40.499436+00:00', '2026-04-18T07:31:40.499436+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('9ebe5d80-277e-4897-ba6f-ab981ab60376', NULL, 'resource', 'added', 'Drafting of Specification', NULL, NULL, '2026-04-18T07:32:19.326308+00:00', '2026-04-18T07:32:19.326308+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('dd858376-9cfe-4b50-abb1-86f549fd4ea1', NULL, 'resource', 'updated', 'Keyword Searching', NULL, NULL, '2026-04-18T07:32:34.186616+00:00', '2026-04-18T07:32:34.186616+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('ca03a6ec-d0d7-4955-9e21-064e28bc3e66', NULL, 'resource', 'added', 'Patent Drawing', NULL, NULL, '2026-04-18T07:33:25.708084+00:00', '2026-04-18T07:33:25.708084+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('48ff4271-fa93-4291-9040-13d2979c22c5', NULL, 'resource', 'added', 'Classification of Patent Documents', NULL, NULL, '2026-04-18T07:34:04.449427+00:00', '2026-04-18T07:34:04.449427+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('321ec472-e966-4917-9cc8-b858827b503e', NULL, 'resource', 'added', 'IP Procedure', NULL, NULL, '2026-04-18T07:34:29.66226+00:00', '2026-04-18T07:34:29.66226+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('28149da4-4fee-4668-b5b0-e14c5a86bba6', NULL, 'resource', 'added', 'IP System', NULL, NULL, '2026-04-18T07:40:08.145144+00:00', '2026-04-18T07:40:08.145144+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('c9247422-7277-44b3-bd9f-5b3d4a208da3', NULL, 'resource', 'added', 'Patent Specification 2 Detailed Description Drafting', NULL, NULL, '2026-04-18T07:43:21.781187+00:00', '2026-04-18T07:43:21.781187+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('35209b5d-f013-4bf2-ba9a-9776111e33ef', NULL, 'resource', 'added', 'Patent Specification Claims Drafting', NULL, NULL, '2026-04-18T07:44:14.381531+00:00', '2026-04-18T07:44:14.381531+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('08939d38-3697-41d9-bbe4-f64b8169ed8b', NULL, 'resource', 'added', 'Patentability Requirements', NULL, NULL, '2026-04-18T07:45:02.731696+00:00', '2026-04-18T07:45:02.731696+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('68ba388b-4819-4525-8886-36eba370c9a2', NULL, 'resource', 'added', 'Technology Transfer', NULL, NULL, '2026-04-18T07:45:56.351734+00:00', '2026-04-18T07:45:56.351734+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('06a15025-51f4-4fd7-8445-043effb24e9b', NULL, 'resource', 'added', 'IP Application Process and Requirements', NULL, NULL, '2026-04-18T07:47:09.768225+00:00', '2026-04-18T07:47:09.768225+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('b57142a6-a01d-4f21-b1d8-6b006a3dba94', NULL, 'resource', 'added', 'DPM-USTP-TPCO-001-ITSU', NULL, NULL, '2026-04-18T07:48:42.258511+00:00', '2026-04-18T07:48:42.258511+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('145acb4d-8920-4160-b13a-0ffb6e17ee75', NULL, 'resource', 'added', 'DPM-USTP-TPCO-002-PMU', NULL, NULL, '2026-04-18T07:50:17.953736+00:00', '2026-04-18T07:50:17.953736+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('bec1be3d-1671-42b8-a01f-1ec5c99e780b', NULL, 'resource', 'unpublished', 'DPM-USTP-TPCO-002-PMU', NULL, NULL, '2026-04-18T07:50:19.966984+00:00', '2026-04-18T07:50:19.966984+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('e1d014d9-07e5-4a5e-9c88-cab0bb2ad3d4', NULL, 'resource', 'added', 'DPM-USTP-TPCO-003 - BDU', NULL, NULL, '2026-04-18T07:51:19.246389+00:00', '2026-04-18T07:51:19.246389+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('13015fed-1228-4299-806f-e98397f34b3e', NULL, 'resource', 'unpublished', 'DPM-USTP-TPCO-003 - BDU', NULL, NULL, '2026-04-18T07:51:20.768572+00:00', '2026-04-18T07:51:20.768572+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('9837595e-b73f-4070-878e-0a069041cea8', NULL, 'resource', 'added', 'GUI for GA Optimization (Compasan)', NULL, NULL, '2026-04-18T07:52:05.75594+00:00', '2026-04-18T07:52:05.75594+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('29bf94d8-65d9-4834-8904-65a227363a83', '533709e8-10c7-4b0d-868b-ef2419824223', 'news', 'created', 'DOST calls for more investments in Filipino innovations', 'News article created', '{"status":"Draft","news_id":"05585d0a-bbd4-4064-a179-8dc504cb1aeb","category":"Innovation"}'::jsonb, '2026-04-19T01:25:35.121138+00:00', '2026-04-19T01:25:35.121138+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('dfbbf031-80f7-49a0-ac71-4acb6824bb3e', '533709e8-10c7-4b0d-868b-ef2419824223', 'news', 'published', 'DOST calls for more investments in Filipino innovations', 'News article published', '{"news_id":"05585d0a-bbd4-4064-a179-8dc504cb1aeb","category":"Innovation"}'::jsonb, '2026-04-19T01:30:20.204264+00:00', '2026-04-19T01:30:20.204264+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('98817d1b-1a9b-4ded-8ac2-aa4015e93674', '533709e8-10c7-4b0d-868b-ef2419824223', 'news', 'created', 'USTP earns IPOPHL Platinum Award at 2026 ITSO Presidents’ Summit', 'News article created', '{"status":"Published","news_id":"efedb410-5da6-4ccb-815b-fe93792e437e","category":"Events"}'::jsonb, '2026-04-19T01:42:43.52214+00:00', '2026-04-19T01:42:43.52214+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('a08e06ad-7f26-4426-a279-7507a37ef4bc', '533709e8-10c7-4b0d-868b-ef2419824223', 'news', 'deleted', 'Data Management System Web Application in Philippine Port Authority Lanao del Norte/Iligan Could Possibly Get a Data Management System By This Week', 'News article deleted', '{"news_id":"0767477d-181c-4ef9-abc2-b697a6b7a26c"}'::jsonb, '2026-04-19T01:49:38.023081+00:00', '2026-04-19T01:49:38.023081+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('a6eddb2c-3895-478f-a13b-9f3f820d1a1d', '533709e8-10c7-4b0d-868b-ef2419824223', 'news', 'deleted', 'USTP earns IPOPHL Platinum Award at 2026 ITSO Presidents’ Summit', 'News article deleted', '{"news_id":"efedb410-5da6-4ccb-815b-fe93792e437e"}'::jsonb, '2026-04-19T01:51:17.137808+00:00', '2026-04-19T01:51:17.137808+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('2880b3df-4af9-45ba-baab-49779f1087a3', '533709e8-10c7-4b0d-868b-ef2419824223', 'news', 'deleted', 'DOST calls for more investments in Filipino innovations', 'News article deleted', '{"news_id":"05585d0a-bbd4-4064-a179-8dc504cb1aeb"}'::jsonb, '2026-04-19T01:51:24.112731+00:00', '2026-04-19T01:51:24.112731+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('c1eba95e-c870-4484-965f-0b5f1ce12165', '533709e8-10c7-4b0d-868b-ef2419824223', 'news', 'deleted', 'test creating news article', 'News article deleted', '{"news_id":"2e31683c-fbe0-497e-b09f-887e869d09c3"}'::jsonb, '2026-04-19T01:51:28.000454+00:00', '2026-04-19T01:51:28.000454+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('76c2b4a3-6579-40a6-8c7b-5b6af1794dff', '533709e8-10c7-4b0d-868b-ef2419824223', 'news', 'deleted', 'test creating news article', 'News article deleted', '{"news_id":"7cd39cec-5fa0-4a32-aab7-31d332e7f395"}'::jsonb, '2026-04-19T01:51:38.77184+00:00', '2026-04-19T01:51:38.77184+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('c164d0b0-8b5e-479c-9b98-2e6d377b5b67', '533709e8-10c7-4b0d-868b-ef2419824223', 'news', 'created', 'USTP earns IPOPHL Platinum Award at 2026 ITSO Presidents’ Summit', 'News article created', '{"status":"Published","news_id":"d8824beb-438f-4aee-96d1-087e397a5a39","category":"Events"}'::jsonb, '2026-04-19T01:56:52.109403+00:00', '2026-04-19T01:56:52.109403+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('81c54308-2004-4093-b5a8-1f8e467820c6', '533709e8-10c7-4b0d-868b-ef2419824223', 'news', 'created', 'USTP TPCO earns top spots at 3rd LIKHA Conference 2025', 'News article created', '{"status":"Published","news_id":"d11fb608-f120-4c90-b263-6c3e09432e94","category":"Events"}'::jsonb, '2026-04-19T02:02:23.840432+00:00', '2026-04-19T02:02:23.840432+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('9a4d3ea8-b83b-45e4-bc3b-1bd1cb4ebd8b', '533709e8-10c7-4b0d-868b-ef2419824223', 'news', 'deleted', 'Artemis II''s moon-traveling astronauts return home to cheers after a record-breaking trip', 'News article deleted', '{"news_id":"221c8d61-9474-4563-b027-0c86941d96ce"}'::jsonb, '2026-04-19T02:02:57.358414+00:00', '2026-04-19T02:02:57.358414+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('2026df36-a8c3-4792-8eb8-279dbb7d27e8', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'added', 'Nutritional Food Scale System and Method for Diet Management', 'New patent/technology added', '{"field":"food","status":"Licensed","patent_id":"cb175efe-7e04-4c8c-8a00-6a81a262efe4"}'::jsonb, '2026-04-19T02:15:04.906532+00:00', '2026-04-19T02:15:04.906532+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('7c597765-e66d-4876-9deb-73198ea7ac75', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'added', 'Nutritional Food Scale System and Method for Diet Management', 'New patent/technology added', '{"field":"software","status":"Filed","patent_id":"a3742f22-a72a-44a7-9ef5-62a4df429603"}'::jsonb, '2026-04-19T03:33:39.952146+00:00', '2026-04-19T03:33:39.952146+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('1b6dd27e-1b85-4c6a-a334-6602bafb64ab', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'deleted', 'Nutritional Food Scale System and Method for Diet Management', 'Patent/technology deleted', '{"patent_id":"cb175efe-7e04-4c8c-8a00-6a81a262efe4"}'::jsonb, '2026-04-19T03:33:47.263002+00:00', '2026-04-19T03:33:47.263002+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('e1f7a151-de98-44d8-83bf-5f5f4c0ad6d4', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'added', 'Nutritional Food Scale System and Method for Diet Management', 'New patent/technology added', '{"field":"software","status":"Filed","patent_id":"de2c1b75-6fb4-41fa-a16c-541ea0bcc2b0"}'::jsonb, '2026-04-19T06:29:44.815012+00:00', '2026-04-19T06:29:44.815012+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('f684cc97-3aae-467b-b93a-e79984bdf2b2', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'added', 'Agriculture Database Management System', 'New patent/technology added', '{"field":"Anna Bright","status":"agriculture","patent_id":"213260a4-cc89-4b2d-b4f3-2442a2ca07f4"}'::jsonb, '2026-04-19T06:29:45.00887+00:00', '2026-04-19T06:29:45.00887+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('afc3a427-2631-4e3a-9b44-6ca6f4124624', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'added', 'This is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy description', 'New patent/technology added', '{"field":"","status":"Pending","patent_id":"00d8fb5b-b508-4daf-b458-50d139a386c7"}'::jsonb, '2026-04-19T06:29:45.15376+00:00', '2026-04-19T06:29:45.15376+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('45bebbe4-5b32-4db7-b70f-5e10267c2fe4', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'added', 'Mobile Device Platform Externalllll', 'New patent/technology added', '{"field":"et. al. johnlen","status":"information-technology","patent_id":"09aec510-cf29-4ac6-816c-db3831972522"}'::jsonb, '2026-04-19T06:29:45.287738+00:00', '2026-04-19T06:29:45.287738+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('c86bc831-09f3-4014-9fe9-fd3a72186e82', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'added', 'Device Scanner Externallll', 'New patent/technology added', '{"field":"energy","status":"Available","patent_id":"3c305d31-cceb-469c-a9ba-92b67fa9c4f6"}'::jsonb, '2026-04-19T06:29:45.430405+00:00', '2026-04-19T06:29:45.430405+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('6df3420b-d680-4ed5-8fe7-432e08786175', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'deleted', 'Nutritional Food Scale System and Method for Diet Management', 'Patent/technology deleted', '{"patent_id":"de2c1b75-6fb4-41fa-a16c-541ea0bcc2b0"}'::jsonb, '2026-04-19T06:30:37.511214+00:00', '2026-04-19T06:30:37.511214+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('5391c73f-fbd9-451f-878d-700571f8a1e0', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'deleted', 'Device Scanner Externallll', 'Patent/technology deleted', '{"patent_id":"3c305d31-cceb-469c-a9ba-92b67fa9c4f6"}'::jsonb, '2026-04-19T06:30:43.26391+00:00', '2026-04-19T06:30:43.26391+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('89a73367-7eb8-4953-a8b8-7695c9fc153b', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'deleted', 'This is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy description', 'Patent/technology deleted', '{"patent_id":"00d8fb5b-b508-4daf-b458-50d139a386c7"}'::jsonb, '2026-04-19T06:30:47.469803+00:00', '2026-04-19T06:30:47.469803+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('0d35cdc2-da72-44cd-bcb0-8d7d483b4150', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'deleted', 'Agriculture Database Management System', 'Patent/technology deleted', '{"patent_id":"213260a4-cc89-4b2d-b4f3-2442a2ca07f4"}'::jsonb, '2026-04-19T06:30:52.424927+00:00', '2026-04-19T06:30:52.424927+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('91499d71-0229-450d-a252-2d6d2276a170', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'deleted', 'Nutritional Food Scale System and Method for Diet Management', 'Patent/technology deleted', '{"patent_id":"a3742f22-a72a-44a7-9ef5-62a4df429603"}'::jsonb, '2026-04-19T06:30:58.244982+00:00', '2026-04-19T06:30:58.244982+00:00');
INSERT INTO activity_logs (id, user_id, activity_type, action, title, description, metadata, created_at, updated_at) VALUES ('b726b04f-490a-4e74-878b-4cf6e005def3', '533709e8-10c7-4b0d-868b-ef2419824223', 'technology', 'deleted', 'Mobile Device Platform Externalllll', 'Patent/technology deleted', '{"patent_id":"09aec510-cf29-4ac6-816c-db3831972522"}'::jsonb, '2026-04-19T06:31:09.404617+00:00', '2026-04-19T06:31:09.404617+00:00');

-- Data for event_registrations
TRUNCATE TABLE event_registrations CASCADE;
INSERT INTO event_registrations (id, event_id, full_name, email, phone, organization, position, dietary_requirements, special_requests, status, registered_at, confirmed_at, created_at, updated_at) VALUES ('4f57ab2e-6109-457c-a860-dcccafd6f6f7', 'c6251604-888e-4cdb-865f-a3bb7fd53ad9', 'Johnleen Viernes', 'viernes@gmail.com', '+639748738292', 'IT St. Peters College', 'IT Head', 'wqewqe', 'also, in http://localhost:8080/resources Workshops & Events section, can the users click on the Workshop & Event? when clicking the user can view more information about it and could fill up if they are interested....', 'pending', '2026-03-06T07:01:28.044871+00:00', NULL, '2026-03-06T07:01:28.044871+00:00', '2026-03-06T07:01:28.044871+00:00');
INSERT INTO event_registrations (id, event_id, full_name, email, phone, organization, position, dietary_requirements, special_requests, status, registered_at, confirmed_at, created_at, updated_at) VALUES ('0037bb7f-dcf0-4284-8bc1-152631b6621a', 'c6251604-888e-4cdb-865f-a3bb7fd53ad9', 'Kenneth Cabibil', 'jkcabs12345@gmail.com', '09758843692', 'ICPEP USTP', 'ComEng', NULL, NULL, 'pending', '2026-03-06T07:13:26.647857+00:00', NULL, '2026-03-06T07:13:26.647857+00:00', '2026-03-06T07:13:26.647857+00:00');

-- Data for resources
TRUNCATE TABLE resources CASCADE;
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('18401d52-5a9e-4d48-b67c-f8b8b63f0bdc', 'Patent Search Report', 'patent-search-report', 'download', NULL, 'Patent Search Report ', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/patent-search-report-1774228701155.docx', '["Templates"]'::jsonb, TRUE, '2026-03-23T01:18:22.056+00:00', '2026-03-23T01:18:22.301122+00:00', '2026-03-23T01:18:22.301122+00:00', 'Templates', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('aab8231c-4928-49da-9373-4e3ff9bd6002', 'Deed of Assignment 2026', 'deed-of-assignment-2026', 'download', NULL, 'IP ownership transfer template', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/deed-of-assignment-2026-1776496706199.docx', '["Templates"]'::jsonb, TRUE, '2026-04-18T07:18:26.809+00:00', '2026-04-18T07:18:26.880618+00:00', '2026-04-18T07:18:26.880618+00:00', 'Templates', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('a1076192-94cb-4bfd-8bee-a23491cfce54', 'Joint Affidavit of Inventorship and Contribution', 'joint-affidavit-of-inventorship-and-contribution', 'download', NULL, 'Inventorship documentation', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/joint-affidavit-of-inventorship-and-contribution-1776496779004.docx', '["Templates"]'::jsonb, TRUE, '2026-04-18T07:19:39.579+00:00', '2026-04-18T07:19:39.54452+00:00', '2026-04-18T07:19:39.54452+00:00', 'Templates', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('5a4584a1-04ce-4709-8ce4-3b5f18e993c4', 'Patent Specification Template with Guide', 'patent-specification-template-with-guide', 'download', NULL, 'Patent drafting template', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/patent-specification-template-with-guide-1776496844689.docx', '["Templates"]'::jsonb, TRUE, '2026-04-18T07:20:45.53+00:00', '2026-04-18T07:20:45.759949+00:00', '2026-04-18T07:20:45.759949+00:00', 'Templates', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('3d69df41-c94e-485c-bc22-3fe6a21847f8', 'Technology Utilization Plan', 'technology-utilization-plan', 'download', NULL, 'Tech commercialization template', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/technology-utilization-plan-1776496920245.docx', '["Templates"]'::jsonb, TRUE, '2026-04-18T07:22:00.81+00:00', '2026-04-18T07:22:00.850136+00:00', '2026-04-18T07:22:00.850136+00:00', 'Templates', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('4a1ce59e-da4c-4615-9600-4b5b13932fd1', 'ITSOS Request Form MD1', 'itsos-request-form-md1', 'download', NULL, 'Alternative service request form', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/itsos-request-form-md1-1774227532951.docx', '["Templates"]'::jsonb, TRUE, '2026-03-23T00:58:53.672+00:00', '2026-03-23T00:58:53.812228+00:00', '2026-04-18T07:22:41.357275+00:00', 'Templates', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('829bbc3d-c05f-4b47-9ede-ab9b2edacb88', 'ITSOS REQUEST FORM', 'itsos-request-form', 'download', NULL, 'Service request form', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/itsos-request-form-1776496990512.docx', '["Templates"]'::jsonb, TRUE, '2026-04-18T07:23:11.113+00:00', '2026-04-18T07:23:11.209935+00:00', '2026-04-18T07:23:11.209935+00:00', 'Templates', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('eeac933f-4b26-4ee3-ad9d-89be32fbdafd', 'Classification of Patent Documents', 'classification-of-patent-documents', 'guide', NULL, 'Patent classification system', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/classification-of-patent-documents-1776497643254.pdf', '["Guidelines"]'::jsonb, TRUE, '2026-04-18T07:34:04.377+00:00', '2026-04-18T07:34:04.319048+00:00', '2026-04-18T07:34:04.319048+00:00', 'Guidelines', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('2427a565-44a4-4611-ac8a-bf83f19842fc', 'IPHOPHL Fillable Form 100', 'iphophl-fillable-form-100', 'download', NULL, 'Patent application form (IPOPHL)', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/iphophl-fillable-form-1776497080304.pdf', '["Templates"]'::jsonb, TRUE, '2026-03-23T00:57:17.32+00:00', '2026-03-23T00:57:17.514141+00:00', '2026-04-18T07:25:16.731303+00:00', 'Templates', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('87254493-68a5-4913-a187-35e49fc06cbc', 'IPOPHL Fillable Form 110', 'ipophl-fillable-form-110', 'download', NULL, 'Utility model form (IPOPHL)', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/ipophl-fillable-form-110-1776497156601.pdf', '["Templates"]'::jsonb, TRUE, '2026-04-18T07:25:57.106+00:00', '2026-04-18T07:25:57.109647+00:00', '2026-04-18T07:25:57.109647+00:00', 'Templates', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('982afe5b-c192-4f57-8be7-00942faaf1cf', 'IPHOPHL Fillable Form 300', 'iphophl-fillable-form-300', 'download', NULL, 'Trademark application form (IPOPHL)', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/iphophl-fillable-form-300-1776497193880.pdf', '["Templates"]'::jsonb, TRUE, '2026-04-18T07:26:34.661+00:00', '2026-04-18T07:26:34.612175+00:00', '2026-04-18T07:26:34.612175+00:00', 'Templates', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('3b6631da-3e74-4bad-9a36-1b6e368cfa7e', 'IPOPHL Fillable Form 400', 'ipophl-fillable-form-400', 'download', NULL, 'Copyright registration form (IPOPHL)', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/ipophl-fillable-form-400-1776497229316.pdf', '["Templates"]'::jsonb, TRUE, '2026-04-18T07:27:10.903+00:00', '2026-04-18T07:27:10.892292+00:00', '2026-04-18T07:27:10.892292+00:00', 'Templates', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('81a50b28-4f30-4b5f-a668-9774532d5996', 'Copyright Registry Enrollment Form 2025', 'copyright-registry-enrollment-form-2025', 'download', NULL, 'Copyright enrollment form', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/copyright-registry-enrollment-form-2025-1776497284140.pdf', '["Templates"]'::jsonb, TRUE, '2026-04-18T07:28:04.778+00:00', '2026-04-18T07:28:04.787262+00:00', '2026-04-18T07:28:04.787262+00:00', 'Templates', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('3e37e43a-f6a1-40ba-8269-89f143cf5565', 'Supplemental Form 2025', 'supplemental-form-2025', 'download', NULL, 'Supplemental IPOPHL form', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/supplemental-form-2025-1776497333553.pdf', '["Templates"]'::jsonb, TRUE, '2026-04-18T07:28:54.248+00:00', '2026-04-18T07:28:54.240676+00:00', '2026-04-18T07:28:54.240676+00:00', 'Templates', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('bfbef5fa-e79d-4d8a-a4af-54b441f58a16', 'TRL Assessment Form', 'trl-assessment-form', 'download', NULL, 'Technology Readiness Level assessment', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/trl-assessment-form-1776497362701.xlsx', '["Templates"]'::jsonb, TRUE, '2026-04-18T07:29:22.984+00:00', '2026-04-18T07:29:22.959606+00:00', '2026-04-18T07:29:22.959606+00:00', 'Templates', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('66092d12-a288-4c0a-8b96-5ef05ba1b68f', 'Patent Overview and Patent Information', 'patent-overview-and-patent-information', 'guide', NULL, 'Patent fundamentals
', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/patent-overview-and-patent-information-1776497469654.pdf', '["Guidelines"]'::jsonb, TRUE, '2026-04-18T07:31:11.335+00:00', '2026-04-18T07:31:11.376585+00:00', '2026-04-18T07:31:11.376585+00:00', 'Guidelines', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('49ef6be5-b787-4193-9761-117799d8d25a', 'Drafting of Specification', 'drafting-of-specification', 'guide', NULL, 'Specification drafting guide', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/drafting-of-specification-1776497538325.pdf', '["Guidelines"]'::jsonb, TRUE, '2026-04-18T07:32:19.136+00:00', '2026-04-18T07:32:19.1253+00:00', '2026-04-18T07:32:19.1253+00:00', 'Guidelines', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('6809fcd2-9c9b-43c2-92e4-b59036a3bb3e', 'Keyword Searching', 'keyword-searching', 'guide', NULL, 'Patent search strategies', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/keyword-searching-1776497499511.pdf', '["Guidelines"]'::jsonb, TRUE, '2026-04-18T07:31:40.393+00:00', '2026-04-18T07:31:40.337933+00:00', '2026-04-18T07:32:33.981747+00:00', 'Guidelines', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('ccfd4e20-82f1-4d11-bb05-4de11c3c1ae7', 'Patent Drawing', 'patent-drawing', 'guide', NULL, 'Patent drawing guidelines', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/patent-drawing-1776497604102.pdf', '["Guidelines"]'::jsonb, TRUE, '2026-04-18T07:33:25.629+00:00', '2026-04-18T07:33:25.566095+00:00', '2026-04-18T07:33:25.566095+00:00', 'Guidelines', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('075da213-82d3-4e2b-a945-5b8c45d8a600', 'IP Procedure', 'ip-procedure', 'guide', NULL, 'IP procedures manual', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/ip-procedure-1776497668501.pdf', '["Guidelines"]'::jsonb, TRUE, '2026-04-18T07:34:29.516+00:00', '2026-04-18T07:34:29.474892+00:00', '2026-04-18T07:34:29.474892+00:00', 'Guidelines', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('3a8b0e47-17b0-469c-bbfe-1fd1b81c2acf', 'IP Procedure Oroquieta and Panaon', 'ip-procedure-oroquieta-and-panaon', 'guide', NULL, 'IP procedures presentation', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/ip-procedure-oroquieta-and-panaon-1776497924391.pdf', '["Guidelines"]'::jsonb, TRUE, '2026-04-18T07:38:46.712+00:00', '2026-04-18T07:38:46.85563+00:00', '2026-04-18T07:38:46.85563+00:00', 'Guidelines', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('3e9b5129-8c00-4103-ac1c-a7ffe6b93c0a', 'IP System', 'ip-system', 'guide', NULL, 'IP system overview', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/ip-system-1776498004985.pdf', '["Guidelines"]'::jsonb, TRUE, '2026-04-18T07:40:07.895+00:00', '2026-04-18T07:40:07.92329+00:00', '2026-04-18T07:40:07.92329+00:00', 'Guidelines', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('29537045-49e9-43ca-b3f3-878723b70e7c', 'Patent Search Strategies', 'patent-search-strategies', 'guide', NULL, 'Comprehensive search strategies', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/patent-search-strategies-1776498062838.pdf', '["Guidelines"]'::jsonb, TRUE, '2026-04-18T07:41:04.711+00:00', '2026-04-18T07:41:04.688048+00:00', '2026-04-18T07:41:04.688048+00:00', 'Guidelines', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('7530bbbc-90f2-41e3-82bc-db4291511961', 'Patent Specification 2 Detailed Description Drafting', 'patent-specification-2-detailed-description-drafting', 'guide', NULL, 'Detailed description guide', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/patent-specification-2-detailed-description-drafting-1776498200176.pdf', '["Guidelines"]'::jsonb, TRUE, '2026-04-18T07:43:21.375+00:00', '2026-04-18T07:43:21.494057+00:00', '2026-04-18T07:43:21.494057+00:00', 'Guidelines', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('e022bdaa-dd03-407a-b075-694b7fa513e2', 'Patent Specification Claims Drafting', 'patent-specification-claims-drafting', 'guide', NULL, 'Claims drafting guide', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/patent-specification-claims-drafting-1776498253458.pdf', '["Guidelines"]'::jsonb, TRUE, '2026-04-18T07:44:14.114+00:00', '2026-04-18T07:44:14.111739+00:00', '2026-04-18T07:44:14.111739+00:00', 'Guidelines', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('efd87c93-19ba-40f4-ae4e-838b45b61799', 'Patentability Requirements', 'patentability-requirements', 'guide', NULL, 'Patentability requirements', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/patentability-requirements-1776498301407.pdf', '["Guidelines"]'::jsonb, TRUE, '2026-04-18T07:45:02.379+00:00', '2026-04-18T07:45:02.426333+00:00', '2026-04-18T07:45:02.426333+00:00', 'Guidelines', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('012ee6ba-972f-489c-85bb-0737040becec', 'Technology Transfer', 'technology-transfer', 'guide', NULL, 'Technology transfer guidelines', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/technology-transfer-1776498355049.pdf', '["Guidelines"]'::jsonb, TRUE, '2026-04-18T07:45:56.047+00:00', '2026-04-18T07:45:56.081544+00:00', '2026-04-18T07:45:56.081544+00:00', 'Guidelines', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('e7e5ce7f-4145-4ca1-a285-7e7d878eac2f', 'IP Application Process and Requirements', 'ip-application-process-and-requirements', 'guide', NULL, 'USTP TPCO IP Application Process and Requirements. Application procedures', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/ip-application-process-and-requirements-1776498427243.pdf', '["Guidelines"]'::jsonb, TRUE, '2026-04-18T07:47:09.532+00:00', '2026-04-18T07:47:09.580594+00:00', '2026-04-18T07:47:09.580594+00:00', 'Guidelines', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('8b453d63-6ef3-44ae-a13c-728593768112', 'DPM-USTP-TPCO-001-ITSU', 'dpm-ustp-tpco-001-itsu', 'guide', NULL, 'Internal ITSU document (Not for Public Display)', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/dpm-ustp-tpco-001-itsu-1776498519130.pdf', '["Guidelines"]'::jsonb, FALSE, '2026-04-18T07:48:42.078+00:00', '2026-04-18T07:48:42.041478+00:00', '2026-04-18T07:48:42.041478+00:00', 'Guidelines', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('7b2abab1-f66b-4dde-9652-0926cfe80d1d', 'DPM-USTP-TPCO-002-PMU', 'dpm-ustp-tpco-002-pmu', 'guide', NULL, 'Internal PMU document (Not for public display)', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/dpm-ustp-tpco-002-pmu-1776498615629.pdf', '["Guidelines"]'::jsonb, FALSE, '2026-04-18T07:50:17.417+00:00', '2026-04-18T07:50:17.585068+00:00', '2026-04-18T07:50:19.705069+00:00', 'Guidelines', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('457d1634-0ebe-41de-9461-4b09dad4a43a', 'DPM-USTP-TPCO-003 - BDU', 'dpm-ustp-tpco-003-bdu', 'guide', NULL, 'Internal BDU document (Not for public display)', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/dpm-ustp-tpco-003-bdu-1776498676858.pdf', '["Guidelines"]'::jsonb, FALSE, '2026-04-18T07:51:18.881+00:00', '2026-04-18T07:51:18.982782+00:00', '2026-04-18T07:51:20.587441+00:00', 'Guidelines', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);
INSERT INTO resources (id, title, slug, type, url, content, file_url, tags, published, published_at, created_at, updated_at, category, duration, modules_count, level, capacity, hourly_rate, booking_lead_time, equipment) VALUES ('e336b086-2987-47d4-824a-d9377b54cf6d', 'GUI for GA Optimization (Compasan)', 'gui-for-ga-optimization-compasan', 'guide', NULL, 'ID for GUI reference. Internal GUI reference', 'https://pwtmtnvedemabvwamllq.supabase.co/storage/v1/object/public/resources/resources/gui-for-ga-optimization-compasan-1776498724891.pdf', '["Guidelines"]'::jsonb, FALSE, '2026-04-18T07:52:05.558+00:00', '2026-04-18T07:52:05.574537+00:00', '2026-04-18T07:52:05.574537+00:00', 'Guidelines', NULL, 0, 'Beginner', NULL, NULL, NULL, '[]'::jsonb);

-- Data for services
TRUNCATE TABLE services CASCADE;
INSERT INTO services (id, name, slug, description, icon, order_num, published, created_at, updated_at, features, process_steps, timeline, pricing) VALUES ('3f6ec563-822c-4cfb-a975-32e5941ace42', 'IP Protection Services', 'ip-protection', 'Comprehensive intellectual property protection and management services', 'Shield', 1, TRUE, '2026-04-02T08:05:16.555203+00:00', '2026-04-02T08:05:16.555203+00:00', '["Patent Application Assistance","Trademark Registration","Copyright Protection","Prior Art Search & Analysis","IP Portfolio Management","Freedom to Operate Analysis","Patent Landscape Studies","IP Strategy Development"]'::jsonb, '["Initial IP Assessment","Prior Art Search","Application Preparation","Filing & Prosecution","Grant & Maintenance"]'::jsonb, '3-6 months', 'Consultation fees apply');
INSERT INTO services (id, name, slug, description, icon, order_num, published, created_at, updated_at, features, process_steps, timeline, pricing) VALUES ('ee5aa988-dd46-4591-9c76-a953a9b89390', 'Technology Licensing', 'technology-licensing', 'Facilitate technology transfer and commercialization opportunities', 'Handshake', 2, TRUE, '2026-04-02T08:05:16.555203+00:00', '2026-04-02T08:05:16.555203+00:00', '["Technology Valuation","Market Analysis","Licensing Negotiations","Partnership Facilitation","Due Diligence Support","Contract Management","Royalty Management","Post-License Support"]'::jsonb, '["Technology Assessment","Market Evaluation","Partner Matching","Negotiation","Agreement Execution"]'::jsonb, '2-4 months', 'Success-based fees');
INSERT INTO services (id, name, slug, description, icon, order_num, published, created_at, updated_at, features, process_steps, timeline, pricing) VALUES ('286a4e4b-70c5-4b84-9ad5-b0fd4a389180', 'Industry-Academe Matching', 'industry-matching', 'Bridge academic research with industry innovation needs', 'BookOpen', 3, TRUE, '2026-04-02T08:05:16.555203+00:00', '2026-04-02T08:05:16.555203+00:00', '["Collaboration Matching","Joint Research Projects","Technical Consulting","Research Partnerships","Innovation Challenges","Expert Networks","Technology Scouting","Partnership Development"]'::jsonb, '["Needs Assessment","Capability Mapping","Partner Identification","Introduction & Facilitation","Collaboration Support"]'::jsonb, '1-3 months', 'Project-based');
INSERT INTO services (id, name, slug, description, icon, order_num, published, created_at, updated_at, features, process_steps, timeline, pricing) VALUES ('66f2e3f1-9c52-4840-8303-43ad1c2474d1', 'Startup Incubation', 'startup-incubation', 'Support researchers in launching technology-based startups', 'Rocket', 4, TRUE, '2026-04-02T08:05:16.555203+00:00', '2026-04-02T08:05:16.555203+00:00', '["Business Model Development","Mentorship Programs","Funding Assistance","Market Entry Support","Product Development","Regulatory Guidance","Investor Connections","Scale-up Support"]'::jsonb, '["Application & Selection","Incubation Program","Mentorship & Support","Market Validation","Launch & Scale"]'::jsonb, '6-12 months', 'Equity participation');

-- Data for admin_patents
TRUNCATE TABLE admin_patents CASCADE;
INSERT INTO admin_patents (id, title, patent_number, inventors, field, abstract, status, year, licensing_info, applications, contact, technology_fields, image_url, published, created_at, updated_at, description, file_url, file_name) VALUES ('86719d24-da0f-4a7e-9d7d-d7173aeba37a', 'Mobile Device Platform Externalllll', 'PA-001', 'Kenneth C., et. al. johnlen', 'information-technology', 'wqee2121321321 3213213 wqee2121321321 3213213 wqee2121321321 3213213 wqee2121321321 3213213 wqee2121321321 3213213 wqee2121321321 3213213 wqee2121321321 3213213 ', 'Under Review', '2026', NULL, '[]'::jsonb, NULL, '[]'::jsonb, NULL, TRUE, '2026-04-01T06:49:01.407406+00:00', '2026-04-01T07:36:05.841319+00:00', 'this is a dummyyyyy', NULL, NULL);
INSERT INTO admin_patents (id, title, patent_number, inventors, field, abstract, status, year, licensing_info, applications, contact, technology_fields, image_url, published, created_at, updated_at, description, file_url, file_name) VALUES ('1cea8abe-cdc9-4819-ac00-8b8876a4c588', 'Device Scanner Externallll', '12312321', 'john leen corbo', 'energy', 'JWQEJQWNAnlndqwjln JWQEJQWNAnlndqwjln JWQEJQWNAnlndqwjln JWQEJQWNAnlndqwjln JWQEJQWNAnlndqwjln JWQEJQWNAnlndqwjln JWQEJQWNAnlndqwjln ', 'Available', '2025', NULL, '[]'::jsonb, NULL, '[]'::jsonb, NULL, TRUE, '2026-03-06T06:35:37.249429+00:00', '2026-04-01T07:36:54.132331+00:00', 'A brief description', NULL, NULL);
INSERT INTO admin_patents (id, title, patent_number, inventors, field, abstract, status, year, licensing_info, applications, contact, technology_fields, image_url, published, created_at, updated_at, description, file_url, file_name) VALUES ('9e3828e5-0c4e-4a31-a6bb-fb1b55e9e54e', 'Agriculture Database Management System', 'AG0234', 'Ben Johns, Anna Bright', 'agriculture', 'This is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionvThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy description


This is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy descriptionThis is a dummy description', 'Available', '2026', NULL, '[]'::jsonb, NULL, '[]'::jsonb, NULL, TRUE, '2026-04-02T03:13:09.688777+00:00', '2026-04-02T03:13:09.688777+00:00', 'This is a dummy descriptionThis is a dummy descriptionThis is a dummy description', NULL, NULL);

