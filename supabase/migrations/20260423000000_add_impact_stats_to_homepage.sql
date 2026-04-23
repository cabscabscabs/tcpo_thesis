-- Add regional_impact and success_rate columns to admin_homepage_content
ALTER TABLE public.admin_homepage_content
ADD COLUMN IF NOT EXISTS regional_impact TEXT DEFAULT '₱15M',
ADD COLUMN IF NOT EXISTS success_rate TEXT DEFAULT '85%';
