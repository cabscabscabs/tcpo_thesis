import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Status color mapping
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'Published': 'bg-green-100 text-green-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'granted': 'bg-green-100 text-green-800',
    'Granted': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'under review': 'bg-blue-100 text-blue-800',
    'Under Review': 'bg-blue-100 text-blue-800',
    'licensed': 'bg-purple-100 text-purple-800',
    'Licensed': 'bg-purple-100 text-purple-800',
    'default': 'bg-gray-100 text-gray-800'
  };
  
  return statusColors[status] || statusColors['default'];
}

// Field color mapping
export function getFieldColor(field: string): string {
  const fieldColors: Record<string, string> = {
    'Agriculture': 'bg-emerald-100 text-emerald-800',
    'agriculture': 'bg-emerald-100 text-emerald-800',
    'Materials Science': 'bg-amber-100 text-amber-800',
    'materials': 'bg-amber-100 text-amber-800',
    'Food Technology': 'bg-orange-100 text-orange-800',
    'food': 'bg-orange-100 text-orange-800',
    'Environmental Technology': 'bg-teal-100 text-teal-800',
    'environmental': 'bg-teal-100 text-teal-800',
    'Energy Technology': 'bg-red-100 text-red-800',
    'energy': 'bg-red-100 text-red-800',
    'Aquaculture Technology': 'bg-cyan-100 text-cyan-800',
    'aquaculture': 'bg-cyan-100 text-cyan-800',
    'default': 'bg-blue-100 text-blue-800'
  };
  
  return fieldColors[field] || fieldColors['default'];
}