import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { IPTypeBadge } from "./IPTypeBadge";
import { IPApplication, IPType, ApplicationStatus } from "@/types/ipApplication";
import { Search, FileText, Eye, Edit, Calendar, Filter, Archive, ArchiveRestore, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ApplicationTableProps {
  applications: IPApplication[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onArchive?: (id: string) => Promise<void>;
  onRestore?: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  activeTab?: string;
}

export function ApplicationTable({ applications, isLoading = false, onRefresh, onArchive, onRestore, onDelete, activeTab = 'all' }: ApplicationTableProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<IPType | "all">("all");
  const [confirmDialog, setConfirmDialog] = useState<{open: boolean; type: 'archive' | 'restore' | 'delete'; app: IPApplication | null}>({open: false, type: 'archive', app: null});
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.application_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesType = typeFilter === "all" || app.ip_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const canEdit = (status: ApplicationStatus) => {
    return status === "Draft" || status === "Needs Revision";
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.app) return;
    setIsProcessing(true);
    try {
      if (confirmDialog.type === 'archive' && onArchive) {
        await onArchive(confirmDialog.app.id);
      } else if (confirmDialog.type === 'restore' && onRestore) {
        await onRestore(confirmDialog.app.id);
      } else if (confirmDialog.type === 'delete' && onDelete) {
        await onDelete(confirmDialog.app.id);
      }
    } finally {
      setIsProcessing(false);
      setConfirmDialog({open: false, type: 'archive', app: null});
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-100 animate-pulse rounded" />
        <div className="h-64 bg-gray-100 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm m-[5px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title or application number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ApplicationStatus | "all")}>
            <SelectTrigger className="w-[180px] m-[5px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Submitted for Internal Review">Submitted</SelectItem>
              <SelectItem value="Under Internal Review">Under Review</SelectItem>
              <SelectItem value="Needs Revision">Needs Revision</SelectItem>
              <SelectItem value="Approved for IPOPHL Filing">Approved</SelectItem>
              <SelectItem value="Filed to IPOPHL">Filed to IPOPHL</SelectItem>
              <SelectItem value="Under IPOPHL Examination">Under Examination</SelectItem>
              <SelectItem value="Granted">Granted</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as IPType | "all")}>
            <SelectTrigger className="w-[180px] m-[5px]">
              <FileText className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Patent">Patent</SelectItem>
              <SelectItem value="Utility Model">Utility Model</SelectItem>
              <SelectItem value="Industrial Design">Industrial Design</SelectItem>
              <SelectItem value="Copyright">Copyright</SelectItem>
              <SelectItem value="Trademark">Trademark</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 m-[5px]">
          <Badge variant="outline" className="font-normal">
            {filteredApplications.length} applications
          </Badge>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Application No.</TableHead>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Submitted</TableHead>
              <TableHead className="font-semibold">Updated</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-lg font-medium">No applications found</p>
                  <p className="text-sm">Get started by creating a new IP application</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredApplications.map((application) => (
                <TableRow key={application.id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm">
                    {application.application_number}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium max-w-xs truncate" title={application.title}>
                      {application.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <IPTypeBadge type={application.ip_type} showIcon={false} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={application.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      {application.submitted_at 
                        ? format(new Date(application.submitted_at), 'MMM d, yyyy')
                        : 'Not submitted'
                      }
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {format(new Date(application.updated_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/faculty/applications/${application.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {canEdit(application.status) && !application.is_archived && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/faculty/applications/${application.id}/edit`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                      {!application.is_archived ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConfirmDialog({open: true, type: 'archive', app: application})}
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          title="Archive"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmDialog({open: true, type: 'restore', app: application})}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            title="Restore"
                          >
                            <ArchiveRestore className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmDialog({open: true, type: 'delete', app: application})}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Delete permanently"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({...prev, open}))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.type === 'archive' && 'Archive Application'}
              {confirmDialog.type === 'restore' && 'Restore Application'}
              {confirmDialog.type === 'delete' && 'Delete Application Permanently'}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.type === 'archive' && `Are you sure you want to archive "${confirmDialog.app?.title || 'this application'}"? It will be moved to the Archived tab and hidden from your active list.`}
              {confirmDialog.type === 'restore' && `Are you sure you want to restore "${confirmDialog.app?.title || 'this application'}" back to your active applications?`}
              {confirmDialog.type === 'delete' && `Are you sure you want to permanently delete "${confirmDialog.app?.title || 'this application'}"? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({open: false, type: 'archive', app: null})} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              variant={confirmDialog.type === 'delete' ? 'destructive' : 'default'}
              onClick={handleConfirmAction}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : (
                confirmDialog.type === 'archive' ? 'Archive' :
                confirmDialog.type === 'restore' ? 'Restore' : 'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
