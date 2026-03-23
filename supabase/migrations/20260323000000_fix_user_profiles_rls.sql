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
