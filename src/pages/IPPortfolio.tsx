import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  Calendar, 
  User, 
  Tag, 
  Download, 
  FileText, 
  X, 
  Filter, 
  Users, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  Lightbulb
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExtendedPortfolioItem, transformToExtendedPortfolioItem } from "@/integrations/supabase/extendedTypes";
import { getStatusColor, getFieldColor } from "@/lib/utils";
import ipBgImage from "@/assets/ip-portfolio-bg.jpg";
import { usePortfolioRecommendations } from "@/hooks/useRecommendations";

const ITEMS_PER_PAGE = 6;

// Define interfaces for the filter data
interface CategoryData {
  category: string | null;
}

interface PatentStatusData {
  patent_status: string | null;
}

const IPPortfolio = () => {
  const navigate = useNavigate();
  const [portfolioItems, setPortfolioItems] = useState<ExtendedPortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedField, setSelectedField] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [fieldOptions, setFieldOptions] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const { recommendations, loading: recLoading } = usePortfolioRecommendations(3);

  const fetchPortfolioItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Base query
      let query: ReturnType<typeof supabase.from> = supabase
        .from("portfolio_items")
        .select("*", { count: "exact" })
        .eq("published", true);
      
      // Add search filter if searchTerm exists
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,inventor.ilike.%${searchTerm}%`);
      }
      
      // Add field filter if not "all"
      if (selectedField !== "all") {
        query = query.eq("category", selectedField);
      }
      
      // Add status filter if not "all"
      if (selectedStatus !== "all") {
        query = query.eq("patent_status", selectedStatus);
      }
      
      // Add pagination
      const { data, count, error } = await query
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);
      
      if (error) throw error;
      
      // Transform data to ensure it matches ExtendedPortfolioItem interface
      const transformedData = data.map(item => transformToExtendedPortfolioItem(item));
      
      setPortfolioItems(transformedData);
      setTotalItems(count || 0);
    } catch (err) {
      console.error("Error fetching portfolio items:", err);
      setError("Failed to load portfolio items. Please try again later.");
      // Fallback to sample data if database fetch fails
      setPortfolioItems(getSamplePortfolioItems());
      setTotalItems(getSamplePortfolioItems().length);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedField, selectedStatus]);

  const fetchFilterOptions = useCallback(async () => {
    try {
      // Define interfaces for the data
      interface CategoryData {
        category: string | null;
      }
      
      interface PatentStatusData {
        patent_status: string | null;
      }
      
      // Use unknown first, then cast to any to avoid linting errors
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const typedSupabase = supabase as unknown as any;
      
      // Fetch unique categories
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const categoryResult = await typedSupabase
        .from("portfolio_items")
        .select("category")
        .neq("category", null)
        .neq("category", "");
      
      if (!categoryResult.error && categoryResult.data) {
        const uniqueCategories = Array.from(new Set(categoryResult.data.map((item: CategoryData) => item.category))).filter(Boolean) as string[];
        setFieldOptions(uniqueCategories);
      }
      
      // Fetch unique patent statuses
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const statusResult = await typedSupabase
        .from("portfolio_items")
        .select("patent_status")
        .neq("patent_status", null)
        .neq("patent_status", "");
      
      if (!statusResult.error && statusResult.data) {
        const uniqueStatuses = Array.from(new Set(statusResult.data.map((item: PatentStatusData) => item.patent_status))).filter(Boolean) as string[];
        setStatusOptions(uniqueStatuses);
      }
    } catch (err) {
      console.error("Error fetching filter options:", err);
      // Fallback to hardcoded options if database fetch fails
      setFieldOptions(["Agriculture", "Materials Science", "Food Technology", "Environmental Technology", "Energy Technology", "Aquaculture Technology"]);
      setStatusOptions(["Granted", "Pending", "Licensed", "Under Review"]);
    }
  }, []);

  useEffect(() => {
    fetchPortfolioItems();
  }, [fetchPortfolioItems]);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedField("all");
    setSelectedStatus("all");
  };

  const hasActiveFilters = searchTerm !== "" || selectedField !== "all" || selectedStatus !== "all";

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (loading && portfolioItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">IP Portfolio</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our collection of innovative technologies and intellectual properties
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section 
        className="relative py-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${ipBgImage})` }}
      >
        <div className="absolute inset-0 bg-primary/80"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-roboto font-bold text-white mb-6">
            Intellectual Property Portfolio
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            Explore our comprehensive collection of patents, technologies, and innovations 
            available for licensing and commercialization partnerships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gold" size="lg">
              Download Portfolio Catalog
              <Download className="ml-2" size={20} />
            </Button>
            <Button variant="gold-outline" size="lg">
              Licensing Guidelines
              <FileText className="ml-2" size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input 
                placeholder="Search patents, technologies, or inventors..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  {fieldOptions.map((field) => (
                    <SelectItem key={field} value={field}>{field}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X size={16} />
                  Clear
                </Button>
              )}
            </div>
          </div>
          
          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{searchTerm}"
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-red-600"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              )}
              {selectedField !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Field: {selectedField}
                  <button 
                    onClick={() => setSelectedField("all")}
                    className="ml-1 hover:text-red-600"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              )}
              {selectedStatus !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status: {selectedStatus}
                  <button 
                    onClick={() => setSelectedStatus("all")}
                    className="ml-1 hover:text-red-600"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <section className="py-12 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-8">
              <Lightbulb className="text-primary mr-3" size={24} />
              <h2 className="text-3xl font-roboto font-bold text-primary">Recommended for You</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((item) => (
                <Card 
                  key={item.id} 
                  className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => {
                    console.log("Navigating to technology with slug:", item.slug);
                    navigate(`/technology/${item.slug}`);
                  }}
                >
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-1">
                        {item.status && (
                          <Badge className={`${getStatusColor(item.status)} text-xs`}>
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
                    <CardDescription className="text-gray-600 line-clamp-3 text-sm">
                      {item.abstract || item.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {(item.field || item.category) && (
                        <Badge className={`${getFieldColor(item.field || item.category || '')} text-xs`}>
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
        </section>
      )}

      {/* Portfolio Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {portfolioItems.length === 0 ? (
            <div className="text-center py-16">
              <Filter className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {portfolioItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    onClick={() => {
                      console.log("Navigating to technology with slug:", item.slug);
                      navigate(`/technology/${item.slug}`);
                    }}
                  >
                    <CardHeader className="bg-gradient-to-r from-primary to-accent text-white">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-2">
                          {item.status && (
                            <Badge className={`${getStatusColor(item.status)} text-xs`}>
                              {item.status}
                            </Badge>
                          )}
                          {(item.field || item.category) && (
                            <Badge className={`${getFieldColor(item.field || item.category || '')} text-xs`}>
                              {item.field || item.category}
                            </Badge>
                          )}
                        </div>
                        <span className="text-secondary text-sm font-mono">{item.year || new Date(item.created_at).getFullYear()}</span>
                      </div>
                      <CardTitle className="text-xl font-roboto group-hover:text-secondary transition-colors">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-gray-200">
                        {item.abstract || item.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Inventors</h4>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users size={16} className="mr-2" />
                            <span>{item.inventors || 'Not specified'}</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-primary mb-2">Applications</h4>
                          <div className="flex flex-wrap gap-1">
                            {item.applications && item.applications.map((app, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {app}
                              </Badge>
                            ))}
                            {item.tags && item.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-1" />
                            <span>{item.year || new Date(item.created_at).getFullYear()}</span>
                          </div>
                          <span className="font-medium text-secondary">{item.licensing || 'Available for Licensing'}</span>
                        </div>
                        
                        <div className="flex gap-2 pt-4">
                          <Button 
                            variant="gold" 
                            size="sm" 
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle contact for licensing
                            }}
                          >
                            Contact for Licensing
                            <ExternalLink size={16} className="ml-2" />
                          </Button>
                          <Button 
                            variant="gold-outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle download
                            }}
                          >
                            <Download size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* How to License Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-roboto font-bold text-primary mb-8">
            How to License Our Technologies
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Our licensing process is designed to be straightforward and transparent. 
            We work with industry partners to bring our innovations to market.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Identify Technology</h3>
              <p className="text-gray-600">
                Browse our portfolio to find technologies that align with your business needs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
              <p className="text-gray-600">
                Reach out to our licensing team to discuss your interest and requirements.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Negotiate Terms</h3>
              <p className="text-gray-600">
                Work with our team to establish licensing terms that benefit both parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Sample data for fallback when database is not accessible
const getSamplePortfolioItems = (): ExtendedPortfolioItem[] => [
  {
    id: "1",
    title: "Advanced Battery Technology",
    slug: "advanced-battery-technology",
    description: "Next-generation lithium-ion batteries with 3x longer lifespan and faster charging capabilities.",
    image_url: "/placeholder.svg?height=200&width=300",
    link_url: "#",
    category: "Energy",
    tags: ["Battery", "Energy", "Sustainability"],
    published: true,
    published_at: "2024-01-15",
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
    inventors: "Dr. Jane Smith, Dr. John Doe",
    field: "Energy Storage",
    status: "Published",
    year: "2024",
    abstract: "This technology revolutionizes energy storage with a novel electrode design that increases capacity and reduces charging time.",
    licensing: "Available for licensing",
    applications: ["Electric vehicles", "Renewable energy storage"],
    contact: "ip@company.com",
    inventor: null,
    patent_status: null,
    patent_number: null,
    filing_date: null,
    grant_date: null,
    assignee: null,
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
    technology_fields: null,
    ipc_classes: null,
    cpc_classes: null
  },
  {
    id: "2",
    title: "Smart Agriculture Sensor Network",
    slug: "smart-agriculture-sensor-network",
    description: "IoT-based sensor network for precision agriculture with real-time monitoring capabilities.",
    image_url: "/placeholder.svg?height=200&width=300",
    link_url: "#",
    category: "Agriculture",
    tags: ["IoT", "Agriculture", "Sensors"],
    published: true,
    published_at: "2024-03-22",
    created_at: "2024-03-22",
    updated_at: "2024-03-22",
    inventors: "Dr. Maria Garcia, Dr. Robert Johnson",
    field: "Agriculture",
    status: "Granted",
    year: "2024",
    abstract: "A comprehensive sensor network that monitors soil conditions, weather patterns, and crop health to optimize agricultural yields.",
    licensing: "Exclusive and non-exclusive licensing available",
    applications: ["Precision farming", "Crop monitoring", "Smart irrigation"],
    contact: "ip@company.com",
    inventor: null,
    patent_status: null,
    patent_number: null,
    filing_date: null,
    grant_date: null,
    assignee: null,
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
    technology_fields: null,
    ipc_classes: null,
    cpc_classes: null
  },
  {
    id: "3",
    title: "Biodegradable Packaging Material",
    slug: "biodegradable-packaging-material",
    description: "Eco-friendly packaging solution made from agricultural waste with complete biodegradability.",
    image_url: "/placeholder.svg?height=200&width=300",
    link_url: "#",
    category: "Materials",
    tags: ["Sustainability", "Packaging", "Biodegradable"],
    published: true,
    published_at: "2024-02-10",
    created_at: "2024-02-10",
    updated_at: "2024-02-10",
    inventors: "Dr. Emily Chen, Dr. Michael Brown",
    field: "Materials Science",
    status: "Pending",
    year: "2024",
    abstract: "Innovative packaging material derived from agricultural byproducts that completely decomposes within 90 days.",
    licensing: "Available for licensing",
    applications: ["Food packaging", "E-commerce", "Consumer goods"],
    contact: "ip@company.com",
    inventor: null,
    patent_status: null,
    patent_number: null,
    filing_date: null,
    grant_date: null,
    assignee: null,
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
    technology_fields: null,
    ipc_classes: null,
    cpc_classes: null
  },
  {
    id: "4",
    title: "Water Purification System",
    slug: "water-purification-system",
    description: "Advanced filtration technology for removing microplastics and contaminants from water sources.",
    image_url: "/placeholder.svg?height=200&width=300",
    link_url: "#",
    category: "Environmental",
    tags: ["Water", "Filtration", "Environmental"],
    published: true,
    published_at: "2024-04-05",
    created_at: "2024-04-05",
    updated_at: "2024-04-05",
    inventors: "Dr. Sarah Wilson, Dr. David Lee",
    field: "Environmental Technology",
    status: "Licensed",
    year: "2024",
    abstract: "Revolutionary water purification system that removes 99.9% of microplastics and pharmaceutical residues using novel membrane technology.",
    licensing: "Licensed to AquaTech Industries",
    applications: ["Municipal water treatment", "Industrial wastewater", "Point-of-use systems"],
    contact: "ip@company.com",
    inventor: null,
    patent_status: null,
    patent_number: null,
    filing_date: null,
    grant_date: null,
    assignee: null,
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
    technology_fields: null,
    ipc_classes: null,
    cpc_classes: null
  },
  {
    id: "5",
    title: "AI-Powered Crop Disease Detection",
    slug: "ai-crop-disease-detection",
    description: "Machine learning system for early detection of crop diseases using drone imagery.",
    image_url: "/placeholder.svg?height=200&width=300",
    link_url: "#",
    category: "Agriculture",
    tags: ["AI", "Agriculture", "Machine Learning"],
    published: true,
    published_at: "2024-05-18",
    created_at: "2024-05-18",
    updated_at: "2024-05-18",
    inventors: "Dr. James Miller, Dr. Lisa Anderson",
    field: "Agriculture",
    status: "Under Review",
    year: "2024",
    abstract: "Computer vision system that identifies crop diseases with 95% accuracy using multispectral drone imagery and deep learning algorithms.",
    licensing: "Available for licensing",
    applications: ["Precision agriculture", "Farm management", "Crop insurance"],
    contact: "ip@company.com",
    inventor: null,
    patent_status: null,
    patent_number: null,
    filing_date: null,
    grant_date: null,
    assignee: null,
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
    technology_fields: null,
    ipc_classes: null,
    cpc_classes: null
  },
  {
    id: "6",
    title: "Renewable Energy Harvesting Fabric",
    slug: "renewable-energy-harvesting-fabric",
    description: "Textile that generates electricity from movement and solar energy for wearable devices.",
    image_url: "/placeholder.svg?height=200&width=300",
    link_url: "#",
    category: "Energy",
    tags: ["Energy", "Textiles", "Wearables"],
    published: true,
    published_at: "2024-06-30",
    created_at: "2024-06-30",
    updated_at: "2024-06-30",
    inventors: "Dr. Kevin Park, Dr. Amanda Taylor",
    field: "Energy Technology",
    status: "Granted",
    year: "2024",
    abstract: "Flexible fabric that integrates solar cells and piezoelectric materials to harvest energy from sunlight and movement for powering wearable electronics.",
    licensing: "Available for licensing",
    applications: ["Wearable technology", "Military gear", "Outdoor equipment"],
    contact: "ip@company.com",
    inventor: null,
    patent_status: null,
    patent_number: null,
    filing_date: null,
    grant_date: null,
    assignee: null,
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
    technology_fields: null,
    ipc_classes: null,
    cpc_classes: null
  }
];

export default IPPortfolio;