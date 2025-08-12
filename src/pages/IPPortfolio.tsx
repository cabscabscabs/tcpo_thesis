import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, ExternalLink, Calendar, Users, FileText, X } from "lucide-react";
import ipBgImage from "@/assets/ip-portfolio-bg.jpg";
import { useState, useMemo } from "react";

const IPPortfolio = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const patents = [
    {
      id: "PH-2024-001",
      title: "Bio-Organic Soil Enhancement System",
      inventors: "Dr. Maria Santos, Dr. Juan dela Cruz, Dr. Anna Reyes",
      field: "Agriculture",
      status: "Granted",
      year: "2024",
      abstract: "A revolutionary soil enhancement technology utilizing locally-sourced organic materials combined with precision nutrient delivery systems. This innovation increases crop yield by 35% while reducing environmental impact through sustainable farming practices.",
      licensing: "Available for Non-Exclusive License",
      applications: ["Organic Farming", "Sustainable Agriculture", "Crop Optimization"],
      contact: "maria.santos@ustp.edu.ph"
    },
    {
      id: "PH-2023-015",
      title: "Smart Concrete Additive Technology",
      inventors: "Dr. Roberto Mendez, Dr. Carmen Garcia, Engr. Luis Torres",
      field: "Materials Science",
      status: "Granted",
      year: "2023",
      abstract: "Advanced cement additive technology that improves structural integrity by 40% and reduces construction costs by 20%. The innovation incorporates nanotechnology for enhanced durability and environmental sustainability.",
      licensing: "Available for Exclusive License",
      applications: ["Construction", "Infrastructure", "Green Building"],
      contact: "roberto.mendez@ustp.edu.ph"
    },
    {
      id: "PH-2024-008",
      title: "Natural Food Preservation System",
      inventors: "Dr. Carmen Reyes, Dr. Luis Torres, Dr. Sofia Martinez",
      field: "Food Technology",
      status: "Granted",
      year: "2024",
      abstract: "Novel packaging technology that extends fresh produce shelf life by 50% using natural antimicrobial agents derived from local plant extracts. Environmentally friendly and cost-effective solution for food security.",
      licensing: "Licensed to FreshPack Solutions Inc.",
      applications: ["Food Packaging", "Agricultural Export", "Food Security"],
      contact: "carmen.reyes@ustp.edu.ph"
    },
    {
      id: "PH-2023-022",
      title: "IoT-Based Water Quality Monitoring",
      inventors: "Dr. Michael Chen, Dr. Patricia Lim, Engr. Ramon Santos",
      field: "Environmental Technology",
      status: "Granted",
      year: "2023",
      abstract: "Intelligent water quality monitoring system using IoT sensors and machine learning algorithms for real-time detection of contaminants and automated alert systems for municipal water treatment facilities.",
      licensing: "Available for Non-Exclusive License",
      applications: ["Water Treatment", "Environmental Monitoring", "Smart Cities"],
      contact: "michael.chen@ustp.edu.ph"
    },
    {
      id: "PH-2024-012",
      title: "Renewable Energy Storage Matrix",
      inventors: "Dr. Elena Rodriguez, Dr. James Wilson, Dr. Mark Thompson",
      field: "Energy Technology",
      status: "Pending",
      year: "2024",
      abstract: "Advanced battery technology using indigenous materials for improved energy storage capacity and longer lifespan. Specifically designed for renewable energy systems in tropical climates.",
      licensing: "Under Review",
      applications: ["Solar Energy", "Grid Storage", "Electric Vehicles"],
      contact: "elena.rodriguez@ustp.edu.ph"
    },
    {
      id: "PH-2023-009",
      title: "Aquaculture Automation System",
      inventors: "Dr. Fernando Aquino, Dr. Grace Tan, Dr. Victor Hugo",
      field: "Aquaculture Technology",
      status: "Granted",
      year: "2023",
      abstract: "Automated aquaculture management system that optimizes feeding schedules, monitors water quality, and predicts optimal harvest times using AI-driven analytics, increasing fish farm productivity by 30%.",
      licensing: "Available for Exclusive License",
      applications: ["Fish Farming", "Aquaculture Management", "Sustainable Seafood"],
      contact: "fernando.aquino@ustp.edu.ph"
    }
  ];

  // Filter patents based on search term, field, and status
  const filteredPatents = useMemo(() => {
    return patents.filter((patent) => {
      // Search filter - check title, inventors, abstract, and applications
      const searchMatch = searchTerm === "" || 
        patent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patent.inventors.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patent.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patent.applications.some(app => app.toLowerCase().includes(searchTerm.toLowerCase()));

      // Field filter
      const fieldMatch = selectedField === "all" || 
        patent.field.toLowerCase().includes(selectedField.toLowerCase());

      // Status filter
      const statusMatch = selectedStatus === "all" || 
        patent.status.toLowerCase().includes(selectedStatus.toLowerCase());

      return searchMatch && fieldMatch && statusMatch;
    });
  }, [searchTerm, selectedField, selectedStatus]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedField("all");
    setSelectedStatus("all");
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== "" || selectedField !== "all" || selectedStatus !== "all";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Granted": return "bg-green-100 text-green-800";
      case "Licensed": return "bg-blue-100 text-blue-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Under Review": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getFieldColor = (field: string) => {
    const colors = {
      "Agriculture": "bg-emerald-100 text-emerald-800",
      "Materials Science": "bg-purple-100 text-purple-800",
      "Food Technology": "bg-orange-100 text-orange-800",
      "Environmental Technology": "bg-blue-100 text-blue-800",
      "Energy Technology": "bg-yellow-100 text-yellow-800",
      "Aquaculture Technology": "bg-cyan-100 text-cyan-800"
    };
    return colors[field as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen">
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
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="materials">Materials Science</SelectItem>
                  <SelectItem value="food">Food Technology</SelectItem>
                  <SelectItem value="environmental">Environmental Technology</SelectItem>
                  <SelectItem value="energy">Energy Technology</SelectItem>
                  <SelectItem value="aquaculture">Aquaculture Technology</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="granted">Granted</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="licensed">Licensed</SelectItem>
                  <SelectItem value="under review">Under Review</SelectItem>
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
          
          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredPatents.length} of {patents.length} patents
            {hasActiveFilters && " (filtered)"}
          </div>
        </div>
      </section>

      {/* Patent Portfolio Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPatents.length === 0 ? (
            <div className="text-center py-16">
              <Filter className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patents found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredPatents.map((patent, index) => (
                <Card key={index} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="bg-gradient-to-r from-primary to-accent text-white">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-2">
                        <Badge className={`${getStatusColor(patent.status)} text-xs`}>
                          {patent.status}
                        </Badge>
                        <Badge className={`${getFieldColor(patent.field)} text-xs`}>
                          {patent.field}
                        </Badge>
                      </div>
                      <span className="text-secondary text-sm font-mono">{patent.id}</span>
                    </div>
                    <CardTitle className="text-xl font-roboto group-hover:text-secondary transition-colors">
                      {patent.title}
                    </CardTitle>
                    <CardDescription className="text-gray-200">
                      {patent.abstract}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Inventors</h4>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users size={16} className="mr-2" />
                          <span>{patent.inventors}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-primary mb-2">Applications</h4>
                        <div className="flex flex-wrap gap-1">
                          {patent.applications.map((app, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {app}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-1" />
                          <span>{patent.year}</span>
                        </div>
                        <span className="font-medium text-secondary">{patent.licensing}</span>
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button variant="gold" size="sm" className="flex-1">
                          Contact for Licensing
                          <ExternalLink size={16} className="ml-2" />
                        </Button>
                        <Button variant="gold-outline" size="sm">
                          <Download size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How to License Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-roboto font-bold text-primary mb-8">
            How to License Our Technologies
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary font-bold text-lg mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Browse Portfolio</h3>
              <p className="text-sm text-gray-600">Explore our IP portfolio and identify technologies of interest</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary font-bold text-lg mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">Submit Inquiry</h3>
              <p className="text-sm text-gray-600">Contact the inventor or TPCO team for licensing information</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary font-bold text-lg mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">Negotiate Terms</h3>
              <p className="text-sm text-gray-600">Work with our team to establish licensing agreement terms</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary font-bold text-lg mx-auto mb-4">4</div>
              <h3 className="font-semibold mb-2">Commercialize</h3>
              <p className="text-sm text-gray-600">Begin commercialization with ongoing support from USTP</p>
            </div>
          </div>
          
          <Button variant="ustp" size="lg">
            Start Licensing Process
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IPPortfolio;