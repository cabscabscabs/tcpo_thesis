import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
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
      readTime: "3 min read"
    },
    {
      id: 2,
      title: "Technology Transfer Workshop Scheduled",
      excerpt: "Join us for a comprehensive workshop on technology transfer processes and commercialization strategies.",
      date: "2024-01-12",
      category: "Event",
      readTime: "2 min read"
    },
    {
      id: 3,
      title: "IP Portfolio Expansion Initiative",
      excerpt: "USTP TPCO announces new initiative to expand intellectual property portfolio across all academic departments.",
      date: "2024-01-10",
      category: "News",
      readTime: "4 min read"
    },
    {
      id: 4,
      title: "Research Collaboration Agreement Signed",
      excerpt: "New partnership established with leading industry partners for joint research and development projects.",
      date: "2024-01-08",
      category: "Partnership",
      readTime: "3 min read"
    },
    {
      id: 5,
      title: "Innovation Awards Program Launched",
      excerpt: "Annual innovation awards program now accepting nominations for outstanding technological achievements.",
      date: "2024-01-05",
      category: "Award",
      readTime: "2 min read"
    },
    {
      id: 6,
      title: "Copyright Registration Made Easier",
      excerpt: "Streamlined copyright registration process now available through our online portal system.",
      date: "2024-01-03",
      category: "Copyright",
      readTime: "3 min read"
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
    <section className="py-20 bg-gradient-to-br from-ustp-blue via-ustp-blue/95 to-ustp-blue/80 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Latest News & Updates
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Stay informed with the latest developments, announcements, and achievements from USTP Technology & Product Commercialization Office
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {newsItems.map((item) => (
                <CarouselItem key={item.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full bg-white/95 backdrop-blur-sm border-white/20 hover:bg-white transition-all duration-300 hover:shadow-xl group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getCategoryColor(item.category)}`}
                        >
                          {item.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {item.readTime}
                        </div>
                      </div>
                      <CardTitle className="text-lg group-hover:text-ustp-blue transition-colors line-clamp-2">
                        {item.title}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(item.date)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed line-clamp-3">
                        {item.excerpt}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white/90 hover:bg-white border-white/20 text-ustp-blue hover:text-ustp-blue -left-4 md:-left-12" />
            <CarouselNext className="bg-white/90 hover:bg-white border-white/20 text-ustp-blue hover:text-ustp-blue -right-4 md:-right-12" />
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