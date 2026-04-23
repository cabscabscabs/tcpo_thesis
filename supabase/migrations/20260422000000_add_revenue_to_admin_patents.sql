-- Add licensed_revenue column to admin_dashboard_stats for tracking total licensed patent revenue
ALTER TABLE public.admin_dashboard_stats ADD COLUMN IF NOT EXISTS licensed_revenue NUMERIC DEFAULT 0;

COMMENT ON COLUMN public.admin_dashboard_stats.licensed_revenue IS 'Total revenue from licensed patents, manually entered by admin from logbook';
