/**
 * IPOPHL-compliant validation rules for IP Applications
 */

const VALIDATION_RULES = {
  // Applicant Information
  applicant_full_name: {
    required: true,
    maxLength: 200,
    message: 'Full name is required and must not exceed 200 characters'
  },
  applicant_address: {
    required: true,
    maxLength: 500,
    message: 'Address is required and must not exceed 500 characters'
  },
  applicant_nationality: {
    required: true,
    message: 'Nationality is required'
  },
  applicant_email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Valid email address is required'
  },
  applicant_phone: {
    required: false,
    pattern: /^[\d\s\-\+\(\)]{7,20}$/,
    message: 'Phone number must be 7-20 characters'
  },

  // Invention Details
  title: {
    required: true,
    maxLength: 200,
    minLength: 5,
    message: 'Title is required (5-200 characters)'
  },
  ip_type: {
    required: true,
    enum: ['Patent', 'Utility Model', 'Industrial Design', 'Copyright'],
    message: 'IP Type must be one of: Patent, Utility Model, Industrial Design, Copyright'
  },
  abstract: {
    required: true,
    minWords: 150,
    maxWords: 250,
    message: 'Abstract must be between 150-250 words (IPOPHL standard)'
  },
  field_of_technology: {
    required: false,
    maxLength: 200,
    message: 'Field of technology must not exceed 200 characters'
  },
  background_of_invention: {
    required: true,
    minLength: 100,
    message: 'Background of invention is required (minimum 100 characters)'
  },
  detailed_description: {
    required: true,
    minLength: 200,
    message: 'Detailed description is required (minimum 200 characters)'
  },
  summary_of_invention: {
    required: true,
    minLength: 100,
    message: 'Summary of invention is required (minimum 100 characters)'
  },

  // Claims (required for Patent and Utility Model)
  claims: {
    requiredFor: ['Patent', 'Utility Model'],
    minItems: 1,
    message: 'At least one claim is required for Patents and Utility Models'
  },

  // Declaration
  declaration_confirmed: {
    required: true,
    mustBe: true,
    message: 'You must confirm the declaration of ownership and accuracy'
  }
};

/**
 * Count words in a string
 */
