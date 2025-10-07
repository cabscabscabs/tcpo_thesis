import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  Share2, 
  Clock,
  Tag,
  ExternalLink
} from "lucide-react";

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  author: string;
  image?: string;
  tags?: string[];
  status: string;
}

const NewsDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    const loadNewsArticle = () => {
      try {
        // Load from localStorage (admin-managed news)
        const savedNews = localStorage.getItem('newsArticles');
        if (savedNews) {
          const parsedNews = JSON.parse(savedNews);
          const publishedNews = parsedNews.filter((article: NewsArticle) => article.status === 'Published');
          
          // Find article by slug (convert title to slug format)
          const foundArticle = publishedNews.find((article: NewsArticle) => {
            const articleSlug = article.title.toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
            return articleSlug === slug;
          });

          if (foundArticle) {
            setArticle(foundArticle);
            
            // Get related articles (same category, excluding current)
            const related = publishedNews
              .filter((a: NewsArticle) => a.category === foundArticle.category && a.id !== foundArticle.id)
              .slice(0, 3);
            setRelatedArticles(related);
          }
        }
      } catch (error) {
        console.error('Failed to load news article:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNewsArticle();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const handleRelatedArticleClick = (relatedArticle: NewsArticle) => {
    const articleSlug = relatedArticle.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    navigate(`/news/${articleSlug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
            <p className="text-gray-600 mb-6">
              The news article you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/latest-news')}>
              <ArrowLeft className="mr-2" size={16} />
              Back to News
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/latest-news')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to News
        </Button>
      </div>

      <article className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-ustp-blue text-white">
                {article.category.toUpperCase()}
              </Badge>
              {article.tags && article.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {article.excerpt}
            </p>
            
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-4 text-gray-600">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {article.author}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(article.date)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {Math.ceil(article.content.split(' ').length / 200)} min read
                </span>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </header>

          {/* Article Content */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="prose prose-lg max-w-none">
              {article.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Card 
                    key={relatedArticle.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    onClick={() => handleRelatedArticleClick(relatedArticle)}
                  >
                    <div 
                      className="relative h-[160px] bg-cover bg-center rounded-t-lg"
                      style={{ 
                        backgroundImage: `url(${relatedArticle.image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop&q=80'})` 
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg" />
                      <Badge className="absolute top-3 left-3 bg-ustp-blue text-white text-xs">
                        {relatedArticle.category.toUpperCase()}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-ustp-blue transition-colors">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {relatedArticle.excerpt}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(relatedArticle.date)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button variant="outline" onClick={() => navigate('/latest-news')}>
                  View All News
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </section>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default NewsDetail;