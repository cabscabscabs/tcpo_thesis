import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const navigate = useNavigate();
  const [upcomingEvent, setUpcomingEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load upcoming events from Supabase
  useEffect(() => {
    const loadUpcomingEvent = async () => {
      try {
        const currentDate = new Date().toISOString();
        const { data, error } = await supabase
          .from('admin_events' as any)
          .select('*')
          .eq('published', true)
          .or('archived.is.null,archived.eq.false')
          .gte('date', currentDate)
          .order('date', { ascending: true })
          .limit(1);
        
        if (data && !error && data.length > 0) {
          setUpcomingEvent(data[0]);
        }
      } catch (error) {
        console.error('Failed to load upcoming event:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUpcomingEvent();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const quickLinks = [
    { name: "IP Portfolio", href: "/ip-portfolio" },
    { name: "Success Stories", href: "/services" }
  ];

  const services = [
    { name: "Patent Filing", href: "/services" },
    { name: "Technology Transfer", href: "/services" },
    { name: "Industry Matching", href: "/services" },
    { name: "Startup Incubation", href: "/services" }
  ];

  const resources = [
    { name: "IP 101 Tutorials", href: "/resources" },
    { name: "Legal Templates", href: "/resources" },
    { name: "SSF Booking", href: "/resources" },
    { name: "Research Guidelines", href: "/resources" }
  ];

  const partners = [
    { name: "Oro Chamber of Commerce", url: "https://www.orochamber.org/", logo: "/images/partners/oro-chamber.png" },
    { name: "Ateneo IPO", url: "https://www.aipo.ateneo.edu/", logo: "/images/partners/ateneo-ipo.png" },
    { name: "DOST Region X", url: "https://region10.dost.gov.ph/", logo: "/images/partners/dost-region-x.png" },
    { name: "DTI Misamis Oriental", url: "https://www.dti.gov.ph/dti-regions/dti-region-10", logo: "/images/partners/dti-mis-or.png" },
    { name: "CDO b.i.t.e.s.", url: "https://www.cdobites.com/", logo: "/images/partners/cdo-bites.jpg" }
  ];

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Organization Info */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-roboto font-bold mb-4">USTP TPCO</h3>
            <p className="text-white/80 mb-4 leading-relaxed">
              University of Science and Technology of Southern Philippines - Technology and 
              Partnership Commercialization Office. Leading innovation and technology transfer 
              in Northern Mindanao.
            </p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-secondary" />
                <span className="text-sm">USTP CDO Campus, Cagayan de Oro City</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-secondary" />
                <span className="text-sm">(088) 856-1738 Local 1145</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-secondary" />
                <span className="text-sm">ustp.tpco@ustp.edu.ph</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-white hover:text-secondary hover:bg-white/10">
                <Facebook size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-secondary hover:bg-white/10">
                <Twitter size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-secondary hover:bg-white/10">
                <Linkedin size={20} />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-roboto font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={() => navigate(link.href)}
                    className="text-white/70 hover:text-secondary transition-colors text-sm text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-roboto font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <button 
                    onClick={() => navigate(service.href)}
                    className="text-white/70 hover:text-secondary transition-colors text-sm text-left"
                  >
                    {service.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-roboto font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {resources.map((resource, index) => (
                <li key={index}>
                  <button 
                    onClick={() => navigate(resource.href)}
                    className="text-white/70 hover:text-secondary transition-colors text-sm text-left"
                  >
                    {resource.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Partners Section */}
        <div className="border-t border-gray-600 mt-8 pt-8">
          <h4 className="font-roboto font-semibold mb-4 text-center">Our Partners</h4>
          <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
            {partners.map((partner, index) => (
              <a
                key={index}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                title={partner.name}
                aria-label={partner.name}
                className="flex items-center justify-center bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 h-20 w-36 sm:w-40"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-white/60 mb-4 md:mb-0">
            © 2024 USTP Technology and Partnership Commercialization Office. All rights reserved.
          </p>
          
          <div className="flex space-x-6 text-sm">
            <span className="text-white/50 cursor-not-allowed">
              Privacy Policy (Coming Soon)
            </span>
            <span className="text-white/50 cursor-not-allowed">
              Terms of Use (Coming Soon)
            </span>
            <span className="text-white/50 cursor-not-allowed">
              Accessibility (Coming Soon)
            </span>
          </div>
        </div>

        {/* Upcoming Event Banner */}
        <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mt-6">
          {upcomingEvent ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-secondary" />
                  <span className="text-xs text-secondary font-medium">
                    {formatDate(upcomingEvent.date)}
                  </span>
                </div>
                <h5 className="font-roboto font-semibold text-secondary mb-1">
                  Upcoming: {upcomingEvent.title}
                </h5>
                <p className="text-sm text-white/80">
                  {upcomingEvent.description 
                    ? upcomingEvent.description.substring(0, 100) + (upcomingEvent.description.length > 100 ? '...' : '')
                    : 'Join us for this exciting event!'}
                </p>
              </div>
              <Button 
                variant="gold" 
                size="sm" 
                className="group shrink-0" 
                onClick={() => navigate('/events')}
              >
                Learn More
                <ExternalLink className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h5 className="font-roboto font-semibold text-secondary mb-1">
                  Workshops & Events
                </h5>
                <p className="text-sm text-white/80">
                  Check out our upcoming workshops and events to enhance your IP knowledge.
                </p>
              </div>
              <Button 
                variant="gold" 
                size="sm" 
                className="group shrink-0" 
                onClick={() => navigate('/events')}
              >
                View Events
                <ExternalLink className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;