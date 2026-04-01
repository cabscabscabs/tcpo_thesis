import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const FeaturedTechnologies = () => {
  const navigate = useNavigate();
  const [technologies, setTechnologies] = useState([
    {
      id: 1,
      title: "Agricultural Soil Enhancement Technology",
      description: "Revolutionary bio-organic fertilizer system that increases crop yield by 35% while reducing environmental impact.",
      field: "Agriculture",
      status: "Licensed",
      inventors: "Dr. Maria Santos, Dr. Juan dela Cruz",
      year: "2024",
      abstract: "A novel approach to soil enrichment using locally-sourced organic materials and precision application techniques."
    },
    {
      id: 2,
      title: "Smart Materials for Construction",
      description: "Innovative cement additive technology that improves structural integrity and reduces construction costs by 20%.",
      field: "Materials Science",
      status: "Available",
      inventors: "Dr. Roberto Mendez, Dr. Anna Garcia",
      year: "2023",
      abstract: "Advanced material composition for enhanced durability and environmental sustainability in construction."
    },
    {
      id: 3,
      title: "Food Preservation System",
      description: "Novel packaging technology that extends fresh produce shelf life by 50% using natural antimicrobial agents.",
      field: "Food Technology",
      status: "Pending",
      inventors: "Dr. Carmen Reyes, Dr. Luis Torres",
      year: "2024",
      abstract: "Sustainable food preservation method combining traditional knowledge with modern packaging science."
    }
  ]);

  // Load featured technologies from Supabase
  useEffect(() => {
    const loadTechnologies = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_technologies' as any)
          .select('*')
          .eq('published', true)
          .order('order_num', { ascending: true });
        
        if (data && !error && data.length > 0) {
          const techs = data.map((tech: any) => ({
            id: tech.id,
            title: tech.title,
            description: tech.description,
            field: tech.field,
            status: tech.status,
            inventors: tech.inventors,
            year: tech.year,
            abstract: tech.abstract
          }));
          setTechnologies(techs);
        }
      } catch (error) {
        console.error('Failed to load featured technologies:', error);
      }
    };
    
    loadTechnologies();
  }, []);

  // Refresh data when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      const loadTechnologies = async () => {
        try {
          const { data, error } = await supabase
            .from('admin_technologies' as any)
            .select('*')
            .eq('published', true)
            .order('order_num', { ascending: true });
          
          if (data && !error && data.length > 0) {
            const techs = data.map((tech: any) => ({
              id: tech.id,
              title: tech.title,
              description: tech.description,
              field: tech.field,
              status: tech.status,
              inventors: tech.inventors,
              year: tech.year,
              abstract: tech.abstract
            }));
            setTechnologies(techs);
          }
        } catch (error) {
          console.error('Failed to load featured technologies:', error);
        }
      };
      loadTechnologies();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleLearnMore = (tech: any) => {
    // Navigate to individual technology details page
    const slug = tech.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    console.log('Navigating to technology:', slug);
    navigate(`/technology/${slug}`);
  };

  const handleViewPortfolio = () => {
    navigate('/ip-portfolio');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Licensed": return "bg-accent/10 text-white border-accent/20";
      case "Available": return "bg-secondary/10 text-white border-secondary/20";
      case "Pending": return "bg-muted text-white border-muted-foreground/20";
      default: return "bg-muted text-white border-muted-foreground/20";
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-4">
            Featured Technologies
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover groundbreaking innovations from USTP researchers, ready for commercialization 
            and industry partnership opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Display only the first 3 featured technologies */}
          {technologies.slice(0, 3).map((tech, index) => (
            <Card key={index} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
              <CardHeader className="bg-primary text-white flex-shrink-0">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={`${getStatusColor(tech.status)} text-xs`}>
                    {tech.status}
                  </Badge>
                  <span className="text-secondary text-sm font-semibold">{tech.field}</span>
                </div>
                <CardTitle className="text-lg font-roboto group-hover:text-gray-300 transition-colors line-clamp-2">
                  {tech.title}
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 line-clamp-3">
                  {tech.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6 flex flex-col flex-grow">
                <div className="space-y-2 mb-4 flex-shrink-0">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users size={16} className="mr-2 flex-shrink-0" />
                    <span className="truncate">{tech.inventors}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar size={16} className="mr-2 flex-shrink-0" />
                    <span>{tech.year}</span>
                  </div>
                </div>
                
                <Button variant="gold-outline" size="sm" className="w-full group flex-shrink-0" onClick={() => handleLearnMore(tech)}>
                  Learn More
                  <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="ustp" size="lg" onClick={handleViewPortfolio}>
            {technologies.length > 3 ? `View All ${technologies.length} Technologies` : 'View Complete IP Portfolio'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTechnologies;