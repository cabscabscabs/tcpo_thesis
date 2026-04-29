import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Handshake, BookOpen, Rocket, Users, Building, FileText, CheckCircle, Clock, ArrowRight, Phone, Mail, MapPin, Wrench, Lightbulb, TrendingUp, Droplet, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import servicesImage from "@/assets/services-bg.jpg";

// Icon mapping from string to component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  Shield,
  Handshake,
  BookOpen,
  Rocket,
  Wrench,
  Lightbulb,
  Users,
  Building,
  FileText,
};

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
  process_steps: string[];
  timeline: string;
  pricing: string;
  order_num: number;
}

const Services = () => {
  const navigate = useNavigate();
  const [mainServices, setMainServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Load services from database
  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('published', true)
          .order('order_num', { ascending: true });

        if (error) {
          console.error('Error loading services:', error);
        } else if (data) {
          setMainServices(data.map((service: any) => ({
            id: service.id,
            name: service.name,
            slug: service.slug,
            description: service.description || '',
            icon: service.icon || 'Wrench',
            features: service.features || [],
            process_steps: service.process_steps || [],
            timeline: service.timeline || '',
            pricing: service.pricing || '',
            order_num: service.order_num,
          })));
        }
      } catch (err) {
        console.error('Unexpected error loading services:', err);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

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

  // Banner Programs — flagship initiatives of USTP TPCO
  const bannerPrograms = [
    {
      name: "Ripple Tank",
      focus: "IP Protection",
      description: "Safeguarding intellectual property rights through patent, copyright, and trademark support.",
      icon: Shield,
      accent: "from-blue-600 to-primary",
    },
    {
      name: "Rush Stream",
      focus: "Commercialization",
      description: "Accelerating the movement of USTP innovations from lab to market through licensing and partnerships.",
      icon: TrendingUp,
      accent: "from-teal-600 to-accent",
    },
    {
      name: "Rapid Boost",
      focus: "Technology Promotion",
      description: "Amplifying the visibility of USTP technologies via outreach, showcases, and stakeholder engagement.",
      icon: Rocket,
      accent: "from-fuchsia-600 to-primary",
    },
  ];

  // Innovation Drives — targeted support programs under TPCO
  const innovationDrives = [
    {
      acronym: "B.E.C.K. Program",
      expansion: "Business eLearning and Concept Know-How",
    },
    {
      acronym: "L.I.N.K LGU",
      expansion: "Leading Innovation, Networking, and Knowledge for Local Government Units",
    },
    {
      acronym: "C.A.S.C.A.D.E. Newsletter",
      expansion: "Commercialization and Stories of Creative Advances, Discoveries, and Emerging IP",
    },
    {
      acronym: "iPROTECT",
      expansion: "Intellectual Property Rights Outreach, Training, Education, and Capacity Transformation",
    },
    {
      acronym: "Fireside Chat Series",
      expansion: "Cultivating a Culture of Innovation with USTP Leaders",
    },
    {
      acronym: "T.T.R.I.P.P",
      expansion: "Technology Transfer Relay and Intellectual Property Promotions",
    },
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
            {loading ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-500">Loading services...</p>
              </div>
            ) : mainServices.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-500">No services available at the moment.</p>
              </div>
            ) : (
              mainServices.map((service) => {
                const IconComponent = iconMap[service.icon] || Wrench;
                return (
                  <Card key={service.id} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="bg-gradient-to-r from-primary to-accent text-white">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-secondary rounded-lg">
                          {IconComponent && <IconComponent size={24} />}
                        </div>
                        <div>
                          <CardTitle className="text-xl font-roboto group-hover:text-secondary transition-colors">
                            {service.name}
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
                            {service.process_steps.map((step, idx) => (
                              <div key={idx} className="flex items-start space-x-3">
                                <span className="text-sm font-bold text-secondary min-w-[1.5rem]">{idx + 1}.</span>
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
                            navigate(`/service-request?service=${service.slug}`);
                          }}
                        >
                          Request This Service
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Banner Programs */}
      <section className="relative py-20 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
        {/* decorative ripples */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-secondary/5" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-primary/5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-secondary mb-3">
              USTP TPCO Flagships
            </span>
            <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-4">
              Banner Programs
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Three flagship initiatives that anchor our work across IP protection,
              commercialization, and technology promotion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bannerPrograms.map((program, index) => (
              <Card
                key={index}
                className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-secondary"
              >
                {/* ripple accents */}
                <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-colors" />
                <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full bg-primary/5" />

                <CardContent className="relative p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-5 shadow-lg bg-gradient-to-br ${program.accent} group-hover:scale-110 transition-transform`}>
                    <program.icon className="text-secondary" size={38} />
                  </div>
                  <h3 className="text-2xl font-roboto font-bold text-primary mb-1">
                    {program.name}
                  </h3>
                  <p className="text-sm font-semibold uppercase tracking-[0.15em] text-secondary">
                    {program.focus}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
                    Activities
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {program.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Drives */}
      <section className="py-20 bg-gradient-to-br from-primary/[0.03] via-gray-50 to-accent/[0.03]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-secondary mb-3">
              Targeted Support Programs
            </span>
            <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-4">
              Innovation Drives
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Focused programs that fuel learning, outreach, and technology transfer
              across USTP and partner communities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {innovationDrives.map((drive, index) => (
              <div
                key={index}
                className="flex items-center gap-5 p-5 rounded-xl text-white shadow-md hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 group bg-gradient-to-r from-primary via-primary to-accent"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-secondary text-primary font-roboto font-bold text-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg md:text-xl font-roboto font-bold text-secondary leading-tight">
                    {drive.acronym}
                  </h3>
                  <p className="text-sm text-white/90 leading-snug mt-1">
                    {drive.expansion}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="gold" size="lg" onClick={() => navigate('/contact')}>
              Partner With a Program
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
              <p className="text-gray-200">(088) 856-1738 Local 1145</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="text-secondary mb-2" size={24} />
              <h3 className="font-semibold mb-1">Email Us</h3>
              <p className="text-gray-200">ustp.tpco@ustp.edu.ph</p>
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