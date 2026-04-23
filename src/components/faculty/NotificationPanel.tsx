import { useState, useEffect } from "react";
import { FacultyNotification } from "@/types/ipApplication";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Check, 
  FileText, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle,
  Info,
  X,
  RefreshCw
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface NotificationPanelProps {
  facultyId: string;
  darkMode?: boolean;
}

export function NotificationPanel({ facultyId, darkMode = false }: NotificationPanelProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<FacultyNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load notifications from Supabase
  const loadNotifications = async () => {
    if (!facultyId) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('faculty_notifications')
        .select('*')
        .eq('faculty_id', facultyId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error loading notifications:', error);
        return;
      }

      if (data) {
        const mapped: FacultyNotification[] = data.map((n: any) => ({
          id: n.id,
          faculty_id: n.faculty_id,
          application_id: n.application_id,
          title: n.title,
          message: n.message,
          type: mapNotificationType(n.notification_type),
          is_read: n.is_read ?? false,
          created_at: n.created_at
        }));
        setNotifications(mapped);
        setUnreadCount(mapped.filter(n => !n.is_read).length);
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Map database notification_type to frontend type
  const mapNotificationType = (dbType: string): FacultyNotification['type'] => {
    const typeMap: Record<string, FacultyNotification['type']> = {
      'approval': 'approval',
      'revision_required': 'revision_required',
      'status_change': 'status_change',
      'comment': 'comment',
      'rejection': 'revision_required',
      'admin_message': 'general',
      'admin_broadcast': 'general',
      'general': 'general'
    };
    return typeMap[dbType] || 'general';
  };

  // Load on mount and set up real-time subscription
  useEffect(() => {
    loadNotifications();

    // Real-time subscription for new notifications
    const channel = supabase
      .channel('faculty-notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'faculty_notifications',
          filter: `faculty_id=eq.${facultyId}`
        },
        (payload) => {
          const newNotif = payload.new as any;
          const mapped: FacultyNotification = {
            id: newNotif.id,
            faculty_id: newNotif.faculty_id,
            application_id: newNotif.application_id,
            title: newNotif.title,
            message: newNotif.message,
            type: mapNotificationType(newNotif.notification_type),
            is_read: newNotif.is_read ?? false,
            created_at: newNotif.created_at
          };
          setNotifications(prev => [mapped, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [facultyId]);

  const markAsRead = async (notificationId: string) => {
    // Optimistic update
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    // Update in database
    try {
      await supabase
        .from('faculty_notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);

    // Update in database
    try {
      await supabase
        .from('faculty_notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('faculty_id', facultyId)
        .eq('is_read', false);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleNotificationClick = (notification: FacultyNotification) => {
    markAsRead(notification.id);
    if (notification.application_id) {
      navigate(`/faculty/applications/${notification.application_id}`);
    }
    setIsOpen(false);
  };

  const getNotificationIcon = (type: FacultyNotification['type']) => {
    switch (type) {
      case 'status_change':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'revision_required':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'approval':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: FacultyNotification['type']) => {
    switch (type) {
      case 'status_change':
        return 'bg-blue-50 border-blue-200';
      case 'comment':
        return 'bg-purple-50 border-purple-200';
      case 'revision_required':
        return 'bg-orange-50 border-orange-200';
      case 'approval':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className={`relative ${darkMode ? 'text-white hover:bg-white/10' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border z-50">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="bg-red-100 text-red-700">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={loadNotifications}
                  title="Refresh"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={markAllAsRead}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark all
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="h-96">
              {isLoading && notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                  <RefreshCw className="h-8 w-8 mb-2 animate-spin text-gray-300" />
                  <p>Loading...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                  <Bell className="h-12 w-12 mb-2 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        !notification.is_read ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`font-medium text-sm ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </p>
                            {!notification.is_read && (
                              <span className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="p-3 border-t bg-gray-50">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full"
                onClick={() => {
                  navigate('/notifications');
                  setIsOpen(false);
                }}
              >
                View all notifications
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
