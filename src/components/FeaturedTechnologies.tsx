import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Calendar, Users, FileText, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePortfolioRecommendations } from "@/hooks/useRecommendations";

const FeaturedTechnologies = () => {
  const navigate = useNavigate();
  const { recommendations, loading } = usePortfolioRecommendations(3);

  const handleLearnMore = (slug: string) => {
    navigate(`/technology/${slug}`);
  };

  const handleViewPortfolio = () => {
    navigate('/ip-portfolio');
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Lightbulb className="text-primary mr-3" size={28} />
            <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary">
              Featured Technologies
            </h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore innovative patents and technologies from USTP researchers, available
            for licensing and industry partnership opportunities.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse flex flex-col h-full">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 flex-shrink-0">
                  <div className="h-6 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </CardHeader>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="space-y-2 mb-4 flex-grow">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                  </CardContent>
              </Card>
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {recommendations.map((item) => (
              <Card
                key={item.id}
                className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col h-full"
                onClick={() => handleLearnMore(item.slug)}
              >
                <CardHeader className="bg-gradient-to-r from-primary to-accent text-white flex-shrink-0">
                  <CardTitle className="text-xl font-roboto font-bold mb-2">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-gray-200 line-clamp-3">
                    {item.description || item.abstract}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="space-y-2 mb-4 flex-grow">
                    {item.patent_number && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileText size={16} className="mr-2 flex-shrink-0" />
                        <span className="truncate">{item.patent_number}</span>
                      </div>
                    )}
                    {item.inventors && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users size={16} className="mr-2 flex-shrink-0" />
                        <span className="truncate">{item.inventors}</span>
                      </div>
                    )}
                    {item.year && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar size={16} className="mr-2 flex-shrink-0" />
                        <span>{item.year}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="gold-outline"
                    size="sm"
                    className="w-full group flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLearnMore(item.slug);
                    }}
                  >
                    Learn More
                    <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}

        <div className="text-center">
          <Button variant="ustp" size="lg" onClick={handleViewPortfolio}>
            View Complete IP Portfolio
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTechnologies;