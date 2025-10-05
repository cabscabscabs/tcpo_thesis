import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  const [news] = useState([
    { id: 1, title: "TPCO-CET Convergence 2025 Announced", status: "Published", date: "2024-01-15", category: "Events" },
    { id: 2, title: "New Patent Filing Workshop Series", status: "Draft", date: "2024-01-10", category: "Education" },
    { id: 3, title: "Industry Partnership with ABC Corp", status: "Published", date: "2024-01-08", category: "Partnerships" }
  ]);

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

  // Load saved homepage content on component mount
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
                  <div className="text-3xl font-bold text-ustp-blue">24</div>
                  <p className="text-sm text-muted-foreground">+3 this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Published News</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-ustp-blue">18</div>
                  <p className="text-sm text-muted-foreground">+5 this week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-ustp-blue">6</div>
                  <p className="text-sm text-muted-foreground">Next: Feb 15</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Service Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-ustp-blue">35</div>
                  <p className="text-sm text-muted-foreground">+8 pending</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">New patent application submitted</p>
                      <p className="text-sm text-muted-foreground">Smart Water Management System - 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">News article published</p>
                      <p className="text-sm text-muted-foreground">Innovation Workshop announcement - 5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">New service request</p>
                      <p className="text-sm text-muted-foreground">Technology licensing inquiry - 1 day ago</p>
                    </div>
                  </div>
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
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Smart Irrigation System</p>
                        <p className="text-sm text-muted-foreground">Currently featured</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Bio-plastic Innovation</p>
                        <p className="text-sm text-muted-foreground">Currently featured</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Food Processing Tech</p>
                        <p className="text-sm text-muted-foreground">Currently featured</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  <Button variant="ustp" className="w-full">
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
              <Button variant="ustp">
                <Plus className="mr-2 h-4 w-4" />
                Create News Article
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Create News Article</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="news-title">Article Title</Label>
                    <Input id="news-title" placeholder="Enter article title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="news-category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="events">Events</SelectItem>
                        <SelectItem value="partnerships">Partnerships</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="innovation">Innovation</SelectItem>
                        <SelectItem value="announcements">Announcements</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="news-author">Author</Label>
                    <Input id="news-author" placeholder="Article author" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="news-date">Publication Date</Label>
                    <Input id="news-date" type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="news-excerpt">Excerpt</Label>
                  <Textarea id="news-excerpt" placeholder="Brief summary of the article" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="news-content">Article Content</Label>
                  <Textarea id="news-content" placeholder="Full article content" rows={8} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="news-image">Featured Image</Label>
                  <Input id="news-image" type="file" accept="image/*" />
                </div>
                <div className="flex gap-2">
                  <Button variant="ustp">Publish Article</Button>
                  <Button variant="outline">Save as Draft</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Published Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {news.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{article.title}</h3>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={article.status === "Published" ? "default" : "secondary"}>
                            {article.status}
                          </Badge>
                          <Badge variant="outline">{article.category}</Badge>
                          <span className="text-sm text-muted-foreground">{article.date}</span>
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
    </div>
  );
};

export default Admin;