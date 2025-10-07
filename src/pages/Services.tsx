import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Handshake, BookOpen, Rocket, Users, Building, FileText, CheckCircle, Clock, ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import servicesImage from "@/assets/services-bg.jpg";

const Services = () => {
  const navigate = useNavigate();
  
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
      timeline: "6 months from licensing to market",
      narrative: "Dr. Maria Santos, a soil scientist at USTP, developed an innovative bio-organic fertilizer system using locally-sourced agricultural waste. When GreenGrow Solutions, a local farming cooperative, approached USTP TPCO for sustainable farming solutions, we facilitated the technology transfer. Through our licensing program, GreenGrow implemented the system across 500 hectares of farmland. The results exceeded expectations: crop yields increased by 35%, soil health improved dramatically, and the cooperative generated ₱2M in additional annual revenue. Today, the technology is being scaled to other regions in Mindanao.",
      challenge: "Traditional fertilizers were degrading soil quality and becoming increasingly expensive for local farmers.",
      solution: "Bio-organic fertilizer system that enriches soil while reducing costs by 40%.",
      outcome: "Transformed 500 hectares of farmland and created a sustainable revenue model for farming communities."
    },
    {
      title: "Smart Construction Materials",
      company: "BuildSmart Inc.",
      technology: "Concrete Additive Technology",
      impact: "20% cost reduction, 15 projects implemented",
      timeline: "8 months development to deployment",
      narrative: "Professor Roberto Mendez's research on concrete additives using volcanic ash from local sources caught the attention of BuildSmart Inc., a regional construction company. Through USTP TPCO's industry-academe matching program, we facilitated a partnership that transformed how construction projects are executed in Northern Mindanao. The innovative additive not only reduced construction costs by 20% but also improved structural integrity by 30%. BuildSmart has since implemented this technology in 15 major projects, including hospitals and schools, contributing to safer and more affordable infrastructure development.",
      challenge: "High construction costs and environmental concerns with traditional concrete production.",
      solution: "Volcanic ash-based concrete additive that improves strength while reducing costs.",
      outcome: "15 major construction projects completed with improved safety standards and cost efficiency."
    },
    {
      title: "Food Preservation Innovation",
      company: "FreshPack Solutions",
      technology: "Natural Packaging Technology",
      impact: "50% shelf life extension, export market entry",
      timeline: "4 months pilot to commercial scale",
      narrative: "Dr. Carmen Reyes developed a revolutionary natural packaging technology using plant-based antimicrobial agents. FreshPack Solutions, a food processing startup, was struggling with product shelf life limitations that prevented them from accessing export markets. USTP TPCO's startup incubation program provided the perfect platform for technology transfer. Within four months, FreshPack successfully scaled the technology, extending product shelf life by 50% and enabling them to enter international markets. The company now exports to three ASEAN countries and has created 50 new jobs in the local community.",
      challenge: "Limited shelf life of processed foods preventing export market expansion.",
      solution: "Plant-based antimicrobial packaging that naturally preserves food products.",
      outcome: "Successful entry into international markets with 50% longer product shelf life."
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
          <Button variant="gold" size="xl" onClick={() => navigate('/contact')}>
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
                      <TabsTrigger value="features" className="data-[state=inactive]:text-white">
                        Features
                      </TabsTrigger>
                      <TabsTrigger value="process" className="data-[state=inactive]:text-white">
                        Process
                      </TabsTrigger>
                      <TabsTrigger value="details" className="data-[state=inactive]:text-white">
                        Details
                      </TabsTrigger>
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
                    <Button 
                      variant="gold-outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        const serviceMap: { [key: string]: string } = {
                          'IP Protection Services': 'ip-protection',
                          'Technology Licensing': 'technology-licensing', 
                          'Industry-Academe Matching': 'industry-matching',
                          'Startup Incubation': 'startup-incubation'
                        };
                        const serviceParam = serviceMap[service.title] || 'ip-protection';
                        navigate(`/service-request?service=${serviceParam}`);
                      }}
                    >
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
              <Card key={index} className="text-center hover:shadow-card transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate('/additional-services')}>
                <CardContent className="p-6">
                  <div className="p-3 bg-secondary/10 rounded-full w-fit mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
                    <service.icon className="text-secondary" size={32} />
                  </div>
                  <h3 className="font-roboto font-semibold text-primary mb-2 group-hover:text-accent transition-colors">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <Badge variant="outline" className="text-xs mb-4">
                    {service.duration}
                  </Badge>
                  <div className="mt-4">
                    <span className="text-sm text-primary group-hover:text-accent transition-colors font-medium">
                      Learn More →
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="gold" size="lg" onClick={() => navigate('/additional-services')}>
              View All Additional Services
              <ArrowRight className="ml-2" size={16} />
            </Button>
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

          <div className="space-y-12">
            {successStories.map((story, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                {/* Story Content */}
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <Card className="h-full">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          Case Study {index + 1}
                        </Badge>
                        <span className="text-xs text-gray-500">{story.timeline}</span>
                      </div>
                      <CardTitle className="text-xl font-roboto text-primary">
                        {story.title}
                      </CardTitle>
                      <CardDescription className="font-semibold text-secondary">
                        {story.company}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm text-primary mb-2">The Challenge</h4>
                          <p className="text-sm text-gray-600">{story.challenge}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-primary mb-2">USTP Solution</h4>
                          <p className="text-sm text-gray-600">{story.solution}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-primary mb-2">Impact Achieved</h4>
                          <p className="text-sm text-gray-600">{story.outcome}</p>
                          <div className="mt-2 p-2 bg-green-50 rounded-md">
                            <p className="text-sm font-semibold text-green-800">{story.impact}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Story Narrative */}
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="prose prose-gray max-w-none">
                    <h3 className="text-2xl font-roboto font-bold text-primary mb-4">
                      Success Story: {story.technology}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-justify">
                      {story.narrative}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-primary/5">
                        Technology Transfer
                      </Badge>
                      <Badge variant="outline" className="bg-accent/5">
                        Industry Partnership
                      </Badge>
                      <Badge variant="outline" className="bg-secondary/5">
                        Market Success
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Want to be our next success story?
            </p>
            <Button variant="gold" size="lg">
              Start Your Journey
              <ArrowRight className="ml-2" size={16} />
            </Button>
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