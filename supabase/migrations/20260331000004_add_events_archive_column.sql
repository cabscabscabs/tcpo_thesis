-- Migration: Add archived column to admin_events table
-- Date: 2026-03-31

-- ============================================
-- 1. Add archived column to admin_events
-- ============================================

ALTER TABLE public.admin_events 
ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index for faster queries on archived status
CREATE INDEX IF NOT EXISTS idx_admin_events_archived 
ON public.admin_events(archived);

-- ============================================
-- 2. Update RLS policies if needed
-- ============================================

-- Ensure the existing policy allows updating the archived column
-- The existing "Admins and faculty manage events" policy should cover this

-- ============================================
-- 3. Grant permissions
-- ============================================

-- Permissions are already granted via existing policies
