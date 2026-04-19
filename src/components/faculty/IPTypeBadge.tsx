import { Badge } from "@/components/ui/badge";
import { IPType, ipTypeConfig } from "@/types/ipApplication";
import { FileText, Settings, Palette, BookOpen, Tag } from "lucide-react";

interface IPTypeBadgeProps {
  type: IPType;
  showIcon?: boolean;
  className?: string;
}

const iconMap = {
  'Patent': FileText,
  'Utility Model': Settings,
  'Industrial Design': Palette,
  'Copyright': BookOpen,
  'Trademark': Tag
};

export function IPTypeBadge({ type, showIcon = true, className = "" }: IPTypeBadgeProps) {
  const config = ipTypeConfig[type];
  const Icon = iconMap[type];
  
  // Neutral styling - no color highlight
  const neutralStyle = 'bg-gray-100 text-gray-700';
  
  return (
    <Badge 
      variant="secondary" 
      className={`${neutralStyle} border-0 font-medium flex items-center gap-1 ${className}`}
    >
      {showIcon && Icon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}
