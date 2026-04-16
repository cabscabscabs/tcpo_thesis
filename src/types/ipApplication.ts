// IP Application Types for Faculty IP Filing System

export type IPType = 'Patent' | 'Utility Model' | 'Industrial Design' | 'Copyright' | 'Trademark';

export type ApplicationStatus = 
  | 'Draft'
  | 'Submitted for Internal Review'
  | 'Under Internal Review'
  | 'Needs Revision'
  | 'Approved for IPOPHL Filing'
  | 'Filed to IPOPHL'
  | 'Under IPOPHL Examination'
  | 'Published'
  | 'Granted'
  | 'Rejected'
  | 'Withdrawn';

export interface IPApplication {
  id: string;
  application_number: string;
  faculty_id: string;
  ip_type: IPType;
  title: string;
  status: ApplicationStatus;
  
  // Applicant Information
  applicant_name: string;
  applicant_address: string;
  applicant_nationality: string;
  applicant_contact: string;
  applicant_email: string;
  
  // Invention/Work Details
  abstract: string;
  detailed_description: string;
  field_of_technology: string;
  background_of_invention: string;
  summary_of_invention: string;
  
  // Co-inventors
  co_inventors: CoInventor[];
  
  // Version control
  version: number;
  is_current_version: boolean;
  previous_version_id: string | null;
  
  // IPOPHL Filing Info
  ipophl_filing_date: string | null;
  ipophl_application_number: string | null;
  ipophl_status: string | null;
  
  // Timeline
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
}

export interface CoInventor {
  name: string;
  address: string;
  nationality: string;
  contribution: string;
}

export interface IPClaim {
  id: string;
  application_id: string;
  claim_number: number;
  claim_type: 'independent' | 'dependent';
  parent_claim_number: number | null;
  text: string;
  created_at: string;
}

export interface IPAttachment {
  id: string;
  application_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  attachment_type: 'drawing' | 'document' | 'form' | 'other';
  description: string | null;
  uploaded_at: string;
}

export interface IPApplicationVersion {
  id: string;
  application_id: string;
  version_number: number;
  changes_summary: string;
  created_at: string;
  created_by: string;
}

export interface IPApplicationStatusHistory {
  id: string;
  application_id: string;
  status: ApplicationStatus;
  comments: string | null;
  changed_by: string;
  changed_at: string;
}

export interface IPApplicationComment {
  id: string;
  application_id: string;
  comment: string;
  commenter_name: string;
  commenter_role: string;
  is_internal: boolean;
  created_at: string;
}

export interface FacultyNotification {
  id: string;
  faculty_id: string;
  application_id: string | null;
  title: string;
  message: string;
  type: 'status_change' | 'comment' | 'revision_required' | 'approval' | 'general';
  is_read: boolean;
  created_at: string;
}

// Form types for multi-step submission
export interface IPApplicationFormData {
  // Step 1: Applicant Info
  applicant_name: string;
  applicant_address: string;
  applicant_nationality: string;
  applicant_contact: string;
  applicant_email: string;
  
  // Step 2: Invention Details
  ip_type: IPType;
  title: string;
  abstract: string;
  field_of_technology: string;
  background_of_invention: string;
  summary_of_invention: string;
  detailed_description: string;
  co_inventors: CoInventor[];
  
  // Step 3: Claims & Drawings
  claims: IPClaim[];
  attachments: File[];
}

// API Response types
export interface IPApplicationListResponse {
  applications: IPApplication[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IPApplicationDetailResponse extends IPApplication {
  claims: IPClaim[];
  attachments: IPAttachment[];
  versions: IPApplicationVersion[];
  status_history: IPApplicationStatusHistory[];
  comments: IPApplicationComment[];
}

// Status badge configuration
export const statusConfig: Record<ApplicationStatus, { label: string; color: string; bgColor: string }> = {
  'Draft': { 
    label: 'Draft', 
    color: 'text-gray-700', 
    bgColor: 'bg-gray-100' 
  },
  'Submitted for Internal Review': { 
    label: 'Submitted', 
    color: 'text-blue-700', 
    bgColor: 'bg-blue-100' 
  },
  'Under Internal Review': { 
    label: 'Under Review', 
    color: 'text-yellow-700', 
    bgColor: 'bg-yellow-100' 
  },
  'Needs Revision': { 
    label: 'Needs Revision', 
    color: 'text-orange-700', 
    bgColor: 'bg-orange-100' 
  },
  'Approved for IPOPHL Filing': { 
    label: 'Approved', 
    color: 'text-green-700', 
    bgColor: 'bg-green-100' 
  },
  'Filed to IPOPHL': { 
    label: 'Filed to IPOPHL', 
    color: 'text-purple-700', 
    bgColor: 'bg-purple-100' 
  },
  'Under IPOPHL Examination': { 
    label: 'Under Examination', 
    color: 'text-indigo-700', 
    bgColor: 'bg-indigo-100' 
  },
  'Published': { 
    label: 'Published', 
    color: 'text-cyan-700', 
    bgColor: 'bg-cyan-100' 
  },
  'Granted': { 
    label: 'Granted', 
    color: 'text-emerald-700', 
    bgColor: 'bg-emerald-100' 
  },
  'Rejected': { 
    label: 'Rejected', 
    color: 'text-red-700', 
    bgColor: 'bg-red-100' 
  },
  'Withdrawn': { 
    label: 'Withdrawn', 
    color: 'text-gray-500', 
    bgColor: 'bg-gray-200' 
  }
};

// IP Type configuration
export const ipTypeConfig: Record<IPType, { label: string; icon: string; description: string }> = {
  'Patent': {
    label: 'Patent',
    icon: 'file-text',
    description: 'Invention with novelty, inventive step, and industrial applicability'
  },
  'Utility Model': {
    label: 'Utility Model',
    icon: 'settings',
    description: 'Technical solution with novelty and industrial applicability'
  },
  'Industrial Design': {
    label: 'Industrial Design',
    icon: 'palette',
    description: 'Ornamental or aesthetic aspect of an article'
  },
  'Copyright': {
    label: 'Copyright',
    icon: 'book-open',
    description: 'Original literary, artistic, and scientific works'
  },
  'Trademark': {
    label: 'Trademark',
    icon: 'tag',
    description: 'Visible sign distinguishing goods/services'
  }
};
