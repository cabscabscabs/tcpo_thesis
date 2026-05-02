import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Shield,
  Handshake,
  BookOpen,
  Rocket,
  ArrowRight,
  Wrench,
  Lightbulb,
  Users,
  Building,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import servicesImage from "@/assets/services-bg.jpg";


// Icon mapping kept in sync with src/pages/Services.tsx
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  Shield,
  Handshake,
  BookOpen,
  Rocket,
  Wrench,
  Lightbulb,
  Users,
  Building,
  FileText,
};

interface OverviewService {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
}

const ServicesOverview = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<OverviewService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("id, name, slug, description, icon, features, order_num, published")
          .eq("published", true)
          .order("order_num", { ascending: true });

        if (!error && data) {
          setServices(
            data.map((s: any) => ({
              id: s.id,
              name: s.name,
              slug: s.slug || "",
              description: s.description || "",
              icon: s.icon || "Wrench",
              features: Array.isArray(s.features) ? s.features : [],
            }))
          );
        }
      } catch (err) {
        console.error("Error loading services overview:", err);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const handleRequestService = () => {
    navigate("/services");
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Services Content */}
          <div>
            <div className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-secondary uppercase mb-2">
              What We Do
            </div>
            <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-3">
              Our Services
            </h2>
            <div className="w-16 h-0.5 bg-secondary mb-5"></div>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              From ideation to commercialization, USTP TPCO provides comprehensive support
              for researchers, inventors, and industry partners in Northern Mindanao.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {loading ? (
                [1, 2, 3, 4].map((i) => (
                  <Card key={i} className="border-l-4 border-l-secondary">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3 mb-2">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <Skeleton className="h-5 w-40" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-3/4" />
                    </CardContent>
                  </Card>
                ))
              ) : services.length === 0 ? (
                <div className="col-span-2 text-center text-gray-500 py-8">
                  <p>No services available at the moment.</p>
                </div>
              ) : (
                services.map((service) => {
                  const IconComponent = iconMap[service.icon] || Wrench;
                  // Keep card compact: show up to 4 features on the homepage
                  const previewFeatures = service.features.slice(0, 4);
                  return (
                    <Card
                      key={service.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`Request service: ${service.name}`}
                      onClick={() => {
                        if (service.slug) {
                          navigate(`/service-request?service=${service.slug}`);
                        } else {
                          navigate("/services");
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          if (service.slug) {
                            navigate(`/service-request?service=${service.slug}`);
                          } else {
                            navigate("/services");
                          }
                        }
                      }}
                      className="group cursor-pointer hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 border-l-4 border-l-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="p-2 bg-secondary/10 rounded-lg">
                            <IconComponent className="text-primary" size={24} />
                          </div>
                          <CardTitle className="text-lg font-roboto text-primary group-hover:text-primary transition-colors">
                            {service.name}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-gray-600">
                          {service.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <ul className="space-y-1 text-sm text-gray-500">
                          {previewFeatures.map((feature, idx) => (
                            <li key={idx} className="flex items-center">
                              <div className="w-1 h-1 bg-secondary rounded-full mr-2"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="gold" size="lg" className="group" onClick={handleRequestService}>
                Request Service
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Services Image */}
          <div className="relative">
            <div
              className="rounded-lg shadow-lg h-96 bg-cover bg-center bg"
              style={{ backgroundImage: `url(${servicesImage})` }}
            >
              {/* Dimming overlay */}
              <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
              <div className="absolute inset-0 bg-gradient-ustp/70 rounded-lg flex items-center justify-center">
                <div className="text-center font-bold text-white p-15">
                  <h3 className="text-3xl font-roboto font-bold mb-4">
                    4-Step Process
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-primary font-bold">1</div>
                      <span>Initial Consultation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-primary font-bold">2</div>
                      <span>Documentation & Filing</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-primary font-bold">3</div>
                      <span>Review & Processing</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-primary font-bold">4</div>
                      <span>Commercialization</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
