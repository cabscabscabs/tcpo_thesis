-- Fix licensed_revenue column: ensure PostgREST schema cache is refreshed
-- and create/update the RPC function for writing licensed_revenue

-- 1. Ensure the column exists (idempotent)
ALTER TABLE public.admin_dashboard_stats 
ADD COLUMN IF NOT EXISTS licensed_revenue NUMERIC DEFAULT 0;

COMMENT ON COLUMN public.admin_dashboard_stats.licensed_revenue 
IS 'Total revenue from licensed patents, manually entered by admin from logbook';

-- 2. Drop and recreate the RPC function with proper WHERE clause
DROP FUNCTION IF EXISTS public.update_licensed_revenue(NUMERIC);

CREATE OR REPLACE FUNCTION public.update_licensed_revenue(new_revenue NUMERIC)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
BEGIN
  UPDATE public.admin_dashboard_stats
  SET licensed_revenue = new_revenue
  WHERE id = (SELECT id FROM public.admin_dashboard_stats LIMIT 1);
END;
$func$;

GRANT EXECUTE ON FUNCTION public.update_licensed_revenue TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_licensed_revenue TO anon;

-- 3. Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';
