-- Migration: Add archived column to admin_news table
-- Date: 2026-03-31

-- ============================================
-- 1. Add archived column to admin_news
-- ============================================

ALTER TABLE public.admin_news 
ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index for faster queries on archived status
CREATE INDEX IF NOT EXISTS idx_admin_news_archived 
ON public.admin_news(archived);

-- ============================================
-- 2. Update RLS policies if needed
-- ============================================

-- Ensure the existing policy allows updating the archived column
-- The existing "Admins manage news" policy should cover this

-- ============================================
-- 3. Grant permissions
-- ============================================

-- Permissions are already granted via existing policies
