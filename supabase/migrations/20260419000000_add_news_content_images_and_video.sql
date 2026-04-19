-- Migration: Add content images and YouTube video support to admin_news table
-- Created: April 19, 2026

-- 1. Add content_images column for multiple images within article content
ALTER TABLE public.admin_news
ADD COLUMN IF NOT EXISTS content_images TEXT[] DEFAULT '{}';

-- 2. Add youtube_url column for embedded YouTube videos
ALTER TABLE public.admin_news
ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- NOTE: Do NOT create a GIN index on content_images.
-- Base64-encoded images are too large for PostgreSQL index rows (max 8191 bytes).
-- A GIN index will cause error code 54000 on INSERT/UPDATE.
