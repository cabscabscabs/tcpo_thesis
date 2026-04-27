-- Update get_dashboard_stats to include licensed_revenue
-- This ensures the admin panel can load licensed_revenue via RPC

-- Must drop first because return type changed (added licensed_revenue column)
DROP FUNCTION IF EXISTS public.get_dashboard_stats();

CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE (
  total_patents INTEGER,
  patents_this_month INTEGER,
  published_news INTEGER,
  news_this_week INTEGER,
  upcoming_events INTEGER,
  next_event_date TEXT,
  service_requests_count INTEGER,
  pending_requests INTEGER,
  licensed_revenue NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_patents INTEGER;
  v_patents_this_month INTEGER;
  v_published_news INTEGER;
  v_news_this_week INTEGER;
  v_upcoming_events INTEGER;
  v_next_event_date TEXT;
  v_service_requests_count INTEGER;
  v_pending_requests INTEGER;
  v_licensed_revenue NUMERIC;
BEGIN
  -- Count total patents
  SELECT COUNT(*) INTO v_total_patents
  FROM public.admin_patents;

  -- Count patents created this month
  SELECT COUNT(*) INTO v_patents_this_month
  FROM public.admin_patents
  WHERE created_at >= DATE_TRUNC('month', NOW());

  -- Count published news
  SELECT COUNT(*) INTO v_published_news
  FROM public.admin_news
  WHERE status = 'Published';

  -- Count news published this week
  SELECT COUNT(*) INTO v_news_this_week
  FROM public.admin_news
  WHERE status = 'Published'
    AND date >= DATE_TRUNC('week', NOW());

  -- Count upcoming events (events with date >= today)
  SELECT COUNT(*) INTO v_upcoming_events
  FROM public.admin_events
  WHERE date >= CURRENT_DATE;

  -- Get the next upcoming event date
  SELECT TO_CHAR(date, 'Mon DD') INTO v_next_event_date
  FROM public.admin_events
  WHERE date >= CURRENT_DATE
  ORDER BY date ASC
  LIMIT 1;

  -- Count total service requests
  SELECT COUNT(*) INTO v_service_requests_count
  FROM public.admin_service_requests;

  -- Count pending service requests
  SELECT COUNT(*) INTO v_pending_requests
  FROM public.admin_service_requests
  WHERE status = 'Pending';

  -- Get licensed revenue from dashboard stats (first row)
  SELECT licensed_revenue INTO v_licensed_revenue
  FROM public.admin_dashboard_stats
  ORDER BY id ASC
  LIMIT 1;

  RETURN QUERY SELECT 
    COALESCE(v_total_patents, 0),
    COALESCE(v_patents_this_month, 0),
    COALESCE(v_published_news, 0),
    COALESCE(v_news_this_week, 0),
    COALESCE(v_upcoming_events, 0),
    COALESCE(v_next_event_date, 'No upcoming events'),
    COALESCE(v_service_requests_count, 0),
    COALESCE(v_pending_requests, 0),
    COALESCE(v_licensed_revenue, 0);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats() TO anon;

-- Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';
