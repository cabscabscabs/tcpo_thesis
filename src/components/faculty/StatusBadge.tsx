import { Badge } from "@/components/ui/badge";
import { ApplicationStatus, statusConfig } from "@/types/ipApplication";

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig['Draft'];
  
  return (
    <Badge 
      variant="secondary" 
      className={`${config.bgColor} ${config.color} border-0 font-medium ${className}`}
    >
      {config.label}
    </Badge>
  );
}
