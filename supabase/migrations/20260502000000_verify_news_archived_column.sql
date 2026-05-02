-- Migration: Verify and fix admin_news archived column
-- Date: 2026-05-02
-- Purpose: Ensure archived column exists and fix any schema issues

-- ============================================
-- 1. Add archived column if it doesn't exist
-- ============================================

ALTER TABLE public.admin_news 
ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index for faster queries on archived status
CREATE INDEX IF NOT EXISTS idx_admin_news_archived 
ON public.admin_news(archived);

-- ============================================
-- 2. Verify content_images and youtube_url columns
-- ============================================

ALTER TABLE public.admin_news
ADD COLUMN IF NOT EXISTS content_images TEXT[] DEFAULT '{}';

ALTER TABLE public.admin_news
ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- ============================================
-- 3. Ensure RLS policies allow archived updates
-- ============================================

-- The existing policies should cover this, but let's ensure
-- that admins can update all columns including archived
