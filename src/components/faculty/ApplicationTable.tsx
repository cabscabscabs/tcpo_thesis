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
import { Search, FileText, Eye, Edit, Calendar, Filter } from "lucide-react";
import { format } from "date-fns";

interface ApplicationTableProps {
  applications: IPApplication[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function ApplicationTable({ applications, isLoading = false, onRefresh }: ApplicationTableProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<IPType | "all">("all");

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
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title or application number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ApplicationStatus | "all")}>
            <SelectTrigger className="w-[180px]">
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
            <SelectTrigger className="w-[180px]">
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

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-normal">
            {filteredApplications.length} applications
          </Badge>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
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
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/faculty/applications/${application.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {canEdit(application.status) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/faculty/applications/${application.id}/edit`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
