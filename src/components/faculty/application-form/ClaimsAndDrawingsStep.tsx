import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ListOrdered, 
  Upload, 
  FileImage, 
  FileText, 
  X,
  Plus,
  AlertCircle,
  FileCheck,
  FileText as FileTextIcon,
  Info
} from "lucide-react";
import { IPClaim, IPType, ipTypeConfig } from "@/types/ipApplication";
import { DocumentChecklist } from "./DocumentChecklist";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ClaimsAndDrawingsStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const claims = watch("claims") || [];
  const attachments = watch("attachments") || [];
  const ipType = watch("ip_type");

  const addClaim = (type: 'independent' | 'dependent') => {
    const newClaim: Partial<IPClaim> = {
      claim_number: claims.length + 1,
      claim_type: type,
      parent_claim_number: type === 'dependent' ? 1 : null,
      text: ""
    };
    setValue("claims", [...claims, newClaim]);
  };

  const removeClaim = (index: number) => {
    const updated = [...claims];
    updated.splice(index, 1);
    // Renumber claims
    updated.forEach((claim, i) => {
      claim.claim_number = i + 1;
    });
    setValue("claims", updated);
  };

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

  const showClaims = ipType === 'Patent' || ipType === 'Utility Model';
  
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
          {/* Claims Section */}
          {showClaims && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListOrdered className="h-5 w-5 text-blue-600" />
                  Claims (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">IPOPHL Claim Requirements:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Independent claims define the invention broadly</li>
                        <li>Dependent claims add specific limitations</li>
                        <li>Claims must be clear, concise, and supported by description</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {claims.map((claim: IPClaim, index: number) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={claim.claim_type === 'independent' ? 'default' : 'secondary'}>
                            Claim {claim.claim_number}
                      </Badge>
                      <Badge variant="outline">
                        {claim.claim_type === 'independent' ? 'Independent' : 'Dependent'}
                      </Badge>
                      {claim.claim_type === 'dependent' && (
                        <span className="text-sm text-gray-500">
                          refers to Claim {claim.parent_claim_number}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeClaim(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {claim.claim_type === 'dependent' && (
                    <div className="mb-3">
                      <Label className="text-sm">Refers to Claim</Label>
                      <select
                        {...register(`claims.${index}.parent_claim_number`)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        {claims
                          .filter((c: IPClaim) => c.claim_type === 'independent')
                          .map((c: IPClaim) => (
                            <option key={c.claim_number} value={c.claim_number}>
                              Claim {c.claim_number}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                  
                  <Textarea
                    {...register(`claims.${index}.text`)}
                    placeholder={`Enter claim ${claim.claim_number} text...`}
                    rows={3}
                  />
                </div>
              ))}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addClaim('independent')}
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Independent Claim
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addClaim('dependent')}
                  className="flex-1"
                  disabled={!claims.some((c: IPClaim) => c.claim_type === 'independent')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Dependent Claim
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Legacy Attachments Section - Keep for additional files */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-600" />
            Additional Attachments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Drawings Upload */}
          <div className="space-y-3">
            <Label>Technical Drawings / Figures</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <FileImage className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 mb-2">
                Upload technical drawings, flowcharts, or diagrams
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Supported formats: PDF, PNG, JPG (max 10MB each)
              </p>
              <Input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                multiple
                onChange={(e) => handleFileUpload(e, 'drawing')}
                className="hidden"
                id="drawings-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('drawings-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select Drawings
              </Button>
            </div>
          </div>

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
                      {file.attachment_type === 'drawing' ? (
                        <FileImage className="h-5 w-5 text-blue-500" />
                      ) : (
                        <FileText className="h-5 w-5 text-green-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.file_name}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.file_size)} • {file.attachment_type}
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
