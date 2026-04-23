-- Add application_id to activity_logs so notifications can link to specific applications
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS application_id UUID REFERENCES public.ip_applications(id) ON DELETE SET NULL;
