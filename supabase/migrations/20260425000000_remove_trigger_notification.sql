-- Migration: Remove notification creation from log_status_change trigger
-- This prevents duplicate notifications when admin updates application status,
-- since the frontend and backend API already create notifications manually
-- with richer content (e.g., admin review notes).

CREATE OR REPLACE FUNCTION public.log_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.ip_application_status_history (
      application_id,
      from_status,
      to_status,
      changed_by,
      change_reason
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      auth.uid(),
      TG_ARGV[0]
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
