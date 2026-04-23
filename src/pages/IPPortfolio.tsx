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
import { Skeleton } from "@/components/ui/skeleton";
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
  FileCheck,
  TrendingUp,
  DollarSign,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExtendedPortfolioItem, transformToExtendedPortfolioItem } from "@/integrations/supabase/extendedTypes";
import { getStatusColor, getFieldColor } from "@/lib/utils";
import ipBgImage from "@/assets/ip-portfolio-bg.jpg";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const ITEMS_PER_PAGE = 10;

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
  const [allPatents, setAllPatents] = useState<ExtendedPortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedField, setSelectedField] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [fieldOptions, setFieldOptions] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [ipApplicationCount, setIpApplicationCount] = useState(0);
  const [licensedRevenue, setLicensedRevenue] = useState(0);

  const fetchPortfolioItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load patents from admin_patents table in Supabase (single source of truth)
      let patentData: ExtendedPortfolioItem[] = [];
      
      try {
        const { data: patentsData, error: patentsError } = await supabase
          .from('admin_patents' as any)
          .select('*')
          .eq('published', true)
          .neq('status', 'Draft');
        
        if (patentsData && !patentsError) {
          patentData = patentsData.map((patent: any) => ({
            id: patent.id,
            title: patent.title || "Untitled Patent",
            slug: patent.title ? patent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `patent-${patent.id}`,
            description: patent.description || patent.abstract || `Patent in ${patent.field || 'Unknown Field'}`,
            image_url: patent.image_url || "/placeholder.svg?height=200&width=300",
            link_url: "#",
            category: patent.field || "General",
            tags: [patent.field, patent.status, 'USTP Patent'].filter(Boolean),
            published: true,
            published_at: new Date().toISOString(),
            created_at: patent.created_at,
            updated_at: patent.updated_at,
            inventors: patent.inventors || "Dr. USTP Researcher",
            field: patent.field || "General",
            status: patent.status || "Pending",
            year: patent.year || new Date().getFullYear().toString(),
            abstract: patent.abstract || `Patent abstract for ${patent.title || 'Untitled Patent'}`,
            licensing: patent.status === 'Licensed' ? 'Already Licensed' : 'Available for licensing',
            applications: [patent.field, 'Innovation', 'Research'].filter(Boolean),
            contact: "tpco@ustp.edu.ph",
            inventor: null,
            patent_status: null,
            patent_number: patent.patent_number || null,
            filing_date: null,
            grant_date: patent.grant_date || null,
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
            technology_fields: patent.technology_fields || null,
            ipc_classes: null,
            cpc_classes: null,
            files: patent.files || null,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch admin patents:', error);
      }
      
      // Use only patent data from admin_patents (single source of truth)
      let allData = [...patentData];
      
      // If no data from either source, use sample data
      if (allData.length === 0) {
        allData = getSamplePortfolioItems();
      }
      
      // Keep all patents for statistics (includes Under Review, excludes Draft)
      setAllPatents(allData);
      
      // Filter out Under Review and Draft from public display
      let displayData = allData.filter(p => p.status !== 'Under Review' && p.status !== 'Draft');
      
      // Apply client-side filtering
      let filteredData = displayData;
      
      if (searchTerm) {
        filteredData = filteredData.filter(item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.inventors && item.inventors.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      if (selectedField !== "all") {
        filteredData = filteredData.filter(item => 
          (item.category && item.category === selectedField) || 
          (item.field && item.field === selectedField)
        );
      }
      
      if (selectedStatus !== "all") {
        filteredData = filteredData.filter(item => 
          (item.status && item.status === selectedStatus) || 
          (item.patent_status && item.patent_status === selectedStatus)
        );
      }
      
      // Apply pagination
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      setPortfolioItems(paginatedData);
      setTotalItems(filteredData.length);
    } catch (err) {
      console.error("Error fetching portfolio items:", err);
      setError("Failed to load portfolio items. Please try again later.");
      // Fallback to sample data if everything fails
      setPortfolioItems(getSamplePortfolioItems());
      setTotalItems(getSamplePortfolioItems().length);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedField, selectedStatus]);

  // Fetch IP application count (excluding Draft)
  const fetchIpApplicationCount = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('ip_applications' as any)
        .select('*', { count: 'exact', head: true })
        .neq('status', 'Draft');
      
      if (!error && count !== null) {
        setIpApplicationCount(count);
      }
    } catch (err) {
      console.error('Error fetching IP application count:', err);
    }
  }, []);

  // Fetch licensed revenue from dashboard stats
  const fetchLicensedRevenue = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('admin_dashboard_stats')
        .select('*')
        .limit(1);
      
      if (error) {
        console.error('Error fetching licensed revenue:', error);
        return;
      }
      if (data && data.length > 0) {
        const row = data[0] as any;
        const val = Number(row.licensed_revenue);
        setLicensedRevenue(isNaN(val) ? 0 : val);
      }
    } catch (err) {
      console.error('Error fetching licensed revenue:', err);
    }
  }, []);

  const fetchFilterOptions = useCallback(async () => {
    try {
      // Get options from admin_patents in Supabase (single source of truth)
      let patentFields: string[] = [];
      let patentStatuses: string[] = [];
      
      try {
        const { data: patentData } = await supabase
          .from('admin_patents' as any)
          .select('field, status')
          .neq('status', 'Draft');
        
        if (patentData) {
          patentFields = Array.from(new Set(patentData.map((patent: any) => patent.field).filter(Boolean))) as string[];
          patentStatuses = Array.from(new Set(patentData.map((patent: any) => patent.status).filter(Boolean))) as string[];
        }
      } catch (error) {
        console.error('Failed to fetch admin patents for filters:', error);
      }
      
      // Try to get additional options from Supabase
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
        
        // Use only patent data for filter options (single source of truth)
        const combinedFields = [...new Set([...patentFields])].sort();
        const combinedStatuses = [...new Set([...patentStatuses])].sort();
        
        setFieldOptions(combinedFields.length > 0 ? combinedFields : ["Agriculture", "Materials Science", "Food Technology", "Environmental Technology", "Energy Technology", "Information Technology"]);
        setStatusOptions(combinedStatuses.length > 0 ? combinedStatuses.filter((s: string) => s !== 'Draft' && s !== 'Under Review') : ["Available", "Licensed", "Pending"]);
      } catch (err) {
        console.error("Error fetching filter options:", err);
        // Use patent options + fallback if Supabase fails
        const combinedFields = [...new Set([...patentFields])].sort();
        const combinedStatuses = [...new Set([...patentStatuses])].sort();
        setFieldOptions(combinedFields.length > 0 ? combinedFields : ["Agriculture", "Materials Science", "Food Technology", "Environmental Technology", "Energy Technology", "Information Technology"]);
        setStatusOptions(combinedStatuses.length > 0 ? combinedStatuses.filter((s: string) => s !== 'Draft' && s !== 'Under Review') : ["Available", "Licensed", "Pending"]);
      }
    } catch (err) {
      console.error("Error fetching filter options:", err);
      // Fallback to hardcoded options if everything fails
      setFieldOptions(["Agriculture", "Materials Science", "Food Technology", "Environmental Technology", "Energy Technology", "Information Technology"]);
      setStatusOptions(["Available", "Licensed", "Pending"]);
    }
  }, []);

  useEffect(() => {
    fetchPortfolioItems();
  }, [fetchPortfolioItems]);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  useEffect(() => {
    fetchIpApplicationCount();
    fetchLicensedRevenue();
  }, [fetchIpApplicationCount, fetchLicensedRevenue]);

  // Listen for storage changes from admin panel
  useEffect(() => {
    const handleStorageChange = () => {
      fetchPortfolioItems();
      fetchFilterOptions();
      fetchLicensedRevenue();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchPortfolioItems, fetchFilterOptions, fetchLicensedRevenue]);

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

  // Calculate statistics for all patents (excludes Draft)
  const stats = useMemo(() => {
    // Exclude Draft from all statistics
    const nonDraftPatents = allPatents.filter(p => p.status !== 'Draft');
    const total = nonDraftPatents.length;
    
    // Count by status
    const filed = nonDraftPatents.filter(p => p.status === 'Filed').length;
    const registered = nonDraftPatents.filter(p => p.status === 'Registered').length;
    const commercialized = nonDraftPatents.filter(p => p.status === 'Commercialized').length;
    const licensed = nonDraftPatents.filter(p => p.status === 'Licensed').length;
    // Licensed revenue comes from admin_dashboard_stats (manually entered)
    // Status pie chart data (IP in Application is separate from patents)
    const pieData = [
      { name: 'Filed', value: filed, color: '#3b82f6' },      // blue-500
      { name: 'Registered', value: registered, color: '#22c55e' },  // green-500
      { name: 'Commercialized', value: commercialized, color: '#f59e0b' }, // amber-500
      { name: 'Licensed', value: licensed, color: '#8b5cf6' },   // violet-500
      { name: 'IP in Application', value: ipApplicationCount, color: '#f97316' }, // orange-500
    ].filter(item => item.value > 0);

    // Count by field / patent type
    const fieldCounts: Record<string, number> = {};
    nonDraftPatents.forEach(p => {
      const field = p.field || p.category || 'Unspecified';
      fieldCounts[field] = (fieldCounts[field] || 0) + 1;
    });

    const fieldColors = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316', '#84cc16'];
    const fieldPieData = Object.entries(fieldCounts)
      .map(([name, value], index) => ({
        name,
        value,
        color: fieldColors[index % fieldColors.length]
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
    
    return {
      total,
      filed,
      registered,
      commercialized,
      licensed,
      licensedRevenue,
      ipApplicationCount,
      pieData,
      fieldPieData
    };
  }, [allPatents, ipApplicationCount, licensedRevenue]);

  if (loading && portfolioItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        {/* Hero Skeleton */}
        <section className="relative py-20 bg-primary/80">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Skeleton className="h-12 w-3/4 max-w-2xl mx-auto mb-6 bg-white/20" />
            <Skeleton className="h-6 w-2/3 max-w-3xl mx-auto mb-8 bg-white/20" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Skeleton className="h-12 w-48 mx-auto sm:mx-0 bg-white/20" />
              <Skeleton className="h-12 w-48 mx-auto sm:mx-0 bg-white/20" />
            </div>
          </div>
        </section>

        {/* Search & Filter Skeleton */}
        <section className="py-8 bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4">
              <Skeleton className="h-10 flex-1" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-48" />
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Grid Skeleton */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-5 w-48 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-lg border bg-card shadow-sm overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-primary to-accent">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                  <div className="p-5 space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-9 flex-1" />
                      <Skeleton className="h-9 w-10" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
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

      {/* Portfolio Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Showing {portfolioItems.length} of {totalItems} {totalItems === 1 ? 'patent' : 'patents'}
            </p>
          </div>

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
              <div className="max-h-[1000px] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {portfolioItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
                    onClick={() => {
                      console.log("Navigating to technology with slug:", item.slug);
                      navigate(`/technology/${item.slug}`);
                    }}
                  >
                    <CardHeader className="bg-gradient-to-r from-primary to-accent text-white pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-2 flex-wrap">
                          {item.status && (
                            <Badge className={`${getStatusColor(item.status)} text-xs pointer-events-none`}>{item.status}</Badge>
                          )}
                          {(item.field || item.category) && (
                            <Badge className={`${getFieldColor(item.field || item.category || '')} text-xs pointer-events-none`}>{item.field || item.category}</Badge>
                          )}
                        </div>
                        <span className="text-secondary text-sm font-mono whitespace-nowrap ml-2">{item.year || new Date(item.created_at || new Date()).getFullYear()}</span>
                      </div>
                      <CardTitle className="text-lg font-roboto group-hover:text-secondary transition-colors line-clamp-2">{item.title || "Untitled Technology"}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-5">
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 break-words">{item.description || item.abstract || "No description available"}</p>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users size={15} className="mr-2 text-primary/70 flex-shrink-0" />
                          <span className="truncate">{item.inventors || item.inventor || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={15} className="mr-2 text-primary/70 flex-shrink-0" />
                          <span>{item.year || new Date(item.created_at).getFullYear()}</span>
                        </div>
                        <div className="flex gap-2 pt-3 border-t">
                          <Button 
                            variant="gold" 
                            size="sm" 
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/technology/${item.slug}`);
                            }}
                          >
                            Contact for Licensing
                            <ExternalLink size={14} className="ml-2" />
                          </Button>
                          <Button 
                            variant="gold-outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Download size={14} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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

      {/* Statistics Section - Portfolio Overview */}
      <section className="py-12 bg-white border-t">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Portfolio Overview</h2>
          
          {/* Stats Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            {/* Filed */}
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0">
              <CardContent className="p-4 text-white text-center">
                <FileText className="h-6 w-6 mx-auto mb-2 opacity-90" />
                <div className="text-3xl font-bold">{stats.filed}</div>
                <div className="text-sm opacity-90">Filed</div>
                <div className="text-xs opacity-70 mt-1">From IP Portfolio</div>
              </CardContent>
            </Card>

            {/* Registered */}
            <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0">
              <CardContent className="p-4 text-white text-center">
                <FileCheck className="h-6 w-6 mx-auto mb-2 opacity-90" />
                <div className="text-3xl font-bold">{stats.registered}</div>
                <div className="text-sm opacity-90">Registered</div>
                <div className="text-xs opacity-70 mt-1">From IP Portfolio</div>
              </CardContent>
            </Card>

            {/* Commercialized */}
            <Card className="bg-gradient-to-br from-amber-500 to-orange-500 border-0">
              <CardContent className="p-4 text-white text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 opacity-90" />
                <div className="text-3xl font-bold">{stats.commercialized}</div>
                <div className="text-sm opacity-90">Commercialized</div>
                <div className="text-xs opacity-70 mt-1">From IP Portfolio</div>
              </CardContent>
            </Card>

            {/* Licensed */}
            <Card className="bg-gradient-to-br from-violet-500 to-purple-600 border-0">
              <CardContent className="p-4 text-white text-center">
                <FileCheck className="h-6 w-6 mx-auto mb-2 opacity-90" />
                <div className="text-3xl font-bold">{stats.licensed}</div>
                <div className="text-sm opacity-90">Licensed</div>
                <div className="text-xs opacity-70 mt-1">From IP Portfolio</div>
              </CardContent>
            </Card>

            {/* Licensed (Revenue) */}
            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 border-0">
              <CardContent className="p-4 text-white text-center">
                <DollarSign className="h-6 w-6 mx-auto mb-2 opacity-90" />
                <div className="text-3xl font-bold">
                  {stats.licensedRevenue > 0 ? `₱${stats.licensedRevenue.toLocaleString()}` : '0'}
                </div>
                <div className="text-sm opacity-90">Revenue</div>
                <div className="text-xs opacity-70 mt-1">
                  {stats.licensedRevenue > 0 ? 'Commercialized' : 'From licenses'}
                </div>
              </CardContent>
            </Card>

            {/* IP in Application */}
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0">
              <CardContent className="p-4 text-white text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 opacity-90" />
                <div className="text-3xl font-bold">{stats.ipApplicationCount}</div>
                <div className="text-sm opacity-90">IP in Application</div>
                <div className="text-xs opacity-70 mt-1">Faculty Status</div>
              </CardContent>
            </Card>
          </div>

          {/* Total Count Banner */}
          <div className="text-center mb-8">
            <div className="text-gray-600 mb-1">Total Patents in Portfolio</div>
            <div className="text-5xl font-bold text-gray-900">{stats.total}</div>
          </div>

          {/* Pie Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Distribution Pie Chart */}
            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg">Status Distribution</CardTitle>
                <CardDescription>Breakdown by patent status</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={stats.pieData}
                        cx="50%"
                        cy="45%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {stats.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number, name: string) => [`${value} patents`, name]}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={50}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[280px] text-gray-400">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Patent Type / Field Distribution Pie Chart */}
            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg">Patent Types</CardTitle>
                <CardDescription>Breakdown by field or category</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.fieldPieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={stats.fieldPieData}
                        cx="50%"
                        cy="45%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {stats.fieldPieData.map((entry, index) => (
                          <Cell key={`field-cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number, name: string) => [`${value} patents`, name]}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={50}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[280px] text-gray-400">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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
    cpc_classes: null,
    files: null
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
    cpc_classes: null,
    files: null
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
    cpc_classes: null,
    files: null
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
    cpc_classes: null,
    files: null
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
    cpc_classes: null,
    files: null
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
    cpc_classes: null,
    files: null
  }
];

export default IPPortfolio;