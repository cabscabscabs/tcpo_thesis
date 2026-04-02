-- ============================================
-- Enhance services table with additional fields
-- ============================================

-- Add new columns to services table
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS features TEXT[],
ADD COLUMN IF NOT EXISTS process_steps TEXT[],
ADD COLUMN IF NOT EXISTS timeline TEXT,
ADD COLUMN IF NOT EXISTS pricing TEXT;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_services_order ON public.services(order_num);

-- Clear existing services and insert the exact TPCO services
DELETE FROM public.services;

-- Insert the 4 exact TPCO services
INSERT INTO public.services (name, slug, description, icon, order_num, published, features, process_steps, timeline, pricing) VALUES
(
  'IP Protection Services',
  'ip-protection',
  'Comprehensive intellectual property protection and management services',
  'Shield',
  1,
  true,
  ARRAY[
    'Patent Application Assistance',
    'Trademark Registration',
    'Copyright Protection',
    'Prior Art Search & Analysis',
    'IP Portfolio Management',
    'Freedom to Operate Analysis',
    'Patent Landscape Studies',
    'IP Strategy Development'
  ],
  ARRAY[
    'Initial IP Assessment',
    'Prior Art Search',
    'Application Preparation',
    'Filing & Prosecution',
    'Grant & Maintenance'
  ],
  '3-6 months',
  'Consultation fees apply'
),
(
  'Technology Licensing',
  'technology-licensing',
  'Facilitate technology transfer and commercialization opportunities',
  'Handshake',
  2,
  true,
  ARRAY[
    'Technology Valuation',
    'Market Analysis',
    'Licensing Negotiations',
    'Partnership Facilitation',
    'Due Diligence Support',
    'Contract Management',
    'Royalty Management',
    'Post-License Support'
  ],
  ARRAY[
    'Technology Assessment',
    'Market Evaluation',
    'Partner Matching',
    'Negotiation',
    'Agreement Execution'
  ],
  '2-4 months',
  'Success-based fees'
),
(
  'Industry-Academe Matching',
  'industry-matching',
  'Bridge academic research with industry innovation needs',
  'BookOpen',
  3,
  true,
  ARRAY[
    'Collaboration Matching',
    'Joint Research Projects',
    'Technical Consulting',
    'Research Partnerships',
    'Innovation Challenges',
    'Expert Networks',
    'Technology Scouting',
    'Partnership Development'
  ],
  ARRAY[
    'Needs Assessment',
    'Capability Mapping',
    'Partner Identification',
    'Introduction & Facilitation',
    'Collaboration Support'
  ],
  '1-3 months',
  'Project-based'
),
(
  'Startup Incubation',
  'startup-incubation',
  'Support researchers in launching technology-based startups',
  'Rocket',
  4,
  true,
  ARRAY[
    'Business Model Development',
    'Mentorship Programs',
    'Funding Assistance',
    'Market Entry Support',
    'Product Development',
    'Regulatory Guidance',
    'Investor Connections',
    'Scale-up Support'
  ],
  ARRAY[
    'Application & Selection',
    'Incubation Program',
    'Mentorship & Support',
    'Market Validation',
    'Launch & Scale'
  ],
  '6-12 months',
  'Equity participation'
);

-- Update the updated_at trigger
DROP TRIGGER IF EXISTS trg_services_updated_at ON public.services;
CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
