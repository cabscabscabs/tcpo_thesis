import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const quickLinks = [
    { name: "IP Portfolio", href: "/ip-portfolio" },
    { name: "Patent Search", href: "/patent-search" },
    { name: "Licensing Guide", href: "/licensing" },
    { name: "Success Stories", href: "/success-stories" }
  ];

  const services = [
    { name: "Patent Filing", href: "/services/patents" },
    { name: "Technology Transfer", href: "/services/transfer" },
    { name: "Industry Matching", href: "/services/matching" },
    { name: "Startup Incubation", href: "/services/incubation" }
  ];

  const resources = [
    { name: "IP 101 Tutorials", href: "/resources/tutorials" },
    { name: "Legal Templates", href: "/resources/templates" },
    { name: "SSF Booking", href: "/resources/facilities" },
    { name: "Research Guidelines", href: "/resources/guidelines" }
  ];

  const partners = [
    "Oro Chamber of Commerce",
    "Ateneo IPO",
    "DOST Region X",
    "DTI Misamis Oriental",
    "CDO b.i.t.e.s."
  ];

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Organization Info */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-roboto font-bold mb-4">USTP TPCO</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
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
                <span className="text-sm">(088) 856-1738</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-secondary" />
                <span className="text-sm">tpco@ustp.edu.ph</span>
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
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-secondary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
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
                  <a 
                    href={service.href} 
                    className="text-gray-300 hover:text-secondary transition-colors text-sm"
                  >
                    {service.name}
                  </a>
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
                  <a 
                    href={resource.href} 
                    className="text-gray-300 hover:text-secondary transition-colors text-sm"
                  >
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Partners Section */}
        <div className="border-t border-gray-600 mt-8 pt-8">
          <h4 className="font-roboto font-semibold mb-4 text-center">Our Partners</h4>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {partners.map((partner, index) => (
              <span key={index} className="text-sm text-gray-300 bg-white/5 px-3 py-1 rounded-full">
                {partner}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            © 2024 USTP Technology and Partnership Commercialization Office. All rights reserved.
          </p>
          
          <div className="flex space-x-6 text-sm">
            <a href="/privacy" className="text-gray-400 hover:text-secondary transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-secondary transition-colors">
              Terms of Use
            </a>
            <a href="/accessibility" className="text-gray-400 hover:text-secondary transition-colors">
              Accessibility
            </a>
          </div>
        </div>

        {/* Upcoming Event Banner */}
        <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-roboto font-semibold text-secondary mb-1">
                Upcoming: TPCO-CET Convergence 2025
              </h5>
              <p className="text-sm text-gray-300">
                Join us for the premier technology commercialization event in Northern Mindanao
              </p>
            </div>
            <Button variant="gold" size="sm" className="group">
              Learn More
              <ExternalLink className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;