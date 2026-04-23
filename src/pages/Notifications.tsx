import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Bell, 
  Check, 
  Filter,
  Search,
  ChevronLeft,
  FileText,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Info,
  RefreshCw,
  Eye,
  ArrowUpRight,
  Trash2,
  X
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  application_id?: string;
}

export default function Notifications() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [readFilter, setReadFilter] = useState<string>("all");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (userRole) loadNotifications();
  }, [userRole]);

  useEffect(() => {
    filterNotifications();
  }, [notifications, searchQuery, typeFilter, readFilter]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
      return;
    }
    setUserId(session.user.id);

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
      if (userRole === 'faculty') {
        // Load from faculty_notifications
        const { data, error } = await supabase
          .from('faculty_notifications')
          .select('*')
          .eq('faculty_id', userId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        const mapped: NotificationItem[] = (data || []).map((n: any) => ({
          id: n.id,
          title: n.title || '',
          message: n.message || '',
          type: n.notification_type || 'general',
          is_read: n.is_read ?? false,
          created_at: n.created_at,
          application_id: n.application_id
        }));
        setNotifications(mapped);
      } else {
        // Admin: load from activity_logs
        const { data, error } = await supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        const mapped: NotificationItem[] = (data || []).map((n: any) => ({
          id: n.id,
          title: n.title || '',
          message: n.description || '',
          type: n.activity_type || 'general',
          is_read: false, // Will be set below
          created_at: n.created_at,
          application_id: n.application_id
        }));

        // Check which admin notifications are read via per-ID localStorage
        const readIds = getAdminReadIds();
        const deletedIds = getAdminDeletedIds();
        for (const n of mapped) {
          if (readIds.has(n.id)) {
            n.is_read = true;
          }
        }
        // Filter out deleted admin notifications
        const visible = mapped.filter(n => !deletedIds.has(n.id));
        setNotifications(visible);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast({ title: "Error", description: "Failed to load notifications.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeDisplayName = (type: string): string => {
    switch (type) {
      case 'status_change': return 'Status Change';
      case 'comment': return 'Comment';
      case 'revision_required': return 'Revision Required';
      case 'approval': return 'Approval';
      case 'ip_application': return 'IP Application';
      case 'system': return 'System';
      case 'news': return 'News';
      case 'technology': return 'Technology';
      case 'service': return 'Service';
      case 'event': return 'Event';
      case 'general': return 'General';
      default: return type;
    }
  };

  const filterNotifications = () => {
    let filtered = [...notifications];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n => {
        const titleMatch = n.title.toLowerCase().includes(query);
        const messageMatch = n.message.toLowerCase().includes(query);
        const typeMatch = getTypeDisplayName(n.type).toLowerCase().includes(query);
        const dateStr = format(new Date(n.created_at), 'MMM d, yyyy HH:mm').toLowerCase();
        const dateMatch = dateStr.includes(query);
        const relativeDate = formatDistanceToNow(new Date(n.created_at)).toLowerCase();
        const relativeDateMatch = relativeDate.includes(query);
        return titleMatch || messageMatch || typeMatch || dateMatch || relativeDateMatch;
      });
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(n => n.type === typeFilter);
    }

    if (readFilter === "read") {
      filtered = filtered.filter(n => n.is_read);
    } else if (readFilter === "unread") {
      filtered = filtered.filter(n => !n.is_read);
    }

    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setFilteredNotifications(filtered);
  };

  // Helper: get/set admin read notification IDs in localStorage
  const getAdminReadIds = (): Set<string> => {
    try {
      const stored = localStorage.getItem('admin_read_notification_ids');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  };

  const saveAdminReadIds = (ids: Set<string>) => {
    localStorage.setItem('admin_read_notification_ids', JSON.stringify([...ids]));
  };

  const markAsRead = async (notificationId: string) => {
    // Optimistic update
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );

    // Persist
    try {
      if (userRole === 'faculty') {
        await supabase
          .from('faculty_notifications')
          .update({ is_read: true, read_at: new Date().toISOString() })
          .eq('id', notificationId);
      } else {
        // Admin: store individual read IDs in localStorage
        const readIds = getAdminReadIds();
        readIds.add(notificationId);
        saveAdminReadIds(readIds);
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

    try {
      if (userRole === 'faculty') {
        await supabase
          .from('faculty_notifications')
          .update({ is_read: true, read_at: new Date().toISOString() })
          .eq('faculty_id', userId)
          .eq('is_read', false);
      } else {
        // Admin: add all current notification IDs to read set
        const readIds = getAdminReadIds();
        for (const n of notifications) {
          readIds.add(n.id);
        }
        saveAdminReadIds(readIds);
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }

    toast({ title: "Success", description: "All notifications marked as read." });
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    markAsRead(notification.id);
    
    if (notification.application_id) {
      if (userRole === 'faculty') {
        navigate(`/faculty/applications/${notification.application_id}`);
      }
      // Admin users will go back to admin — the bell popover handles modal opening
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'status_change':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'revision_required':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'approval':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'ip_application':
        return <FileText className="h-5 w-5 text-cyan-500" />;
      case 'system':
        return <Info className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'status_change':
        return 'bg-blue-100 border-blue-400';
      case 'comment':
        return 'bg-purple-100 border-purple-400';
      case 'revision_required':
        return 'bg-orange-100 border-orange-400';
      case 'approval':
        return 'bg-green-100 border-green-400';
      case 'ip_application':
        return 'bg-cyan-100 border-cyan-400';
      case 'system':
        return 'bg-amber-100 border-amber-400';
      default:
        return 'bg-indigo-100 border-indigo-400';
    }
  };

  const deleteNotification = useCallback(async (notificationId: string) => {
    // Optimistic update
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(notificationId);
      return next;
    });

    try {
      if (userRole === 'faculty') {
        await supabase
          .from('faculty_notifications')
          .delete()
          .eq('id', notificationId);
      } else {
        // Admin: store deleted IDs in localStorage so they stay hidden
        const deletedIds = getAdminDeletedIds();
        deletedIds.add(notificationId);
        saveAdminDeletedIds(deletedIds);
        // Also remove from read set if present
        const readIds = getAdminReadIds();
        readIds.delete(notificationId);
        saveAdminReadIds(readIds);
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast({ title: "Error", description: "Failed to delete notification.", variant: "destructive" });
    }
  }, [userRole]);

  const deleteSelected = async () => {
    const idsToDelete = [...selectedIds];
    setNotifications(prev => prev.filter(n => !selectedIds.has(n.id)));
    setSelectedIds(new Set());
    setIsSelectMode(false);

    try {
      if (userRole === 'faculty') {
        await supabase
          .from('faculty_notifications')
          .delete()
          .in('id', idsToDelete);
      } else {
        const deletedIds = getAdminDeletedIds();
        for (const id of idsToDelete) {
          deletedIds.add(id);
        }
        saveAdminDeletedIds(deletedIds);
        const readIds = getAdminReadIds();
        for (const id of idsToDelete) {
          readIds.delete(id);
        }
        saveAdminReadIds(readIds);
      }
      toast({ title: "Deleted", description: `${idsToDelete.length} notification(s) deleted.` });
    } catch (err) {
      console.error('Error deleting selected notifications:', err);
      toast({ title: "Error", description: "Failed to delete some notifications.", variant: "destructive" });
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredNotifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredNotifications.map(n => n.id)));
    }
  };

  // Helper: get/set admin deleted notification IDs in localStorage
  const getAdminDeletedIds = (): Set<string> => {
    try {
      const stored = localStorage.getItem('admin_deleted_notification_ids');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  };

  const saveAdminDeletedIds = (ids: Set<string>) => {
    localStorage.setItem('admin_deleted_notification_ids', JSON.stringify([...ids]));
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gray-50">
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
              {isSelectMode ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSelectAll}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {selectedIds.size === filteredNotifications.length && filteredNotifications.length > 0 ? 'Deselect all' : 'Select all'}
                  </Button>
                  {selectedIds.size > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={deleteSelected}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete ({selectedIds.size})
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setIsSelectMode(false); setSelectedIds(new Set()); }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSelectMode(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Select
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title, message, type, or date..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-9"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="flex gap-3">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {userRole === 'admin' ? (
                      <>
                        <SelectItem value="ip_application">IP Application</SelectItem>
                        <SelectItem value="news">News</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="status_change">Status Change</SelectItem>
                        <SelectItem value="comment">Comment</SelectItem>
                        <SelectItem value="revision_required">Revision Required</SelectItem>
                        <SelectItem value="approval">Approval</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>

                <Select value={readFilter} onValueChange={setReadFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Eye className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              All Notifications
              {searchQuery && (
                <span className="text-sm font-normal text-gray-500">
                  — {filteredNotifications.length} result{filteredNotifications.length !== 1 ? 's' : ''} for "{searchQuery}"
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : filteredNotifications.length === 0 ? (
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
                        isSelectMode ? 'cursor-default' : 'cursor-pointer hover:shadow-sm'
                      } ${
                        notification.is_read 
                          ? 'bg-white border-gray-200' 
                          : `${getNotificationColor(notification.type)} border-l-4`
                      } ${
                        selectedIds.has(notification.id) ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                      }`}
                      onClick={() => {
                        if (isSelectMode) {
                          toggleSelect(notification.id);
                        } else {
                          handleNotificationClick(notification);
                        }
                      }}
                    >
                      <div className="flex items-start gap-4">
                        {isSelectMode && (
                          <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedIds.has(notification.id)}
                              onCheckedChange={() => toggleSelect(notification.id)}
                            />
                          </div>
                        )}
                        <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className={`font-semibold truncate ${
                                notification.is_read ? 'text-gray-700' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {notification.application_id && !isSelectMode && (
                                <ArrowUpRight className="h-4 w-4 text-gray-400" />
                              )}
                              <span className="text-xs text-gray-400 whitespace-nowrap">
                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                          
                          {notification.message && (
                            <p className={`text-sm mt-1 ${
                              notification.is_read ? 'text-gray-500' : 'text-gray-700'
                            }`}>
                              {notification.message}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-gray-400">
                              {format(new Date(notification.created_at), 'MMM d, yyyy HH:mm')}
                            </span>
                            
                            <div className="flex items-center gap-1">
                              {!notification.is_read && !isSelectMode && (
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
                              {!isSelectMode && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-400 hover:text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {!notification.is_read && !isSelectMode && (
                          <span className="absolute top-4 right-4 h-3 w-3 bg-blue-600 rounded-full ring-2 ring-blue-200" />
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
