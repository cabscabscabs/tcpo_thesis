-- Faculty IP Filing System - Database Schema
-- IPOPHL-compliant IP Application Management

-- ============================================
-- 1. IP APPLICATIONS TABLE (Main Records)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ip_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_number TEXT UNIQUE NOT NULL, -- Format: IP-YYYY-XXXXX
  faculty_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- IP Type
  ip_type TEXT NOT NULL CHECK (ip_type IN ('Patent', 'Utility Model', 'Industrial Design', 'Copyright')),
  
  -- Status Workflow
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN (
    'Draft',
    'Submitted for Internal Review',
    'Needs Revision',
    'Approved for IPOPHL Filing',
    'Filed to IPOPHL',
    'Under IPOPHL Examination',
    'Granted',
    'Rejected'
  )),
  
  -- Applicant Information
  applicant_full_name TEXT NOT NULL,
  applicant_address TEXT NOT NULL,
  applicant_nationality TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT,
  
  -- Invention/Work Details
  title TEXT NOT NULL CHECK (length(title) <= 200),
  abstract TEXT CHECK (length(abstract) >= 150 AND length(abstract) <= 250),
  field_of_technology TEXT,
  background_of_invention TEXT,
  detailed_description TEXT,
  summary_of_invention TEXT,
  
  -- Declaration
  declaration_confirmed BOOLEAN DEFAULT FALSE,
  declaration_date TIMESTAMPTZ,
  
  -- Co-inventors (stored as JSON array)
  co_inventors JSONB DEFAULT '[]'::jsonb,
  
  -- IPOPHL Filing Information (filled by admin)
  ipophl_filing_date DATE,
  ipophl_application_number TEXT,
  ipophl_publication_date DATE,
  ipophl_grant_date DATE,
  ipophl_office_actions JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  current_version INTEGER DEFAULT 1,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ
);

-- Indexes for ip_applications
CREATE INDEX IF NOT EXISTS idx_ip_applications_faculty_id ON public.ip_applications(faculty_id);
CREATE INDEX IF NOT EXISTS idx_ip_applications_status ON public.ip_applications(status);
CREATE INDEX IF NOT EXISTS idx_ip_applications_ip_type ON public.ip_applications(ip_type);
CREATE INDEX IF NOT EXISTS idx_ip_applications_application_number ON public.ip_applications(application_number);
CREATE INDEX IF NOT EXISTS idx_ip_applications_created_at ON public.ip_applications(created_at DESC);

-- ============================================
-- 2. IP APPLICATION CLAIMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ip_application_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.ip_applications(id) ON DELETE CASCADE,
  claim_number INTEGER NOT NULL,
  claim_type TEXT NOT NULL CHECK (claim_type IN ('independent', 'dependent')),
  claim_text TEXT NOT NULL,
  depends_on INTEGER, -- For dependent claims, references claim_number
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ip_application_claims_application_id ON public.ip_application_claims(application_id);
CREATE INDEX IF NOT EXISTS idx_ip_application_claims_claim_number ON public.ip_application_claims(application_id, claim_number);

-- ============================================
-- 3. IP APPLICATION ATTACHMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ip_application_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.ip_applications(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('drawing', 'document', 'supporting')),
  file_path TEXT NOT NULL, -- Supabase Storage path
  file_size INTEGER, -- in bytes
  mime_type TEXT,
  description TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ip_application_attachments_application_id ON public.ip_application_attachments(application_id);
CREATE INDEX IF NOT EXISTS idx_ip_application_attachments_file_type ON public.ip_application_attachments(file_type);

-- ============================================
-- 4. IP APPLICATION VERSIONS TABLE (Version Control)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ip_application_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.ip_applications(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  
  -- Snapshot of application data
  title TEXT,
  abstract TEXT,
  field_of_technology TEXT,
  background_of_invention TEXT,
  detailed_description TEXT,
  summary_of_invention TEXT,
  co_inventors JSONB,
  
  -- Change metadata
  change_summary TEXT,
  changed_by UUID REFERENCES auth.users(id),
  change_type TEXT CHECK (change_type IN ('auto_save', 'manual_save', 'revision')),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(application_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_ip_application_versions_application_id ON public.ip_application_versions(application_id);
CREATE INDEX IF NOT EXISTS idx_ip_application_versions_version_number ON public.ip_application_versions(application_id, version_number DESC);

-- ============================================
-- 5. IP APPLICATION STATUS HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ip_application_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.ip_applications(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  change_reason TEXT,
  ipophl_reference TEXT, -- For IPOPHL-related updates
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ip_application_status_history_application_id ON public.ip_application_status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_ip_application_status_history_created_at ON public.ip_application_status_history(created_at DESC);

-- ============================================
-- 6. IP APPLICATION COMMENTS TABLE (Reviewer Feedback)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ip_application_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.ip_applications(id) ON DELETE CASCADE,
  section TEXT CHECK (section IN ('general', 'applicant_info', 'abstract', 'claims', 'description', 'drawings')),
  comment TEXT NOT NULL,
  commented_by UUID REFERENCES auth.users(id),
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  parent_comment_id UUID REFERENCES public.ip_application_comments(id), -- For threaded comments
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ip_application_comments_application_id ON public.ip_application_comments(application_id);
CREATE INDEX IF NOT EXISTS idx_ip_application_comments_is_resolved ON public.ip_application_comments(is_resolved);

-- ============================================
-- 7. FACULTY NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.faculty_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.ip_applications(id) ON DELETE CASCADE,
  
  notification_type TEXT NOT NULL CHECK (notification_type IN (
    'submission_confirmed',
    'status_changed',
    'revision_required',
    'approved_for_filing',
    'filed_to_ipophl',
    'ipophl_update',
    'comment_added',
    'deadline_reminder'
  )),
  
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Action link
  action_url TEXT,
  action_text TEXT,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faculty_notifications_faculty_id ON public.faculty_notifications(faculty_id);
CREATE INDEX IF NOT EXISTS idx_faculty_notifications_is_read ON public.faculty_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_faculty_notifications_created_at ON public.faculty_notifications(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.ip_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_application_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_application_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_application_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_application_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_notifications ENABLE ROW LEVEL SECURITY;

-- IP Applications Policies
CREATE POLICY "Faculty can view own applications" ON public.ip_applications
  FOR SELECT USING (auth.uid() = faculty_id);

CREATE POLICY "Faculty can insert own applications" ON public.ip_applications
  FOR INSERT WITH CHECK (auth.uid() = faculty_id);

CREATE POLICY "Faculty can update own applications" ON public.ip_applications
  FOR UPDATE USING (auth.uid() = faculty_id AND status IN ('Draft', 'Needs Revision'));

CREATE POLICY "Admins can view all applications" ON public.ip_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all applications" ON public.ip_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Claims Policies
CREATE POLICY "Faculty can manage claims for own applications" ON public.ip_application_claims
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.ip_applications 
      WHERE id = application_id AND faculty_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all claims" ON public.ip_application_claims
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Attachments Policies
CREATE POLICY "Faculty can manage attachments for own applications" ON public.ip_application_attachments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.ip_applications 
      WHERE id = application_id AND faculty_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all attachments" ON public.ip_application_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Versions Policies
CREATE POLICY "Faculty can view versions for own applications" ON public.ip_application_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ip_applications 
      WHERE id = application_id AND faculty_id = auth.uid()
    )
  );

-- Status History Policies
CREATE POLICY "Faculty can view status history for own applications" ON public.ip_application_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ip_applications 
      WHERE id = application_id AND faculty_id = auth.uid()
    )
  );

