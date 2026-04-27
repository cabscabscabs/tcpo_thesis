-- Fix: Replace COUNT(*)+1 with MAX(suffix)+1 in generate_application_number()
-- COUNT(*)+1 produces duplicates when rows are deleted (e.g., if IP-2026-00002 is deleted,
-- COUNT(*) returns 2, so next insert gets IP-2026-00003 which already exists).
-- MAX(suffix)+1 always finds the highest existing number and increments from there.

CREATE OR REPLACE FUNCTION public.generate_application_number()
RETURNS TRIGGER AS $func$
BEGIN
  NEW.application_number := 'IP-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(
    (SELECT COALESCE(
       MAX(CAST(SUBSTRING(application_number FROM '[0-9]+$') AS INTEGER)),
       0
     ) + 1
     FROM public.ip_applications
     WHERE application_number LIKE 'IP-' || TO_CHAR(NOW(), 'YYYY') || '-%')::TEXT,
    5, '0');
  RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

-- Drop and recreate the trigger to pick up the new function
DROP TRIGGER IF EXISTS trigger_generate_application_number ON public.ip_applications;
CREATE TRIGGER trigger_generate_application_number
  BEFORE INSERT ON public.ip_applications
  FOR EACH ROW
  WHEN (NEW.application_number IS NULL)
  EXECUTE FUNCTION public.generate_application_number();
