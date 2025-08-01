import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedTechnologies from "@/components/FeaturedTechnologies";
import ServicesOverview from "@/components/ServicesOverview";
import ImpactStats from "@/components/ImpactStats";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <FeaturedTechnologies />
      <ServicesOverview />
      <ImpactStats />
      <Footer />
    </div>
  );
};

export default Index;
