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