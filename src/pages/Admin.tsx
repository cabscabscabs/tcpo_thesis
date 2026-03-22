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
import { Trash2, Edit, Plus, Eye, EyeOff, Users, Mail, Phone, Building, Calendar, CheckCircle, XCircle, Clock, Download, FileText, Video, BookOpen, Wrench } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";



const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  // Patent management state
  const [patents, setPatents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Patent form state
  const [patentForm, setPatentForm] = useState({
    title: '',
    patentId: '',
    inventors: '',
    field: '',
    abstract: '',
    status: 'Pending',
    year: new Date().getFullYear().toString()
  });

  // News management
  const [news, setNews] = useState([
    { id: "1", title: "TPCO-CET Convergence 2025 Announced", status: "Published", date: "2024-01-15", category: "Events", author: "Admin", excerpt: "Join us for the premier technology commercialization event in Northern Mindanao.", content: "The TPCO-CET Convergence 2025 will bring together researchers, industry partners, and innovators..." },
    { id: "2", title: "New Patent Filing Workshop Series", status: "Draft", date: "2024-01-10", category: "Education", author: "Dr. Maria Santos", excerpt: "Learn the fundamentals of patent filing and intellectual property protection.", content: "Our comprehensive workshop series covers all aspects of patent filing..." },
    { id: "3", title: "Industry Partnership with ABC Corp", status: "Published", date: "2024-01-08", category: "Partnerships", author: "Admin", excerpt: "Exciting new partnership opens doors for technology commercialization.", content: "We are pleased to announce our strategic partnership with ABC Corp..." }
  ]);

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
  
  // Load recent activities from Supabase
  useEffect(() => {
    loadRecentActivities();
  }, []);

  const loadRecentActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs' as any)
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
          timestamp: activity.created_at
        })) || [];
        setRecentActivity(mappedActivities);
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

  // News form state
  const [newsForm, setNewsForm] = useState({
    title: '',
    category: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    excerpt: '',
    content: '',
    image: null as File | null
  });

  // Modal states
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);

  const [events, setEvents] = useState<any[]>([]);
    
    // Event Registrations state
    const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
    const [selectedEventForRegistrations, setSelectedEventForRegistrations] = useState<any>(null);
    const [eventRegistrations, setEventRegistrations] = useState<any[]>([]);
    const [loadingRegistrations, setLoadingRegistrations] = useState(false);

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
    role: 'user',
    status: 'active'
  });

  // Resource Management state
  const [resources, setResources] = useState<any[]>([]);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [editingResource, setEditingResource] = useState<any>(null);
  const [resourceTab, setResourceTab] = useState('templates');
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
    // Tutorial fields
    duration: '',
    modules_count: 0,
    level: 'Beginner',
    // Facility fields
    capacity: '',
    hourly_rate: '',
    booking_lead_time: '',
    equipment: [] as string[]
  });

  // Facility Booking Inquiries state
  const [bookingInquiries, setBookingInquiries] = useState<any[]>([]);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);

  const [services] = useState([
    { id: 1, name: "IP Protection", requests: 15 },
    { id: 2, name: "Technology Licensing", requests: 8 },
    { id: 3, name: "Industry Matching", requests: 12 }
  ]);

  // Service Requests management
  const [serviceRequests, setServiceRequests] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+63 123 456 7890",
      organization: "TechCorp Inc.",
      service: "training",
      serviceTitle: "IP Training & Workshops",
      preferredDate: "2024-02-15",
      participants: "10",
      specificNeeds: "Focus on patent application procedures for tech startups",
      budget: "25k-50k",
      timeline: "1-month",
      status: "Pending",
      submittedAt: "2024-01-15T09:30:00Z"
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria.santos@university.edu",
      phone: "+63 987 654 3210",
      organization: "State University",
      service: "assessment",
      serviceTitle: "Technology Assessment",
      preferredDate: "2024-02-20",
      participants: "5",
      specificNeeds: "Need comprehensive TRL assessment for biotech research",
      budget: "50k-100k",
      timeline: "2-3-months",
      status: "In Progress",
      submittedAt: "2024-01-12T14:15:00Z"
    }
  ]);

  // Homepage content management
  const [homepageContent, setHomepageContent] = useState({
    heroTitle: "Accelerating Innovation Through Technology Transfer",
    heroSubtitle: "Bridging the gap between research and commercialization...",
    heroImage: null as string | null,
    patentsCount: 24,
    partnersCount: 50,
    startupsCount: 15,
    technologiesCount: 8
  });

  // Featured Technologies management
  const [featuredTechnologies, setFeaturedTechnologies] = useState([
    {
      id: "1",
      title: "Smart Irrigation System",
      description: "IoT-based irrigation system that reduces water usage by 40% while optimizing crop yields.",
      field: "Agriculture",
      status: "Licensed",
      inventors: "Dr. Maria Santos, Dr. Juan dela Cruz",
      year: "2024",
      abstract: "Revolutionary smart irrigation technology using AI-powered sensors."
    },
    {
      id: "2",
      title: "Bio-plastic Innovation",
      description: "Biodegradable plastic made from agricultural waste that decomposes within 6 months.",
      field: "Materials Science",
      status: "Available",
      inventors: "Dr. Roberto Mendez, Dr. Anna Garcia",
      year: "2023",
      abstract: "Sustainable packaging solution using local agricultural byproducts."
    },
    {
      id: "3",
      title: "Food Processing Tech",
      description: "Advanced food preservation method that extends shelf life by 300% naturally.",
      field: "Food Technology",
      status: "Pending",
      inventors: "Dr. Carmen Reyes, Dr. Luis Torres",
      year: "2024",
      abstract: "Natural preservation technology combining traditional methods with modern science."
    }
  ]);

  // State for featured technology selection
  const [selectedFeaturedTech, setSelectedFeaturedTech] = useState<string[]>([]);

  // Modal states for technology management
  const [showTechModal, setShowTechModal] = useState(false);
  const [editingTech, setEditingTech] = useState<any>(null);
  const [techForm, setTechForm] = useState({
    title: '',
    description: '',
    field: '',
    status: 'Available',
    inventors: '',
    year: new Date().getFullYear().toString(),
    abstract: '',
    image: null as File | null
  });

  // Modal states for patent management
  const [showPatentModal, setShowPatentModal] = useState(false);
  const [editingPatent, setEditingPatent] = useState<any>(null);
  
  // Modal state for patent selection
  const [showPatentSelectionModal, setShowPatentSelectionModal] = useState(false);

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
        loadTechnologies(),
        loadNews(),
        loadDashboardStats(),
        loadServiceRequests(),
        loadEvents(),
        loadPatents(),
        loadUsers(),
        loadResources(),
        loadBookingInquiries(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHomepageContent = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_homepage_content' as any)
        .select('*')
        .limit(1)
        .single();
      
      if (data && !error) {
        const content = data as any;
        setHomepageContent({
          heroTitle: content.hero_title,
          heroSubtitle: content.hero_subtitle,
          heroImage: content.hero_image_url,
          patentsCount: content.patents_count,
          partnersCount: content.partners_count,
          startupsCount: content.startups_count,
          technologiesCount: content.technologies_count,
        });
      }
    } catch (error) {
      console.error('Error loading homepage content:', error);
    }
  };

  const loadTechnologies = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_technologies' as any)
        .select('*')
        .order('order_num', { ascending: true });
      
      if (data && !error) {
        setFeaturedTechnologies(data.map((tech: any) => ({
          id: tech.id,
          title: tech.title,
          description: tech.description,
          field: tech.field,
          status: tech.status,
          inventors: tech.inventors,
          year: tech.year,
          abstract: tech.abstract,
          image: tech.image_url,
        })));
      }
    } catch (error) {
      console.error('Error loading technologies:', error);
    }
  };

  const loadNews = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_news' as any)
        .select('*')
        .order('date', { ascending: false });
      
      if (data && !error) {
        setNews(data.map((article: any) => ({
          id: article.id,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          author: article.author,
          status: article.status,
          date: article.date,
          image: article.cover_image_url,
        })));
      }
    } catch (error) {
      console.error('Error loading news:', error);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_dashboard_stats' as any)
        .select('*')
        .limit(1)
        .single();
      
      if (data && !error) {
        const stats = data as any;
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
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const loadServiceRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_service_requests' as any)
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (data && !error) {
        setServiceRequests(data.map((req: any) => ({
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
        })));
      }
    } catch (error) {
      console.error('Error loading service requests:', error);
    }
  };

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_events' as any)
        .select('*')
        .order('date', { ascending: true });
      
      if (data && !error) {
        setEvents(data.map((event: any) => ({
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
        })));
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles' as any)
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
        .from('admin_patents' as any)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data && !error) {
        setPatents(data.map((patent: any) => ({
          id: patent.id,
          title: patent.title,
          patentId: patent.patent_number,
          inventors: patent.inventors,
          field: patent.field,
          abstract: patent.abstract,
          status: patent.status,
          year: patent.year,
        })));
      }
    } catch (error) {
      console.error('Error loading patents:', error);
    }
  };

  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources' as any)
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
          duration: resource.duration,
          modules_count: resource.modules_count,
          level: resource.level,
          capacity: resource.capacity,
          hourly_rate: resource.hourly_rate,
          booking_lead_time: resource.booking_lead_time,
          equipment: resource.equipment || [],
          created_at: resource.created_at,
          updated_at: resource.updated_at,
        })));
      }
    } catch (error) {
      console.error('Error loading resources:', error);
    }
  };

  const loadBookingInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('facility_booking_inquiries' as any)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data && !error) {
        setBookingInquiries(data.map((inquiry: any) => ({
          id: inquiry.id,
          facility_id: inquiry.facility_id,
          facility_name: inquiry.facility_name,
          full_name: inquiry.full_name,
          email: inquiry.email,
          phone: inquiry.phone,
          organization: inquiry.organization,
          preferred_date: inquiry.preferred_date,
          preferred_time: inquiry.preferred_time,
          purpose: inquiry.purpose,
          additional_notes: inquiry.additional_notes,
          status: inquiry.status,
          created_at: inquiry.created_at,
        })));
      }
    } catch (error) {
      console.error('Error loading booking inquiries:', error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app, this would validate against backend
    if (loginData.username === "admin" && loginData.password === "admin123") {
      setIsLoggedIn(true);
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
            hero_title: heroTitle,
            hero_subtitle: heroSubtitle,
            hero_image_url: heroImageUrl,
            patents_count: homepageContent.patentsCount,
            partners_count: homepageContent.partnersCount,
            startups_count: homepageContent.startupsCount,
            technologies_count: homepageContent.technologiesCount,
          };
          
          const { error } = await supabase
            .from('admin_homepage_content' as any)
            .upsert(updatedContent);
          
          if (error) {
            console.error('Error updating homepage:', error);
            alert('Error updating homepage content');
            return;
          }
          
          setHomepageContent({
            ...homepageContent,
            heroTitle,
            heroSubtitle,
            heroImage: heroImageUrl
          });
          
          window.dispatchEvent(new Event('storage'));
          alert('Homepage content and image updated successfully!');
        };
        reader.readAsDataURL(file);
      } else {
        const updatedContent = {
          hero_title: heroTitle,
          hero_subtitle: heroSubtitle,
          hero_image_url: heroImageUrl,
          patents_count: homepageContent.patentsCount,
          partners_count: homepageContent.partnersCount,
          startups_count: homepageContent.startupsCount,
          technologies_count: homepageContent.technologiesCount,
        };
        
        const { error } = await supabase
          .from('admin_homepage_content' as any)
          .upsert(updatedContent);
        
        if (error) {
          console.error('Error updating homepage:', error);
          alert('Error updating homepage content');
          return;
        }
        
        setHomepageContent({
          ...homepageContent,
          heroTitle,
          heroSubtitle
        });
        
        window.dispatchEvent(new Event('storage'));
        alert('Homepage content updated successfully!');
      }
    } else {
      alert('Please fill in both title and subtitle fields.');
    }
  };

  // Handle statistics update
  const handleStatisticsUpdate = async () => {
    const patentsCount = parseInt((document.getElementById('patents-count') as HTMLInputElement)?.value) || 24;
    const partnersCount = parseInt((document.getElementById('partnerships-count') as HTMLInputElement)?.value) || 50;
    const startupsCount = parseInt((document.getElementById('startups-count') as HTMLInputElement)?.value) || 15;
    const technologiesCount = parseInt((document.getElementById('technologies-count') as HTMLInputElement)?.value) || 8;
    
    const updatedContent = {
      hero_title: homepageContent.heroTitle,
      hero_subtitle: homepageContent.heroSubtitle,
      hero_image_url: homepageContent.heroImage,
      patents_count: patentsCount,
      partners_count: partnersCount,
      startups_count: startupsCount,
      technologies_count: technologiesCount,
    };
    
    const { error } = await supabase
      .from('admin_homepage_content' as any)
      .upsert(updatedContent);
    
    if (error) {
      console.error('Error updating statistics:', error);
      alert('Error updating statistics');
      return;
    }
    
    setHomepageContent({
      ...homepageContent,
      patentsCount,
      partnersCount,
      startupsCount,
      technologiesCount
    });
    
    window.dispatchEvent(new Event('storage'));
    alert('Statistics updated successfully!');
  };

  // Activity logging function
  // Activity logging function
  const logActivity = async (type: string, action: string, title: string) => {
    try {
      // Insert the activity into Supabase
      const { data, error } = await supabase
        .from('activity_logs' as any)
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
    
    const { error } = await supabase
      .from('admin_dashboard_stats' as any)
      .upsert({
        total_patents: updatedStats.totalPatents,
        patents_this_month: updatedStats.patentsThisMonth,
        published_news: updatedStats.publishedNews,
        news_this_week: updatedStats.newsThisWeek,
        upcoming_events: updatedStats.upcomingEvents,
        next_event_date: updatedStats.nextEventDate,
        service_requests_count: updatedStats.serviceRequests,
        pending_requests: updatedStats.pendingRequests,
      });
    
    if (error) {
      console.error('Error updating dashboard stats:', error);
    }
  };

  // News Management Functions
  const handlePublishNews = async () => {
    if (!newsForm.title || !newsForm.content || !newsForm.category) {
      alert('Please fill in all required fields (Title, Content, Category).');
      return;
    }

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
        alert('Failed to process image. Article will be saved without image.');
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
      status: 'Published',
      published: true,
      tags: [newsForm.category, 'USTP', 'News'],
    };

    if (editingNews) {
      const { error } = await supabase
        .from('admin_news' as any)
        .update(newsData)
        .eq('id', editingNews.id);
      
      if (error) {
        console.error('Error updating news:', error);
        alert('Error updating news article');
        return;
      }
      logActivity('news', 'updated', newsForm.title);
      loadNews();
    } else {
      const { error } = await supabase
        .from('admin_news' as any)
        .insert([newsData]);
      
      if (error) {
        console.error('Error creating news:', error);
        alert('Error creating news article');
        return;
      }
      logActivity('news', 'published', newsForm.title);
      loadNews();
      
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
      image: null
    });
    
    setShowNewsModal(false);
    setEditingNews(null);
    
    alert(`News article ${editingNews ? 'updated' : 'published'} successfully!`);
  };

  const handleSaveDraft = async () => {
    if (!newsForm.title || !newsForm.content) {
      alert('Please fill in Title and Content to save as draft.');
      return;
    }

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
        alert('Failed to process image. Article will be saved without image.');
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
      status: 'Draft',
      published: false,
      tags: [newsForm.category || 'News', 'USTP', 'Draft'],
    };

    if (editingNews) {
      const { error } = await supabase
        .from('admin_news' as any)
        .update(newsData)
        .eq('id', editingNews.id);
      
      if (error) {
        console.error('Error updating draft:', error);
        alert('Error saving draft');
        return;
      }
      logActivity('news', 'updated draft', newsForm.title);
    } else {
      const { error } = await supabase
        .from('admin_news' as any)
        .insert([newsData]);
      
      if (error) {
        console.error('Error saving draft:', error);
        alert('Error saving draft');
        return;
      }
      logActivity('news', 'saved draft', newsForm.title);
    }

    loadNews();

    setNewsForm({
      title: '',
      category: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      excerpt: '',
      content: '',
      image: null
    });
    
    setShowNewsModal(false);
    setEditingNews(null);
    
    alert('News article saved as draft successfully!');
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
      image: null
    });
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
      image: null
    });
    
    // Scroll to the form
    const formElement = document.getElementById('news-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    alert(`📋 Article duplicated! You can now edit the copy of "${article.title}" and save it as a new article.`);
  };

  const handleDeleteNews = async (articleId: string, title: string) => {
    const article = news.find(a => a.id === articleId);
    const confirmMessage = `Are you sure you want to delete "${title}"?

This action cannot be undone.

Article Details:
- Status: ${article?.status}
- Category: ${article?.category}
- Date: ${article?.date}`;
    
    if (confirm(confirmMessage)) {
      const wasPublished = article?.status === 'Published';
      
      const { error } = await supabase
        .from('admin_news' as any)
        .delete()
        .eq('id', articleId);
      
      if (error) {
        console.error('Error deleting news:', error);
        alert('Error deleting news article');
        return;
      }
      
      loadNews();
      logActivity('news', 'deleted', title);
      
      if (wasPublished) {
        await updateDashboardStats({
          publishedNews: Math.max(0, dashboardStats.publishedNews - 1)
        });
      }
      
      alert(`Article "${title}" has been deleted successfully!`);
      
      if (editingNews && editingNews.id === articleId) {
        setEditingNews(null);
        setNewsForm({
          title: '',
          category: '',
          author: '',
          date: new Date().toISOString().split('T')[0],
          excerpt: '',
          content: '',
          image: null
        });
      }
    }
  };
  // Featured Technologies Management Functions
  const handleAddTechnology = () => {
    setEditingTech(null);
    setTechForm({
      title: '',
      description: '',
      field: '',
      status: 'Available',
      inventors: '',
      year: new Date().getFullYear().toString(),
      abstract: '',
      image: null
    });
    setShowTechModal(true);
  };

  const handleEditTechnology = (tech: any) => {
    setEditingTech(tech);
    setTechForm({
      title: tech.title,
      description: tech.description,
      field: tech.field,
      status: tech.status,
      inventors: tech.inventors,
      year: tech.year,
      abstract: tech.abstract,
      image: null
    });
    setShowTechModal(true);
  };

  const handleSaveTechnology = async () => {
    if (!techForm.title || !techForm.description || !techForm.field) {
      alert('Please fill in all required fields (Title, Description, Field).');
      return;
    }

    const techData = {
      title: techForm.title,
      description: techForm.description,
      field: techForm.field,
      status: techForm.status,
      inventors: techForm.inventors,
      year: techForm.year,
      abstract: techForm.abstract,
      featured: true,
      published: true,
    };

    if (editingTech) {
      const { error } = await supabase
        .from('admin_technologies' as any)
        .update(techData)
        .eq('id', editingTech.id);
      
      if (error) {
        console.error('Error updating technology:', error);
        alert('Error updating technology');
        return;
      }
      logActivity('technology', 'updated', techForm.title);
    } else {
      const { error } = await supabase
        .from('admin_technologies' as any)
        .insert([techData]);
      
      if (error) {
        console.error('Error creating technology:', error);
        alert('Error creating technology');
        return;
      }
      logActivity('technology', 'added', techForm.title);
    }

    loadTechnologies();
    window.dispatchEvent(new Event('storage'));
    setShowTechModal(false);
    alert(`Technology ${editingTech ? 'updated' : 'added'} successfully!`);
  };

  const handleDeleteTechnology = async (techId: string, title: string) => {
    if (confirm('Are you sure you want to delete this technology? This action cannot be undone.')) {
      const { error } = await supabase
        .from('admin_technologies' as any)
        .delete()
        .eq('id', techId);
      
      if (error) {
        console.error('Error deleting technology:', error);
        alert('Error deleting technology');
        return;
      }
      
      loadTechnologies();
      window.dispatchEvent(new Event('storage'));
      logActivity('technology', 'deleted', title);
      alert('Technology deleted successfully!');
    }
  };

  // Handle saving a new patent
  const handleSavePatent = async () => {
    if (!patentForm.title || !patentForm.field) {
      alert('Please fill in all required fields (Title, Field).');
      return;
    }

    const patentData = {
      title: patentForm.title,
      patent_number: patentForm.patentId,
      inventors: patentForm.inventors,
      field: patentForm.field,
      abstract: patentForm.abstract,
      status: patentForm.status || 'Pending',
      year: patentForm.year || new Date().getFullYear().toString(),
      published: true,
    };

    const { error } = await supabase
      .from('admin_patents' as any)
      .insert([patentData]);
    
    if (error) {
      console.error('Error creating patent:', error);
      alert('Error creating patent');
      return;
    }

    loadPatents();
    window.dispatchEvent(new Event('storage'));
    
    setPatentForm({
      title: '',
      patentId: '',
      inventors: '',
      field: '',
      abstract: '',
      status: 'Pending',
      year: new Date().getFullYear().toString()
    });
    
    alert('Patent saved successfully!');
  };

  // Handle editing a patent
  const handleEditPatent = (patent: any) => {
    setEditingPatent(patent);
    setPatentForm({
      title: patent.title,
      patentId: patent.patentId || '',
      inventors: patent.inventors || '',
      field: patent.field,
      abstract: patent.abstract || '',
      status: patent.status || 'Pending',
      year: patent.year || new Date().getFullYear().toString()
    });
    setShowPatentModal(true);
  };

  // Handle updating a patent
  const handleUpdatePatent = async () => {
    if (!patentForm.title || !patentForm.field) {
      alert('Please fill in all required fields (Title, Field).');
      return;
    }

    const patentData = {
      title: patentForm.title,
      patent_number: patentForm.patentId,
      inventors: patentForm.inventors,
      field: patentForm.field,
      abstract: patentForm.abstract,
      status: patentForm.status,
      year: patentForm.year,
    };

    const { error } = await supabase
      .from('admin_patents' as any)
      .update(patentData)
      .eq('id', editingPatent.id);
    
    if (error) {
      console.error('Error updating patent:', error);
      alert('Error updating patent');
      return;
    }

    loadPatents();
    window.dispatchEvent(new Event('storage'));
    
    setShowPatentModal(false);
    setEditingPatent(null);
    setPatentForm({
      title: '',
      patentId: '',
      inventors: '',
      field: '',
      abstract: '',
      status: 'Pending',
      year: new Date().getFullYear().toString()
    });
    
    alert('Patent updated successfully!');
  };

  // Handle deleting a patent
  const handleDeletePatent = async (patentId: string, title: string) => {
    if (confirm(`Are you sure you want to delete the patent "${title}"? This action cannot be undone.`)) {
      const { error } = await supabase
        .from('admin_patents' as any)
        .delete()
        .eq('id', patentId);
      
      if (error) {
        console.error('Error deleting patent:', error);
        alert('Error deleting patent');
        return;
      }
      
      loadPatents();
      window.dispatchEvent(new Event('storage'));
      logActivity('patent', 'deleted', title);
      alert(`Patent "${title}" has been deleted successfully!`);
    }
  };

  // Event Management Functions
  const handleCreateEvent = async () => {
    if (!eventForm.title || !eventForm.date) {
      alert('Please fill in all required fields (Event Title, Event Date).');
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
        alert('Failed to process image. Event will be saved without image.');
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
        .from('admin_events' as any)
        .update(eventData)
        .eq('id', editingEvent.id);
      
      if (error) {
        console.error('Error updating event:', error);
        alert('Error updating event');
        return;
      }
      logActivity('event', 'updated', eventForm.title);
    } else {
      const { error } = await supabase
        .from('admin_events' as any)
        .insert([eventData]);
      
      if (error) {
        console.error('Error creating event:', error);
        alert('Error creating event');
        return;
      }
      logActivity('event', 'created', eventForm.title);
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
    
    alert(`Event ${editingEvent ? 'updated' : 'created'} successfully!`);
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
        .from('admin_events' as any)
        .delete()
        .eq('id', eventId);
      
      if (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event');
        return;
      }
      
      loadEvents();
      window.dispatchEvent(new Event('storage'));
      logActivity('event', 'deleted', title);
      alert(`Event "${title}" has been deleted successfully!`);
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
        alert('Error updating registration status');
      } else {
        // Refresh registrations
        if (selectedEventForRegistrations) {
          handleViewRegistrations(selectedEventForRegistrations);
        }
      }
    } catch (err) {
      console.error('Unexpected error updating registration:', err);
      alert('Error updating registration status');
    }
  };

  // Export registrations to CSV
  const handleExportRegistrations = () => {
    if (eventRegistrations.length === 0) {
      alert('No registrations to export');
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
        role: 'user',
        status: 'active'
      });
    }
    setShowUserModal(true);
  };

  const handleAddUser = async () => {
    if (!userForm.full_name || !userForm.email) {
      alert('Please fill in Full Name and Email.');
      return;
    }

    if (!editingUser && !userForm.password) {
      alert('Please enter a temporary password for the new user.');
      return;
    }

    try {
      if (editingUser) {
        // Update existing user profile
        const { error } = await supabase
          .from('user_profiles' as any)
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
          alert('Error updating user: ' + error.message);
          return;
        }
        logActivity('user', 'updated', userForm.full_name);
        alert(`User "${userForm.full_name}" has been updated successfully!`);
      } else {
        // Create new user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userForm.email,
          password: userForm.password,
          options: {
            data: {
              full_name: userForm.full_name
            }
          }
        });

        if (authError) {
          console.error('Error creating auth user:', authError);
          alert('Error creating user account: ' + authError.message);
          return;
        }

        // The trigger will create the user_profiles entry automatically
        // But we need to update it with additional fields
        if (authData.user) {
          const { error: profileError } = await supabase
            .from('user_profiles' as any)
            .update({
              full_name: userForm.full_name,
              department: userForm.department || null,
              employee_id: userForm.employee_id || null,
              phone: userForm.phone || null,
              role: userForm.role,
              status: userForm.status
            })
            .eq('id', authData.user.id);
          
          if (profileError) {
            console.error('Error updating profile:', profileError);
          }
        }
        logActivity('user', 'created', userForm.full_name);
        alert(`User "${userForm.full_name}" has been created successfully!\nThey can log in with email: ${userForm.email}`);
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
        role: 'user',
        status: 'active'
      });
    } catch (error: any) {
      console.error('Error saving user:', error);
      alert('Error saving user: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"?\nThis will also delete their auth account.`)) {
      return;
    }

    try {
      // Delete profile (will cascade delete if set up, or we delete manually)
      const { error } = await supabase
        .from('user_profiles' as any)
        .delete()
        .eq('id', userId);
      
      if (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user: ' + error.message);
        return;
      }

      logActivity('user', 'deleted', userName);
      loadUsers();
      alert(`User "${userName}" has been deleted.`);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert('Error deleting user: ' + error.message);
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
        duration: resource.duration || '',
        modules_count: resource.modules_count || 0,
        level: resource.level || 'Beginner',
        capacity: resource.capacity || '',
        hourly_rate: resource.hourly_rate || '',
        booking_lead_time: resource.booking_lead_time || '',
        equipment: resource.equipment || []
      });
    } else {
      setEditingResource(null);
      setResourceForm({
        id: null,
        title: '',
        slug: '',
        type: resourceTab === 'templates' ? 'download' : resourceTab === 'tutorials' ? 'video' : resourceTab === 'facilities' ? 'download' : 'guide',
        category: resourceTab === 'templates' ? 'Templates' : resourceTab === 'tutorials' ? 'IP 101 Tutorials' : resourceTab === 'facilities' ? 'SSF Booking' : 'Guidelines',
        content: '',
        url: '',
        file_url: '',
        tags: [],
        published: true,
        duration: '',
        modules_count: 0,
        level: 'Beginner',
        capacity: '',
        hourly_rate: '',
        booking_lead_time: '',
        equipment: []
      });
    }
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
      alert('Please enter a resource title.');
      return;
    }

    const slug = resourceForm.slug || generateSlug(resourceForm.title);
    
    try {
      const resourceData: any = {
        title: resourceForm.title,
        slug: slug,
        type: resourceForm.type,
        category: resourceForm.category,
        content: resourceForm.content,
        url: resourceForm.url || null,
        file_url: resourceForm.file_url || null,
        tags: [resourceForm.category],
        published: resourceForm.published,
      };

      // Add tutorial-specific fields
      if (resourceForm.category === 'IP 101 Tutorials') {
        resourceData.duration = resourceForm.duration;
        resourceData.modules_count = resourceForm.modules_count;
        resourceData.level = resourceForm.level;
      }

      // Add facility-specific fields
      if (resourceForm.category === 'SSF Booking') {
        resourceData.capacity = resourceForm.capacity;
        resourceData.hourly_rate = resourceForm.hourly_rate;
        resourceData.booking_lead_time = resourceForm.booking_lead_time;
        resourceData.equipment = resourceForm.equipment;
      }

      let error;
      if (editingResource) {
        const result = await supabase
          .from('resources' as any)
          .update(resourceData)
          .eq('id', editingResource.id);
        error = result.error;
      } else {
        resourceData.published_at = new Date().toISOString();
        const result = await supabase
          .from('resources' as any)
          .insert(resourceData);
        error = result.error;
      }

      if (error) {
        console.error('Error saving resource:', error);
        alert('Error saving resource: ' + error.message);
        return;
      }

      logActivity('resource', editingResource ? 'updated' : 'added', resourceForm.title);
      loadResources();
      setShowResourceModal(false);
      alert(`Resource "${resourceForm.title}" has been ${editingResource ? 'updated' : 'added'}.`);
    } catch (error: any) {
      console.error('Error saving resource:', error);
      alert('Error saving resource: ' + error.message);
    }
  };

  const handleDeleteResource = async (resourceId: string, resourceTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${resourceTitle}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('resources' as any)
        .delete()
        .eq('id', resourceId);
      
      if (error) {
        console.error('Error deleting resource:', error);
        alert('Error deleting resource: ' + error.message);
        return;
      }

      logActivity('resource', 'deleted', resourceTitle);
      loadResources();
      alert(`Resource "${resourceTitle}" has been deleted.`);
    } catch (error: any) {
      console.error('Error deleting resource:', error);
      alert('Error deleting resource: ' + error.message);
    }
  };

  const handleToggleResourcePublish = async (resourceId: string, currentStatus: boolean, resourceTitle: string) => {
    try {
      const { error } = await supabase
        .from('resources' as any)
        .update({ published: !currentStatus })
        .eq('id', resourceId);
      
      if (error) {
        console.error('Error updating resource:', error);
        alert('Error updating resource: ' + error.message);
        return;
      }

      logActivity('resource', currentStatus ? 'unpublished' : 'published', resourceTitle);
      loadResources();
    } catch (error: any) {
      console.error('Error updating resource:', error);
      alert('Error updating resource: ' + error.message);
    }
  };

  // Booking Inquiry Handlers
  const handleViewInquiry = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setShowInquiryModal(true);
  };

  const handleUpdateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('facility_booking_inquiries' as any)
        .update({ status: newStatus })
        .eq('id', inquiryId);
      
      if (error) {
        console.error('Error updating inquiry:', error);
        alert('Error updating inquiry: ' + error.message);
        return;
      }

      loadBookingInquiries();
      alert(`Inquiry status updated to "${newStatus}".`);
    } catch (error: any) {
      console.error('Error updating inquiry:', error);
      alert('Error updating inquiry: ' + error.message);
    }
  };

  const getFilteredResources = (category: string) => {
    return resources.filter(r => r.category === category);
  };

  const handleResetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password'
      });

      if (error) {
        console.error('Error sending reset email:', error);
        alert('Error sending password reset email: ' + error.message);
        return;
      }

      alert(`Password reset email has been sent to ${email}`);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      alert('Error sending password reset email');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-ustp-blue">USTP TPCO Admin</CardTitle>
            <CardDescription>Sign in to manage portal content</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Enter password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" variant="ustp">
                Sign In
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Demo: admin / admin123
              </p>
            </form>
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
          <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 ">
        <Tabs defaultValue="dashboard" className="space-y-6 ">
          <TabsList className="grid w-full grid-cols-8 text-[#f7f7f7]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="patents">Patents</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
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
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'news' ? 'bg-blue-500' :
                        activity.type === 'technology' ? 'bg-green-500' :
                        activity.type === 'service' ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">{activity.action} {activity.type}</p>
                        <p className="text-sm text-muted-foreground">{activity.title} - {formatDate(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Content Management</h2>
              <Button variant="ustp">
                <Plus className="mr-2 h-4 w-4" />
                Add Content
              </Button>
            </div>

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
                  <CardTitle>Featured Technologies</CardTitle>
                  <CardDescription>Highlight key innovations from existing patents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {featuredTechnologies.map((tech) => (
                      <div key={tech.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{tech.title}</p>
                          <p className="text-sm text-muted-foreground">{tech.field} • {tech.status}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditTechnology(tech)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteTechnology(tech.id, tech.title)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="ustp" className="w-full" onClick={() => {
                    // Open patent selection modal
                    setShowPatentSelectionModal(true);
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Select from Patents
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Impact Statistics</CardTitle>
                <CardDescription>Update key metrics displayed on homepage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ustp-blue">45</div>
                    <div className="text-sm text-muted-foreground">Researchers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ustp-blue">23</div>
                    <div className="text-sm text-muted-foreground">Industry Partners</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ustp-blue">78</div>
                    <div className="text-sm text-muted-foreground">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ustp-blue">10</div>
                    <div className="text-sm text-muted-foreground">Admins</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">News Management</h2>
              <Button variant="ustp" onClick={() => { setEditingNews(null); setShowNewsModal(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                Create News Article
              </Button>
            </div>

            <Card id="news-form" className={showNewsModal ? "hidden" : ""}>
              <CardHeader>
                <CardTitle>
                  {editingNews ? (
                    <div className="flex items-center gap-2">
                      <Edit className="h-5 w-5 text-blue-600" />
                      Edit Article: "{editingNews.title}"
                    </div>
                  ) : (
                    "Create News Article"
                  )}
                </CardTitle>
                {editingNews && (
                  <CardDescription className="text-blue-600">
                    You are currently editing an existing article. Changes will update the original article.
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="news-title">Article Title *</Label>
                    <Input 
                      id="news-title" 
                      placeholder="Enter article title" 
                      value={newsForm.title}
                      onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="news-category">Category *</Label>
                    <Select value={newsForm.category} onValueChange={(value) => setNewsForm({...newsForm, category: value})}>
                      <SelectTrigger>
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
                    <Label htmlFor="news-author">Author</Label>
                    <Input 
                      id="news-author" 
                      placeholder="Article author" 
                      value={newsForm.author}
                      onChange={(e) => setNewsForm({...newsForm, author: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="news-date">Publication Date</Label>
                    <Input 
                      id="news-date" 
                      type="date" 
                      value={newsForm.date}
                      onChange={(e) => setNewsForm({...newsForm, date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="news-excerpt">Excerpt</Label>
                  <Textarea 
                    id="news-excerpt" 
                    placeholder="Brief summary of the article" 
                    rows={2} 
                    value={newsForm.excerpt}
                    onChange={(e) => setNewsForm({...newsForm, excerpt: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="news-content">Article Content *</Label>
                  <Textarea 
                    id="news-content" 
                    placeholder="Full article content" 
                    rows={8} 
                    value={newsForm.content}
                    onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="news-image">Featured Image</Label>
                  <Input 
                    id="news-image" 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setNewsForm({...newsForm, image: e.target.files?.[0] || null})}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="ustp" onClick={handlePublishNews}>
                    {editingNews ? 'Update Article' : 'Publish Article'}
                  </Button>
                  <Button variant="outline" onClick={handleSaveDraft}>
                    {editingNews ? 'Save Changes as Draft' : 'Save as Draft'}
                  </Button>
                  {editingNews && (
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        if (confirm('Are you sure you want to cancel editing? Any unsaved changes will be lost.')) {
                          setEditingNews(null);
                          setNewsForm({
                            title: '',
                            category: '',
                            author: '',
                            date: new Date().toISOString().split('T')[0],
                            excerpt: '',
                            content: '',
                            image: null
                          });
                          alert('ℹ️ Editing cancelled. Form has been reset to create a new article.');
                        }
                      }}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      ❌ Cancel Edit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Published Articles ({news.length})</CardTitle>
                <CardDescription>Manage your news articles and drafts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {news.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No articles created yet. Create your first news article above.</p>
                    </div>
                  ) : (
                    news.map((article) => (
                      <div key={article.id} className={`flex items-center justify-between p-4 border rounded-lg transition-all duration-200 ${
                        editingNews && editingNews.id === article.id 
                          ? 'bg-blue-50 border-blue-300 dark:bg-blue-950 dark:border-blue-700' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{article.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{article.excerpt}</p>
                          <div className="flex flex-wrap gap-2 items-center">
                            <Badge 
                              variant={article.status === "Published" ? "default" : "secondary"}
                              className={article.status === "Published" ? "bg-green-600" : "bg-yellow-600"}
                            >
                              {article.status === "Published" ? "🚀 Published" : "📋 Draft"}
                            </Badge>
                            <Badge variant="outline">{article.category}</Badge>
                            <span className="text-sm text-muted-foreground">📅 {article.date}</span>
                            {article.author && (
                              <span className="text-sm text-muted-foreground">✍️ by {article.author}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditNews(article)}
                            title={`Edit "${article.title}"`}
                            className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDuplicateNews(article)}
                            title={`Duplicate "${article.title}"`}
                            className="hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteNews(article.id, article.title)}
                            className="text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50"
                            title={`Delete "${article.title}"`}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                          {editingNews && editingNews.id === article.id && (
                            <Badge variant="outline" className="text-blue-600 border-blue-300">
                              Currently Editing
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
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

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={event.status === "Upcoming" ? "default" : event.status === "Planning" ? "secondary" : "outline"}>
                            {event.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{event.date}</span>
                          <span className="text-sm text-muted-foreground">{event.attendees} attendees</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleViewRegistrations(event)}>
                          <Users className="h-4 w-4 mr-1" />
                          Registrations
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event.id, event.title)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patents" className="space-y-6" id="patents-section">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Patent Management</h2>
              <Button variant="ustp">
                <Plus className="mr-2 h-4 w-4" />
                Add Patent
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Add New Patent</CardTitle>
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
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Licensed">Licensed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Under Review">Under Review</SelectItem>
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
                  <Label htmlFor="abstract">Abstract</Label>
                  <Textarea 
                    id="abstract" 
                    placeholder="Enter patent abstract" 
                    rows={4} 
                    value={patentForm.abstract}
                    onChange={(e) => setPatentForm({...patentForm, abstract: e.target.value})}
                  />
                </div>
                <Button variant="ustp" onClick={handleSavePatent}>Save Patent</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Patents</CardTitle>
                <CardDescription>Select patents to feature on homepage and IP portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patents.map((patent) => (
                    <div key={patent.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{patent.title}</h3>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={patent.status === "Granted" ? "default" : "secondary"}>
                            {patent.status}
                          </Badge>
                          <Badge variant="outline">{patent.field}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            // Add to featured technologies
                            const isAlreadyFeatured = featuredTechnologies.some(tech => tech.id === patent.id);
                            if (!isAlreadyFeatured) {
                              const newFeaturedTech = {
                                id: patent.id,
                                title: patent.title,
                                slug: patent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                                description: patent.abstract || `Patent in ${patent.field}`,
                                field: patent.field,
                                status: patent.status,
                                inventors: patent.inventors || "Dr. USTP Researcher",
                                year: new Date().getFullYear().toString(),
                                abstract: patent.abstract || `Patent abstract for ${patent.title}`
                              };
                              const updatedTechnologies = [...featuredTechnologies, newFeaturedTech];
                              setFeaturedTechnologies(updatedTechnologies);
                              // Insert to Supabase
                              supabase.from('admin_technologies' as any).insert([{
                                title: patent.title,
                                description: patent.abstract || `Patent in ${patent.field}`,
                                field: patent.field,
                                status: patent.status,
                                inventors: patent.inventors || "Dr. USTP Researcher",
                                year: new Date().getFullYear().toString(),
                                abstract: patent.abstract || `Patent abstract for ${patent.title}`,
                                featured: true,
                                published: true
                              }]).then(() => {
                                loadTechnologies();
                              });
                              alert(`✅ ${patent.title} added to featured technologies!`);
                            } else {
                              alert(`⚠️ ${patent.title} is already featured.`);
                            }
                          }}
                        >
                          Feature
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditPatent(patent)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeletePatent(patent.id, patent.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Service Management</h2>
              <Button variant="ustp">
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Add New Service</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service-title">Service Title</Label>
                    <Input id="service-title" placeholder="Enter service title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service-description">Service Description</Label>
                    <Textarea id="service-description" placeholder="Enter service description" rows={4} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="service-image">Service Image</Label>
                    <Input id="service-image" type="file" accept="image/*" />
                  </div>
                </div>
                <Button variant="ustp">Add Service</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.requests} requests</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Additional Service Requests Section */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Service Requests ({serviceRequests.length})</CardTitle>
                <CardDescription>
                  Requests submitted through the Additional Services page
                </CardDescription>
              </CardHeader>
              <CardContent>
                {serviceRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No service requests yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {serviceRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{request.name}</h3>
                              <Badge 
                                variant={request.status === 'Pending' ? 'secondary' : 
                                        request.status === 'In Progress' ? 'default' : 'outline'}
                              >
                                {request.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="font-medium text-gray-600">Service:</span>
                                <p>{request.serviceTitle}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">Organization:</span>
                                <p>{request.organization}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">Email:</span>
                                <p>{request.email}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">Phone:</span>
                                <p>{request.phone}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">Participants:</span>
                                <p>{request.participants} people</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">Budget:</span>
                                <p>{request.budget.replace('-', ' - ₱').replace('k', ',000')}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">Timeline:</span>
                                <p>{request.timeline.replace('-', ' ').replace('asap', 'ASAP')}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">Preferred Date:</span>
                                <p>{request.preferredDate}</p>
                              </div>
                            </div>
                            
                            {request.specificNeeds && (
                              <div className="mt-3">
                                <span className="font-medium text-gray-600">Specific Needs:</span>
                                <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded">
                                  {request.specificNeeds}
                                </p>
                              </div>
                            )}
                            
                            <div className="mt-2 text-xs text-gray-500">
                              Submitted: {new Date(request.submittedAt).toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <Select 
                              value={request.status} 
                              onValueChange={async (value) => {
                                const updatedRequests = serviceRequests.map(req => 
                                  req.id === request.id ? { ...req, status: value } : req
                                );
                                setServiceRequests(updatedRequests);
                                // Update in Supabase
                                await supabase
                                  .from('admin_service_requests' as any)
                                  .update({ status: value })
                                  .eq('id', request.id);
                                logActivity('service', 'updated status', request.serviceTitle);
                              }}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={async () => {
                                if (confirm('Are you sure you want to delete this service request?')) {
                                  const updatedRequests = serviceRequests.filter(req => req.id !== request.id);
                                  setServiceRequests(updatedRequests);
                                  // Delete from Supabase
                                  await supabase
                                    .from('admin_service_requests' as any)
                                    .delete()
                                    .eq('id', request.id);
                                  logActivity('service', 'deleted request', request.serviceTitle);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Resource Management</h2>
            </div>

            {/* Resource Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{getFilteredResources('Templates').length}</div>
                  <div className="text-sm text-muted-foreground">Templates</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">{getFilteredResources('IP 101 Tutorials').length}</div>
                  <div className="text-sm text-muted-foreground">Tutorials</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{getFilteredResources('SSF Booking').length}</div>
                  <div className="text-sm text-muted-foreground">Facilities</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{getFilteredResources('Guidelines').length}</div>
                  <div className="text-sm text-muted-foreground">Guidelines</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{bookingInquiries.filter(i => i.status === 'pending').length}</div>
                  <div className="text-sm text-muted-foreground">Pending Bookings</div>
                </CardContent>
              </Card>
            </div>

            {/* Nested Tabs for Resource Categories */}
            <Tabs value={resourceTab} onValueChange={setResourceTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="tutorials">IP 101 Tutorials</TabsTrigger>
                <TabsTrigger value="facilities">SSF Facilities</TabsTrigger>
                <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
                <TabsTrigger value="inquiries">Booking Inquiries</TabsTrigger>
              </TabsList>

              {/* Templates Tab */}
              <TabsContent value="templates" className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Legal Templates & Documents</h3>
                  <Button variant="ustp" onClick={() => handleOpenResourceModal()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Template
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    {getFilteredResources('Templates').length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
                        <p>No templates yet. Click "Add Template" to create one.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Title</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Description</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Type</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getFilteredResources('Templates').map((resource) => (
                              <tr key={resource.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{resource.title}</td>
                                <td className="p-3 text-sm text-gray-600 max-w-xs truncate">{resource.content}</td>
                                <td className="p-3">
                                  <Badge variant="outline">{resource.type}</Badge>
                                </td>
                                <td className="p-3">
                                  <Badge 
                                    variant={resource.published ? 'default' : 'secondary'}
                                    className={resource.published ? 'bg-green-500' : ''}
                                  >
                                    {resource.published ? 'Published' : 'Draft'}
                                  </Badge>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleToggleResourcePublish(resource.id, resource.published, resource.title)}
                                      title={resource.published ? 'Unpublish' : 'Publish'}
                                    >
                                      {resource.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleOpenResourceModal(resource)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDeleteResource(resource.id, resource.title)}
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

              {/* IP 101 Tutorials Tab */}
              <TabsContent value="tutorials" className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">IP 101 Learning Modules</h3>
                  <Button variant="ustp" onClick={() => handleOpenResourceModal()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Tutorial
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    {getFilteredResources('IP 101 Tutorials').length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Video className="mx-auto mb-4 h-12 w-12 opacity-50" />
                        <p>No tutorials yet. Click "Add Tutorial" to create one.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Title</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Description</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Duration</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Level</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getFilteredResources('IP 101 Tutorials').map((resource) => (
                              <tr key={resource.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{resource.title}</td>
                                <td className="p-3 text-sm text-gray-600 max-w-xs truncate">{resource.content}</td>
                                <td className="p-3 text-sm">{resource.duration || '-'}</td>
                                <td className="p-3">
                                  <Badge variant="outline">{resource.level || 'Beginner'}</Badge>
                                </td>
                                <td className="p-3">
                                  <Badge 
                                    variant={resource.published ? 'default' : 'secondary'}
                                    className={resource.published ? 'bg-green-500' : ''}
                                  >
                                    {resource.published ? 'Published' : 'Draft'}
                                  </Badge>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleToggleResourcePublish(resource.id, resource.published, resource.title)}
                                    >
                                      {resource.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleOpenResourceModal(resource)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDeleteResource(resource.id, resource.title)}
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

              {/* SSF Facilities Tab */}
              <TabsContent value="facilities" className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Shared Service Facilities</h3>
                  <Button variant="ustp" onClick={() => handleOpenResourceModal()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Facility
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    {getFilteredResources('SSF Booking').length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Building className="mx-auto mb-4 h-12 w-12 opacity-50" />
                        <p>No facilities yet. Click "Add Facility" to create one.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Facility Name</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Capacity</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Hourly Rate</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Lead Time</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getFilteredResources('SSF Booking').map((resource) => (
                              <tr key={resource.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                  <div className="font-medium">{resource.title}</div>
                                  <div className="text-xs text-gray-500 max-w-xs truncate">{resource.content}</div>
                                </td>
                                <td className="p-3 text-sm">{resource.capacity || '-'}</td>
                                <td className="p-3 text-sm text-secondary font-medium">
                                  {resource.hourly_rate ? `₱${resource.hourly_rate}` : '-'}
                                </td>
                                <td className="p-3 text-sm">{resource.booking_lead_time || '-'}</td>
                                <td className="p-3">
                                  <Badge 
                                    variant={resource.published ? 'default' : 'secondary'}
                                    className={resource.published ? 'bg-green-500' : ''}
                                  >
                                    {resource.published ? 'Available' : 'Unavailable'}
                                  </Badge>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleToggleResourcePublish(resource.id, resource.published, resource.title)}
                                    >
                                      {resource.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleOpenResourceModal(resource)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDeleteResource(resource.id, resource.title)}
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

              {/* Guidelines Tab */}
              <TabsContent value="guidelines" className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Research Guidelines & Best Practices</h3>
                  <Button variant="ustp" onClick={() => handleOpenResourceModal()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Guideline
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    {getFilteredResources('Guidelines').length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <BookOpen className="mx-auto mb-4 h-12 w-12 opacity-50" />
                        <p>No guidelines yet. Click "Add Guideline" to create one.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Title</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Description</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Type</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getFilteredResources('Guidelines').map((resource) => (
                              <tr key={resource.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{resource.title}</td>
                                <td className="p-3 text-sm text-gray-600 max-w-xs truncate">{resource.content}</td>
                                <td className="p-3">
                                  <Badge variant="outline">{resource.type}</Badge>
                                </td>
                                <td className="p-3">
                                  <Badge 
                                    variant={resource.published ? 'default' : 'secondary'}
                                    className={resource.published ? 'bg-green-500' : ''}
                                  >
                                    {resource.published ? 'Published' : 'Draft'}
                                  </Badge>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleToggleResourcePublish(resource.id, resource.published, resource.title)}
                                    >
                                      {resource.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleOpenResourceModal(resource)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDeleteResource(resource.id, resource.title)}
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

              {/* Booking Inquiries Tab */}
              <TabsContent value="inquiries" className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Facility Booking Inquiries</h3>
                  <div className="text-sm text-muted-foreground">
                    {bookingInquiries.filter(i => i.status === 'pending').length} pending inquiries
                  </div>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    {bookingInquiries.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
                        <p>No booking inquiries yet.</p>
                        <p className="text-sm mt-2">Inquiries will appear here when users submit booking requests from the Facility Booking page.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Facility</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Contact</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Preferred Date</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Submitted</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
                              <th className="text-left p-3 text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookingInquiries.map((inquiry) => (
                              <tr key={inquiry.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                  <div className="font-medium">{inquiry.facility_name}</div>
                                  <div className="text-xs text-gray-500">{inquiry.organization || 'No organization'}</div>
                                </td>
                                <td className="p-3">
                                  <div className="text-sm">{inquiry.full_name}</div>
                                  <div className="text-xs text-gray-500">{inquiry.email}</div>
                                  {inquiry.phone && <div className="text-xs text-gray-500">{inquiry.phone}</div>}
                                </td>
                                <td className="p-3 text-sm">
                                  {inquiry.preferred_date 
                                    ? new Date(inquiry.preferred_date).toLocaleDateString() 
                                    : 'Not specified'}
                                  {inquiry.preferred_time && (
                                    <div className="text-xs text-gray-500">{inquiry.preferred_time}</div>
                                  )}
                                </td>
                                <td className="p-3 text-sm text-gray-500">
                                  {formatDate(inquiry.created_at)}
                                </td>
                                <td className="p-3">
                                  <Badge 
                                    variant={
                                      inquiry.status === 'pending' ? 'secondary' :
                                      inquiry.status === 'contacted' ? 'default' :
                                      inquiry.status === 'confirmed' ? 'default' : 'destructive'
                                    }
                                    className={
                                      inquiry.status === 'confirmed' ? 'bg-green-500' :
                                      inquiry.status === 'contacted' ? 'bg-blue-500' : ''
                                    }
                                  >
                                    {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                                  </Badge>
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleViewInquiry(inquiry)}
                                      title="View Details"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleUpdateInquiryStatus(inquiry.id, 'contacted')}
                                      disabled={inquiry.status !== 'pending'}
                                      title="Mark as Contacted"
                                    >
                                      <Mail className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleUpdateInquiryStatus(inquiry.id, 'confirmed')}
                                      disabled={inquiry.status === 'confirmed' || inquiry.status === 'cancelled'}
                                      title="Confirm Booking"
                                    >
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleUpdateInquiryStatus(inquiry.id, 'cancelled')}
                                      disabled={inquiry.status === 'cancelled'}
                                      title="Cancel"
                                    >
                                      <XCircle className="h-4 w-4 text-destructive" />
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
            </Tabs>
          </TabsContent>

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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-primary/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-primary">{users.filter(u => u.role === 'admin').length}</div>
                    <div className="text-sm text-muted-foreground">Admins</div>
                  </div>
                  <div className="bg-secondary/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-secondary">{users.filter(u => u.role === 'faculty').length}</div>
                    <div className="text-sm text-muted-foreground">Faculty</div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-gray-600">{users.filter(u => u.role === 'user').length}</div>
                    <div className="text-sm text-muted-foreground">Users</div>
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
        </Tabs>
      </main>

      {/* News Edit Modal */}
      <Dialog open={showNewsModal} onOpenChange={setShowNewsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingNews ? 'Edit News Article' : 'Create News Article'}
            </DialogTitle>
            <DialogDescription>
              {editingNews ? 'Update the news article information below.' : 'Fill in the details for the new news article.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modal-news-title">Article Title *</Label>
                <Input 
                  id="modal-news-title" 
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                  placeholder="Enter article title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-news-category">Category *</Label>
                <Select value={newsForm.category} onValueChange={(value) => setNewsForm({...newsForm, category: value})}>
                  <SelectTrigger>
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
                <Label htmlFor="modal-news-author">Author</Label>
                <Input 
                  id="modal-news-author" 
                  value={newsForm.author}
                  onChange={(e) => setNewsForm({...newsForm, author: e.target.value})}
                  placeholder="Article author"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-news-date">Publication Date</Label>
                <Input 
                  id="modal-news-date" 
                  type="date" 
                  value={newsForm.date}
                  onChange={(e) => setNewsForm({...newsForm, date: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-news-excerpt">Excerpt</Label>
              <Textarea 
                id="modal-news-excerpt" 
                value={newsForm.excerpt}
                onChange={(e) => setNewsForm({...newsForm, excerpt: e.target.value})}
                placeholder="Brief summary of the article" 
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-news-content">Article Content *</Label>
              <Textarea 
                id="modal-news-content" 
                value={newsForm.content}
                onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                placeholder="Full article content" 
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-news-image">Featured Image</Label>
              <Input 
                id="modal-news-image" 
                type="file" 
                accept="image/*" 
                onChange={(e) => setNewsForm({...newsForm, image: e.target.files?.[0] || null})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewsModal(false)}>
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

      {/* Technology Add/Edit Modal */}
      <Dialog open={showTechModal} onOpenChange={setShowTechModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTech ? 'Edit Technology' : 'Add New Technology'}
            </DialogTitle>
            <DialogDescription>
              {editingTech ? 'Update the technology information below.' : 'Fill in the details for the new featured technology.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tech-title">Title *</Label>
              <Input 
                id="tech-title" 
                value={techForm.title}
                onChange={(e) => setTechForm({...techForm, title: e.target.value})}
                placeholder="Technology title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tech-field">Field *</Label>
              <Select value={techForm.field} onValueChange={(value) => setTechForm({...techForm, field: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Agriculture">Agriculture</SelectItem>
                  <SelectItem value="Materials Science">Materials Science</SelectItem>
                  <SelectItem value="Food Technology">Food Technology</SelectItem>
                  <SelectItem value="Information Technology">Information Technology</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Environmental Science">Environmental Science</SelectItem>
                  <SelectItem value="Biotechnology">Biotechnology</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tech-status">Status</Label>
              <Select value={techForm.status} onValueChange={(value) => setTechForm({...techForm, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Licensed">Licensed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tech-year">Year</Label>
              <Input 
                id="tech-year" 
                value={techForm.year}
                onChange={(e) => setTechForm({...techForm, year: e.target.value})}
                placeholder="2024"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tech-inventors">Inventors</Label>
              <Input 
                id="tech-inventors" 
                value={techForm.inventors}
                onChange={(e) => setTechForm({...techForm, inventors: e.target.value})}
                placeholder="Dr. John Doe, Dr. Jane Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tech-description">Description *</Label>
              <Textarea 
                id="tech-description" 
                value={techForm.description}
                onChange={(e) => setTechForm({...techForm, description: e.target.value})}
                placeholder="Brief description of the technology"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tech-abstract">Abstract</Label>
              <Textarea 
                id="tech-abstract" 
                value={techForm.abstract}
                onChange={(e) => setTechForm({...techForm, abstract: e.target.value})}
                placeholder="Detailed technical abstract"
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTechModal(false)}>
              Cancel
            </Button>
            <Button variant="ustp" onClick={handleSaveTechnology}>
              {editingTech ? 'Update Technology' : 'Add Technology'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Patent Edit Modal */}
      <Dialog open={showPatentModal} onOpenChange={setShowPatentModal}>
        <DialogContent className="max-w-2xl">
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
                value={patentForm.title}
                onChange={(e) => setPatentForm({...patentForm, title: e.target.value})}
                placeholder="Enter patent title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-patent-id">Patent ID</Label>
              <Input 
                id="modal-patent-id" 
                value={patentForm.patentId}
                onChange={(e) => setPatentForm({...patentForm, patentId: e.target.value})}
                placeholder="Enter patent ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-inventors">Inventors</Label>
              <Input 
                id="modal-inventors" 
                value={patentForm.inventors}
                onChange={(e) => setPatentForm({...patentForm, inventors: e.target.value})}
                placeholder="Enter inventors (comma separated)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-field">Field *</Label>
              <Select value={patentForm.field} onValueChange={(value) => setPatentForm({...patentForm, field: value})}>
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
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-status">Status *</Label>
              <Select value={patentForm.status} onValueChange={(value) => setPatentForm({...patentForm, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Licensed">Licensed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
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
                value={patentForm.year}
                onChange={(e) => setPatentForm({...patentForm, year: e.target.value})}
                placeholder="Enter year"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modal-abstract">Abstract</Label>
              <Textarea 
                id="modal-abstract" 
                value={patentForm.abstract}
                onChange={(e) => setPatentForm({...patentForm, abstract: e.target.value})}
                placeholder="Enter patent abstract"
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPatentModal(false)}>
              Cancel
            </Button>
            <Button variant="ustp" onClick={handleUpdatePatent}>
              Update Patent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Patent Selection Modal */}
      <Dialog open={showPatentSelectionModal} onOpenChange={setShowPatentSelectionModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Patents to Feature</DialogTitle>
            <DialogDescription>
              Choose patents to add to the featured technologies on the homepage.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {patents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No patents available. Add patents in the Patents section first.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {patents.map((patent) => {
                  // Check if this patent is already featured
                  const isFeatured = featuredTechnologies.some(tech => tech.id === patent.id);
                  
                  return (
                    <div key={patent.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{patent.title}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant={patent.status === "Granted" ? "default" : "secondary"}>
                            {patent.status}
                          </Badge>
                          <Badge variant="outline">{patent.field}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {patent.abstract || `Patent in ${patent.field}`}
                        </p>
                      </div>
                      <div className="ml-4">
                        {isFeatured ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={async () => {
                              // Remove from featured technologies
                              const updatedTechnologies = featuredTechnologies.filter(tech => tech.id !== patent.id);
                              setFeaturedTechnologies(updatedTechnologies);
                              // Delete from Supabase
                              await supabase
                                .from('admin_technologies' as any)
                                .delete()
                                .eq('id', patent.id);
                            }}
                          >
                            Remove
                          </Button>
                        ) : (
                          <Button 
                            variant="ustp" 
                            size="sm"
                            onClick={async () => {
                              // Add to featured technologies
                              const newFeaturedTech = {
                                id: patent.id,
                                title: patent.title,
                                slug: patent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                                description: patent.abstract || `Patent in ${patent.field}`,
                                field: patent.field,
                                status: patent.status,
                                inventors: patent.inventors || "Dr. USTP Researcher",
                                year: new Date().getFullYear().toString(),
                                abstract: patent.abstract || `Patent abstract for ${patent.title}`
                              };
                              const updatedTechnologies = [...featuredTechnologies, newFeaturedTech];
                              setFeaturedTechnologies(updatedTechnologies);
                              // Insert to Supabase
                              await supabase.from('admin_technologies' as any).insert([{
                                title: patent.title,
                                description: patent.abstract || `Patent in ${patent.field}`,
                                field: patent.field,
                                status: patent.status,
                                inventors: patent.inventors || "Dr. USTP Researcher",
                                year: new Date().getFullYear().toString(),
                                abstract: patent.abstract || `Patent abstract for ${patent.title}`,
                                featured: true,
                                published: true
                              }]);
                            }}
                          >
                            Add
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPatentSelectionModal(false)}>
              Close
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
                    <SelectItem value="user">User</SelectItem>
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
                      'IP 101 Tutorials': 'video',
                      'SSF Booking': 'download',
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
                    <SelectItem value="IP 101 Tutorials">IP 101 Tutorials</SelectItem>
                    <SelectItem value="SSF Booking">SSF Booking</SelectItem>
                    <SelectItem value="Guidelines">Guidelines</SelectItem>
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

            {/* Tutorial-specific fields */}
            {resourceForm.category === 'IP 101 Tutorials' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="resource-duration">Duration</Label>
                  <Input 
                    id="resource-duration" 
                    value={resourceForm.duration}
                    onChange={(e) => setResourceForm({...resourceForm, duration: e.target.value})}
                    placeholder="e.g., 45 minutes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resource-modules">Number of Modules</Label>
                  <Input 
                    id="resource-modules" 
                    type="number"
                    value={resourceForm.modules_count}
                    onChange={(e) => setResourceForm({...resourceForm, modules_count: parseInt(e.target.value) || 0})}
                    placeholder="e.g., 6"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resource-level">Level</Label>
                  <Select 
                    value={resourceForm.level} 
                    onValueChange={(value) => setResourceForm({...resourceForm, level: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Facility-specific fields */}
            {resourceForm.category === 'SSF Booking' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="resource-capacity">Capacity</Label>
                    <Input 
                      id="resource-capacity" 
                      value={resourceForm.capacity}
                      onChange={(e) => setResourceForm({...resourceForm, capacity: e.target.value})}
                      placeholder="e.g., 10 researchers"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resource-rate">Hourly Rate (₱)</Label>
                    <Input 
                      id="resource-rate" 
                      value={resourceForm.hourly_rate}
                      onChange={(e) => setResourceForm({...resourceForm, hourly_rate: e.target.value})}
                      placeholder="e.g., 500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resource-lead">Booking Lead Time</Label>
                    <Input 
                      id="resource-lead" 
                      value={resourceForm.booking_lead_time}
                      onChange={(e) => setResourceForm({...resourceForm, booking_lead_time: e.target.value})}
                      placeholder="e.g., 48 hours"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resource-equipment">Equipment (comma-separated)</Label>
                  <Input 
                    id="resource-equipment" 
                    value={resourceForm.equipment.join(', ')}
                    onChange={(e) => setResourceForm({...resourceForm, equipment: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                    placeholder="e.g., SEM-EDS, XRD, FTIR"
                  />
                </div>
              </div>
            )}

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
            }}>
              Cancel
            </Button>
            <Button variant="ustp" onClick={handleSaveResource}>
              {editingResource ? 'Update Resource' : 'Add Resource'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Inquiry Modal */}
      <Dialog open={showInquiryModal} onOpenChange={setShowInquiryModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Inquiry Details</DialogTitle>
            <DialogDescription>
              View and manage this booking inquiry.
            </DialogDescription>
          </DialogHeader>
          
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-primary mb-2">{selectedInquiry.facility_name}</h4>
                <Badge 
                  variant={
                    selectedInquiry.status === 'pending' ? 'secondary' :
                    selectedInquiry.status === 'contacted' ? 'default' :
                    selectedInquiry.status === 'confirmed' ? 'default' : 'destructive'
                  }
                  className={
                    selectedInquiry.status === 'confirmed' ? 'bg-green-500' :
                    selectedInquiry.status === 'contacted' ? 'bg-blue-500' : ''
                  }
                >
                  {selectedInquiry.status.charAt(0).toUpperCase() + selectedInquiry.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Contact Name</span>
                  <p className="font-medium">{selectedInquiry.full_name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Organization</span>
                  <p className="font-medium">{selectedInquiry.organization || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Email</span>
                  <p className="font-medium">{selectedInquiry.email}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Phone</span>
                  <p className="font-medium">{selectedInquiry.phone || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Preferred Date</span>
                  <p className="font-medium">
                    {selectedInquiry.preferred_date 
                      ? new Date(selectedInquiry.preferred_date).toLocaleDateString() 
                      : 'Not specified'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Preferred Time</span>
                  <p className="font-medium">{selectedInquiry.preferred_time || 'Not specified'}</p>
                </div>
              </div>

              {selectedInquiry.purpose && (
                <div>
                  <span className="text-sm text-gray-500">Purpose</span>
                  <p className="text-sm bg-gray-50 p-3 rounded mt-1">{selectedInquiry.purpose}</p>
                </div>
              )}

              {selectedInquiry.additional_notes && (
                <div>
                  <span className="text-sm text-gray-500">Additional Notes</span>
                  <p className="text-sm bg-gray-50 p-3 rounded mt-1">{selectedInquiry.additional_notes}</p>
                </div>
              )}

              <div className="text-sm text-gray-500">
                Submitted: {formatDate(selectedInquiry.created_at)}
              </div>
            </div>
          )}

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowInquiryModal(false);
                setSelectedInquiry(null);
              }}
            >
              Close
            </Button>
            {selectedInquiry && selectedInquiry.status === 'pending' && (
              <Button 
                variant="ustp" 
                onClick={() => {
                  handleUpdateInquiryStatus(selectedInquiry.id, 'contacted');
                  setShowInquiryModal(false);
                }}
              >
                Mark as Contacted
              </Button>
            )}
            {selectedInquiry && selectedInquiry.status !== 'confirmed' && selectedInquiry.status !== 'cancelled' && (
              <Button 
                variant="default" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  handleUpdateInquiryStatus(selectedInquiry.id, 'confirmed');
                  setShowInquiryModal(false);
                }}
              >
                Confirm Booking
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
