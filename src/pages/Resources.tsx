import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, BookOpen, Video, FileText, Users, Calendar, ExternalLink, Search, Clock, User } from "lucide-react";

const Resources = () => {
  const templates = [
    {
      title: "Non-Disclosure Agreement (NDA)",
      description: "Standard template for protecting confidential information during technology discussions",
      type: "Legal Document",
      format: "PDF, DOCX",
      lastUpdated: "March 2024"
    },
    {
      title: "Memorandum of Understanding (MOU)",
      description: "Framework for establishing research partnerships and collaboration agreements",
      type: "Partnership Agreement",
      format: "PDF, DOCX", 
      lastUpdated: "February 2024"
    },
    {
      title: "Invention Disclosure Form",
      description: "Comprehensive form for documenting new inventions and innovations",
      type: "IP Documentation",
      format: "PDF, DOCX",
      lastUpdated: "January 2024"
    },
    {
      title: "Technology Transfer Agreement",
      description: "Standard agreement template for technology licensing and transfer",
      type: "Licensing Agreement",
      format: "PDF, DOCX",
      lastUpdated: "March 2024"
    },
    {
      title: "Patent Application Checklist",
      description: "Step-by-step checklist for preparing patent applications",
      type: "Process Guide",
      format: "PDF",
      lastUpdated: "February 2024"
    },
    {
      title: "Market Assessment Template",
      description: "Framework for evaluating commercial potential of technologies",
      type: "Business Analysis",
      format: "Excel, PDF",
      lastUpdated: "January 2024"
    }
  ];

  const tutorials = [
    {
      title: "Introduction to Intellectual Property",
      description: "Fundamentals of IP protection, types of IP, and why it matters for researchers",
      duration: "45 minutes",
      modules: 6,
      level: "Beginner",
      topics: ["What is IP?", "Types of IP Protection", "Benefits of IP", "IP in Research", "Case Studies", "Next Steps"]
    },
    {
      title: "Patent Application Process", 
      description: "Step-by-step guide through the patent application process from idea to grant",
      duration: "60 minutes",
      modules: 8,
      level: "Intermediate",
      topics: ["Patentability Assessment", "Prior Art Search", "Application Drafting", "Filing Process", "Examination", "Prosecution", "Grant", "Maintenance"]
    },
    {
      title: "Technology Commercialization",
      description: "Learn how to bring research innovations to market through licensing and partnerships",
      duration: "90 minutes", 
      modules: 10,
      level: "Advanced",
      topics: ["Market Analysis", "Technology Valuation", "Licensing Strategies", "Partner Selection", "Negotiation", "Due Diligence", "Agreement Structure", "Post-License Management", "Success Metrics", "Case Studies"]
    },
    {
      title: "Building Industry Partnerships",
      description: "Strategies for developing effective collaborations between academia and industry",
      duration: "75 minutes",
      modules: 9,
      level: "Intermediate", 
      topics: ["Partnership Models", "Identifying Partners", "Value Proposition", "Engagement Strategies", "Joint Projects", "IP Management", "Conflict Resolution", "Success Factors", "Long-term Relationships"]
    }
  ];

  const ssfFacilities = [
    {
      name: "Advanced Materials Testing Lab",
      description: "State-of-the-art equipment for materials characterization and testing",
      equipment: ["SEM-EDS", "XRD", "FTIR", "Universal Testing Machine", "Hardness Tester"],
      capacity: "10 researchers",
      hourlyRate: "₱500",
      bookingLead: "48 hours"
    },
    {
      name: "Biotechnology Research Facility", 
      description: "Fully equipped lab for biotechnology and life sciences research",
      equipment: ["PCR Machines", "Spectrophotometer", "Centrifuges", "Incubators", "Biosafety Cabinet"],
      capacity: "8 researchers",
      hourlyRate: "₱400",
      bookingLead: "72 hours"
    },
    {
      name: "Food Technology Laboratory",
      description: "Comprehensive facility for food processing and analysis research",
      equipment: ["Texture Analyzer", "Color Meter", "pH Meter", "Packaging Equipment", "Sensory Testing Booth"],
      capacity: "12 researchers",
      hourlyRate: "₱350",
      bookingLead: "24 hours"
    },
    {
      name: "Environmental Analysis Center",
      description: "Specialized lab for environmental monitoring and analysis",
      equipment: ["GC-MS", "HPLC", "Ion Chromatograph", "Water Quality Analyzers", "Air Sampling Equipment"],
      capacity: "6 researchers",
      hourlyRate: "₱600",
      bookingLead: "96 hours"
    }
  ];

  const guidelines = [
    {
      title: "USTP Research Ethics Guidelines",
      description: "Comprehensive guide to ethical considerations in research and development",
      category: "Research Ethics",
      pages: 45,
      lastUpdated: "March 2024"
    },
    {
      title: "IP Protection Best Practices",
      description: "Best practices for protecting intellectual property throughout the research process",
      category: "IP Management",
      pages: 32,
      lastUpdated: "February 2024"
    },
    {
      title: "Technology Transfer Procedures",
      description: "Step-by-step procedures for technology transfer and commercialization",
      category: "Technology Transfer",
      pages: 28,
      lastUpdated: "January 2024"
    },
    {
      title: "Industry Collaboration Framework",
      description: "Framework for establishing and managing industry-academe partnerships",
      category: "Partnerships",
      pages: 35,
      lastUpdated: "March 2024"
    },
    {
      title: "Startup Incubation Manual",
      description: "Complete guide for researchers interested in launching technology startups",
      category: "Entrepreneurship",
      pages: 52,
      lastUpdated: "February 2024"
    },
    {
      title: "Grant Application Guidelines",
      description: "Best practices for preparing successful research grant applications",
      category: "Funding",
      pages: 24,
      lastUpdated: "January 2024"
    }
  ];

  const workshops = [
    {
      title: "Morning with IP: Patent Basics",
      date: "Every 2nd Friday",
      time: "9:00 AM - 11:00 AM",
      location: "TPCO Conference Room",
      description: "Monthly workshop covering patent fundamentals and application process",
      capacity: "25 participants",
      registration: "Required"
    },
    {
      title: "TPCO-CET Convergence 2025",
      date: "June 15-17, 2025",
      time: "Full Day Event",
      location: "USTP CDO Campus",
      description: "Premier technology commercialization conference in Northern Mindanao",
      capacity: "500 participants",
      registration: "Open Soon"
    },
    {
      title: "Innovation Showcase",
      date: "Quarterly",
      time: "2:00 PM - 5:00 PM", 
      location: "Innovation Hub",
      description: "Platform for researchers to present innovations to industry partners",
      capacity: "100 participants",
      registration: "Open to USTP Community"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-ustp">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-roboto font-bold text-white mb-6">
            Resources & Tools
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            Access comprehensive resources, learning materials, and tools to support 
            your innovation journey and technology transfer activities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gold" size="lg">
              Browse All Resources
              <BookOpen className="ml-2" />
            </Button>
            <Button variant="gold-outline" size="lg">
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
            <TabsList className="grid w-full grid-cols-4">
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
                          <span className="text-gray-500">Type:</span>
                          <span className="font-medium">{template.type}</span>
                        </div>
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
                    <CardHeader className="bg-secondary/5">
                      <div className="flex items-start justify-between mb-2">
                        <Video className="text-secondary flex-shrink-0" size={24} />
                        <span className={`text-xs px-2 py-1 rounded ${
                          tutorial.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                          tutorial.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
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
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-primary mb-2">Topics Covered:</h4>
                        <div className="grid grid-cols-2 gap-1">
                          {tutorial.topics.slice(0, 4).map((topic, idx) => (
                            <div key={idx} className="text-xs text-gray-600 flex items-center">
                              <div className="w-1 h-1 bg-secondary rounded-full mr-2"></div>
                              {topic}
                            </div>
                          ))}
                        </div>
                        {tutorial.topics.length > 4 && (
                          <span className="text-xs text-gray-500">+{tutorial.topics.length - 4} more topics</span>
                        )}
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
                {ssfFacilities.map((facility, index) => (
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
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Capacity:</span>
                            <div className="font-medium">{facility.capacity}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Hourly Rate:</span>
                            <div className="font-medium text-secondary">{facility.hourlyRate}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Booking Lead Time:</span>
                            <div className="font-medium">{facility.bookingLead}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Availability:</span>
                            <div className="font-medium text-green-600">Available</div>
                          </div>
                        </div>
                        
                        <Button variant="gold-outline" size="sm" className="w-full">
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
                        <span className="text-xs text-gray-500">{guide.pages} pages</span>
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
                          <span className="text-gray-500">Category:</span>
                          <span className="font-medium">{guide.category}</span>
                        </div>
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
            {workshops.map((workshop, index) => (
              <Card key={index} className="hover:shadow-card transition-all duration-300">
                <CardHeader className="bg-secondary/5">
                  <div className="flex items-center mb-2">
                    <Calendar className="text-secondary mr-2" size={20} />
                    <span className="text-sm font-medium text-secondary">{workshop.date}</span>
                  </div>
                  <CardTitle className="text-xl font-roboto text-primary">
                    {workshop.title}
                  </CardTitle>
                  <CardDescription>
                    {workshop.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Time:</span>
                      <span className="font-medium">{workshop.time}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium">{workshop.location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Capacity:</span>
                      <span className="font-medium">{workshop.capacity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Registration:</span>
                      <span className="font-medium text-secondary">{workshop.registration}</span>
                    </div>
                  </div>
                  <Button variant="gold" size="sm" className="w-full">
                    Register Now
                    <Users size={16} className="ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;