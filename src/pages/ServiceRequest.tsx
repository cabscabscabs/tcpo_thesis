import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  ArrowRight,
  User,
  Mail,
  Phone,
  Download,
  Shield,
  Handshake,
  BookOpen,
  Rocket,
  CheckCircle2
} from "lucide-react";
import servicesImage from "@/assets/services-bg.jpg";
import { supabase } from "@/integrations/supabase/client";

const ServiceRequest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const serviceType = searchParams.get('service') || 'ip-protection';
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState('');
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    specificNeeds: "",
    preferredContact: ""
  });

  const services = {
    'ip-protection': {
      id: 'ip-protection',
      title: 'IP Protection Services',
      icon: Shield,
      description: 'Comprehensive intellectual property protection and management services',
      features: [
        'Patent Application Assistance',
        'Trademark Registration',
        'Copyright Protection',
        'Prior Art Search & Analysis',
        'IP Portfolio Management',
        'Freedom to Operate Analysis',
        'Patent Landscape Studies',
        'IP Strategy Development'
      ],
      timeline: '3-6 months',
      pricing: 'Consultation fees apply'
    },
    'technology-licensing': {
      id: 'technology-licensing',
      title: 'Technology Licensing',
      icon: Handshake,
      description: 'Facilitate technology transfer and commercialization opportunities',
      features: [
        'Technology Valuation',
        'Licensing Negotiations',
        'Due Diligence Support',
        'Royalty Management',
        'Market Analysis',
        'Partnership Facilitation',
        'Contract Management',
        'Post-License Support'
      ],
      timeline: '2-4 months',
      pricing: 'Success-based fees'
    },
    'industry-matching': {
      id: 'industry-matching',
      title: 'Industry-Academe Matching',
      icon: BookOpen,
      description: 'Bridge academic research with industry innovation needs',
      features: [
        'Collaboration Matching',
        'Technical Consulting',
        'Innovation Challenges',
        'Technology Scouting',
        'Joint Research Projects',
        'Research Partnerships',
        'Expert Networks',
        'Partnership Development'
      ],
      timeline: '1-3 months',
      pricing: 'Project-based'
    },
    'startup-incubation': {
      id: 'startup-incubation',
      title: 'Startup Incubation',
      icon: Rocket,
      description: 'Support researchers in launching technology-based startups',
      features: [
        'Business Model Development',
        'Funding Assistance',
        'Product Development',
        'Investor Connections',
        'Mentorship Programs',
        'Market Entry Support',
        'Regulatory Guidance',
        'Scale-up Support'
      ],
      timeline: '6-12 months',
      pricing: 'Equity participation'
    }
  };

  const currentService = services[serviceType as keyof typeof services] || services['ip-protection'];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing required fields",
        description: "Please fill in Name and Email to continue.",
        variant: "destructive",
      });
      return;
    }

    // Create new service request object
    const newRequest = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      organization: formData.organization,
      service: currentService.id,
      serviceTitle: currentService.title,
      preferredDate: '',
      participants: '1',
      specificNeeds: `Specific Needs: ${formData.specificNeeds}

Preferred Contact: ${formData.preferredContact}`,
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };

    // Get existing requests from Supabase
    const { error: insertError } = await supabase
      .from('admin_service_requests' as any)
      .insert([{
        name: newRequest.name,
        email: newRequest.email,
        phone: newRequest.phone,
        organization: newRequest.organization,
        service_type: newRequest.service,
        service_title: newRequest.serviceTitle,
        preferred_date: newRequest.preferredDate,
        participants: newRequest.participants,
        specific_needs: newRequest.specificNeeds,
        status: newRequest.status,
      }]);
    
    if (insertError) {
      console.error('Error submitting service request:', insertError);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    // Trigger storage event to notify admin panel
    window.dispatchEvent(new Event('storage'));
    
    // Show success dialog
    setSubmittedRequestId(String(newRequest.id));
    setShowSuccessDialog(true);
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      organization: "",
      specificNeeds: "",
      preferredContact: ""
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section 
        className="relative py-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${servicesImage})` }}
      >
        <div className="absolute inset-0 bg-primary/80"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            className="mb-6 text-white bg-primary hover:bg-primary hover:text-white border-none"
            onClick={() => navigate('/services')}
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Services
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-secondary rounded-full mr-4">
                <currentService.icon className="text-primary" size={32} />
              </div>
              <h1 className="text-4xl md:text-5xl font-roboto font-bold text-white">
                Request {currentService.title}
              </h1>
            </div>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              {currentService.description}
            </p>
            <div className="flex justify-center gap-2">
              <Badge variant="secondary">{currentService.timeline}</Badge>
              <Badge variant="secondary">{currentService.pricing}</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Request Form Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Service Information */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-roboto text-primary">
                    Service Overview
                  </CardTitle>
                  <CardDescription>
                    What's included in {currentService.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-primary">Key Features:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {currentService.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-2 mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Timeline</h4>
                          <p className="text-gray-600">{currentService.timeline}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Pricing</h4>
                          <p className="text-gray-600">{currentService.pricing}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Need More Information?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone size={16} className="text-primary mr-2" />
                      <span className="text-sm">(088) 856-1738</span>
                    </div>
                    <div className="flex items-center">
                      <Mail size={16} className="text-primary mr-2" />
                      <span className="text-sm">tpco@ustp.edu.ph</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <Download className="mr-2" size={16} />
                      Download Service Guide
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Request Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-roboto text-primary">
                    Submit Your Request
                  </CardTitle>
                  <CardDescription>
                    Tell us about your project and requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                          placeholder="Enter your full name"
                          className="placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                          placeholder="Enter your email address"
                          className="placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="Enter phone number"
                          className="placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="organization">Organization</Label>
                        <Input
                          id="organization"
                          type="text"
                          value={formData.organization}
                          onChange={(e) => setFormData({...formData, organization: e.target.value})}
                          placeholder="Enter organization name"
                          className="placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="specificNeeds">Specific Needs & Requirements</Label>
                      <Textarea
                        id="specificNeeds"
                        value={formData.specificNeeds}
                        onChange={(e) => setFormData({...formData, specificNeeds: e.target.value})}
                        placeholder="Any specific requirements or expectations..."
                        className="placeholder:text-gray-400"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                      <Select 
                        value={formData.preferredContact} 
                        onValueChange={(value) => setFormData({...formData, preferredContact: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select contact method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone Call</SelectItem>
                          <SelectItem value="video">Video Meeting</SelectItem>
                          <SelectItem value="in-person">In-person Meeting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full" variant="gold">
                      Submit Service Request
                      <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl">Request Submitted Successfully!</DialogTitle>
            <DialogDescription className="text-center">
              Thank you for your service request. We'll get back to you soon.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Service</span>
              <span className="text-sm font-medium">{currentService.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm font-medium">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Request ID</span>
              <span className="text-sm font-medium">{submittedRequestId}</span>
            </div>
            <div className="pt-2 border-t text-center">
              <p className="text-sm text-gray-600">Our team will get back to you to discuss your project requirements.</p>
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              variant="ustp"
              onClick={() => {
                setShowSuccessDialog(false);
                navigate('/services');
              }}
            >
              Back to Services
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceRequest;