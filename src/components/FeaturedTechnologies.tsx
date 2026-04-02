import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Calendar, Users, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const FeaturedTechnologies = () => {
  const navigate = useNavigate();
  const [technologies, setTechnologies] = useState<any[]>([]);

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
            abstract: tech.abstract,
            patent_number: tech.patent_number
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
              abstract: tech.abstract,
              patent_number: tech.patent_number
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

  const handleLearnMore = () => {
    // Navigate to IP Portfolio page
    navigate('/ip-portfolio');
  };

  const handleViewPortfolio = () => {
    navigate('/ip-portfolio');
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
              <CardHeader className="bg-gradient-to-r from-primary to-accent text-white flex-shrink-0">
                <CardTitle className="text-xl font-roboto font-bold mb-2">
                  {tech.title}
                </CardTitle>
                <CardDescription className="text-gray-200 line-clamp-3">
                  {tech.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6 flex flex-col flex-grow">
                <div className="space-y-2 mb-4 flex-grow">
                  {tech.patent_number && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FileText size={16} className="mr-2 flex-shrink-0" />
                      <span className="truncate">{tech.patent_number}</span>
                    </div>
                  )}
                  {tech.inventors && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users size={16} className="mr-2 flex-shrink-0" />
                      <span className="truncate">{tech.inventors}</span>
                    </div>
                  )}
                  {tech.year && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar size={16} className="mr-2 flex-shrink-0" />
                      <span>{tech.year}</span>
                    </div>
                  )}
                </div>
                
                <Button variant="gold-outline" size="sm" className="w-full group flex-shrink-0" onClick={handleLearnMore}>
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