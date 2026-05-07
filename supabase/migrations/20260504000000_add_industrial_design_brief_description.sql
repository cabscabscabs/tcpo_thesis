-- Industrial Design brief description:
-- Adds a text field for the brief description of an industrial design,
-- replacing the previous file upload approach (matching the Trademark pattern).

ALTER TABLE public.ip_applications
  ADD COLUMN IF NOT EXISTS industrial_design_brief_description TEXT;
