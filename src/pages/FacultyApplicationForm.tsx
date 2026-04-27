import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  StepIndicator,
  ApplicantInfoStep,
  ClaimsAndDrawingsStep,
  ReviewStep,
} from "@/components/faculty/application-form";
import { ChevronLeft, ChevronRight, Save, Send, AlertCircle } from "lucide-react";
import { useDocumentValidation, IPType } from "@/hooks/useDocumentValidation";

/**
 * Upload a single file to Supabase Storage and return the public URL
 */
async function uploadApplicationFile(
  file: File,
  applicationId: string,
  userId: string,
  documentType?: string
): Promise<{ path: string; url: string } | null> {
  const fileExt = file.name.split('.').pop();
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `applications/${userId}/${applicationId}/${documentType || 'document'}_${timestamp}_${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from('application-files')
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    // Fallback: try patent-files bucket if application-files doesn't exist
    const fallbackPath = `applications/${userId}/${applicationId}/${documentType || 'document'}_${timestamp}_${safeName}`;
    const { error: fallbackError } = await supabase.storage
      .from('patent-files')
      .upload(fallbackPath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (fallbackError) {
      console.error('Error uploading to fallback bucket:', fallbackError);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('patent-files')
      .getPublicUrl(fallbackPath);

    return { path: fallbackPath, url: urlData.publicUrl };
  }

  const { data: urlData } = supabase.storage
    .from('application-files')
    .getPublicUrl(storagePath);

  return { path: storagePath, url: urlData.publicUrl };
}

/**
 * Upload all attachments for an application and insert attachment records
 */
async function uploadAndCreateAttachments(
  attachments: any[],
  applicationId: string,
  userId: string
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const attachment of attachments) {
    try {
      const file = attachment.file as File;
      if (!file) {
        if (!attachment.isExisting) {
          console.warn('Attachment missing file object, skipping:', attachment.file_name);
          failed++;
        }
        continue;
      }

      const documentType = attachment.document_type || attachment.attachment_type || 'document';
      const result = await uploadApplicationFile(file, applicationId, userId, documentType);

      if (!result) {
        failed++;
        continue;
      }

      // Map attachment_type to the ip_application_attachments file_type enum
      let fileType: 'drawing' | 'document' | 'supporting' = 'document';
      if (documentType === 'drawings' || documentType === 'representations' || documentType === 'mark_representation') {
        fileType = 'drawing';
      } else if (documentType === 'specification' || documentType === 'claims' || documentType === 'abstract' || documentType === 'description') {
        fileType = 'document';
      } else {
        fileType = 'supporting';
      }

      const { error: attachError } = await (supabase as any)
        .from('ip_application_attachments')
        .insert([{
          application_id: applicationId,
          file_name: attachment.file_name || file.name,
          file_type: fileType,
          file_path: result.url,
          file_size: attachment.file_size || file.size,
          mime_type: attachment.file_type || file.type,
          document_type: documentType,
          uploaded_by: userId,
        }]);

      if (attachError) {
        console.error('Error creating attachment record:', attachError);
        failed++;
      } else {
        success++;
      }
    } catch (err) {
      console.error('Error processing attachment:', err);
      failed++;
    }
  }

  return { success, failed };
}

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
  const { id: editId } = useParams<{ id: string }>();
  const isEditMode = !!editId;
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);
  const [originalAttachments, setOriginalAttachments] = useState<any[]>([]);

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

  // Load existing application for edit mode
  useEffect(() => {
    if (!editId) return;
    const loadApplication = async () => {
      setIsLoadingExisting(true);
      try {
        const { data, error } = await (supabase as any)
          .from('ip_applications')
          .select('*')
          .eq('id', editId)
          .single();

        if (error || !data) {
          toast({ title: "Error", description: "Failed to load application.", variant: "destructive" });
          navigate('/faculty');
          return;
        }

        // Fetch existing attachments
        const { data: attachmentsData } = await (supabase as any)
          .from('ip_application_attachments')
          .select('*')
          .eq('application_id', editId);

        const mappedAttachments = (attachmentsData || []).map((att: any) => ({
          id: att.id,
          file_name: att.file_name,
          file_size: att.file_size,
          file_type: att.mime_type || att.file_type,
          attachment_type: att.file_type === 'drawing' ? 'drawing' : 'document',
          document_type: att.document_type,
          isExisting: true,
          file_path: att.file_path,
        }));

        setOriginalAttachments(mappedAttachments);

        // Populate form with existing data
        methods.reset({
          applicant_name: data.applicant_full_name || '',
          applicant_address: data.applicant_address || '',
          applicant_nationality: data.applicant_nationality || '',
          applicant_contact: data.applicant_phone || '',
          applicant_email: data.applicant_email || '',
          co_inventors: data.co_inventors || [],
          ip_type: data.ip_type || '',
          title: data.title || '',
          abstract: data.abstract || '',
          field_of_technology: data.field_of_technology || '',
          background_of_invention: data.background_of_invention || '',
          summary_of_invention: data.summary_of_invention || '',
          detailed_description: data.detailed_description || '',
          claims: [],
          attachments: mappedAttachments,
          declaration_ownership: data.declaration_confirmed || false,
          declaration_accuracy: data.declaration_confirmed || false,
          declaration_ustp: data.declaration_confirmed || false,
          claimsPriority: false,
          isAgentFiling: false,
          isSmallEntity: false,
          isApplicantInventor: true,
          isOwnerAuthor: true,
        });
      } catch (err) {
        console.error('Error loading application:', err);
        toast({ title: "Error", description: "Failed to load application.", variant: "destructive" });
      } finally {
        setIsLoadingExisting(false);
      }
    };
    loadApplication();
  }, [editId]);

  const { handleSubmit, trigger, formState: { errors }, watch } = methods;
  
  // Watch only the specific fields needed for document validation
  // (watching individual fields avoids creating a new object on every render)
  const ipType = watch('ip_type') as IPType;
  const claimsPriority = watch('claimsPriority');
  const isAgentFiling = watch('isAgentFiling');
  const isSmallEntity = watch('isSmallEntity');
  const isApplicantInventor = watch('isApplicantInventor');
  const isOwnerAuthor = watch('isOwnerAuthor');
  const attachments = watch('attachments');
  
  // Document validation
  const {
    isValid: documentsValid,
    isComplete: documentsComplete,
    missingDocs,
    getErrorMessages
  } = useDocumentValidation(ipType, {
    ip_type: ipType,
    claimsPriority,
    isAgentFiling,
    isSmallEntity,
    isApplicantInventor,
    isOwnerAuthor,
    attachments
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

      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to save a draft.",
          variant: "destructive",
        });
        return;
      }

      const applicationData = {
        faculty_id: session.user.id,
        ip_type: formData.ip_type || 'Patent',
        status: 'Draft',
        applicant_full_name: formData.applicant_name,
        applicant_address: formData.applicant_address,
        applicant_nationality: formData.applicant_nationality,
        applicant_email: formData.applicant_email,
        applicant_phone: formData.applicant_contact,
        title: formData.title || 'Untitled Draft',
        abstract: formData.abstract,
        field_of_technology: formData.field_of_technology,
        background_of_invention: formData.background_of_invention,
        summary_of_invention: formData.summary_of_invention,
        detailed_description: formData.detailed_description,
        co_inventors: formData.co_inventors || [],
        declaration_confirmed: formData.declaration_ownership && formData.declaration_accuracy && formData.declaration_ustp,
      };

      if (isEditMode && editId) {
        // Update existing application
        const { error } = await (supabase as any)
          .from('ip_applications')
          .update(applicationData)
          .eq('id', editId);

        if (error) {
          console.error('Error updating draft:', error);
          toast({ title: "Error", description: "Failed to save draft. " + error.message, variant: "destructive" });
          return;
        }

        // Delete removed existing attachments
        const attachments = formData.attachments || [];
        const currentIds = new Set(
          attachments.filter((a: any) => a.isExisting && a.id).map((a: any) => a.id)
        );
        const removed = originalAttachments.filter((a: any) => !currentIds.has(a.id));
        if (removed.length > 0) {
          await (supabase as any)
            .from('ip_application_attachments')
            .delete()
            .in('id', removed.map((a: any) => a.id));
        }

        // Upload new attachments if any
        const newAttachments = attachments.filter((a: any) => !a.isExisting);
        if (newAttachments.length > 0) {
          const uploadResult = await uploadAndCreateAttachments(newAttachments, editId, session.user.id);
          if (uploadResult.failed > 0) {
            toast({ title: "Draft Saved with Issues", description: `${uploadResult.success} file(s) uploaded, ${uploadResult.failed} failed.`, variant: "destructive" });
          } else {
            toast({ title: "Draft Saved", description: `Application updated and ${uploadResult.success} file(s) uploaded.` });
          }
        } else {
          toast({ title: "Draft Saved", description: "Your application has been updated." });
        }
      } else {
        // Insert new draft
        const { data: application, error } = await (supabase as any)
          .from('ip_applications')
          .insert([applicationData])
          .select()
          .single();

        if (error) {
          console.error('Error saving draft:', error);
          toast({ title: "Error", description: "Failed to save draft. " + error.message, variant: "destructive" });
          return;
        }

        // Upload attachments if any
        const attachments = formData.attachments || [];
        if (attachments.length > 0 && application) {
          const uploadResult = await uploadAndCreateAttachments(attachments, application.id, session.user.id);
          if (uploadResult.failed > 0) {
            toast({ title: "Draft Saved with Issues", description: `${uploadResult.success} file(s) uploaded, ${uploadResult.failed} failed.`, variant: "destructive" });
          } else {
            toast({ title: "Draft Saved", description: `Your application and ${uploadResult.success} file(s) have been saved as a draft.` });
          }
        } else {
          toast({ title: "Draft Saved", description: "Your application has been saved as a draft." });
        }
      }

      navigate("/faculty");
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({ title: "Error", description: "Failed to save draft. Please try again.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (data: any) => {
    // Check declarations are confirmed
    if (!data.declaration_ownership || !data.declaration_accuracy || !data.declaration_ustp) {
      toast({
        title: "Declarations Required",
        description: "Please accept all declarations before submitting.",
        variant: "destructive",
      });
      setCurrentStep(3);
      return;
    }

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
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to submit an application.",
          variant: "destructive",
        });
        return;
      }

      const submitData = {
        faculty_id: session.user.id,
        ip_type: data.ip_type,
        status: 'Submitted for Internal Review',
        applicant_full_name: data.applicant_name,
        applicant_address: data.applicant_address,
        applicant_nationality: data.applicant_nationality,
        applicant_email: data.applicant_email,
        applicant_phone: data.applicant_contact,
        title: data.title,
        abstract: data.abstract,
        field_of_technology: data.field_of_technology,
        background_of_invention: data.background_of_invention,
        summary_of_invention: data.summary_of_invention,
        detailed_description: data.detailed_description,
        co_inventors: data.co_inventors || [],
        declaration_confirmed: true,
        declaration_date: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
      };

      let applicationId = editId;

      if (isEditMode && editId) {
        // Update existing application and submit
        const { error } = await (supabase as any)
          .from('ip_applications')
          .update(submitData)
          .eq('id', editId);

        if (error) {
          console.error('Error submitting application:', error);
          toast({ title: "Error", description: "Failed to submit application. " + error.message, variant: "destructive" });
          return;
        }

        // Delete removed existing attachments
        const attachments = data.attachments || [];
        const currentIds = new Set(
          attachments.filter((a: any) => a.isExisting && a.id).map((a: any) => a.id)
        );
        const removed = originalAttachments.filter((a: any) => !currentIds.has(a.id));
        if (removed.length > 0) {
          await (supabase as any)
            .from('ip_application_attachments')
            .delete()
            .in('id', removed.map((a: any) => a.id));
        }
      } else {
        // Insert new submitted application
        const { data: application, error } = await (supabase as any)
          .from('ip_applications')
          .insert([submitData])
          .select()
          .single();

        if (error) {
          console.error('Error submitting application:', error);
          toast({ title: "Error", description: "Failed to submit application. " + error.message, variant: "destructive" });
          return;
        }
        applicationId = application?.id;
      }

      // Upload attachments
      const attachments = data.attachments || [];
      const newAttachments = attachments.filter((a: any) => !a.isExisting);
      if (newAttachments.length > 0 && applicationId) {
        const uploadResult = await uploadAndCreateAttachments(newAttachments, applicationId, session.user.id);

        if (uploadResult.failed > 0) {
          toast({
            title: "Application Submitted with File Issues",
            description: `Application submitted but ${uploadResult.failed} file(s) failed to upload.`,
            variant: "destructive",
          });
          navigate("/faculty");
          return;
        }
      }

      toast({
        title: "Application Submitted",
        description: attachments.length > 0
          ? `Your IP application with ${attachments.length} file(s) has been submitted for internal review.`
          : "Your IP application has been submitted for internal review.",
      });

      // Notify admin via activity_logs
      try {
        await supabase.from('activity_logs').insert([{
          activity_type: 'ip_application',
          action: 'submitted',
          title: `New ${data.ip_type} application: ${data.title || 'Untitled'}`,
          description: `Submitted by ${data.applicant_name} for ${data.ip_type} review`,
          application_id: applicationId || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
      } catch (logErr) {
        console.warn('Could not log activity for admin notification:', logErr);
      }

      navigate("/faculty");
    } catch (error) {
      console.error('Error submitting application:', error);
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
              {isEditMode ? "Edit IP Application" : "New IP Application"}
            </h1>
            <div className="w-24" /> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoadingExisting ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            <span className="ml-3 text-gray-600">Loading application...</span>
          </div>
        ) : (
        <>
        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator steps={steps} currentStep={currentStep} onStepClick={handleStepClick} />
        </div>

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(methods.getValues()); }}>
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
        </>
        )}
      </main>
    </div>
  );
}
