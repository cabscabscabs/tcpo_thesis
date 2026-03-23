import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, BookOpen, Video, FileText, Users, Calendar, ExternalLink, Clock, Loader2, CheckCircle, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Helper function to format time - defined at the top to avoid issues
const formatTime = (timeString) => {
  if (!timeString) return 'TBA';
  try {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  } catch (error) {
    return 'TBA';
  }
};

const Resources = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  
  // Registration modal state
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Event details modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState<any>(null);
  
  // Registration form state
  const [registrationForm, setRegistrationForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
    dietary_requirements: '',
    special_requests: ''
  });

  // Handle opening registration modal
  const handleOpenRegistration = (event: any) => {
    setSelectedEvent(event);
    setShowRegistrationModal(true);
    setRegistrationSuccess(false);
    setRegistrationForm({
      full_name: '',
      email: '',
      phone: '',
      organization: '',
      position: '',
      dietary_requirements: '',
      special_requests: ''
    });
  };

  // Handle registration submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEvent) return;
    
    // Validate required fields
    if (!registrationForm.full_name.trim() || !registrationForm.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in your full name and email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Debug: Log the event ID being used
      console.log('Registering for event:', selectedEvent.id, 'Type:', typeof selectedEvent.id);
      
      const insertData = {
        event_id: selectedEvent.id,
        full_name: registrationForm.full_name.trim(),
        email: registrationForm.email.trim(),
        phone: registrationForm.phone.trim() || null,
        organization: registrationForm.organization.trim() || null,
        position: registrationForm.position.trim() || null,
        dietary_requirements: registrationForm.dietary_requirements.trim() || null,
        special_requests: registrationForm.special_requests.trim() || null,
        status: 'pending'
      };
      console.log('Insert data:', insertData);
      
      const { data, error } = await supabase
        .from('event_registrations')
        .insert(insertData)
        .select();
      
      console.log('Supabase response - data:', data, 'error:', error);
      
      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already Registered",
            description: "You have already registered for this event with this email address.",
            variant: "destructive"
          });
        } else {
          console.error('Supabase error:', error);
          // Check for common errors
          if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
            toast({
              title: "Registration Not Available",
              description: "The registration system is being set up. Please contact us directly at tpco@ustp.edu.ph",
              variant: "destructive"
            });
          } else {
            throw error;
          }
        }
      } else {
        setRegistrationSuccess(true);
        toast({
          title: "Registration Successful!",
          description: `You have been registered for "${selectedEvent.title}". We will contact you at ${registrationForm.email} with further details.`
        });
        // Refresh events to update attendee count
        const { data } = await supabase
          .from('admin_events' as any)
          .select('*')
          .eq('published', true)
          .order('date', { ascending: true });
        
        if (data) {
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
          })));
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error?.message || "There was an error submitting your registration.";
      toast({
        title: "Registration Failed",
        description: `${errorMessage} Please try again or contact us at tpco@ustp.edu.ph`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load events from Supabase
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_events' as any)
          .select('*')
          .eq('published', true)
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
        console.warn('Failed to load events data:', error);
      }
    };
    
    loadEvents();
  }, []);

  // Load resources from Supabase
  const [templates, setTemplates] = useState<any[]>([
    {
      id: 1,
      title: "Non-Disclosure Agreement (NDA)",
      description: "Standard template for protecting confidential information during technology discussions",
      format: "PDF, DOCX",
      lastUpdated: "March 2024"
    },
    {
      title: "Memorandum of Understanding (MOU)",
      description: "Framework for establishing research partnerships and collaboration agreements",
      format: "PDF, DOCX", 
      lastUpdated: "February 2024"
    }
  ]);

  const [tutorials, setTutorials] = useState<any[]>([
    {
      id: 1,
      title: "Introduction to Intellectual Property",
      description: "Fundamentals of IP protection, types of IP, and why it matters for researchers",
      duration: "45 minutes",
      modules: 6,
      level: "Beginner"
    }
  ]);

  const [facilities, setFacilities] = useState<any[]>([
    {
      id: 1,
      name: "Advanced Materials Testing Lab",
      description: "State-of-the-art equipment for materials characterization and testing",
      capacity: "10 researchers",
      hourlyRate: "₱500"
    }
  ]);

  const [guidelines, setGuidelines] = useState<any[]>([
    {
      id: 1,
      title: "USTP Research Ethics Guidelines",
      description: "Comprehensive guide to ethical considerations in research and development",
      pages: 45,
      lastUpdated: "March 2024"
    }
  ]);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const { data, error } = await supabase
          .from('resources' as any)
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });
        
        if (data && !error) {
          // Separate resources by category
          const dbTemplates = data.filter((r: any) => r.category === 'Templates').map((r: any) => ({
            id: r.id,
            title: r.title,
            description: r.content || '',
            format: r.type === 'video' ? 'Video' : r.file_url ? 'Download' : r.url ? 'Link' : 'Document',
            lastUpdated: r.updated_at ? new Date(r.updated_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently',
            url: r.url,
            file_url: r.file_url
          }));

          const dbTutorials = data.filter((r: any) => r.category === 'IP 101 Tutorials').map((r: any) => ({
            id: r.id,
            title: r.title,
            description: r.content || '',
            duration: r.duration || 'Self-paced',
            modules: r.modules_count || 0,
            level: r.level || 'Beginner',
            url: r.url
          }));

          const dbFacilities = data.filter((r: any) => r.category === 'SSF Booking').map((r: any) => ({
            id: r.id,
            name: r.title,
            description: r.content || '',
            capacity: r.capacity,
            hourlyRate: r.hourly_rate ? `₱${r.hourly_rate}` : 'Contact for pricing',
            equipment: r.equipment || []
          }));

          const dbGuidelines = data.filter((r: any) => r.category === 'Guidelines').map((r: any) => ({
            id: r.id,
            title: r.title,
            description: r.content || '',
            pages: null,
            lastUpdated: r.updated_at ? new Date(r.updated_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently',
            url: r.url,
            file_url: r.file_url
          }));

          // Only update if there are resources from DB
          if (dbTemplates.length > 0) setTemplates(dbTemplates);
          if (dbTutorials.length > 0) setTutorials(dbTutorials);
          if (dbFacilities.length > 0) setFacilities(dbFacilities);
          if (dbGuidelines.length > 0) setGuidelines(dbGuidelines);
        }
      } catch (error) {
        console.warn('Failed to load resources data:', error);
      }
    };
    
    loadResources();
  }, []);

  // Filter upcoming events with open registration
  const currentDate = new Date();
  const upcomingEvents = events
    .filter(event => {
      try {
        return new Date(event.date) >= currentDate && 
               event.registrationOpen === true;
      } catch (error) {
        console.warn('Error filtering events:', error);
        return false;
      }
    })
    .sort((a, b) => {
      try {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } catch (error) {
        console.warn('Error sorting events:', error);
        return 0;
      }
    })
    .slice(0, 3); // Limit to 3 events maximum

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-roboto font-bold text-white mb-6">
            Resources & Tools
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            Access comprehensive resources, learning materials, and tools to support 
            your innovation journey and technology transfer activities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gold" size="lg" onClick={() => navigate('/browse-resources')}>
              Browse All Resources
              <BookOpen className="ml-2" />
            </Button>
            <Button variant="gold-outline" size="lg" onClick={() => navigate('/facility-booking')}>
              Book Facility Access
              <Calendar className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Main Resources Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="templates" className="w-full">
            <TabsList className="grid w-full grid-cols-4 text-white">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="tutorials">IP 101 Tutorials</TabsTrigger>
              <TabsTrigger value="facilities">SSF Booking</TabsTrigger>
              <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
            </TabsList>
            
            {/* Templates Tab */}
            <TabsContent value="templates" className="mt-8">
              <div className="mb-8">
                <h2 className="text-2xl font-roboto font-bold text-primary mb-4">
                  Legal Templates & Documents
                </h2>
                <p className="text-gray-600 mb-6">
                  Download essential legal templates and documentation for IP protection and partnerships.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template, index) => (
                  <Card key={index} className="hover:shadow-card transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <FileText className="text-secondary flex-shrink-0" size={24} />
                        <span className="text-xs text-gray-500">{template.format}</span>
                      </div>
                      <CardTitle className="text-lg font-roboto text-primary">
                        {template.title}
                      </CardTitle>
                      <CardDescription>
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Updated:</span>
                          <span className="font-medium">{template.lastUpdated}</span>
                        </div>
                      </div>
                      <Button 
                        variant="gold-outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          if (template.file_url) {
                            window.open(template.file_url, '_blank');
                          } else if (template.url) {
                            window.open(template.url, '_blank');
                          } else {
                            alert('Download not available for this template yet.');
                          }
                        }}
                      >
                        <Download size={16} className="mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Tutorials Tab */}
            <TabsContent value="tutorials" className="mt-8">
              <div className="mb-8">
                <h2 className="text-2xl font-roboto font-bold text-primary mb-4">
                  IP 101 Learning Modules
                </h2>
                <p className="text-gray-600 mb-6">
                  Interactive video tutorials and learning modules covering intellectual property fundamentals.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {tutorials.map((tutorial, index) => (
                  <Card key={index} className="hover:shadow-card transition-all duration-300">
                    <CardHeader className="bg-secondary/10">
                      <div className="flex items-start justify-between mb-2">
                        <Video className="text-secondary flex-shrink-0" size={24} />
                        <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                          {tutorial.level}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-roboto text-primary">
                        {tutorial.title}
                      </CardTitle>
                      <CardDescription>
                        {tutorial.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex justify-between text-sm mb-4">
                        <div className="flex items-center">
                          <Clock size={16} className="mr-1 text-gray-500" />
                          <span>{tutorial.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <BookOpen size={16} className="mr-1 text-gray-500" />
                          <span>{tutorial.modules} modules</span>
                        </div>
                      </div>
                      
                      <Button variant="gold" size="sm" className="w-full">
                        Start Learning
                        <ExternalLink size={16} className="ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* SSF Facilities Tab */}
            <TabsContent value="facilities" className="mt-8">
              <div className="mb-8">
                <h2 className="text-2xl font-roboto font-bold text-primary mb-4">
                  Shared Service Facilities (SSF)
                </h2>
                <p className="text-gray-600 mb-6">
                  Book access to state-of-the-art research facilities and equipment.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {facilities.map((facility, index) => (
                  <Card key={index} className="hover:shadow-card transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl font-roboto text-primary">
                        {facility.name}
                      </CardTitle>
                      <CardDescription>
                        {facility.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {facility.capacity && (
                            <div>
                              <span className="text-gray-500">Capacity:</span>
                              <div className="font-medium">{facility.capacity}</div>
                            </div>
                          )}
                          {facility.hourlyRate && (
                            <div>
                              <span className="text-gray-500">Hourly Rate:</span>
                              <div className="font-medium text-secondary">{facility.hourlyRate}</div>
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          variant="gold-outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => navigate('/facility-booking')}
                        >
                          Book Facility
                          <Calendar size={16} className="ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Guidelines Tab */}
            <TabsContent value="guidelines" className="mt-8">
              <div className="mb-8">
                <h2 className="text-2xl font-roboto font-bold text-primary mb-4">
                  Research Guidelines & Best Practices
                </h2>
                <p className="text-gray-600 mb-6">
                  Comprehensive guidelines and best practices for research, IP management, and technology transfer.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guidelines.map((guide, index) => (
                  <Card key={index} className="hover:shadow-card transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <BookOpen className="text-secondary flex-shrink-0" size={24} />
                        {guide.pages && <span className="text-xs text-gray-500">{guide.pages} pages</span>}
                      </div>
                      <CardTitle className="text-lg font-roboto text-primary">
                        {guide.title}
                      </CardTitle>
                      <CardDescription>
                        {guide.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Updated:</span>
                          <span className="font-medium">{guide.lastUpdated}</span>
                        </div>
                      </div>
                      <Button 
                        variant="gold-outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          if (guide.file_url) {
                            window.open(guide.file_url, '_blank');
                          } else if (guide.url) {
                            window.open(guide.url, '_blank');
                          } else {
                            alert('Download not available for this guide yet.');
                          }
                        }}
                      >
                        <Download size={16} className="mr-2" />
                        Download Guide
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Workshops & Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-roboto font-bold text-primary mb-4">
              Workshops & Events
            </h2>
            <p className="text-lg text-gray-600">
              Join our regular workshops and events to enhance your IP and technology transfer knowledge
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event, index) => (
                <Card key={index} className="hover:shadow-card transition-all duration-300">
                  <CardHeader className="bg-secondary/10">
                    <div className="flex items-center mb-2">
                      <Calendar className="text-secondary mr-2" size={20} />
                      <span className="text-sm font-medium text-secondary">
                        {(() => {
                          try {
                            return new Date(event.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            });
                          } catch (error) {
                            return 'Date TBA';
                          }
                        })()}
                      </span>
                    </div>
                    <CardTitle className="text-xl font-roboto text-primary">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Time:</span>
                        <span className="font-medium">
                          {event.time ? formatTime(event.time) : 'TBA'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Location:</span>
                        <span className="font-medium">{event.location || 'Location TBA'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Capacity:</span>
                        <span className="font-medium">{event.capacity ? `${event.capacity} participants` : 'Capacity TBA'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Registration:</span>
                        <span className="font-medium text-secondary">
                          {event.registrationOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedEventDetails(event);
                          setShowDetailsModal(true);
                        }}
                      >
                        <Info size={16} className="mr-2" />
                        View Details
                      </Button>
                      <Button 
                        variant="gold" 
                        size="sm" 
                        className="flex-1"
                        disabled={!event.registrationOpen}
                        onClick={() => {
                          if (event.registrationOpen) {
                            handleOpenRegistration(event);
                          }
                        }}
                      >
                        {event.registrationOpen ? 'Register Now' : 'Registration Closed'}
                        <Users size={16} className="ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Upcoming Events</h3>
                <p className="text-gray-500 mb-4">Check back soon for new workshops and events!</p>
                <Button variant="gold" onClick={() => navigate('/events')}>
                  View All Events
                  <ExternalLink className="ml-2" size={16} />
                </Button>
              </div>
            )}
          </div>
          
          {upcomingEvents.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="outline" onClick={() => navigate('/events')}>
                View All Events
                <ExternalLink className="ml-2" size={16} />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Event Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-[520px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-roboto text-primary">
              {selectedEventDetails?.title}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="flex items-center gap-2 mt-1">
                <Calendar size={14} className="text-secondary" />
                <span className="text-sm text-secondary font-medium">
                  {selectedEventDetails && (() => {
                    try {
                      return new Date(selectedEventDetails.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                    } catch { return 'Date TBA'; }
                  })()}
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>

          {selectedEventDetails && (
            <div className="space-y-4">
              {selectedEventDetails.image && (
                <div
                  className="h-48 bg-cover bg-center rounded-lg"
                  style={{ backgroundImage: `url(${selectedEventDetails.image})` }}
                />
              )}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={15} className="text-secondary" />
                  <span>{selectedEventDetails.time ? formatTime(selectedEventDetails.time) : 'TBA'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={15} className="text-secondary" />
                  <span>{selectedEventDetails.capacity ? `${selectedEventDetails.capacity} participants` : 'Capacity TBA'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 col-span-2">
                  <ExternalLink size={15} className="text-secondary" />
                  <span>{selectedEventDetails.location || 'Location TBA'}</span>
                </div>
              </div>
              {selectedEventDetails.description && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">About this Event</h4>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedEventDetails.description}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDetailsModal(false)}>Close</Button>
            {selectedEventDetails?.registrationOpen && (
              <Button
                variant="gold"
                onClick={() => {
                  setShowDetailsModal(false);
                  handleOpenRegistration(selectedEventDetails);
                }}
              >
                Register Now
                <Users size={16} className="ml-2" />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Registration Modal */}
      <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Event Registration</DialogTitle>
            <DialogDescription>
              {selectedEvent && (
                <span>
                  Register for <strong>"{selectedEvent.title}"</strong>
                  {selectedEvent.date && (
                    <span className="block mt-1 text-sm">
                      {new Date(selectedEvent.date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                      {selectedEvent.time && ` at ${formatTime(selectedEvent.time)}`}
                    </span>
                  )}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {registrationSuccess ? (
            <div className="py-6 text-center">
              <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
              <h3 className="text-xl font-semibold mb-2">Registration Successful!</h3>
              <p className="text-gray-600 mb-4">
                Thank you for registering. You will receive a confirmation email at <strong>{registrationForm.email}</strong>
              </p>
              <Button variant="gold" onClick={() => setShowRegistrationModal(false)}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    placeholder="Enter your full name"
                    value={registrationForm.full_name}
                    onChange={(e) => setRegistrationForm({...registrationForm, full_name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={registrationForm.email}
                    onChange={(e) => setRegistrationForm({...registrationForm, email: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+63 XXX XXX XXXX"
                      value={registrationForm.phone}
                      onChange={(e) => setRegistrationForm({...registrationForm, phone: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="position">Position/Role</Label>
                    <Input
                      id="position"
                      placeholder="Your position"
                      value={registrationForm.position}
                      onChange={(e) => setRegistrationForm({...registrationForm, position: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="organization">Organization/Institution</Label>
                  <Input
                    id="organization"
                    placeholder="Your organization or institution"
                    value={registrationForm.organization}
                    onChange={(e) => setRegistrationForm({...registrationForm, organization: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="dietary_requirements">Dietary Requirements</Label>
                  <Input
                    id="dietary_requirements"
                    placeholder="Any dietary restrictions or preferences"
                    value={registrationForm.dietary_requirements}
                    onChange={(e) => setRegistrationForm({...registrationForm, dietary_requirements: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="special_requests">Special Requests/Comments</Label>
                  <Textarea
                    id="special_requests"
                    placeholder="Any special requests or additional comments"
                    value={registrationForm.special_requests}
                    onChange={(e) => setRegistrationForm({...registrationForm, special_requests: e.target.value})}
                    rows={3}
                  />
                </div>
                
                {selectedEvent?.capacity && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                    <Users size={16} />
                    <span>
                      {selectedEvent.attendees || 0} of {selectedEvent.capacity} spots filled
                    </span>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowRegistrationModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="gold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      Submit Registration
                      <Users size={16} className="ml-2" />
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Resources;