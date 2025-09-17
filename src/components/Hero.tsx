import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Users, Lightbulb } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-primary/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-roboto font-bold text-white mb-6">
            Accelerating <span className="text-secondary">Innovation</span> Through 
            <br />Technology Transfer
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            USTP Technology and Partnership Commercialization Office - Your gateway to cutting-edge 
            research, intellectual property protection, and industry collaboration in Northern Mindanao.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="gold" size="xl" className="group">
              Explore Our IP Portfolio
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="gold-outline" size="xl">
              Partner With Us
            </Button>
          </div>
        </div>

        {/* Stats Counter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-center mb-4">
              <Award className="text-secondary" size={40} />
            </div>
            <div className="text-3xl font-roboto font-bold text-white mb-2">24+</div>
            <div className="text-white/90">Patents Granted</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-center mb-4">
              <Users className="text-secondary" size={40} />
            </div>
            <div className="text-3xl font-roboto font-bold text-white mb-2">50+</div>
            <div className="text-white/90">Industry Partners</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-center mb-4">
              <Lightbulb className="text-secondary" size={40} />
            </div>
            <div className="text-3xl font-roboto font-bold text-white mb-2">100+</div>
            <div className="text-white/90">Technologies Developed</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;