const countWords = (text) => {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * Validate a single field
 */
const validateField = (fieldName, value, rules = VALIDATION_RULES) => {
  const rule = rules[fieldName];
  const errors = [];

  if (!rule) {
    return { isValid: true, errors: [] };
  }

  // Required check
  if (rule.required && (value === undefined || value === null || value === '')) {
    errors.push(rule.message || `${fieldName} is required`);
    return { isValid: false, errors };
  }

  // Skip further validation if field is not required and empty
  if (!rule.required && (value === undefined || value === null || value === '')) {
    return { isValid: true, errors: [] };
  }

  // Type-specific validation
  const stringValue = String(value);

  // Min/Max length
  if (rule.minLength && stringValue.length < rule.minLength) {
    errors.push(`${fieldName} must be at least ${rule.minLength} characters`);
  }
  if (rule.maxLength && stringValue.length > rule.maxLength) {
    errors.push(`${fieldName} must not exceed ${rule.maxLength} characters`);
  }

  // Word count (for abstracts)
  if (rule.minWords || rule.maxWords) {
    const wordCount = countWords(stringValue);
    if (rule.minWords && wordCount < rule.minWords) {
      errors.push(`${fieldName} must have at least ${rule.minWords} words`);
    }
    if (rule.maxWords && wordCount > rule.maxWords) {
      errors.push(`${fieldName} must not exceed ${rule.maxWords} words`);
    }
  }

  // Pattern matching
  if (rule.pattern && !rule.pattern.test(stringValue)) {
    errors.push(rule.message || `${fieldName} format is invalid`);
  }

  // Enum validation
  if (rule.enum && !rule.enum.includes(value)) {
    errors.push(rule.message || `${fieldName} must be one of: ${rule.enum.join(', ')}`);
  }

  // Must be specific value
  if (rule.mustBe !== undefined && value !== rule.mustBe) {
    errors.push(rule.message || `${fieldName} must be ${rule.mustBe}`);
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate complete application data
 */
const validateApplication = (data, isDraft = false) => {
  const errors = {};
  let isValid = true;

  // Fields to validate
  const fieldsToValidate = [
    'applicant_full_name',
    'applicant_address',
    'applicant_nationality',
    'applicant_email',
    'applicant_phone',
    'title',
    'ip_type',
    'abstract',
    'field_of_technology',
    'background_of_invention',
    'detailed_description',
    'summary_of_invention'
  ];

  // Validate each field
  fieldsToValidate.forEach(field => {
    // Skip non-required fields for drafts
    if (isDraft && !VALIDATION_RULES[field]?.required) {
      return;
    }

    const result = validateField(field, data[field]);
    if (!result.isValid) {
      errors[field] = result.errors;
      isValid = false;
    }
  });

  // Validate claims for Patent and Utility Model
  if (!isDraft && ['Patent', 'Utility Model'].includes(data.ip_type)) {
    const claimsRule = VALIDATION_RULES.claims;
    if (!data.claims || !Array.isArray(data.claims) || data.claims.length < claimsRule.minItems) {
      errors.claims = [claimsRule.message];
      isValid = false;
    } else {
      // Validate each claim
      const claimErrors = [];
      data.claims.forEach((claim, index) => {
        if (!claim.claim_text || claim.claim_text.trim().length < 10) {
          claimErrors.push(`Claim ${index + 1} must have at least 10 characters`);
        }
        if (!claim.claim_type || !['independent', 'dependent'].includes(claim.claim_type)) {
          claimErrors.push(`Claim ${index + 1} must have a valid type (independent/dependent)`);
        }
      });
      if (claimErrors.length > 0) {
        errors.claims = claimErrors;
        isValid = false;
      }
    }
  }

  // Validate declaration for submission (not draft)
  if (!isDraft) {
    const declarationResult = validateField('declaration_confirmed', data.declaration_confirmed);
    if (!declarationResult.isValid) {
      errors.declaration_confirmed = declarationResult.errors;
      isValid = false;
    }
  }

  return { isValid, errors };
};

/**
 * Validate application update (only allowed fields can be updated)
 */
const validateApplicationUpdate = (data, currentStatus) => {
  // Only allow updates if status is 'Draft' or 'Needs Revision'
  const editableStatuses = ['Draft', 'Needs Revision'];
  
  if (!editableStatuses.includes(currentStatus)) {
    return {
      isValid: false,
      errors: {
        general: [`Cannot edit application with status: ${currentStatus}. Only Draft and Needs Revision statuses allow editing.`]
      }
    };
  }

  return validateApplication(data, currentStatus === 'Draft');
};

/**
 * Validate file upload
 */
const validateFileUpload = (file, allowedTypes = null) => {
  const errors = [];
  const maxSize = 10 * 1024 * 1024; // 10MB

  // Default allowed MIME types
  const defaultAllowedTypes = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'image/png': 'PNG',
    'image/jpeg': 'JPEG',
    'image/jpg': 'JPG'
  };

  const types = allowedTypes || defaultAllowedTypes;

  if (!file) {
    errors.push('No file provided');
    return { isValid: false, errors };
  }

  if (file.size > maxSize) {
    errors.push(`File size must not exceed 10MB`);
  }

  if (!types[file.mimetype]) {
    errors.push(`File type not allowed. Allowed types: ${Object.values(types).join(', ')}`);
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Sanitize application data before saving
 */
const sanitizeApplicationData = (data) => {
  const sanitized = {};
  
  // Text fields to sanitize
  const textFields = [
    'applicant_full_name',
    'applicant_address',
    'applicant_nationality',
    'applicant_email',
    'applicant_phone',
    'title',
    'field_of_technology',
    'abstract',
    'background_of_invention',
    'detailed_description',
    'summary_of_invention'
  ];

  textFields.forEach(field => {
    if (data[field] !== undefined) {
      // Trim and remove excessive whitespace
      sanitized[field] = String(data[field]).trim().replace(/\s+/g, ' ');
    }
  });

  // IP Type (ensure valid value)
  if (data.ip_type) {
    const validTypes = ['Patent', 'Utility Model', 'Industrial Design', 'Copyright'];
    sanitized.ip_type = validTypes.includes(data.ip_type) ? data.ip_type : null;
  }

  // Co-inventors (ensure valid JSON array)
  if (data.co_inventors) {
    try {
      const inventors = Array.isArray(data.co_inventors) 
        ? data.co_inventors 
        : JSON.parse(data.co_inventors);
      sanitized.co_inventors = JSON.stringify(inventors.filter(inv => 
        inv && typeof inv === 'object' && inv.name
      ));
    } catch {
      sanitized.co_inventors = '[]';
    }
  }

  // Claims (sanitize each claim)
  if (data.claims && Array.isArray(data.claims)) {
    sanitized.claims = data.claims.map(claim => ({
      claim_number: parseInt(claim.claim_number) || 0,
      claim_type: ['independent', 'dependent'].includes(claim.claim_type) 
        ? claim.claim_type 
        : 'independent',
      claim_text: String(claim.claim_text || '').trim(),
      depends_on: claim.depends_on ? parseInt(claim.depends_on) : null
    }));
  }

  // Declaration
  sanitized.declaration_confirmed = data.declaration_confirmed === true || 
                                     data.declaration_confirmed === 'true' ||
                                     data.declaration_confirmed === 1;

  return sanitized;
};

module.exports = {
  VALIDATION_RULES,
  validateField,
  validateApplication,
  validateApplicationUpdate,
  validateFileUpload,
  sanitizeApplicationData,
  countWords
};
