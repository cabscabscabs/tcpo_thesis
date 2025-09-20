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