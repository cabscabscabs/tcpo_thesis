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
  
  const colorMap: Record<IPType, string> = {
    'Patent': 'bg-blue-100 text-blue-700',
    'Utility Model': 'bg-green-100 text-green-700',
    'Industrial Design': 'bg-purple-100 text-purple-700',
    'Copyright': 'bg-amber-100 text-amber-700',
    'Trademark': 'bg-pink-100 text-pink-700'
  };
  
  return (
    <Badge 
      variant="secondary" 
      className={`${colorMap[type]} border-0 font-medium flex items-center gap-1 ${className}`}
    >
      {showIcon && Icon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}
