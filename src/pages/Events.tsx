import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, Clock, ArrowLeft, ExternalLink, Loader2, CheckCircle, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Events = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

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
      const { data, error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: selectedEvent.id,
          full_name: registrationForm.full_name.trim(),
          email: registrationForm.email.trim(),
          phone: registrationForm.phone.trim() || null,
          organization: registrationForm.organization.trim() || null,
          position: registrationForm.position.trim() || null,
          dietary_requirements: registrationForm.dietary_requirements.trim() || null,
          special_requests: registrationForm.special_requests.trim() || null,
          status: 'pending'
        })
        .select();

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already Registered",
            description: "You have already registered for this event with this email address.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        setRegistrationSuccess(true);
        toast({
          title: "Registration Successful!",
          description: `You have been registered for "${selectedEvent.title}". We will contact you at ${registrationForm.email} with further details.`
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: `${error?.message || "There was an error submitting your registration."} Please try again or contact us at tpco@ustp.edu.ph`,
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
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              setSelectedEventDetails(event);
                              setShowDetailsModal(true);
                            }}
                          >
                            <Info className="mr-2" size={16} />
                            View Details
                          </Button>
                          <Button 
                            variant="gold" 
                            className="flex-1"
                            disabled={!event.registrationOpen}
                            onClick={() => {
                              if (event.registrationOpen) handleOpenRegistration(event);
                            }}
                          >
                            {event.registrationOpen ? 'Register Now' : 'Registration Closed'}
                            <Users className="ml-2" size={16} />
                          </Button>
                        </div>
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
                            setSelectedEventDetails(event);
                            setShowDetailsModal(true);
                          }}
                        >
                          <Info className="mr-2" size={16} />
                          View Details
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
                        {selectedEventDetails && formatDate(selectedEventDetails.date)}
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
                        <span>{formatTime(selectedEventDetails.time)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users size={15} className="text-secondary" />
                        <span>{selectedEventDetails.capacity ? `${selectedEventDetails.capacity} max capacity` : 'Capacity TBA'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 col-span-2">
                        <MapPin size={15} className="text-secondary" />
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
                        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
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
              <Button variant="gold" onClick={() => setShowRegistrationModal(false)}>Close</Button>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="ev-full_name">Full Name *</Label>
                  <Input id="ev-full_name" placeholder="Enter your full name"
                    value={registrationForm.full_name}
                    onChange={(e) => setRegistrationForm({...registrationForm, full_name: e.target.value})}
                    required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ev-email">Email Address *</Label>
                  <Input id="ev-email" type="email" placeholder="your.email@example.com"
                    value={registrationForm.email}
                    onChange={(e) => setRegistrationForm({...registrationForm, email: e.target.value})}
                    required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="ev-phone">Phone Number</Label>
                    <Input id="ev-phone" placeholder="+63 XXX XXX XXXX"
                      value={registrationForm.phone}
                      onChange={(e) => setRegistrationForm({...registrationForm, phone: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="ev-position">Position/Role</Label>
                    <Input id="ev-position" placeholder="Your position"
                      value={registrationForm.position}
                      onChange={(e) => setRegistrationForm({...registrationForm, position: e.target.value})} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ev-organization">Organization/Institution</Label>
                  <Input id="ev-organization" placeholder="Your organization or institution"
                    value={registrationForm.organization}
                    onChange={(e) => setRegistrationForm({...registrationForm, organization: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ev-dietary">Dietary Requirements</Label>
                  <Input id="ev-dietary" placeholder="Any dietary restrictions or preferences"
                    value={registrationForm.dietary_requirements}
                    onChange={(e) => setRegistrationForm({...registrationForm, dietary_requirements: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ev-special">Special Requests/Comments</Label>
                  <Textarea id="ev-special" placeholder="Any special requests or additional comments"
                    value={registrationForm.special_requests}
                    onChange={(e) => setRegistrationForm({...registrationForm, special_requests: e.target.value})}
                    rows={3} />
                </div>
                {selectedEvent?.capacity && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                    <Users size={16} />
                    <span>{selectedEvent.attendees || 0} of {selectedEvent.capacity} spots filled</span>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowRegistrationModal(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" variant="gold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Registering...</>
                  ) : (
                    <><span>Submit Registration</span><Users size={16} className="ml-2" /></>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;