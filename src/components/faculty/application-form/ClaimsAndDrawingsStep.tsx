import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Upload, 
  FileText, 
  X,
  FileCheck,
  FileText as FileTextIcon,
  Info
} from "lucide-react";
import { IPType, ipTypeConfig } from "@/types/ipApplication";
import { DocumentChecklist } from "./DocumentChecklist";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ClaimsAndDrawingsStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const attachments = watch("attachments") || [];
  const ipType = watch("ip_type");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'drawing' | 'document') => {
    const files = event.target.files;
    if (files) {
      const newAttachments = Array.from(files).map(file => ({
        file,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        attachment_type: type
      }));
      setValue("attachments", [...attachments, ...newAttachments]);
    }
  };

  const removeAttachment = (index: number) => {
    const updated = [...attachments];
    updated.splice(index, 1);
    setValue("attachments", updated);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Conditional fields for document requirements
  const claimsPriority = watch('claimsPriority');
  const isAgentFiling = watch('isAgentFiling');
  const isSmallEntity = watch('isSmallEntity');
  const isApplicantInventor = watch('isApplicantInventor') !== false; // Default true
  const isOwnerAuthor = watch('isOwnerAuthor') !== false; // Default true

  const ipTypes: IPType[] = ['Patent', 'Utility Model', 'Industrial Design', 'Copyright', 'Trademark'];

  return (
    <div className="space-y-6">
      {/* IP Type Selection - Required for document validation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5 text-blue-600" />
            IP Type Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Select IP Type</AlertTitle>
            <AlertDescription className="text-blue-700">
              Please select the type of IP application you are submitting. This will determine the required documents.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ipTypes.map((type) => {
              const config = ipTypeConfig[type];
              const isSelected = ipType === type;
              
              return (
                <div
                  key={type}
                  onClick={() => setValue("ip_type", type, { shouldValidate: true })}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-blue-500" : "border-gray-300"
                    }`}>
                      {isSelected && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                    </div>
                    <span className="font-semibold text-gray-900">{config.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">{config.description}</p>
                </div>
              );
            })}
          </div>
          {errors.ip_type && (
            <p className="text-sm text-red-500">{errors.ip_type.message as string}</p>
          )}
        </CardContent>
      </Card>

      {/* Document Upload Section */}
      {ipType && (
        <>
      {/* Title of the IP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5 text-blue-600" />
            Title of the IP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="ip_title">Title <span className="text-red-500">*</span></Label>
            <Input
              id="ip_title"
              placeholder="Enter the title of your intellectual property"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message as string}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filing Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-purple-600" />
            Filing Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority Claim */}
            <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <Checkbox
                id="claimsPriority"
                checked={claimsPriority}
                onCheckedChange={(checked) => setValue('claimsPriority', checked)}
              />
              <div className="space-y-1">
                <Label htmlFor="claimsPriority" className="font-medium cursor-pointer">
                  Claims Priority
                </Label>
                <p className="text-sm text-gray-500">
                  Based on earlier filing in another country
                </p>
              </div>
            </div>

            {/* Agent Filing */}
            <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <Checkbox
                id="isAgentFiling"
                checked={isAgentFiling}
                onCheckedChange={(checked) => setValue('isAgentFiling', checked)}
              />
              <div className="space-y-1">
                <Label htmlFor="isAgentFiling" className="font-medium cursor-pointer">
                  Filing via Agent
                </Label>
                <p className="text-sm text-gray-500">
                  Using a patent attorney or agent
                </p>
              </div>
            </div>

            {/* Small Entity */}
            <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
              <Checkbox
                id="isSmallEntity"
                checked={isSmallEntity}
                onCheckedChange={(checked) => setValue('isSmallEntity', checked)}
              />
              <div className="space-y-1">
                <Label htmlFor="isSmallEntity" className="font-medium cursor-pointer">
                  Small Entity
                </Label>
                <p className="text-sm text-gray-500">
                  Eligible for reduced fees
                </p>
              </div>
            </div>

            {/* Applicant is Inventor (for Patent/Utility Model) */}
            {(ipType === 'Patent' || ipType === 'Utility Model') && (
              <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id="isApplicantInventor"
                  checked={isApplicantInventor}
                  onCheckedChange={(checked) => setValue('isApplicantInventor', checked)}
                />
                <div className="space-y-1">
                  <Label htmlFor="isApplicantInventor" className="font-medium cursor-pointer">
                    Applicant is Inventor
                  </Label>
                  <p className="text-sm text-gray-500">
                    No assignment needed
                  </p>
                </div>
              </div>
            )}

            {/* Owner is Author (for Copyright) */}
            {ipType === 'Copyright' && (
              <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id="isOwnerAuthor"
                  checked={isOwnerAuthor}
                  onCheckedChange={(checked) => setValue('isOwnerAuthor', checked)}
                />
                <div className="space-y-1">
                  <Label htmlFor="isOwnerAuthor" className="font-medium cursor-pointer">
                    Owner is Author
                  </Label>
                  <p className="text-sm text-gray-500">
                    No ownership affidavit needed
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Checklist */}
      <DocumentChecklist />

      {/* Additional Attachments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-600" />
            Additional Attachments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Documents Upload */}
          <div className="space-y-3">
            <Label>Supporting Documents</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 mb-2">
                Upload forms, declarations, or other supporting documents
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Supported formats: PDF, DOC, DOCX (max 10MB each)
              </p>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={(e) => handleFileUpload(e, 'document')}
                className="hidden"
                id="documents-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('documents-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select Documents
              </Button>
            </div>
          </div>

          {/* Attached Files List */}
          {attachments.length > 0 && (
            <div className="space-y-2">
              <Label>Attached Files</Label>
              <div className="space-y-2">
                {attachments.map((file: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.file_name}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.file_size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
          </>
      )}
    </div>
  );
}