-- Comments Policies
CREATE POLICY "Faculty can view comments for own applications" ON public.ip_application_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ip_applications 
      WHERE id = application_id AND faculty_id = auth.uid()
    )
  );

-- Notifications Policies
CREATE POLICY "Faculty can view own notifications" ON public.faculty_notifications
  FOR SELECT USING (auth.uid() = faculty_id);

CREATE POLICY "Faculty can update own notifications" ON public.faculty_notifications
  FOR UPDATE USING (auth.uid() = faculty_id);

-- ============================================
-- TRIGGERS AND FUNCTIONS
-- ============================================

-- Function to generate application number
CREATE OR REPLACE FUNCTION public.generate_application_number()
RETURNS TRIGGER AS $$
DECLARE
  year TEXT;
  sequence_num INTEGER;
  new_number TEXT;
BEGIN
  year := TO_CHAR(NOW(), 'YYYY');
  
  -- Get the next sequence number for this year
  SELECT COUNT(*) + 1 INTO sequence_num
  FROM public.ip_applications
  WHERE application_number LIKE 'IP-' || year || '-%';
  
  new_number := 'IP-' || year || '-' || LPAD(sequence_num::TEXT, 5, '0');
  
  NEW.application_number := new_number;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate application number
CREATE TRIGGER trigger_generate_application_number
  BEFORE INSERT ON public.ip_applications
  FOR EACH ROW
  WHEN (NEW.application_number IS NULL)
  EXECUTE FUNCTION public.generate_application_number();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_ip_applications_updated_at
  BEFORE UPDATE ON public.ip_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_ip_application_claims_updated_at
  BEFORE UPDATE ON public.ip_application_claims
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_ip_application_comments_updated_at
  BEFORE UPDATE ON public.ip_application_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to log status changes
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
    
    -- Create notification for faculty
    INSERT INTO public.faculty_notifications (
      faculty_id,
      application_id,
      notification_type,
      title,
      message,
      action_url,
      action_text
    ) VALUES (
      NEW.faculty_id,
      NEW.id,
      'status_changed',
      'Application Status Updated',
      'Your application ' || NEW.application_number || ' status changed from ' || COALESCE(OLD.status, 'N/A') || ' to ' || NEW.status,
      '/faculty/applications/' || NEW.id,
      'View Application'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log status changes
CREATE TRIGGER trigger_log_status_change
  AFTER UPDATE ON public.ip_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.log_status_change();

-- Function to create initial version on application insert
CREATE OR REPLACE FUNCTION public.create_initial_version()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.ip_application_versions (
    application_id,
    version_number,
    title,
    abstract,
    field_of_technology,
    background_of_invention,
    detailed_description,
    summary_of_invention,
    co_inventors,
    change_summary,
    changed_by,
    change_type
  ) VALUES (
    NEW.id,
    1,
    NEW.title,
    NEW.abstract,
    NEW.field_of_technology,
    NEW.background_of_invention,
    NEW.detailed_description,
    NEW.summary_of_invention,
    NEW.co_inventors,
    'Initial version created',
    NEW.faculty_id,
    'manual_save'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create initial version
CREATE TRIGGER trigger_create_initial_version
  AFTER INSERT ON public.ip_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.create_initial_version();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.ip_applications TO authenticated;
GRANT ALL ON public.ip_application_claims TO authenticated;
GRANT ALL ON public.ip_application_attachments TO authenticated;
GRANT ALL ON public.ip_application_versions TO authenticated;
GRANT ALL ON public.ip_application_status_history TO authenticated;
GRANT ALL ON public.ip_application_comments TO authenticated;
GRANT ALL ON public.faculty_notifications TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
