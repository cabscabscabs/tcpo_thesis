-- Update RLS policy for admin_patents to hide "Under Review" patents from public view
-- Only admin users should be able to see patents with "Under Review" status

-- Drop the existing public SELECT policy
DROP POLICY IF EXISTS "Public can view published patents" ON public.admin_patents;

-- Recreate the policy to exclude "Under Review" patents from public access
-- Admin users retain full visibility via has_role check
CREATE POLICY "Public can view published patents"
  ON public.admin_patents
  FOR SELECT
  TO anon, authenticated
  USING (
    (published = TRUE AND (status IS NULL OR status != 'Under Review'))
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'faculty')
  );
