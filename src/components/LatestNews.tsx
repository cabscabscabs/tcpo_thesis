import { Badge } from "@/components/ui/badge";

const LatestNews = () => {
  // Mock data - in real app this would come from admin/database
  const newsItems = [
    {
      id: 1,
      title: "Revolutionary AI Technology Patent Approved for USTP Innovation Lab",
      excerpt: "Breakthrough artificial intelligence system receives patent approval, marking a significant milestone for university research.",
      date: "2024-01-15",
      category: "Patent",
      author: "Dr. Maria Santos",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&q=80",
      featured: true
    },
    {
      id: 2,
      title: "Smart Agriculture IoT System Wins Innovation Award",
      excerpt: "USTP's precision farming technology recognized at national innovation competition.",
      date: "2024-01-12",
      category: "Innovation",
      author: "Prof. Juan Cruz",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&q=80"
    },
    {
      id: 3,
      title: "Green Energy Research Collaboration Established",
      excerpt: "New partnership focuses on sustainable renewable energy solutions for rural communities.",
      date: "2024-01-10",
      category: "Research",
      author: "Dr. Ana Rodriguez",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop&q=80"
    },
    {
      id: 4,
      title: "Biotech Startup Licensing USTP Technology",
      excerpt: "Local biotechnology company acquires licensing rights for university-developed medical device.",
      date: "2024-01-08",
      category: "Licensing",
      author: "Dr. Roberto Kim",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&q=80"
    },
    {
      id: 5,
      title: "Digital Learning Platform Copyright Protected",
      excerpt: "University's innovative e-learning system receives comprehensive copyright protection.",
      date: "2024-01-05",
      category: "Copyright",
      author: "Prof. Lisa Chen",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&q=80"
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

  const featuredArticle = newsItems.find(item => item.featured);
  const regularArticles = newsItems.filter(item => !item.featured);

  return (
    <section className="py-20 bg-gradient-to-br from-background via-background/95 to-ustp-blue/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Latest News & Updates
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest developments, announcements, and achievements from USTP Technology & Product Commercialization Office
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Article - Large */}
          {featuredArticle && (
            <div className="lg:col-span-2 lg:row-span-2">
              <div 
                className="relative h-[500px] rounded-lg overflow-hidden bg-cover bg-center group cursor-pointer"
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
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <span>{featuredArticle.author}</span>
                    <span>•</span>
                    <span>{formatDate(featuredArticle.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Regular Articles - Grid */}
          {regularArticles.map((item) => (
            <div key={item.id} className="lg:col-span-1">
              <div 
                className="relative h-[240px] rounded-lg overflow-hidden bg-cover bg-center group cursor-pointer"
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
                  <div className="flex items-center gap-2 text-white/80 text-xs">
                    <span>{item.author}</span>
                    <span>•</span>
                    <span>{formatDate(item.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Want to stay updated? Subscribe to our newsletter or follow our social media channels for real-time updates.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;