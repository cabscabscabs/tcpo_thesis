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
import { 
  ArrowLeft, 
  ArrowRight,
  Calendar,
  User,
  Mail,
  Phone,
  MessageSquare,
  Download,
  Shield,
  Handshake,
  BookOpen,
  Rocket
} from "lucide-react";
import servicesImage from "@/assets/services-bg.jpg";

const ServiceRequest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serviceType = searchParams.get('service') || 'ip-protection';
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    projectDescription: "",
    timeline: "",
    budget: "",
    specificNeeds: "",
    urgency: "",
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.projectDescription) {
      alert('Please fill in all required fields (Name, Email, Project Description).');
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
      preferredDate: '', // Main services don't have specific dates
      participants: '1', // Default for main services
      specificNeeds: `Project: ${formData.projectDescription}

Specific Needs: ${formData.specificNeeds}

Timeline: ${formData.timeline}

Budget: ${formData.budget}

Urgency: ${formData.urgency}

Preferred Contact: ${formData.preferredContact}`,
      budget: formData.budget,
      timeline: formData.timeline,
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };

    // Get existing requests from localStorage
    const existingRequests = JSON.parse(localStorage.getItem('serviceRequests') || '[]');
    
    // Add new request to the list
    const updatedRequests = [newRequest, ...existingRequests];
    
    // Save to localStorage
    localStorage.setItem('serviceRequests', JSON.stringify(updatedRequests));
    
    // Update recent activity
    const recentActivity = JSON.parse(localStorage.getItem('recentActivity') || '[]');
    const newActivity = {
      id: Date.now() + 1,
      type: 'service',
      action: 'received',
      title: `${currentService.title} request from ${formData.name}`,
      time: 'just now'
    };
    const updatedActivity = [newActivity, ...recentActivity.slice(0, 9)];
    localStorage.setItem('recentActivity', JSON.stringify(updatedActivity));
    
    // Trigger storage event to notify admin panel
    window.dispatchEvent(new Event('storage'));
    
    // Show success message
    alert(
      `Thank you for your service request!\n\n` +
      `Service: ${currentService.title}\n` +
      `We will contact you at ${formData.email} within 24 hours to discuss your project requirements.\n\n` +
      `Request ID: ${newRequest.id}`
    );
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      organization: "",
      projectDescription: "",
      timeline: "",
      budget: "",
      specificNeeds: "",
      urgency: "",
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
                      <Label htmlFor="projectDescription">Project Description *</Label>
                      <Textarea
                        id="projectDescription"
                        value={formData.projectDescription}
                        onChange={(e) => setFormData({...formData, projectDescription: e.target.value})}
                        placeholder="Describe your project, technology, or innovation..."
                        className="placeholder:text-gray-400"
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="timeline">Project Timeline</Label>
                        <Select 
                          value={formData.timeline} 
                          onValueChange={(value) => setFormData({...formData, timeline: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate (0-1 month)</SelectItem>
                            <SelectItem value="short-term">Short-term (1-3 months)</SelectItem>
                            <SelectItem value="medium-term">Medium-term (3-6 months)</SelectItem>
                            <SelectItem value="long-term">Long-term (6+ months)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="budget">Budget Range</Label>
                        <Select 
                          value={formData.budget} 
                          onValueChange={(value) => setFormData({...formData, budget: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-50k">Under ₱50,000</SelectItem>
                            <SelectItem value="50k-100k">₱50,000 - ₱100,000</SelectItem>
                            <SelectItem value="100k-500k">₱100,000 - ₱500,000</SelectItem>
                            <SelectItem value="over-500k">Over ₱500,000</SelectItem>
                            <SelectItem value="flexible">Flexible/To be discussed</SelectItem>
                          </SelectContent>
                        </Select>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="urgency">Urgency Level</Label>
                        <Select 
                          value={formData.urgency} 
                          onValueChange={(value) => setFormData({...formData, urgency: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low - No rush</SelectItem>
                            <SelectItem value="medium">Medium - Standard priority</SelectItem>
                            <SelectItem value="high">High - Time sensitive</SelectItem>
                            <SelectItem value="urgent">Urgent - ASAP</SelectItem>
                          </SelectContent>
                        </Select>
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
    </div>
  );
};

export default ServiceRequest;