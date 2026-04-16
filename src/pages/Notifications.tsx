import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Bell, 
  Check, 
  Trash2, 
  Filter,
  Search,
  ChevronLeft,
  FileText,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Info,
  RefreshCw,
  Eye
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'status_change' | 'comment' | 'revision_required' | 'approval' | 'general' | 'system';
  is_read: boolean;
  created_at: string;
  application_id?: string;
  application_number?: string;
  link?: string;
}

export default function Notifications() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [readFilter, setReadFilter] = useState<string>("all");
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    loadNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, searchQuery, typeFilter, readFilter]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
      return;
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      setUserRole(profile.role);
    }
  };

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/notifications');
      // const data = await response.json();

      // Mock data for demonstration
      const mockNotifications: Notification[] = [
        {
          id: "1",
          title: "Application Approved for IPOPHL Filing",
          message: "Your patent application 'Smart Agriculture Monitoring System' has been approved for IPOPHL filing. Please prepare the required documents for official submission.",
          type: "approval",
          is_read: false,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          application_id: "app-1",
          application_number: "IP-2026-00001"
        },
        {
          id: "2",
          title: "Revision Required",
          message: "Please update the claims section of your utility model application. The independent claims need more specific technical details.",
          type: "revision_required",
          is_read: false,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          application_id: "app-2",
          application_number: "IP-2026-00002"
        },
        {
          id: "3",
          title: "Status Update: Under IPOPHL Examination",
          message: "Your patent application IP-2025-00045 has moved to the substantive examination phase at IPOPHL.",
          type: "status_change",
          is_read: true,
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          application_id: "app-3",
          application_number: "IP-2025-00045"
        },
        {
          id: "4",
          title: "New Comment from Reviewer",
          message: "Dr. Ana Lim has commented on your copyright application. Please review the feedback.",
          type: "comment",
          is_read: false,
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          application_id: "app-4",
          application_number: "IP-2026-00005"
        },
        {
          id: "5",
          title: "Welcome to IP Filing System",
          message: "Start submitting your IP applications through our new faculty portal. Check out the guide for first-time users.",
          type: "general",
          is_read: true,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "6",
          title: "System Maintenance Scheduled",
          message: "The IP Filing System will undergo maintenance on April 20, 2026, from 2:00 AM to 4:00 AM (PHT).",
          type: "system",
          is_read: true,
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "7",
          title: "Patent Granted!",
          message: "Congratulations! Your patent application 'Renewable Energy Harvesting Device' has been granted by IPOPHL.",
          type: "approval",
          is_read: false,
          created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          application_id: "app-5",
          application_number: "IP-2024-00012"
        },
        {
          id: "8",
          title: "Formality Examination Complete",
          message: "The formality examination for your industrial design application has been completed. No issues found.",
          type: "status_change",
          is_read: true,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          application_id: "app-6",
          application_number: "IP-2026-00008"
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notifications.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterNotifications = () => {
    let filtered = [...notifications];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query) ||
        n.application_number?.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(n => n.type === typeFilter);
    }

    // Read status filter
    if (readFilter === "read") {
      filtered = filtered.filter(n => n.is_read);
    } else if (readFilter === "unread") {
      filtered = filtered.filter(n => !n.is_read);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setFilteredNotifications(filtered);
  };

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );

    // TODO: API call to mark as read
    // await fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' });
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setSelectedNotifications(new Set());

    toast({
      title: "Success",
      description: "All notifications marked as read."
    });

    // TODO: API call to mark all as read
  };

  const deleteNotification = async (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      newSet.delete(notificationId);
      return newSet;
    });

    toast({
      title: "Deleted",
      description: "Notification removed."
    });

    // TODO: API call to delete
  };

  const deleteSelected = async () => {
    setNotifications(prev => prev.filter(n => !selectedNotifications.has(n.id)));
    setSelectedNotifications(new Set());

    toast({
      title: "Deleted",
      description: `${selectedNotifications.size} notifications removed.`
    });
  };

  const toggleSelection = (notificationId: string) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)));
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    if (notification.application_id) {
      const basePath = userRole === 'faculty' ? '/faculty' : '/admin';
      navigate(`${basePath}/applications/${notification.application_id}`);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'status_change':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'revision_required':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'approval':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'system':
        return <Info className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'status_change':
        return 'bg-blue-50 border-blue-200';
      case 'comment':
        return 'bg-purple-50 border-purple-200';
      case 'revision_required':
        return 'bg-orange-50 border-orange-200';
      case 'approval':
        return 'bg-green-50 border-green-200';
      case 'system':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(userRole === 'faculty' ? '/faculty' : '/admin')}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-500">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadNotifications}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark all read
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-3">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="status_change">Status Change</SelectItem>
                    <SelectItem value="comment">Comment</SelectItem>
                    <SelectItem value="revision_required">Revision Required</SelectItem>
                    <SelectItem value="approval">Approval</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={readFilter} onValueChange={setReadFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Eye className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedNotifications.size > 0 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <span className="text-sm text-gray-600">
                  {selectedNotifications.size} selected
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      selectedNotifications.forEach(id => markAsRead(id));
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark as read
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={deleteSelected}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              All Notifications
              <Badge variant="secondary" className="ml-2">
                {filteredNotifications.length}
              </Badge>
            </CardTitle>
            {filteredNotifications.length > 0 && (
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedNotifications.size === filteredNotifications.length && filteredNotifications.length > 0}
                  onCheckedChange={selectAll}
                />
                <span className="text-sm text-gray-600">Select all</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <Bell className="h-16 w-16 mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No notifications found</p>
                  <p className="text-sm">
                    {searchQuery || typeFilter !== "all" || readFilter !== "all"
                      ? "Try adjusting your filters"
                      : "You're all caught up!"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`relative p-4 border rounded-lg transition-all ${
                        notification.is_read 
                          ? 'bg-white border-gray-200' 
                          : `${getNotificationColor(notification.type)} border-l-4`
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedNotifications.has(notification.id)}
                          onCheckedChange={() => toggleSelection(notification.id)}
                          className="mt-1"
                        />
                        
                        <div 
                          className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className={`font-semibold ${
                                notification.is_read ? 'text-gray-700' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </h3>
                              {notification.application_number && (
                                <Badge variant="outline" className="mt-1 mb-2">
                                  {notification.application_number}
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          
                          <p className={`text-sm mt-1 ${
                            notification.is_read ? 'text-gray-500' : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-gray-400">
                              {format(new Date(notification.created_at), 'MMM d, yyyy HH:mm')}
                            </span>
                            
                            <div className="flex items-center gap-2">
                              {!notification.is_read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Mark read
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {!notification.is_read && (
                          <span className="absolute top-4 right-4 h-2 w-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
