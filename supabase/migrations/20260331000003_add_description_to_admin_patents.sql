-- Add description column to admin_patents table
ALTER TABLE admin_patents ADD COLUMN IF NOT EXISTS description TEXT;

-- Update the updated_at trigger to include the new column
COMMENT ON COLUMN admin_patents.description IS 'Brief description of the patent';
