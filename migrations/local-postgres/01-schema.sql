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


