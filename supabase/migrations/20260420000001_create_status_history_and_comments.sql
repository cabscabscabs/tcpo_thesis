-- Create ip_application_status_history and ip_application_comments tables
-- These support the admin review workflow and reviewer comments display

-- ============================================
-- 1. ADD admin_notes COLUMN IF NOT EXISTS
-- ============================================
ALTER TABLE public.ip_applications ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE public.ip_applications ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMPTZ;
ALTER TABLE public.ip_applications ADD COLUMN IF NOT EXISTS status_updated_by UUID REFERENCES public.user_profiles(id);

-- ============================================
-- 2. CREATE ip_application_status_history TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ip_application_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.ip_applications(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  change_reason TEXT,
  changed_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ip_app_status_history_application_id ON public.ip_application_status_history(application_id);

-- ============================================
-- 3. CREATE ip_application_comments TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ip_application_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.ip_applications(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  commenter_id UUID REFERENCES public.user_profiles(id),
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ip_app_comments_application_id ON public.ip_application_comments(application_id);

-- ============================================
-- 4. RLS FOR ip_application_status_history
-- ============================================
ALTER TABLE public.ip_application_status_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Faculty can view own status history" ON public.ip_application_status_history;
CREATE POLICY "Faculty can view own status history" ON public.ip_application_status_history
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.ip_applications WHERE id = application_id AND faculty_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can view all status history" ON public.ip_application_status_history;
CREATE POLICY "Admins can view all status history" ON public.ip_application_status_history
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can insert status history" ON public.ip_application_status_history;
CREATE POLICY "Admins can insert status history" ON public.ip_application_status_history
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 5. RLS FOR ip_application_comments
-- ============================================
ALTER TABLE public.ip_application_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Faculty can view own comments" ON public.ip_application_comments;
CREATE POLICY "Faculty can view own comments" ON public.ip_application_comments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.ip_applications WHERE id = application_id AND faculty_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can view all comments" ON public.ip_application_comments;
CREATE POLICY "Admins can view all comments" ON public.ip_application_comments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can insert comments" ON public.ip_application_comments;
CREATE POLICY "Admins can insert comments" ON public.ip_application_comments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Faculty can insert own comments" ON public.ip_application_comments;
CREATE POLICY "Faculty can insert own comments" ON public.ip_application_comments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'faculty')
  );

-- ============================================
-- 6. GRANT PERMISSIONS
-- ============================================
GRANT ALL ON public.ip_application_status_history TO authenticated;
GRANT ALL ON public.ip_application_comments TO authenticated;

-- ============================================
-- 7. CREATE faculty_notifications TABLE IF NOT EXISTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.faculty_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.ip_applications(id) ON DELETE SET NULL,
  notification_type TEXT NOT NULL DEFAULT 'general',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  action_text TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faculty_notifications_faculty_id ON public.faculty_notifications(faculty_id);
CREATE INDEX IF NOT EXISTS idx_faculty_notifications_is_read ON public.faculty_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_faculty_notifications_created_at ON public.faculty_notifications(created_at DESC);

-- ============================================
-- 8. RLS FOR faculty_notifications
-- ============================================
ALTER TABLE public.faculty_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Faculty can view own notifications" ON public.faculty_notifications;
CREATE POLICY "Faculty can view own notifications" ON public.faculty_notifications
  FOR SELECT USING (auth.uid() = faculty_id);

DROP POLICY IF EXISTS "Faculty can update own notifications" ON public.faculty_notifications;
CREATE POLICY "Faculty can update own notifications" ON public.faculty_notifications
  FOR UPDATE USING (auth.uid() = faculty_id);

DROP POLICY IF EXISTS "Admins can insert notifications" ON public.faculty_notifications;
CREATE POLICY "Admins can insert notifications" ON public.faculty_notifications
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can view all notifications" ON public.faculty_notifications;
CREATE POLICY "Admins can view all notifications" ON public.faculty_notifications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

GRANT ALL ON public.faculty_notifications TO authenticated;

-- ============================================
-- 9. ENABLE REALTIME FOR faculty_notifications
-- ============================================
-- This is needed for the faculty notification bell to update in real-time
-- when admin reviews an application. If this fails, it means Realtime
-- needs to be enabled via the Supabase Dashboard instead:
--   Database -> Replication -> Select faculty_notifications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'faculty_notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.faculty_notifications;
  END IF;
END $$;
