import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Clock, Users, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FacilityBooking = () => {
  const navigate = useNavigate();

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
            {ssfFacilities.map((facility) => (
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
                        {facility.equipment.map((item, idx) => (
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
                      <Button variant="gold-outline" size="sm" className="w-full" onClick={handleContactTPCO}>
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

      <Footer />
    </div>
  );
};

export default FacilityBooking;