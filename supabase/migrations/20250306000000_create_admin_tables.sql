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
