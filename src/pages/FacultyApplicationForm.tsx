import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  StepIndicator,
  ApplicantInfoStep,
  InventionDetailsStep,
  ClaimsAndDrawingsStep,
  ReviewStep,
} from "@/components/faculty/application-form";
import { ChevronLeft, ChevronRight, Save, Send } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Applicant Info",
    description: "Personal details and co-inventors",
  },
  {
    id: 2,
    title: "Invention Details",
    description: "IP type, title, and description",
  },
  {
    id: 3,
    title: "Claims & Drawings",
    description: "Claims and attachments",
  },
  {
    id: 4,
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
    },
    mode: "onChange",
  });

  const { handleSubmit, trigger, formState: { errors } } = methods;

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
        return await trigger([
          "ip_type",
          "title",
          "abstract",
          "field_of_technology",
        ] as const);
      case 3:
        // Claims and drawings are optional
        return true;
      case 4:
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
        return <InventionDetailsStep />;
      case 3:
        return <ClaimsAndDrawingsStep />;
      case 4:
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
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="p-6 mb-6">
              {renderStepContent()}
            </Card>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <div>
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isSubmitting || isSaving}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Save Draft Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isSaving || isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Draft"}
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting || isSaving}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting || isSaving}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
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
