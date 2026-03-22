-- Add category column to resources table for better categorization
ALTER TABLE public.resources 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Guidelines';

-- Add additional fields for tutorials
ALTER TABLE public.resources
ADD COLUMN IF NOT EXISTS duration TEXT,
ADD COLUMN IF NOT EXISTS modules_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'Beginner';

-- Add additional fields for facilities
ALTER TABLE public.resources
ADD COLUMN IF NOT EXISTS capacity TEXT,
ADD COLUMN IF NOT EXISTS hourly_rate TEXT,
ADD COLUMN IF NOT EXISTS booking_lead_time TEXT,
ADD COLUMN IF NOT EXISTS equipment TEXT[] DEFAULT '{}';

-- Create facility_booking_inquiries table
CREATE TABLE IF NOT EXISTS public.facility_booking_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id UUID REFERENCES public.resources(id) ON DELETE SET NULL,
  facility_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  purpose TEXT,
  additional_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for facility_booking_inquiries
CREATE INDEX IF NOT EXISTS idx_facility_booking_status ON public.facility_booking_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_facility_booking_created_at ON public.facility_booking_inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_facility_booking_facility_id ON public.facility_booking_inquiries(facility_id);

-- Enable RLS on facility_booking_inquiries
ALTER TABLE public.facility_booking_inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for facility_booking_inquiries
CREATE POLICY "Admins can view all booking inquiries"
ON public.facility_booking_inquiries
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can manage booking inquiries"
ON public.facility_booking_inquiries
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Public can insert booking inquiries"
ON public.facility_booking_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER trg_facility_booking_inquiries_updated_at
BEFORE UPDATE ON public.facility_booking_inquiries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update resources policies to allow proper management
DROP POLICY IF EXISTS "Public can view published resources" ON public.resources;
CREATE POLICY "Public can view published resources"
ON public.resources
FOR SELECT
TO anon, authenticated
USING (published = true);

DROP POLICY IF EXISTS "Admins manage resources" ON public.resources;
CREATE POLICY "Admins manage resources"
ON public.resources
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Insert default templates if they don't exist
INSERT INTO public.resources (title, slug, type, category, content, published, tags)
VALUES 
  ('Non-Disclosure Agreement (NDA)', 'non-disclosure-agreement-nda', 'download', 'Templates', 'Standard template for protecting confidential information during technology discussions', true, ARRAY['Templates', 'Legal']),
  ('Memorandum of Understanding (MOU)', 'memorandum-of-understanding-mou', 'download', 'Templates', 'Framework for establishing research partnerships and collaboration agreements', true, ARRAY['Templates', 'Legal'])
ON CONFLICT (slug) DO NOTHING;

-- Insert default tutorials if they don't exist
INSERT INTO public.resources (title, slug, type, category, content, published, tags, duration, modules_count, level)
VALUES 
  ('Introduction to Intellectual Property', 'introduction-to-intellectual-property', 'video', 'IP 101 Tutorials', 'Fundamentals of IP protection, types of IP, and why it matters for researchers', true, ARRAY['IP 101 Tutorials', 'Beginner'], '45 minutes', 6, 'Beginner'),
  ('Patent Application Process', 'patent-application-process', 'video', 'IP 101 Tutorials', 'Step-by-step guide through the patent application process from idea to grant', true, ARRAY['IP 101 Tutorials', 'Intermediate'], '60 minutes', 8, 'Intermediate')
ON CONFLICT (slug) DO NOTHING;

-- Insert default guidelines if they don't exist
INSERT INTO public.resources (title, slug, type, category, content, published, tags)
VALUES 
  ('USTP Research Ethics Guidelines', 'ustp-research-ethics-guidelines', 'guide', 'Guidelines', 'Comprehensive guide to ethical considerations in research and development', true, ARRAY['Guidelines', 'Research']),
  ('IP Protection Best Practices', 'ip-protection-best-practices', 'guide', 'Guidelines', 'Best practices for protecting intellectual property throughout the research process', true, ARRAY['Guidelines', 'IP'])
ON CONFLICT (slug) DO NOTHING;

-- Insert default facilities if they don't exist
INSERT INTO public.resources (title, slug, type, category, content, published, tags, capacity, hourly_rate, booking_lead_time, equipment)
VALUES 
  ('Advanced Materials Testing Lab', 'advanced-materials-testing-lab', 'download', 'SSF Booking', 'State-of-the-art equipment for materials characterization and testing', true, ARRAY['SSF Booking', 'Facility'], '10 researchers', '500', '48 hours', ARRAY['SEM-EDS', 'XRD', 'FTIR', 'Universal Testing Machine', 'Hardness Tester']),
  ('Biotechnology Research Facility', 'biotechnology-research-facility', 'download', 'SSF Booking', 'Fully equipped lab for biotechnology and life sciences research', true, ARRAY['SSF Booking', 'Facility'], '8 researchers', '400', '72 hours', ARRAY['PCR Machines', 'Spectrophotometer', 'Centrifuges', 'Incubators', 'Biosafety Cabinet']),
  ('Food Technology Laboratory', 'food-technology-laboratory', 'download', 'SSF Booking', 'Comprehensive facility for food processing and analysis research', true, ARRAY['SSF Booking', 'Facility'], '12 researchers', '350', '24 hours', ARRAY['Texture Analyzer', 'Color Meter', 'pH Meter', 'Packaging Equipment', 'Sensory Testing Booth']),
  ('Environmental Analysis Center', 'environmental-analysis-center', 'download', 'SSF Booking', 'Specialized lab for environmental monitoring and analysis', true, ARRAY['SSF Booking', 'Facility'], '6 researchers', '600', '96 hours', ARRAY['GC-MS', 'HPLC', 'Ion Chromatograph', 'Water Quality Analyzers', 'Air Sampling Equipment'])
ON CONFLICT (slug) DO NOTHING;
