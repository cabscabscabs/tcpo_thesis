-- Add description column to activity_logs for richer notifications
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS description TEXT;

-- Add activity_logs to realtime publication for admin notification bell
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'activity_logs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;
  END IF;
END $$;
