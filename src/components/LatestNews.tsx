import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useMemo } from "react";
import { Search, Filter, Calendar, User, ExternalLink, ArrowRight, ArrowLeft } from "lucide-react";

const LatestNews = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  
  // Mock data - in real app this would come from admin/database
  const allNewsItems = [
    {
      id: 1,
      title: "Revolutionary AI Technology Patent Approved for USTP Innovation Lab",
      excerpt: "Breakthrough artificial intelligence system receives patent approval, marking a significant milestone for university research.",
      date: "2024-01-15",
      category: "Patent",
      author: "Dr. Maria Santos",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&q=80",
      featured: true,
      tags: ["AI", "Patent", "Innovation Lab", "Research"]
    },
    {
      id: 2,
      title: "Smart Agriculture IoT System Wins Innovation Award",
      excerpt: "USTP's precision farming technology recognized at national innovation competition.",
      date: "2024-01-12",
      category: "Innovation",
      author: "Prof. Juan Cruz",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&q=80",
      tags: ["IoT", "Agriculture", "Award", "Precision Farming"]
    },
    {
      id: 3,
      title: "Green Energy Research Collaboration Established",
      excerpt: "New partnership focuses on sustainable renewable energy solutions for rural communities.",
      date: "2024-01-10",
      category: "Research",
      author: "Dr. Ana Rodriguez",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop&q=80",
      tags: ["Green Energy", "Partnership", "Rural Development", "Sustainability"]
    },
    {
      id: 4,
      title: "Biotech Startup Licensing USTP Technology",
      excerpt: "Local biotechnology company acquires licensing rights for university-developed medical device.",
      date: "2024-01-08",
      category: "Licensing",
      author: "Dr. Roberto Kim",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&q=80",
      tags: ["Biotech", "Licensing", "Medical Device", "Startup"]
    },
    {
      id: 5,
      title: "Digital Learning Platform Copyright Protected",
      excerpt: "University's innovative e-learning system receives comprehensive copyright protection.",
      date: "2024-01-05",
      category: "Copyright",
      author: "Prof. Lisa Chen",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&q=80",
      tags: ["E-learning", "Copyright", "Digital Platform", "Education"]
    },
    {
      id: 6,
      title: "Smart Campus Infrastructure Development",
      excerpt: "New IoT-enabled campus infrastructure enhances student experience and operational efficiency.",
      date: "2024-01-03",
      category: "Innovation",
      author: "Dr. Michael Torres",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop&q=80",
      tags: ["Smart Campus", "IoT", "Infrastructure", "Student Experience"]
    },
    {
      id: 7,
      title: "Research Collaboration with Tech Giants",
      excerpt: "USTP partners with leading technology companies for advanced research initiatives.",
      date: "2024-01-01",
      category: "Research",
      author: "Prof. Sarah Johnson",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&q=80",
      tags: ["Tech Giants", "Partnership", "Research", "Collaboration"]
    },
    {
      id: 8,
      title: "Patent Protection for Medical Devices",
      excerpt: "University's innovative medical technology receives comprehensive patent protection.",
      date: "2023-12-28",
      category: "Patent",
      author: "Dr. Elena Vasquez",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop&q=80",
      tags: ["Medical Device", "Patent", "Healthcare", "Innovation"]
    },
    {
      id: 9,
      title: "Sustainable Materials Research Breakthrough",
      excerpt: "New biodegradable composite materials show promise for reducing environmental impact in manufacturing.",
      date: "2023-12-25",
      category: "Research",
      author: "Dr. Carlos Mendez",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80",
      tags: ["Sustainable Materials", "Biodegradable", "Manufacturing", "Environment"]
    },
    {
      id: 10,
      title: "Innovation Hub Grand Opening",
      excerpt: "USTP's new innovation hub opens its doors, providing state-of-the-art facilities for researchers and entrepreneurs.",
      date: "2023-12-20",
      category: "Innovation",
      author: "Prof. David Wilson",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&q=80",
      tags: ["Innovation Hub", "Facilities", "Entrepreneurs", "Research"]
    },
    {
      id: 11,
      title: "International Patent Cooperation Agreement",
      excerpt: "USTP signs landmark agreement for international patent cooperation and technology transfer.",
      date: "2023-12-15",
      category: "Patent",
      author: "Dr. Sofia Martinez",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop&q=80",
      tags: ["International", "Patent Cooperation", "Technology Transfer", "Agreement"]
    },
    {
      id: 12,
      title: "Student Innovation Competition Winners",
      excerpt: "Annual student innovation competition showcases groundbreaking projects from USTP's brightest minds.",
      date: "2023-12-10",
      category: "Innovation",
      author: "Prof. James Brown",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&q=80",
      tags: ["Student Competition", "Innovation", "Projects", "Education"]
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Patent': 'bg-ustp-blue text-white',
      'Innovation': 'bg-ustp-orange text-white',
      'Research': 'bg-primary text-white',
      'Licensing': 'bg-secondary text-white',
      'Copyright': 'bg-muted text-white'
    };
    return colors[category as keyof typeof colors] || 'bg-muted text-white';
  };

  // Get unique categories and years for filters
  const categories = useMemo(() => {
    const cats = [...new Set(allNewsItems.map(item => item.category))];
    return cats.sort();
  }, []);

  const years = useMemo(() => {
    const yrs = [...new Set(allNewsItems.map(item => new Date(item.date).getFullYear().toString()))];
    return yrs.sort((a, b) => parseInt(b) - parseInt(a));
  }, []);

  // Filter news based on search, category, and year
  const filteredNews = useMemo(() => {
    return allNewsItems.filter(item => {
      const matchesSearch = searchTerm === "" || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesYear = selectedYear === "all" || new Date(item.date).getFullYear().toString() === selectedYear;
      
      return matchesSearch && matchesCategory && matchesYear;
    });
  }, [searchTerm, selectedCategory, selectedYear]);

  // Get featured article and regular articles
  const featuredArticle = filteredNews.find(item => item.featured);
  const regularArticles = filteredNews.filter(item => !item.featured).slice(0, visibleCount - (featuredArticle ? 1 : 0));
  
  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, filteredNews.length));
  };
  
  const hasMore = visibleCount < filteredNews.length;

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedYear("all");
    setActiveTab("all");
  };

  const hasActiveFilters = searchTerm !== "" || selectedCategory !== "all" || selectedYear !== "all";

  return (
    <section className="py-20 bg-gradient-to-br from-background via-background/95 to-ustp-blue/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Latest News & Updates
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Stay informed with the latest developments, announcements, and achievements from USTP Technology & Product Commercialization Office
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Year Filter */}
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
            
            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: "{searchTerm}"
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Category: {selectedCategory}
                  </Badge>
                )}
                {selectedYear !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Year: {selectedYear}
                  </Badge>
                )}
              </div>
            )}
            
            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {Math.min(visibleCount, filteredNews.length)} of {filteredNews.length} news articles
              {hasActiveFilters && " (filtered)"}
            </div>
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No news found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured Article - Large */}
            {featuredArticle && (
              <div className="lg:col-span-2 lg:row-span-2">
                <Card className="h-full overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
                  <div 
                    className="relative h-[500px] bg-cover bg-center"
                    style={{ backgroundImage: `url(${featuredArticle.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <Badge className={`mb-4 px-3 py-1 text-sm font-medium ${getCategoryColor(featuredArticle.category)}`}>
                        {featuredArticle.category.toUpperCase()}
                      </Badge>
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 leading-tight">
                        {featuredArticle.title}
                      </h3>
                      <p className="text-white/90 text-sm mb-4 line-clamp-2">
                        {featuredArticle.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-white/80 text-sm mb-4">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {featuredArticle.author}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(featuredArticle.date)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {featuredArticle.tags.slice(0, 4).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-white/20 text-white border-white/30">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Regular Articles - Grid */}
            {regularArticles.map((item) => (
              <div key={item.id} className="lg:col-span-1">
                <Card className="h-full overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div 
                    className="relative h-[240px] bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <Badge className={`mb-3 px-2 py-1 text-xs font-medium ${getCategoryColor(item.category)}`}>
                        {item.category.toUpperCase()}
                      </Badge>
                      <h4 className="text-lg font-bold text-white mb-2 leading-tight line-clamp-2">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-white/80 text-xs mb-3">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.author}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.date)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-white/20 text-white border-white/30">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Load More and Actions */}
        <div className="text-center mt-12 space-y-6">
          {hasMore && (
            <Button 
              onClick={loadMore}
              variant="outline"
              size="lg"
              className="px-8"
            >
              Load More News
            </Button>
          )}
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="default" size="lg" className="px-8">
              View All News
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Subscribe to Newsletter
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Get real-time updates delivered to your inbox
          </p>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;