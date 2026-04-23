-- Add files array column to admin_patents table to support multiple file attachments
ALTER TABLE admin_patents ADD COLUMN IF NOT EXISTS files JSONB DEFAULT NULL;

-- Add comment explaining the column structure
COMMENT ON COLUMN admin_patents.files IS 'JSON array of file objects: [{url: string, name: string}, ...]';
