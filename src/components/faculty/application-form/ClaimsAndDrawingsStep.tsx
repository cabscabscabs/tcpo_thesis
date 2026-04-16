import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ListOrdered, 
  Upload, 
  FileImage, 
  FileText, 
  X,
  Plus,
  AlertCircle
} from "lucide-react";
import { IPClaim } from "@/types/ipApplication";

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

  return (
    <div className="space-y-6">
      {/* Claims Section */}
      {showClaims && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListOrdered className="h-5 w-5 text-blue-600" />
              Claims
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

      {/* Attachments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-600" />
            Attachments
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
    </div>
  );
}
