import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, User, ExternalLink } from "lucide-react";

const HomepageLatestNews = () => {
  const navigate = useNavigate();
  const [newsArticles, setNewsArticles] = useState([]);
  
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

  // Load news from localStorage (admin panel data)
  useEffect(() => {
    const loadNewsData = () => {
      try {
        const savedNews = localStorage.getItem('newsArticles');
        if (savedNews) {
          const parsedNews = JSON.parse(savedNews);
          // Only show published articles on the frontend, sorted by date (latest first)
          const publishedNews = parsedNews
            .filter(article => article.status === 'Published')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort latest first
            .slice(0, 3) // Limit to 3 most recent articles
            .map((article, index) => ({
              ...article,
              // Use the admin-uploaded image if available, otherwise use placeholder
              image: article.image || `https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&q=80`,
              // Generate tags from category and title
              tags: article.tags || [article.category, 'USTP', 'News'],
              featured: index === 0 // Make first (most recent) article featured
            }));
          
          if (publishedNews.length > 0) {
            setNewsArticles(publishedNews);
          } else {
            // Use fallback data if no published articles exist
            setNewsArticles(fallbackNewsItems.slice(0, 3));
          }
        } else {
          // Use fallback data if no saved news exists
          setNewsArticles(fallbackNewsItems.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to load news data:', error);
        setNewsArticles(fallbackNewsItems.slice(0, 3));
      }
    };

    // Load initially
    loadNewsData();

    // Listen for storage changes (when admin updates news)
    const handleStorageChange = () => {
      loadNewsData();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
      'Copyright': 'bg-muted text-white',
      'Events': 'bg-green-600 text-white',
      'Partnerships': 'bg-purple-600 text-white',
      'Education': 'bg-blue-600 text-white',
      'Announcements': 'bg-orange-600 text-white'
    };
    return colors[category as keyof typeof colors] || 'bg-muted text-white';
  };

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

  // Get featured article and regular articles
  const featuredArticle = newsArticles.find((item: any) => item.featured);
  const regularArticles = newsArticles.filter((item: any) => !item.featured);

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

        {/* News Grid - Limited to 3 articles for homepage */}
        {newsArticles.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No news available</h3>
            <p className="text-gray-500 mb-6">
              Check back soon for the latest updates and announcements.
            </p>
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
                        {featuredArticle.tags.slice(0, 4).map((tag: string, index: number) => (
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
            {regularArticles.map((item: any) => (
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
                        {item.tags.slice(0, 3).map((tag: string, index: number) => (
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

        {/* View All News Button */}
        <div className="text-center mt-12">
          <Button 
            variant="default" 
            size="lg" 
            className="px-8"
            onClick={handleViewAllNews}
          >
            View All News
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            Discover more news, updates, and announcements
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomepageLatestNews;