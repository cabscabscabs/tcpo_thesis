import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Calendar, User, ExternalLink, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LatestNews = () => {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [newsArticles, setNewsArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock fallback data in case no admin data exists
  const fallbackNewsItems = [
    {
      id: 1,
      title: "Revolutionary AI Technology Patent Approved for USTP Innovation Lab",
      excerpt: "Breakthrough artificial intelligence system receives patent approval, marking a significant milestone for university research.",
      date: "2024-01-15",
      category: "Patent",
      author: "Dr. Maria Santos",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&q=80",
      featured: true,
      tags: ["AI", "Patent", "Innovation Lab", "Research"],
      status: "Published",
      content: "Breakthrough artificial intelligence system receives patent approval, marking a significant milestone for university research."
    },
    {
      id: 2,
      title: "Smart Agriculture IoT System Wins Innovation Award",
      excerpt: "USTP's precision farming technology recognized at national innovation competition.",
      date: "2024-01-12",
      category: "Innovation",
      author: "Prof. Juan Cruz",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&q=80",
      tags: ["IoT", "Agriculture", "Award", "Precision Farming"],
      status: "Published",
      content: "USTP's precision farming technology recognized at national innovation competition."
    },
    {
      id: 3,
      title: "Green Energy Research Collaboration Established",
      excerpt: "New partnership focuses on sustainable renewable energy solutions for rural communities.",
      date: "2024-01-10",
      category: "Research",
      author: "Dr. Ana Rodriguez",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop&q=80",
      tags: ["Green Energy", "Partnership", "Rural Development", "Sustainability"],
      status: "Published",
      content: "New partnership focuses on sustainable renewable energy solutions for rural communities."
    }
  ];

  // Load news from Supabase (admin panel data)
  useEffect(() => {
    const loadNewsData = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_news' as any)
          .select('*')
          .eq('published', true)
          .order('date', { ascending: false });
        
        if (data && !error) {
          const publishedNews = data.map((article: any) => ({
            id: article.id,
            title: article.title,
            excerpt: article.excerpt,
            date: article.date,
            category: article.category,
            author: article.author,
            image: article.cover_image_url || `https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&q=80`,
            tags: article.tags || [article.category, 'USTP', 'News'],
            status: article.status,
            content: article.content,
            featured: false
          }));
          
          // Set the most recent article as featured
          if (publishedNews.length > 0) {
            publishedNews[0].featured = true;
          }
          
          if (publishedNews.length > 0) {
            setNewsArticles(publishedNews);
          } else {
            setNewsArticles(fallbackNewsItems);
          }
        } else {
          setNewsArticles(fallbackNewsItems);
        }
      } catch (error) {
        console.error('Failed to load news data:', error);
        setNewsArticles(fallbackNewsItems);
      } finally {
        setIsLoading(false);
      }
    };

    loadNewsData();
  }, []);

  // Use newsArticles instead of allNewsItems
  const allNewsItems = newsArticles;

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
  }, [allNewsItems]);

  const years = useMemo(() => {
    const yrs = [...new Set(allNewsItems.map(item => new Date(item.date).getFullYear().toString()))];
    return yrs.sort((a, b) => parseInt(b) - parseInt(a));
  }, [allNewsItems]);

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
  }, [allNewsItems, searchTerm, selectedCategory, selectedYear]);

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

  // Navigation functions
  const handleNewsClick = (article: any) => {
    const articleSlug = article.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    navigate(`/news/${articleSlug}`);
  };

  const handleViewAllNews = () => {
    navigate('/latest-news');
  };

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
        {isLoading ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured skeleton */}
            <div className="lg:col-span-2 lg:row-span-2">
              <div className="h-full rounded-lg overflow-hidden animate-pulse">
                <div className="h-[500px] bg-gray-200 rounded-lg" />
              </div>
            </div>
            {/* Regular article skeletons */}
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-[240px] bg-gray-200 rounded-t-lg" />
                <div className="p-4 bg-white border border-gray-100 rounded-b-lg space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredNews.length === 0 ? (
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
                <Card 
                  className="h-full overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
                  onClick={() => handleNewsClick(featuredArticle)}
                >
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
                <Card 
                  className="h-full overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  onClick={() => handleNewsClick(item)}
                >
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
            <Button 
              variant="default" 
              size="lg" 
              className="px-8"
              onClick={handleViewAllNews}
            >
              View All News
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8"
              onClick={() => {
                // Simple newsletter subscription placeholder
                alert('🚀 Newsletter subscription feature coming soon! \n\nStay tuned for real-time updates about USTP TPCO developments, new patent announcements, and innovation opportunities.');
              }}
            >
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