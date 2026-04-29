import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Edit, Plus, Eye, EyeOff, Users, Mail, Phone, Building, Calendar, CheckCircle, XCircle, Clock, Download, FileText, Video, BookOpen, Wrench, Upload, Loader2, Search, Filter, X, Bell, Check, BellOff, FileUp, FileDown, EyeIcon, MessageSquare, AlertCircle, ChevronRight, Send, DollarSign, Award } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { PatentAnalyticsCard } from "@/components/admin/PatentAnalyticsCard";



const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Patent management state
  const [patents, setPatents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Patent filtering state
  const [patentSearchTerm, setPatentSearchTerm] = useState('');
  const [patentFieldFilter, setPatentFieldFilter] = useState('all');
  
  // Patent bulk upload and download state
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [selectedPatentFields, setSelectedPatentFields] = useState<string[]>(['title', 'patentId', 'inventors', 'field', 'status', 'year']);
  const [selectedPatentsForExport, setSelectedPatentsForExport] = useState<string[]>([]);
  const [patentExportMode, setPatentExportMode] = useState<'all' | 'selected'>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [csvUploadKey, setCsvUploadKey] = useState(0); // Key to reset file input

  // Track patents recently added via Bulk Upload CSV.
  // Bulk-uploaded patents start as Filed + unpublished, so they don't appear
  // on the public IP Portfolio until admin opens each one and edits it.
  // We persist the IDs to localStorage so the indicator survives page reloads.
  const BULK_UPLOAD_STORAGE_KEY = 'tpco-recent-bulk-patents';
  const [recentBulkPatentIds, setRecentBulkPatentIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(BULK_UPLOAD_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Persist whenever the set changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(BULK_UPLOAD_STORAGE_KEY, JSON.stringify(recentBulkPatentIds));
    } catch {
      /* localStorage may be unavailable in some browsers */
    }
  }, [recentBulkPatentIds]);
  
  // Patent pagination state
  const [patentCurrentPage, setPatentCurrentPage] = useState(1);
  const patentsPerPage = 5;

  // Patent detail modal state
  const [selectedPatentForDetail, setSelectedPatentForDetail] = useState<any>(null);
  const [showPatentDetailModal, setShowPatentDetailModal] = useState(false);

  // Patent form state for "Add New Patent" section
  const [patentForm, setPatentForm] = useState({
    title: '',
    patentId: '',
    inventors: '',
    field: '',
    description: '',
    abstract: '',
    status: 'Pending',
    year: new Date().getFullYear().toString()
  });

  // Patent file upload state (supports multiple files)
  const [patentFiles, setPatentFiles] = useState<File[]>([]);
  const [uploadingPatent, setUploadingPatent] = useState(false);

  // Patent form state for modal editing (separate from add form)
  const [patentEditForm, setPatentEditForm] = useState({
    title: '',
    patentId: '',
    inventors: '',
    field: '',
    description: '',
    abstract: '',
    status: 'Filed',
    year: new Date().getFullYear().toString(),
    file_url: '',
    file_name: '',
    files: [] as { url: string; name: string }[]
  });
  
  // Patent edit modal file management
  const [patentEditNewFiles, setPatentEditNewFiles] = useState<File[]>([]);
  const [patentEditFilesToDelete, setPatentEditFilesToDelete] = useState<string[]>([]);

  // Licensed Revenue state
  const [licensedRevenue, setLicensedRevenue] = useState('');
  const [savingRevenue, setSavingRevenue] = useState(false);

  // News management
  const [news, setNews] = useState<any[]>([]);
  const [draftNews, setDraftNews] = useState<any[]>([]);
  const [archivedNews, setArchivedNews] = useState<any[]>([]);
  const [newsTab, setNewsTab] = useState('published');
  const [newsSearchTerm, setNewsSearchTerm] = useState('');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState('all');

  // Dashboard statistics
  const [dashboardStats, setDashboardStats] = useState({
    totalPatents: 24,
    patentsThisMonth: 3,
    publishedNews: 18,
    newsThisWeek: 5,
    upcomingEvents: 6,
    nextEventDate: "Feb 15",
    serviceRequests: 12,
    pendingRequests: 8
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [allActivities, setAllActivities] = useState<any[]>([]);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityFilter, setActivityFilter] = useState('all');
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityPage, setActivityPage] = useState(1);
  const ACTIVITIES_PER_PAGE = 5;

  // Notification state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [lastCheckedTime, setLastCheckedTime] = useState<string | null>(null);

  // IP Applications state
  const [ipApplications, setIpApplications] = useState<any[]>([]);
  const [ipAppLoading, setIpAppLoading] = useState(false);
  const [ipAppSearchTerm, setIpAppSearchTerm] = useState('');
  const [ipAppStatusFilter, setIpAppStatusFilter] = useState('all');
  const [ipAppTypeFilter, setIpAppTypeFilter] = useState('all');
  const [selectedIpApp, setSelectedIpApp] = useState<any>(null);
  const [showIpAppDetailModal, setShowIpAppDetailModal] = useState(false);
  const [showIpAppReviewModal, setShowIpAppReviewModal] = useState(false);
  const [ipAppReviewNotes, setIpAppReviewNotes] = useState('');
  const [ipAppReviewAction, setIpAppReviewAction] = useState<'approve' | 'return' | 'reject' | 'granted' | null>('approve');
  const [ipAppReviewFiles, setIpAppReviewFiles] = useState<File[]>([]);
  const [isUploadingReviewFiles, setIsUploadingReviewFiles] = useState(false);
  const [ipAppCurrentPage, setIpAppCurrentPage] = useState(1);
  const ipAppsPerPage = 10;
  const [ipAppDetailComments, setIpAppDetailComments] = useState<any[]>([]);
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
  const [ipAppDetailNewComment, setIpAppDetailNewComment] = useState('');
  const [isSubmittingDetailComment, setIsSubmittingDetailComment] = useState(false);

  // Helper: navigate to a specific IP application from a notification/activity
  const navigateToIpApplication = (applicationId: string) => {
    setActiveAdminTab('ip-applications');
    // Find the app and open detail modal
    const app = ipApplications.find((a: any) => a.id === applicationId);
    if (app) {
      setSelectedIpApp(app);
      setShowIpAppDetailModal(true);
      loadIpAppComments(app.id);
    }
  };
  
  // Check session on component mount for auto-login
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Check if user has a profile
          const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('role, full_name, email')
            .eq('id', session.user.id)
            .single();
          
          if (!error && profile && (profile.role === 'admin' || profile.role === 'faculty')) {
            // User has a valid role
            if (profile.role === 'faculty') {
              navigate('/faculty');
              return;
            }
            setIsLoggedIn(true);
            setCurrentUserRole(profile.role);
          } else if (session.user.app_metadata?.provider === 'google') {
            // Google OAuth user without profile - auto-create as faculty
            const userEmail = session.user.email || '';
            const userName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || userEmail;
            
            // Check if email is from USTP domain
            if (userEmail.endsWith('@ustp.edu.ph')) {
              // Create faculty profile
              const { error: insertError } = await supabase
                .from('user_profiles')
                .upsert({
                  id: session.user.id,
                  email: userEmail,
                  full_name: userName,
                  role: 'faculty',
                  status: 'active',
                  department: null,
                  employee_id: null,
                  phone: null
                });
              
              if (insertError) {
                console.error('Error creating faculty profile:', insertError);
                setLoginError('Failed to create faculty profile. Please contact administrator.');
                await supabase.auth.signOut();
                return;
              }
              
              // Redirect to faculty dashboard
              navigate('/faculty');
              return;
            } else {
              // Non-USTP email - sign them out
              setLoginError('Please use your USTP university email (@ustp.edu.ph) to sign in.');
              await supabase.auth.signOut();
              return;
            }
          } else {
            // User doesn't have admin/faculty role, sign them out
            await supabase.auth.signOut();
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      }
    };
    
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setCurrentUserRole(null);
      } else if (event === 'SIGNED_IN' && session?.user) {
        // Handle OAuth sign-in
        if (session.user.app_metadata?.provider === 'google') {
          await checkSession();
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load recent activities from Supabase
  useEffect(() => {
    loadRecentActivities();
    loadNotifications();
    loadIpApplications();
  }, []);

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!isLoggedIn) return;

    const channel = supabase
      .channel('activity_logs_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activity_logs'
        },
        (payload) => {
          // Add new notification
          const newNotification = {
            id: payload.new.id,
            type: payload.new.activity_type,
            action: payload.new.action,
            title: payload.new.title,
            description: payload.new.description,
            application_id: payload.new.application_id,
            timestamp: payload.new.created_at,
            isRead: false
          };
          
          setNotifications(prev => [newNotification, ...prev].slice(0, 20));
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoggedIn]);

  const loadRecentActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading recent activities:', error);
        // Fallback to demo data if there's an error
        setRecentActivity([
          { id: 1, type: "news", action: "published", title: "Innovation Workshop announcement", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() }, // 5 hours ago
          { id: 2, type: "technology", action: "added", title: "Smart Irrigation System", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }, // 1 day ago
          { id: 3, type: "service", action: "received", title: "Technology licensing inquiry", timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString() } // 30 hours ago
        ]);
      } else {
        // Map Supabase data to the expected format
        const mappedActivities = data?.map((activity: any) => ({
          id: activity.id,
          type: activity.activity_type,
          action: activity.action,
          title: activity.title,
          description: activity.description,
          application_id: activity.application_id,
          timestamp: activity.created_at
        })) || [];
        setRecentActivity(mappedActivities);
        setActivityPage(1); // Reset to first page when new data loads
      }
    } catch (err) {
      console.error('Unexpected error loading recent activities:', err);
      // Fallback to demo data if there's an error
      setRecentActivity([
        { id: 1, type: "news", action: "published", title: "Innovation Workshop announcement", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() }, // 5 hours ago
        { id: 2, type: "technology", action: "added", title: "Smart Irrigation System", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }, // 1 day ago
        { id: 3, type: "service", action: "received", title: "Technology licensing inquiry", timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString() } // 30 hours ago
      ]);
    }
  };

  // Load notifications for the bell
  const loadNotifications = async () => {
    try {
      // Get the last checked time from localStorage
      const storedLastChecked = localStorage.getItem('admin_last_notification_check');
      const lastChecked = storedLastChecked ? new Date(storedLastChecked) : new Date(Date.now() - 24 * 60 * 60 * 1000); // Default to 24 hours ago
      setLastCheckedTime(storedLastChecked);

      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error loading notifications:', error);
        return;
      }

      if (data) {
        const mappedNotifications = data.map((activity: any) => ({
          id: activity.id,
          type: activity.activity_type,
          action: activity.action,
          title: activity.title,
          description: activity.description,
          application_id: activity.application_id,
          timestamp: activity.created_at,
          isRead: storedLastChecked ? new Date(activity.created_at) <= new Date(storedLastChecked) : false
        }));

        setNotifications(mappedNotifications);
        const unread = mappedNotifications.filter((n: any) => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Unexpected error loading notifications:', err);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    const now = new Date().toISOString();
    localStorage.setItem('admin_last_notification_check', now);
    setLastCheckedTime(now);
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Mark single notification as read
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'news': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'technology':
      case 'patent': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'service': return <Wrench className="h-4 w-4 text-orange-500" />;
      case 'user': return <Users className="h-4 w-4 text-purple-500" />;
      case 'resource': return <BookOpen className="h-4 w-4 text-cyan-500" />;
      case 'event': return <Calendar className="h-4 w-4 text-pink-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(timestamp);
  };

  // IP Applications Functions
  const loadIpApplications = async () => {
    setIpAppLoading(true);
    try {
      // Fetch applications (try with faculty join first, fallback to without)
      let applications: any[] = [];
      
      const { data: appData, error: appError } = await supabase
        .from('ip_applications')
        .select(`
          *,
          faculty:faculty_id (full_name, email, department)
        `)
        .neq('status', 'Draft')
        .order('created_at', { ascending: false });

      if (appError) {
        console.warn('Join query failed, trying without faculty join:', appError.message);
        // Fallback: fetch without join
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('ip_applications')
          .select('*')
          .neq('status', 'Draft')
          .order('created_at', { ascending: false });
        
        if (fallbackError) throw fallbackError;
        
        // Manually fetch faculty profiles for each application
        applications = (fallbackData || []).map((app: any) => ({
          ...app,
          faculty: null
        }));
        
        // Batch fetch faculty profiles
        const facultyIds = [...new Set(applications.map((a: any) => a.faculty_id))];
        if (facultyIds.length > 0) {
          const { data: profiles } = await supabase
            .from('user_profiles')
            .select('id, full_name, email, department')
            .in('id', facultyIds);
          
          if (profiles) {
            const profileMap = new Map(profiles.map((p: any) => [p.id, p]));
            applications = applications.map((app: any) => ({
              ...app,
              faculty: profileMap.get(app.faculty_id) || { full_name: app.applicant_full_name, email: app.applicant_email, department: null }
            }));
          }
        }
      } else {
        applications = (appData || []).map((app: any) => ({
          ...app,
          faculty: app.faculty || { full_name: app.applicant_full_name, email: app.applicant_email, department: null }
        }));
      }

      // Fetch attachments for all applications
      let attachmentsMap: Record<string, any[]> = {};
      try {
        const { data: attachments } = await supabase
          .from('ip_application_attachments')
          .select('*');
        
        if (attachments) {
          for (const att of attachments) {
            if (!attachmentsMap[att.application_id]) attachmentsMap[att.application_id] = [];
            attachmentsMap[att.application_id].push(att);
          }
        }
      } catch (attachErr) {
        console.warn('Could not fetch attachments:', attachErr);
      }

      // Merge attachments into applications
      const data = applications.map(app => ({
        ...app,
        attachments: attachmentsMap[app.id] || []
      }));

      // Fetch comment counts per application (especially faculty comments for unread indication)
      let commentCountsMap: Record<string, { total: number; facultyComments: number }> = {};
      try {
        const { data: comments } = await supabase
          .from('ip_application_comments')
          .select('application_id, commenter_id');
        
        if (comments && comments.length > 0) {
          // Get faculty commenter IDs
          const commenterIds: string[] = [...new Set(comments.map((c: any) => c.commenter_id).filter(Boolean))];
          let facultyIds: Set<string> = new Set();
          if (commenterIds.length > 0) {
            const { data: profiles } = await supabase
              .from('user_profiles')
              .select('id')
              .eq('role', 'faculty')
              .in('id', commenterIds);
            if (profiles) {
              facultyIds = new Set(profiles.map((p: any) => p.id));
            }
          }

          for (const c of comments) {
            if (!commentCountsMap[c.application_id]) {
              commentCountsMap[c.application_id] = { total: 0, facultyComments: 0 };
            }
            commentCountsMap[c.application_id].total++;
            if (facultyIds.has(c.commenter_id)) {
              commentCountsMap[c.application_id].facultyComments++;
            }
          }
        }
      } catch (commentErr) {
        console.warn('Could not fetch comment counts:', commentErr);
      }

      // Merge comment counts into applications
      const dataWithComments = data.map(app => ({
        ...app,
        _commentCount: commentCountsMap[app.id]?.total || 0,
        _facultyCommentCount: commentCountsMap[app.id]?.facultyComments || 0
      }));

      setIpApplications(dataWithComments);
    } catch (err) {
      console.error('Error loading IP applications:', err);
      setIpApplications([]);
    } finally {
      setIpAppLoading(false);
    }
  };

  // Notification helper functions for IP application status changes
  const getNotificationTitle = (status: string): string => {
    switch (status) {
      case 'Approved for IPOPHL Filing': return 'Application Approved';
      case 'Needs Revision': return 'Revision Required';
      case 'Rejected': return 'Application Rejected';
      case 'Filed to IPOPHL': return 'Application Filed to IPOPHL';
      case 'Under IPOPHL Examination': return 'Application Under Examination';
      case 'Granted': return 'IP Granted';
      default: return 'Application Status Updated';
    }
  };

  const getNotificationMessage = (status: string, appTitle: string, notes?: string): string => {
    let base = '';
    switch (status) {
      case 'Approved for IPOPHL Filing':
        base = `Your IP application "${appTitle}" has been approved for IPOPHL filing. Please prepare the required documents for official submission.`;
        break;
      case 'Needs Revision':
        base = `Your IP application "${appTitle}" requires revision before it can be approved.`;
        break;
      case 'Rejected':
        base = `Your IP application "${appTitle}" has been rejected.`;
        break;
      case 'Filed to IPOPHL':
        base = `Your IP application "${appTitle}" has been filed to IPOPHL.`;
        break;
      case 'Under IPOPHL Examination':
        base = `Your IP application "${appTitle}" is now under IPOPHL examination.`;
        break;
      case 'Granted':
        base = `Congratulations! Your IP application "${appTitle}" has been granted.`;
        break;
      default:
        base = `The status of your IP application "${appTitle}" has been updated to ${status}.`;
    }
    if (notes && notes.trim()) {
      base += ` Reviewer notes: ${notes}`;
    }
    return base;
  };

  const getNotificationType = (status: string): string => {
    switch (status) {
      case 'Approved for IPOPHL Filing':
      case 'Granted':
        return 'approval';
      case 'Needs Revision':
        return 'revision_required';
      case 'Rejected':
        return 'rejection';
      default:
        return 'status_change';
    }
  };

  const handleIpAppStatusUpdate = async (appId: string, newStatus: string, notes?: string, reviewFiles?: File[], reviewFileDocType?: string) => {
    try {
      const adminId = (await supabase.auth.getUser()).data.user?.id;
      
      const { error } = await supabase
        .from('ip_applications')
        .update({
          status: newStatus,
          admin_notes: notes || null,
          status_updated_at: new Date().toISOString(),
          status_updated_by: adminId,
          // Granted is a milestone status — always surface it by auto-restoring
          // the application if it was archived, so it appears in the faculty's
          // Granted tab (and matches the Granted stat card count).
          ...(newStatus === 'Granted' ? { is_archived: false } : {})
        })
        .eq('id', appId);

      if (error) {
        console.error('Error updating IP application status:', error);
        alert('Failed to update status. Please try again.');
        return false;
      }

      // Upload admin review files if any. Tagged so the faculty detail page
      // can show them in a dedicated "Admin-Provided Files" section.
      if (reviewFiles && reviewFiles.length > 0 && adminId) {
        for (const file of reviewFiles) {
          try {
            const timestamp = Date.now();
            const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            const docType = reviewFileDocType || 'admin_feedback';
            const storagePath = `applications/${adminId}/${appId}/${docType}_${timestamp}_${safeName}`;

            const { error: uploadError } = await supabase.storage
              .from('application-files')
              .upload(storagePath, file, { cacheControl: '3600', upsert: false });

            if (uploadError) {
              console.error('Error uploading admin review file:', uploadError);
              continue;
            }

            const { data: urlData } = supabase.storage
              .from('application-files')
              .getPublicUrl(storagePath);

            const { error: attachErr } = await (supabase as any)
              .from('ip_application_attachments')
              .insert([{
                application_id: appId,
                file_name: file.name,
                file_type: 'supporting',
                file_path: urlData.publicUrl,
                file_size: file.size,
                mime_type: file.type || 'application/octet-stream',
                document_type: docType,
                description: docType === 'certification' ? 'Certification from admin' : 'Admin-provided file',
                uploaded_by: adminId,
              }]);

            if (attachErr) {
              console.error('Error creating admin attachment record:', attachErr);
            }
          } catch (fileErr) {
            console.error('Error processing admin review file:', fileErr);
          }
        }
      }

      // Try to insert status history record
      try {
        await supabase.from('ip_application_status_history').insert([{
          application_id: appId,
          from_status: selectedIpApp?.status || 'Unknown',
          to_status: newStatus,
          change_reason: notes || null,
          changed_by: adminId
        }]);
      } catch (histErr) {
        console.warn('Could not insert status history:', histErr);
      }

      // Try to insert comment if notes provided
      if (notes && notes.trim()) {
        try {
          await supabase.from('ip_application_comments').insert([{
            application_id: appId,
            comment: notes,
            commenter_id: adminId,
            is_internal: false
          }]);
        } catch (commentErr) {
          console.warn('Could not insert comment:', commentErr);
        }
      }

      // Send notification to the faculty member
      try {
        const facultyId = selectedIpApp?.faculty_id;
        if (facultyId) {
          const notifTitle = getNotificationTitle(newStatus);
          const notifMessage = getNotificationMessage(newStatus, selectedIpApp?.title || 'your application', notes);
          const notifType = getNotificationType(newStatus);
          
          await supabase.from('faculty_notifications').insert([{
            faculty_id: facultyId,
            application_id: appId,
            title: notifTitle,
            message: notifMessage,
            notification_type: notifType,
            is_read: false
          }]);
        }
      } catch (notifErr) {
        console.warn('Could not send faculty notification:', notifErr);
      }

      // Refresh the list
      await loadIpApplications();
      return true;
    } catch (err) {
      console.error('Error updating status:', err);
      alert('An error occurred. Please try again.');
      return false;
    }
  };

  const handleIpAppReview = async () => {
    if (!selectedIpApp) return;

    // Comment-only mode (for Needs Revision or other statuses)
    if (!ipAppReviewAction && ipAppReviewNotes.trim()) {
      try {
        const adminId = (await supabase.auth.getUser()).data.user?.id;
        // Try to insert comment
        try {
          await supabase.from('ip_application_comments').insert([{
            application_id: selectedIpApp.id,
            comment: ipAppReviewNotes,
            commenter_id: adminId,
            is_internal: false
          }]);
        } catch (commentErr) {
          console.warn('Could not insert comment:', commentErr);
        }
        // Also save as admin_notes
        await supabase
          .from('ip_applications')
          .update({ admin_notes: ipAppReviewNotes })
          .eq('id', selectedIpApp.id);
        
        await loadIpApplications();
        toast({ title: "Comment Added", description: "Your comment has been saved." });
      } catch (err) {
        console.error('Error adding comment:', err);
        toast({ title: "Error", description: "Failed to add comment.", variant: "destructive" });
      }
      setShowIpAppReviewModal(false);
      setIpAppReviewNotes('');
      setSelectedIpApp(null);
      return;
    }

    // Status change mode
    const statusMap: Record<string, string> = {
      'approve': 'Approved for IPOPHL Filing',
      'return': 'Needs Revision',
      'reject': 'Rejected',
      'granted': 'Granted'
    };

    // Validate comment required for revision/rejection
    if ((ipAppReviewAction === 'return' || ipAppReviewAction === 'reject') && !ipAppReviewNotes.trim()) {
      toast({ title: "Comment Required", description: "Please provide a comment when flagging for revision or rejecting an application.", variant: "destructive" });
      return;
    }

    // Granted action requires at least one certification file
    if (ipAppReviewAction === 'granted' && ipAppReviewFiles.length === 0) {
      toast({ title: "Certification Required", description: "Please attach at least one certification file before marking as Granted.", variant: "destructive" });
      return;
    }

    setIsUploadingReviewFiles(true);
    const reviewDocType = ipAppReviewAction === 'granted' ? 'certification' : 'admin_feedback';
    const success = await handleIpAppStatusUpdate(
      selectedIpApp.id,
      statusMap[ipAppReviewAction],
      ipAppReviewNotes,
      ipAppReviewFiles,
      reviewDocType
    );
    setIsUploadingReviewFiles(false);

    if (success) {
      const actionLabels: Record<string, string> = {
        'approve': 'Approved',
        'return': 'Flagged for Revision',
        'reject': 'Rejected',
        'granted': 'Granted'
      };
      toast({ 
        title: `Application ${actionLabels[ipAppReviewAction]}`, 
        description: `The application has been ${actionLabels[ipAppReviewAction].toLowerCase()}.` 
      });
      setShowIpAppReviewModal(false);
      setIpAppReviewNotes('');
      setIpAppReviewFiles([]);
      setSelectedIpApp(null);
    }
  };

  const getIpAppStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'Draft': 'bg-gray-500',
      'Submitted for Internal Review': 'bg-blue-500',
      'Under Internal Review': 'bg-yellow-500',
      'Needs Revision': 'bg-orange-500',
      'Approved for IPOPHL Filing': 'bg-green-500',
      'Filed to IPOPHL': 'bg-purple-500',
      'Under IPOPHL Examination': 'bg-indigo-500',
      'Granted': 'bg-emerald-600',
      'Rejected': 'bg-red-500'
    };
    return statusColors[status] || 'bg-gray-500';
  };

  const getIpAppStatusDisplay = (status: string) => {
    const displayMap: Record<string, string> = {
      'Submitted for Internal Review': 'For Review',
      'Under Internal Review': 'Under Review',
      'Approved for IPOPHL Filing': 'Approved for Filing',
      'Under IPOPHL Examination': 'Under Examination',
    };
    return displayMap[status] || status;
  };

  // Load comments for the IP app detail modal
  const loadIpAppComments = async (applicationId: string) => {
    try {
      const { data, error } = await supabase
        .from('ip_application_comments')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Could not load comments:', error);
        setIpAppDetailComments([]);
        return;
      }

      // Fetch commenter profiles
      const commenterIds: string[] = (data || []).map((c: any) => c.commenter_id).filter(Boolean);
      const uniqueIds = [...new Set(commenterIds)];
      let profilesMap: Record<string, { full_name: string; role: string }> = {};
      if (uniqueIds.length > 0) {
        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('id, full_name, role')
          .in('id', uniqueIds);
        if (profiles) {
          profilesMap = Object.fromEntries(profiles.map((p: any) => [p.id, p]));
        }
      }

      const mapped = (data || []).map((c: any) => {
        const commenter = profilesMap[c.commenter_id];
        return {
          ...c,
          commenter_name: commenter?.full_name || (commenter?.role === 'faculty' ? 'Faculty' : 'Reviewer'),
          commenter_role: commenter?.role === 'faculty' ? 'Faculty' : 'IP Committee'
        };
      });
      setIpAppDetailComments(mapped);
    } catch (err) {
      console.warn('Could not load comments:', err);
      setIpAppDetailComments([]);
    }
  };

  // Submit a comment from the admin detail modal
  const handleDetailModalComment = async () => {
    if (!ipAppDetailNewComment.trim() || !selectedIpApp) return;
    setIsSubmittingDetailComment(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name')
        .eq('id', session.user.id)
        .single();

      const { error } = await (supabase as any)
        .from('ip_application_comments')
        .insert([{
          application_id: selectedIpApp.id,
          comment: ipAppDetailNewComment.trim(),
          commenter_id: session.user.id,
          is_internal: false
        }]);

      if (error) {
        console.error('Error posting comment:', error);
        toast({ title: "Error", description: "Failed to post comment.", variant: "destructive" });
        return;
      }

      // Add to local state
      const newComment = {
        id: Date.now().toString(),
        application_id: selectedIpApp.id,
        comment: ipAppDetailNewComment.trim(),
        commenter_name: profile?.full_name || 'Admin',
        commenter_role: 'IP Committee',
        is_internal: false,
        created_at: new Date().toISOString()
      };
      setIpAppDetailComments(prev => [newComment, ...prev]);
      setIpAppDetailNewComment('');
      toast({ title: "Comment Posted", description: "Your comment has been added." });

      // Notify the faculty member about the comment
      try {
        const facultyId = selectedIpApp.faculty_id;
        if (facultyId) {
          await supabase.from('faculty_notifications').insert([{
            faculty_id: facultyId,
            application_id: selectedIpApp.id,
            notification_type: 'comment',
            title: 'New Comment on Your Application',
            message: `A reviewer commented on "${selectedIpApp.title || 'your application'}": "${ipAppDetailNewComment.trim().substring(0, 80)}${ipAppDetailNewComment.trim().length > 80 ? '...' : ''}"`,
            is_read: false
          }]);
        }
      } catch (notifErr) {
        console.warn('Could not send faculty notification:', notifErr);
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      toast({ title: "Error", description: "Failed to post comment.", variant: "destructive" });
    } finally {
      setIsSubmittingDetailComment(false);
    }
  };

  const getFilteredIpApplications = () => {
    return ipApplications.filter(app => {
      const matchesSearch = 
        app.title?.toLowerCase().includes(ipAppSearchTerm.toLowerCase()) ||
        app.applicant_full_name?.toLowerCase().includes(ipAppSearchTerm.toLowerCase()) ||
        app.faculty?.email?.toLowerCase().includes(ipAppSearchTerm.toLowerCase());
      
      const matchesStatus = ipAppStatusFilter === 'all' || app.status === ipAppStatusFilter;
      const matchesType = ipAppTypeFilter === 'all' || app.ip_type === ipAppTypeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  };

  const getPaginatedIpApplications = () => {
    const filtered = getFilteredIpApplications();
    const startIndex = (ipAppCurrentPage - 1) * ipAppsPerPage;
    return filtered.slice(startIndex, startIndex + ipAppsPerPage);
  };

  const getTotalIpAppPages = () => {
    return Math.ceil(getFilteredIpApplications().length / ipAppsPerPage);
  };

  // Load all activities for the modal (past logs)
  const loadAllActivities = async (filter: string = 'all') => {
    setActivityLoading(true);
    try {
      let query = supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply filter if not 'all'
      if (filter !== 'all') {
        query = query.eq('activity_type', filter);
      }
      
      const { data, error } = await query;

      if (error) {
        console.error('Error loading all activities:', error);
        setAllActivities([]);
      } else {
        // Map Supabase data to the expected format
        const mappedActivities = data?.map((activity: any) => ({
          id: activity.id,
          type: activity.activity_type,
          action: activity.action,
          title: activity.title,
          description: activity.description,
          timestamp: activity.created_at
        })) || [];
        setAllActivities(mappedActivities);
      }
    } catch (err) {
      console.error('Unexpected error loading all activities:', err);
      setAllActivities([]);
    } finally {
      setActivityLoading(false);
    }
  };

  // Handle opening the activity modal
  const handleViewAllActivities = () => {
    setShowActivityModal(true);
    loadAllActivities(activityFilter);
  };

  // Handle filter change
  const handleActivityFilterChange = (filter: string) => {
    setActivityFilter(filter);
    loadAllActivities(filter);
  };

  // Export activities to CSV
  const exportActivitiesToCSV = () => {
    if (allActivities.length === 0) {
      toast({ title: 'No activities to export', description: 'There are no activities to export.', variant: 'destructive' });
      return;
    }

    // CSV Header
    const headers = ['Date', 'Type', 'Action', 'Title', 'Description'];
    
    // CSV Rows
    const rows = allActivities.map(activity => [
      formatDate(activity.timestamp),
      activity.type,
      activity.action,
      activity.title,
      activity.description || ''
    ]);

    // Combine header and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `activity_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // News form state
  const [newsForm, setNewsForm] = useState({
    title: '',
    category: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    content: '',
    image: null as File | null,
    contentImages: [] as File[],
    youtubeUrl: ''
  });

  // Modal states
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);
  const [existingContentImages, setExistingContentImages] = useState<string[]>([]);

  // Delete confirmation dialog state
  const [showDeleteNewsDialog, setShowDeleteNewsDialog] = useState(false);
  const [deleteNewsTarget, setDeleteNewsTarget] = useState<{ id: string; title: string } | null>(null);

  const [events, setEvents] = useState<any[]>([]);
  const [archivedEvents, setArchivedEvents] = useState<any[]>([]);
  const [eventTab, setEventTab] = useState('active');
  const [eventSearchTerm, setEventSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
    
    // Event Registrations state
    const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
    const [selectedEventForRegistrations, setSelectedEventForRegistrations] = useState<any>(null);
    const [eventRegistrations, setEventRegistrations] = useState<any[]>([]);
    const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  // Archived Event Detail Modal state
  const [showArchivedEventDetailModal, setShowArchivedEventDetailModal] = useState(false);
  const [selectedArchivedEvent, setSelectedArchivedEvent] = useState<any>(null);

  // Event form state
  const [eventForm, setEventForm] = useState({
    id: null as number | null,
    title: '',
    type: 'workshop',
    date: '',
    time: '',
    location: '',
    capacity: '',
    description: '',
    image: null as File | null,
    registrationOpen: true
  });

  // User Management state
  const [users, setUsers] = useState<any[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userForm, setUserForm] = useState({
    full_name: '',
    email: '',
    password: '',
    department: '',
    employee_id: '',
    phone: '',
    role: 'faculty',
    status: 'active'
  });

  // Resource Management state
  const [resources, setResources] = useState<any[]>([]);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [editingResource, setEditingResource] = useState<any>(null);
  const [resourceTab, setResourceTab] = useState('templates');
  const [resourceSearchTerm, setResourceSearchTerm] = useState('');
  const [resourceForm, setResourceForm] = useState({
    id: null as string | null,
    title: '',
    slug: '',
    type: 'download' as 'article' | 'guide' | 'video' | 'download' | 'link',
    category: 'Templates',
    content: '',
    url: '',
    file_url: '',
    tags: [] as string[],
    published: true,
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  
  // Resource delete confirmation modal state
  const [showDeleteResourceModal, setShowDeleteResourceModal] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<{id: string, title: string} | null>(null);

  // Services management state
  const [services, setServices] = useState<any[]>([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [serviceForm, setServiceForm] = useState({
    id: null as string | null,
    name: '',
    description: '',
    icon: 'Wrench',
    order_num: 0,
    published: true,
    features: [] as string[],
    process_steps: [] as string[],
    timeline: '',
    pricing: ''
  });

  // Service Requests management
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [archivedRequests, setArchivedRequests] = useState<any[]>([]);
  const [serviceRequestTab, setServiceRequestTab] = useState('active');
  const [showServiceRequestModal, setShowServiceRequestModal] = useState(false);
  const [viewingServiceRequest, setViewingServiceRequest] = useState<any>(null);
  
  // Service Requests search and filter
  const [serviceRequestSearch, setServiceRequestSearch] = useState('');
  const [serviceRequestStatusFilter, setServiceRequestStatusFilter] = useState<string>('all');

  // Homepage content management
  const [homepageContent, setHomepageContent] = useState({
    id: null as string | null,
    heroTitle: "Accelerating Innovation Through Technology Transfer",
    heroSubtitle: "Bridging the gap between research and commercialization...",
    heroImage: null as string | null,
    patentsCount: 24,
    partnersCount: 50,
    startupsCount: 15,
    technologiesCount: 8,
    regionalImpact: "₱15M",
    successRate: "85%"
  });

  // Modal states for patent management
  const [showPatentModal, setShowPatentModal] = useState(false);
  const [editingPatent, setEditingPatent] = useState<any>(null);
  

  // Modal state for event management
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  // Load saved data on component mount from Supabase
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadHomepageContent(),
        loadNews(),
        loadDashboardStats(),
        loadServices(),
        loadServiceRequests(),
        loadEvents(),
        loadPatents(),
        loadUsers(),
        loadResources(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order_num', { ascending: true });
      
      if (data && !error) {
        setServices(data.map((service: any) => ({
          id: service.id,
          name: service.name,
          description: service.description,
          icon: service.icon,
          order_num: service.order_num,
          published: service.published,
          slug: service.slug,
          features: service.features || [],
          process_steps: service.process_steps || [],
          timeline: service.timeline || '',
          pricing: service.pricing || '',
        })));
      }
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const loadHomepageContent = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_homepage_content')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();
      
      if (data && !error) {
        const content = data as any;
        setHomepageContent({
          id: content.id,
          heroTitle: content.hero_title,
          heroSubtitle: content.hero_subtitle,
          heroImage: content.hero_image_url,
          patentsCount: content.patents_count,
          partnersCount: content.partners_count,
          startupsCount: content.startups_count,
          technologiesCount: content.technologies_count,
          regionalImpact: content.regional_impact || "₱15M",
          successRate: content.success_rate || "85%",
        });
      }
    } catch (error) {
      console.error('Error loading homepage content:', error);
    }
  };

  const loadNews = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_news')
        .select('*')
        .order('date', { ascending: false });
      
      if (data && !error) {
        const mappedNews = data.map((article: any) => ({
          id: article.id,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          author: article.author,
          status: article.status,
          date: article.date,
          image: article.cover_image_url,
          archived: article.archived || false,
          published: article.published || false,
          content_images: article.content_images || [],
          youtube_url: article.youtube_url || '',
        }));
        
        // Separate into three categories
        const published = mappedNews.filter((article: any) => !article.archived && article.status === 'Published');
        const drafts = mappedNews.filter((article: any) => !article.archived && article.status === 'Draft');
        const archived = mappedNews.filter((article: any) => article.archived);
        
        setNews(published);
        setDraftNews(drafts);
        setArchivedNews(archived);
      }
    } catch (error) {
      console.error('Error loading news:', error);
    }
  };

  const handleArchiveNews = async (newsId: string, archive: boolean = true) => {
    try {
      const { error } = await supabase
        .from('admin_news')
        .update({ archived: archive })
        .eq('id', newsId);
      
      if (error) throw error;
      
      // Reload news to reflect changes
      await loadNews();
      // Note: Activity is logged automatically by database trigger
    } catch (error) {
      console.error('Error archiving/restoring news:', error);
      toast({ title: 'Error', description: 'Failed to update news status.', variant: 'destructive' });
    }
  };

  const loadDashboardStats = async () => {
    try {
      // Try to get real-time stats from the database function
      const { data, error } = await supabase
        .rpc('get_dashboard_stats');
      
      if (data && !error) {
        const stats = data[0] as any;
        setDashboardStats({
          totalPatents: stats.total_patents,
          patentsThisMonth: stats.patents_this_month,
          publishedNews: stats.published_news,
          newsThisWeek: stats.news_this_week,
          upcomingEvents: stats.upcoming_events,
          nextEventDate: stats.next_event_date,
          serviceRequests: stats.service_requests_count,
          pendingRequests: stats.pending_requests,
        });
        // Also load licensed revenue
        if (stats.licensed_revenue !== undefined) {
          setLicensedRevenue(String(stats.licensed_revenue));
        }
      } else {
        // Fallback to static table if RPC fails
        const { data: staticData, error: staticError } = await supabase
          .from('admin_dashboard_stats')
          .select('*')
          .order('id', { ascending: true })
          .limit(1);
        
        if (staticData && !staticError) {
          const stats = staticData as any;
          setDashboardStats({
            totalPatents: stats.total_patents,
            patentsThisMonth: stats.patents_this_month,
            publishedNews: stats.published_news,
            newsThisWeek: stats.news_this_week,
            upcomingEvents: stats.upcoming_events,
            nextEventDate: stats.next_event_date,
            serviceRequests: stats.service_requests_count,
            pendingRequests: stats.pending_requests,
          });
          // Also load licensed revenue
          if (stats.licensed_revenue !== undefined) {
            setLicensedRevenue(String(stats.licensed_revenue));
          }
        }
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const loadServiceRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_service_requests')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (data && !error) {
        const mappedRequests = data.map((req: any) => ({
          id: req.id,
          name: req.name,
          email: req.email,
          phone: req.phone,
          organization: req.organization,
          service: req.service_type,
          serviceTitle: req.service_title,
          preferredDate: req.preferred_date,
          participants: req.participants,
          specificNeeds: req.specific_needs,
          budget: req.budget,
          timeline: req.timeline,
          status: req.status,
          submittedAt: req.submitted_at,
          archived: req.archived || false,
        }));
        
        // Separate active and archived requests
        const active = mappedRequests.filter((req: any) => !req.archived && !['Completed', 'Done'].includes(req.status));
        const archived = mappedRequests.filter((req: any) => req.archived || ['Completed', 'Done'].includes(req.status));
        
        setServiceRequests(active);
        setArchivedRequests(archived);
      }
    } catch (error) {
      console.error('Error loading service requests:', error);
    }
  };

  const handleArchiveRequest = async (requestId: string, archive: boolean = true) => {
    try {
      const { error } = await supabase
        .from('admin_service_requests')
        .update({ archived: archive })
        .eq('id', requestId);
      
      if (error) throw error;
      
      // Reload service requests to reflect changes
      await loadServiceRequests();
      // Note: Activity is logged automatically by database trigger
    } catch (error) {
      console.error('Error archiving/restoring request:', error);
      toast({ title: 'Error', description: 'Failed to update request status.', variant: 'destructive' });
    }
  };

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_events')
        .select('*')
        .order('date', { ascending: true });
      
      if (data && !error) {
        const mappedEvents = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          type: event.type,
          date: event.date,
          time: event.time,
          location: event.location,
          capacity: event.capacity,
          description: event.description,
          registrationOpen: event.registration_open,
          status: event.status,
          attendees: event.attendees_count,
          image: event.image_url,
          archived: event.archived || false,
        }));
        
        // Separate active and archived events
        const today = new Date().toISOString().split('T')[0];
        const active = mappedEvents.filter((event: any) => {
          // Active if not archived, date is today or future, and status is not Completed/Cancelled
          return !event.archived && 
                 event.date >= today && 
                 !['Completed', 'Cancelled'].includes(event.status);
        });
        const archived = mappedEvents.filter((event: any) => {
          // Archived if explicitly archived, date is past, or status is Completed/Cancelled
          return event.archived || 
                 event.date < today || 
                 ['Completed', 'Cancelled'].includes(event.status);
        });
        
        setEvents(active);
        setArchivedEvents(archived);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const handleArchiveEvent = async (eventId: string, archive: boolean = true) => {
    try {
      const { error } = await supabase
        .from('admin_events')
        .update({ archived: archive })
        .eq('id', eventId);
      
      if (error) throw error;
      
      // Reload events to reflect changes
      await loadEvents();
      // Note: Activity is logged automatically by database trigger
    } catch (error) {
      console.error('Error archiving/restoring event:', error);
      toast({ title: 'Error', description: 'Failed to update event status.', variant: 'destructive' });
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data && !error) {
        setUsers(data.map((user: any) => ({
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          department: user.department,
          employee_id: user.employee_id,
          phone: user.phone,
          role: user.role,
          status: user.status,
          created_at: user.created_at,
        })));
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadPatents = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_patents')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setPatents(data.map((patent: any) => ({
          id: patent.id,
          title: patent.title,
          patentId: patent.patent_number,
          inventors: patent.inventors,
          field: patent.field,
          description: patent.description,
          abstract: patent.abstract,
          status: patent.status,
          year: patent.year,
          file_url: patent.file_url,
          file_name: patent.file_name,
          files: patent.files || [], // Array of all attached files
        })));
      }
    } catch (error) {
      console.error('Error loading patents:', error);
    }
  };

  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data && !error) {
        setResources(data.map((resource: any) => ({
          id: resource.id,
          title: resource.title,
          slug: resource.slug,
          type: resource.type,
          category: resource.category || 'Guidelines',
          content: resource.content,
          url: resource.url,
          file_url: resource.file_url,
          tags: resource.tags || [],
          published: resource.published,
          created_at: resource.created_at,
          updated_at: resource.updated_at,
        })));
      }
    } catch (error) {
      console.error('Error loading resources:', error);
    }
  };


    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      // Determine email to use for login
      // Special case: "admin" username maps to the default admin email for backward compatibility
      let email = loginData.username;
      if (loginData.username.toLowerCase() === 'admin') {
        // For the special "admin" username, we need to find the admin user's email
        const { data: adminProfile, error: adminError } = await supabase
          .from('user_profiles')
          .select('email')
          .eq('role', 'admin')
          .limit(1)
          .single();
        
        if (adminError || !adminProfile) {
          setLoginError('No admin user found. Please create an admin user first.');
          setLoginLoading(false);
          return;
        }
        email = adminProfile.email;
      }

      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: loginData.password,
      });

      if (authError) {
        console.error('Auth error:', authError);
        if (authError.message.includes('Invalid login credentials')) {
          setLoginError('Invalid email/username or password.');
        } else if (authError.message.includes('Email not confirmed')) {
          setLoginError('Please check your email and confirm your account first.');
        } else {
          setLoginError(authError.message);
        }
        setLoginLoading(false);
        return;
      }

      if (authData.user) {
        // Check if user has admin or faculty role
        // First try to get from user_profiles
        let profile = null;
        let profileError = null;
        
        try {
          const result = await supabase
            .from('user_profiles')
            .select('role, status')
            .eq('id', authData.user.id)
            .single();
          profile = result.data;
          profileError = result.error;
        } catch (err) {
          console.error('Profile query error:', err);
          profileError = err;
        }

        // If profile doesn't exist or query failed, try to get role from auth metadata
        if (profileError || !profile) {
          console.log('Profile not found in user_profiles, checking auth metadata...');
          
          // Get role from auth metadata as fallback
          const authRole = authData.user.user_metadata?.role;
          const authFullName = authData.user.user_metadata?.full_name;
          
          if (authRole === 'admin' || authRole === 'faculty') {
            // Try to create/update the profile
            console.log('Creating profile from auth metadata...');
            const { error: upsertError } = await supabase
              .from('user_profiles')
              .upsert({
                id: authData.user.id,
                full_name: authFullName || email,
                email: email,
                role: authRole,
                status: 'active'
              });
            
            if (upsertError) {
              console.error('Error creating profile:', upsertError);
              // Still allow login if role is in metadata
              setIsLoggedIn(true);
              setLoginData({ username: "", password: "" });
              return;
            }
            
            profile = { role: authRole, status: 'active' };
          } else {
            console.error('Profile error:', profileError);
            setLoginError('Your account does not have admin or faculty access. Please contact an administrator.');
            await supabase.auth.signOut();
            setLoginLoading(false);
            return;
          }
        }

        if (!profile || (profile.role !== 'admin' && profile.role !== 'faculty')) {
          setLoginError('Access denied. Only admin and faculty users can access this panel.');
          await supabase.auth.signOut();
          setLoginLoading(false);
          return;
        }

        if (profile.status === 'inactive') {
          setLoginError('Your account is inactive. Please contact an administrator.');
          await supabase.auth.signOut();
          setLoginLoading(false);
          return;
        }

        // Login successful - redirect based on role
        if (profile.role === 'faculty') {
          // Redirect faculty to faculty dashboard
          navigate('/faculty');
          return;
        }
        
        // Admin stays on admin page
        setIsLoggedIn(true);
        setCurrentUserRole(profile.role);
        setLoginData({ username: "", password: "" });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle homepage content update
  const handleHomepageUpdate = async () => {
    const heroTitle = (document.getElementById('hero-title') as HTMLInputElement)?.value;
    const heroSubtitle = (document.getElementById('hero-subtitle') as HTMLTextAreaElement)?.value;
    const heroImageInput = document.getElementById('hero-image') as HTMLInputElement;
    
    if (heroTitle && heroSubtitle) {
      let heroImageUrl = homepageContent.heroImage; // Keep existing image if no new one
      
      // Handle image upload if a new file is selected
      if (heroImageInput?.files && heroImageInput.files[0]) {
        const file = heroImageInput.files[0];
        
        // Convert image to base64 for storage
        const reader = new FileReader();
        reader.onload = async (e) => {
          heroImageUrl = e.target?.result as string;
          
          const updatedContent = {
            ...(homepageContent.id ? { id: homepageContent.id } : {}),
            hero_title: heroTitle,
            hero_subtitle: heroSubtitle,
            hero_image_url: heroImageUrl,
            patents_count: homepageContent.patentsCount,
            partners_count: homepageContent.partnersCount,
            startups_count: homepageContent.startupsCount,
            technologies_count: homepageContent.technologiesCount,
          };
          
          const { error } = await supabase
            .from('admin_homepage_content')
            .upsert(updatedContent);
          
          if (error) {
            console.error('Error updating homepage:', error);
            toast({ title: 'Error', description: 'Error updating homepage content', variant: 'destructive' });
            return;
          }
          
          setHomepageContent({
            ...homepageContent,
            heroTitle,
            heroSubtitle,
            heroImage: heroImageUrl
          });
          
          window.dispatchEvent(new Event('storage'));
          toast({ title: 'Success', description: 'Homepage content and image updated successfully!' });
        };
        reader.readAsDataURL(file);
      } else {
        const updatedContent = {
          ...(homepageContent.id ? { id: homepageContent.id } : {}),
          hero_title: heroTitle,
          hero_subtitle: heroSubtitle,
          hero_image_url: heroImageUrl,
          patents_count: homepageContent.patentsCount,
          partners_count: homepageContent.partnersCount,
          startups_count: homepageContent.startupsCount,
          technologies_count: homepageContent.technologiesCount,
        };
        
        const { error } = await supabase
          .from('admin_homepage_content')
          .upsert(updatedContent);
        
        if (error) {
          console.error('Error updating homepage:', error);
          toast({ title: 'Error', description: 'Error updating homepage content', variant: 'destructive' });
          return;
        }
        
        setHomepageContent({
          ...homepageContent,
          heroTitle,
          heroSubtitle
        });
        
        window.dispatchEvent(new Event('storage'));
        toast({ title: 'Success', description: 'Homepage content updated successfully!' });
      }
    } else {
      toast({ title: 'Validation Error', description: 'Please fill in both title and subtitle fields.', variant: 'destructive' });
    }
  };

  // Handle impact statistics update
  const handleImpactStatsUpdate = async () => {
    const patentsValue = (document.getElementById('stat-patents') as HTMLInputElement)?.value || homepageContent.patentsCount + '+';
    const partnersValue = (document.getElementById('stat-partners') as HTMLInputElement)?.value || homepageContent.partnersCount + '+';
    const technologiesValue = (document.getElementById('stat-technologies') as HTMLInputElement)?.value || homepageContent.technologiesCount + '+';

    // Parse numeric values (remove + and currency symbols for storage)
    const patentsCount = parseInt(patentsValue.replace(/[^0-9]/g, '')) || homepageContent.patentsCount;
    const partnersCount = parseInt(partnersValue.replace(/[^0-9]/g, '')) || homepageContent.partnersCount;
    const technologiesCount = parseInt(technologiesValue.replace(/[^0-9]/g, '')) || homepageContent.technologiesCount;

    const updatedContent = {
      ...(homepageContent.id ? { id: homepageContent.id } : {}),
      hero_title: homepageContent.heroTitle,
      hero_subtitle: homepageContent.heroSubtitle,
      hero_image_url: homepageContent.heroImage,
      patents_count: patentsCount,
      partners_count: partnersCount,
      technologies_count: technologiesCount,
    };

    const { error } = await supabase
      .from('admin_homepage_content')
      .upsert(updatedContent);

    if (error) {
      console.error('Error updating statistics:', error);
      toast({ title: 'Error', description: 'Error updating statistics', variant: 'destructive' })
      return;
    }

    setHomepageContent({
      ...homepageContent,
      patentsCount,
      partnersCount,
      technologiesCount,
    });

    window.dispatchEvent(new Event('storage'));
    toast({ title: 'Success', description: 'Impact statistics updated successfully!' });
  };

  // Activity logging function
  const logActivity = async (type: string, action: string, title: string) => {
    try {
      // Insert the activity into Supabase
      const { data, error } = await supabase
        .from('activity_logs')
        .insert([{
          activity_type: type,
          action,
          title,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error logging activity:', error);
        // Fallback: still update local state
        const newActivity = {
          id: Date.now(),
          type,
          action,
          title,
          timestamp: new Date().toISOString()
        };
        const updatedActivity = [newActivity, ...recentActivity.slice(0, 9)]; // Keep last 10 activities
        setRecentActivity(updatedActivity);
      } else {
        // Successfully added to Supabase, update local state with the new activity
        const newActivity = {
          id: (data as any).id,
          type: (data as any).activity_type,
          action: (data as any).action,
          title: (data as any).title,
          timestamp: (data as any).created_at
        };
        const updatedActivity = [newActivity, ...recentActivity.slice(0, 9)]; // Keep last 10 activities
        setRecentActivity(updatedActivity);
      }
    } catch (err) {
      console.error('Unexpected error logging activity:', err);
      // Fallback: still update local state
      const newActivity = {
        id: Date.now(),
        type,
        action,
        title,
        timestamp: new Date().toISOString()
      };
      const updatedActivity = [newActivity, ...recentActivity.slice(0, 9)]; // Keep last 10 activities
      setRecentActivity(updatedActivity);
    }
  };

  // Update dashboard stats
  const updateDashboardStats = async (updates: any) => {
    const updatedStats = { ...dashboardStats, ...updates };
    setDashboardStats(updatedStats);
    
    try {
      // Get the existing row ID to prevent creating duplicates
      const { data: rowData, error: rowError } = await supabase
        .from('admin_dashboard_stats')
        .select('id')
        .order('id', { ascending: true })
        .limit(1);
      
      if (rowError || !rowData || rowData.length === 0) {
        console.error('No dashboard stats row found for update');
        return;
      }
      
      const rowId = (rowData[0] as any).id;
      
      const { error } = await supabase
        .from('admin_dashboard_stats')
        .update({
          total_patents: updatedStats.totalPatents,
          patents_this_month: updatedStats.patentsThisMonth,
          published_news: updatedStats.publishedNews,
          news_this_week: updatedStats.newsThisWeek,
          upcoming_events: updatedStats.upcomingEvents,
          next_event_date: updatedStats.nextEventDate,
          service_requests_count: updatedStats.serviceRequests,
          pending_requests: updatedStats.pendingRequests,
        })
        .eq('id', rowId);
      
      if (error) {
        console.error('Error updating dashboard stats:', error);
      }
    } catch (err) {
      console.error('Error in updateDashboardStats:', err);
    }
  };

  // News Management Functions
  const handlePublishNews = async () => {
    if (!newsForm.title || !newsForm.content || !newsForm.category) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields (Title, Content, Category).', variant: 'destructive' });
      return;
    }

    try {
    let imageUrl = null;
    
    if (newsForm.image) {
      try {
        const reader = new FileReader();
        imageUrl = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(newsForm.image!);
        });
      } catch (error) {
        console.error('Failed to process image:', error);
        toast({ title: 'Warning', description: 'Failed to process image. Article will be saved without image.', variant: 'destructive' });
      }
    }

    // Process content images - merge new uploads with existing ones when editing
    let contentImageUrls: string[] = [...existingContentImages];
    if (newsForm.contentImages.length > 0) {
      try {
        const newImageUrls = await Promise.all(
          newsForm.contentImages.map(file => {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
          })
        );
        contentImageUrls = [...contentImageUrls, ...newImageUrls];
      } catch (error) {
        console.error('Failed to process content images:', error);
        toast({ title: 'Warning', description: 'Failed to process some content images.', variant: 'destructive' });
      }
    }

    const newsData = {
      title: newsForm.title,
      excerpt: newsForm.excerpt,
      content: newsForm.content,
      category: newsForm.category,
      author: newsForm.author,
      date: newsForm.date,
      cover_image_url: imageUrl,
      content_images: contentImageUrls,
      youtube_url: newsForm.youtubeUrl || null,
      status: 'Published',
      published: true,
      tags: [newsForm.category, 'USTP', 'News'],
    };

    if (editingNews) {
      const { error } = await supabase
        .from('admin_news')
        .update(newsData)
        .eq('id', editingNews.id);
      
      if (error) {
        console.error('Error updating news:', JSON.stringify(error, null, 2));
        toast({ title: 'Error', description: `Error updating news: ${error.message} (Code: ${error.code})`, variant: 'destructive' })
        return;
      }
      // Note: Activity is logged automatically by database trigger
      loadNews();
    } else {
      const { error } = await supabase
        .from('admin_news')
        .insert([newsData]);
      
      if (error) {
        console.error('Error creating news:', JSON.stringify(error, null, 2));
        toast({ title: 'Error', description: `Error creating news: ${error.message} (Code: ${error.code})`, variant: 'destructive' })
        return;
      }
      // Note: Activity is logged automatically by database trigger
      loadNews()
      
      await updateDashboardStats({
        publishedNews: dashboardStats.publishedNews + 1,
        newsThisWeek: dashboardStats.newsThisWeek + 1
      });
    }

    setNewsForm({
      title: '',
      category: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      excerpt: '',
      content: '',
      image: null,
      contentImages: [],
      youtubeUrl: ''
    });
    setExistingContentImages([]);
    
    setShowNewsModal(false);
    setEditingNews(null);
    
    toast({ title: 'Success', description: `News article ${editingNews ? 'updated' : 'published'} successfully!` })
    } catch (error: any) {
      console.error('Unexpected error in handlePublishNews:', error);
      toast({ title: 'Error', description: `Unexpected error: ${error?.message || 'Unknown error'}`, variant: 'destructive' });
    }
  };

  const handleSaveDraft = async () => {
    if (!newsForm.title || !newsForm.content) {
      toast({ title: 'Notice', description: 'Please fill in Title and Content to save as draft.' })
      return;
    }

    try {
    let imageUrl = null;
    
    if (newsForm.image) {
      try {
        const reader = new FileReader();
        imageUrl = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(newsForm.image!);
        });
      } catch (error) {
        console.error('Failed to process image:', error);
        toast({ title: 'Warning', description: 'Failed to process image. Article will be saved without image.', variant: 'destructive' });
      }
    }

    // Process content images - merge new uploads with existing ones when editing
    let contentImageUrls: string[] = [...existingContentImages];
    if (newsForm.contentImages.length > 0) {
      try {
        const newImageUrls = await Promise.all(
          newsForm.contentImages.map(file => {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
          })
        );
        contentImageUrls = [...contentImageUrls, ...newImageUrls];
      } catch (error) {
        console.error('Failed to process content images:', error);
        toast({ title: 'Warning', description: 'Failed to process some content images.', variant: 'destructive' });
      }
    }

    const newsData = {
      title: newsForm.title,
      excerpt: newsForm.excerpt,
      content: newsForm.content,
      category: newsForm.category,
      author: newsForm.author,
      date: newsForm.date,
      cover_image_url: imageUrl,
      content_images: contentImageUrls,
      youtube_url: newsForm.youtubeUrl || null,
      status: 'Draft',
      published: false,
      tags: [newsForm.category || 'News', 'USTP', 'Draft'],
    };

    if (editingNews) {
      const { error } = await supabase
        .from('admin_news')
        .update(newsData)
        .eq('id', editingNews.id);
      
      if (error) {
        console.error('Error updating draft:', JSON.stringify(error, null, 2));
        toast({ title: 'Error', description: `Error saving draft: ${error.message} (Code: ${error.code})`, variant: 'destructive' });
        return;
      }
      // Note: Activity is logged automatically by database trigger
    } else {
      const { error } = await supabase
        .from('admin_news')
        .insert([newsData]);
      
      if (error) {
        console.error('Error saving draft:', JSON.stringify(error, null, 2));
        toast({ title: 'Error', description: `Error saving draft: ${error.message} (Code: ${error.code})`, variant: 'destructive' });
        return;
      }
      // Note: Activity is logged automatically by database trigger
    }

    loadNews();

    setNewsForm({
      title: '',
      category: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      excerpt: '',
      content: '',
      image: null,
      contentImages: [],
      youtubeUrl: ''
    });
    setExistingContentImages([]);
    
    setShowNewsModal(false);
    setEditingNews(null);
      
    toast({ title: 'Success', description: 'News article saved as draft successfully!' });
    } catch (error: any) {
      console.error('Unexpected error in handleSaveDraft:', error);
      toast({ title: 'Error', description: `Unexpected error: ${error?.message || 'Unknown error'}`, variant: 'destructive' });
    }
  };

  const handleEditNews = (article: any) => {
    setEditingNews(article);
    setNewsForm({
      title: article.title,
      category: article.category,
      author: article.author,
      date: article.date,
      excerpt: article.excerpt,
      content: article.content,
      image: null,
      contentImages: [],
      youtubeUrl: article.youtube_url || ''
    });
    // Store existing content images for display
    setExistingContentImages(article.content_images || []);
    setShowNewsModal(true);
  };

  // News duplication function
  const handleDuplicateNews = (article: any) => {
    setEditingNews(null);
    setNewsForm({
      title: `${article.title} (Copy)`,
      category: article.category,
      author: article.author,
      date: new Date().toISOString().split('T')[0],
      excerpt: article.excerpt,
      content: article.content,
      image: null,
      contentImages: [],
      youtubeUrl: article.youtube_url || ''
    });
    
    // Scroll to the form
    const formElement = document.getElementById('news-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    toast({ title: 'Info', description: `Article duplicated! You can now edit the copy of "${article.title}" and save it as a new article.` });
  };

  const handleDeleteNews = (articleId: string, title: string) => {
    setDeleteNewsTarget({ id: articleId, title });
    setShowDeleteNewsDialog(true);
  };

  const confirmDeleteNews = async () => {
    if (!deleteNewsTarget) return;
    const articleId = deleteNewsTarget.id;
    const title = deleteNewsTarget.title;
    const article = news.find(a => a.id === articleId);
    const wasPublished = article?.status === 'Published';
    
    const { error } = await supabase
      .from('admin_news')
      .delete()
      .eq('id', articleId);
    
    if (error) {
      console.error('Error deleting news:', error);
      toast({ title: 'Error', description: `Error deleting news article: ${error.message}`, variant: 'destructive' })
      return;
    }
    
    loadNews();
    // Note: Activity is logged automatically by database trigger
    
    if (wasPublished) {
      await updateDashboardStats({
        publishedNews: Math.max(0, dashboardStats.publishedNews - 1)
      });
    }
    
    toast({ title: 'Success', description: `Article "${title}" has been deleted successfully!` })
    
    if (editingNews && editingNews.id === articleId) {
      setEditingNews(null);
      setNewsForm({
        title: '',
        category: '',
        author: '',
        date: new Date().toISOString().split('T')[0],
        excerpt: '',
        content: '',
        image: null,
        contentImages: [],
        youtubeUrl: ''
      });
    }

    setShowDeleteNewsDialog(false);
    setDeleteNewsTarget(null);
  };

  // Handle saving a new patent
  const handleSavePatent = async () => {
    if (!patentForm.title || !patentForm.field) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields (Title, Field).', variant: 'destructive' });
      return;
    }

    setUploadingPatent(true);
    let fileUrl = null;
    let fileName = null;

    try {
      // Upload all files to Supabase Storage and collect URLs
      const uploadedFiles: { url: string; name: string }[] = [];
      
      if (patentFiles.length > 0) {
        for (const file of patentFiles) {
          const fileExt = file.name.split('.').pop();
          const filePath = `patents/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('patent-files')
            .upload(filePath, file);

          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            toast({ title: 'Error', description: 'Failed to upload file: ' + uploadError.message, variant: 'destructive' });
            setUploadingPatent(false);
            return;
          }

          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('patent-files')
            .getPublicUrl(filePath);

          uploadedFiles.push({ url: publicUrl, name: file.name });
        }
        
        // First file is the primary file
        fileUrl = uploadedFiles[0]?.url || null;
        fileName = uploadedFiles[0]?.name || null;
      }

      const patentData = {
        title: patentForm.title,
        patent_number: patentForm.patentId,
        inventors: patentForm.inventors,
        field: patentForm.field,
        description: patentForm.description,
        abstract: patentForm.abstract,
        status: patentForm.status || 'Filed',
        year: patentForm.year || new Date().getFullYear().toString(),
        published: true,
        file_url: fileUrl,
        file_name: fileName,
        files: uploadedFiles.length > 0 ? uploadedFiles : null, // Store all files as JSON
      };

      const { error } = await supabase
        .from('admin_patents')
        .insert([patentData]);

      if (error) {
        console.error('Error creating patent:', error);
        toast({ title: 'Error', description: 'Error creating patent: ' + error.message, variant: 'destructive' });
        return;
      }

      loadPatents();
      window.dispatchEvent(new Event('storage'));

      // Reset form and file states
      setPatentForm({
        title: '',
        patentId: '',
        inventors: '',
        field: '',
        description: '',
        abstract: '',
        status: 'Filed',
        year: new Date().getFullYear().toString()
      });
      setPatentFiles([]);

      toast({ title: 'Success', description: 'Patent saved successfully!' });
    } catch (error) {
      console.error('Error saving patent:', error);
      toast({ title: 'Error', description: 'Failed to save patent. Please try again.', variant: 'destructive' });
    } finally {
      setUploadingPatent(false);
    }
  };

  // Handle editing a patent
  const handleEditPatent = (patent: any) => {
    setEditingPatent(patent);
    setPatentEditForm({
      title: patent.title,
      patentId: patent.patentId || '',
      inventors: patent.inventors || '',
      field: patent.field,
      description: patent.description || '',
      abstract: patent.abstract || '',
      status: patent.status || 'Filed',
      year: patent.year || new Date().getFullYear().toString(),
      file_url: patent.file_url || '',
      file_name: patent.file_name || '',
      files: patent.files || []
    });
    // Reset file management states
    setPatentEditNewFiles([]);
    setPatentEditFilesToDelete([]);
    setShowPatentModal(true);
  };

  // Handle updating a patent
  const handleUpdatePatent = async () => {
    if (!patentEditForm.title || !patentEditForm.field) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields (Title, Field).', variant: 'destructive' });
      return;
    }

    setUploadingPatent(true);
    
    try {
      // Start with existing files (excluding those marked for deletion)
      let updatedFiles = patentEditForm.files.filter(f => !patentEditFilesToDelete.includes(f.url));
      
      // Delete files marked for deletion from storage
      for (const fileUrl of patentEditFilesToDelete) {
        const filePathMatch = fileUrl.match(/patent-files\/(.+)$/);
        if (filePathMatch) {
          await supabase.storage.from('patent-files').remove([filePathMatch[1]]);
        }
      }

      // Upload new files
      for (const file of patentEditNewFiles) {
        const fileExt = file.name.split('.').pop();
        const filePath = `patents/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('patent-files')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          toast({ title: 'Error', description: 'Failed to upload file: ' + uploadError.message, variant: 'destructive' });
          setUploadingPatent(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('patent-files')
          .getPublicUrl(filePath);

        updatedFiles.push({ url: publicUrl, name: file.name });
      }

      // Primary file is the first one (for backward compatibility)
      const primaryFile = updatedFiles[0];

      const patentData = {
        title: patentEditForm.title,
        patent_number: patentEditForm.patentId,
        inventors: patentEditForm.inventors,
        field: patentEditForm.field,
        description: patentEditForm.description,
        abstract: patentEditForm.abstract,
        status: patentEditForm.status,
        year: patentEditForm.year,
        // Publish on save. Bulk-uploaded patents start with published=false;
        // saving the edit form is the admin's explicit acknowledgement that
        // the record is ready for the public IP Portfolio. This also matches
        // the single-patent create flow, which always inserts published=true.
        published: true,
        file_url: primaryFile?.url || null,
        file_name: primaryFile?.name || null,
        files: updatedFiles.length > 0 ? updatedFiles : null,
      };

      const { error } = await supabase
        .from('admin_patents')
        .update(patentData)
        .eq('id', editingPatent.id);
      
      if (error) {
        console.error('Error updating patent:', error);
        toast({ title: 'Error', description: 'Error updating patent', variant: 'destructive' })
        return;
      }

      // Saving counts as the admin acknowledging the bulk-uploaded patent.
      // Drop it from the "needs review" set so the indicator goes away.
      setRecentBulkPatentIds(prev => prev.filter(id => id !== editingPatent.id));

      loadPatents();
      window.dispatchEvent(new Event('storage'));
      
      setShowPatentModal(false);
      setEditingPatent(null);
      setPatentEditNewFiles([]);
      setPatentEditFilesToDelete([]);
      setPatentEditForm({
        title: '',
        patentId: '',
        inventors: '',
        field: '',
        description: '',
        abstract: '',
        status: 'Filed',
        year: new Date().getFullYear().toString(),
        file_url: '',
        file_name: '',
        files: []
      });
      
      toast({ title: 'Success', description: 'Patent updated successfully!' })
    } catch (err) {
      console.error('Error in update:', err);
      toast({ title: 'Error', description: 'An unexpected error occurred', variant: 'destructive' })
    } finally {
      setUploadingPatent(false);
    }
  };

  // Handle saving licensed revenue
  const handleSaveRevenue = async () => {
    const revenue = parseFloat(licensedRevenue);
    if (isNaN(revenue) || revenue < 0) {
      toast({ title: 'Error', description: 'Please enter a valid revenue amount', variant: 'destructive' });
      return;
    }
    setSavingRevenue(true);
    try {
      // Get the first row's ID to ensure we update the correct row
      const { data: rowData, error: rowError } = await supabase
        .from('admin_dashboard_stats')
        .select('id, licensed_revenue')
        .order('id', { ascending: true })
        .limit(1);
      
      if (rowError || !rowData || rowData.length === 0) {
        toast({ title: 'Error', description: 'No dashboard stats row found. Please ensure dashboard data is seeded.', variant: 'destructive' });
        return;
      }
      
      const rowId = (rowData[0] as any).id;
      
      // Update licensed_revenue directly on the specific row
      const { error } = await supabase
        .from('admin_dashboard_stats')
        .update({ licensed_revenue: revenue })
        .eq('id', rowId);
      
      if (error) {
        console.error('Error updating revenue:', error);
        toast({ title: 'Error', description: 'Failed to save revenue: ' + error.message, variant: 'destructive' });
        return;
      }
      
      // Verify the save by re-reading the value from the same row
      const { data: verifyData, error: verifyError } = await supabase
        .from('admin_dashboard_stats')
        .select('licensed_revenue')
        .eq('id', rowId)
        .single();
      
      if (!verifyError && verifyData) {
        const saved = Number((verifyData as any).licensed_revenue);
        setLicensedRevenue(String(saved));
        if (saved !== revenue) {
          toast({ title: 'Warning', description: `Value may not have saved correctly. Database shows ₱${saved.toLocaleString()} instead of ₱${revenue.toLocaleString()}.`, variant: 'destructive' });
          setSavingRevenue(false);
          return;
        }
      }
      
      toast({ title: 'Success', description: `Licensed revenue saved: ₱${revenue.toLocaleString()}` });
    } catch (err) {
      console.error('Error saving revenue:', err);
      toast({ title: 'Error', description: 'An unexpected error occurred', variant: 'destructive' });
    } finally {
      setSavingRevenue(false);
    }
  };

  // Handle deleting a patent
  const handleDeletePatent = async (patentId: string, title: string) => {
    if (confirm(`Are you sure you want to delete the patent "${title}"? This action cannot be undone.`)) {
      const { error } = await supabase
        .from('admin_patents')
        .delete()
        .eq('id', patentId);
      
      if (error) {
        console.error('Error deleting patent:', error);
        toast({ title: 'Error', description: 'Error deleting patent', variant: 'destructive' })
        return;
      }
      
      loadPatents();
      window.dispatchEvent(new Event('storage'));
      // Note: Activity is logged automatically by database trigger
      toast({ title: 'Success', description: `Patent "${title}" has been deleted successfully!` })
    }
  };

  // Patent CSV Download Functions
  const patentFields = [
    { key: 'title', label: 'Title', default: true },
    { key: 'patentId', label: 'Patent ID', default: true },
    { key: 'inventors', label: 'Inventors', default: true },
    { key: 'field', label: 'Field', default: true },
    { key: 'status', label: 'Status', default: true },
    { key: 'year', label: 'Year', default: true },
    { key: 'description', label: 'Description', default: false },
    { key: 'abstract', label: 'Abstract', default: false },
    { key: 'fileCount', label: 'File Count', default: false },
    { key: 'fileNames', label: 'File Names', default: false },
  ];

  const handleDownloadCSV = () => {
    // Filter patents based on current search/filter
    const filteredPatents = patents.filter((patent) => {
      const matchesSearch = !patentSearchTerm || 
        patent.title?.toLowerCase().includes(patentSearchTerm.toLowerCase()) ||
        patent.patentId?.toLowerCase().includes(patentSearchTerm.toLowerCase()) ||
        patent.inventors?.toLowerCase().includes(patentSearchTerm.toLowerCase());
      
      const matchesField = patentFieldFilter === 'all' || 
        patent.field?.toLowerCase() === patentFieldFilter.toLowerCase();
      
      return matchesSearch && matchesField;
    });

    // Further filter to only selected patents if in selected mode
    const patentsToExport = patentExportMode === 'selected' 
      ? filteredPatents.filter(p => selectedPatentsForExport.includes(p.id))
      : filteredPatents;

    if (patentsToExport.length === 0) {
      toast({ title: 'Validation Error', description: patentExportMode === 'selected' ? 'No patents selected for export.' : 'No patents to download based on current filters.', variant: 'destructive' })
      return;
    }

    // Create CSV header
    const headers = selectedPatentFields.map(field => {
      const fieldConfig = patentFields.find(f => f.key === field);
      return fieldConfig?.label || field;
    });

    // Create CSV rows
    const rows = patentsToExport.map(patent => {
      return selectedPatentFields.map(field => {
        let value;
        
        // Handle special fields for file information
        if (field === 'fileCount') {
          value = patent.files?.length || (patent.file_url ? 1 : 0);
        } else if (field === 'fileNames') {
          if (patent.files && patent.files.length > 0) {
            value = patent.files.map((f: any) => f.name).join('; ');
          } else if (patent.file_name) {
            value = patent.file_name;
          } else {
            value = '';
          }
        } else {
          value = patent[field];
        }
        
        // Escape quotes and wrap in quotes if contains comma
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
    });

    // Combine header and rows
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `patents_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowDownloadDialog(false);
  };

  const togglePatentField = (fieldKey: string) => {
    setSelectedPatentFields(prev => {
      if (prev.includes(fieldKey)) {
        return prev.filter(f => f !== fieldKey);
      }
      return [...prev, fieldKey];
    });
  };

  // Patent CSV Upload Function
  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const text = await file.text();
      
      // Strip BOM if present (Excel CSV exports)
      const cleanText = text.replace(/^\uFEFF/, '');
      
      // Detect delimiter (comma or tab)
      const firstLine = cleanText.split(/\r?\n/)[0] || '';
      const delimiter = firstLine.includes('\t') ? '\t' : ',';
      
      // Parse CSV/TSV with proper quote handling that supports multi-line fields
      const parseCSV = (csvText: string, delim: string): { headers: string[], rows: string[][] } => {
        const rows: string[][] = [];
        let currentRow: string[] = [];
        let currentField = '';
        let inQuotes = false;
        let i = 0;
        
        while (i < csvText.length) {
          const char = csvText[i];
          const nextChar = csvText[i + 1];
          
          if (char === '"') {
            if (inQuotes && nextChar === '"') {
              // Escaped quote
              currentField += '"';
              i += 2;
              continue;
            } else {
              // Toggle quote state
              inQuotes = !inQuotes;
            }
          } else if (char === delim && !inQuotes) {
            // End of field
            currentRow.push(currentField.trim());
            currentField = '';
          } else if ((char === '\n' || char === '\r') && !inQuotes) {
            // End of row
            if (currentField.length > 0 || currentRow.length > 0) {
              currentRow.push(currentField.trim());
              if (currentRow.some(field => field.length > 0)) {
                rows.push(currentRow);
              }
              currentRow = [];
              currentField = '';
            }
            // Handle \r\n line endings
            if (char === '\r' && nextChar === '\n') {
              i++;
            }
          } else {
            currentField += char;
          }
          i++;
        }
        
        // Don't forget the last field/row
        if (currentField.length > 0 || currentRow.length > 0) {
          currentRow.push(currentField.trim());
          if (currentRow.some(field => field.length > 0)) {
            rows.push(currentRow);
          }
        }
        
        // First row is headers
        const headers = rows.shift() || [];
        return { headers, rows };
      };
      
      const { headers: rawHeaders, rows: parsedRows } = parseCSV(cleanText, delimiter);
      
      if (rawHeaders.length === 0 || parsedRows.length === 0) {
        toast({ title: 'Validation Error', description: 'CSV file is empty or invalid.', variant: 'destructive' })
        return;
      }
      
      // Map header labels to field keys
      // Download uses: Title, Patent ID, Inventors, Field, Status, Year, Abstract, Description
      // We need to map these to: title, patentId, inventors, field, status, year, abstract, description
      const headerMapping: { [key: string]: string } = {
        'title': 'title',
        'Title': 'title',
        'patentid': 'patentId',
        'Patent ID': 'patentId',
        'PatentID': 'patentId',
        'inventors': 'inventors',
        'Inventors': 'inventors',
        'field': 'field',
        'Field': 'field',
        'status': 'status',
        'Status': 'status',
        'year': 'year',
        'Year': 'year',
        'abstract': 'abstract',
        'Abstract': 'abstract',
        'description': 'description',
        'Description': 'description',
      };
      
      const headers = rawHeaders.map(h => {
        const cleanHeader = h.replace(/^"|"$/g, '');
        return headerMapping[cleanHeader] || cleanHeader.toLowerCase();
      });
      
      // Required fields
      const requiredFields = ['title', 'field'];
      const missingFields = requiredFields.filter(field => !headers.includes(field));
      
      if (missingFields.length > 0) {
        toast({ 
          title: 'Validation Error', 
          description: `Missing required fields: ${missingFields.join(', ')}. Detected headers: ${rawHeaders.join(', ')}`, 
          variant: 'destructive' 
        });
        return;
      }

      // Parse data rows
      const patentsToInsert = [];
      for (const row of parsedRows) {
        const patent: any = {};
        
        headers.forEach((header, index) => {
          let value = row[index] || '';
          // Remove surrounding quotes and unescape double quotes
          value = value.replace(/^"|"$/g, '').replace(/""/g, '"');
          patent[header] = value;
        });

        // Set defaults
        patent.status = patent.status || 'Filed';
        patent.year = patent.year || new Date().getFullYear().toString();
        
        patentsToInsert.push(patent);
      }

      // Insert patents
      let successCount = 0;
      let errorCount = 0;
      const newlyInsertedIds: string[] = [];

      for (const patent of patentsToInsert) {
        const { data: insertedRows, error } = await supabase
          .from('admin_patents')
          .insert([{
            title: patent.title,
            patent_number: patent.patentId || null,
            inventors: patent.inventors || null,
            field: patent.field,
            description: patent.description || null,
            abstract: patent.abstract || null,
            status: patent.status,
            year: patent.year,
            published: false
          }])
          .select('id');

        if (error) {
          console.error('Error inserting patent:', error);
          errorCount++;
        } else {
          successCount++;
          // Capture the new id so we can flag it as a bulk-upload draft
          // until the admin opens & saves the edit modal.
          const newId = insertedRows?.[0]?.id;
          if (newId) newlyInsertedIds.push(newId);
        }
      }

      // Mark every successfully inserted bulk patent as needing review.
      if (newlyInsertedIds.length > 0) {
        setRecentBulkPatentIds(prev => Array.from(new Set([...prev, ...newlyInsertedIds])));
      }

      loadPatents();
      
      if (errorCount > 0) {
        toast({ title: 'Success', description: `Upload complete: ${successCount} patents added, ${errorCount} failed.` })
      } else {
        toast({ title: 'Success', description: `Successfully uploaded ${successCount} patents!` })
      }
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast({ title: 'Error', description: 'Error parsing CSV file. Please check the format.', variant: 'destructive' })
    } finally {
      setIsUploading(false);
      // Reset file input by incrementing key
      setCsvUploadKey(prev => prev + 1);
    }
  };

  // Service Management Functions
  const handleOpenServiceModal = (service: any = null) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        id: service.id,
        name: service.name,
        description: service.description || '',
        icon: service.icon || 'Wrench',
        order_num: service.order_num || 0,
        published: service.published !== false,
        features: service.features || [],
        process_steps: service.process_steps || [],
        timeline: service.timeline || '',
        pricing: service.pricing || '',
      });
    } else {
      setEditingService(null);
      setServiceForm({
        id: null,
        name: '',
        description: '',
        icon: 'Wrench',
        order_num: services.length,
        published: true,
        features: [],
        process_steps: [],
        timeline: '',
        pricing: '',
      });
    }
    setShowServiceModal(true);
  };

  const handleSaveService = async () => {
    if (!serviceForm.name.trim()) {
      toast({ title: 'Validation Error', description: 'Please enter a service name', variant: 'destructive' })
      return;
    }

    const slug = serviceForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const serviceData = {
      name: serviceForm.name,
      slug: slug,
      description: serviceForm.description,
      icon: serviceForm.icon,
      order_num: serviceForm.order_num,
      published: serviceForm.published,
      features: serviceForm.features,
      process_steps: serviceForm.process_steps,
      timeline: serviceForm.timeline,
      pricing: serviceForm.pricing,
    };

    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);
        
        if (error) throw error;
        // Note: Activity is logged automatically by database trigger
        toast({ title: 'Success', description: 'Service updated successfully!' })
      } else {
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);
        
        if (error) throw error;
        // Note: Activity is logged automatically by database trigger
        toast({ title: 'Success', description: 'Service created successfully!' })
      }
      
      loadServices();
      setShowServiceModal(false);
      setEditingService(null);
      setServiceForm({
        id: null,
        name: '',
        description: '',
        icon: 'Wrench',
        order_num: 0,
        published: true,
        features: [],
        process_steps: [],
        timeline: '',
        pricing: '',
      });
    } catch (error) {
      console.error('Error saving service:', error);
      toast({ title: 'Error', description: 'Error saving service. Please try again.', variant: 'destructive' })
    }
  };

  const handleDeleteService = async (serviceId: string, serviceName: string) => {
    if (confirm(`Are you sure you want to delete the service "${serviceName}"? This action cannot be undone.`)) {
      try {
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', serviceId);
        
        if (error) throw error;
        
        loadServices();
        // Note: Activity is logged automatically by database trigger
        toast({ title: 'Success', description: `Service "${serviceName}" has been deleted successfully!` })
      } catch (error) {
        console.error('Error deleting service:', error);
        toast({ title: 'Error', description: 'Error deleting service', variant: 'destructive' })
      }
    }
  };

  // Event Management Functions
  const handleCreateEvent = async () => {
    if (!eventForm.title || !eventForm.date) {
      toast({ title: 'Validation Error', description: 'Please fill in all required fields (Event Title, Event Date).', variant: 'destructive' });
      return;
    }

    // Process image if provided
    let imageUrl = null;
    if (eventForm.image) {
      try {
        const reader = new FileReader();
        imageUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(eventForm.image!);
        });
      } catch (error) {
        console.error('Failed to process image:', error);
        toast({ title: 'Warning', description: 'Failed to process image. Event will be saved without image.', variant: 'destructive' })
      }
    }

    const eventData = {
      title: eventForm.title,
      type: eventForm.type,
      date: eventForm.date,
      time: eventForm.time,
      location: eventForm.location,
      capacity: eventForm.capacity ? parseInt(eventForm.capacity) : null,
      description: eventForm.description,
      registration_open: eventForm.registrationOpen,
      status: 'Upcoming',
      published: true,
      image_url: imageUrl,
    };

    if (editingEvent) {
      const { error } = await supabase
        .from('admin_events')
        .update(eventData)
        .eq('id', editingEvent.id);
      
      if (error) {
        console.error('Error updating event:', error);
        toast({ title: 'Error', description: 'Error updating event', variant: 'destructive' })
        return;
      }
      // Note: Activity is logged automatically by database trigger
    } else {
      const { error } = await supabase
        .from('admin_events')
        .insert([eventData]);
      
      if (error) {
        console.error('Error creating event:', error);
        toast({ title: 'Error', description: 'Error creating event', variant: 'destructive' })
        return;
      }
      // Note: Activity is logged automatically by database trigger
    }

    loadEvents();
    window.dispatchEvent(new Event('storage'));
    
    setEventForm({
      id: null,
      title: '',
      type: 'workshop',
      date: '',
      time: '',
      location: '',
      capacity: '',
      description: '',
      image: null,
      registrationOpen: true
    });
    setEditingEvent(null);
    setShowEventModal(false);
    
    toast({ title: 'Success', description: `Event ${editingEvent ? 'updated' : 'created'} successfully!` })
  };

  const handleEditEvent = (event: any) => {
    setEditingEvent(event);
    setEventForm({
      id: event.id,
      title: event.title,
      type: event.type || 'workshop',
      date: event.date,
      time: event.time || '',
      location: event.location || '',
      capacity: event.capacity ? event.capacity.toString() : '',
      description: event.description || '',
      image: null,
      registrationOpen: event.registrationOpen !== undefined ? event.registrationOpen : true
    });
    setShowEventModal(true);
  };

  const handleDeleteEvent = async (eventId: string, title: string) => {
    if (confirm(`Are you sure you want to delete the event "${title}"? This action cannot be undone.`)) {
      const { error } = await supabase
        .from('admin_events')
        .delete()
        .eq('id', eventId);
      
      if (error) {
        console.error('Error deleting event:', error);
        toast({ title: 'Error', description: 'Error deleting event', variant: 'destructive' })
        return;
      }
      
      loadEvents();
      window.dispatchEvent(new Event('storage'));
      // Note: Activity is logged automatically by database trigger
      toast({ title: 'Success', description: `Event "${title}" has been deleted successfully!` })
    }
  };

  // Handle viewing event registrations
  const handleViewRegistrations = async (event: any) => {
    setSelectedEventForRegistrations(event);
    setLoadingRegistrations(true);
    setShowRegistrationsModal(true);
    
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', event.id)
        .order('registered_at', { ascending: false });
      
      if (error) {
        console.error('Error loading registrations:', error);
        setEventRegistrations([]);
      } else {
        setEventRegistrations(data || []);
      }
    } catch (err) {
      console.error('Unexpected error loading registrations:', err);
      setEventRegistrations([]);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  // Handle updating registration status
  const handleUpdateRegistrationStatus = async (registrationId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      if (newStatus === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('event_registrations')
        .update(updateData)
        .eq('id', registrationId);
      
      if (error) {
        console.error('Error updating registration status:', error);
        toast({ title: 'Error', description: 'Error updating registration status', variant: 'destructive' })
      } else {
        // Refresh registrations
        if (selectedEventForRegistrations) {
          handleViewRegistrations(selectedEventForRegistrations);
        }
      }
    } catch (err) {
      console.error('Unexpected error updating registration:', err);
      toast({ title: 'Error', description: 'Error updating registration status', variant: 'destructive' })
    }
  };

  // Export registrations to CSV
  const handleExportRegistrations = () => {
    if (eventRegistrations.length === 0) {
      toast({ title: 'Validation Error', description: 'No registrations to export', variant: 'destructive' })
      return;
    }
    
    const headers = ['Full Name', 'Email', 'Phone', 'Organization', 'Position', 'Dietary Requirements', 'Special Requests', 'Status', 'Registered At'];
    const csvContent = [
      headers.join(','),
      ...eventRegistrations.map(reg => [
        `"${reg.full_name}"`,
        `"${reg.email}"`,
        `"${reg.phone || ''}"`,
        `"${reg.organization || ''}"`,
        `"${reg.position || ''}"`,
        `"${reg.dietary_requirements || ''}"`,
        `"${reg.special_requests || ''}"`,
        `"${reg.status}"`,
        `"${new Date(reg.registered_at).toLocaleString()}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations_${selectedEventForRegistrations?.title?.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // User Management Functions
  const handleOpenUserModal = (user?: any) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        full_name: user.full_name,
        email: user.email,
        password: '',
        department: user.department || '',
        employee_id: user.employee_id || '',
        phone: user.phone || '',
        role: user.role,
        status: user.status
      });
    } else {
      setEditingUser(null);
      setUserForm({
        full_name: '',
        email: '',
        password: '',
        department: '',
        employee_id: '',
        phone: '',
        role: 'faculty',
        status: 'active'
      });
    }
    setShowUserModal(true);
  };

  const handleAddUser = async () => {
    if (!userForm.full_name || !userForm.email) {
      toast({ title: 'Notice', description: 'Please fill in Full Name and Email.' })
      return;
    }

    if (!editingUser && !userForm.password) {
      toast({ title: 'Validation Error', description: 'Please enter a temporary password for the new user.', variant: 'destructive' })
      return;
    }

    try {
      if (editingUser) {
        // Update existing user profile
        const { error } = await supabase
          .from('user_profiles')
          .update({
            full_name: userForm.full_name,
            email: userForm.email,
            department: userForm.department || null,
            employee_id: userForm.employee_id || null,
            phone: userForm.phone || null,
            role: userForm.role,
            status: userForm.status
          })
          .eq('id', editingUser.id);
        
        if (error) {
          console.error('Error updating user:', error);
          toast({ title: 'Error', description: `Error updating user: ${error.message}`, variant: 'destructive' })
          return;
        }
        
        // Also update user_roles table if role changed
        if (userForm.role === 'admin' || userForm.role === 'faculty') {
          // Check if user_roles entry exists
          const { data: existingRole } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', editingUser.id)
            .single();
          
          if (existingRole) {
            // Update existing role
            await supabase
              .from('user_roles')
              .update({ role: userForm.role })
              .eq('user_id', editingUser.id);
          } else {
            // Insert new role
            await supabase
              .from('user_roles')
              .insert({ user_id: editingUser.id, role: userForm.role });
          }
        }
        
        logActivity('user', 'updated', userForm.full_name);
        toast({ title: 'Success', description: `User "${userForm.full_name}" has been updated successfully!` })
      } else {
        // Create new user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userForm.email,
          password: userForm.password,
          options: {
            data: {
              full_name: userForm.full_name,
              role: userForm.role  // Pass role in metadata for trigger
            }
          }
        });

        if (authError) {
          console.error('Error creating auth user:', authError);
          toast({ title: 'Error', description: `Error creating user account: ${authError.message}`, variant: 'destructive' })
          return;
        }

        // The trigger will create the user_profiles entry automatically
        // Wait a moment for the trigger to complete, then update with additional fields
        if (authData.user) {
          // Wait for trigger to create the profile (500ms delay)
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Use upsert to either update or insert the profile data
          const { error: profileError } = await supabase
            .from('user_profiles')
            .upsert({
              id: authData.user.id,
              full_name: userForm.full_name,
              email: userForm.email,
              department: userForm.department || null,
              employee_id: userForm.employee_id || null,
              phone: userForm.phone || null,
              role: userForm.role,
              status: userForm.status
            });
          
          if (profileError) {
            console.error('Error updating profile:', profileError);
            // Don't return here, still try to create user_roles
          }
          
          // Also create entry in user_roles table for admin/faculty
          if (userForm.role === 'admin' || userForm.role === 'faculty') {
            const { error: roleError } = await supabase
              .from('user_roles')
              .insert({
                user_id: authData.user.id,
                role: userForm.role
              });
            
            if (roleError) {
              console.error('Error creating user role:', roleError);
            }
          }
        }
        logActivity('user', 'created', userForm.full_name);
        toast({ title: 'Success', description: `User "${userForm.full_name}" has been created successfully!\nThey can log in with email: ${userForm.email}` })
      }

      loadUsers();
      setShowUserModal(false);
      setEditingUser(null);
      setUserForm({
        full_name: '',
        email: '',
        password: '',
        department: '',
        employee_id: '',
        phone: '',
        role: 'faculty',
        status: 'active'
      });
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast({ title: 'Error', description: `Error saving user: ${error.message}`, variant: 'destructive' })
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"?\nThis will also delete their auth account.`)) {
      return;
    }

    try {
      // Delete profile (will cascade delete if set up, or we delete manually)
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);
      
      if (error) {
        console.error('Error deleting user:', error);
        toast({ title: 'Error', description: `Error deleting user: ${error.message}`, variant: 'destructive' })
        return;
      }

      logActivity('user', 'deleted', userName);
      loadUsers();
      toast({ title: 'Success', description: `User "${userName}" has been deleted.` })
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({ title: 'Error', description: `Error deleting user: ${error.message}`, variant: 'destructive' })
    }
  };

  // Resource Management Handlers
  const handleOpenResourceModal = (resource?: any) => {
    if (resource) {
      setEditingResource(resource);
      setResourceForm({
        id: resource.id,
        title: resource.title,
        slug: resource.slug,
        type: resource.type,
        category: resource.category,
        content: resource.content || '',
        url: resource.url || '',
        file_url: resource.file_url || '',
        tags: resource.tags || [],
        published: resource.published,
      });
      setUploadedFileName(resource.file_url ? resource.file_url.split('/').pop() || '' : '');
    } else {
      setEditingResource(null);
      setResourceForm({
        id: null,
        title: '',
        slug: '',
        type: resourceTab === 'templates' ? 'download' : 'guide',
        category: resourceTab === 'templates' ? 'Templates' : 'Guidelines',
        content: '',
        url: '',
        file_url: '',
        tags: [],
        published: true,
      });
      setUploadedFileName('');
    }
    setUploadFile(null);
    setShowResourceModal(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSaveResource = async () => {
    if (!resourceForm.title.trim()) {
      toast({ title: 'Validation Error', description: 'Please enter a resource title.', variant: 'destructive' })
      return;
    }

    const slug = resourceForm.slug || generateSlug(resourceForm.title);
    setUploading(true);
    
    try {
      let fileUrl = resourceForm.file_url;

      // Handle file upload if a new file is selected
      if (uploadFile) {
        const fileExt = uploadFile.name.split('.').pop();
        const fileName = `${slug}-${Date.now()}.${fileExt}`;
        const filePath = `resources/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('resources')
          .upload(filePath, uploadFile);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          toast({ title: 'Error', description: `Error uploading file: ${uploadError.message}`, variant: 'destructive' })
          setUploading(false);
          return;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('resources')
          .getPublicUrl(filePath);

        fileUrl = urlData.publicUrl;
      }

      const resourceData: any = {
        title: resourceForm.title,
        slug: slug,
        type: resourceForm.type,
        category: resourceForm.category,
        content: resourceForm.content,
        url: resourceForm.url || null,
        file_url: fileUrl || null,
        tags: [resourceForm.category],
        published: resourceForm.published,
      };


      let error;
      if (editingResource) {
        const result = await supabase
          .from('resources')
          .update(resourceData)
          .eq('id', editingResource.id);
        error = result.error;
      } else {
        resourceData.published_at = new Date().toISOString();
        const result = await supabase
          .from('resources')
          .insert(resourceData);
        error = result.error;
      }

      if (error) {
        console.error('Error saving resource:', error);
        toast({ title: 'Error', description: `Error saving resource: ${error.message}`, variant: 'destructive' })
        return;
      }

      logActivity('resource', editingResource ? 'updated' : 'added', resourceForm.title);
      loadResources();
      setShowResourceModal(false);
      setUploadFile(null);
      setUploadedFileName('');
      toast({ title: 'Success', description: `Resource "${resourceForm.title}" has been ${editingResource ? 'updated' : 'added'}.` })
    } catch (error: any) {
      console.error('Error saving resource:', error);
      toast({ title: 'Error', description: `Error saving resource: ${error.message}`, variant: 'destructive' })
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResource = (resourceId: string, resourceTitle: string) => {
    setResourceToDelete({ id: resourceId, title: resourceTitle });
    setShowDeleteResourceModal(true);
  };
  
  const confirmDeleteResource = async () => {
    if (!resourceToDelete) return;
    
    const { id: resourceId, title: resourceTitle } = resourceToDelete;

    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId);
      
      if (error) {
        console.error('Error deleting resource:', error);
        toast({ title: 'Error', description: `Error deleting resource: ${error.message}`, variant: 'destructive' });
        return;
      }

      logActivity('resource', 'deleted', resourceTitle);
      loadResources();
      toast({ title: 'Success', description: `Resource "${resourceTitle}" has been deleted.` });
    } catch (error: any) {
      console.error('Error deleting resource:', error);
      toast({ title: 'Error', description: `Error deleting resource: ${error.message}`, variant: 'destructive' });
    } finally {
      setShowDeleteResourceModal(false);
      setResourceToDelete(null);
    }
  };

  const handleToggleResourcePublish = async (resourceId: string, currentStatus: boolean, resourceTitle: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .update({ published: !currentStatus })
        .eq('id', resourceId);
      
      if (error) {
        console.error('Error updating resource:', error);
        toast({ title: 'Error', description: `Error updating resource: ${error.message}`, variant: 'destructive' })
        return;
      }

      logActivity('resource', currentStatus ? 'unpublished' : 'published', resourceTitle);
      loadResources();
    } catch (error: any) {
      console.error('Error updating resource:', error);
      toast({ title: 'Error', description: `Error updating resource: ${error.message}`, variant: 'destructive' })
    }
  };


  const getFilteredResources = (category: string) => {
    return resources.filter(r => r.category === category);
  };

  // Filtered news lists based on search and category filter
  const applyNewsFilters = (articles: any[]) => {
    return articles.filter(article => {
      const matchesSearch = !newsSearchTerm || 
        article.title?.toLowerCase().includes(newsSearchTerm.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(newsSearchTerm.toLowerCase()) ||
        article.author?.toLowerCase().includes(newsSearchTerm.toLowerCase());
      const matchesCategory = newsCategoryFilter === 'all' || article.category === newsCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  };
  const filteredNews = applyNewsFilters(news);
  const filteredDraftNews = applyNewsFilters(draftNews);
  const filteredArchivedNews = applyNewsFilters(archivedNews);

  // Filtered event lists based on search and type filter
  const applyEventFilters = (eventList: any[]) => {
    return eventList.filter(event => {
      const matchesSearch = !eventSearchTerm ||
        event.title?.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(eventSearchTerm.toLowerCase());
      const matchesType = eventTypeFilter === 'all' || event.type === eventTypeFilter;
      return matchesSearch && matchesType;
    });
  };
  const filteredEvents = applyEventFilters(events);
  const filteredArchivedEvents = applyEventFilters(archivedEvents);

  // Filtered service request lists based on search and status filter
  const applyServiceRequestFilters = (requests: any[]) => {
    return requests.filter(request => {
      const searchLower = serviceRequestSearch.toLowerCase();
      const matchesSearch = !serviceRequestSearch ||
        request.name?.toLowerCase().includes(searchLower) ||
        request.serviceTitle?.toLowerCase().includes(searchLower) ||
        request.organization?.toLowerCase().includes(searchLower) ||
        request.email?.toLowerCase().includes(searchLower);
      const matchesStatus = serviceRequestStatusFilter === 'all' || request.status === serviceRequestStatusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  };
  const filteredActiveRequests = applyServiceRequestFilters(serviceRequests);
  const filteredArchivedRequests = applyServiceRequestFilters(archivedRequests);

  // Filtered resource lists based on search
  const applyResourceFilters = (category: string) => {
    return resources.filter(r => {
      const matchesCategory = r.category === category;
      const matchesSearch = !resourceSearchTerm ||
        r.title?.toLowerCase().includes(resourceSearchTerm.toLowerCase()) ||
        r.content?.toLowerCase().includes(resourceSearchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };
  const filteredTemplates = applyResourceFilters('Templates');
  const filteredGuidelines = applyResourceFilters('Guidelines');

  const handleResetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password'
      });

      if (error) {
        console.error('Error sending reset email:', error);
        toast({ title: 'Error', description: `Error sending password reset email: ${error.message}`, variant: 'destructive' })
        return;
      }

      toast({ title: 'Success', description: `Password reset email has been sent to ${email}` })
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({ title: 'Error', description: 'Error sending password reset email', variant: 'destructive' })
    }
  };

  const handleGoogleSignIn = async () => {
    setLoginLoading(true);
    setLoginError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/admin',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google sign-in error:', error);
        setLoginError('Failed to sign in with Google. Please try again.');
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-ustp-blue">USTP TPCO Admin</CardTitle>
            <CardDescription>Sign in to manage portal content</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {loginError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">Username or Email</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) => {
                    setLoginData({ ...loginData, username: e.target.value });
                    setLoginError(null);
                  }}
                  placeholder="Enter username or email"
                  required
                  disabled={loginLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => {
                      setLoginData({ ...loginData, password: e.target.value });
                      setLoginError(null);
                    }}
                    placeholder="Enter password"
                    required
                    disabled={loginLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loginLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" variant="ustp" disabled={loginLoading}>
                {loginLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Use your email or "admin" as username
              </p>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <Button 
              type="button"
              variant="outline" 
              className="w-full bg-white hover:bg-gray-50 border-gray-300"
              onClick={handleGoogleSignIn}
              disabled={loginLoading}
            >
              {loginLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Sign in with Google
            </Button>
            <p className="text-xs text-gray-500 text-center mt-3">
              Faculty: Use your USTP university email (@ustp.edu.ph)
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-ustp-blue">USTP TPCO Admin Panel</h1>
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <Popover open={notificationOpen} onOpenChange={(open) => {
              setNotificationOpen(open);
            }}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <h3 className="font-semibold">Notifications</h3>
                  {notifications.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs h-7"
                      onClick={() => {
                        loadNotifications();
                      }}
                    >
                      Refresh
                    </Button>
                  )}
                </div>
                <ScrollArea className="h-80">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <BellOff className="h-8 w-8 mb-2" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                            !notification.isRead ? 'bg-blue-50/50' : ''
                          }`}
                          onClick={() => {
                            markNotificationAsRead(notification.id);
                            // If this notification is linked to an IP application, open its detail modal
                            if (notification.application_id) {
                              setNotificationOpen(false);
                              navigateToIpApplication(notification.application_id);
                            }
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${!notification.isRead ? 'font-medium' : ''}`}>
                                {notification.title}
                              </p>
                              {notification.description && (
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                  {notification.description}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {notification.action} • {formatRelativeTime(notification.timestamp)}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                {notifications.length > 0 && (
                  <div className="p-2 border-t space-y-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={() => {
                        markAllNotificationsAsRead();
                        setNotificationOpen(false);
                      }}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Mark all as read
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs"
                      onClick={() => {
                        markAllNotificationsAsRead();
                        setNotificationOpen(false);
                        // Navigate to full notifications page
                        navigate('/notifications');
                      }}
                    >
                      View all notifications
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" onClick={async () => { await supabase.auth.signOut(); setIsLoggedIn(false); }}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 ">
        <Tabs value={activeAdminTab} onValueChange={setActiveAdminTab} className="space-y-6 ">
          <TabsList className={`grid w-full text-[#f7f7f7] ${currentUserRole === 'admin' ? 'grid-cols-9' : 'grid-cols-8'}`}>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="patents">Patents</TabsTrigger>
            <TabsTrigger value="ip-applications">IP Applications</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            {currentUserRole === 'admin' && <TabsTrigger value="users">Users</TabsTrigger>}
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Patents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-ustp-blue">{dashboardStats.totalPatents}</div>
                  <p className="text-sm text-muted-foreground">+{dashboardStats.patentsThisMonth} this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Published News</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-ustp-blue">{dashboardStats.publishedNews}</div>
                  <p className="text-sm text-muted-foreground">+{dashboardStats.newsThisWeek} this week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-ustp-blue">{dashboardStats.upcomingEvents}</div>
                  <p className="text-sm text-muted-foreground">Next: {dashboardStats.nextEventDate}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Service Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-ustp-blue">{dashboardStats.serviceRequests}</div>
                  <p className="text-sm text-muted-foreground">{dashboardStats.pendingRequests} pending</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="outline" size="sm" onClick={handleViewAllActivities}>
                  <Eye className="mr-2 h-4 w-4" />
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity
                    .slice((activityPage - 1) * ACTIVITIES_PER_PAGE, activityPage * ACTIVITIES_PER_PAGE)
                    .map((activity) => (
                    <div key={activity.id} className={`flex items-center gap-4 p-3 border rounded-lg ${activity.type === 'ip_application' && activity.application_id ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                      onClick={() => {
                        if (activity.type === 'ip_application' && activity.application_id) {
                          navigateToIpApplication(activity.application_id);
                        }
                      }}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'ip_application' ? 'bg-cyan-500' :
                        activity.type === 'news' ? 'bg-blue-500' :
                        activity.type === 'technology' ? 'bg-green-500' :
                        activity.type === 'service' ? 'bg-purple-500' :
                        activity.type === 'event' ? 'bg-orange-500' :
                        'bg-gray-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.action} {activity.type === 'ip_application' ? 'IP Application' : activity.type}</p>
                        <p className="text-sm text-muted-foreground">{activity.title} - {formatDate(activity.timestamp)}</p>
                      </div>
                      {activity.type === 'ip_application' && activity.application_id && (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {recentActivity.length > ACTIVITIES_PER_PAGE && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Showing {((activityPage - 1) * ACTIVITIES_PER_PAGE) + 1} - {Math.min(activityPage * ACTIVITIES_PER_PAGE, recentActivity.length)} of {recentActivity.length}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActivityPage(prev => Math.max(1, prev - 1))}
                        disabled={activityPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActivityPage(prev => Math.min(Math.ceil(recentActivity.length / ACTIVITIES_PER_PAGE), prev + 1))}
                        disabled={activityPage >= Math.ceil(recentActivity.length / ACTIVITIES_PER_PAGE)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <h2 className="text-2xl font-bold">Content Management</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Homepage Content</CardTitle>
                  <CardDescription>Manage hero section and featured content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hero-title">Hero Section Title</Label>
                    <Input id="hero-title" placeholder="Main headline" defaultValue={homepageContent.heroTitle} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-subtitle">Hero Section Subtitle</Label>
                    <Textarea id="hero-subtitle" placeholder="Supporting text" defaultValue={homepageContent.heroSubtitle} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-image">Hero Image</Label>
                    {homepageContent.heroImage && (
                      <div className="mb-2">
                        <p className="text-sm text-muted-foreground mb-1">Current Image:</p>
                        <img 
                          src={homepageContent.heroImage} 
                          alt="Current hero image" 
                          className="w-full h-32 object-cover rounded-md border"
                        />
                      </div>
                    )}
                    <Input id="hero-image" type="file" accept="image/*" />
                    <p className="text-xs text-muted-foreground">Upload a new image to replace the current hero background</p>
                  </div>
                  <Button variant="ustp" onClick={handleHomepageUpdate}>Update Homepage</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impact Statistics</CardTitle>
                  <CardDescription>Update key metrics displayed on homepage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stat-patents">Patents Granted</Label>
                      <Input id="stat-patents" type="text" placeholder="e.g. 24+" defaultValue={homepageContent.patentsCount + '+'} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stat-partners">Industry Partners</Label>
                      <Input id="stat-partners" type="text" placeholder="e.g. 6+" defaultValue={homepageContent.partnersCount + '+'} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stat-technologies">Technologies Developed</Label>
                      <Input id="stat-technologies" type="text" placeholder="e.g. 8+" defaultValue={homepageContent.technologiesCount + '+'} />
                    </div>
                  </div>
                  <Button variant="ustp" onClick={handleImpactStatsUpdate}>Update Statistics</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">News Management</h2>
              <Button variant="ustp" onClick={() => { 
                setEditingNews(null); 
                setNewsForm({
                  title: '',
                  category: '',
                  author: '',
                  date: new Date().toISOString().split('T')[0],
                  excerpt: '',
                  content: '',
                  image: null,
                  contentImages: [],
                  youtubeUrl: ''
                });
                setExistingContentImages([]);
                setShowNewsModal(true); 
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Create News Article
              </Button>
            </div>

            {/* News Tabs */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle>Articles</CardTitle>
                    <CardDescription>
                      {newsTab === 'published' ? `${filteredNews.length} published` : newsTab === 'drafts' ? `${filteredDraftNews.length} draft${filteredDraftNews.length !== 1 ? 's' : ''}` : `${filteredArchivedNews.length} archived`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search articles..."
                        value={newsSearchTerm}
                        onChange={(e) => setNewsSearchTerm(e.target.value)}
                        className="pl-8 w-[200px]"
                      />
                    </div>
                    <Select value={newsCategoryFilter} onValueChange={setNewsCategoryFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Events">Events</SelectItem>
                        <SelectItem value="Partnerships">Partnerships</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Innovation">Innovation</SelectItem>
                        <SelectItem value="Announcements">Announcements</SelectItem>
                        <SelectItem value="Patent">Patent</SelectItem>
                        <SelectItem value="Research">Research</SelectItem>
                        <SelectItem value="Licensing">Licensing</SelectItem>
                      </SelectContent>
                    </Select>
                    {newsSearchTerm && (
                      <Button variant="ghost" size="sm" onClick={() => { setNewsSearchTerm(''); setNewsCategoryFilter('all'); }}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Tabs value={newsTab} onValueChange={setNewsTab}>
                  <TabsList className="grid text-white w-full grid-cols-3 mb-3">
                    <TabsTrigger value="published">
                      Published ({filteredNews.length})
                    </TabsTrigger>
                    <TabsTrigger value="drafts">
                      Drafts ({filteredDraftNews.length})
                    </TabsTrigger>
                    <TabsTrigger value="archived">
                      Archived ({filteredArchivedNews.length})
                    </TabsTrigger>
                  </TabsList>

                  {/* Published News */}
                  <TabsContent value="published" className="mt-0">
                    <div className="max-h-[500px] overflow-y-auto pr-1">
                      {filteredNews.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>{newsSearchTerm || newsCategoryFilter !== 'all' ? 'No articles match your filters.' : 'No published articles.'}</p>
                          {!newsSearchTerm && newsCategoryFilter === 'all' && (
                            <p className="text-sm mt-2">Publish a draft or create a new article.</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filteredNews.map((article) => (
                            <div key={article.id} className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-200 ${
                              editingNews && editingNews.id === article.id 
                                ? 'bg-blue-50 border-blue-300 dark:bg-blue-950 dark:border-blue-700' 
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold mb-1 truncate">{article.title}</h3>
                                <p className="text-sm text-muted-foreground mb-1 line-clamp-1">{article.excerpt}</p>
                                <div className="flex flex-wrap gap-1.5 items-center">
                                  <Badge className="bg-green-600 text-xs">Published</Badge>
                                  <Badge variant="outline" className="text-xs">{article.category}</Badge>
                                  <span className="text-xs text-muted-foreground">{article.date}</span>
                                  {article.author && (
                                    <span className="text-xs text-muted-foreground">by {article.author}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-1 ml-3 flex-shrink-0">
                                <Button variant="outline" size="sm" onClick={() => handleEditNews(article)} title={`Edit "${article.title}"`} className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700">
                                  <Edit className="h-4 w-4 mr-1" />Edit
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDuplicateNews(article)} title={`Duplicate "${article.title}"`} className="hover:bg-green-50 hover:border-green-300 hover:text-green-700">
                                  <Plus className="h-4 w-4 mr-1" />Copy
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleArchiveNews(article.id, true)} title="Archive article">
                                  <CheckCircle className="h-4 w-4 mr-1" />Archive
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteNews(article.id, article.title)} className="text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50" title={`Delete "${article.title}"`}>
                                  <Trash2 className="h-4 w-4 mr-1" />Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Drafts */}
                  <TabsContent value="drafts" className="mt-0">
                    <div className="max-h-[500px] overflow-y-auto pr-1">
                      {filteredDraftNews.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>{newsSearchTerm || newsCategoryFilter !== 'all' ? 'No drafts match your filters.' : 'No draft articles.'}</p>
                          {!newsSearchTerm && newsCategoryFilter === 'all' && (
                            <p className="text-sm mt-2">Save an article as draft to continue editing later.</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filteredDraftNews.map((article) => (
                            <div key={article.id} className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-200 ${
                              editingNews && editingNews.id === article.id 
                                ? 'bg-blue-50 border-blue-300 dark:bg-blue-950 dark:border-blue-700' 
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold mb-1 truncate">{article.title}</h3>
                                <p className="text-sm text-muted-foreground mb-1 line-clamp-1">{article.excerpt}</p>
                                <div className="flex flex-wrap gap-1.5 items-center">
                                  <Badge className="bg-yellow-600 text-xs">Draft</Badge>
                                  <Badge variant="outline" className="text-xs">{article.category}</Badge>
                                  <span className="text-xs text-muted-foreground">{article.date}</span>
                                  {article.author && (
                                    <span className="text-xs text-muted-foreground">by {article.author}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-1 ml-3 flex-shrink-0">
                                <Button variant="outline" size="sm" onClick={() => handleEditNews(article)} title={`Edit "${article.title}"`} className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700">
                                  <Edit className="h-4 w-4 mr-1" />Edit
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDuplicateNews(article)} title={`Duplicate "${article.title}"`} className="hover:bg-green-50 hover:border-green-300 hover:text-green-700">
                                  <Plus className="h-4 w-4 mr-1" />Copy
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleArchiveNews(article.id, true)} title="Archive draft">
                                  <CheckCircle className="h-4 w-4 mr-1" />Archive
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteNews(article.id, article.title)} className="text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50" title={`Delete "${article.title}"`}>
                                  <Trash2 className="h-4 w-4 mr-1" />Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Archived News */}
                  <TabsContent value="archived" className="mt-0">
                    <div className="max-h-[500px] overflow-y-auto pr-1">
                      {filteredArchivedNews.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>{newsSearchTerm || newsCategoryFilter !== 'all' ? 'No archived articles match your filters.' : 'No archived articles.'}</p>
                          {!newsSearchTerm && newsCategoryFilter === 'all' && (
                            <p className="text-sm mt-2">Archived articles will appear here.</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filteredArchivedNews.map((article) => (
                            <div key={article.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold truncate">{article.title}</h3>
                                  <Badge variant="secondary" className="text-xs flex-shrink-0">Archived</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-1 line-clamp-1">{article.excerpt}</p>
                                <div className="flex flex-wrap gap-1.5 items-center">
                                  <Badge variant="outline" className="text-xs text-gray-600">{article.status === 'Published' ? 'Published' : 'Draft'}</Badge>
                                  <Badge variant="outline" className="text-xs">{article.category}</Badge>
                                  <span className="text-xs text-muted-foreground">{article.date}</span>
                                  {article.author && (
                                    <span className="text-xs text-muted-foreground">by {article.author}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-1 ml-3 flex-shrink-0">
                                <Button variant="outline" size="sm" onClick={() => handleArchiveNews(article.id, false)} title="Restore article">
                                  <Clock className="h-4 w-4 mr-1" />Restore
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteNews(article.id, article.title)} className="text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50" title={`Delete "${article.title}" permanently`}>
                                  <Trash2 className="h-4 w-4 mr-1" />Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Event Management</h2>
              <Button variant="ustp" onClick={() => { setEditingEvent(null); setShowEventModal(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Create New Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input 
                      id="event-title" 
                      placeholder="Enter event title" 
                      value={eventForm.title}
                      onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-type">Event Type</Label>
                    <Select 
                      value={eventForm.type}
                      onValueChange={(value) => setEventForm({...eventForm, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="seminar">Seminar</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="networking">Networking</SelectItem>
                        <SelectItem value="showcase">Showcase</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Event Date</Label>
                    <Input 
                      id="event-date" 
                      type="date" 
                      value={eventForm.date}
                      onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-time">Event Time</Label>
                    <Input 
                      id="event-time" 
                      type="time" 
                      value={eventForm.time}
                      onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-location">Location</Label>
                    <Input 
                      id="event-location" 
                      placeholder="Event venue" 
                      value={eventForm.location}
                      onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-capacity">Capacity</Label>
                    <Input 
                      id="event-capacity" 
                      type="number" 
                      placeholder="Maximum attendees" 
                      value={eventForm.capacity}
                      onChange={(e) => setEventForm({...eventForm, capacity: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-description">Event Description</Label>
                  <Textarea 
                    id="event-description" 
                    placeholder="Detailed description of the event" 
                    rows={4} 
                    value={eventForm.description}
                    onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-image">Event Image</Label>
                  <Input 
                    id="event-image" 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setEventForm({...eventForm, image: e.target.files?.[0] || null})}
                  />
                </div>
                <Button variant="ustp" onClick={handleCreateEvent}>Create Event</Button>
              </CardContent>
            </Card>

            {/* Events Tabs */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle>Events</CardTitle>
                    <CardDescription>
                      {eventTab === 'active' ? `${filteredEvents.length} active event${filteredEvents.length !== 1 ? 's' : ''}` : `${filteredArchivedEvents.length} archived`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search events..."
                        value={eventSearchTerm}
                        onChange={(e) => setEventSearchTerm(e.target.value)}
                        className="pl-8 w-[200px]"
                      />
                    </div>
                    <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="seminar">Seminar</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="networking">Networking</SelectItem>
                        <SelectItem value="showcase">Showcase</SelectItem>
                      </SelectContent>
                    </Select>
                    {eventSearchTerm && (
                      <Button variant="ghost" size="sm" onClick={() => { setEventSearchTerm(''); setEventTypeFilter('all'); }}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Tabs value={eventTab} onValueChange={setEventTab}>
                  <TabsList className="grid text-white w-full grid-cols-2 mb-3">
                    <TabsTrigger value="active">
                      Active Events ({filteredEvents.length})
                    </TabsTrigger>
                    <TabsTrigger value="archived">
                      Past/Archived Events ({filteredArchivedEvents.length})
                    </TabsTrigger>
                  </TabsList>

                  {/* Active Events */}
                  <TabsContent value="active" className="mt-0">
                    <div className="max-h-[500px] overflow-y-auto pr-1">
                      {filteredEvents.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>{eventSearchTerm || eventTypeFilter !== 'all' ? 'No events match your filters.' : 'No active events.'}</p>
                          {!eventSearchTerm && eventTypeFilter === 'all' && (
                            <p className="text-sm mt-2">Create a new event or restore one from the archived section.</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filteredEvents.map((event) => (
                            <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold truncate">{event.title}</h3>
                                  <Badge variant={event.status === "Upcoming" ? "default" : event.status === "Planning" ? "secondary" : "outline"} className="text-xs flex-shrink-0">
                                    {event.status}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />{event.date}
                                  </span>
                                  {event.time && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />{event.time}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />{event.attendees || 0} attendees
                                  </span>
                                  {event.location && (
                                    <span className="flex items-center gap-1">
                                      <Building className="h-3 w-3" />{event.location}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-1 ml-3 flex-shrink-0">
                                <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)} title="Edit event">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleViewRegistrations(event)} title="View registrations">
                                  <Users className="h-4 w-4 mr-1" />Regs
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleArchiveEvent(event.id, true)} title="Archive event">
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event.id, event.title)} className="text-red-600 hover:text-red-700" title="Delete event">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Archived/Past Events */}
                  <TabsContent value="archived" className="mt-0">
                    <div className="max-h-[500px] overflow-y-auto pr-1">
                      {filteredArchivedEvents.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>{eventSearchTerm || eventTypeFilter !== 'all' ? 'No archived events match your filters.' : 'No archived events.'}</p>
                          {!eventSearchTerm && eventTypeFilter === 'all' && (
                            <p className="text-sm mt-2">Past and archived events will appear here.</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filteredArchivedEvents.map((event) => (
                            <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold truncate">{event.title}</h3>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs flex-shrink-0 ${event.status === 'Completed' ? 'text-green-600 border-green-600' : event.status === 'Cancelled' ? 'text-red-600 border-red-600' : 'text-gray-600 border-gray-600'}`}
                                  >
                                    {event.status}
                                  </Badge>
                                  {event.archived && (
                                    <Badge variant="secondary" className="text-xs flex-shrink-0">Archived</Badge>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />{event.date}
                                  </span>
                                  {event.time && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />{event.time}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />{event.attendees || 0} attendees
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-1 ml-3 flex-shrink-0">
                                <Button variant="outline" size="sm" onClick={() => {
                                  setSelectedArchivedEvent(event);
                                  setShowArchivedEventDetailModal(true);
                                }} title="View event details">
                                  <Eye className="h-4 w-4 mr-1" />View Details
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event.id, event.title)} className="text-red-600 hover:text-red-700" title="Delete event permanently">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patents" className="space-y-6" id="patents-section">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Patent Management</h2>
            </div>

            {/* Patent Analytics Summary Card */}
            <PatentAnalyticsCard patents={patents} ipApplications={ipApplications} />
            
            {/* Existing Patents - Now First */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Existing Patents ({patents.length})</CardTitle>
                    <CardDescription>Manage and edit your patent portfolio</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {/* Bulk Upload Button */}
                    <div className="relative">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleCSVUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        id="csv-upload"
                        key={csvUploadKey}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={isUploading}
                        className="relative pointer-events-none"
                      >
                        {isUploading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <FileUp className="mr-2 h-4 w-4" />
                        )}
                        {isUploading ? 'Uploading...' : 'Bulk Upload CSV'}
                      </Button>
                    </div>
                    
                    {/* Download Button */}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowDownloadDialog(true)}
                    >
                      <FileDown className="mr-2 h-4 w-4" />
                      Download CSV
                    </Button>
                  </div>
                </div>
                
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search patents by title, ID, or inventor..."
                      value={patentSearchTerm}
                      onChange={(e) => {
                        setPatentSearchTerm(e.target.value);
                        setPatentCurrentPage(1);
                      }}
                      className="pl-10"
                    />
                  </div>
                  <Select value={patentFieldFilter} onValueChange={(value) => {
                    setPatentFieldFilter(value);
                    setPatentCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Fields</SelectItem>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                      <SelectItem value="materials">Materials Science</SelectItem>
                      <SelectItem value="food">Food Technology</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="biotechnology">Biotechnology</SelectItem>
                      <SelectItem value="information-technology">Information Technology</SelectItem>
                      <SelectItem value="environmental-science">Environmental Science</SelectItem>
                      <SelectItem value="energy">Energy Technology</SelectItem>
                      <SelectItem value="medical">Medical Technology</SelectItem>
                      <SelectItem value="chemical">Chemical Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                  {(patentSearchTerm || patentFieldFilter !== 'all') && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        setPatentSearchTerm('');
                        setPatentFieldFilter('all');
                        setPatentCurrentPage(1);
                      }}
                      title="Clear filters"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-[500px] overflow-y-auto pr-1">
                <div className="space-y-4">
                  {(() => {
                    // Filter patents
                    const filteredPatents = patents.filter((patent) => {
                      const matchesSearch = !patentSearchTerm || 
                        patent.title?.toLowerCase().includes(patentSearchTerm.toLowerCase()) ||
                        patent.patentId?.toLowerCase().includes(patentSearchTerm.toLowerCase()) ||
                        patent.inventors?.toLowerCase().includes(patentSearchTerm.toLowerCase());
                      
                      const matchesField = patentFieldFilter === 'all' || 
                        patent.field?.toLowerCase() === patentFieldFilter.toLowerCase();
                      
                      return matchesSearch && matchesField;
                    });

                    // Pagination logic
                    const totalPages = Math.ceil(filteredPatents.length / patentsPerPage);
                    const startIndex = (patentCurrentPage - 1) * patentsPerPage;
                    const paginatedPatents = filteredPatents.slice(startIndex, startIndex + patentsPerPage);

                    if (filteredPatents.length === 0) {
                      return (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No patents match your search criteria.</p>
                          {(patentSearchTerm || patentFieldFilter !== 'all') && (
                            <Button 
                              variant="outline" 
                              className="mt-4"
                              onClick={() => {
                                setPatentSearchTerm('');
                                setPatentFieldFilter('all');
                                setPatentCurrentPage(1);
                              }}
                            >
                              Clear Filters
                            </Button>
                          )}
                        </div>
                      );
                    }

                    return (
                      <>
                        {/* Bulk-upload review banner: shown only when there are
                            recently bulk-uploaded patents that the admin hasn't
                            opened/saved yet. These rows start as Filed +
                            unpublished, so they don't appear on /ip-portfolio
                            until the admin reviews them and publishes. */}
                        {(() => {
                          // Only count IDs that still exist in the current list
                          // (deleted ones are silently ignored).
                          const existingIds = new Set(patents.map((p: any) => p.id));
                          const liveBulkIds = recentBulkPatentIds.filter(id => existingIds.has(id));
                          if (liveBulkIds.length === 0) return null;
                          return (
                            <div className="mb-4 flex items-start gap-3 p-4 border border-amber-300 bg-amber-50 rounded-lg">
                              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="font-semibold text-amber-900">
                                  {liveBulkIds.length} patent{liveBulkIds.length === 1 ? '' : 's'} added via Bulk Upload need{liveBulkIds.length === 1 ? 's' : ''} review
                                </p>
                                <p className="text-sm text-amber-800 mt-1">
                                  These patents won't appear on the public IP Portfolio until you open each one, complete the missing details, and set the status to <span className="font-semibold">Registered</span> or <span className="font-semibold">Commercialized</span>. Saving the edit form clears the indicator.
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-amber-300 text-amber-800 hover:bg-amber-100"
                                onClick={() => setRecentBulkPatentIds([])}
                              >
                                Dismiss all
                              </Button>
                            </div>
                          );
                        })()}

                        {/* Patent List */}
                        <div className="space-y-4">
                          {paginatedPatents.map((patent) => {
                            const isBulkPending = recentBulkPatentIds.includes(patent.id);
                            return (
                            <div
                              key={patent.id}
                              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                                isBulkPending
                                  ? 'border-amber-300 bg-amber-50/60 hover:bg-amber-50'
                                  : 'hover:bg-gray-50'
                              }`}
                              onClick={() => {
                                setSelectedPatentForDetail(patent);
                                setShowPatentDetailModal(true);
                              }}
                            >
                              <div>
                                <h3 className="font-semibold">{patent.title}</h3>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                  {(() => {
                                    // Status-aware pill colors mirror the Portfolio Overview cards:
                                    // Filed = indigo, Registered = teal, Commercialized = fuchsia.
                                    const statusClass: Record<string, string> = {
                                      'Filed':          'bg-indigo-100  text-indigo-700  border-indigo-200  hover:bg-indigo-100',
                                      'Registered':     'bg-teal-100    text-teal-700    border-teal-200    hover:bg-teal-100',
                                      'Commercialized': 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-100',
                                    };
                                    const cls = statusClass[patent.status as string] || 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100';
                                    return (
                                      <Badge variant="outline" className={cls}>
                                        {patent.status}
                                      </Badge>
                                    );
                                  })()}
                                  <Badge variant="outline">
                                    {typeof patent.field === 'string'
                                      ? patent.field
                                          .split('-')
                                          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                                          .join(' ')
                                      : patent.field}
                                  </Badge>
                                  {isBulkPending && (
                                    <Badge
                                      variant="outline"
                                      className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100 gap-1"
                                      title="Added via Bulk Upload — open and save to publish on IP Portfolio"
                                    >
                                      <AlertCircle className="h-3 w-3" />
                                      Needs Review (Bulk)
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditPatent(patent);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePatent(patent.id, patent.title);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            );
                          })}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="text-sm text-muted-foreground">
                              Showing {startIndex + 1}-{Math.min(startIndex + patentsPerPage, filteredPatents.length)} of {filteredPatents.length} patents
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPatentCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={patentCurrentPage === 1}
                              >
                                Previous
                              </Button>
                              
                              <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                  <Button
                                    key={page}
                                    variant={patentCurrentPage === page ? "ustp" : "outline"}
                                    size="sm"
                                    className="w-8 h-8 p-0"
                                    onClick={() => setPatentCurrentPage(page)}
                                  >
                                    {page}
                                  </Button>
                                ))}
                              </div>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPatentCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={patentCurrentPage === totalPages}
                              >
                                Next
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
                </div>
              </CardContent>
            </Card>

            {/* Licensed Revenue */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-violet-600" />
                  <div>
                    <CardTitle>Licensed (Revenue)</CardTitle>
                    <CardDescription>Enter total revenue from licensed patents (from logbook)</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {licensedRevenue && parseFloat(licensedRevenue) > 0 && (
                  <div className="mb-3 p-3 bg-violet-50 rounded-lg">
                    <p className="text-sm text-violet-700">Current value shown in Portfolio Overview:</p>
                    <p className="text-lg font-bold text-violet-900">₱{parseFloat(licensedRevenue).toLocaleString()}</p>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="licensed-revenue">Total Revenue (PHP)</Label>
                    <Input
                      id="licensed-revenue"
                      type="number"
                      min="0"
                      step="0.01"
                      value={licensedRevenue}
                      onChange={(e) => setLicensedRevenue(e.target.value)}
                      placeholder="e.g. 150000"
                    />
                  </div>
                  <Button 
                    variant="ustp" 
                    onClick={handleSaveRevenue}
                    disabled={savingRevenue}
                  >
                    {savingRevenue ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                    ) : (
                      <><DollarSign className="mr-2 h-4 w-4" />Save</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Add New Patent - Now Second */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Patent</CardTitle>
                <CardDescription>Add a new patent to the portfolio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patent-title">Patent Title *</Label>
                    <Input 
                      id="patent-title" 
                      placeholder="Enter patent title" 
                      value={patentForm.title}
                      onChange={(e) => setPatentForm({...patentForm, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patent-id">Patent ID</Label>
                    <Input 
                      id="patent-id" 
                      placeholder="Enter patent ID" 
                      value={patentForm.patentId}
                      onChange={(e) => setPatentForm({...patentForm, patentId: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inventors">Inventors</Label>
                    <Input 
                      id="inventors" 
                      placeholder="Enter inventors (comma separated)" 
                      value={patentForm.inventors}
                      onChange={(e) => setPatentForm({...patentForm, inventors: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="field">Field *</Label>
                    <Select 
                      value={patentForm.field} 
                      onValueChange={(value) => setPatentForm({...patentForm, field: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                        <SelectItem value="materials">Materials Science</SelectItem>
                        <SelectItem value="food">Food Technology</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="biotechnology">Biotechnology</SelectItem>
                        <SelectItem value="information-technology">Information Technology</SelectItem>
                        <SelectItem value="environmental-science">Environmental Science</SelectItem>
                        <SelectItem value="energy">Energy Technology</SelectItem>
                        <SelectItem value="medical">Medical Technology</SelectItem>
                        <SelectItem value="chemical">Chemical Engineering</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select 
                      value={patentForm.status} 
                      onValueChange={(value) => setPatentForm({...patentForm, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Filed">Filed</SelectItem>
                        <SelectItem value="Registered">Registered</SelectItem>
                        <SelectItem value="Commercialized">Commercialized</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year Added</Label>
                  <Input 
                    id="year" 
                    type="number" 
                    min="1900" 
                    max="2100" 
                    value={patentForm.year}
                    onChange={(e) => setPatentForm({...patentForm, year: e.target.value})}
                    placeholder="Enter year"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Enter brief description of the patent" 
                    rows={3} 
                    value={patentForm.description}
                    onChange={(e) => setPatentForm({...patentForm, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="abstract">Abstract</Label>
                  <Textarea 
                    id="abstract" 
                    placeholder="Enter patent abstract" 
                    rows={4} 
                    value={patentForm.abstract}
                    onChange={(e) => setPatentForm({...patentForm, abstract: e.target.value})}
                  />
                </div>

                {/* File Upload Section - Multiple Files */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Attach PDF Files</Label>
                    <span className="text-xs text-muted-foreground">
                      {patentFiles.length} file{patentFiles.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  
                  {/* Selected Files List */}
                  {patentFiles.length > 0 && (
                    <div className="space-y-2">
                      {patentFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-blue-600">
                              {index === 0 ? 'Primary document' : 'Additional document'}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setPatentFiles(patentFiles.filter((_, i) => i !== index));
                            }}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Add File Button */}
                  <div className="relative">
                    <input
                      type="file"
                      id="patent-file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPatentFiles([...patentFiles, file]);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Button variant="outline" size="sm" className="w-full relative pointer-events-none">
                      <Upload className="h-4 w-4 mr-2" />
                      Add PDF File
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Upload PDF files containing the patent documents (optional). First file will be the primary document.
                  </p>
                </div>

                <Button 
                  variant="ustp" 
                  onClick={handleSavePatent}
                  disabled={uploadingPatent}
                >
                  {uploadingPatent ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Save Patent
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* IP Applications Tab */}
          <TabsContent value="ip-applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">IP Applications</h2>
                <p className="text-muted-foreground">Review and manage faculty IP submissions</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={loadIpApplications} disabled={ipAppLoading}>
                  {ipAppLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock className="mr-2 h-4 w-4" />}
                  Refresh
                </Button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Applications</p>
                      <p className="text-2xl font-bold">{ipApplications.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">For Review</p>
                      <p className="text-2xl font-bold">
                        {ipApplications.filter(app => 
                          app.status === 'Submitted for Internal Review' || 
                          app.status === 'Under Internal Review'
                        ).length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Needs Revision</p>
                      <p className="text-2xl font-bold">
                        {ipApplications.filter(app => app.status === 'Needs Revision').length}
                      </p>
                    </div>
                    <Edit className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Approved</p>
                      <p className="text-2xl font-bold">
                        {ipApplications.filter(app => 
                          app.status === 'Approved for IPOPHL Filing' ||
                          app.status === 'Filed to IPOPHL' ||
                          app.status === 'Granted'
                        ).length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by title, applicant, or field..."
                      value={ipAppSearchTerm}
                      onChange={(e) => {
                        setIpAppSearchTerm(e.target.value);
                        setIpAppCurrentPage(1);
                      }}
                      className="pl-10"
                    />
                  </div>
                  <Select value={ipAppStatusFilter} onValueChange={(value) => {
                    setIpAppStatusFilter(value);
                    setIpAppCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Submitted for Internal Review">For Review</SelectItem>
                      <SelectItem value="Under Internal Review">Under Review</SelectItem>
                      <SelectItem value="Needs Revision">Needs Revision</SelectItem>
                      <SelectItem value="Approved for IPOPHL Filing">Approved for Filing</SelectItem>
                      <SelectItem value="Filed to IPOPHL">Filed to IPOPHL</SelectItem>
                      <SelectItem value="Under IPOPHL Examination">Under Examination</SelectItem>
                      <SelectItem value="Granted">Granted</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={ipAppTypeFilter} onValueChange={(value) => {
                    setIpAppTypeFilter(value);
                    setIpAppCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <FileText className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Patent">Patent</SelectItem>
                      <SelectItem value="Utility Model">Utility Model</SelectItem>
                      <SelectItem value="Industrial Design">Industrial Design</SelectItem>
                      <SelectItem value="Copyright">Copyright</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Applications Table */}
            <Card>
              <CardHeader>
                <CardTitle>Applications ({getFilteredIpApplications().length})</CardTitle>
              </CardHeader>
              <CardContent>
                {ipAppLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : getFilteredIpApplications().length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p>No IP applications found.</p>
                    <p className="text-sm">Applications submitted by faculty will appear here.</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left p-3 text-sm font-semibold text-gray-700">Application</th>
                            <th className="text-left p-3 text-sm font-semibold text-gray-700">Applicant</th>
                            <th className="text-left p-3 text-sm font-semibold text-gray-700">Type</th>
                            <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
                            <th className="text-left p-3 text-sm font-semibold text-gray-700">Submitted</th>
                            <th className="text-left p-3 text-sm font-semibold text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getPaginatedIpApplications().map((app) => (
                            <tr key={app.id} className="border-b hover:bg-gray-50">
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <div>
                                    <p className="font-medium text-sm">{app.title}</p>
                                    <p className="text-xs text-gray-500">{app.application_number || ''}</p>
                                  </div>
                                  {(app as any)._facultyCommentCount > 0 && (
                                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 ml-auto" title={`${(app as any)._facultyCommentCount} faculty comment(s)`}>
                                      <MessageSquare className="h-3 w-3 mr-1" />
                                      {(app as any)._facultyCommentCount}
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="p-3">
                                <div>
                                  <p className="text-sm">{app.applicant_full_name}</p>
                                  <p className="text-xs text-gray-500">{app.faculty?.department}</p>
                                </div>
                              </td>
                              <td className="p-3">
                                <Badge variant="outline">{app.ip_type}</Badge>
                              </td>
                              <td className="p-3">
                                <Badge className={`${getIpAppStatusBadge(app.status)} text-white`}>
                                  {getIpAppStatusDisplay(app.status)}
                                </Badge>
                              </td>
                              <td className="p-3 text-sm text-gray-600">
                                {app.submitted_at ? formatRelativeTime(app.submitted_at) : 'Draft'}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedIpApp(app);
                                      setShowIpAppDetailModal(true);
                                      loadIpAppComments(app.id);
                                    }}
                                    title="View Details"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  {(app.status === 'Submitted for Internal Review' || app.status === 'Under Internal Review') && (
                                    <>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => {
                                          setSelectedIpApp(app);
                                          setIpAppReviewAction('approve');
                                          setIpAppReviewNotes('');
                                          setShowIpAppReviewModal(true);
                                        }}
                                        title="Approve"
                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => {
                                          setSelectedIpApp(app);
                                          setIpAppReviewAction('return');
                                          setIpAppReviewNotes('');
                                          setShowIpAppReviewModal(true);
                                        }}
                                        title="Flag for Revision"
                                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                      >
                                        <AlertCircle className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => {
                                          setSelectedIpApp(app);
                                          setIpAppReviewAction('reject');
                                          setIpAppReviewNotes('');
                                          setShowIpAppReviewModal(true);
                                        }}
                                        title="Reject"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <XCircle className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => {
                                          setSelectedIpApp(app);
                                          setIpAppReviewNotes('');
                                          setShowIpAppReviewModal(true);
                                        }}
                                        title="Leave Comment"
                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                      >
                                        <MessageSquare className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                  {app.status === 'Needs Revision' && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => {
                                        setSelectedIpApp(app);
                                        setIpAppReviewNotes('');
                                        setShowIpAppReviewModal(true);
                                      }}
                                      title="Leave Comment"
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <MessageSquare className="h-4 w-4" />
                                    </Button>
                                  )}
                                  {app.status === 'Approved for IPOPHL Filing' && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedIpApp(app);
                                        setIpAppReviewAction('granted');
                                        setIpAppReviewNotes('');
                                        setIpAppReviewFiles([]);
                                        setShowIpAppReviewModal(true);
                                      }}
                                      title="Mark as Granted & Send Certification"
                                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                    >
                                      <Award className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {getTotalIpAppPages() > 1 && (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600">
                          Showing {((ipAppCurrentPage - 1) * ipAppsPerPage) + 1} - {Math.min(ipAppCurrentPage * ipAppsPerPage, getFilteredIpApplications().length)} of {getFilteredIpApplications().length}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIpAppCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={ipAppCurrentPage === 1}
                          >
                            Previous
                          </Button>
                          <span className="flex items-center px-3 text-sm">
                            Page {ipAppCurrentPage} of {getTotalIpAppPages()}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIpAppCurrentPage(prev => Math.min(getTotalIpAppPages(), prev + 1))}
                            disabled={ipAppCurrentPage === getTotalIpAppPages()}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Service Management</h2>
              <Button variant="ustp" onClick={() => handleOpenServiceModal()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </div>

            {/* Existing Services Section */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Services ({services.length})</CardTitle>
                <CardDescription>Manage services offered by TPCO</CardDescription>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No services configured yet.</p>
                    <Button variant="ustp" className="mt-4" onClick={() => handleOpenServiceModal()}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Service
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{service.name}</h3>
                            {!service.published && (
                              <Badge variant="secondary">Draft</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {service.description || 'No description'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">Order: {service.order_num}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenServiceModal(service)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteService(service.id, service.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add Another Service Button */}
                    <div className="pt-4 border-t">
                      <Button 
                        variant="outline" 
                        className="w-full border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-colors"
                        onClick={() => handleOpenServiceModal()}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Another Service
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service Requests Tabs */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle>Service Requests</CardTitle>
                    <CardDescription>
                      {serviceRequestTab === 'active' ? `${filteredActiveRequests.length} active request${filteredActiveRequests.length !== 1 ? 's' : ''}` : `${filteredArchivedRequests.length} archived`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search requests..."
                        value={serviceRequestSearch}
                        onChange={(e) => setServiceRequestSearch(e.target.value)}
                        className="pl-8 w-[200px]"
                      />
                    </div>
                    <Select value={serviceRequestStatusFilter} onValueChange={(value: string) => setServiceRequestStatusFilter(value)}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    {(serviceRequestSearch || serviceRequestStatusFilter !== 'all') && (
                      <Button variant="ghost" size="sm" onClick={() => { setServiceRequestSearch(''); setServiceRequestStatusFilter('all'); }}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Tabs value={serviceRequestTab} onValueChange={setServiceRequestTab}>
                  <TabsList className="grid text-white w-full grid-cols-2 mb-3">
                    <TabsTrigger value="active">
                      Active Requests ({filteredActiveRequests.length})
                    </TabsTrigger>
                    <TabsTrigger value="logs">
                      Service Request Logs ({filteredArchivedRequests.length})
                    </TabsTrigger>
                  </TabsList>

                  {/* Active Service Requests */}
                  <TabsContent value="active" className="mt-0">
                    <div className="max-h-[500px] overflow-y-auto pr-1">
                      {filteredActiveRequests.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>{serviceRequestSearch || serviceRequestStatusFilter !== 'all' ? 'No requests match your filters.' : 'No active service requests.'}</p>
                          {!serviceRequestSearch && serviceRequestStatusFilter === 'all' && (
                            <p className="text-sm mt-2">Requests submitted through the Additional Services page will appear here.</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="text-xs text-gray-500 mb-1">
                            Showing {filteredActiveRequests.length} of {serviceRequests.length} requests
                          </div>
                          {filteredActiveRequests.map((request) => (
                            <div key={request.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold truncate">{request.name}</h3>
                                    <Badge
                                      variant={request.status === 'Pending' ? 'secondary' :
                                              request.status === 'In Progress' ? 'default' : 'outline'}
                                      className="text-xs shrink-0"
                                    >
                                      {request.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 truncate">
                                    <span className="font-medium">Service:</span> {request.serviceTitle}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {request.organization} • {new Date(request.submittedAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <Button variant="outline" size="sm" onClick={() => { setViewingServiceRequest(request); setShowServiceRequestModal(true); }}>
                                    <Eye className="h-4 w-4 mr-1" />View
                                  </Button>
                                  <Select
                                    value={request.status}
                                    onValueChange={async (value) => {
                                      const updatedRequests = serviceRequests.map(req =>
                                        req.id === request.id ? { ...req, status: value } : req
                                      );
                                      setServiceRequests(updatedRequests);
                                      await supabase
                                        .from('admin_service_requests')
                                        .update({ status: value })
                                        .eq('id', String(request.id));
                                      logActivity('service', 'updated status', request.serviceTitle);
                                      if (value === 'Completed' || value === 'Done') {
                                        if (confirm('Mark this request as complete and move to logs?')) {
                                          await handleArchiveRequest(request.id, true);
                                        }
                                      }
                                    }}
                                  >
                                    <SelectTrigger className="w-28 h-8 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Pending">Pending</SelectItem>
                                      <SelectItem value="In Progress">In Progress</SelectItem>
                                      <SelectItem value="Completed">Completed</SelectItem>
                                      <SelectItem value="Done">Done</SelectItem>
                                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleArchiveRequest(request.id, true)} title="Archive">
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700" onClick={async () => {
                                    if (confirm('Are you sure you want to delete this service request?')) {
                                      await supabase.from('admin_service_requests').delete().eq('id', String(request.id));
                                      loadServiceRequests();
                                      logActivity('service', 'deleted request', request.serviceTitle);
                                    }
                                  }}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Service Request Logs */}
                  <TabsContent value="logs" className="mt-0">
                    <div className="max-h-[500px] overflow-y-auto pr-1">
                      {filteredArchivedRequests.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>{serviceRequestSearch || serviceRequestStatusFilter !== 'all' ? 'No archived requests match your filters.' : 'No archived requests.'}</p>
                          {!serviceRequestSearch && serviceRequestStatusFilter === 'all' && (
                            <p className="text-sm mt-2">Completed and archived requests will appear here.</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filteredArchivedRequests.map((request) => (
                            <div key={request.id} className="border rounded-lg p-3 bg-gray-50">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold truncate">{request.name}</h3>
                                    <Badge variant="outline" className="text-xs text-green-600 border-green-600 shrink-0">
                                      {request.status}
                                    </Badge>
                                    {request.archived && (
                                      <Badge variant="secondary" className="text-xs shrink-0">Archived</Badge>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                                    <span><span className="font-medium text-gray-600">Service:</span> {request.serviceTitle}</span>
                                    <span><span className="font-medium text-gray-600">Org:</span> {request.organization}</span>
                                    <span><span className="font-medium text-gray-600">Email:</span> {request.email}</span>
                                  </div>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Submitted: {new Date(request.submittedAt).toLocaleString()}
                                  </p>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                  <Button variant="outline" size="sm" onClick={() => handleArchiveRequest(request.id, false)} title="Restore to active requests">
                                    <Clock className="h-4 w-4 mr-1" />Restore
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={async () => {
                                    if (confirm('Permanently delete this archived request?')) {
                                      await supabase.from('admin_service_requests').delete().eq('id', String(request.id));
                                      loadServiceRequests();
                                      logActivity('service', 'deleted archived request', request.serviceTitle);
                                    }
                                  }}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Resource Management</h2>
              <Button variant="ustp" onClick={() => handleOpenResourceModal()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Resource
              </Button>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle>Resources</CardTitle>
                    <CardDescription>
                      {resourceTab === 'templates' ? `${filteredTemplates.length} template${filteredTemplates.length !== 1 ? 's' : ''}` : `${filteredGuidelines.length} guideline${filteredGuidelines.length !== 1 ? 's' : ''}`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search resources..."
                        value={resourceSearchTerm}
                        onChange={(e) => setResourceSearchTerm(e.target.value)}
                        className="pl-8 w-[200px]"
                      />
                    </div>
                    {resourceSearchTerm && (
                      <Button variant="ghost" size="sm" onClick={() => setResourceSearchTerm('')}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Tabs value={resourceTab} onValueChange={setResourceTab}>
                  <TabsList className="grid w-full grid-cols-2 text-white mb-3">
                    <TabsTrigger value="templates">Templates ({filteredTemplates.length})</TabsTrigger>
                    <TabsTrigger value="guidelines">Guidelines ({filteredGuidelines.length})</TabsTrigger>
                  </TabsList>

                  {/* Templates Tab */}
                  <TabsContent value="templates" className="mt-0">
                    <div className="max-h-[500px] overflow-y-auto pr-1">
                      {filteredTemplates.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
                          <p>{resourceSearchTerm ? 'No templates match your search.' : 'No templates yet.'}</p>
                          {!resourceSearchTerm && (
                            <p className="text-sm mt-2">Click "Add Resource" to create one.</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filteredTemplates.map((resource) => (
                            <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold truncate">{resource.title}</h3>
                                  <Badge variant="outline" className="text-xs shrink-0">{resource.type}</Badge>
                                  <Badge
                                    variant={resource.published ? 'default' : 'secondary'}
                                    className={`text-xs shrink-0 ${resource.published ? 'bg-green-500' : ''}`}
                                  >
                                    {resource.published ? 'Published' : 'Unpublished'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 truncate">{resource.content}</p>
                              </div>
                              <div className="flex items-center gap-1 ml-3 shrink-0">
                                <Button variant="ghost" size="sm" onClick={() => handleToggleResourcePublish(resource.id, resource.published, resource.title)} title={resource.published ? 'Unpublish' : 'Publish'}>
                                  {resource.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleOpenResourceModal(resource)} title="Edit">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteResource(resource.id, resource.title)} title="Delete">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Guidelines Tab */}
                  <TabsContent value="guidelines" className="mt-0">
                    <div className="max-h-[500px] overflow-y-auto pr-1">
                      {filteredGuidelines.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
                          <p>{resourceSearchTerm ? 'No guidelines match your search.' : 'No guidelines yet.'}</p>
                          {!resourceSearchTerm && (
                            <p className="text-sm mt-2">Click "Add Resource" to create one.</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {filteredGuidelines.map((resource) => (
                            <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold truncate">{resource.title}</h3>
                                  <Badge variant="outline" className="text-xs shrink-0">{resource.type}</Badge>
                                  <Badge
                                    variant={resource.published ? 'default' : 'secondary'}
                                    className={`text-xs shrink-0 ${resource.published ? 'bg-green-500' : ''}`}
                                  >
                                    {resource.published ? 'Published' : 'Unpublished'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 truncate">{resource.content}</p>
                              </div>
                              <div className="flex items-center gap-1 ml-3 shrink-0">
                                <Button variant="ghost" size="sm" onClick={() => handleToggleResourcePublish(resource.id, resource.published, resource.title)} title={resource.published ? 'Unpublish' : 'Publish'}>
                                  {resource.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleOpenResourceModal(resource)} title="Edit">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteResource(resource.id, resource.title)} title="Delete">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {currentUserRole === 'admin' && (
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Management</h2>
              <Button variant="ustp" onClick={() => handleOpenUserModal()}>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>

            {/* User Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-primary/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-primary">{users.filter(u => u.role === 'admin').length}</div>
                    <div className="text-sm text-muted-foreground">Admins</div>
                  </div>
                  <div className="bg-secondary/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-secondary">{users.filter(u => u.role === 'faculty').length}</div>
                    <div className="text-sm text-muted-foreground">Faculty</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</div>
                    <div className="text-sm text-muted-foreground">Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p>No users found. Click "Add User" to create the first user.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left p-3 text-sm font-semibold text-gray-700">Name</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700">Email</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700">Department</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700">Role</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
                          <th className="text-left p-3 text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">
                              <div>
                                <div className="font-medium">{user.full_name}</div>
                                {user.employee_id && (
                                  <div className="text-xs text-muted-foreground">ID: {user.employee_id}</div>
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-sm">{user.email}</td>
                            <td className="p-3 text-sm">{user.department || '-'}</td>
                            <td className="p-3">
                              <Badge variant={
                                user.role === 'admin' ? 'default' :
                                user.role === 'faculty' ? 'secondary' : 'outline'
                              }>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Badge variant={
                                user.status === 'active' ? 'default' :
                                user.status === 'inactive' ? 'secondary' : 'destructive'
                              } className={user.status === 'active' ? 'bg-green-500' : ''}>
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleOpenUserModal(user)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleResetPassword(user.email)}
                                  title="Send password reset email"
                                >
                                  <Mail className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id, user.full_name)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Delete News Confirmation Dialog */}
      <Dialog open={showDeleteNewsDialog} onOpenChange={setShowDeleteNewsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteNewsTarget?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteNewsTarget && (() => {
            const article = news.find(a => a.id === deleteNewsTarget.id);
            return (
              <div className="bg-white rounded-lg p-3 space-y-1 text-sm border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={article?.status === 'Published' ? 'bg-green-600' : 'bg-yellow-600'}>{article?.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{article?.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{article?.date}</span>
                </div>
              </div>
            );
          })()}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => {
              setShowDeleteNewsDialog(false);
              setDeleteNewsTarget(null);
            }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteNews}>
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* News Edit Modal */}
      <Dialog open={showNewsModal} onOpenChange={setShowNewsModal}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editingNews ? 'Edit News Article' : 'Create News Article'}
            </DialogTitle>
            <DialogDescription>
              {editingNews ? 'Update the news article information below.' : 'Fill in the details for the new news article.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modal-news-title" className="ml-2">Article Title *</Label>
                <Input 
                  id="modal-news-title" 
                  className="ml-2 mr-2"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                  placeholder="Enter article title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-news-category" className="ml-2">Category *</Label>
                <Select value={newsForm.category} onValueChange={(value) => setNewsForm({...newsForm, category: value})}>
                  <SelectTrigger className="ml-2 mr-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Partnerships">Partnerships</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Innovation">Innovation</SelectItem>
                    <SelectItem value="Announcements">Announcements</SelectItem>
                    <SelectItem value="Patent">Patent</SelectItem>
                    <SelectItem value="Research">Research</SelectItem>
                    <SelectItem value="Licensing">Licensing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-news-author" className="ml-2">Author</Label>
                <Input 
                  id="modal-news-author" 
                  className="ml-2 mr-2"
                  value={newsForm.author}
                  onChange={(e) => setNewsForm({...newsForm, author: e.target.value})}
                  placeholder="Article author"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-news-date" className="ml-2">Publication Date</Label>
                <Input 
                  id="modal-news-date" 
                  type="date" 
                  className="ml-2 mr-2"
                  value={newsForm.date}
                  onChange={(e) => setNewsForm({...newsForm, date: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-news-excerpt" className="ml-2">Excerpt</Label>
              <Textarea 
                id="modal-news-excerpt" 
                className="ml-2 mr-2"
                value={newsForm.excerpt}
                onChange={(e) => setNewsForm({...newsForm, excerpt: e.target.value})}
                placeholder="Brief summary of the article" 
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="modal-news-content" className="ml-2">Article Content *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.multiple = true;
                    input.onchange = async (e) => {
                      const files = Array.from((e.target as HTMLInputElement).files || []);
                      if (files.length === 0) return;
                      const startIndex = existingContentImages.length + newsForm.contentImages.length;
                      const newFiles = [...newsForm.contentImages, ...files];
                      let markers = '';
                      files.forEach((_, i) => {
                        markers += `\n[IMAGE:${startIndex + i}]\n`;
                      });
                      const textarea = document.getElementById('modal-news-content') as HTMLTextAreaElement;
                      if (textarea) {
                        const pos = textarea.selectionStart;
                        const content = newsForm.content;
                        const newContent = content.slice(0, pos) + markers + content.slice(pos);
                        setNewsForm({...newsForm, content: newContent, contentImages: newFiles});
                      } else {
                        setNewsForm({...newsForm, content: newsForm.content + markers, contentImages: newFiles});
                      }
                    };
                    input.click();
                  }}
                >
                  <Upload className="h-4 w-4 mr-1" /> Insert Image
                </Button>
              </div>
              <Textarea 
                id="modal-news-content" 
                className="ml-2 mr-2"
                value={newsForm.content}
                onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                placeholder="Full article content. Use 'Insert Image' to add images inline." 
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                Use "Insert Image" to add images inline. They appear as [IMAGE:N] markers in the text.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-news-image" className="ml-2">Featured Image</Label>
              <Input 
                id="modal-news-image" 
                type="file" 
                accept="image/*" 
                className="ml-2 mr-2"
                onChange={(e) => setNewsForm({...newsForm, image: e.target.files?.[0] || null})}
              />
            </div>
            
            {/* YouTube URL in Modal */}
            <div className="space-y-2">
              <Label htmlFor="modal-news-youtube-url" className="ml-2">YouTube Video URL</Label>
              <Input 
                id="modal-news-youtube-url" 
                type="url" 
                className="ml-2 mr-2"
                placeholder="https://www.youtube.com/watch?v=..."
                value={newsForm.youtubeUrl}
                onChange={(e) => setNewsForm({...newsForm, youtubeUrl: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter className="flex-shrink-0 border-t pt-4 mt-2">
            <Button variant="outline" onClick={() => {
              setShowNewsModal(false);
              setExistingContentImages([]);
            }}>
              Cancel
            </Button>
            <Button variant="ustp" onClick={() => {
              if (editingNews) {
                handlePublishNews();
              } else {
                handlePublishNews();
              }
            }}>
              {editingNews ? 'Update Article' : 'Publish Article'}
            </Button>
            <Button variant="outline" onClick={() => {
              if (editingNews) {
                handleSaveDraft();
              } else {
                handleSaveDraft();
              }
            }}>
              {editingNews ? 'Save Changes as Draft' : 'Save as Draft'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Patent Edit Modal */}
      <Dialog open={showPatentModal} onOpenChange={setShowPatentModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Patent
            </DialogTitle>
            <DialogDescription>
              Update the patent information below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="modal-patent-title">Patent Title *</Label>
              <Input 
                id="modal-patent-title" 
                value={patentEditForm.title}
                onChange={(e) => setPatentEditForm({...patentEditForm, title: e.target.value})}
                placeholder="Enter patent title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-patent-id">Patent ID</Label>
              <Input 
                id="modal-patent-id" 
                value={patentEditForm.patentId}
                onChange={(e) => setPatentEditForm({...patentEditForm, patentId: e.target.value})}
                placeholder="Enter patent ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-inventors">Inventors</Label>
              <Input 
                id="modal-inventors" 
                value={patentEditForm.inventors}
                onChange={(e) => setPatentEditForm({...patentEditForm, inventors: e.target.value})}
                placeholder="Enter inventors (comma separated)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-field">Field *</Label>
              <Select value={patentEditForm.field} onValueChange={(value) => setPatentEditForm({...patentEditForm, field: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="materials">Materials Science</SelectItem>
                  <SelectItem value="food">Food Technology</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="biotechnology">Biotechnology</SelectItem>
                  <SelectItem value="information-technology">Information Technology</SelectItem>
                  <SelectItem value="environmental-science">Environmental Science</SelectItem>
                  <SelectItem value="energy">Energy Technology</SelectItem>
                  <SelectItem value="medical">Medical Technology</SelectItem>
                  <SelectItem value="chemical">Chemical Engineering</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-status">Status *</Label>
              <Select value={patentEditForm.status} onValueChange={(value) => setPatentEditForm({...patentEditForm, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Filed">Filed</SelectItem>
                  <SelectItem value="Registered">Registered</SelectItem>
                  <SelectItem value="Commercialized">Commercialized</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-year">Year Added</Label>
              <Input 
                id="modal-year" 
                type="number" 
                min="1900" 
                max="2100" 
                value={patentEditForm.year}
                onChange={(e) => setPatentEditForm({...patentEditForm, year: e.target.value})}
                placeholder="Enter year"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modal-description">Description</Label>
              <Textarea 
                id="modal-description" 
                value={patentEditForm.description}
                onChange={(e) => setPatentEditForm({...patentEditForm, description: e.target.value})}
                placeholder="Enter brief description of the patent"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-abstract">Abstract</Label>
              <Textarea 
                id="modal-abstract" 
                value={patentEditForm.abstract}
                onChange={(e) => setPatentEditForm({...patentEditForm, abstract: e.target.value})}
                placeholder="Enter patent abstract"
                rows={4}
              />
            </div>
            
            {/* Attached Files Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Attached Files</Label>
                <span className="text-xs text-muted-foreground">
                  {patentEditForm.files.filter(f => !patentEditFilesToDelete.includes(f.url)).length + patentEditNewFiles.length} file(s)
                </span>
              </div>
              
              {/* Existing Files from files array */}
              {patentEditForm.files
                .filter(file => !patentEditFilesToDelete.includes(file.url))
                .map((file, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 border rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name || 'PDF Document'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {index === 0 ? 'Primary Document' : 'Additional Document'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setPatentEditFilesToDelete([...patentEditFilesToDelete, file.url])}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* Legacy single file support (for backward compatibility) */}
              {patentEditForm.file_url && !patentEditFilesToDelete.includes(patentEditForm.file_url) && 
               !patentEditForm.files.some(f => f.url === patentEditForm.file_url) && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 border rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {patentEditForm.file_name || 'PDF Document'}
                    </p>
                    <p className="text-xs text-gray-500">PDF Document</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(patentEditForm.file_url, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setPatentEditFilesToDelete([...patentEditFilesToDelete, patentEditForm.file_url])}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              )}
              
              {/* New Files to Upload */}
              {patentEditNewFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-blue-600">Ready to upload</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => {
                      setPatentEditNewFiles(patentEditNewFiles.filter((_, i) => i !== index));
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ))}
              
              {/* Add File Button */}
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPatentEditNewFiles([...patentEditNewFiles, e.target.files[0]]);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <Button variant="outline" size="sm" className="w-full relative pointer-events-none">
                  <Upload className="h-4 w-4 mr-2" />
                  Add PDF File
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowPatentModal(false);
              setEditingPatent(null);
              setPatentEditNewFiles([]);
              setPatentEditFilesToDelete([]);
              setPatentEditForm({
                title: '',
                patentId: '',
                inventors: '',
                field: '',
                description: '',
                abstract: '',
                status: 'Filed',
                year: new Date().getFullYear().toString(),
                file_url: '',
                file_name: '',
                files: []
              });
            }}>
              Cancel
            </Button>
            <Button variant="ustp" onClick={handleUpdatePatent} disabled={uploadingPatent}>
              {uploadingPatent ? 'Updating...' : 'Update Patent'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Patent Download Dialog */}
      <Dialog open={showDownloadDialog} onOpenChange={(open) => {
        setShowDownloadDialog(open);
        if (!open) {
          setSelectedPatentsForExport([]);
          setPatentExportMode('all');
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Download Patent Portfolio</DialogTitle>
            <DialogDescription>
              Select which patents and fields to include in the CSV export.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Export Mode Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Patents to Export:</Label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    name="exportMode"
                    value="all"
                    checked={patentExportMode === 'all'}
                    onChange={() => setPatentExportMode('all')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm">All filtered patents ({patents.filter((patent) => {
                    const matchesSearch = !patentSearchTerm || 
                      patent.title?.toLowerCase().includes(patentSearchTerm.toLowerCase()) ||
                      patent.patentId?.toLowerCase().includes(patentSearchTerm.toLowerCase()) ||
                      patent.inventors?.toLowerCase().includes(patentSearchTerm.toLowerCase());
                    const matchesField = patentFieldFilter === 'all' || 
                      patent.field?.toLowerCase() === patentFieldFilter.toLowerCase();
                    return matchesSearch && matchesField;
                  }).length})</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    name="exportMode"
                    value="selected"
                    checked={patentExportMode === 'selected'}
                    onChange={() => setPatentExportMode('selected')}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm">Selected patents only ({selectedPatentsForExport.length})</span>
                </label>
              </div>
            </div>
            
            {/* Patent Selection List (when in selected mode) */}
            {patentExportMode === 'selected' && (
              <div className="border rounded-lg p-3 max-h-[200px] overflow-y-auto">
                <div className="text-xs text-muted-foreground mb-2">
                  Check the patents you want to export:
                </div>
                <div className="space-y-1">
                  {patents.filter((patent) => {
                    const matchesSearch = !patentSearchTerm || 
                      patent.title?.toLowerCase().includes(patentSearchTerm.toLowerCase()) ||
                      patent.patentId?.toLowerCase().includes(patentSearchTerm.toLowerCase()) ||
                      patent.inventors?.toLowerCase().includes(patentSearchTerm.toLowerCase());
                    const matchesField = patentFieldFilter === 'all' || 
                      patent.field?.toLowerCase() === patentFieldFilter.toLowerCase();
                    return matchesSearch && matchesField;
                  }).map((patent) => (
                    <div key={patent.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        id={`export-patent-${patent.id}`}
                        checked={selectedPatentsForExport.includes(patent.id)}
                        onChange={() => {
                          if (selectedPatentsForExport.includes(patent.id)) {
                            setSelectedPatentsForExport(selectedPatentsForExport.filter(id => id !== patent.id));
                          } else {
                            setSelectedPatentsForExport([...selectedPatentsForExport, patent.id]);
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                      />
                      <label htmlFor={`export-patent-${patent.id}`} className="text-sm cursor-pointer flex-1 truncate">
                        <span className="font-medium">{patent.title}</span>
                        {patent.patentId && <span className="text-muted-foreground ml-2">({patent.patentId})</span>}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedPatentsForExport.length === 0 && (
                  <p className="text-sm text-amber-600 text-center py-2">
                    Please select at least one patent to export.
                  </p>
                )}
              </div>
            )}
            
            <hr />
            
            {/* Field Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Fields to Include:</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {patentFields.map((field) => (
                  <div key={field.key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`field-${field.key}`}
                      checked={selectedPatentFields.includes(field.key)}
                      onChange={() => togglePatentField(field.key)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor={`field-${field.key}`} className="text-sm cursor-pointer">
                      {field.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
              <p className="font-medium">CSV Format</p>
              <p className="mt-1">Required columns for upload: title, field</p>
              <p>Optional columns: patentId, inventors, status, year, description, abstract</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDownloadDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="ustp" 
              onClick={handleDownloadCSV}
              disabled={selectedPatentFields.length === 0 || (patentExportMode === 'selected' && selectedPatentsForExport.length === 0)}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Edit Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? 'Edit Event' : 'Create Event'}
            </DialogTitle>
            <DialogDescription>
              {editingEvent ? 'Update the event information below.' : 'Fill in the details for the new event.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modal-event-title">Event Title *</Label>
                <Input 
                  id="modal-event-title" 
                  value={eventForm.title}
                  onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                  placeholder="Enter event title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-event-type">Event Type</Label>
                <Select 
                  value={eventForm.type}
                  onValueChange={(value) => setEventForm({...eventForm, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="showcase">Showcase</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-event-date">Event Date *</Label>
                <Input 
                  id="modal-event-date" 
                  type="date" 
                  value={eventForm.date}
                  onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-event-time">Event Time</Label>
                <Input 
                  id="modal-event-time" 
                  type="time" 
                  value={eventForm.time}
                  onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-event-location">Location</Label>
                <Input 
                  id="modal-event-location" 
                  placeholder="Event venue" 
                  value={eventForm.location}
                  onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-event-capacity">Capacity</Label>
                <Input 
                  id="modal-event-capacity" 
                  type="number" 
                  placeholder="Maximum attendees" 
                  value={eventForm.capacity}
                  onChange={(e) => setEventForm({...eventForm, capacity: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-event-description">Event Description</Label>
              <Textarea 
                id="modal-event-description" 
                placeholder="Detailed description of the event" 
                rows={4} 
                value={eventForm.description}
                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="modal-event-registration"
                checked={eventForm.registrationOpen}
                onChange={(e) => setEventForm({...eventForm, registrationOpen: e.target.checked})}
                className="h-4 w-4"
              />
              <Label htmlFor="modal-event-registration">Registration Open</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventModal(false)}>
              Cancel
            </Button>
            <Button variant="ustp" onClick={handleCreateEvent}>
              {editingEvent ? 'Update Event' : 'Create Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archived Event Details Modal */}
      <Dialog open={showArchivedEventDetailModal} onOpenChange={setShowArchivedEventDetailModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Event Details
            </DialogTitle>
            <DialogDescription>
              {selectedArchivedEvent && (
                <span>
                  <strong>{selectedArchivedEvent.title}</strong>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedArchivedEvent && (
            <div className="space-y-5">
              {/* Status & Type */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-xs ${selectedArchivedEvent.status === 'Completed' ? 'text-green-600 border-green-600' : selectedArchivedEvent.status === 'Cancelled' ? 'text-red-600 border-red-600' : 'text-gray-600 border-gray-600'}`}
                >
                  {selectedArchivedEvent.status}
                </Badge>
                {selectedArchivedEvent.archived && (
                  <Badge variant="secondary" className="text-xs">Archived</Badge>
                )}
                {selectedArchivedEvent.type && (
                  <Badge variant="outline" className="text-xs capitalize">
                    {selectedArchivedEvent.type}
                  </Badge>
                )}
              </div>

              {/* Event Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedArchivedEvent.date}</span>
                </div>
                {selectedArchivedEvent.time && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedArchivedEvent.time}</span>
                  </div>
                )}
                {selectedArchivedEvent.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedArchivedEvent.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedArchivedEvent.attendees || 0} attendees{selectedArchivedEvent.capacity ? ` / ${selectedArchivedEvent.capacity} capacity` : ''}</span>
                </div>
              </div>

              {/* Description */}
              {selectedArchivedEvent.description && (
                <div>
                  <h4 className="font-medium text-sm mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedArchivedEvent.description}</p>
                </div>
              )}

              {/* Image */}
              {selectedArchivedEvent.image && (
                <div>
                  <h4 className="font-medium text-sm mb-1">Event Image</h4>
                  <img
                    src={selectedArchivedEvent.image}
                    alt={selectedArchivedEvent.title}
                    className="w-full max-h-64 object-cover rounded-lg border"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleViewRegistrations(selectedArchivedEvent);
                    setShowArchivedEventDetailModal(false);
                  }}
                >
                  <Users className="h-4 w-4 mr-1" />View Registrations
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await handleArchiveEvent(selectedArchivedEvent.id, false);
                    setShowArchivedEventDetailModal(false);
                    setSelectedArchivedEvent(null);
                  }}
                >
                  <Clock className="h-4 w-4 mr-1" />Restore to Active
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArchivedEventDetailModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Registrations Modal */}
      <Dialog open={showRegistrationsModal} onOpenChange={setShowRegistrationsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Event Registrations
            </DialogTitle>
            <DialogDescription>
              {selectedEventForRegistrations && (
                <span>
                  <strong>{selectedEventForRegistrations.title}</strong>
                  {selectedEventForRegistrations.date && (
                    <span className="ml-2 text-muted-foreground">
                      - {new Date(selectedEventForRegistrations.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  )}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {loadingRegistrations ? (
            <div className="py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading registrations...</p>
            </div>
          ) : eventRegistrations.length === 0 ? (
            <div className="py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No registrations found for this event.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Registrations will appear here when users sign up through the resources page.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <Badge variant="outline" className="text-sm">
                  {eventRegistrations.length} Total Registrations
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportRegistrations}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export CSV
                </Button>
              </div>
              
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="p-3 text-left font-medium text-gray-700">Name</th>
                        <th className="p-3 text-left font-medium text-gray-700">Email</th>
                        <th className="p-3 text-left font-medium text-gray-700">Organization</th>
                        <th className="p-3 text-left font-medium text-gray-700">Status</th>
                        <th className="p-3 text-left font-medium text-gray-700">Registered</th>
                        <th className="p-3 text-left font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventRegistrations.map((reg) => (
                        <tr key={reg.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-3">
                            <div className="font-medium">{reg.full_name}</div>
                            {reg.phone && (
                              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Phone className="h-3 w-3" />
                                {reg.phone}
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              {reg.email}
                            </div>
                          </td>
                          <td className="p-3">
                            {reg.organization ? (
                              <div>
                                <div className="flex items-center gap-1">
                                  <Building className="h-3 w-3 text-muted-foreground" />
                                  {reg.organization}
                                </div>
                                {reg.position && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {reg.position}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="p-3">
                            <Badge 
                              variant={
                                reg.status === 'confirmed' ? 'default' : 
                                reg.status === 'cancelled' ? 'destructive' : 
                                reg.status === 'attended' ? 'default' : 'secondary'
                              }
                              className={
                                reg.status === 'attended' ? 'bg-green-600 hover:bg-green-700' : ''
                              }
                            >
                              {reg.status}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(reg.registered_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              {reg.status !== 'confirmed' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-7 px-2 text-green-600 hover:text-green-700 hover:border-green-300"
                                  onClick={() => handleUpdateRegistrationStatus(reg.id, 'confirmed')}
                                  title="Confirm registration"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                              )}
                              {reg.status !== 'cancelled' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-7 px-2 text-red-600 hover:text-red-700 hover:border-red-300"
                                  onClick={() => handleUpdateRegistrationStatus(reg.id, 'cancelled')}
                                  title="Cancel registration"
                                >
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              )}
                              {reg.status !== 'attended' && reg.status === 'confirmed' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:border-blue-300"
                                  onClick={() => handleUpdateRegistrationStatus(reg.id, 'attended')}
                                  title="Mark as attended"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {eventRegistrations.some((reg: any) => reg.dietary_requirements || reg.special_requests) && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2 text-gray-700">Special Notes</h4>
                  <div className="space-y-2">
                    {eventRegistrations
                      .filter((reg: any) => reg.dietary_requirements || reg.special_requests)
                      .map((reg: any) => (
                        <div key={reg.id} className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm">
                          <span className="font-medium text-gray-800">{reg.full_name}:</span>
                          {reg.dietary_requirements && (
                            <span className="ml-2 text-orange-600">
                              Dietary: {reg.dietary_requirements}
                            </span>
                          )}
                          {reg.special_requests && (
                            <span className="ml-2 text-gray-600">
                              Notes: {reg.special_requests}
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRegistrationsModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Add/Edit Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Edit User' : 'Add New User'}
            </DialogTitle>
            <DialogDescription>
              {editingUser ? 'Update the user information below.' : 'Create a new user account. The user will be able to log in with the email and temporary password.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-full-name">Full Name *</Label>
                <Input 
                  id="user-full-name" 
                  value={userForm.full_name}
                  onChange={(e) => setUserForm({...userForm, full_name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-email">Email *</Label>
                <Input 
                  id="user-email" 
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-password">
                  {editingUser ? 'New Password (leave blank to keep current)' : 'Temporary Password *'}
                </Label>
                <Input 
                  id="user-password" 
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                  placeholder={editingUser ? 'Leave blank to keep current' : 'Enter temporary password'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-employee-id">Employee/Faculty ID</Label>
                <Input 
                  id="user-employee-id" 
                  value={userForm.employee_id}
                  onChange={(e) => setUserForm({...userForm, employee_id: e.target.value})}
                  placeholder="Enter ID number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-department">Department/College</Label>
                <Input 
                  id="user-department" 
                  value={userForm.department}
                  onChange={(e) => setUserForm({...userForm, department: e.target.value})}
                  placeholder="e.g. College of Engineering"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-phone">Phone Number</Label>
                <Input 
                  id="user-phone" 
                  value={userForm.phone}
                  onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-role">Role *</Label>
                <Select value={userForm.role} onValueChange={(value) => setUserForm({...userForm, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-status">Status</Label>
                <Select value={userForm.status} onValueChange={(value) => setUserForm({...userForm, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowUserModal(false);
              setEditingUser(null);
            }}>
              Cancel
            </Button>
            <Button variant="ustp" onClick={handleAddUser}>
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resource Modal */}
      <Dialog open={showResourceModal} onOpenChange={setShowResourceModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingResource ? 'Edit Resource' : 'Add New Resource'}
            </DialogTitle>
            <DialogDescription>
              {editingResource ? 'Update the resource information below.' : 'Fill in the details for the new resource.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resource-title">Title *</Label>
                <Input 
                  id="resource-title" 
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm({...resourceForm, title: e.target.value, slug: generateSlug(e.target.value)})}
                  placeholder="Enter resource title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource-category">Category *</Label>
                <Select 
                  value={resourceForm.category} 
                  onValueChange={(value) => {
                    const typeMap: Record<string, string> = {
                      'Templates': 'download',
                      'Guidelines': 'guide'
                    };
                    setResourceForm({
                      ...resourceForm, 
                      category: value,
                      type: typeMap[value] as any
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Templates">Templates</SelectItem>
                    <SelectItem value="Guidelines">Guidelines</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource-type">Resource Type *</Label>
                <Select 
                  value={resourceForm.type} 
                  onValueChange={(value) => setResourceForm({...resourceForm, type: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="download">Download</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resource-content">Description</Label>
              <Textarea 
                id="resource-content" 
                value={resourceForm.content}
                onChange={(e) => setResourceForm({...resourceForm, content: e.target.value})}
                placeholder="Enter description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resource-url">External URL (optional)</Label>
                <Input 
                  id="resource-url" 
                  value={resourceForm.url}
                  onChange={(e) => setResourceForm({...resourceForm, url: e.target.value})}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resource-file">File URL (optional)</Label>
                <Input 
                  id="resource-file" 
                  value={resourceForm.file_url}
                  onChange={(e) => setResourceForm({...resourceForm, file_url: e.target.value})}
                  placeholder="Link to file"
                />
              </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Upload File</Label>
                <span className="text-xs text-gray-500">Accepted: PDF, DOCX, XLSX, TXT</span>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  id="resource-upload"
                  type="file"
                  accept=".pdf,.docx,.xlsx,.txt"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const allowedTypes = [
                        'application/pdf',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'text/plain'
                      ];
                      if (!allowedTypes.includes(file.type) && 
                          !file.name.match(/\.(pdf|docx|xlsx|txt)$/i)) {
                        toast({ title: 'Validation Error', description: 'Please upload a PDF, DOCX, XLSX, or TXT file.', variant: 'destructive' })
                        return;
                      }
                      setUploadFile(file);
                      setUploadedFileName(file.name);
                    }
                  }}
                  className="flex-1"
                />
              </div>
              {uploadedFileName && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                  <FileText size={16} />
                  <span className="truncate">{uploadedFileName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadFile(null);
                      setUploadedFileName('');
                      setResourceForm({...resourceForm, file_url: ''});
                    }}
                    className="ml-auto text-gray-400 hover:text-red-500"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-500">
                Upload a file directly to storage. This will override any File URL entered above.
              </p>
            </div>



            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="resource-published"
                checked={resourceForm.published}
                onChange={(e) => setResourceForm({...resourceForm, published: e.target.checked})}
                className="h-4 w-4"
              />
              <Label htmlFor="resource-published">Publish immediately</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowResourceModal(false);
              setEditingResource(null);
              setUploadFile(null);
              setUploadedFileName('');
            }} disabled={uploading}>
              Cancel
            </Button>
            <Button variant="ustp" onClick={handleSaveResource} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {uploadFile ? 'Uploading...' : 'Saving...'}
                </>
              ) : (
                editingResource ? 'Update Resource' : 'Add Resource'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Resource Confirmation Modal */}
      <Dialog open={showDeleteResourceModal} onOpenChange={setShowDeleteResourceModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Resource</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{resourceToDelete?.title}"?
              <br /><br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowDeleteResourceModal(false);
              setResourceToDelete(null);
            }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteResource}>
              Delete Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Modal */}
      <Dialog open={showServiceModal} onOpenChange={setShowServiceModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
            <DialogDescription>
              {editingService ? 'Update the service details below.' : 'Fill in the details to create a new service.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="service-name">Service Name *</Label>
              <Input 
                id="service-name" 
                value={serviceForm.name}
                onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                placeholder="Enter service name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service-desc">Description</Label>
              <Textarea 
                id="service-desc" 
                value={serviceForm.description}
                onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                placeholder="Enter service description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service-icon">Icon</Label>
              <Select 
                value={serviceForm.icon} 
                onValueChange={(value) => setServiceForm({...serviceForm, icon: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wrench">Wrench (Tools)</SelectItem>
                  <SelectItem value="Shield">Shield (Protection)</SelectItem>
                  <SelectItem value="Handshake">Handshake (Partnership)</SelectItem>
                  <SelectItem value="BookOpen">Book Open (Education)</SelectItem>
                  <SelectItem value="FileText">File Text (Documents)</SelectItem>
                  <SelectItem value="Building">Building (Corporate)</SelectItem>
                  <SelectItem value="Lightbulb">Lightbulb (Innovation)</SelectItem>
                  <SelectItem value="Users">Users (Community)</SelectItem>
                  <SelectItem value="Rocket">Rocket (Startup)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service-timeline">Timeline</Label>
              <Input 
                id="service-timeline" 
                value={serviceForm.timeline}
                onChange={(e) => setServiceForm({...serviceForm, timeline: e.target.value})}
                placeholder="e.g., 3-6 months"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service-pricing">Pricing</Label>
              <Input 
                id="service-pricing" 
                value={serviceForm.pricing}
                onChange={(e) => setServiceForm({...serviceForm, pricing: e.target.value})}
                placeholder="e.g., Consultation fees apply"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service-features">Features (one per line)</Label>
              <Textarea 
                id="service-features" 
                value={serviceForm.features.join('\n')}
                onChange={(e) => setServiceForm({...serviceForm, features: e.target.value.split('\n').filter(f => f.trim())})}
                placeholder="Enter each feature on a new line"
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service-process">Process Steps (one per line)</Label>
              <Textarea 
                id="service-process" 
                value={serviceForm.process_steps.join('\n')}
                onChange={(e) => setServiceForm({...serviceForm, process_steps: e.target.value.split('\n').filter(p => p.trim())})}
                placeholder="Enter each process step on a new line"
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service-order">Display Order</Label>
              <Input 
                id="service-order" 
                type="number"
                value={serviceForm.order_num}
                onChange={(e) => setServiceForm({...serviceForm, order_num: parseInt(e.target.value) || 0})}
                placeholder="Enter display order"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="service-published"
                checked={serviceForm.published}
                onChange={(e) => setServiceForm({...serviceForm, published: e.target.checked})}
                className="h-4 w-4"
              />
              <Label htmlFor="service-published">Published (visible to public)</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowServiceModal(false);
              setEditingService(null);
              setServiceForm({
                id: null,
                name: '',
                description: '',
                icon: 'Wrench',
                order_num: 0,
                published: true,
                features: [],
                process_steps: [],
                timeline: '',
                pricing: '',
              });
            }}>
              Cancel
            </Button>
            <Button variant="ustp" onClick={handleSaveService}>
              {editingService ? 'Update Service' : 'Create Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activity Logs Modal */}
      <Dialog open={showActivityModal} onOpenChange={setShowActivityModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Activity Logs</DialogTitle>
            <DialogDescription>
              View all past activities and system events
            </DialogDescription>
          </DialogHeader>
          
          {/* Filter Buttons and Export */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={activityFilter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleActivityFilterChange('all')}
              >
                All
              </Button>
              <Button 
                variant={activityFilter === 'news' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleActivityFilterChange('news')}
              >
                News
              </Button>
              <Button 
                variant={activityFilter === 'technology' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleActivityFilterChange('technology')}
              >
                Technologies
              </Button>
              <Button 
                variant={activityFilter === 'event' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleActivityFilterChange('event')}
              >
                Events
              </Button>
              <Button 
                variant={activityFilter === 'service' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleActivityFilterChange('service')}
              >
                Services
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={exportActivitiesToCSV}
              disabled={allActivities.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
          
          {/* Activity List */}
          <div className="flex-1 overflow-y-auto">
            {activityLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : allActivities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No activities found
              </div>
            ) : (
              <div className="space-y-3">
                {allActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                      activity.type === 'news' ? 'bg-blue-500' :
                      activity.type === 'technology' ? 'bg-green-500' :
                      activity.type === 'service' ? 'bg-purple-500' :
                      activity.type === 'event' ? 'bg-orange-500' :
                      'bg-gray-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium capitalize">{activity.action}</span>
                        <span className="text-muted-foreground">{activity.type}</span>
                        <Badge variant="outline" className="text-xs">
                          {formatDate(activity.timestamp)}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium mt-1">{activity.title}</p>
                      {activity.description && (
                        <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowActivityModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Request Detail Modal */}
      <Dialog open={showServiceRequestModal} onOpenChange={setShowServiceRequestModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Service Request Details</DialogTitle>
            <DialogDescription>
              Complete information about this service request.
            </DialogDescription>
          </DialogHeader>
          
          {viewingServiceRequest && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-blue-900">{viewingServiceRequest.name}</h3>
                  <Badge 
                    variant={viewingServiceRequest.status === 'Pending' ? 'secondary' : 
                            viewingServiceRequest.status === 'In Progress' ? 'default' : 'outline'}
                    className="text-sm"
                  >
                    {viewingServiceRequest.status}
                  </Badge>
                </div>
                <p className="text-blue-700 font-medium">{viewingServiceRequest.serviceTitle}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Submitted: {new Date(viewingServiceRequest.submittedAt).toLocaleString()}
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-500">Email</span>
                    <p className="font-medium">{viewingServiceRequest.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Phone</span>
                    <p className="font-medium">{viewingServiceRequest.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Organization</span>
                    <p className="font-medium">{viewingServiceRequest.organization || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Position</span>
                    <p className="font-medium">{viewingServiceRequest.position || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Service Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-500">Number of Participants</span>
                    <p className="font-medium">{viewingServiceRequest.participants} people</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Preferred Date</span>
                    <p className="font-medium">{viewingServiceRequest.preferredDate || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Specific Needs */}
              {viewingServiceRequest.specificNeeds && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    Specific Needs & Requirements
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {viewingServiceRequest.specificNeeds}
                    </p>
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              {viewingServiceRequest.additionalNotes && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Additional Notes
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {viewingServiceRequest.additionalNotes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowServiceRequestModal(false);
                setViewingServiceRequest(null);
              }}
            >
              Close
            </Button>
            {viewingServiceRequest && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowServiceRequestModal(false);
                    handleArchiveRequest(viewingServiceRequest.id, true);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Archive Request
                </Button>
                <Button 
                  variant="ustp"
                  onClick={() => {
                    window.location.href = `mailto:${viewingServiceRequest.email}?subject=Re: ${viewingServiceRequest.serviceTitle} Service Request`;
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Reply via Email
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Patent Detail Modal */}
      <Dialog open={showPatentDetailModal} onOpenChange={setShowPatentDetailModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patent Details</DialogTitle>
            <DialogDescription>
              View detailed information about this patent.
            </DialogDescription>
          </DialogHeader>

          {selectedPatentForDetail && (
            <div className="space-y-6 py-4">
              {/* Title Section */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Title</Label>
                <h3 className="text-lg font-semibold">{selectedPatentForDetail.title}</h3>
              </div>

              {/* Patent ID and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Patent ID</Label>
                  <p className="font-medium">{selectedPatentForDetail.patentId || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <div>
                    <Badge variant={selectedPatentForDetail.status === 'Granted' ? 'default' : 'secondary'}>
                      {selectedPatentForDetail.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Field and Year */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Field</Label>
                  <p className="font-medium">{selectedPatentForDetail.field || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Year</Label>
                  <p className="font-medium">{selectedPatentForDetail.year || 'N/A'}</p>
                </div>
              </div>

              {/* Inventors */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Inventors</Label>
                <p className="font-medium">{selectedPatentForDetail.inventors || 'N/A'}</p>
              </div>

              {/* Abstract */}
              {selectedPatentForDetail.abstract && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Abstract</Label>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedPatentForDetail.abstract}</p>
                </div>
              )}

              {/* Description */}
              {selectedPatentForDetail.description && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Description</Label>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedPatentForDetail.description}</p>
                </div>
              )}

              {/* Attached Files */}
              {(selectedPatentForDetail.files?.length > 0 || selectedPatentForDetail.file_url) && (
                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground">
                    Attached Files ({selectedPatentForDetail.files?.length || 1})
                  </Label>
                  
                  {/* Files from files array */}
                  {selectedPatentForDetail.files?.map((file: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 border rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name || `Document ${index + 1}.pdf`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {index === 0 ? 'Primary Document' : 'Additional Document'}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(file.url, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                  
                  {/* Legacy single file support */}
                  {selectedPatentForDetail.file_url && !selectedPatentForDetail.files?.some((f: any) => f.url === selectedPatentForDetail.file_url) && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 border rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {selectedPatentForDetail.file_name || 'Patent Document.pdf'}
                        </p>
                        <p className="text-xs text-gray-500">PDF Document</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedPatentForDetail.file_url, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPatentDetailModal(false)}>
              Close
            </Button>
            {selectedPatentForDetail && (
              <Button
                variant="ustp"
                onClick={() => {
                  setShowPatentDetailModal(false);
                  handleEditPatent(selectedPatentForDetail);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Patent
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* IP Application Detail Modal */}
      <Dialog open={showIpAppDetailModal} onOpenChange={setShowIpAppDetailModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              {selectedIpApp?.application_number || 'No application number'}
            </DialogDescription>
          </DialogHeader>
          {selectedIpApp && (
            <div className="space-y-4">
              {/* Title & Status */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedIpApp.title || 'Untitled'}</h3>
                  <p className="text-sm text-gray-500">{selectedIpApp.application_number || ''}</p>
                </div>
                <Badge className={`${getIpAppStatusBadge(selectedIpApp.status)} text-white`}>
                  {getIpAppStatusDisplay(selectedIpApp.status)}
                </Badge>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">IP Type</p>
                  <p className="font-medium">{selectedIpApp.ip_type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Applicant</p>
                  <p className="font-medium">{selectedIpApp.applicant_full_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{selectedIpApp.applicant_email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="font-medium">{selectedIpApp.faculty?.department || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Submitted</p>
                  <p className="font-medium">{selectedIpApp.submitted_at ? formatDate(selectedIpApp.submitted_at) : 'Not submitted'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Updated</p>
                  <p className="font-medium">{formatDate(selectedIpApp.updated_at)}</p>
                </div>
                {selectedIpApp.classification && (selectedIpApp.ip_type === 'Utility Model' || selectedIpApp.ip_type === 'Copyright') && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Classification</p>
                    <p className="font-medium">
                      {selectedIpApp.classification}
                      {(selectedIpApp.classification === 'Other' || selectedIpApp.classification === 'Others') && selectedIpApp.classification_other
                        ? ` — ${selectedIpApp.classification_other}`
                        : ''}
                    </p>
                  </div>
                )}
              </div>

              {/* Trademark text fields */}
              {selectedIpApp.ip_type === 'Trademark' && (selectedIpApp.trademark_goods_services || selectedIpApp.trademark_mark_description) && (
                <div className="space-y-3">
                  {selectedIpApp.trademark_goods_services && (
                    <div>
                      <h4 className="font-medium mb-1">Goods / Services</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">{selectedIpApp.trademark_goods_services}</p>
                    </div>
                  )}
                  {selectedIpApp.trademark_mark_description && (
                    <div>
                      <h4 className="font-medium mb-1">Description of the Mark Representation</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">{selectedIpApp.trademark_mark_description}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Co-Inventors */}
              {Array.isArray(selectedIpApp.co_inventors) && selectedIpApp.co_inventors.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Co-Inventors ({selectedIpApp.co_inventors.length})</h4>
                  <div className="space-y-2">
                    {selectedIpApp.co_inventors.map((inv: any, idx: number) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm">
                        <p className="font-medium">{inv.name || `Co-Inventor #${idx + 1}`}</p>
                        {inv.nationality && <p className="text-gray-600">{inv.nationality}</p>}
                        {inv.email && <p className="text-gray-600">Email: {inv.email}</p>}
                        {inv.contact_number && <p className="text-gray-600">Contact: {inv.contact_number}</p>}
                        {inv.contribution && <p className="text-gray-600 mt-1">Contribution: {inv.contribution}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Abstract */}
              {selectedIpApp.abstract && (
                <div>
                  <h4 className="font-medium mb-1">Abstract</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedIpApp.abstract}</p>
                </div>
              )}

              {/* Detailed Description */}
              {selectedIpApp.detailed_description && (
                <div>
                  <h4 className="font-medium mb-1">Detailed Description</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedIpApp.detailed_description}</p>
                </div>
              )}

              {/* Attachments */}
              {selectedIpApp.attachments && selectedIpApp.attachments.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Attachments ({selectedIpApp.attachments.length})</h4>
                  <div className="space-y-2">
                    {selectedIpApp.attachments.map((att: any) => (
                      <div key={att.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{att.file_name}</p>
                          <p className="text-xs text-gray-500">{att.document_type || att.file_type}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(att.file_path, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              {selectedIpApp.admin_notes && (
                <div>
                  <h4 className="font-medium mb-1">Admin Notes</h4>
                  <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">{selectedIpApp.admin_notes}</p>
                </div>
              )}

              {/* Comments */}
              <div>
                <h4 className="font-medium mb-2">Comments</h4>

                {/* Comment Input */}
                <div className="space-y-2 mb-4">
                  <Textarea
                    placeholder="Add a comment..."
                    value={ipAppDetailNewComment}
                    onChange={(e) => setIpAppDetailNewComment(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleDetailModalComment}
                      disabled={!ipAppDetailNewComment.trim() || isSubmittingDetailComment}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      {isSubmittingDetailComment ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </div>
                </div>

                {ipAppDetailComments.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">No comments yet</p>
                ) : (
                  <div className="space-y-2">
                    {ipAppDetailComments.map((comment: any) => (
                      <div key={comment.id} className={`p-3 rounded-lg ${comment.commenter_role === 'Faculty' ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}>
                        <p className="text-sm text-gray-700">{comment.comment}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-600">{comment.commenter_name}</span>
                            <Badge variant={comment.commenter_role === 'Faculty' ? 'secondary' : 'outline'} className="text-xs">
                              {comment.commenter_role}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            {(selectedIpApp?.status === 'Submitted for Internal Review' || selectedIpApp?.status === 'Under Internal Review') && (
              <Button onClick={() => {
                setShowIpAppDetailModal(false);
                setIpAppReviewAction('approve');
                setIpAppReviewNotes('');
                setShowIpAppReviewModal(true);
              }}>
                Review Application
              </Button>
            )}
            <Button variant="outline" onClick={() => setShowIpAppDetailModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* IP Application Review Modal */}
      <Dialog open={showIpAppReviewModal} onOpenChange={setShowIpAppReviewModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
            <DialogDescription>
              {selectedIpApp?.application_number} - {selectedIpApp?.title || 'Untitled'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Status Display */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Current Status:</span>
              <Badge className={`${getIpAppStatusBadge(selectedIpApp?.status)} text-white`}>
                {getIpAppStatusDisplay(selectedIpApp?.status)}
              </Badge>
            </div>

            {/* Action Selection */}
            {(selectedIpApp?.status === 'Submitted for Internal Review' || selectedIpApp?.status === 'Under Internal Review') && (
              <div className="space-y-2">
                <Label>Action</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={ipAppReviewAction === 'approve' ? 'default' : 'outline'}
                    className={ipAppReviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
                    onClick={() => setIpAppReviewAction('approve')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    type="button"
                    variant={ipAppReviewAction === 'return' ? 'default' : 'outline'}
                    className={ipAppReviewAction === 'return' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                    onClick={() => setIpAppReviewAction('return')}
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Need Revision
                  </Button>
                  <Button
                    type="button"
                    variant={ipAppReviewAction === 'reject' ? 'default' : 'outline'}
                    className={ipAppReviewAction === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''}
                    onClick={() => setIpAppReviewAction('reject')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            )}

            {/* Granted action — only for applications already Approved for IPOPHL Filing.
                TPCO handles IPOPHL submission & examination offline, then comes back
                to mark the application Granted once the certificate is issued. */}
            {selectedIpApp?.status === 'Approved for IPOPHL Filing' && (
              <div className="space-y-2">
                <Label>Action</Label>
                <Button
                  type="button"
                  variant={ipAppReviewAction === 'granted' ? 'default' : 'outline'}
                  className={`w-full ${ipAppReviewAction === 'granted' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                  onClick={() => setIpAppReviewAction('granted')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark as Granted & Send Certification
                </Button>
              </div>
            )}

            {/* File Attachments for Faculty */}
            <div className="space-y-2">
              <Label>
                {ipAppReviewAction === 'granted' ? 'Certification File(s)' : 'Attach File(s) for Faculty'}
                {ipAppReviewAction === 'granted' && <span className="text-red-500"> *</span>}
              </Label>
              <p className="text-xs text-gray-500">
                {ipAppReviewAction === 'granted'
                  ? 'Upload the certification document(s) to send to the faculty.'
                  : 'Optionally attach supporting files (e.g., revision reference, guidance documents). The faculty will see these on their application detail page.'}
              </p>
              <Input
                type="file"
                multiple
                onChange={(e) => {
                  const selected = Array.from(e.target.files || []);
                  if (selected.length > 0) {
                    setIpAppReviewFiles(prev => [...prev, ...selected]);
                  }
                  e.target.value = '';
                }}
                className="cursor-pointer"
              />
              {ipAppReviewFiles.length > 0 && (
                <div className="space-y-1 mt-2">
                  {ipAppReviewFiles.map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 rounded px-2 py-1 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="h-3 w-3 text-blue-500 shrink-0" />
                        <span className="truncate" title={f.name}>{f.name}</span>
                        <span className="text-gray-400 shrink-0">({(f.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => setIpAppReviewFiles(prev => prev.filter((_, i) => i !== idx))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label>Comment {ipAppReviewAction !== 'approve' && <span className="text-red-500">*</span>}</Label>
              <Textarea
                placeholder="Enter your review comments... (required for revision/rejection)"
                value={ipAppReviewNotes}
                onChange={(e) => setIpAppReviewNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" disabled={isUploadingReviewFiles} onClick={() => {
              setShowIpAppReviewModal(false);
              setIpAppReviewNotes('');
              setIpAppReviewFiles([]);
              setSelectedIpApp(null);
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleIpAppReview}
              disabled={isUploadingReviewFiles}
              className={
                ipAppReviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                ipAppReviewAction === 'return' ? 'bg-orange-600 hover:bg-orange-700' :
                ipAppReviewAction === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                ipAppReviewAction === 'granted' ? 'bg-emerald-600 hover:bg-emerald-700' :
                'bg-blue-600 hover:bg-blue-700'
              }
            >
              {isUploadingReviewFiles && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {ipAppReviewAction === 'approve' && 'Approve Application'}
              {ipAppReviewAction === 'return' && 'Flag for Revision'}
              {ipAppReviewAction === 'reject' && 'Reject Application'}
              {ipAppReviewAction === 'granted' && 'Mark as Granted'}
              {!ipAppReviewAction && 'Submit Comment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
