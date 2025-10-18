import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, Search, Filter, FileText, Video, Calendar, ArrowLeft, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BrowseResources = () => {
  const navigate = useNavigate();
  
  // Default static resources (same as Resources page)
  const defaultResources = [
    {
      id: 1,
      title: "Non-Disclosure Agreement (NDA)",
      description: "Standard template for protecting confidential information during technology discussions",
      type: "template",
      category: "Templates",
      format: "PDF, DOCX",
      lastUpdated: "March 2024",
      url: null,
      file: null
    },
    {
      id: 2,
      title: "Memorandum of Understanding (MOU)",
      description: "Framework for establishing research partnerships and collaboration agreements",
      type: "template",
      category: "Templates",
      format: "PDF, DOCX",
      lastUpdated: "February 2024",
      url: null,
      file: null
    },
    {
      id: 3,
      title: "Introduction to Intellectual Property",
      description: "Fundamentals of IP protection, types of IP, and why it matters for researchers",
      type: "tutorial",
      category: "IP 101 Tutorials",
      format: "Video",
      lastUpdated: "February 2024",
      url: null,
      file: null
    },
    {
      id: 4,
      title: "Patent Application Process",
      description: "Step-by-step guide through the patent application process from idea to grant",
      type: "tutorial",
      category: "IP 101 Tutorials",
      format: "Video",
      lastUpdated: "January 2024",
      url: null,
      file: null
    },
    {
      id: 5,
      title: "Advanced Materials Testing Lab",
      description: "State-of-the-art equipment for materials characterization and testing",
      type: "facility",
      category: "SSF Booking",
      format: "Facility",
      lastUpdated: "January 2024",
      url: null,
      file: null
    },
    {
      id: 6,
      title: "Biotechnology Research Facility",
      description: "Fully equipped lab for biotechnology and life sciences research",
      type: "facility",
      category: "SSF Booking",
      format: "Facility",
      lastUpdated: "December 2023",
      url: null,
      file: null
    },
    {
      id: 7,
      title: "USTP Research Ethics Guidelines",
      description: "Comprehensive guide to ethical considerations in research and development",
      type: "guideline",
      category: "Guidelines",
      format: "PDF",
      lastUpdated: "March 2024",
      url: null,
      file: null
    },
    {
      id: 8,
      title: "IP Protection Best Practices",
      description: "Best practices for protecting intellectual property throughout the research process",
      type: "guideline",
      category: "Guidelines",
      format: "PDF",
      lastUpdated: "February 2024",
      url: null,
      file: null
    }
  ];
  
  const [resources, setResources] = useState(defaultResources);
  const [filteredResources, setFilteredResources] = useState(defaultResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Load resources from admin panel
  useEffect(() => {
    const loadResources = () => {
      try {
        const savedResources = localStorage.getItem('resourcesData');
        let combinedResources = [...defaultResources]; // Start with default resources
        
        if (savedResources) {
          const parsedResources = JSON.parse(savedResources);
          // Merge admin resources with default resources
          // Admin resources take priority, but we keep default resources as fallback
          combinedResources = [...defaultResources, ...parsedResources];
        }
        
        setResources(combinedResources);
        setFilteredResources(combinedResources);
      } catch (error) {
        console.error('Failed to load resources:', error);
        // Fallback to default resources if there's an error
        setResources(defaultResources);
        setFilteredResources(defaultResources);
      }
    };

    loadResources();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadResources();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filter resources based on search and filters
  useEffect(() => {
    let filtered = resources;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === filterCategory);
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(resource => resource.type === filterType);
    }

    setFilteredResources(filtered);
  }, [resources, searchQuery, filterCategory, filterType]);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'template': return FileText;
      case 'tutorial': return Video;
      case 'facility': return Calendar;
      case 'guideline': return FileText;
      default: return FileText;
    }
  };

  const handleResourceClick = (resource: any) => {
    // Navigate to resource details or open external URL
    if (resource.url) {
      window.open(resource.url, '_blank');
    } else {
      // For now, show alert - in future, could navigate to resource detail page
      alert(`Opening resource: "${resource.title}"

Description: ${resource.description}

Type: ${resource.type}
Category: ${resource.category}`);
    }
  };

  const categories = ['Templates', 'IP 101 Tutorials', 'SSF Booking', 'Guidelines'];
  const types = ['template', 'tutorial', 'facility', 'guideline'];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header Section */}
      <section className="py-12 bg-gradient-ustp">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/resources')}
            className="text-white hover:bg-white/10 mb-6"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Resources
          </Button>
          
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-roboto font-bold mb-6">
              Browse All Resources
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Explore our comprehensive collection of resources, templates, tutorials, and guidelines 
              to support your innovation and technology transfer journey.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Category Filter */}
            <div className="w-full md:w-48">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Type Filter */}
            <div className="w-full md:w-48">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Clear Filters */}
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('all');
                setFilterType('all');
              }}
            >
              <Filter className="mr-2" size={16} />
              Clear
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredResources.length} of {resources.length} resources
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredResources.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No resources found</h3>
              <p className="text-gray-500">
                {searchQuery || filterCategory !== 'all' || filterType !== 'all'
                  ? "Try adjusting your search or filters"
                  : "No resources have been uploaded yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                const IconComponent = getResourceIcon(resource.type);
                return (
                  <Card 
                    key={resource.id} 
                    className="hover:shadow-card transition-all duration-300 cursor-pointer group"
                    onClick={() => handleResourceClick(resource)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <IconComponent className="text-secondary flex-shrink-0" size={24} />
                        <div className="flex flex-col items-end">
                          {resource.format && (
                            <span className="text-xs text-gray-500 mb-1">{resource.format}</span>
                          )}
                          {resource.url && (
                            <ExternalLink className="text-primary" size={16} />
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-lg font-roboto text-primary group-hover:text-accent transition-colors">
                        {resource.title}
                      </CardTitle>
                      <CardDescription>
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline">{resource.category}</Badge>
                        <Badge variant="secondary" className="text-xs">
                          {resource.type}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Updated: {resource.lastUpdated}</span>
                        <div className="flex items-center text-primary group-hover:text-accent transition-colors">
                          {resource.url ? (
                            <>
                              <ExternalLink size={14} className="mr-1" />
                              Open
                            </>
                          ) : (
                            <>
                              <Download size={14} className="mr-1" />
                              View
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BrowseResources;