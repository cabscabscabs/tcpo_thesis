import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const LatestNews = () => {
  // Mock data - in real app this would come from admin/database
  const newsItems = [
    {
      id: 1,
      title: "New Patent Filing Guidelines Released",
      excerpt: "Updated guidelines for patent filing procedures now available for all USTP researchers and faculty members.",
      date: "2024-01-15",
      category: "Patent",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Technology Transfer Workshop Scheduled",
      excerpt: "Join us for a comprehensive workshop on technology transfer processes and commercialization strategies.",
      date: "2024-01-12",
      category: "Event",
      readTime: "2 min read",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&h=300&fit=crop"
    },
    {
      id: 3,
      title: "IP Portfolio Expansion Initiative",
      excerpt: "USTP TPCO announces new initiative to expand intellectual property portfolio across all academic departments.",
      date: "2024-01-10",
      category: "News",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&h=300&fit=crop"
    },
    {
      id: 4,
      title: "Research Collaboration Agreement Signed",
      excerpt: "New partnership established with leading industry partners for joint research and development projects.",
      date: "2024-01-08",
      category: "Partnership",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=300&fit=crop"
    },
    {
      id: 5,
      title: "Innovation Awards Program Launched",
      excerpt: "Annual innovation awards program now accepting nominations for outstanding technological achievements.",
      date: "2024-01-05",
      category: "Award",
      readTime: "2 min read",
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=600&h=300&fit=crop"
    },
    {
      id: 6,
      title: "Copyright Registration Made Easier",
      excerpt: "Streamlined copyright registration process now available through our online portal system.",
      date: "2024-01-03",
      category: "Copyright",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&h=300&fit=crop"
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
      'Patent': 'bg-ustp-blue/10 text-ustp-blue border-ustp-blue/20',
      'Event': 'bg-ustp-orange/10 text-ustp-orange border-ustp-orange/20',
      'News': 'bg-primary/10 text-primary border-primary/20',
      'Partnership': 'bg-secondary/10 text-secondary-foreground border-secondary/20',
      'Award': 'bg-ustp-yellow/10 text-ustp-yellow border-ustp-yellow/20',
      'Copyright': 'bg-muted/10 text-muted-foreground border-muted/20'
    };
    return colors[category as keyof typeof colors] || 'bg-muted/10 text-muted-foreground border-muted/20';
  };

  return (
    <section className="py-8 bg-gradient-to-br from-ustp-blue via-ustp-blue/95 to-ustp-blue/80 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Latest News & Updates
          </h1>
          <p className="text-base text-white/90 max-w-2xl mx-auto">
            Stay informed with the latest developments and achievements from USTP TPCO
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {newsItems.map((item) => (
                <CarouselItem key={item.id} className="pl-2 md:pl-4">
                  <Card className="relative h-96 md:h-[500px] bg-transparent border-none overflow-hidden max-w-4xl mx-auto group cursor-pointer">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                    </div>
                    
                    {/* Content Overlay */}
                    <div className="relative z-10 p-6 md:p-8 h-full flex flex-col">
                      {/* Category Badge */}
                      <div className="mb-4">
                        <Badge 
                          variant="outline" 
                          className="text-xs font-semibold bg-white/90 text-gray-900 border-white/20 uppercase tracking-wider"
                        >
                          {item.category}
                        </Badge>
                      </div>
                      
                      {/* Main Content */}
                      <div className="mt-auto">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight line-clamp-3">
                          {item.title}
                        </h2>
                        
                        <p className="text-white/90 text-sm md:text-base mb-4 line-clamp-2 leading-relaxed">
                          {item.excerpt}
                        </p>
                        
                        {/* Meta Information */}
                        <div className="flex items-center justify-between text-white/80">
                          <div className="flex items-center gap-4 text-xs md:text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                              {formatDate(item.date)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 md:h-4 md:w-4" />
                              {item.readTime}
                            </div>
                          </div>
                          
                          <button className="flex items-center gap-2 text-white hover:text-white/80 transition-colors group/btn">
                            <span className="text-xs md:text-sm font-medium">Read more</span>
                            <ArrowRight className="h-3 w-3 md:h-4 md:w-4 transition-transform group-hover/btn:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white/90 hover:bg-white border-white/20 text-ustp-blue hover:text-ustp-blue -left-4 md:-left-12 shadow-lg" />
            <CarouselNext className="bg-white/90 hover:bg-white border-white/20 text-ustp-blue hover:text-ustp-blue -right-4 md:-right-12 shadow-lg" />
          </Carousel>
        </div>

        <div className="text-center mt-12">
          <p className="text-white/80">
            Want to stay updated? Subscribe to our newsletter or follow our social media channels for real-time updates.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;