-- Create activity_logs table for tracking admin dashboard activities
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL, -- e.g., 'news', 'technology', 'service', etc.
  action TEXT NOT NULL, -- e.g., 'created', 'updated', 'deleted', 'published', etc.
  title TEXT NOT NULL, -- title of the item the activity relates to
  description TEXT, -- optional additional details about the activity
  metadata JSONB, -- additional data related to the activity
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_activity_type ON public.activity_logs(activity_type);
CREATE INDEX idx_activity_logs_action ON public.activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at);

-- Enable Row Level Security
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create trigger for automatic updated_at
CREATE TRIGGER trg_activity_logs_updated_at
  BEFORE UPDATE ON public.activity_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Policies: Admins can manage all activity logs, authenticated users can only view their own
CREATE POLICY "Admins manage all activity logs"
  ON public.activity_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

CREATE POLICY "Authenticated users view their own activity logs"
  ON public.activity_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Public can view published activity logs"
  ON public.activity_logs
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);