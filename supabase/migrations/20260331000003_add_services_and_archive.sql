-- Migration: Add services table and archived column to service requests
-- Date: 2026-03-31

-- ============================================
-- 1. Add archived column to admin_service_requests
-- ============================================

ALTER TABLE public.admin_service_requests 
ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT FALSE;

-- Create index for faster queries on archived status
CREATE INDEX IF NOT EXISTS idx_admin_service_requests_archived 
ON public.admin_service_requests(archived);

-- ============================================
-- 2. Create services table if not exists
-- ============================================

CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  order_num INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_services_order ON public.services(order_num);
CREATE INDEX IF NOT EXISTS idx_services_published ON public.services(published);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_services_updated_at ON public.services;
CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 3. RLS Policies for services table
-- ============================================

-- Public can view published services
DROP POLICY IF EXISTS "Public can view published services" ON public.services;
CREATE POLICY "Public can view published services"
ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (published = TRUE OR public.has_role(auth.uid(), 'admin'));

-- Admins manage services
DROP POLICY IF EXISTS "Admins manage services" ON public.services;
CREATE POLICY "Admins manage services"
ON public.services
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- 4. Grant permissions
-- ============================================

GRANT ALL ON public.services TO authenticated;
GRANT SELECT ON public.services TO anon;

-- ============================================
-- 5. Seed default services if table is empty
-- ============================================

INSERT INTO public.services (name, slug, description, icon, order_num, published)
SELECT * FROM (VALUES
  ('IP Protection', 'ip-protection', 'Intellectual property protection services including patent filing, trademark registration, and copyright protection.', 'Shield', 1, TRUE),
  ('Technology Licensing', 'technology-licensing', 'License your technologies to industry partners for commercialization and revenue generation.', 'Handshake', 2, TRUE),
  ('Industry Matching', 'industry-matching', 'Connect with potential industry partners and collaborators for research and development.', 'Users', 3, TRUE)
) AS v(name, slug, description, icon, order_num, published)
WHERE NOT EXISTS (SELECT 1 FROM public.services);
