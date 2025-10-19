import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, Clock, ArrowLeft, ExternalLink } from "lucide-react";

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load events from admin panel
  useEffect(() => {
    const loadEvents = () => {
      try {
        const savedEvents = localStorage.getItem('eventsData');
        if (savedEvents) {
          const parsedEvents = JSON.parse(savedEvents);
          setEvents(parsedEvents);
        }
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();

    // Listen for storage changes to update events in real-time
    const handleStorageChange = () => {
      loadEvents();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'TBA';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Separate upcoming and past events
  const currentDate = new Date();
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= currentDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const pastEvents = events
    .filter(event => new Date(event.date) < currentDate)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="py-12 bg-gradient-ustp">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/resources')}
            className="text-white hover:bg-white/10 mb-6"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Resources
          </Button>
          
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-roboto font-bold mb-6">
              Workshops & Events
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Join our workshops and events to enhance your IP and technology transfer knowledge.
              Connect with experts and build valuable partnerships.
            </p>
          </div>
        </div>
      </section>

      {/* Events Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 text-white">
              <TabsTrigger value="upcoming">
                Upcoming Events ({upcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past Events ({pastEvents.length})
              </TabsTrigger>
            </TabsList>
            
            {/* Upcoming Events */}
            <TabsContent value="upcoming" className="space-y-6">
              {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {upcomingEvents.map((event) => (
                    <Card key={event.id} className="hover:shadow-card transition-all duration-300">
                      {event.image && (
                        <div 
                          className="h-48 bg-cover bg-center rounded-t-lg"
                          style={{ backgroundImage: `url(${event.image})` }}
                        />
                      )}
                      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </Badge>
                          <Badge variant={event.registrationOpen ? "default" : "destructive"}>
                            {event.registrationOpen ? 'Registration Open' : 'Registration Closed'}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl font-roboto text-primary">
                          {event.title}
                        </CardTitle>
                        <CardDescription>
                          {event.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="mr-3 text-secondary" size={18} />
                            <span className="font-medium">{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="mr-3 text-secondary" size={18} />
                            <span>{formatTime(event.time)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="mr-3 text-secondary" size={18} />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="mr-3 text-secondary" size={18} />
                            <span>{event.capacity} max capacity</span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="gold" 
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
                          <ExternalLink className="ml-2" size={16} />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="mx-auto mb-4 text-gray-400" size={64} />
                  <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Upcoming Events</h3>
                  <p className="text-gray-500">Check back soon for new workshops and events!</p>
                </div>
              )}
            </TabsContent>
            
            {/* Past Events */}
            <TabsContent value="past" className="space-y-6">
              {pastEvents.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pastEvents.map((event) => (
                    <Card key={event.id} className="opacity-75 hover:opacity-100 transition-opacity duration-300">
                      {event.image && (
                        <div 
                          className="h-48 bg-cover bg-center rounded-t-lg grayscale"
                          style={{ backgroundImage: `url(${event.image})` }}
                        />
                      )}
                      <CardHeader className="bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </Badge>
                          <Badge variant="outline">
                            Completed
                          </Badge>
                        </div>
                        <CardTitle className="text-xl font-roboto text-gray-700">
                          {event.title}
                        </CardTitle>
                        <CardDescription>
                          {event.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="mr-3 text-gray-400" size={18} />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="mr-3 text-gray-400" size={18} />
                            <span>{formatTime(event.time)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="mr-3 text-gray-400" size={18} />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="mr-3 text-gray-400" size={18} />
                            <span>{event.capacity} capacity</span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            alert(`Event Summary for "${event.title}"

Date: ${formatDate(event.date)}
Location: ${event.location}
Attendees: ${event.registrations}

Detailed event reports coming soon!`);
                          }}
                        >
                          View Summary
                          <ExternalLink className="ml-2" size={16} />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="mx-auto mb-4 text-gray-400" size={64} />
                  <h3 className="text-2xl font-semibold text-gray-600 mb-2">No Past Events</h3>
                  <p className="text-gray-500">Past events will appear here once they're completed.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-roboto font-bold mb-6">
            Have Questions About Our Events?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Contact our team for more information about workshops, registration, or hosting your own event.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="gold" 
              size="lg"
              onClick={() => window.location.href = 'mailto:tpco@ustp.edu.ph?subject=Event Inquiry'}
            >
              Email Us
              <ExternalLink className="ml-2" size={18} />
            </Button>
            
            <Button 
              variant="gold-outline" 
              size="lg"
              onClick={() => window.location.href = 'tel:(088)856-1738'}
            >
              Call (088) 856-1738
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;