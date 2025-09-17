import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LatestNews from "@/components/LatestNews";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const LatestNewsPage = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll to show/hide back to top button
  const handleScroll = () => {
    setShowBackToTop(window.scrollY > 300);
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Add scroll event listener
  useState(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow">
        <LatestNews />
      </main>
      
      <Footer />
      
      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 rounded-full p-3 shadow-lg z-50"
          size="icon"
        >
          <ArrowLeft className="h-5 w-5 rotate-90" />
        </Button>
      )}
    </div>
  );
};

export default LatestNewsPage;