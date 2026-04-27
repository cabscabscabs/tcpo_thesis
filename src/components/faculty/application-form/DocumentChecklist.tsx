import { useState, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Upload, 
  FileText,
  FileImage,
  File,
  X,
  Info,
  AlertCircle
} from 'lucide-react';
import { useDocumentValidation, IPType, ValidatedFile } from '@/hooks/useDocumentValidation';
import { cn } from '@/lib/utils';

interface DocumentChecklistProps {
  onValidationChange?: (isValid: boolean) => void;
}

const DOCUMENT_ICONS: Record<string, React.ReactNode> = {
  'specification': <FileText className="h-5 w-5" />,
  'claims': <FileText className="h-5 w-5" />,
  'drawings': <FileImage className="h-5 w-5" />,
  'abstract': <FileText className="h-5 w-5" />,
  'priority_documents': <FileText className="h-5 w-5" />,
  'deed_of_assignment': <FileText className="h-5 w-5" />,
  'spa': <FileText className="h-5 w-5" />,
  'small_entity': <FileText className="h-5 w-5" />,
  'representations': <FileImage className="h-5 w-5" />,
  'description': <FileText className="h-5 w-5" />,
  'mark_representation': <FileImage className="h-5 w-5" />,
  'goods_services': <FileText className="h-5 w-5" />,
  'work_copy': <File className="h-5 w-5" />,
  'affidavit_ownership': <FileText className="h-5 w-5" />,
  'government_id': <FileText className="h-5 w-5" />,
};

const FORMAT_LABELS: Record<string, string> = {
  '.pdf': 'PDF',
  '.jpg': 'JPG',
  '.jpeg': 'JPEG',
  '.png': 'PNG',
  '.mp3': 'MP3',
  '.mp4': 'MP4',
  '.doc': 'DOC',
  '.docx': 'DOCX',
  '.txt': 'TXT'
};

