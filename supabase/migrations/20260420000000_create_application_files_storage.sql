-- Create storage bucket and policies for faculty application file attachments
-- Also creates ip_applications and ip_application_attachments tables if they don't exist
-- Fix faculty_id FK to reference user_profiles for Supabase joins

-- ============================================
-- 0. FIX FK ON EXISTING TABLE (if already created with auth.users reference)
-- ============================================
-- Drop old FK constraint if it references auth.users and recreate with user_profiles
DO $fix_fk$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'ip_applications'
    AND tc.constraint_type = 'FOREIGN KEY'
    AND kcu.column_name = 'faculty_id'
  ) THEN
    ALTER TABLE public.ip_applications DROP CONSTRAINT ip_applications_faculty_id_fkey;
    ALTER TABLE public.ip_applications ADD CONSTRAINT ip_applications_faculty_id_fkey
      FOREIGN KEY (faculty_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $fix_fk$;

-- ============================================
-- 1. CREATE ip_applications TABLE IF NOT EXISTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.ip_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_number TEXT UNIQUE,
  faculty_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  ip_type TEXT NOT NULL DEFAULT 'Patent' CHECK (ip_type IN ('Patent', 'Utility Model', 'Industrial Design', 'Copyright', 'Trademark')),
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN (
    'Draft','Submitted for Internal Review','Needs Revision',
    'Approved for IPOPHL Filing','Filed to IPOPHL',
    'Under IPOPHL Examination','Granted','Rejected'
  )),
  applicant_full_name TEXT NOT NULL DEFAULT '',
  applicant_address TEXT NOT NULL DEFAULT '',
  applicant_nationality TEXT NOT NULL DEFAULT '',
  applicant_email TEXT NOT NULL DEFAULT '',
  applicant_phone TEXT,
  title TEXT NOT NULL DEFAULT '',
  abstract TEXT,
  field_of_technology TEXT,
  background_of_invention TEXT,
  detailed_description TEXT,
  summary_of_invention TEXT,
  declaration_confirmed BOOLEAN DEFAULT FALSE,
  declaration_date TIMESTAMPTZ,
  co_inventors JSONB DEFAULT '[]'::jsonb,
  ipophl_filing_date DATE,
  ipophl_application_number TEXT,
  ipophl_publication_date DATE,
  ipophl_grant_date DATE,
  ipophl_office_actions JSONB DEFAULT '[]'::jsonb,
  current_version INTEGER DEFAULT 1,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ip_applications_faculty_id ON public.ip_applications(faculty_id);
CREATE INDEX IF NOT EXISTS idx_ip_applications_status ON public.ip_applications(status);
CREATE INDEX IF NOT EXISTS idx_ip_applications_ip_type ON public.ip_applications(ip_type);

-- ============================================
-- 2. AUTO-GENERATE APPLICATION NUMBER
-- ============================================
-- Using inline subquery instead of PL/pgSQL variables to avoid
-- Supabase SQL Editor misinterpreting SELECT INTO as table creation
CREATE OR REPLACE FUNCTION public.generate_application_number()
RETURNS TRIGGER AS $func$
BEGIN
  NEW.application_number := 'IP-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(
    (SELECT COUNT(*) + 1 FROM public.ip_applications
     WHERE application_number LIKE 'IP-' || TO_CHAR(NOW(), 'YYYY') || '-%')::TEXT,
    5, '0');
  RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_application_number ON public.ip_applications;
CREATE TRIGGER trigger_generate_application_number
  BEFORE INSERT ON public.ip_applications
  FOR EACH ROW
  WHEN (NEW.application_number IS NULL)
  EXECUTE FUNCTION public.generate_application_number();

-- ============================================
-- 3. RLS FOR ip_applications
-- ============================================
ALTER TABLE public.ip_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Faculty can view own applications" ON public.ip_applications;
CREATE POLICY "Faculty can view own applications" ON public.ip_applications
  FOR SELECT USING (auth.uid() = faculty_id);

DROP POLICY IF EXISTS "Faculty can insert own applications" ON public.ip_applications;
CREATE POLICY "Faculty can insert own applications" ON public.ip_applications
  FOR INSERT WITH CHECK (auth.uid() = faculty_id);

DROP POLICY IF EXISTS "Faculty can update own applications" ON public.ip_applications;
CREATE POLICY "Faculty can update own applications" ON public.ip_applications
  FOR UPDATE USING (auth.uid() = faculty_id AND status IN ('Draft', 'Needs Revision'));

DROP POLICY IF EXISTS "Admins can view all applications" ON public.ip_applications;
CREATE POLICY "Admins can view all applications" ON public.ip_applications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can update all applications" ON public.ip_applications;
CREATE POLICY "Admins can update all applications" ON public.ip_applications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 4. CREATE ip_application_attachments TABLE IF NOT EXISTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.ip_application_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.ip_applications(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('drawing', 'document', 'supporting')),
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  description TEXT,
  document_type TEXT,
  uploaded_by UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ip_application_attachments_application_id ON public.ip_application_attachments(application_id);
CREATE INDEX IF NOT EXISTS idx_ip_application_attachments_file_type ON public.ip_application_attachments(file_type);

-- Add document_type column if table already existed without it
ALTER TABLE public.ip_application_attachments ADD COLUMN IF NOT EXISTS document_type TEXT;

COMMENT ON COLUMN public.ip_application_attachments.document_type
IS 'Specific document category from checklist: specification, claims, drawings, abstract, priority_documents, deed_of_assignment, spa, small_entity, representations, description, mark_representation, goods_services, work_copy, affidavit_ownership, government_id';

-- ============================================
-- 5. RLS FOR ip_application_attachments
-- ============================================
ALTER TABLE public.ip_application_attachments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Faculty can manage attachments for own applications" ON public.ip_application_attachments;
CREATE POLICY "Faculty can manage attachments for own applications" ON public.ip_application_attachments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.ip_applications WHERE id = application_id AND faculty_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can view all attachments" ON public.ip_application_attachments;
CREATE POLICY "Admins can view all attachments" ON public.ip_application_attachments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- 6. GRANT PERMISSIONS
-- ============================================
GRANT ALL ON public.ip_applications TO authenticated;
GRANT ALL ON public.ip_application_attachments TO authenticated;

-- ============================================
-- 7. STORAGE POLICIES FOR application-files BUCKET
-- ============================================
-- NOTE: You must create the bucket first via Dashboard:
--   Storage -> New Bucket -> name: application-files -> check Public -> Save

DROP POLICY IF EXISTS "Allow authenticated uploads to application-files" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to application-files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'application-files'
  AND (storage.foldername(name))[1] = 'applications'
);

DROP POLICY IF EXISTS "Allow authenticated reads from application-files" ON storage.objects;
CREATE POLICY "Allow authenticated reads from application-files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'application-files');

DROP POLICY IF EXISTS "Allow authenticated updates to application-files" ON storage.objects;
CREATE POLICY "Allow authenticated updates to application-files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'application-files')
WITH CHECK (bucket_id = 'application-files');

DROP POLICY IF EXISTS "Allow authenticated deletes from application-files" ON storage.objects;
CREATE POLICY "Allow authenticated deletes from application-files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'application-files');
