import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  StepIndicator,
  ApplicantInfoStep,
  ClaimsAndDrawingsStep,
  ReviewStep,
} from "@/components/faculty/application-form";
import { ChevronLeft, ChevronRight, Save, Send, AlertCircle } from "lucide-react";
import { useDocumentValidation, IPType } from "@/hooks/useDocumentValidation";

const steps = [
  {
    id: 1,
    title: "Applicant Information",
    description: "Personal details and co-inventors",
  },
  {
    id: 2,
    title: "Document Upload",
    description: "Upload completed IPOPHL forms",
  },
  {
    id: 3,
    title: "Review & Submit",
    description: "Verify and submit application",
  },
];

export default function FacultyApplicationForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm({
    defaultValues: {
      applicant_name: "",
      applicant_address: "",
      applicant_nationality: "",
      applicant_contact: "",
      applicant_email: "",
      co_inventors: [],
      ip_type: "",
      title: "",
      abstract: "",
      field_of_technology: "",
      background_of_invention: "",
      summary_of_invention: "",
      detailed_description: "",
      claims: [],
      attachments: [],
      declaration_ownership: false,
      declaration_accuracy: false,
      declaration_ustp: false,
      // Document validation fields
      claimsPriority: false,
      isAgentFiling: false,
      isSmallEntity: false,
      isApplicantInventor: true,
      isOwnerAuthor: true,
    },
    mode: "onChange",
  });

  const { handleSubmit, trigger, formState: { errors }, watch } = methods;
  
  // Watch form values for document validation
  const formValues = watch();
  const ipType = formValues.ip_type as IPType;
  
  // Document validation
  const {
    isValid: documentsValid,
    isComplete: documentsComplete,
    missingDocs,
    getErrorMessages
  } = useDocumentValidation(ipType, {
    ip_type: ipType,
    claimsPriority: formValues.claimsPriority,
    isAgentFiling: formValues.isAgentFiling,
    isSmallEntity: formValues.isSmallEntity,
    isApplicantInventor: formValues.isApplicantInventor,
    isOwnerAuthor: formValues.isOwnerAuthor,
    attachments: formValues.attachments
  });

  const validateStep = async (step: number) => {
    switch (step) {
      case 1:
        return await trigger([
          "applicant_name",
          "applicant_address",
          "applicant_nationality",
          "applicant_contact",
          "applicant_email",
        ] as const);
      case 2:
        // Validate document uploads - IP type is now selected in document upload
        if (!documentsComplete) {
          toast({
            title: "Missing Documents",
            description: `Please upload: ${missingDocs.join(', ')}`,
            variant: "destructive",
          });
          return false;
        }
        if (!documentsValid) {
          const errors = getErrorMessages();
          toast({
            title: "Document Validation Failed",
            description: errors[0] || "Please check your uploaded documents",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 3:
        return await trigger([
          "declaration_ownership",
          "declaration_accuracy",
          "declaration_ustp",
        ] as const);
      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const formData = methods.getValues();
      
      // TODO: Replace with actual API call
      // await fetch('/api/faculty/ip-applications', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...formData, status: 'Draft' })
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Draft Saved",
        description: "Your application has been saved as a draft.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (data: any) => {
    // Final document validation before submission
    if (!documentsValid) {
      const errors = getErrorMessages();
      toast({
        title: "Cannot Submit Application",
        description: errors[0] || "Please ensure all required documents are uploaded correctly",
        variant: "destructive",
      });
      // Go to step 2 to fix document issues
      setCurrentStep(2);
      return;
    }
    
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/faculty/ip-applications', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...data, status: 'Submitted for Internal Review' })
      // });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Application Submitted",
        description: "Your IP application has been submitted for internal review.",
      });

      navigate("/faculty");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ApplicantInfoStep />;
      case 2:
        return <ClaimsAndDrawingsStep />;
      case 3:
        return <ReviewStep />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/faculty")}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">
              New IP Application
            </h1>
            <div className="w-24" /> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator steps={steps} currentStep={currentStep} onStepClick={handleStepClick} />
        </div>

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="shadow-sm border-t-4 border-t-blue-600 mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-white p-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {steps[currentStep - 1]?.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {steps[currentStep - 1]?.description}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                      {currentStep}
                    </span>
                    of {steps.length}
                  </div>
                </div>
              </div>
              <div className="p-6">
                {renderStepContent()}
              </div>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between bg-white rounded-lg border p-4">
              <div>
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isSubmitting || isSaving}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Save Draft Button */}
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSaveDraft}
                  disabled={isSaving || isSubmitting}
                  className="text-gray-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Draft"}
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting || isSaving}
                    className="bg-blue-600 hover:bg-blue-700 gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting || isSaving}
                    className="bg-green-600 hover:bg-green-700 gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </main>
    </div>
  );
}
