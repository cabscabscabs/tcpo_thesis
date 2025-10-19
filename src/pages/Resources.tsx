import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, BookOpen, Video, FileText, Users, Calendar, ExternalLink, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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
  const [events, setEvents] = useState([]);

  // Load events from localStorage safely
  useEffect(() => {
    try {
      const savedEvents = localStorage.getItem('eventsData');
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        if (Array.isArray(parsedEvents)) {
          setEvents(parsedEvents);
        }
      }
    } catch (error) {
      console.warn('Failed to load events data:', error);
      // Continue with empty events array
    }
  }, []);

  // Simple static data for resources
  const templates = [
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
  ];

  const tutorials = [
    {
      id: 1,
      title: "Introduction to Intellectual Property",
      description: "Fundamentals of IP protection, types of IP, and why it matters for researchers",
      duration: "45 minutes",
      modules: 6,
      level: "Beginner"
    }
  ];

  const facilities = [
    {
      id: 1,
      name: "Advanced Materials Testing Lab",
      description: "State-of-the-art equipment for materials characterization and testing",
      capacity: "10 researchers",
      hourlyRate: "₱500"
    }
  ];

  const guidelines = [
    {
      id: 1,
      title: "USTP Research Ethics Guidelines",
      description: "Comprehensive guide to ethical considerations in research and development",
      pages: 45,
      lastUpdated: "March 2024"
    }
  ];

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
                      <Button variant="gold-outline" size="sm" className="w-full">
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
                      <Button variant="gold-outline" size="sm" className="w-full">
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
                    <CardDescription>
                      {event.description}
                    </CardDescription>
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
                    <Button 
                      variant="gold" 
                      size="sm" 
                      className="w-full"
                      disabled={!event.registrationOpen}
                      onClick={() => {
                        if (event.registrationOpen) {
                          alert(`Registration for "${event.title}"

To register, please contact us at:
Email: tpco@ustp.edu.ph
Phone: (088) 856-1738

Online registration coming soon!`);
                        }
                      }}
                    >
                      {event.registrationOpen ? 'Register Now' : 'Registration Closed'}
                      <Users size={16} className="ml-2" />
                    </Button>
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

      <Footer />
    </div>
  );
};

export default Resources;