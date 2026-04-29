import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Users, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import { supabase } from "@/integrations/supabase/client";

const Hero = () => {
  const navigate = useNavigate();
  const [heroContent, setHeroContent] = useState({
    heroTitle: "Accelerating Innovation Through Technology Transfer",
    heroSubtitle: "USTP Technology Promotions and Commercialization Office — your gateway to cutting-edge research, intellectual property protection, and industry collaboration in Northern Mindanao.",
    heroImage: null as string | null,
    patentsCount: 0,
    partnersCount: 50,
    technologiesCount: 8
  });

  // Load saved homepage content from Supabase
  useEffect(() => {
    const loadHomepageContent = async () => {
      try {
        // 1) Fetch hero copy + non-patent counters from admin_homepage_content.
        const { data, error } = await supabase
          .from('admin_homepage_content' as any)
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        // 2) Patents Granted is now derived live from admin_patents so the
        //    homepage stays in sync with the IP Portfolio "Total Patents in
        //    Portfolio" banner (published=true, status != 'Draft').
        let livePatentsCount: number | null = null;
        try {
          const { count } = await supabase
            .from('admin_patents' as any)
            .select('*', { count: 'exact', head: true })
            .eq('published', true)
            .neq('status', 'Draft');
          if (typeof count === 'number') {
            livePatentsCount = count;
          }
        } catch (patentErr) {
          console.error('Failed to derive live patents count:', patentErr);
        }

        if (data && !error) {
          const content = data as any;
          setHeroContent({
            heroTitle: content.hero_title || heroContent.heroTitle,
            heroSubtitle: content.hero_subtitle || heroContent.heroSubtitle,
            heroImage: content.hero_image_url || heroContent.heroImage,
            patentsCount:
              livePatentsCount !== null
                ? livePatentsCount
                : content.patents_count || heroContent.patentsCount,
            partnersCount: content.partners_count || heroContent.partnersCount,
            technologiesCount: content.technologies_count || heroContent.technologiesCount
          });
        } else if (livePatentsCount !== null) {
          // No homepage-content row yet; still reflect the live patent count.
          setHeroContent((prev) => ({ ...prev, patentsCount: livePatentsCount as number }));
        }
      } catch (error) {
        console.error('Failed to load homepage content:', error);
      }
    };
    
    loadHomepageContent();
  }, []);
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
          <div className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-secondary uppercase mb-4">
            USTP · Technology Promotions &amp; Commercialization Office
          </div>
          <h1 className="text-4xl md:text-6xl font-roboto font-bold text-white mb-6">
            {heroContent.heroTitle.split(' ').map((word, index) => {
              if (word.toLowerCase() === 'innovation') {
                return <span key={index} className="text-secondary">{word} </span>;
              }
              return word + ' ';
            })}
          </h1>
          <div className="w-20 h-0.5 bg-secondary mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            {heroContent.heroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="gold" size="xl" className="group" onClick={() => navigate('/ip-portfolio')}>
              Explore Our IP Portfolio
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="gold-outline" size="xl" onClick={() => navigate('/contact')}>
              Partner With Us
            </Button>
          </div>
        </div>

        {/* Stats Counter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div
            className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
            onClick={() => {
              navigate('/ip-portfolio');
            }}
          >
            <div className="flex items-center justify-center mb-4">
              <Award className="text-secondary" size={40} />
            </div>
            <div className="text-3xl font-roboto font-bold text-white mb-2">{heroContent.patentsCount}+</div>
            <div className="text-white/90">Patents Granted</div>
          </div>
          
          <div
            className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
            onClick={() => {
              navigate('/about');
              setTimeout(() => {
                const el = document.getElementById('strategic-partners');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }, 300);
            }}
          >
            <div className="flex items-center justify-center mb-4">
              <Users className="text-secondary" size={40} />
            </div>
            <div className="text-3xl font-roboto font-bold text-white mb-2">{heroContent.partnersCount}+</div>
            <div className="text-white/90">Industry Partners</div>
          </div>
          
          <div
            className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
            onClick={() => {
              navigate('/ip-portfolio');
            }}
          >
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