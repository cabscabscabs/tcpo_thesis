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
      // TODO: Replace with actual API call to your backend
      // const response = await fetch('/api/faculty/ip-applications');
      // const data = await response.json();
      
      // Mock data for now
      const mockApplications: IPApplication[] = [
        {
          id: "app-1",
          application_number: "IP-2026-00001",
          faculty_id: facultyId,
          ip_type: "Patent",
          title: "Smart Agriculture Monitoring System Using IoT and Machine Learning",
          status: "Approved for IPOPHL Filing",
          applicant_name: "Dr. Juan Dela Cruz",
          applicant_address: "USTP Cagayan de Oro",
          applicant_nationality: "Filipino",
          applicant_contact: "09123456789",
          applicant_email: "juan@ustp.edu.ph",
          abstract: "An innovative system for monitoring agricultural conditions using IoT sensors and ML algorithms...",
          detailed_description: "",
          field_of_technology: "Agricultural Technology",
          background_of_invention: "",
          summary_of_invention: "",
          co_inventors: [
            { name: "Maria Santos", address: "USTP", nationality: "Filipino", contribution: "Hardware design" }
          ],
          version: 1,
          is_current_version: true,
          previous_version_id: null,
          ipophl_filing_date: null,
          ipophl_application_number: null,
          ipophl_status: null,
          created_at: "2026-04-10T08:00:00Z",
          updated_at: "2026-04-15T14:30:00Z",
          submitted_at: "2026-04-12T10:00:00Z"
        },
        {
          id: "app-2",
          application_number: "IP-2026-00002",
          faculty_id: facultyId,
          ip_type: "Utility Model",
          title: "Portable Water Purification Device",
          status: "Needs Revision",
          applicant_name: "Dr. Juan Dela Cruz",
          applicant_address: "USTP Cagayan de Oro",
          applicant_nationality: "Filipino",
          applicant_contact: "09123456789",
          applicant_email: "juan@ustp.edu.ph",
          abstract: "A compact water purification device for emergency and outdoor use...",
          detailed_description: "",
          field_of_technology: "Environmental Technology",
          background_of_invention: "",
          summary_of_invention: "",
          co_inventors: [],
          version: 2,
          is_current_version: true,
          previous_version_id: "app-2-v1",
          ipophl_filing_date: null,
          ipophl_application_number: null,
          ipophl_status: null,
          created_at: "2026-04-05T09:00:00Z",
          updated_at: "2026-04-14T16:45:00Z",
          submitted_at: "2026-04-08T11:00:00Z"
        },
        {
          id: "app-3",
          application_number: "IP-2026-00003",
          faculty_id: facultyId,
          ip_type: "Copyright",
          title: "Educational Mobile App for Philippine History",
          status: "Draft",
          applicant_name: "Dr. Juan Dela Cruz",
          applicant_address: "USTP Cagayan de Oro",
          applicant_nationality: "Filipino",
          applicant_contact: "09123456789",
          applicant_email: "juan@ustp.edu.ph",
          abstract: "Interactive mobile application for learning Philippine history...",
          detailed_description: "",
          field_of_technology: "Educational Technology",
          background_of_invention: "",
          summary_of_invention: "",
          co_inventors: [],
          version: 1,
          is_current_version: true,
          previous_version_id: null,
          ipophl_filing_date: null,
          ipophl_application_number: null,
          ipophl_status: null,
          created_at: "2026-04-15T10:00:00Z",
          updated_at: "2026-04-15T10:00:00Z",
          submitted_at: null
        }
      ];
      
      setApplications(mockApplications);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load applications. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const filteredApplications = applications.filter(app => {
    if (activeTab === "all") return true;
    if (activeTab === "drafts") return app.status === "Draft";
    if (activeTab === "pending") return 
      ['Submitted for Internal Review', 'Under Internal Review', 'Needs Revision'].includes(app.status);
    if (activeTab === "approved") return app.status === "Approved for IPOPHL Filing";
    if (activeTab === "filed") return 
      ['Filed to IPOPHL', 'Under IPOPHL Examination', 'Published'].includes(app.status);
    if (activeTab === "completed") return ['Granted', 'Rejected'].includes(app.status);
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Faculty IP Portal</h1>
                <p className="text-xs text-gray-500">USTP TPCO Intellectual Property Filing System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <NotificationPanel facultyId={facultyId} />
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{facultyName || "Faculty"}</span>
              </div>
              
              <Button variant="ghost" size="sm" onClick={handleLogout}>
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
          <TabsList className="bg-white border">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="filed">Filed to IPOPHL</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="bg-white rounded-lg border shadow-sm">
              <ApplicationTable 
                applications={filteredApplications}
                isLoading={isLoading}
                onRefresh={loadApplications}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* IP Filing Guide */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                IPOPHL Filing Process Guide
              </h3>
              <p className="text-gray-600 mb-4">
                Learn about the IP filing workflow and requirements for patents, utility models, 
                industrial designs, and copyrights in the Philippines.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" className="bg-white">
                  View Filing Requirements
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                <Button variant="outline" size="sm" className="bg-white">
                  Download Forms
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                <Button variant="outline" size="sm" className="bg-white">
                  Contact IP Coordinator
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
