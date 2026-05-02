-- Migration: Verify and fix admin_events archived column
-- Date: 2026-05-02
-- Purpose: Ensure archived column exists and fix any schema issues

-- ============================================
-- 1. Add archived column if it doesn't exist
-- ============================================

ALTER TABLE public.admin_events 
ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index for faster queries on archived status
CREATE INDEX IF NOT EXISTS idx_admin_events_archived 
ON public.admin_events(archived);

-- ============================================
-- 2. Verify image_url column exists
-- ============================================

ALTER TABLE public.admin_events
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- ============================================
-- 3. Ensure RLS policies allow archived updates
-- ============================================

-- The existing policies should cover this, but let's ensure
-- that admins can update all columns including archived
