import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationTable } from "@/components/faculty/ApplicationTable";
import { StatsCards } from "@/components/faculty/StatsCards";
import { NotificationPanel } from "@/components/faculty/NotificationPanel";
import { IPApplication } from "@/types/ipApplication";
import { 
  Plus, 
  FileText, 
  LogOut, 
  User,
  GraduationCap,
  ChevronRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState<IPApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [facultyName, setFacultyName] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    checkAuth();
    loadFacultyData();
    loadApplications();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
      return;
    }
    
    // Check if user has faculty role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (!profile || (profile.role !== 'faculty' && profile.role !== 'admin')) {
      toast({
        title: "Access Denied",
        description: "You don't have faculty access permissions.",
        variant: "destructive"
      });
      navigate('/admin');
    }
  };

  const loadFacultyData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id, full_name')
        .eq('id', session.user.id)
        .single();
      
      if (profile) {
        setFacultyName(profile.full_name);
        setFacultyId(profile.id);
      }
    }
  };

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setApplications([]);
        return;
      }

      // Fetch IP applications from Supabase (both active and archived)
      const { data, error } = await (supabase as any)
        .from('ip_applications')
        .select('*')
        .eq('faculty_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        toast({
          title: "Error",
          description: "Failed to load applications from database.",
          variant: "destructive"
        });
        setApplications([]);
        return;
      }

      // Map database fields to IPApplication type
      const mappedApplications: IPApplication[] = (data || []).map((app: any) => ({
        id: app.id,
        application_number: app.application_number,
        faculty_id: app.faculty_id,
        ip_type: app.ip_type,
        title: app.title,
        status: app.status,
        applicant_name: app.applicant_full_name,
        applicant_address: app.applicant_address,
        applicant_nationality: app.applicant_nationality,
        applicant_contact: app.applicant_phone || '',
        applicant_email: app.applicant_email,
        abstract: app.abstract || '',
        detailed_description: app.detailed_description || '',
        field_of_technology: app.field_of_technology || '',
        background_of_invention: app.background_of_invention || '',
        summary_of_invention: app.summary_of_invention || '',
        co_inventors: app.co_inventors || [],
        version: app.current_version || 1,
        is_current_version: true,
        previous_version_id: null,
        ipophl_filing_date: app.ipophl_filing_date,
        ipophl_application_number: app.ipophl_application_number,
        ipophl_status: null,
        created_at: app.created_at,
        updated_at: app.updated_at,
        submitted_at: app.submitted_at,
        is_archived: app.is_archived || false
      }));

      setApplications(mappedApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications. Please try again.",
        variant: "destructive"
      });
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleArchive = async (id: string) => {
    const { error } = await (supabase as any)
      .from('ip_applications')
      .update({ is_archived: true })
      .eq('id', id);
    if (error) {
      toast({ title: "Error", description: "Failed to archive application.", variant: "destructive" });
    } else {
      toast({ title: "Archived", description: "Application moved to archive." });
      loadApplications();
    }
  };

  const handleRestore = async (id: string) => {
    const { error } = await (supabase as any)
      .from('ip_applications')
      .update({ is_archived: false })
      .eq('id', id);
    if (error) {
      toast({ title: "Error", description: "Failed to restore application.", variant: "destructive" });
    } else {
      toast({ title: "Restored", description: "Application restored to active list." });
      loadApplications();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await (supabase as any)
      .from('ip_applications')
      .delete()
      .eq('id', id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete application.", variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Application permanently deleted." });
      loadApplications();
    }
  };

  const filteredApplications = applications.filter(app => {
    if (activeTab === "all") return !app.is_archived;
    if (activeTab === "drafts") return app.status === "Draft" && !app.is_archived;
    if (activeTab === "pending") return 
      ['Submitted for Internal Review', 'Under Internal Review', 'Needs Revision'].includes(app.status) && !app.is_archived;
    if (activeTab === "approved") return app.status === "Approved for IPOPHL Filing" && !app.is_archived;
    if (activeTab === "filed") return 
      ['Filed to IPOPHL', 'Under IPOPHL Examination', 'Published'].includes(app.status) && !app.is_archived;
    if (activeTab === "completed") return ['Granted', 'Rejected'].includes(app.status) && !app.is_archived;
    if (activeTab === "archived") return app.is_archived;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Faculty IP Portal</h1>
                <p className="text-xs text-white/70">USTP TPCO Intellectual Property Filing System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <NotificationPanel facultyId={facultyId} darkMode={true} />
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full">
                <User className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">{facultyName || "Faculty"}</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome, {facultyName || "Faculty"}!
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your intellectual property applications and track their status through the IPOPHL filing process.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards applications={applications} />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">My Applications</h3>
            <p className="text-sm text-gray-500">
              View and manage your IP filings
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('/faculty/applications/new')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New IP Application
          </Button>
        </div>

        {/* Applications Table with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white border-2 border-blue-100 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200">All</TabsTrigger>
            <TabsTrigger value="drafts" className="data-[state=active]:bg-slate-50 data-[state=active]:text-slate-700 data-[state=active]:border-slate-200">Drafts</TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 data-[state=active]:border-amber-200">Pending Review</TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:border-green-200">Approved</TabsTrigger>
            <TabsTrigger value="filed" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-purple-200">Filed to IPOPHL</TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200">Completed</TabsTrigger>
            <TabsTrigger value="archived" className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700 data-[state=active]:border-gray-300">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="bg-white rounded-xl border-2 border-blue-100 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 px-6 py-3 border-b border-blue-100">
                <h3 className="font-semibold text-blue-900">IP Applications</h3>
              </div>
              <ApplicationTable 
                applications={filteredApplications}
                isLoading={isLoading}
                onRefresh={loadApplications}
                onArchive={handleArchive}
                onRestore={handleRestore}
                onDelete={handleDelete}
                activeTab={activeTab}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* IP Filing Guide */}
        <div className="mt-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-1 shadow-xl">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  IPOPHL Filing Process Guide
                </h3>
                <p className="text-gray-600 mb-4">
                  Learn about the IP filing workflow and requirements for patents, utility models, 
                  industrial designs, and copyrights in the Philippines.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors">
                    View Filing Requirements
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors">
                    Download Forms
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors">
                    Contact IP Coordinator
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
