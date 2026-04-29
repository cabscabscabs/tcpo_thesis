import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  FileText, 
  Building, 
  Clock, 
  CheckCircle,
  CheckCircle2,
  ArrowLeft, 
  ArrowRight,
  Calendar,
  User,
  Mail,
  Phone,
  MessageSquare,
  Download,
  Star,
  Award,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import servicesImage from "@/assets/services-bg.jpg";

const AdditionalServices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState('');
  const [submittedServiceTitle, setSubmittedServiceTitle] = useState('');
  const [selectedService, setSelectedService] = useState("training");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    specificNeeds: "",
    preferredContact: ""
  });

  const services = [
    {
      id: "training",
      title: "IP Training & Workshops",
      icon: Users,
      duration: "1-3 days",
      price: "₱15,000 - ₱45,000",
      description: "Comprehensive educational programs designed to enhance understanding of intellectual property protection, commercialization strategies, and technology transfer processes.",
      fullDescription: "Our IP Training & Workshops provide hands-on learning experiences for researchers, inventors, and industry professionals. These programs cover patent filing procedures, trademark registration, copyright protection, and commercialization strategies. Participants gain practical knowledge through case studies, interactive sessions, and expert-led discussions.",
      features: [
        "Patent Application Workshop",
        "IP Strategy Development",
        "Technology Commercialization",
        "Prior Art Search Training",
        "IP Portfolio Management",
        "Licensing Negotiations",
        "Market Analysis Techniques",
        "Legal Compliance Guidelines"
      ],
      process: [
        "Needs Assessment & Customization",
        "Material Preparation & Expert Assignment",
        "Workshop Delivery & Hands-on Practice",
        "Follow-up Support & Certification"
      ],
      benefits: [
        "Enhanced IP knowledge and skills",
        "Practical application experience",
        "Expert guidance and mentorship",
        "Networking opportunities",
        "Certification upon completion"
      ],
      targetAudience: "Researchers, inventors, IP professionals, industry partners, entrepreneurs",
      deliverables: "Training materials, practical exercises, certificates, follow-up support"
    },
    {
      id: "assessment",
      title: "Technology Assessment",
      icon: FileText,
      duration: "2-4 weeks",
      price: "₱25,000 - ₱75,000",
      description: "Thorough evaluation of technology readiness levels, commercial potential, market viability, and competitive landscape analysis.",
      fullDescription: "Our Technology Assessment service provides comprehensive evaluation of innovations to determine their commercial viability and market potential. We analyze technical feasibility, market demand, competitive landscape, and intellectual property position to provide actionable insights for technology commercialization decisions.",
      features: [
        "Technology Readiness Level (TRL) Assessment",
        "Market Potential Analysis",
        "Competitive Landscape Mapping",
        "IP Position Evaluation",
        "Commercial Viability Study",
        "Risk Assessment & Mitigation",
        "Scalability Analysis",
        "Investment Requirements Estimation"
      ],
      process: [
        "Technology Documentation Review",
        "Market Research & Analysis",
        "Expert Evaluation & Testing",
        "Comprehensive Report Delivery"
      ],
      benefits: [
        "Clear commercialization roadmap",
        "Market opportunity identification",
        "Risk mitigation strategies",
        "Investment guidance",
        "Strategic recommendations"
      ],
      targetAudience: "Technology developers, investors, research institutions, startups",
      deliverables: "Comprehensive assessment report, TRL evaluation, market analysis, recommendations"
    },
    {
      id: "research",
      title: "Market Research",
      icon: Building,
      duration: "3-6 weeks",
      price: "₱35,000 - ₱100,000",
      description: "In-depth market analysis covering industry trends, competitive intelligence, customer insights, and commercial viability studies.",
      fullDescription: "Our Market Research service delivers detailed analysis of market opportunities, customer needs, competitive dynamics, and industry trends. We provide data-driven insights to support strategic decision-making for technology commercialization and business development initiatives.",
      features: [
        "Market Size & Growth Analysis",
        "Customer Needs Assessment",
        "Competitive Intelligence",
        "Industry Trend Analysis",
        "Pricing Strategy Research",
        "Distribution Channel Analysis",
        "Regulatory Environment Study",
        "Go-to-Market Strategy Development"
      ],
      process: [
        "Research Design & Methodology",
        "Data Collection & Primary Research",
        "Analysis & Insights Development",
        "Strategic Recommendations"
      ],
      benefits: [
        "Data-driven market insights",
        "Strategic positioning guidance",
        "Risk assessment and mitigation",
        "Investment decision support",
        "Go-to-market strategy"
      ],
      targetAudience: "Technology companies, investors, product managers, business developers",
      deliverables: "Market research report, competitive analysis, customer insights, strategic recommendations"
    }
  ];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !selectedService) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in Name, Email, and Service Type to continue.',
        variant: 'destructive',
      });
      return;
    }

    // Get current service title
    const selectedServiceObj = services.find(s => s.id === selectedService);
    const serviceTitle = selectedServiceObj ? selectedServiceObj.title : 'Unknown Service';

    // Submit to Supabase
    const { data, error: insertError } = await supabase
      .from('admin_service_requests' as any)
      .insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization,
        service_type: selectedService,
        service_title: serviceTitle,
        specific_needs: formData.specificNeeds,
        status: 'Pending',
      }])
      .select();
    
    if (insertError) {
      console.error('Error submitting service request:', insertError);
      toast({
        title: 'Submission failed',
        description: 'There was an error submitting your request. Please try again.',
        variant: 'destructive',
      });
      return;
    }
    
    // Trigger storage event to notify admin panel
    window.dispatchEvent(new Event('storage'));
    
    // Show success message
    const requestId = data && data[0] ? (data[0] as any).id : 'Submitted';
    // Show success dialog
    setSubmittedRequestId(String(requestId));
    setSubmittedServiceTitle(serviceTitle);
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

  const currentService = services.find(s => s.id === selectedService) || services[0];

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
            <h1 className="text-4xl md:text-5xl font-roboto font-bold text-white mb-6">
              Additional Services
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              Specialized services designed to support your innovation journey with expert guidance, 
              comprehensive assessments, and strategic insights.
            </p>
          </div>
        </div>
      </section>

      {/* Service Selection */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card 
                key={service.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedService === service.id ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => setSelectedService(service.id)}
              >
                <CardHeader className="text-center">
                  <div className={`p-3 rounded-full w-fit mx-auto mb-4 ${
                    selectedService === service.id ? 'bg-primary text-white' : 'bg-secondary/10 text-secondary'
                  }`}>
                    <service.icon size={32} />
                  </div>
                  <CardTitle className={selectedService === service.id ? 'text-primary' : ''}>
                    {service.title}
                  </CardTitle>
                  <CardDescription>
                    {service.description}
                  </CardDescription>
                  <div className="flex justify-center gap-2 mt-4">
                    <Badge variant="outline">{service.duration}</Badge>
                    <Badge variant="secondary">{service.price}</Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Service Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Service Details */}
            <div>
              <div className="flex items-center mb-6">
                <div className="p-3 bg-primary/10 rounded-full mr-4">
                  <currentService.icon className="text-primary" size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-roboto font-bold text-primary">
                    {currentService.title}
                  </h2>
                  <p className="text-gray-600">{currentService.fullDescription}</p>
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview" className="data-[state=inactive]:text-white">Overview</TabsTrigger>
                  <TabsTrigger value="features" className="data-[state=inactive]:text-white">Features</TabsTrigger>
                  <TabsTrigger value="process" className="data-[state=inactive]:text-white">Process</TabsTrigger>
                  <TabsTrigger value="benefits" className="data-[state=inactive]:text-white">Benefits</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Target Audience</h4>
                          <p className="text-gray-600">{currentService.targetAudience}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Key Deliverables</h4>
                          <p className="text-gray-600">{currentService.deliverables}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-primary mb-2">Duration</h4>
                            <div className="flex items-center text-gray-600">
                              <Clock size={16} className="mr-2" />
                              {currentService.duration}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-primary mb-2">Investment</h4>
                            <div className="flex items-center text-gray-600">
                              <TrendingUp size={16} className="mr-2" />
                              {currentService.price}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="features" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentService.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start">
                            <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="process" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {currentService.process.map((step, idx) => (
                          <div key={idx} className="flex items-start">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="text-gray-600">{step}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="benefits" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {currentService.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start">
                            <Star size={16} className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Request Form */}
            <div>
              {/* Quick Contact */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Need More Information?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone size={16} className="text-primary mr-2" />
                      <span className="text-sm">(088) 856-1738 Local 1145</span>
                    </div>
                    <div className="flex items-center">
                      <Mail size={16} className="text-primary mr-2" />
                      <span className="text-sm">ustp.tpco@ustp.edu.ph</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <Download className="mr-2" size={16} />
                      Download Service Brochure
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-roboto text-primary">
                    Request {currentService.title}
                  </CardTitle>
                  <CardDescription>
                    Fill out this form to get started with our specialized services
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
                      <Label htmlFor="service">Service Type *</Label>
                      <Select 
                        value={selectedService} 
                        onValueChange={(value) => {
                          setSelectedService(value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="specificNeeds">Specific Needs & Requirements</Label>
                      <Textarea
                        id="specificNeeds"
                        value={formData.specificNeeds}
                        onChange={(e) => setFormData({...formData, specificNeeds: e.target.value})}
                        placeholder="Describe your specific requirements and objectives..."
                        className="placeholder:text-gray-400"
                        rows={4}
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
                      Submit Request
                      <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-roboto font-bold text-primary mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Common questions about our additional services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-2">How long does the assessment process take?</h3>
                <p className="text-gray-600 text-sm">
                  Technology assessments typically take 2-4 weeks depending on complexity. 
                  We provide weekly progress updates and maintain close communication throughout the process.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-2">Can services be customized for our specific needs?</h3>
                <p className="text-gray-600 text-sm">
                  Absolutely! All our services are tailored to your specific requirements. 
                  We work closely with you to ensure maximum value and relevance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-2">What qualifications do your experts have?</h3>
                <p className="text-gray-600 text-sm">
                  Our team includes PhD researchers, industry professionals, and certified IP specialists 
                  with extensive experience in technology commercialization.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-2">Do you provide follow-up support?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, we provide follow-up support for 3 months after service completion 
                  to ensure successful implementation of our recommendations.
                </p>
              </CardContent>
            </Card>
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
              <span className="text-sm font-medium">{submittedServiceTitle}</span>
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
              <p className="text-sm text-gray-600">Our team will get back to you to discuss your requirements.</p>
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

export default AdditionalServices;