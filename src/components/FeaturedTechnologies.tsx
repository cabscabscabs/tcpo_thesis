import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, Users } from "lucide-react";

const FeaturedTechnologies = () => {
  const technologies = [
    {
      title: "Agricultural Soil Enhancement Technology",
      description: "Revolutionary bio-organic fertilizer system that increases crop yield by 35% while reducing environmental impact.",
      field: "Agriculture",
      status: "Licensed",
      inventors: "Dr. Maria Santos, Dr. Juan dela Cruz",
      year: "2024",
      abstract: "A novel approach to soil enrichment using locally-sourced organic materials and precision application techniques."
    },
    {
      title: "Smart Materials for Construction",
      description: "Innovative cement additive technology that improves structural integrity and reduces construction costs by 20%.",
      field: "Materials Science",
      status: "Available",
      inventors: "Dr. Roberto Mendez, Dr. Anna Garcia",
      year: "2023",
      abstract: "Advanced material composition for enhanced durability and environmental sustainability in construction."
    },
    {
      title: "Food Preservation System",
      description: "Novel packaging technology that extends fresh produce shelf life by 50% using natural antimicrobial agents.",
      field: "Food Technology",
      status: "Pending",
      inventors: "Dr. Carmen Reyes, Dr. Luis Torres",
      year: "2024",
      abstract: "Sustainable food preservation method combining traditional knowledge with modern packaging science."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Licensed": return "bg-green-100 text-green-800";
      case "Available": return "bg-blue-100 text-blue-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-4">
            Featured Technologies
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover groundbreaking innovations from USTP researchers, ready for commercialization 
            and industry partnership opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {technologies.map((tech, index) => (
            <Card key={index} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="bg-primary text-white">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={`${getStatusColor(tech.status)} text-xs`}>
                    {tech.status}
                  </Badge>
                  <span className="text-secondary text-sm font-semibold">{tech.field}</span>
                </div>
                <CardTitle className="text-lg font-roboto group-hover:text-secondary transition-colors">
                  {tech.title}
                </CardTitle>
                <CardDescription className="text-gray-200">
                  {tech.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {tech.abstract}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users size={16} className="mr-2" />
                    <span>{tech.inventors}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-2" />
                    <span>{tech.year}</span>
                  </div>
                </div>
                
                <Button variant="gold-outline" size="sm" className="w-full group">
                  Learn More
                  <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="ustp" size="lg">
            View Complete IP Portfolio
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTechnologies;