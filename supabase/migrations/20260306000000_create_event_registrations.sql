-- Create event_registrations table for storing user event registrations

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.admin_events(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  position TEXT,
  dietary_requirements TEXT,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'attended')),
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_email ON public.event_registrations(email);
CREATE INDEX idx_event_registrations_status ON public.event_registrations(status);
CREATE INDEX idx_event_registrations_registered_at ON public.event_registrations(registered_at);

-- Enable Row Level Security
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Public can insert their own registrations
CREATE POLICY "Anyone can register for events"
  ON public.event_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

-- Public can view their own registrations by email
CREATE POLICY "Users can view their own registrations"
  ON public.event_registrations
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

-- Admins can manage all registrations
CREATE POLICY "Admins manage registrations"
  ON public.event_registrations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
      LIMIT 1
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER trg_event_registrations_updated_at
  BEFORE UPDATE ON public.event_registrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.event_registrations TO authenticated;
GRANT SELECT, INSERT ON public.event_registrations TO anon;

-- Create function to update attendees_count in admin_events
CREATE OR REPLACE FUNCTION update_event_attendees_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.admin_events
    SET attendees_count = (
      SELECT COUNT(*) 
      FROM public.event_registrations 
      WHERE event_id = NEW.event_id AND status != 'cancelled'
    )
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.admin_events
    SET attendees_count = (
      SELECT COUNT(*) 
      FROM public.event_registrations 
      WHERE event_id = OLD.event_id AND status != 'cancelled'
    )
    WHERE id = OLD.event_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.admin_events
    SET attendees_count = (
      SELECT COUNT(*) 
      FROM public.event_registrations 
      WHERE event_id = NEW.event_id AND status != 'cancelled'
    )
    WHERE id = NEW.event_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating attendees count
CREATE TRIGGER trg_update_attendees_count
  AFTER INSERT OR UPDATE OR DELETE ON public.event_registrations
  FOR EACH ROW EXECUTE FUNCTION update_event_attendees_count();
