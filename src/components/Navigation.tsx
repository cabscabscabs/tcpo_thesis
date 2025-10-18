import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, FileText, Users, BookOpen, Info, Newspaper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", href: "/", icon: null },
    { name: "Our IP", href: "/ip-portfolio", icon: FileText },
    { name: "Services", href: "/services", icon: Users },
    { name: "Resources", href: "/resources", icon: BookOpen },
    { name: "Latest News", href: "/latest-news", icon: Newspaper },
    { name: "About", href: "/about", icon: Info },
  ];

  return (
    <nav className="bg-primary shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0 text-white">
              <h1 className="text-xl font-roboto font-bold">USTP TPCO</h1>
              <p className="text-xs text-secondary/90">Technology Transfer Office</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className="text-white hover:text-secondary transition-colors duration-300 px-3 py-2 text-sm font-medium border-none bg-transparent cursor-pointer"
              >
                {item.name}
              </button>
            ))}
            <Button variant="gold" size="sm" onClick={() => navigate('/contact')}>
              Contact Us
            </Button>
            <ThemeToggle className="text-white hover:text-secondary" />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-secondary transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-primary border-t border-primary/20">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setIsOpen(false);
                  }}
                  className="text-white hover:text-secondary block px-3 py-2 text-base font-medium transition-colors w-full text-left border-none bg-transparent cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    {item.icon && <item.icon size={18} />}
                    <span>{item.name}</span>
                  </div>
                </button>
              ))}
              <div className="pt-2">
                <Button variant="gold" size="sm" className="w-full" onClick={() => navigate('/contact')}>
                  Contact Us
                </Button>
              </div>
              <div className="pt-2 border-t border-white/20">
                <ThemeToggle className="w-full justify-center text-white hover:text-secondary" showLabel />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;