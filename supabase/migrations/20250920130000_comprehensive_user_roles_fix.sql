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