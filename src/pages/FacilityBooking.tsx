import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Clock, Users, Wrench, Loader2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const FacilityBooking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Booking inquiry modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    organization: '',
    preferred_date: '',
    preferred_time: '',
    purpose: '',
    additional_notes: ''
  });

  // Load facilities from Supabase
  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    try {
      const { data, error } = await supabase
        .from('resources' as any)
        .select('*')
        .eq('category', 'SSF Booking')
        .eq('published', true)
        .order('title', { ascending: true });
      
      if (data && !error) {
        setFacilities(data.map((facility: any) => ({
          id: facility.id,
          name: facility.title,
          description: facility.content,
          equipment: facility.equipment || [],
          capacity: facility.capacity,
          hourlyRate: facility.hourly_rate ? `₱${facility.hourly_rate}` : 'Contact for pricing',
          bookingLead: facility.booking_lead_time || 'Contact for details'
        })));
      } else {
        // Use default facilities if no data from Supabase
        setFacilities(ssfFacilities);
      }
    } catch (error) {
      console.error('Error loading facilities:', error);
      setFacilities(ssfFacilities);
    } finally {
      setLoading(false);
    }
  };

  // Default facilities as fallback
  const ssfFacilities = [
    {
      id: 1,
      name: "Advanced Materials Testing Lab",
      description: "State-of-the-art equipment for materials characterization and testing",
      equipment: ["SEM-EDS", "XRD", "FTIR", "Universal Testing Machine", "Hardness Tester"],
      capacity: "10 researchers",
      hourlyRate: "₱500",
      bookingLead: "48 hours"
    },
    {
      id: 2,
      name: "Biotechnology Research Facility", 
      description: "Fully equipped lab for biotechnology and life sciences research",
      equipment: ["PCR Machines", "Spectrophotometer", "Centrifuges", "Incubators", "Biosafety Cabinet"],
      capacity: "8 researchers",
      hourlyRate: "₱400",
      bookingLead: "72 hours"
    },
    {
      id: 3,
      name: "Food Technology Laboratory",
      description: "Comprehensive facility for food processing and analysis research",
      equipment: ["Texture Analyzer", "Color Meter", "pH Meter", "Packaging Equipment", "Sensory Testing Booth"],
      capacity: "12 researchers",
      hourlyRate: "₱350",
      bookingLead: "24 hours"
    },
    {
      id: 4,
      name: "Environmental Analysis Center",
      description: "Specialized lab for environmental monitoring and analysis",
      equipment: ["GC-MS", "HPLC", "Ion Chromatograph", "Water Quality Analyzers", "Air Sampling Equipment"],
      capacity: "6 researchers",
      hourlyRate: "₱600",
      bookingLead: "96 hours"
    }
  ];

  const bookingProcess = [
    {
      step: 1,
      title: "Initial Inquiry",
      description: "Contact TPCO office to discuss your research needs and facility requirements"
    },
    {
      step: 2,
      title: "Request Review",
      description: "Our team will review your request and check facility availability"
    },
    {
      step: 3,
      title: "Booking Confirmation",
      description: "Receive confirmation with booking details, rates, and guidelines"
    },
    {
      step: 4,
      title: "Pre-booking Orientation",
      description: "Attend safety orientation and equipment training session"
    },
    {
      step: 5,
      title: "Facility Access",
      description: "Access the facility during your booked time with technical support"
    }
  ];

  const handleContactTPCO = () => {
    navigate('/contact');
  };

  const handleCallTPCO = () => {
    window.open('tel:+63888561738');
  };

  const handleEmailTPCO = () => {
    window.open('mailto:tpco@ustp.edu.ph?subject=SSF Facility Booking Inquiry');
  };

  const handleOpenBookingModal = (facility: any) => {
    setSelectedFacility(facility);
    setShowBookingModal(true);
    setSubmitSuccess(false);
    setBookingForm({
      full_name: '',
      email: '',
      phone: '',
      organization: '',
      preferred_date: '',
      preferred_time: '',
      purpose: '',
      additional_notes: ''
    });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFacility) return;
    
    // Validate required fields
    if (!bookingForm.full_name.trim() || !bookingForm.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in your full name and email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('facility_booking_inquiries' as any)
        .insert({
          facility_id: typeof selectedFacility.id === 'string' ? selectedFacility.id : null,
          facility_name: selectedFacility.name,
          full_name: bookingForm.full_name.trim(),
          email: bookingForm.email.trim(),
          phone: bookingForm.phone.trim() || null,
          organization: bookingForm.organization.trim() || null,
          preferred_date: bookingForm.preferred_date || null,
          preferred_time: bookingForm.preferred_time || null,
          purpose: bookingForm.purpose.trim() || null,
          additional_notes: bookingForm.additional_notes.trim() || null,
          status: 'pending'
        });
      
      if (error) {
        console.error('Error submitting booking inquiry:', error);
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your inquiry. Please try again or contact us directly.",
          variant: "destructive"
        });
      } else {
        setSubmitSuccess(true);
        toast({
          title: "Inquiry Submitted!",
          description: `Your booking inquiry for "${selectedFacility.name}" has been submitted. We will contact you at ${bookingForm.email}.`
        });
      }
    } catch (error: any) {
      console.error('Booking inquiry error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your inquiry. Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
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
              Shared Service Facilities
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Access state-of-the-art research facilities and equipment for your innovation projects. 
              Contact our team to schedule your facility booking.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Information */}
      <section className="py-12 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-roboto font-bold text-primary mb-4">
              How to Book Facilities
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              All facility bookings are handled through direct communication with our TPCO office. 
              Our team will guide you through the process and ensure you have everything needed for your research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
            {bookingProcess.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Contact Options */}
          <div className="bg-white rounded-lg shadow-card p-8">
            <h3 className="text-2xl font-roboto font-bold text-primary text-center mb-8">
              Contact TPCO for Facility Booking
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center cursor-pointer hover:shadow-card transition-all duration-300" onClick={handleCallTPCO}>
                <CardContent className="p-6">
                  <Phone className="text-secondary mx-auto mb-4" size={32} />
                  <h4 className="font-semibold mb-2">Call Us</h4>
                  <p className="text-gray-600 mb-2">(088) 856-1738</p>
                  <p className="text-sm text-gray-500">Mon-Fri, 8:00 AM - 5:00 PM</p>
                </CardContent>
              </Card>
              
              <Card className="text-center cursor-pointer hover:shadow-card transition-all duration-300" onClick={handleEmailTPCO}>
                <CardContent className="p-6">
                  <Mail className="text-secondary mx-auto mb-4" size={32} />
                  <h4 className="font-semibold mb-2">Email Us</h4>
                  <p className="text-gray-600 mb-2">tpco@ustp.edu.ph</p>
                  <p className="text-sm text-gray-500">Response within 24 hours</p>
                </CardContent>
              </Card>
              
              <Card className="text-center cursor-pointer hover:shadow-card transition-all duration-300" onClick={handleContactTPCO}>
                <CardContent className="p-6">
                  <MapPin className="text-secondary mx-auto mb-4" size={32} />
                  <h4 className="font-semibold mb-2">Visit Us</h4>
                  <p className="text-gray-600 mb-2">USTP CDO Campus</p>
                  <p className="text-sm text-gray-500">Get directions & contact info</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <Button variant="gold" size="lg" onClick={handleContactTPCO}>
                Get Complete Contact Information
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Available Facilities */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-roboto font-bold text-primary mb-4">
              Available Facilities
            </h2>
            <p className="text-lg text-gray-600">
              Explore our range of specialized research facilities and equipment
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {facilities.map((facility) => (
              <Card key={facility.id} className="hover:shadow-card transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-roboto text-primary flex items-center">
                    <Wrench className="mr-2" size={24} />
                    {facility.name}
                  </CardTitle>
                  <CardDescription>
                    {facility.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Available Equipment:</h4>
                      <div className="grid grid-cols-1 gap-1">
                        {facility.equipment.map((item: string, idx: number) => (
                          <div key={idx} className="text-sm text-gray-600 flex items-center">
                            <div className="w-1 h-1 bg-secondary rounded-full mr-2"></div>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <Users className="mx-auto mb-1 text-gray-500" size={16} />
                        <span className="text-gray-500">Capacity</span>
                        <div className="font-medium">{facility.capacity}</div>
                      </div>
                      <div className="text-center">
                        <span className="text-gray-500">Hourly Rate</span>
                        <div className="font-medium text-secondary">{facility.hourlyRate}</div>
                      </div>
                      <div className="text-center">
                        <Clock className="mx-auto mb-1 text-gray-500" size={16} />
                        <span className="text-gray-500">Lead Time</span>
                        <div className="font-medium">{facility.bookingLead}</div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button variant="gold-outline" size="sm" className="w-full" onClick={() => handleOpenBookingModal(facility)}>
                        <Calendar size={16} className="mr-2" />
                        Contact for Booking
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-roboto text-primary">
                Important Booking Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p><strong>Advance Notice:</strong> All bookings require advance notice as specified for each facility. Please plan your research schedule accordingly.</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p><strong>Safety Training:</strong> First-time users must complete safety orientation and equipment training before facility access.</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p><strong>Technical Support:</strong> Technical assistance is available during facility access to ensure proper equipment operation.</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p><strong>Cancellation Policy:</strong> Please notify us at least 24 hours in advance for any booking changes or cancellations.</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p><strong>Research Documentation:</strong> All facility usage must align with approved research protocols and institutional guidelines.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Booking Inquiry Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book Facility</DialogTitle>
            <DialogDescription>
              {selectedFacility && (
                <span>
                  Submit an inquiry for <strong>"{selectedFacility.name}"</strong>
                  {selectedFacility.hourlyRate && (
                    <span className="block mt-1 text-sm">
                      Rate: {selectedFacility.hourlyRate}/hour | Lead Time: {selectedFacility.bookingLead}
                    </span>
                  )}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {submitSuccess ? (
            <div className="py-6 text-center">
              <CheckCircle className="mx-auto mb-4 text-green-500" size={64} />
              <h3 className="text-xl font-semibold mb-2">Inquiry Submitted!</h3>
              <p className="text-gray-600 mb-4">
                Thank you for your interest. We will contact you at <strong>{bookingForm.email}</strong> within 24-48 hours to discuss your booking.
              </p>
              <Button variant="gold" onClick={() => setShowBookingModal(false)}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="booking-name">Full Name *</Label>
                  <Input
                    id="booking-name"
                    placeholder="Enter your full name"
                    value={bookingForm.full_name}
                    onChange={(e) => setBookingForm({...bookingForm, full_name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="booking-email">Email Address *</Label>
                  <Input
                    id="booking-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="booking-phone">Phone Number</Label>
                    <Input
                      id="booking-phone"
                      placeholder="+63 XXX XXX XXXX"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="booking-org">Organization</Label>
                    <Input
                      id="booking-org"
                      placeholder="Your organization"
                      value={bookingForm.organization}
                      onChange={(e) => setBookingForm({...bookingForm, organization: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="booking-date">Preferred Date</Label>
                    <Input
                      id="booking-date"
                      type="date"
                      value={bookingForm.preferred_date}
                      onChange={(e) => setBookingForm({...bookingForm, preferred_date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="booking-time">Preferred Time</Label>
                    <Input
                      id="booking-time"
                      type="time"
                      value={bookingForm.preferred_time}
                      onChange={(e) => setBookingForm({...bookingForm, preferred_time: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="booking-purpose">Purpose of Booking</Label>
                  <Textarea
                    id="booking-purpose"
                    placeholder="Briefly describe what you'll be using the facility for"
                    value={bookingForm.purpose}
                    onChange={(e) => setBookingForm({...bookingForm, purpose: e.target.value})}
                    rows={2}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="booking-notes">Additional Notes</Label>
                  <Textarea
                    id="booking-notes"
                    placeholder="Any special requirements or questions"
                    value={bookingForm.additional_notes}
                    onChange={(e) => setBookingForm({...bookingForm, additional_notes: e.target.value})}
                    rows={2}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowBookingModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="gold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Inquiry
                      <Calendar size={16} className="ml-2" />
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

export default FacilityBooking;