import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Award, Users, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ImpactStat {
  icon: any;
  value: string;
  label: string;
  trend: string;
  color: string;
  link?: string;
}

const ImpactStats = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<ImpactStat[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      // Patents Granted is derived live from admin_patents so this stat
      // mirrors the IP Portfolio "Total Patents in Portfolio" banner
      // (published=true, status != 'Draft'). Partners and Technologies
      // still come from the admin-editable homepage content row.
      let livePatentsCount: number | null = null;
      try {
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

        const { data, error } = await supabase
          .from('admin_homepage_content')
          .select('patents_count, partners_count, technologies_count')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (data && !error) {
          const content = data as any;
          const patentsDisplay =
            livePatentsCount !== null ? livePatentsCount : content.patents_count;
          setStats([
            {
              icon: Award,
              value: `${patentsDisplay}+`,
              label: "Patents Granted",
              trend: "+6 this year",
              color: "text-green-600",
              link: "/ip-portfolio"
            },
            {
              icon: Users,
              value: `${content.partners_count}+`,
              label: "Industry Partners",
              trend: "+15 this year",
              color: "text-purple-600",
              link: "/about#strategic-partners"
            },
            {
              icon: Lightbulb,
              value: `${content.technologies_count}+`,
              label: "Technologies Developed",
              trend: "+25 this year",
              color: "text-primary",
              link: "/ip-portfolio"
            }
          ]);
          return;
        }
      } catch (err) {
        console.error('Error fetching impact stats:', err);
      }

      // Fallback to defaults if fetch fails
      setStats([
        { icon: Award, value: `${livePatentsCount !== null ? livePatentsCount : 0}+`, label: "Patents Granted", trend: "+6 this year", color: "text-green-600", link: "/ip-portfolio" },
        { icon: Users, value: "6+", label: "Industry Partners", trend: "+15 this year", color: "text-purple-600", link: "/about#strategic-partners" },
        { icon: Lightbulb, value: "8+", label: "Technologies Developed", trend: "+25 this year", color: "text-primary", link: "/ip-portfolio" }
      ]);
    };

    fetchStats();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-secondary uppercase mb-2">
            By the Numbers
          </div>
          <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-3">
            Our Impact
          </h2>
          <div className="w-16 h-0.5 bg-secondary mx-auto mb-5"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Driving innovation and economic growth in Northern Mindanao through technology
            transfer and strategic partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`group hover:shadow-card transition-all duration-300 hover:-translate-y-1 ${stat.link ? "cursor-pointer" : ""}`}
              onClick={() => {
                if (stat.link) {
                  const [path, hash] = stat.link.split("#");
                  navigate(path + (hash ? `#${hash}` : ""));
                  if (hash) {
                    setTimeout(() => {
                      const el = document.getElementById(hash);
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }, 300);
                  }
                }
              }}
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-secondary/10 rounded-full">
                    <stat.icon className="text-secondary" size={32} />
                  </div>
                </div>
                
                <div className="text-3xl font-roboto font-bold text-primary mb-2">
                  {stat.value}
                </div>
                
                <div className="text-gray-600 mb-2 font-medium">
                  {stat.label}
                </div>
                
                <div className={`text-sm ${stat.color} flex items-center justify-center space-x-1`}>
                  <TrendingUp size={14} />
                  <span>{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;