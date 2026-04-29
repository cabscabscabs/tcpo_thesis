import { useState, useEffect, useCallback, useMemo } from 'react';

export type IPType = 'Patent' | 'Utility Model' | 'Industrial Design' | 'Trademark' | 'Copyright';

export interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
  formats: string[];
  maxSizeMB: number;
}

export interface ValidatedFile {
  file?: File;
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

// Simplified IPOPHL document requirements for TPCO internal submission
const DOCUMENT_REQUIREMENTS: Record<IPType, DocumentRequirement[]> = {
  'Patent': [
    {
      id: 'specification',
      name: 'Specification',
      description: 'Complete patent specification document',
      required: true,
      formats: ['.pdf', '.doc', '.docx'],
      maxSizeMB: 20
    }
  ],
  'Utility Model': [
    {
      id: 'specification',
      name: 'Specification',
      description: 'Complete utility model specification',
      required: true,
      formats: ['.pdf', '.doc', '.docx'],
      maxSizeMB: 20
    },
    {
      id: 'drawings',
      name: 'Drawing',
      description: 'Technical drawings (optional)',
      required: false,
      formats: ['.pdf', '.jpg', '.jpeg', '.png'],
      maxSizeMB: 100
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
      formats: ['.pdf', '.doc', '.docx'],
      maxSizeMB: 20
    }
  ],
  // Trademark required inputs are captured as text fields in the form,
  // not as file uploads, so the checklist is intentionally empty.
  'Trademark': [],
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
  attachments?: any[];
}

export function useDocumentValidation(ipType: IPType | undefined, formState: FormState) {
  const [validatedFiles, setValidatedFiles] = useState<ValidatedFile[]>([]);

  // Get requirements for current IP type
  const requirements = useMemo(() => {
    if (!ipType) return [];
    return DOCUMENT_REQUIREMENTS[ipType] || [];
  }, [ipType]);

  // No conditional filtering anymore — all requirements are static per IP type
  const activeRequirements = requirements;

  const attachments = formState.attachments;

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
    if (!attachments) {
      setValidatedFiles([]);
      return;
    }

    const validated = attachments
      .filter((attachment: any) => {
        // Joint Affidavit is handled independently in the Declaration section and
        // is NOT part of the per-IP-type document checklist — skip it here so it
        // doesn't get flagged as an "Unknown document type".
        if (attachment.document_type === 'joint_affidavit' || attachment.attachment_type === 'joint_affidavit') {
          return false;
        }
        // Only validate files that are part of the document checklist.
        // Files from "Additional Attachments" have attachment_type 'document' or 'drawing'
        // without a specific document_type — these are supplementary and always valid.
        const hasDocType = !!attachment.document_type;
        const isGenericAttachment = attachment.attachment_type === 'document' || attachment.attachment_type === 'drawing';
        return hasDocType || !isGenericAttachment;
      })
      .map((attachment: any) => {
        // Try to determine document type from document_type or attachment_type
        let docType = attachment.document_type || attachment.attachment_type;

        // If no document type is set, try to infer from filename
        if (!docType || docType === 'document' || docType === 'drawing') {
          const filename = attachment.file_name?.toLowerCase() || '';
          if (filename.includes('specification')) docType = 'specification';
          else if (filename.includes('drawing') || filename.includes('figure')) docType = 'drawings';
          else if (filename.includes('work') || filename.includes('copy')) docType = 'work_copy';
          else if (filename.includes('id') || filename.includes('passport')) docType = 'government_id';
          else if (filename.includes('description')) docType = 'description';
          else if (filename.includes('representation')) docType = 'representations';
        }

        // Handle existing DB attachments (no file object)
        if (attachment.isExisting || !attachment.file) {
          return {
            file: undefined,
            fileName: attachment.file_name || 'Unknown',
            fileSize: attachment.file_size || 0,
            fileType: attachment.file_type || 'application/octet-stream',
            documentType: docType || attachment.document_type || attachment.attachment_type || 'unknown',
            isValid: true,
            errors: []
          } as ValidatedFile;
        }

        return validateFile(attachment.file, docType || 'unknown');
      });

    setValidatedFiles(validated);
  }, [attachments, validateFile]);

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

    if (validationResult.missingDocs.length > 0) {
      messages.push(`Missing required documents: ${validationResult.missingDocs.join(', ')}`);
    }

    validationResult.invalidFiles.forEach(file => {
      file.errors.forEach(error => {
        messages.push(`${file.fileName}: ${error}`);
      });
    });

    return messages;
  }, [validationResult]);

  return {
    ...validationResult,
    addFile,
    removeFile,
    getErrorMessages,
    validateFile
  };
}

export default useDocumentValidation;
