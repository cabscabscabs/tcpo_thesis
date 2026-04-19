import { useState, useEffect, useCallback, useMemo } from 'react';

export type IPType = 'Patent' | 'Utility Model' | 'Industrial Design' | 'Trademark' | 'Copyright';

export interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
  formats: string[];
  maxSizeMB: number;
  conditional?: {
    field: string;
    value: boolean;
  };
}

export interface ValidatedFile {
  file: File;
  fileName: string;
  fileSize: number;
  fileType: string;
  documentType: string;
  isValid: boolean;
  errors: string[];
}

export interface ValidationResult {
  isValid: boolean;
  isComplete: boolean;
  missingDocs: string[];
  invalidFiles: ValidatedFile[];
  requirements: DocumentRequirement[];
  uploadedDocs: ValidatedFile[];
  progress: {
    total: number;
    completed: number;
    percentage: number;
  };
}

// IPOPHL Document Requirements
const DOCUMENT_REQUIREMENTS: Record<IPType, DocumentRequirement[]> = {
  'Patent': [
    {
      id: 'specification',
      name: 'Specification',
      description: 'Complete patent specification document',
      required: true,
      formats: ['.pdf'],
      maxSizeMB: 20
    },
    {
      id: 'claims',
      name: 'Claims',
      description: 'Patent claims document',
      required: true,
      formats: ['.pdf'],
      maxSizeMB: 20
    },
    {
      id: 'drawings',
      name: 'Drawings',
      description: 'Technical drawings (if applicable)',
      required: false,
      formats: ['.pdf'],
      maxSizeMB: 20
    },
    {
      id: 'abstract',
      name: 'Abstract',
      description: 'Patent abstract document',
      required: true,
      formats: ['.pdf'],
      maxSizeMB: 20
    },
    {
      id: 'priority_documents',
      name: 'Priority Documents',
      description: 'Priority claim documents',
      required: false,
      formats: ['.pdf'],
      maxSizeMB: 20,
      conditional: { field: 'claimsPriority', value: true }
    },
    {
      id: 'deed_of_assignment',
      name: 'Deed of Assignment',
      description: 'Required if applicant is not the inventor',
      required: false,
      formats: ['.pdf'],
      maxSizeMB: 20,
      conditional: { field: 'isApplicantInventor', value: false }
    },
    {
      id: 'spa',
      name: 'Special Power of Attorney',
      description: 'Required if filing through an agent',
      required: false,
      formats: ['.pdf'],
      maxSizeMB: 20,
      conditional: { field: 'isAgentFiling', value: true }
    },
    {
      id: 'small_entity',
      name: 'Small Entity Declaration',
      description: 'Small entity status declaration',
      required: false,
      formats: ['.pdf'],
      maxSizeMB: 20,
      conditional: { field: 'isSmallEntity', value: true }
    }
  ],
  'Utility Model': [
    {
      id: 'specification',
      name: 'Specification',
      description: 'Complete utility model specification',
      required: true,
      formats: ['.pdf'],
      maxSizeMB: 20
    },
    {
      id: 'claims',
      name: 'Claims (Max 5)',
      description: 'Utility model claims (maximum 5 claims)',
      required: true,
      formats: ['.pdf'],
      maxSizeMB: 20
    },
    {
      id: 'drawings',
      name: 'Drawings',
      description: 'Technical drawings',
      required: true,
      formats: ['.pdf'],
      maxSizeMB: 20
    },
    {
      id: 'abstract',
      name: 'Abstract',
      description: 'Utility model abstract',
      required: true,
      formats: ['.pdf'],
      maxSizeMB: 20
    },
    {
      id: 'priority_documents',
      name: 'Priority Documents',
      description: 'Priority claim documents',
      required: false,
      formats: ['.pdf'],
      maxSizeMB: 20,
      conditional: { field: 'claimsPriority', value: true }
    },
    {
      id: 'small_entity',
      name: 'Small Entity Declaration',
      description: 'Small entity status declaration',
      required: false,
      formats: ['.pdf'],
      maxSizeMB: 20,
      conditional: { field: 'isSmallEntity', value: true }
    }
  ],
  'Industrial Design': [
    {
      id: 'representations',
      name: 'Representations/Drawings',
      description: 'Six views of the design',
      required: true,
      formats: ['.pdf', '.jpg', '.jpeg', '.png'],
      maxSizeMB: 20
    },
    {
      id: 'description',
      name: 'Brief Description',
      description: 'Brief description of the design',
      required: true,
      formats: ['.pdf'],
      maxSizeMB: 20
    },
    {
      id: 'priority_documents',
      name: 'Priority Documents',
      description: 'Priority claim documents',
      required: false,
      formats: ['.pdf'],
      maxSizeMB: 20,
      conditional: { field: 'claimsPriority', value: true }
    },
    {
      id: 'deed_of_assignment',
      name: 'Deed of Assignment / Declaration',
      description: 'Ownership declaration',
      required: true,
      formats: ['.pdf'],
      maxSizeMB: 20
    },
    {
      id: 'small_entity',
      name: 'Small Entity Declaration',
      description: 'Small entity status declaration',
      required: false,
      formats: ['.pdf'],
      maxSizeMB: 20,
      conditional: { field: 'isSmallEntity', value: true }
    }
  ],
  'Trademark': [
    {
      id: 'mark_representation',
      name: 'Mark Representation',
      description: 'Clear image of the trademark',
      required: true,
      formats: ['.jpg', '.jpeg', '.png'],
      maxSizeMB: 10
    },
    {
      id: 'goods_services',
      name: 'List of Goods/Services',
      description: 'Nice Classification list',
      required: true,
      formats: ['.pdf', '.txt', '.doc', '.docx'],
      maxSizeMB: 20
    },
    {
      id: 'spa',
      name: 'Special Power of Attorney',
      description: 'Required if filing through an agent',
      required: false,
      formats: ['.pdf'],
      maxSizeMB: 20,
      conditional: { field: 'isAgentFiling', value: true }
    },
    {
      id: 'priority_documents',
      name: 'Priority Documents',
      description: 'Priority claim documents',
      required: false,
      formats: ['.pdf'],
      maxSizeMB: 20,
      conditional: { field: 'claimsPriority', value: true }
    }
  ],
  'Copyright': [
    {
      id: 'work_copy',
      name: 'Copy of the Work',
      description: 'The work being registered',
      required: true,
      formats: ['.pdf', '.jpg', '.jpeg', '.png', '.mp3', '.mp4', '.doc', '.docx'],
      maxSizeMB: 50
    },
    {
      id: 'affidavit_ownership',
      name: 'Affidavit of Ownership',
      description: 'Required if owner is not the author',
      required: false,
      formats: ['.pdf'],
      maxSizeMB: 20,
      conditional: { field: 'isOwnerAuthor', value: false }
    },
    {
      id: 'government_id',
      name: 'Government-Issued ID',
      description: 'ID of author(s)/owner(s)',
      required: true,
      formats: ['.pdf', '.jpg', '.jpeg', '.png'],
      maxSizeMB: 10
    }
  ]
};

