import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  X,
  FileText as FileTextIcon,
  Info,
  Tag
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IPType, ipTypeConfig } from "@/types/ipApplication";
import { DocumentChecklist } from "./DocumentChecklist";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MAX_ADDITIONAL_ATTACHMENT_MB = 50;
const WORD_LIMIT = 150;

function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function ClaimsAndDrawingsStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const attachments = watch("attachments") || [];
  const ipType = watch("ip_type") as IPType | undefined;
  const classification = watch("classification") as string | undefined;
  const classificationOther = watch("classification_other") as string | undefined;
  const goodsServices = (watch("trademark_goods_services") as string | undefined) || "";
  const markDescription = (watch("trademark_mark_description") as string | undefined) || "";
  const industrialBriefDescription = (watch("industrial_design_brief_description") as string | undefined) || "";

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'drawing' | 'document') => {
    const files = event.target.files;
    if (!files) return;

    const accepted: any[] = [];
    const rejected: string[] = [];
    Array.from(files).forEach((file) => {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > MAX_ADDITIONAL_ATTACHMENT_MB) {
        rejected.push(`${file.name} exceeds ${MAX_ADDITIONAL_ATTACHMENT_MB}MB limit`);
        return;
      }
      accepted.push({
        file,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        attachment_type: type
      });
    });

    if (accepted.length > 0) {
      setValue("attachments", [...attachments, ...accepted]);
    }
    if (rejected.length > 0) {
      // Non-blocking inline message; toast is handled by parent on submit if needed
      alert(rejected.join('\n'));
    }
    // Reset input so the same file can be re-selected
    event.target.value = '';
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

  const ipTypes: IPType[] = ['Patent', 'Utility Model', 'Industrial Design', 'Copyright', 'Trademark'];

  // Classification options per IP type
  const classificationOptions: { value: string; label: string }[] =
    ipType === 'Utility Model'
      ? [
          { value: 'ICT Related', label: 'ICT Related' },
          { value: 'Mechanical', label: 'Mechanical' },
          { value: 'Chemical', label: 'Chemical' },
          { value: 'Other', label: 'Other' },
        ]
      : ipType === 'Copyright'
      ? [
          { value: 'IM', label: 'IM (Instructional Materials)' },
          { value: 'Computer Program', label: 'Computer Program' },
          { value: 'Others', label: 'Others' },
        ]
      : [];

  const isClassificationApplicable = ipType === 'Utility Model' || ipType === 'Copyright';
  const isOtherSelected = classification === 'Other' || classification === 'Others';

  const goodsServicesWordCount = countWords(goodsServices);
  const markDescriptionWordCount = countWords(markDescription);
  const industrialBriefWordCount = countWords(industrialBriefDescription);

  return (
    <div className="space-y-6">
      {/* IP Type Selection */}
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

          {/* Classification (Utility Model + Copyright) */}
          {isClassificationApplicable && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-purple-600" />
                  Classification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="classification">
                    Classification <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={classification || ''}
                    onValueChange={(val) => {
                      setValue('classification', val, { shouldValidate: true });
                      if (val !== 'Other' && val !== 'Others') {
                        setValue('classification_other', '');
                      }
                    }}
                  >
                    <SelectTrigger id="classification">
                      <SelectValue placeholder="Select a classification" />
                    </SelectTrigger>
                    <SelectContent>
                      {classificationOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isOtherSelected && (
                  <div className="space-y-2">
                    <Label htmlFor="classification_other">
                      Specify <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="classification_other"
                      placeholder="Please specify the classification"
                      value={classificationOther || ''}
                      onChange={(e) => setValue('classification_other', e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Industrial Design text field — replaces file upload */}
          {ipType === 'Industrial Design' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5 text-blue-600" />
                  Industrial Design Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="industrial_design_brief_description">
                      Brief Description <span className="text-red-500">*</span>
                    </Label>
                    <span
                      className={`text-xs ${
                        industrialBriefWordCount > WORD_LIMIT ? 'text-red-500' : 'text-gray-500'
                      }`}
                    >
                      {industrialBriefWordCount} / {WORD_LIMIT} words
                    </span>
                  </div>
                  <Textarea
                    id="industrial_design_brief_description"
                    placeholder="Provide a brief description of the industrial design (max 150 words)"
                    rows={4}
                    {...register("industrial_design_brief_description")}
                  />
                  <p className="text-xs text-gray-500">
                    Describe the ornamental or aesthetic aspects of the design. No file upload needed.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trademark text fields — replace file uploads */}
          {ipType === 'Trademark' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5 text-blue-600" />
                  Trademark Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="trademark_goods_services">
                      Goods / Services <span className="text-red-500">*</span>
                    </Label>
                    <span
                      className={`text-xs ${
                        goodsServicesWordCount > WORD_LIMIT ? 'text-red-500' : 'text-gray-500'
                      }`}
                    >
                      {goodsServicesWordCount} / {WORD_LIMIT} words
                    </span>
                  </div>
                  <Textarea
                    id="trademark_goods_services"
                    placeholder="Describe the goods and/or services covered by this trademark (max 150 words)"
                    rows={4}
                    {...register("trademark_goods_services")}
                  />
                  <p className="text-xs text-gray-500">
                    Enter a plain-text description. No file upload needed.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="trademark_mark_description">
                      Description of the Mark Representation <span className="text-red-500">*</span>
                    </Label>
                    <span
                      className={`text-xs ${
                        markDescriptionWordCount > WORD_LIMIT ? 'text-red-500' : 'text-gray-500'
                      }`}
                    >
                      {markDescriptionWordCount} / {WORD_LIMIT} words
                    </span>
                  </div>
                  <Textarea
                    id="trademark_mark_description"
                    placeholder="Describe the mark (wording, design elements, colors, etc.) in up to 150 words"
                    rows={4}
                    {...register("trademark_mark_description")}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Document Checklist */}
          <DocumentChecklist />

          {/* Additional Attachments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-green-600" />
                Additional Attachments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Supporting Documents</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload forms, declarations, or other supporting documents
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Supported formats: PDF, DOC, DOCX (max {MAX_ADDITIONAL_ATTACHMENT_MB}MB each)
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