export function DocumentChecklist({ onValidationChange }: DocumentChecklistProps) {
  const { toast } = useToast();
  const { watch, setValue } = useFormContext();
  const ipType = watch('ip_type') as IPType;
  const claimsPriority = watch('claimsPriority');
  const isAgentFiling = watch('isAgentFiling');
  const isSmallEntity = watch('isSmallEntity');
  const isApplicantInventor = watch('isApplicantInventor');
  const isOwnerAuthor = watch('isOwnerAuthor');
  const attachments = watch('attachments') || [];
  
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);

  const formState = {
    ip_type: ipType,
    claimsPriority,
    isAgentFiling,
    isSmallEntity,
    isApplicantInventor,
    isOwnerAuthor,
    attachments
  };

  const {
    isValid,
    isComplete,
    missingDocs,
    invalidFiles,
    requirements,
    uploadedDocs,
    progress,
    getErrorMessages,
    addFile
  } = useDocumentValidation(ipType, formState);

  // Notify parent of validation change
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingDocId(docId);
    
    const file = files[0];
    const validated = addFile(file, docId);
    
    if (validated.isValid) {
      // Add to form attachments with document type
      const newAttachment = {
        file,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        attachment_type: 'document',
        document_type: docId
      };
      
      const existingIndex = attachments.findIndex((a: any) => a.document_type === docId);
      let newAttachments;
      
      if (existingIndex >= 0) {
        // Replace existing file for this document type
        newAttachments = [...attachments];
        newAttachments[existingIndex] = newAttachment;
      } else {
        // Add new file
        newAttachments = [...attachments, newAttachment];
      }
      
      setValue('attachments', newAttachments);
    } else {
      // Show validation errors to the user
      toast({
        title: `Upload Failed: ${file.name}`,
        description: validated.errors.join('. '),
        variant: 'destructive',
      });
    }
    
    setUploadingDocId(null);
    
    // Reset input
    event.target.value = '';
  }, [addFile, attachments, setValue]);

  const removeFile = useCallback((docId: string) => {
    const newAttachments = attachments.filter((a: any) => a.document_type !== docId);
    setValue('attachments', newAttachments);
  }, [attachments, setValue]);

  const getUploadedFileForDoc = (docId: string): ValidatedFile | undefined => {
    return uploadedDocs.find(f => f.documentType === docId);
  };

  const getInvalidFileForDoc = (docId: string): ValidatedFile | undefined => {
    return invalidFiles.find(f => f.documentType === docId);
  };

  if (!ipType) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Select IP Type</AlertTitle>
        <AlertDescription>
          Please select an IP type in the previous step to see required documents.
        </AlertDescription>
      </Alert>
    );
  }

  const errorMessages = getErrorMessages();

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className={cn(
        "border-l-4",
        isValid ? "border-l-green-500" : isComplete ? "border-l-yellow-500" : "border-l-red-500"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              {isValid ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : isComplete ? (
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              <div>
                <h3 className="font-semibold">
                  {isValid ? 'All Documents Ready' : isComplete ? 'Documents Complete with Issues' : 'Documents Incomplete'}
                </h3>
                <p className="text-sm text-gray-500">
                  {progress.completed} of {progress.total} required documents uploaded
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-700">{progress.percentage}%</span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Error Messages */}
      {errorMessages.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Document Issues</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {errorMessages.map((msg, idx) => (
                <li key={idx} className="text-sm">{msg}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Document List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Required Documents for {ipType}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {requirements.map((req) => {
            const uploadedFile = getUploadedFileForDoc(req.id);
            const invalidFile = getInvalidFileForDoc(req.id);
            const isUploaded = !!uploadedFile;
            const hasError = !!invalidFile;

            return (
              <div
                key={req.id}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all",
                  isUploaded 
                    ? "border-green-200 bg-green-50" 
                    : hasError
                    ? "border-red-200 bg-red-50"
                    : req.required
                    ? "border-gray-200 bg-white"
                    : "border-dashed border-gray-200 bg-gray-50"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "p-2 rounded-lg",
                    isUploaded ? "bg-green-100 text-green-600" : 
                    hasError ? "bg-red-100 text-red-600" :
                    req.required ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                  )}>
                    {DOCUMENT_ICONS[req.id] || <File className="h-5 w-5" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-gray-900">{req.name}</h4>
                      {req.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                      {req.conditional && (
                        <Badge variant="outline" className="text-xs">Conditional</Badge>
                      )}
                      {isUploaded && (
                        <Badge variant="default" className="bg-green-500 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Uploaded
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-1">{req.description}</p>
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>Formats: {req.formats.map(f => FORMAT_LABELS[f] || f).join(', ')}</span>
                      <span>Max: {req.maxSizeMB}MB</span>
                    </div>

                    {/* Error Messages */}
                    {hasError && invalidFile && (
                      <div className="mt-2 p-2 bg-red-100 rounded text-sm text-red-700">
                        {invalidFile.errors.map((err, idx) => (
                          <div key={idx}>{err}</div>
                        ))}
                      </div>
                    )}

                    {/* Uploaded File Info */}
                    {isUploaded && uploadedFile && (
                      <div className="mt-2 flex items-center gap-2 p-2 bg-green-100 rounded">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700 truncate flex-1">
                          {uploadedFile.fileName}
                        </span>
                        <span className="text-xs text-green-600">
                          {(uploadedFile.fileSize / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Upload/Remove Button */}
                  <div className="flex-shrink-0">
                    {isUploaded ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(req.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    ) : (
                      <div className="relative">
                        <input
                          type="file"
                          accept={req.formats.join(',')}
                          onChange={(e) => handleFileUpload(e, req.id)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id={`upload-${req.id}`}
                          disabled={uploadingDocId === req.id}
                        />
                        <Button
                          type="button"
                          variant={req.required ? "default" : "outline"}
                          size="sm"
                          disabled={uploadingDocId === req.id}
                          onClick={() => document.getElementById(`upload-${req.id}`)?.click()}
                        >
                          {uploadingDocId === req.id ? (
                            <span className="animate-spin">⏳</span>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-1" />
                              Upload
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* IPOPHL Guidelines */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">IPOPHL Filing Requirements</h4>
              <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
                <li>All documents must be clear and legible</li>
                <li>File names should not contain special characters (use underscores)</li>
                <li>Maximum file size is 20MB per document (50MB for copyright works)</li>
                <li>PDF files are preferred for text documents</li>
                <li>Images should be high resolution (minimum 300 DPI)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DocumentChecklist;
