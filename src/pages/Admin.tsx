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
import { Trash2, Edit, Plus, Eye, EyeOff } from "lucide-react";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  // Mock data for demonstration
  const [patents] = useState([
    { id: 1, title: "Smart Irrigation System", status: "Granted", field: "Agriculture" },
    { id: 2, title: "Bio-degradable Packaging", status: "Pending", field: "Materials Science" },
    { id: 3, title: "Food Preservation Method", status: "Granted", field: "Food Technology" }
  ]);

  // News management
  const [news, setNews] = useState([
    { id: 1, title: "TPCO-CET Convergence 2025 Announced", status: "Published", date: "2024-01-15", category: "Events", author: "Admin", excerpt: "Join us for the premier technology commercialization event in Northern Mindanao.", content: "The TPCO-CET Convergence 2025 will bring together researchers, industry partners, and innovators..." },
    { id: 2, title: "New Patent Filing Workshop Series", status: "Draft", date: "2024-01-10", category: "Education", author: "Dr. Maria Santos", excerpt: "Learn the fundamentals of patent filing and intellectual property protection.", content: "Our comprehensive workshop series covers all aspects of patent filing..." },
    { id: 3, title: "Industry Partnership with ABC Corp", status: "Published", date: "2024-01-08", category: "Partnerships", author: "Admin", excerpt: "Exciting new partnership opens doors for technology commercialization.", content: "We are pleased to announce our strategic partnership with ABC Corp..." }
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

  // Recent Activity tracking
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: "news", action: "published", title: "Innovation Workshop announcement", time: "5 hours ago" },
    { id: 2, type: "technology", action: "added", title: "Smart Irrigation System", time: "1 day ago" },
    { id: 3, type: "service", action: "received", title: "Technology licensing inquiry", time: "1 day ago" }
  ]);

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

  const [events] = useState([
    { id: 1, title: "Morning with IP Workshop", date: "2024-02-15", status: "Upcoming", attendees: 45 },
    { id: 2, title: "Technology Showcase 2024", date: "2024-03-20", status: "Planning", attendees: 120 },
    { id: 3, title: "Innovation Forum", date: "2024-01-20", status: "Completed", attendees: 85 }
  ]);

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
      id: 1,
      title: "Smart Irrigation System",
      description: "IoT-based irrigation system that reduces water usage by 40% while optimizing crop yields.",
      field: "Agriculture",
      status: "Licensed",
      inventors: "Dr. Maria Santos, Dr. Juan dela Cruz",
      year: "2024",
      abstract: "Revolutionary smart irrigation technology using AI-powered sensors."
    },
    {
      id: 2,
      title: "Bio-plastic Innovation",
      description: "Biodegradable plastic made from agricultural waste that decomposes within 6 months.",
      field: "Materials Science",
      status: "Available",
      inventors: "Dr. Roberto Mendez, Dr. Anna Garcia",
      year: "2023",
      abstract: "Sustainable packaging solution using local agricultural byproducts."
    },
    {
      id: 3,
      title: "Food Processing Tech",
      description: "Advanced food preservation method that extends shelf life by 300% naturally.",
      field: "Food Technology",
      status: "Pending",
      inventors: "Dr. Carmen Reyes, Dr. Luis Torres",
      year: "2024",
      abstract: "Natural preservation technology combining traditional methods with modern science."
    }
  ]);

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
    abstract: ''
  });

  // Load saved data on component mount
  useEffect(() => {
    const savedContent = localStorage.getItem('homepageContent');
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent);
        setHomepageContent(parsedContent);
      } catch (error) {
        console.error('Failed to load saved homepage content:', error);
      }
    }

    // Load saved featured technologies
    const savedTech = localStorage.getItem('featuredTechnologies');
    if (savedTech) {
      try {
        const parsedTech = JSON.parse(savedTech);
        setFeaturedTechnologies(parsedTech);
      } catch (error) {
        console.error('Failed to load saved featured technologies:', error);
      }
    }

    // Load saved news
    const savedNews = localStorage.getItem('newsArticles');
    if (savedNews) {
      try {
        const parsedNews = JSON.parse(savedNews);
        setNews(parsedNews);
      } catch (error) {
        console.error('Failed to load saved news:', error);
      }
    }

    // Load dashboard stats
    const savedStats = localStorage.getItem('dashboardStats');
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats);
        setDashboardStats(parsedStats);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      }
    }

    // Load recent activity
    const savedActivity = localStorage.getItem('recentActivity');
    if (savedActivity) {
      try {
        const parsedActivity = JSON.parse(savedActivity);
        setRecentActivity(parsedActivity);
      } catch (error) {
        console.error('Failed to load recent activity:', error);
      }
    }

    // Load service requests
    const savedServiceRequests = localStorage.getItem('serviceRequests');
    if (savedServiceRequests) {
      try {
        const parsedRequests = JSON.parse(savedServiceRequests);
        setServiceRequests(parsedRequests);
      } catch (error) {
        console.error('Failed to load service requests:', error);
      }
    }
  }, []);

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
        reader.onload = (e) => {
          heroImageUrl = e.target?.result as string;
          
          // Update content with new image
          const updatedContent = {
            ...homepageContent,
            heroTitle,
            heroSubtitle,
            heroImage: heroImageUrl
          };
          
          setHomepageContent(updatedContent);
          
          // Store in localStorage to persist across sessions
          localStorage.setItem('homepageContent', JSON.stringify(updatedContent));
          
          // Trigger a custom event to notify other components
          window.dispatchEvent(new Event('storage'));
          
          // Show success message
          alert('✅ Homepage content and image updated successfully! The changes are now live on the homepage.');
        };
        reader.readAsDataURL(file);
      } else {
        // Update content without new image
        const updatedContent = {
          ...homepageContent,
          heroTitle,
          heroSubtitle
        };
        
        setHomepageContent(updatedContent);
        
        // Store in localStorage to persist across sessions
        localStorage.setItem('homepageContent', JSON.stringify(updatedContent));
        
        // Trigger a custom event to notify other components
        window.dispatchEvent(new Event('storage'));
        
        // Show success message
        alert('✅ Homepage content updated successfully! The changes are now live on the homepage.');
      }
    } else {
      alert('❌ Please fill in both title and subtitle fields.');
    }
  };

  // Handle statistics update
  const handleStatisticsUpdate = () => {
    const patentsCount = parseInt((document.getElementById('patents-count') as HTMLInputElement)?.value) || 24;
    const partnersCount = parseInt((document.getElementById('partnerships-count') as HTMLInputElement)?.value) || 50;
    const startupsCount = parseInt((document.getElementById('startups-count') as HTMLInputElement)?.value) || 15;
    const technologiesCount = parseInt((document.getElementById('technologies-count') as HTMLInputElement)?.value) || 8;
    
    const updatedContent = {
      ...homepageContent,
      patentsCount,
      partnersCount,
      startupsCount,
      technologiesCount
    };
    
    setHomepageContent(updatedContent);
    
    // Store in localStorage to persist across sessions
    localStorage.setItem('homepageContent', JSON.stringify(updatedContent));
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new Event('storage'));
    
    // Show success message
    alert('✅ Statistics updated successfully! The changes are now live on the homepage.');
  };

  // Activity logging function
  const logActivity = (type: string, action: string, title: string) => {
    const newActivity = {
      id: Date.now(),
      type,
      action,
      title,
      time: 'just now'
    };
    
    const updatedActivity = [newActivity, ...recentActivity.slice(0, 9)]; // Keep last 10 activities
    setRecentActivity(updatedActivity);
    localStorage.setItem('recentActivity', JSON.stringify(updatedActivity));
  };

  // Update dashboard stats
  const updateDashboardStats = (updates: any) => {
    const updatedStats = { ...dashboardStats, ...updates };
    setDashboardStats(updatedStats);
    localStorage.setItem('dashboardStats', JSON.stringify(updatedStats));
  };

  // News Management Functions
  const handlePublishNews = async () => {
    if (!newsForm.title || !newsForm.content || !newsForm.category) {
      alert('❌ Please fill in all required fields (Title, Content, Category).');
      return;
    }

    let imageUrl = null;
    
    // Handle image upload if present
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
        alert('❌ Failed to process image. Article will be saved without image.');
      }
    }

    let updatedNews;
    const newsData = {
      ...newsForm,
      image: imageUrl, // Store the base64 image data
      status: 'Published',
      id: editingNews ? editingNews.id : Math.max(...news.map(n => n.id)) + 1
    };

    if (editingNews) {
      updatedNews = news.map(article => 
        article.id === editingNews.id ? newsData : article
      );
      logActivity('news', 'updated', newsForm.title);
    } else {
      updatedNews = [...news, newsData];
      logActivity('news', 'published', newsForm.title);
      
      // Update dashboard stats
      updateDashboardStats({
        publishedNews: dashboardStats.publishedNews + 1,
        newsThisWeek: dashboardStats.newsThisWeek + 1
      });
    }

    setNews(updatedNews);
    localStorage.setItem('newsArticles', JSON.stringify(updatedNews));
    window.dispatchEvent(new Event('storage'));
    
    // Reset form
    setNewsForm({
      title: '',
      category: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      excerpt: '',
      content: '',
      image: null
    });
    
    alert(`✅ News article ${editingNews ? 'updated' : 'published'} successfully!`);
  };

  const handleSaveDraft = async () => {
    if (!newsForm.title || !newsForm.content) {
      alert('❌ Please fill in Title and Content to save as draft.');
      return;
    }

    let imageUrl = null;
    
    // Handle image upload if present
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
        alert('❌ Failed to process image. Article will be saved without image.');
      }
    }

    let updatedNews;
    const newsData = {
      ...newsForm,
      image: imageUrl, // Store the base64 image data
      status: 'Draft',
      id: editingNews ? editingNews.id : Math.max(...news.map(n => n.id)) + 1
    };

    if (editingNews) {
      updatedNews = news.map(article => 
        article.id === editingNews.id ? newsData : article
      );
      logActivity('news', 'updated draft', newsForm.title);
    } else {
      updatedNews = [...news, newsData];
      logActivity('news', 'saved draft', newsForm.title);
    }

    setNews(updatedNews);
    localStorage.setItem('newsArticles', JSON.stringify(updatedNews));
    
    // Reset form
    setNewsForm({
      title: '',
      category: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      excerpt: '',
      content: '',
      image: null
    });
    
    alert(`✅ News article saved as draft successfully!`);
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
    
    // Scroll to the form for better UX
    const formElement = document.getElementById('news-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Show a toast or alert to indicate editing mode
    alert(`✏️ Now editing: "${article.title}". Make your changes and click "Update Article" to save.`);
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

  const handleDeleteNews = (articleId: number, title: string) => {
    const article = news.find(a => a.id === articleId);
    const confirmMessage = `Are you sure you want to delete "${title}"?

This action cannot be undone.

Article Details:
- Status: ${article?.status}
- Category: ${article?.category}
- Date: ${article?.date}`;
    
    if (confirm(confirmMessage)) {
      const articleToDelete = news.find(a => a.id === articleId);
      const wasPublished = articleToDelete?.status === 'Published';
      
      const updatedNews = news.filter(article => article.id !== articleId);
      setNews(updatedNews);
      localStorage.setItem('newsArticles', JSON.stringify(updatedNews));
      window.dispatchEvent(new Event('storage'));
      
      logActivity('news', 'deleted', title);
      
      // Update dashboard stats only if it was a published article
      if (wasPublished) {
        updateDashboardStats({
          publishedNews: Math.max(0, dashboardStats.publishedNews - 1)
        });
      }
      
      alert(`✅ Article "${title}" has been deleted successfully!`);
      
      // Clear editing state if the deleted article was being edited
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
      abstract: ''
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
      abstract: tech.abstract
    });
    setShowTechModal(true);
  };

  const handleSaveTechnology = () => {
    if (!techForm.title || !techForm.description || !techForm.field) {
      alert('❌ Please fill in all required fields (Title, Description, Field).');
      return;
    }

    let updatedTechnologies;
    
    if (editingTech) {
      // Update existing technology
      updatedTechnologies = featuredTechnologies.map(tech => 
        tech.id === editingTech.id ? { ...editingTech, ...techForm } : tech
      );
      logActivity('technology', 'updated', techForm.title);
    } else {
      // Add new technology
      const newTech = {
        id: Math.max(...featuredTechnologies.map(t => t.id)) + 1,
        ...techForm
      };
      updatedTechnologies = [...featuredTechnologies, newTech];
      logActivity('technology', 'added', techForm.title);
    }

    setFeaturedTechnologies(updatedTechnologies);
    
    // Store in localStorage
    localStorage.setItem('featuredTechnologies', JSON.stringify(updatedTechnologies));
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
    
    setShowTechModal(false);
    alert(`✅ Technology ${editingTech ? 'updated' : 'added'} successfully! Changes are now live on the homepage and IP Portfolio.`);
  };

  const handleDeleteTechnology = (techId: number, title: string) => {
    if (confirm('Are you sure you want to delete this technology? This action cannot be undone.')) {
      const updatedTechnologies = featuredTechnologies.filter(tech => tech.id !== techId);
      setFeaturedTechnologies(updatedTechnologies);
      
      // Store in localStorage
      localStorage.setItem('featuredTechnologies', JSON.stringify(updatedTechnologies));
      
      // Trigger storage event
      window.dispatchEvent(new Event('storage'));
      
      logActivity('technology', 'deleted', title);
      
      alert('✅ Technology deleted successfully!');
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
          <TabsList className="grid w-full grid-cols-7 text-[#f7f7f7]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="patents">Patents</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
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
                        <p className="text-sm text-muted-foreground">{activity.title} - {activity.time}</p>
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
                  <CardDescription>Highlight key innovations</CardDescription>
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
                  <Button variant="ustp" className="w-full" onClick={handleAddTechnology}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Featured Technology
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
                  <div className="space-y-2">
                    <Label htmlFor="patents-count">Patents Granted</Label>
                    <Input id="patents-count" type="number" defaultValue={homepageContent.patentsCount} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partnerships-count">Industry Partners</Label>
                    <Input id="partnerships-count" type="number" defaultValue={homepageContent.partnersCount} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startups-count">Startups Incubated</Label>
                    <Input id="startups-count" type="number" defaultValue={homepageContent.startupsCount} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="technologies-count">Technologies Licensed</Label>
                    <Input id="technologies-count" type="number" defaultValue={homepageContent.technologiesCount} />
                  </div>
                </div>
                <Button variant="ustp" className="mt-4" onClick={handleStatisticsUpdate}>Update Statistics</Button>
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

            <Card id="news-form">
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
              <Button variant="ustp">
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
                    <Input id="event-title" placeholder="Enter event title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-type">Event Type</Label>
                    <Select>
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
                    <Input id="event-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-time">Event Time</Label>
                    <Input id="event-time" type="time" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-location">Location</Label>
                    <Input id="event-location" placeholder="Event venue" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-capacity">Capacity</Label>
                    <Input id="event-capacity" type="number" placeholder="Maximum attendees" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-description">Event Description</Label>
                  <Textarea id="event-description" placeholder="Detailed description of the event" rows={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-image">Event Image</Label>
                  <Input id="event-image" type="file" accept="image/*" />
                </div>
                <Button variant="ustp">Create Event</Button>
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
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          View Registrations
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
          </TabsContent>

          <TabsContent value="patents" className="space-y-6">
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
                    <Label htmlFor="patent-title">Patent Title</Label>
                    <Input id="patent-title" placeholder="Enter patent title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patent-id">Patent ID</Label>
                    <Input id="patent-id" placeholder="Enter patent ID" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inventors">Inventors</Label>
                    <Input id="inventors" placeholder="Enter inventors (comma separated)" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="field">Field</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                        <SelectItem value="materials">Materials Science</SelectItem>
                        <SelectItem value="food">Food Technology</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="abstract">Abstract</Label>
                  <Textarea id="abstract" placeholder="Enter patent abstract" rows={4} />
                </div>
                <Button variant="ustp">Save Patent</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Patents</CardTitle>
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
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Service Management</h2>
              <Button variant="ustp">
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription>{service.requests} pending requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        View Requests
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

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
                              onValueChange={(value) => {
                                const updatedRequests = serviceRequests.map(req => 
                                  req.id === request.id ? { ...req, status: value } : req
                                );
                                setServiceRequests(updatedRequests);
                                localStorage.setItem('serviceRequests', JSON.stringify(updatedRequests));
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
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this service request?')) {
                                  const updatedRequests = serviceRequests.filter(req => req.id !== request.id);
                                  setServiceRequests(updatedRequests);
                                  localStorage.setItem('serviceRequests', JSON.stringify(updatedRequests));
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
              <Button variant="ustp">
                <Plus className="mr-2 h-4 w-4" />
                Add Resource
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Upload New Resource</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="resource-title">Resource Title</Label>
                    <Input id="resource-title" placeholder="Enter resource title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resource-type">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="template">Template</SelectItem>
                        <SelectItem value="guide">Guide</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resource-description">Description</Label>
                  <Textarea id="resource-description" placeholder="Enter description" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file-upload">File Upload</Label>
                  <Input id="file-upload" type="file" />
                </div>
                <Button variant="ustp">Upload Resource</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Management</h2>
              <Button variant="ustp">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
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

            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-username">Username</Label>
                    <Input id="new-username" placeholder="Enter username" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-email">Email</Label>
                    <Input id="new-email" type="email" placeholder="Enter email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-role">Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="researcher">Researcher</SelectItem>
                        <SelectItem value="industry">Industry Partner</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button variant="ustp">Create User</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

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
    </div>
  );
};

export default Admin;