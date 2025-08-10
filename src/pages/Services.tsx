import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Handshake, BookOpen, Rocket, Users, Building, FileText, CheckCircle, Clock, ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import servicesImage from "@/assets/services-bg.jpg";

const Services = () => {
  const mainServices = [
    {
      icon: Shield,
      title: "IP Protection Services",
      description: "Comprehensive intellectual property protection and management services",
      features: [
        "Patent Application Assistance",
        "Trademark Registration", 
        "Copyright Protection",
        "Prior Art Search & Analysis",
        "IP Portfolio Management",
        "Freedom to Operate Analysis",
        "Patent Landscape Studies",
        "IP Strategy Development"
      ],
      process: [
        "Initial IP Assessment",
        "Prior Art Search",
        "Application Preparation",
        "Filing & Prosecution",
        "Grant & Maintenance"
      ],
      timeline: "3-6 months",
      pricing: "Consultation fees apply"
    },
    {
      icon: Handshake,
      title: "Technology Licensing",
      description: "Facilitate technology transfer and commercialization opportunities",
      features: [
        "Technology Valuation",
        "Market Analysis",
        "Licensing Negotiations",
        "Partnership Facilitation",
        "Due Diligence Support",
        "Contract Management",
        "Royalty Management",
        "Post-License Support"
      ],
      process: [
        "Technology Assessment",
        "Market Evaluation",
        "Partner Matching",
        "Negotiation",
        "Agreement Execution"
      ],
      timeline: "2-4 months",
      pricing: "Success-based fees"
    },
    {
      icon: BookOpen,
      title: "Industry-Academe Matching",
      description: "Bridge academic research with industry innovation needs",
      features: [
        "Collaboration Matching",
        "Joint Research Projects",
        "Technical Consulting",
        "Research Partnerships",
        "Innovation Challenges",
        "Expert Networks",
        "Technology Scouting",
        "Partnership Development"
      ],
      process: [
        "Needs Assessment",
        "Capability Mapping",
        "Partner Identification",
        "Introduction & Facilitation",
        "Collaboration Support"
      ],
      timeline: "1-3 months",
      pricing: "Project-based"
    },
    {
      icon: Rocket,
      title: "Startup Incubation",
      description: "Support researchers in launching technology-based startups",
      features: [
        "Business Model Development",
        "Mentorship Programs",
        "Funding Assistance",
        "Market Entry Support",
        "Product Development",
        "Regulatory Guidance",
        "Investor Connections",
        "Scale-up Support"
      ],
      process: [
        "Application & Selection",
        "Incubation Program",
        "Mentorship & Support",
        "Market Validation",
        "Launch & Scale"
      ],
      timeline: "6-12 months",
      pricing: "Equity participation"
    }
  ];

  const additionalServices = [
    {
      title: "IP Training & Workshops",
      description: "Educational programs on intellectual property protection and commercialization",
      icon: Users,
      duration: "1-3 days"
    },
    {
      title: "Technology Assessment",
      description: "Comprehensive evaluation of technology readiness and commercial potential",
      icon: FileText,
      duration: "2-4 weeks"
    },
    {
      title: "Market Research",
      description: "Detailed market analysis and commercial viability studies",
      icon: Building,
      duration: "3-6 weeks"
    }
  ];

  const successStories = [
    {
      title: "AgriTech Soil Enhancement",
      company: "GreenGrow Solutions",
      technology: "Bio-Organic Fertilizer System",
      impact: "35% yield increase, ₱2M annual revenue",
      timeline: "6 months from licensing to market"
    },
    {
      title: "Smart Construction Materials",
      company: "BuildSmart Inc.",
      technology: "Concrete Additive Technology",
      impact: "20% cost reduction, 15 projects implemented",
      timeline: "8 months development to deployment"
    },
    {
      title: "Food Preservation Innovation",
      company: "FreshPack Solutions",
      technology: "Natural Packaging Technology",
      impact: "50% shelf life extension, export market entry",
      timeline: "4 months pilot to commercial scale"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section 
        className="relative py-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${servicesImage})` }}
      >
        <div className="absolute inset-0 bg-primary/80"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-roboto font-bold text-white mb-6">
            Our Services
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-8">
            Comprehensive technology transfer and commercialization services to bridge 
            the gap between research innovation and market success.
          </p>
          <Button variant="gold" size="xl">
            Request Service Consultation
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-4">
              Core Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              From ideation to commercialization, we provide end-to-end support 
              for technology transfer and innovation partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mainServices.map((service, index) => (
              <Card key={index} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="bg-gradient-to-r from-primary to-accent text-white">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-secondary rounded-lg">
                      <service.icon size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-roboto group-hover:text-secondary transition-colors">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-gray-200">
                        {service.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <Tabs defaultValue="features" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="features">Features</TabsTrigger>
                      <TabsTrigger value="process">Process</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="features" className="mt-4">
                      <div className="grid grid-cols-2 gap-2">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <CheckCircle size={14} className="text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="process" className="mt-4">
                      <div className="space-y-3">
                        {service.process.map((step, idx) => (
                          <div key={idx} className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-primary font-bold text-sm">
                              {idx + 1}
                            </div>
                            <span className="text-sm text-gray-600">{step}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="details" className="mt-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Clock size={16} className="text-gray-500" />
                          <span className="text-sm"><strong>Timeline:</strong> {service.timeline}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText size={16} className="text-gray-500" />
                          <span className="text-sm"><strong>Pricing:</strong> {service.pricing}</span>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-6">
                    <Button variant="gold-outline" size="sm" className="w-full">
                      Request This Service
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-roboto font-bold text-primary mb-4">
              Additional Services
            </h2>
            <p className="text-lg text-gray-600">
              Specialized services to support your innovation journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-card transition-all duration-300">
                <CardContent className="p-6">
                  <div className="p-3 bg-secondary/10 rounded-full w-fit mx-auto mb-4">
                    <service.icon className="text-secondary" size={32} />
                  </div>
                  <h3 className="font-roboto font-semibold text-primary mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {service.duration}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-roboto font-bold text-primary mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600">
              Real results from our technology transfer partnerships
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:shadow-card transition-all duration-300">
                <CardHeader className="bg-secondary/5">
                  <CardTitle className="text-lg font-roboto text-primary">{story.title}</CardTitle>
                  <CardDescription className="font-semibold text-secondary">
                    {story.company}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700">Technology:</h4>
                      <p className="text-sm text-gray-600">{story.technology}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700">Impact:</h4>
                      <p className="text-sm text-gray-600">{story.impact}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700">Timeline:</h4>
                      <p className="text-sm text-gray-600">{story.timeline}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-roboto font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Contact our team to discuss how we can support your innovation goals
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center">
              <Phone className="text-secondary mb-2" size={24} />
              <h3 className="font-semibold mb-1">Call Us</h3>
              <p className="text-gray-200">(088) 856-1738</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="text-secondary mb-2" size={24} />
              <h3 className="font-semibold mb-1">Email Us</h3>
              <p className="text-gray-200">tpco@ustp.edu.ph</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="text-secondary mb-2" size={24} />
              <h3 className="font-semibold mb-1">Visit Us</h3>
              <p className="text-gray-200">USTP CDO Campus</p>
            </div>
          </div>
          
          <Button variant="gold" size="lg">
            Schedule Consultation
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;