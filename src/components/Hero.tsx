import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Users, Lightbulb } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  const [heroContent, setHeroContent] = useState({
    heroTitle: "Accelerating Innovation Through Technology Transfer",
    heroSubtitle: "USTP Technology and Partnership Commercialization Office - Your gateway to cutting-edge research, intellectual property protection, and industry collaboration in Northern Mindanao.",
    heroImage: null as string | null,
    patentsCount: 24,
    partnersCount: 50,
    technologiesCount: 100
  });

  // Load saved homepage content from localStorage
  useEffect(() => {
    const savedContent = localStorage.getItem('homepageContent');
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent);
        setHeroContent({
          heroTitle: parsedContent.heroTitle || heroContent.heroTitle,
          heroSubtitle: parsedContent.heroSubtitle || heroContent.heroSubtitle,
          heroImage: parsedContent.heroImage || heroContent.heroImage,
          patentsCount: parsedContent.patentsCount || heroContent.patentsCount,
          partnersCount: parsedContent.partnersCount || heroContent.partnersCount,
          technologiesCount: parsedContent.technologiesCount || heroContent.technologiesCount
        });
      } catch (error) {
        console.error('Failed to load saved homepage content:', error);
      }
    }
  }, []);

  // Listen for localStorage changes (when admin updates content)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedContent = localStorage.getItem('homepageContent');
      if (savedContent) {
        try {
          const parsedContent = JSON.parse(savedContent);
          setHeroContent({
            heroTitle: parsedContent.heroTitle || heroContent.heroTitle,
            heroSubtitle: parsedContent.heroSubtitle || heroContent.heroSubtitle,
            heroImage: parsedContent.heroImage || heroContent.heroImage,
            patentsCount: parsedContent.patentsCount || heroContent.patentsCount,
            partnersCount: parsedContent.partnersCount || heroContent.partnersCount,
            technologiesCount: parsedContent.technologiesCount || heroContent.technologiesCount
          });
        } catch (error) {
          console.error('Failed to load saved homepage content:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [heroContent.heroTitle, heroContent.heroSubtitle, heroContent.patentsCount, heroContent.partnersCount, heroContent.technologiesCount]);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroContent.heroImage || heroImage})` }}
      >
        <div className="absolute inset-0 bg-primary/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-roboto font-bold text-white mb-6">
            {heroContent.heroTitle.split(' ').map((word, index) => {
              if (word.toLowerCase() === 'innovation') {
                return <span key={index} className="text-secondary">{word} </span>;
              }
              return word + ' ';
            })}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            {heroContent.heroSubtitle}
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
            <div className="text-3xl font-roboto font-bold text-white mb-2">{heroContent.patentsCount}+</div>
            <div className="text-white/90">Patents Granted</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-center mb-4">
              <Users className="text-secondary" size={40} />
            </div>
            <div className="text-3xl font-roboto font-bold text-white mb-2">{heroContent.partnersCount}+</div>
            <div className="text-white/90">Industry Partners</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-center mb-4">
              <Lightbulb className="text-secondary" size={40} />
            </div>
            <div className="text-3xl font-roboto font-bold text-white mb-2">{heroContent.technologiesCount}+</div>
            <div className="text-white/90">Technologies Developed</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;