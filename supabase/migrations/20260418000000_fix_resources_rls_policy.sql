-- Fix resources table RLS policy to allow admin inserts

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view published resources" ON public.resources;
DROP POLICY IF EXISTS "Admins manage resources" ON public.resources;

-- Create SELECT policy for public viewing
CREATE POLICY "Public can view published resources"
  ON public.resources
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Create ALL policy for admin management using has_role function
CREATE POLICY "Admins and faculty manage resources"
  ON public.resources
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'faculty'));

-- Grant permissions
GRANT ALL ON public.resources TO authenticated;
GRANT SELECT ON public.resources TO anon;
