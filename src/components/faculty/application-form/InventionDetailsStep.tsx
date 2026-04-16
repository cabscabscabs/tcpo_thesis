import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Lightbulb, BookOpen, Layers, AlignLeft } from "lucide-react";
import { IPType, ipTypeConfig } from "@/types/ipApplication";

const ipTypes: IPType[] = ['Patent', 'Utility Model', 'Industrial Design', 'Copyright', 'Trademark'];

const technologyFields = [
  "Agricultural Technology",
  "Biotechnology",
  "Chemical Engineering",
  "Civil Engineering",
  "Computer Science",
  "Electrical Engineering",
  "Electronics",
  "Environmental Technology",
  "Food Technology",
  "Information Technology",
  "Materials Science",
  "Mechanical Engineering",
  "Medical Technology",
  "Nanotechnology",
  "Pharmaceuticals",
  "Physics",
  "Robotics",
  "Software",
  "Telecommunications",
  "Other"
];

export function InventionDetailsStep() {
  const { register, formState: { errors }, setValue, watch } = useFormContext();
  const selectedType = watch("ip_type");
  const abstractLength = watch("abstract")?.length || 0;

  return (
    <div className="space-y-6">
      {/* IP Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            IP Type Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ipTypes.map((type) => {
              const config = ipTypeConfig[type];
              const isSelected = selectedType === type;
              
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
            <p className="text-sm text-red-500 mt-2">{errors.ip_type.message as string}</p>
          )}
        </CardContent>
      </Card>

      {/* Title and Field */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Title and Classification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title of Invention/Work <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              {...register("title", { 
                required: "Title is required",
                minLength: { value: 10, message: "Title must be at least 10 characters" }
              })}
              placeholder="Enter a clear and descriptive title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="field_of_technology">
              Field of Technology <span className="text-red-500">*</span>
            </Label>
            <Select 
              onValueChange={(value) => setValue("field_of_technology", value, { shouldValidate: true })}
            >
              <SelectTrigger className={errors.field_of_technology ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a field" />
              </SelectTrigger>
              <SelectContent>
                {technologyFields.map((field) => (
                  <SelectItem key={field} value={field}>{field}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.field_of_technology && (
              <p className="text-sm text-red-500">{errors.field_of_technology.message as string}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Abstract */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlignLeft className="h-5 w-5 text-green-600" />
            Abstract
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="abstract">
                Abstract <span className="text-red-500">*</span>
              </Label>
              <span className={`text-sm ${abstractLength > 250 ? 'text-red-500' : 'text-gray-500'}`}>
                {abstractLength} / 250 words
              </span>
            </div>
            <Textarea
              id="abstract"
              {...register("abstract", { 
                required: "Abstract is required",
                minLength: { value: 150, message: "Abstract must be at least 150 words" },
                maxLength: { value: 250, message: "Abstract must not exceed 250 words" }
              })}
              placeholder="Provide a concise summary of the invention (150-250 words). Include the technical problem, solution, and main uses."
              className={errors.abstract ? "border-red-500" : ""}
              rows={6}
            />
            {errors.abstract && (
              <p className="text-sm text-red-500">{errors.abstract.message as string}</p>
            )}
            <p className="text-sm text-gray-500">
              The abstract should concisely disclose the technical problem and solution, 
              following IPOPHL standards for patent applications.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Background and Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            Background and Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="background_of_invention">
              Background of the Invention
            </Label>
            <Textarea
              id="background_of_invention"
              {...register("background_of_invention")}
              placeholder="Describe the technical field, related prior art, and the problem the invention solves"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary_of_invention">
              Summary of the Invention
            </Label>
            <Textarea
              id="summary_of_invention"
              {...register("summary_of_invention")}
              placeholder="Summarize the invention, its advantages, and how it solves the technical problem"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detailed_description">
              Detailed Description
            </Label>
            <Textarea
              id="detailed_description"
              {...register("detailed_description")}
              placeholder="Provide a detailed description of the invention, including embodiments, examples, and best mode"
              rows={8}
            />
            <p className="text-sm text-gray-500">
              For patents and utility models, this section should enable a person skilled in the art 
              to practice the invention without undue experimentation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
