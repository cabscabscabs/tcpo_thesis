import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  Download, 
  ExternalLink, 
  ChevronLeft,
  Lightbulb,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRecommendations } from "@/hooks/useRecommendations";
import { ExtendedPortfolioItem, transformToExtendedPortfolioItem } from "@/integrations/supabase/extendedTypes";

const TechnologyDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [technology, setTechnology] = useState<ExtendedPortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { recommendations, loading: recLoading } = useRecommendations(technology);

  const fetchTechnology = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching technology with slug:", slug);
      
      // First, try to find in admin-managed technologies (localStorage)
      const adminTechnologies = localStorage.getItem('featuredTechnologies');
      if (adminTechnologies) {
        try {
          const parsedTech = JSON.parse(adminTechnologies);
          const adminTech = parsedTech.find((tech: any) => {
            const techSlug = tech.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            return techSlug === slug;
          });
          
          if (adminTech) {
            // Transform admin tech to ExtendedPortfolioItem format
            const transformedTech: ExtendedPortfolioItem = {
              id: adminTech.id.toString(),
              title: adminTech.title,
              slug: slug || '',
              description: adminTech.description,
              image_url: "/placeholder.svg?height=400&width=600",
              link_url: "#",
              category: adminTech.field,
              tags: [adminTech.field, adminTech.status, 'USTP', 'Innovation'],
              published: true,
              published_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              inventors: adminTech.inventors,
              field: adminTech.field,
              status: adminTech.status,
              year: adminTech.year,
              abstract: adminTech.abstract || adminTech.description,
              licensing: adminTech.status === 'Licensed' ? 'Already Licensed' : 'Available for licensing through USTP TPCO',
              applications: [adminTech.field, 'Innovation', 'Research'],
              contact: "tpco@ustp.edu.ph",
              // Set all optional fields to null for admin technologies
              inventor: null,
              patent_status: null,
              patent_number: null,
              filing_date: null,
              grant_date: null,
              assignee: "University of Science and Technology of Southern Philippines",
              ipc_codes: null,
              cpc_codes: null,
              application_number: null,
              priority_date: null,
              expiration_date: null,
              claims: null,
              jurisdictions: null,
              family_members: null,
              legal_status: null,
              citations: null,
              citations_patents: null,
              cited_by: null,
              cited_by_patents: null,
              family_size: null,
              priority_claims: null,
              technology_fields: [adminTech.field],
              ipc_classes: null,
              cpc_classes: null
            };
            
            setTechnology(transformedTech);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Failed to parse admin technologies:', error);
        }
      }
      
      // If not found in admin data, try Supabase
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }
      
      console.log("Database response:", data);
      
      if (!data) {
        setError("Technology not found");
        return;
      }
      
      // Transform data to ExtendedPortfolioItem
      const transformedData = transformToExtendedPortfolioItem(data);
      setTechnology(transformedData);
    } catch (err) {
      console.error("Error fetching technology:", err);
      setError(`Technology not found. This might be an admin-managed technology or the slug may have changed.`);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchTechnology();
    }
  }, [slug, fetchTechnology]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !technology) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology Not Found</h2>
              <p className="text-gray-600 mb-6">
                The technology you're looking for doesn't exist or has been removed.
              </p>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 text-left">
                  <p className="text-red-800 font-medium">Error Details:</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                  <p className="text-red-700 text-sm mt-2">Requested slug: {slug}</p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate("/ip-portfolio")}>
                  <ChevronLeft className="mr-2" size={16} />
                  Back to Portfolio
                </Button>
                <Button variant="outline" onClick={() => navigate("/db-test")}>
                  Database Test
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/ip-portfolio")}
          className="mb-6"
        >
          <ChevronLeft className="mr-2" size={16} />
          Back to Portfolio
        </Button>
      </div>

      {/* Technology Header */}
      <section className="bg-gradient-to-r from-primary to-accent text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {technology.status && (
                <Badge className="bg-white text-primary text-xs pointer-events-none">
                  {technology.status}
                </Badge>
              )}
              {(technology.field || technology.category) && (
                <Badge className="bg-white/80 text-primary text-xs pointer-events-none">
                  {technology.field || technology.category}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl font-roboto font-bold mb-4">{technology.title}</h1>
            <p className="text-xl text-gray-200 mb-6 break-words">
              {technology.abstract || technology.description}
            </p>
            <div className="flex items-center text-gray-300">
              <Calendar size={16} className="mr-2" />
              <span>Published: {technology.year || new Date(technology.created_at).getFullYear()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-2xl font-roboto font-bold text-primary mb-4">Technology Overview</h2>
                  <p className="text-gray-700 leading-relaxed break-words">
                    {technology.description}
                  </p>
                </div>

                {technology.inventors && (
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-2xl font-roboto font-bold text-primary mb-4">Inventors</h2>
                    <div className="flex items-center text-gray-700">
                      <Users size={16} className="mr-2" />
                      <span>{technology.inventors}</span>
                    </div>
                  </div>
                )}

                {technology.assignee && (
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-2xl font-roboto font-bold text-primary mb-4">Assignee</h2>
                    <p className="text-gray-700">{technology.assignee}</p>
                  </div>
                )}

                {technology.patent_number && (
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-2xl font-roboto font-bold text-primary mb-4">Patent Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Patent Number</p>
                        <p className="font-medium">{technology.patent_number}</p>
                      </div>
                      {technology.filing_date && (
                        <div>
                          <p className="text-sm text-gray-500">Filing Date</p>
                          <p className="font-medium">{new Date(technology.filing_date).toLocaleDateString()}</p>
                        </div>
                      )}
                      {technology.grant_date && (
                        <div>
                          <p className="text-sm text-gray-500">Grant Date</p>
                          <p className="font-medium">{new Date(technology.grant_date).toLocaleDateString()}</p>
                        </div>
                      )}
                      {technology.expiration_date && (
                        <div>
                          <p className="text-sm text-gray-500">Expiration Date</p>
                          <p className="font-medium">{new Date(technology.expiration_date).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {technology.technology_fields && technology.technology_fields.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-2xl font-roboto font-bold text-primary mb-4">Technology Fields</h2>
                    <div className="flex flex-wrap gap-2">
                      {technology.technology_fields.map((field, idx) => (
                        <Badge key={idx} variant="outline">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {technology.tags && technology.tags.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-roboto font-bold text-primary mb-4">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                      {technology.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-roboto font-bold text-primary mb-4">Licensing Information</h3>
                  <p className="text-gray-700 mb-4">
                    {technology.licensing || "Available for licensing through TPCO Technologies"}
                  </p>
                  <Button className="w-full" variant="gold">
                    Contact for Licensing
                    <ExternalLink className="ml-2" size={16} />
                  </Button>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-roboto font-bold text-primary mb-4">Download</h3>
                  <p className="text-gray-700 mb-4">
                    Download detailed technical documentation and specifications.
                  </p>
                  <Button className="w-full" variant="gold-outline">
                    <Download className="mr-2" size={16} />
                    Technical Datasheet
                  </Button>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-roboto font-bold text-primary mb-4">Contact</h3>
                  <p className="text-gray-700 mb-4">
                    For licensing inquiries or technical questions:
                  </p>
                  <p className="text-primary font-medium">
                    {technology.contact || "ip@tpco.com"}
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center mb-6">
                  <Lightbulb className="text-primary mr-3" size={24} />
                  <h2 className="text-3xl font-roboto font-bold text-primary">Related Technologies</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendations.map((item) => (
                    <Card 
                      key={item.id} 
                      className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                      onClick={() => navigate(`/technology/${item.slug}`)}
                    >
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex gap-1">
                            {item.status && (
                              <Badge className="bg-white text-primary text-xs pointer-events-none">
                                {item.status}
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{item.year || new Date(item.created_at).getFullYear()}</span>
                        </div>
                        <CardTitle className="text-lg font-roboto group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <CardDescription className="text-gray-600 line-clamp-3 text-sm break-words">
                          {item.abstract || item.description}
                        </CardDescription>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {(item.field || item.category) && (
                            <Badge className="bg-white/80 text-primary text-xs pointer-events-none">
                              {item.field || item.category}
                            </Badge>
                          )}
                          {item.tags && item.tags.slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TechnologyDetails;