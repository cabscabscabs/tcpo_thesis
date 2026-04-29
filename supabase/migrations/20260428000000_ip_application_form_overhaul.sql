-- IP Application form overhaul:
-- Adds Classification fields (for Utility Model and Copyright) and Trademark text fields
-- that replace the previous Mark Representation image and Goods/Services file upload.
-- The co_inventors JSONB column already accepts the new email / contact_number keys,
-- so no migration is required for that change.

ALTER TABLE public.ip_applications
  ADD COLUMN IF NOT EXISTS classification TEXT,
  ADD COLUMN IF NOT EXISTS classification_other TEXT,
  ADD COLUMN IF NOT EXISTS trademark_goods_services TEXT,
  ADD COLUMN IF NOT EXISTS trademark_mark_description TEXT;