interface FormState {
  ip_type?: IPType;
  claimsPriority?: boolean;
  isAgentFiling?: boolean;
  isSmallEntity?: boolean;
  isApplicantInventor?: boolean;
  isOwnerAuthor?: boolean;
  attachments?: any[];
}

export function useDocumentValidation(ipType: IPType | undefined, formState: FormState) {
  const [validatedFiles, setValidatedFiles] = useState<ValidatedFile[]>([]);

  // Get requirements for current IP type
  const requirements = useMemo(() => {
    if (!ipType) return [];
    return DOCUMENT_REQUIREMENTS[ipType] || [];
  }, [ipType]);

  // Filter requirements based on conditional fields
  const activeRequirements = useMemo(() => {
    return requirements.filter(req => {
      if (!req.conditional) return true;
      const fieldValue = formState[req.conditional.field as keyof FormState];
      return fieldValue === req.conditional.value;
    });
  }, [requirements, formState]);

  // Validate a single file
  const validateFile = useCallback((file: File, documentType: string): ValidatedFile => {
    const requirement = activeRequirements.find(r => r.id === documentType);
    const errors: string[] = [];

    if (!requirement) {
      return {
        file,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        documentType,
        isValid: false,
        errors: ['Unknown document type']
      };
    }

    // Check file extension
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!requirement.formats.includes(fileExtension)) {
      errors.push(`Invalid format. Required: ${requirement.formats.join(', ')}`);
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > requirement.maxSizeMB) {
      errors.push(`File too large. Maximum: ${requirement.maxSizeMB}MB`);
    }

    // Check filename (no special characters, use underscores)
    const validNamePattern = /^[a-zA-Z0-9_\-\.]+$/;
    if (!validNamePattern.test(file.name)) {
      errors.push('Filename contains special characters. Use only letters, numbers, underscores, and hyphens.');
    }

    return {
      file,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      documentType,
      isValid: errors.length === 0,
      errors
    };
  }, [activeRequirements]);

  // Validate all uploaded files
  useEffect(() => {
    if (!formState.attachments) {
      setValidatedFiles([]);
      return;
    }

    const validated = formState.attachments.map((attachment: any) => {
      // Try to determine document type from filename or attachment_type
      let docType = attachment.document_type || attachment.attachment_type;
      
      // If no document type is set, try to infer from filename
      if (!docType || docType === 'document' || docType === 'drawing') {
        const filename = attachment.file_name?.toLowerCase() || '';
        if (filename.includes('specification')) docType = 'specification';
        else if (filename.includes('claim')) docType = 'claims';
        else if (filename.includes('drawing') || filename.includes('figure')) docType = 'drawings';
        else if (filename.includes('abstract')) docType = 'abstract';
        else if (filename.includes('priority')) docType = 'priority_documents';
        else if (filename.includes('assignment') || filename.includes('deed')) docType = 'deed_of_assignment';
        else if (filename.includes('spa') || filename.includes('attorney')) docType = 'spa';
        else if (filename.includes('small') || filename.includes('entity')) docType = 'small_entity';
        else if (filename.includes('mark') || filename.includes('logo')) docType = 'mark_representation';
        else if (filename.includes('goods') || filename.includes('services')) docType = 'goods_services';
        else if (filename.includes('work') || filename.includes('copy')) docType = 'work_copy';
        else if (filename.includes('affidavit') || filename.includes('ownership')) docType = 'affidavit_ownership';
        else if (filename.includes('id') || filename.includes('passport')) docType = 'government_id';
        else if (filename.includes('description')) docType = 'description';
        else if (filename.includes('representation')) docType = 'representations';
      }

      return validateFile(attachment.file || attachment, docType || 'unknown');
    });

    setValidatedFiles(validated);
  }, [formState.attachments, validateFile]);

  // Calculate validation result
  const validationResult: ValidationResult = useMemo(() => {
    const requiredDocs = activeRequirements.filter(r => r.required);
    const uploadedDocTypes = new Set(validatedFiles.filter(f => f.isValid).map(f => f.documentType));
    
    const missingDocs = requiredDocs
      .filter(req => !uploadedDocTypes.has(req.id))
      .map(req => req.name);

    const invalidFiles = validatedFiles.filter(f => !f.isValid);
    
    const completedDocs = requiredDocs.filter(req => uploadedDocTypes.has(req.id)).length;
    const totalRequired = requiredDocs.length;

    return {
      isValid: missingDocs.length === 0 && invalidFiles.length === 0,
      isComplete: missingDocs.length === 0,
      missingDocs,
      invalidFiles,
      requirements: activeRequirements,
      uploadedDocs: validatedFiles.filter(f => f.isValid),
      progress: {
        total: totalRequired,
        completed: completedDocs,
        percentage: totalRequired > 0 ? Math.round((completedDocs / totalRequired) * 100) : 100
      }
    };
  }, [activeRequirements, validatedFiles]);

  // Add a file with document type
  const addFile = useCallback((file: File, documentType: string) => {
    const validated = validateFile(file, documentType);
    setValidatedFiles(prev => [...prev, validated]);
    return validated;
  }, [validateFile]);

  // Remove a file
  const removeFile = useCallback((index: number) => {
    setValidatedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Get error messages for display
  const getErrorMessages = useCallback((): string[] => {
    const messages: string[] = [];

    // Missing required documents
    if (validationResult.missingDocs.length > 0) {
      messages.push(`Missing required documents: ${validationResult.missingDocs.join(', ')}`);
    }

    // Invalid files
    validationResult.invalidFiles.forEach(file => {
      file.errors.forEach(error => {
        messages.push(`${file.fileName}: ${error}`);
      });
    });

    // Conditional requirements
    activeRequirements.forEach(req => {
      if (req.conditional && req.required) {
        const fieldValue = formState[req.conditional.field as keyof FormState];
        if (fieldValue === req.conditional.value) {
          const hasDoc = validatedFiles.some(f => f.documentType === req.id && f.isValid);
          if (!hasDoc) {
            messages.push(`${req.name} is required because ${req.conditional.field} is selected`);
          }
        }
      }
    });

    return messages;
  }, [validationResult, activeRequirements, formState, validatedFiles]);

  return {
    ...validationResult,
    addFile,
    removeFile,
    getErrorMessages,
    validateFile
  };
}

export default useDocumentValidation;
