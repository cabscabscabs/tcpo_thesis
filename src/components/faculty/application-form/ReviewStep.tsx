import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { IPTypeBadge } from "../IPTypeBadge";
import { User, MapPin, Globe, Phone, Mail, FileText, ListOrdered, Upload, CheckCircle, FileCheck, AlertCircle } from "lucide-react";
import { useDocumentValidation, IPType } from "@/hooks/useDocumentValidation";
import { cn } from "@/lib/utils";

export function ReviewStep() {
  const { watch, register, formState: { errors } } = useFormContext();
  const formData = watch();
  
  // Document validation for review
  const {
    isValid: documentsValid,
    isComplete: documentsComplete,
    missingDocs,
    requirements,
    uploadedDocs,
    progress
  } = useDocumentValidation(formData.ip_type as IPType, {
    ip_type: formData.ip_type,
    claimsPriority: formData.claimsPriority,
    isAgentFiling: formData.isAgentFiling,
    isSmallEntity: formData.isSmallEntity,
    isApplicantInventor: formData.isApplicantInventor,
    isOwnerAuthor: formData.isOwnerAuthor,
    attachments: formData.attachments
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getDocumentStatus = (docId: string) => {
    const uploaded = uploadedDocs.find(d => d.documentType === docId);
    const required = requirements.find(r => r.id === docId);
    return {
      uploaded: !!uploaded,
      required: required?.required || false,
      fileName: uploaded?.fileName
    };
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Review Your Application</h3>
            <p className="text-sm text-blue-700 mt-1">
              Please review all information before submitting. Once submitted, your application 
              will be reviewed by the TPCO IP Committee.
            </p>
          </div>
        </div>
      </div>

      {/* IP Type and Title */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Application Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">IP Type</p>
              <div className="mt-1">
                <IPTypeBadge type={formData.ip_type} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Field of Technology</p>
              <p className="font-medium">{formData.field_of_technology || "Not specified"}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Title</p>
            <p className="font-medium text-lg">{formData.title}</p>
          </div>
        </CardContent>
      </Card>

      {/* Applicant Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Applicant Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{formData.applicant_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nationality</p>
              <p className="font-medium">{formData.applicant_nationality}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{formData.applicant_address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact</p>
              <p className="font-medium">{formData.applicant_contact}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{formData.applicant_email}</p>
            </div>
          </div>

          {formData.co_inventors?.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500 mb-2">Co-Inventors</p>
              <div className="space-y-2">
                {formData.co_inventors.map((inventor: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">{inventor.name}</p>
                    <p className="text-sm text-gray-600">{inventor.nationality}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Abstract and Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Description
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Abstract</p>
            <p className="text-sm bg-gray-50 p-3 rounded-lg">{formData.abstract}</p>
          </div>
          {formData.background_of_invention && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Background</p>
              <p className="text-sm bg-gray-50 p-3 rounded-lg">{formData.background_of_invention}</p>
            </div>
          )}
          {formData.summary_of_invention && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Summary</p>
              <p className="text-sm bg-gray-50 p-3 rounded-lg">{formData.summary_of_invention}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Claims */}
      {formData.claims?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListOrdered className="h-5 w-5 text-purple-600" />
              Claims ({formData.claims.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {formData.claims.map((claim: any, index: number) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={claim.claim_type === 'independent' ? 'default' : 'secondary'}>
                      Claim {claim.claim_number}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {claim.claim_type === 'independent' ? 'Independent' : 'Dependent'}
                    </span>
                  </div>
                  <p className="text-sm">{claim.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Checklist Summary */}
      <Card className={cn(
        "border-l-4",
        documentsValid ? "border-l-green-500" : documentsComplete ? "border-l-yellow-500" : "border-l-red-500"
      )}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className={cn(
              "h-5 w-5",
              documentsValid ? "text-green-600" : documentsComplete ? "text-yellow-600" : "text-red-600"
            )} />
            Document Checklist
            {!documentsValid && <AlertCircle className="h-5 w-5 text-red-500" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Document Completion</span>
              <span className={cn(
                "font-medium",
                documentsValid ? "text-green-600" : "text-yellow-600"
              )}>
                {progress.completed} of {progress.total} required
              </span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
          </div>
          
          {/* Missing Documents Alert */}
          {missingDocs.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Missing Required Documents
              </p>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {missingDocs.map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Document List */}
          <div className="space-y-2">
            {requirements.map((req) => {
              const status = getDocumentStatus(req.id);
              return (
                <div 
                  key={req.id} 
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg",
                    status.uploaded 
                      ? "bg-green-50 border border-green-200" 
                      : status.required 
                      ? "bg-red-50 border border-red-200"
                      : "bg-gray-50 border border-gray-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {status.uploaded ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : status.required ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    )}
                    <div>
                      <p className={cn(
                        "font-medium text-sm",
                        status.uploaded ? "text-green-800" : status.required ? "text-red-800" : "text-gray-600"
                      )}>
                        {req.name}
                        {req.required && <span className="text-red-500 ml-1">*</span>}
                      </p>
                      {status.uploaded && status.fileName && (
                        <p className="text-xs text-green-600">{status.fileName}</p>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant={status.uploaded ? "default" : status.required ? "destructive" : "outline"}
                    className={status.uploaded ? "bg-green-500" : ""}
                  >
                    {status.uploaded ? "Uploaded" : status.required ? "Required" : "Optional"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Additional Attachments */}
      {formData.attachments?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-orange-600" />
              Additional Attachments ({formData.attachments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.attachments.map((file: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{file.file_name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.file_size)} • {file.attachment_type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Declaration */}
      <Card>
        <CardHeader>
          <CardTitle>Declaration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="declaration_ownership"
                {...register("declaration_ownership", { required: true })}
              />
              <div>
                <Label htmlFor="declaration_ownership" className="font-medium cursor-pointer">
                  Statement of Ownership
                </Label>
                <p className="text-sm text-gray-600">
                  I declare that I am the true and original inventor/creator of the subject matter 
                  described in this application, or that I have the right to file this application 
                  on behalf of the true and original inventor/creator.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="declaration_accuracy"
                {...register("declaration_accuracy", { required: true })}
              />
              <div>
                <Label htmlFor="declaration_accuracy" className="font-medium cursor-pointer">
                  Accuracy of Information
                </Label>
                <p className="text-sm text-gray-600">
                  I declare that all statements made and information provided in this application 
                  are true and correct to the best of my knowledge and belief.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="declaration_ustp"
                {...register("declaration_ustp", { required: true })}
              />
              <div>
                <Label htmlFor="declaration_ustp" className="font-medium cursor-pointer">
                  USTP IP Policy Compliance
                </Label>
                <p className="text-sm text-gray-600">
                  I understand and agree to comply with the University of Science and Technology 
                  of Southern Philippines Intellectual Property Policy.
                </p>
              </div>
            </div>

            {(errors.declaration_ownership || errors.declaration_accuracy || errors.declaration_ustp) && (
              <p className="text-sm text-red-500">
                Please accept all declarations to proceed with submission.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
