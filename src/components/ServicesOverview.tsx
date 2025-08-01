import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Handshake, BookOpen, Rocket, ArrowRight } from "lucide-react";
import servicesImage from "@/assets/services-bg.jpg";

const ServicesOverview = () => {
  const services = [
    {
      icon: Shield,
      title: "IP Protection Services",
      description: "Comprehensive patent filing support, trademark registration, and intellectual property strategy development.",
      features: ["Patent Application Assistance", "Prior Art Search", "IP Portfolio Management", "Legal Consultation"]
    },
    {
      icon: Handshake,
      title: "Technology Licensing",
      description: "Connect researchers with industry partners for technology commercialization and licensing opportunities.",
      features: ["Licensing Negotiations", "Technology Valuation", "Market Analysis", "Partnership Facilitation"]
    },
    {
      icon: BookOpen,
      title: "Industry-Academe Matching",
      description: "Bridge the gap between academic research and industry needs through strategic partnerships.",
      features: ["Collaboration Matching", "Joint Research Projects", "Consulting Services", "Technology Transfer"]
    },
    {
      icon: Rocket,
      title: "Startup Incubation",
      description: "Support researchers in launching startups through CDO b.i.t.e.s. incubation program.",
      features: ["Business Development", "Mentorship Programs", "Funding Assistance", "Market Entry Support"]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Services Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-6">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              From ideation to commercialization, USTP TPCO provides comprehensive support 
              for researchers, inventors, and industry partners in Northern Mindanao.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {services.map((service, index) => (
                <Card key={index} className="group hover:shadow-card transition-all duration-300 border-l-4 border-l-secondary">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        <service.icon className="text-secondary" size={24} />
                      </div>
                      <CardTitle className="text-lg font-roboto text-primary group-hover:text-secondary transition-colors">
                        {service.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-gray-600">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <ul className="space-y-1 text-sm text-gray-500">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="w-1 h-1 bg-secondary rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="gold" size="lg" className="group">
                Request Service
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="gold-outline" size="lg">
                Download Service Guide
              </Button>
            </div>
          </div>

          {/* Services Image */}
          <div className="relative">
            <div 
              className="rounded-lg shadow-lg h-96 bg-cover bg-center"
              style={{ backgroundImage: `url(${servicesImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-ustp/70 rounded-lg flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <h3 className="text-2xl font-roboto font-bold mb-4">
                    4-Step Process
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-primary font-bold">1</div>
                      <span>Initial Consultation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-primary font-bold">2</div>
                      <span>Documentation & Filing</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-primary font-bold">3</div>
                      <span>Review & Processing</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-primary font-bold">4</div>
                      <span>Commercialization</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;