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

// Format date to show exact date and time
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  // Format as "Month Day, Year at HH:MM AM/PM"
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

// Format date to show relative time (e.g., "5 hours ago", "2 days ago")
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
}