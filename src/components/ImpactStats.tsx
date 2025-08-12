import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Award, Building, Users, Lightbulb, DollarSign } from "lucide-react";

const ImpactStats = () => {
  const stats = [
    {
      icon: Award,
      value: "24",
      label: "Patents Granted",
      trend: "+6 this year",
      color: "text-green-600"
    },
    {
      icon: Building,
      value: "12",
      label: "Startups Incubated",
      trend: "+4 this year", 
      color: "text-blue-600"
    },
    {
      icon: Users,
      value: "50+",
      label: "Industry Partners",
      trend: "+15 this year",
      color: "text-purple-600"
    },
    {
      icon: Lightbulb,
      value: "100+",
      label: "Technologies Developed",
      trend: "+25 this year",
      color: "text-primary"
    },
    {
      icon: DollarSign,
      value: "₱15M",
      label: "Regional Economic Impact",
      trend: "+₱5M this year",
      color: "text-green-600"
    },
    {
      icon: TrendingUp,
      value: "85%",
      label: "Success Rate",
      trend: "Industry partnerships",
      color: "text-primary"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-roboto font-bold text-primary mb-4">
            Our Impact
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Driving innovation and economic growth in Northern Mindanao through technology 
            transfer and strategic partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="group hover:shadow-card transition-all duration-300 hover:-translate-y-1">
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