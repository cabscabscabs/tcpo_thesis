-- Create storage bucket for patent files
-- This migration sets up the patent-files bucket with appropriate policies

-- ============================================
-- 1. CREATE STORAGE BUCKET
-- ============================================
-- Note: Buckets are created via Supabase Dashboard or API
-- The SQL below sets up the policies for the bucket once created

-- ============================================
-- 2. STORAGE POLICIES FOR patent-files BUCKET
-- ============================================

-- Policy: Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads to patent-files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'patent-files'
  AND (storage.foldername(name))[1] = 'patents'
);

-- Policy: Allow authenticated users to read files
CREATE POLICY "Allow authenticated reads from patent-files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'patent-files'
);

-- Policy: Allow authenticated users to update their own files
CREATE POLICY "Allow authenticated updates to patent-files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'patent-files'
)
WITH CHECK (
  bucket_id = 'patent-files'
);

-- Policy: Allow authenticated users to delete files
CREATE POLICY "Allow authenticated deletes from patent-files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'patent-files'
);

-- ============================================
-- 3. ADD FILE COLUMNS TO admin_patents TABLE
-- ============================================

-- Add file_url column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_patents' AND column_name = 'file_url'
  ) THEN
    ALTER TABLE public.admin_patents ADD COLUMN file_url TEXT;
  END IF;
END $$;

-- Add file_name column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_patents' AND column_name = 'file_name'
  ) THEN
    ALTER TABLE public.admin_patents ADD COLUMN file_name TEXT;
  END IF;
END $$;

-- ============================================
-- 4. MANUAL SETUP INSTRUCTIONS
-- ============================================
-- 
-- Since buckets cannot be created via SQL, you need to:
--
-- 1. Go to Supabase Dashboard → Storage → New Bucket
-- 2. Bucket name: patent-files
-- 3. Check "Public bucket" (to allow public file access via URL)
-- 4. Click "Save"
--
-- OR use the Supabase CLI:
--
-- supabase storage create-bucket patent-files --public
--
-- ============================================
