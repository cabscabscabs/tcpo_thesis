import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ChatWidget } from "@/components/ChatWidget";
import Index from "./pages/Index";
import IPPortfolio from "./pages/IPPortfolio";
import Services from "./pages/Services";
import ServiceRequest from "./pages/ServiceRequest";
import AdditionalServices from "./pages/AdditionalServices";
import Resources from "./pages/Resources";
import BrowseResources from "./pages/BrowseResources";
import FacilityBooking from "./pages/FacilityBooking";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import Admin from "./pages/Admin";
import ChatDemo from "./pages/ChatDemo";
import NotFound from "./pages/NotFound";
import LatestNewsPage from "./pages/LatestNewsPage";
import NewsDetail from "./pages/NewsDetail";
import TechnologyDetails from "./pages/TechnologyDetails";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ip-portfolio" element={<IPPortfolio />} />
            <Route path="/technology/:slug" element={<TechnologyDetails />} />
            <Route path="/news/:slug" element={<NewsDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/service-request" element={<ServiceRequest />} />
            <Route path="/additional-services" element={<AdditionalServices />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/browse-resources" element={<BrowseResources />} />
            <Route path="/facility-booking" element={<FacilityBooking />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/events" element={<Events />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/chat-demo" element={<ChatDemo />} />
            <Route path="/latest-news" element={<LatestNewsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        {/* Global ChatWidget - appears on all pages */}
        <ChatWidget 
          appName="USTP TPCO" 
          position="bottom-right"
          apiEndpoint="/api/chat"
        />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;