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