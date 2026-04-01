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
