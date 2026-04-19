import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/faculty/StatusBadge";
import { IPTypeBadge } from "@/components/faculty/IPTypeBadge";
import { 
  IPApplication, 
  IPClaim, 
  IPAttachment, 
  IPApplicationStatusHistory,
  IPApplicationComment 
} from "@/types/ipApplication";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  ChevronLeft,
  Edit,
  FileText,
  Clock,
  MessageSquare,
  Download,
  User,
  Calendar,
  History,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

export default function FacultyApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [application, setApplication] = useState<IPApplication | null>(null);
  const [claims, setClaims] = useState<IPClaim[]>([]);
  const [attachments, setAttachments] = useState<IPAttachment[]>([]);
  const [statusHistory, setStatusHistory] = useState<IPApplicationStatusHistory[]>([]);
  const [comments, setComments] = useState<IPApplicationComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApplicationDetails();
  }, [id]);

  const loadApplicationDetails = async () => {
    setIsLoading(true);
    try {
      if (!id) {
        toast({
          title: "Error",
          description: "Invalid application ID.",
          variant: "destructive"
        });
        return;
      }

      // Fetch application details from Supabase
      const { data: appData, error: appError } = await (supabase as any)
        .from('ip_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (appError || !appData) {
        console.error('Error fetching application:', appError);
        toast({
          title: "Error",
          description: "Failed to load application details.",
          variant: "destructive"
        });
        return;
      }

      // Map database fields to IPApplication type
      const mappedApplication: IPApplication = {
        id: appData.id,
        application_number: appData.application_number,
        faculty_id: appData.faculty_id,
        ip_type: appData.ip_type,
        title: appData.title,
        status: appData.status,
        applicant_name: appData.applicant_full_name,
        applicant_address: appData.applicant_address,
        applicant_nationality: appData.applicant_nationality,
        applicant_contact: appData.applicant_phone || '',
        applicant_email: appData.applicant_email,
        abstract: appData.abstract || '',
        detailed_description: appData.detailed_description || '',
        field_of_technology: appData.field_of_technology || '',
        background_of_invention: appData.background_of_invention || '',
        summary_of_invention: appData.summary_of_invention || '',
        co_inventors: appData.co_inventors || [],
        version: appData.current_version || 1,
        is_current_version: true,
        previous_version_id: null,
        ipophl_filing_date: appData.ipophl_filing_date,
        ipophl_application_number: appData.ipophl_application_number,
        ipophl_status: null,
        created_at: appData.created_at,
        updated_at: appData.updated_at,
        submitted_at: appData.submitted_at
      };

      // Fetch related data in parallel
      const [
        { data: claimsData },
        { data: attachmentsData },
        { data: historyData },
        { data: commentsData }
      ] = await Promise.all([
        (supabase as any).from('ip_application_claims').select('*').eq('application_id', id).order('claim_number'),
        (supabase as any).from('ip_application_attachments').select('*').eq('application_id', id).order('created_at', { ascending: false }),
        (supabase as any).from('ip_application_status_history').select('*').eq('application_id', id).order('created_at', { ascending: false }),
        (supabase as any).from('ip_application_comments').select('*').eq('application_id', id).order('created_at', { ascending: false })
      ]);

      // Map claims
      const mappedClaims: IPClaim[] = (claimsData || []).map((claim: any) => ({
        id: claim.id,
        application_id: claim.application_id,
        claim_number: claim.claim_number,
        claim_type: claim.claim_type,
        parent_claim_number: claim.depends_on,
        text: claim.claim_text,
        created_at: claim.created_at
      }));

      // Map attachments
      const mappedAttachments: IPAttachment[] = (attachmentsData || []).map((att: any) => ({
        id: att.id,
        application_id: att.application_id,
        file_name: att.file_name,
        file_type: att.mime_type || 'application/octet-stream',
        file_size: att.file_size || 0,
        file_url: att.file_path,
        attachment_type: att.file_type,
        description: att.description || '',
        uploaded_at: att.created_at
      }));

      // Map status history
      const mappedHistory: IPApplicationStatusHistory[] = (historyData || []).map((hist: any) => ({
        id: hist.id,
        application_id: hist.application_id,
        status: hist.to_status,
        comments: hist.change_reason || '',
        changed_by: 'Admin', // TODO: Get user name from profiles
        changed_at: hist.created_at
      }));

      // Map comments
      const mappedComments: IPApplicationComment[] = (commentsData || []).map((comment: any) => ({
        id: comment.id,
        application_id: comment.application_id,
        comment: comment.comment,
        commenter_name: 'Reviewer', // TODO: Get user name from profiles
        commenter_role: 'IP Committee',
        is_internal: false,
        created_at: comment.created_at
      }));

      setApplication(mappedApplication);
      setClaims(mappedClaims);
      setAttachments(mappedAttachments);
      setStatusHistory(mappedHistory);
      setComments(mappedComments);
    } catch (error) {
      console.error('Error loading application details:', error);
      toast({
        title: "Error",
        description: "Failed to load application details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canEdit = (status: string) => {
    return status === "Draft" || status === "Needs Revision";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Application not found</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/faculty')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/faculty")}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Application Details
                </h1>
                <p className="text-sm text-gray-500 font-mono">
                  {application.application_number}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <StatusBadge status={application.status} />
              {canEdit(application.status) && (
                <Button 
                  size="sm"
                  onClick={() => navigate(`/faculty/applications/${id}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <IPTypeBadge type={application.ip_type} className="mb-3" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      {application.title}
                    </h2>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="font-medium">
                      {application.submitted_at 
                        ? format(new Date(application.submitted_at), 'MMM d, yyyy')
                        : 'Not submitted'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Version</p>
                    <p className="font-medium">v{application.version}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Field</p>
                    <p className="font-medium">{application.field_of_technology}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">
                      {format(new Date(application.updated_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Content */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="claims">Claims</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Abstract
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{application.abstract}</p>
                  </CardContent>
                </Card>

                {application.background_of_invention && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Background of the Invention</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{application.background_of_invention}</p>
                    </CardContent>
                  </Card>
                )}

                {application.summary_of_invention && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Summary of the Invention</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{application.summary_of_invention}</p>
                    </CardContent>
                  </Card>
                )}

                {application.detailed_description && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{application.detailed_description}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="claims" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Claims ({claims.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {claims.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No claims filed</p>
                    ) : (
                      <div className="space-y-4">
                        {claims.map((claim) => (
                          <div key={claim.id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={claim.claim_type === 'independent' ? 'default' : 'secondary'}>
                                Claim {claim.claim_number}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {claim.claim_type === 'independent' ? 'Independent' : `Dependent on Claim ${claim.parent_claim_number}`}
                              </span>
                            </div>
                            <p className="text-gray-700">{claim.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attachments" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Attachments ({attachments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {attachments.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No attachments</p>
                    ) : (
                      <div className="space-y-3">
                        {attachments.map((attachment) => (
                          <div 
                            key={attachment.id} 
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-blue-500" />
                              <div>
                                <p className="font-medium">{attachment.file_name}</p>
                                <p className="text-sm text-gray-500">
                                  {formatFileSize(attachment.file_size)} • {attachment.attachment_type}
                                </p>
                                {attachment.description && (
                                  <p className="text-sm text-gray-600 mt-1">{attachment.description}</p>
                                )}
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Status History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {statusHistory.map((history, index) => (
                        <div key={history.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full" />
                            {index < statusHistory.length - 1 && (
                              <div className="w-0.5 h-full bg-gray-200 my-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex items-center justify-between">
                              <StatusBadge status={history.status} />
                              <span className="text-sm text-gray-500">
                                {format(new Date(history.changed_at), 'MMM d, yyyy HH:mm')}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{history.comments}</p>
                            <p className="text-xs text-gray-400 mt-1">by {history.changed_by}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Applicant Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Applicant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">{application.applicant_name}</p>
                  <p className="text-sm text-gray-500">{application.applicant_nationality}</p>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <p>{application.applicant_address}</p>
                  <p>{application.applicant_contact}</p>
                  <p>{application.applicant_email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Co-Inventors */}
            {application.co_inventors && application.co_inventors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Co-Inventors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {application.co_inventors.map((inventor, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">{inventor.name}</p>
                        <p className="text-sm text-gray-500">{inventor.nationality}</p>
                        <p className="text-sm text-gray-600 mt-1">{inventor.contribution}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Reviewer Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No comments yet</p>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{comment.comment}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-medium text-gray-600">
                            {comment.commenter_name}
                          </span>
                          <span className="text-xs text-gray-400">
                            {format(new Date(comment.created_at), 'MMM d')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
