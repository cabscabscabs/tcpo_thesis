import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IPApplication, ApplicationStatus } from "@/types/ipApplication";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Award
} from "lucide-react";

interface StatsCardsProps {
  applications: IPApplication[];
}

export function StatsCards({ applications }: StatsCardsProps) {
  const stats = {
    total: applications.length,
    drafts: applications.filter(a => a.status === 'Draft').length,
    pending: applications.filter(a => 
      ['Submitted for Internal Review', 'Under Internal Review', 'Needs Revision'].includes(a.status)
    ).length,
    approved: applications.filter(a => a.status === 'Approved for IPOPHL Filing').length,
    filed: applications.filter(a => 
      ['Filed to IPOPHL', 'Under IPOPHL Examination'].includes(a.status)
    ).length,
    granted: applications.filter(a => a.status === 'Granted').length,
  };

  const cards = [
    {
      title: "Total Applications",
      value: stats.total,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Drafts",
      value: stats.drafts,
      icon: Clock,
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    },
    {
      title: "Pending Review",
      value: stats.pending,
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Filed to IPOPHL",
      value: stats.filed,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Granted",
      value: stats.granted,
      icon: Award,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
