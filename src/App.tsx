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
import Resources from "./pages/Resources";
import About from "./pages/About";
import Admin from "./pages/Admin";
import ChatDemo from "./pages/ChatDemo";
import NotFound from "./pages/NotFound";
import LatestNewsPage from "./pages/LatestNewsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ip-portfolio" element={<IPPortfolio />} />
            <Route path="/services" element={<Services />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/about" element={<About />} />
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