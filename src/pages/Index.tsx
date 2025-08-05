import Navigation from "@/components/Navigation";
import FeaturedTechnologies from "@/components/FeaturedTechnologies";
import ServicesOverview from "@/components/ServicesOverview";
import ImpactStats from "@/components/ImpactStats";
import LatestNews from "@/components/LatestNews";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <LatestNews />
      <FeaturedTechnologies />
      <ServicesOverview />
      <ImpactStats />
      <Footer />
    </div>
  );
};

export default Index;
