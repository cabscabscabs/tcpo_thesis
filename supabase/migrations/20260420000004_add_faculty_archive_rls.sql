-- Add RLS policies for faculty to archive/restore/delete their own IP applications
-- The existing update policy restricts to Draft/Needs Revision status, but archiving should work for any status

-- Allow faculty to update is_archived on their own applications regardless of status
DROP POLICY IF EXISTS "Faculty can archive own applications" ON public.ip_applications;
CREATE POLICY "Faculty can archive own applications" ON public.ip_applications
  FOR UPDATE USING (auth.uid() = faculty_id)
  WITH CHECK (auth.uid() = faculty_id);

-- Allow faculty to delete their own applications (only archived ones for safety)
DROP POLICY IF EXISTS "Faculty can delete own draft applications" ON public.ip_applications;
CREATE POLICY "Faculty can delete own applications" ON public.ip_applications
  FOR DELETE USING (auth.uid() = faculty_id AND is_archived = true);
