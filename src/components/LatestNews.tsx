import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

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

        <div className="max-w-4xl mx-auto">
          <ScrollArea className="h-[600px] w-full rounded-lg border bg-card/50 backdrop-blur-sm">
            <div className="p-6 space-y-6">
              {newsItems.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 hover:bg-card/80 border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
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
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {item.title}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(item.date)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {item.excerpt}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Want to stay updated? Subscribe to our newsletter or follow our social media channels for real-time updates.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;