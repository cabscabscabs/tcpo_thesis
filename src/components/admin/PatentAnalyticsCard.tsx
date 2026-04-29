import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  ArrowDownRight,
  Building2,
  Award,
  BarChart3,
  Activity,
  Download,
  FileDown,
} from "lucide-react";
import { useState, useMemo } from "react";
import { BrochurePieCharts } from "@/components/BrochurePieCharts";

interface PatentAnalyticsProps {
  patents: any[];
  ipApplications?: any[];
}

type ExportSection = 'overview' | 'status' | 'field' | 'lifecycle' | 'summary';

export function PatentAnalyticsCard({ patents, ipApplications = [] }: PatentAnalyticsProps) {
  // State for export dialog
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportSections, setExportSections] = useState<ExportSection[]>(['overview', 'status', 'field', 'lifecycle', 'summary']);

  // Calculate metrics
  const totalPatents = patents.length;
  
  // Status distribution
  const statusCounts = patents.reduce((acc, patent) => {
    const status = patent.status || 'Pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Field distribution (as proxy for department/college)
  const fieldCounts = patents.reduce((acc, patent) => {
    const field = patent.field || 'Unspecified';
    acc[field] = (acc[field] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top fields
  const topFields = Object.entries(fieldCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5);

  // Status colors
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      // Patent statuses (mirror Existing Patents pill colors)
      'Filed': 'bg-indigo-500',
      'Registered': 'bg-teal-500',
      'Commercialized': 'bg-fuchsia-500',
      // IP application / legacy statuses
      'Granted': 'bg-green-500',
      'Approved': 'bg-green-500',
      'Approved for IPOPHL Filing': 'bg-green-500',
      'Available': 'bg-green-500',
      'Under Review': 'bg-yellow-500',
      'Under IPOPHL Examination': 'bg-yellow-500',
      'Pending': 'bg-yellow-500',
      'Submitted for Internal Review': 'bg-yellow-500',
      'Rejected': 'bg-red-500',
      'Needs Revision': 'bg-orange-500',
      'Draft': 'bg-gray-400',
    };
    return colors[status] || 'bg-blue-500';
  };

  const getStatusTextColor = (status: string) => {
    const colors: Record<string, string> = {
      // Patent statuses (mirror Existing Patents pill colors)
      'Filed': 'text-indigo-600',
      'Registered': 'text-teal-600',
      'Commercialized': 'text-fuchsia-600',
      // IP application / legacy statuses
      'Granted': 'text-green-600',
      'Approved': 'text-green-600',
      'Approved for IPOPHL Filing': 'text-green-600',
      'Available': 'text-green-600',
      'Under Review': 'text-yellow-600',
      'Under IPOPHL Examination': 'text-yellow-600',
      'Pending': 'text-yellow-600',
      'Submitted for Internal Review': 'text-yellow-600',
      'Rejected': 'text-red-600',
      'Needs Revision': 'text-orange-600',
      'Draft': 'text-gray-600',
    };
    return colors[status] || 'text-blue-600';
  };

  // Status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Granted':
      case 'Approved':
      case 'Approved for IPOPHL Filing':
      case 'Available':
        return <CheckCircle className="h-4 w-4" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4" />;
      case 'Needs Revision':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Format field name
  const formatFieldName = (field: string) => {
    return field
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Handle CSV export
  const handleExportCSV = () => {
    const rows: string[] = [];
    const timestamp = new Date().toLocaleString();
    
    // Header
    rows.push('Patent Analytics Report');
    rows.push(`Generated on: ${timestamp}`);
    rows.push(`Total Patents: ${totalPatents}`);
    rows.push('');

    // Overview Section
    if (exportSections.includes('overview')) {
      rows.push('=== OVERVIEW ===');
      rows.push('Metric,Count,Percentage');
      const approvedCount = ipApplications.filter((app: any) =>
        app.status === 'Approved for IPOPHL Filing' ||
        app.status === 'Filed to IPOPHL' ||
        app.status === 'Granted'
      ).length || (statusCounts['Approved'] || statusCounts['Granted'] || statusCounts['Approved for IPOPHL Filing'] || statusCounts['Available'] || 0);
      const pendingReviewCount = ipApplications.filter((app: any) =>
        app.status === 'Submitted for Internal Review' ||
        app.status === 'Under Internal Review' ||
        app.status === 'Needs Revision'
      ).length;
      rows.push(`Total Applications,${totalPatents},100%`);
      rows.push(`Approved,${approvedCount},${totalPatents > 0 ? ((approvedCount / totalPatents) * 100).toFixed(1) : 0}%`);
      rows.push(`Pending Review,${pendingReviewCount},${totalPatents > 0 ? ((pendingReviewCount / totalPatents) * 100).toFixed(1) : 0}%`);
      rows.push('');
    }

    // Status Distribution Section
    if (exportSections.includes('status')) {
      rows.push('=== STATUS DISTRIBUTION ===');
      rows.push('Status,Count,Percentage');
      Object.entries(statusCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .forEach(([status, count]) => {
          const percentage = totalPatents > 0 ? ((count as number) / totalPatents * 100).toFixed(1) : '0';
          rows.push(`${status},${count},${percentage}%`);
        });
      rows.push('');
    }

    // Field Distribution Section
    if (exportSections.includes('field')) {
      rows.push('=== FIELD DISTRIBUTION ===');
      rows.push('Field,Count,Percentage');
      Object.entries(fieldCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .forEach(([field, count]) => {
          const percentage = totalPatents > 0 ? ((count as number) / totalPatents * 100).toFixed(1) : '0';
          rows.push(`${formatFieldName(field)},${count},${percentage}%`);
        });
      rows.push('');
    }

    // Lifecycle Funnel Section
    if (exportSections.includes('lifecycle')) {
      const filed = (statusCounts['Filed'] || 0);
      const registered = (statusCounts['Registered'] || 0);
      const commercialized = (statusCounts['Commercialized'] || 0);
      const totalPipeline = filed + registered + commercialized;
      const reachedRegistered = registered + commercialized;
      const reachedCommercialized = commercialized;
      const filedToReg = totalPipeline > 0 ? ((reachedRegistered / totalPipeline) * 100).toFixed(1) : '0';
      const regToComm = reachedRegistered > 0 ? ((reachedCommercialized / reachedRegistered) * 100).toFixed(1) : '0';
      const overall = totalPipeline > 0 ? ((reachedCommercialized / totalPipeline) * 100).toFixed(1) : '0';
      rows.push('=== PATENT LIFECYCLE FUNNEL ===');
      rows.push('Stage,Reached,Conversion %');
      rows.push(`Filed (entered pipeline),${totalPipeline},100.0%`);
      rows.push(`Registered (cumulative),${reachedRegistered},${filedToReg}%`);
      rows.push(`Commercialized (cumulative),${reachedCommercialized},${overall}%`);
      rows.push('');
      rows.push('Conversion Rates,,');
      rows.push(`Filed → Registered,${filedToReg}%,`);
      rows.push(`Registered → Commercialized,${regToComm}%,`);
      rows.push(`Overall (Filed → Commercialized),${overall}%,`);
      rows.push('');
    }

    // Summary Stats Section
    if (exportSections.includes('summary')) {
      const filed = (statusCounts['Filed'] || 0);
      const registered = (statusCounts['Registered'] || 0);
      const commercialized = (statusCounts['Commercialized'] || 0);
      const totalPipeline = filed + registered + commercialized;
      const topField = topFields[0];

      rows.push('=== SUMMARY STATISTICS ===');
      rows.push('Statistic,Value');
      rows.push(`Total Patents,${totalPatents}`);
      rows.push(`Patents in Lifecycle,${totalPipeline}`);
      rows.push(`Currently Filed,${filed}`);
      rows.push(`Currently Registered,${registered}`);
      rows.push(`Currently Commercialized,${commercialized}`);
      rows.push(`Top Field,${topField ? formatFieldName(topField[0]) : 'N/A'}`);
      rows.push(`Top Field Count,${topField ? topField[1] : 0}`);
      rows.push(`Distinct Fields,${Object.keys(fieldCounts).length}`);
    }

    // Create and download CSV
    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `patent-analytics-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowExportDialog(false);
  };

  const toggleExportSection = (section: ExportSection) => {
    if (exportSections.includes(section)) {
      setExportSections(exportSections.filter(s => s !== section));
    } else {
      setExportSections([...exportSections, section]);
    }
  };

  return (
    <Card className="border-2 border-blue-100">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-blue-900">Patent Analytics Summary</CardTitle>
              <p className="text-sm text-blue-600">TPCO Monitoring Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportDialog(true)}
              className="bg-white hover:bg-blue-50"
            >
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
            <Badge variant="outline" className="bg-white">
              <TrendingUp className="h-3 w-3 mr-1" />
              Real-time
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Total Patents */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 opacity-80" />
              <span className="text-sm opacity-90">Total Applications</span>
            </div>
            <div className="text-3xl font-bold">{totalPatents}</div>
            <div className="text-xs opacity-80 mt-1">All time records</div>
          </div>

          {/* Approved */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 opacity-80" />
              <span className="text-sm opacity-90">Approved</span>
            </div>
            <div className="text-3xl font-bold">
              {ipApplications.filter((app: any) =>
                app.status === 'Approved for IPOPHL Filing' ||
                app.status === 'Filed to IPOPHL' ||
                app.status === 'Granted'
              ).length || (statusCounts['Approved'] || statusCounts['Granted'] || statusCounts['Approved for IPOPHL Filing'] || statusCounts['Available'] || 0)}
            </div>
            <div className="text-xs opacity-80 mt-1">Ready for filing</div>
          </div>

          {/* Pending Review — IP applications awaiting admin action.
              Replaces the legacy 'Under Review' tile, which counted patent
              statuses that no longer exist (Under Review / Pending). */}
          <div className="bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 opacity-80" />
              <span className="text-sm opacity-90">Pending Review</span>
            </div>
            <div className="text-3xl font-bold">
              {ipApplications.filter((app: any) =>
                app.status === 'Submitted for Internal Review' ||
                app.status === 'Under Internal Review' ||
                app.status === 'Needs Revision'
              ).length}
            </div>
            <div className="text-xs opacity-80 mt-1">Awaiting admin action</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-600" />
              Status Distribution
            </h4>
            <div className="space-y-2">
              {Object.entries(statusCounts)
                .sort(([,a], [,b]) => (b as number) - (a as number))
                .map(([status, count]) => {
                  const countNum = count as number;
                  const percentage = totalPatents > 0 ? (countNum / totalPatents * 100).toFixed(1) : '0';
                  return (
                    <div key={status} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className={getStatusTextColor(status)}>
                            {getStatusIcon(status)}
                          </span>
                          <span className="text-gray-700">{status}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{countNum}</span>
                          <span className="text-xs text-gray-500">({percentage}%)</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getStatusColor(status)} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              {Object.keys(statusCounts).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No status data available</p>
              )}
            </div>
          </div>

          {/* Top Fields */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              Top Fields
            </h4>
            <div className="space-y-2">
              {topFields.map(([field, count], index) => {
                const countNum = count as number;
                const percentage = totalPatents > 0 ? (countNum / totalPatents * 100).toFixed(1) : '0';
                const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500'];
                return (
                  <div key={field} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{formatFieldName(field)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{countNum}</span>
                        <span className="text-xs text-gray-500">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colors[index]} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {topFields.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No field data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Brochure-style IP Distribution pie charts (shared component) */}
        <div className="pt-4 border-t">
          <BrochurePieCharts patents={patents} ipApplications={ipApplications} />
        </div>

        {/* Patent Lifecycle Funnel */}
        <PatentLifecycleFunnel patents={patents} />
      </CardContent>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Analytics Report</DialogTitle>
            <DialogDescription>
              Select which sections to include in the CSV report.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-sm text-muted-foreground">
              Total patents in report: <span className="font-medium">{totalPatents}</span>
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Sections to Export:</Label>
              
              <div className="space-y-2">
                {[
                  { key: 'overview', label: 'Overview (KPI Summary)', desc: 'Total, Approved, Pending Review' },
                  { key: 'status', label: 'Status Distribution', desc: 'Breakdown by patent status' },
                  { key: 'field', label: 'Field Distribution', desc: 'Breakdown by field/college' },
                  { key: 'lifecycle', label: 'Patent Lifecycle Funnel', desc: 'Filed → Registered → Commercialized conversion' },
                  { key: 'summary', label: 'Summary Statistics', desc: 'Pipeline counts, top field, totals' },
                ].map((section) => (
                  <div key={section.key} className="flex items-start gap-3 p-2 rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      id={`export-${section.key}`}
                      checked={exportSections.includes(section.key as ExportSection)}
                      onChange={() => toggleExportSection(section.key as ExportSection)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 mt-0.5"
                    />
                    <label htmlFor={`export-${section.key}`} className="flex-1 cursor-pointer">
                      <div className="text-sm font-medium">{section.label}</div>
                      <div className="text-xs text-muted-foreground">{section.desc}</div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleExportCSV}
              disabled={exportSections.length === 0}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// =============================================================================
// Patent Lifecycle Funnel
// -----------------------------------------------------------------------------
// Replaces the old year-based 'Filing Trends Analysis' which depended on a
// `year` field that admin_patents records don't reliably carry.
// This shows the real lifecycle: Filed → Registered → Commercialized,
// with cumulative counts and conversion rates between stages.
// =============================================================================
interface PatentLifecycleFunnelProps {
  patents: any[];
}

function PatentLifecycleFunnel({ patents }: PatentLifecycleFunnelProps) {
  const lifecycle = useMemo(() => {
    const filed = patents.filter(p => p.status === 'Filed').length;
    const registered = patents.filter(p => p.status === 'Registered').length;
    const commercialized = patents.filter(p => p.status === 'Commercialized').length;

    // Cumulative funnel: every Registered patent passed through Filed,
    // every Commercialized passed through Registered.
    const totalEnteredPipeline = filed + registered + commercialized;
    const reachedRegistered = registered + commercialized;
    const reachedCommercialized = commercialized;

    const filedToRegisteredRate = totalEnteredPipeline > 0
      ? (reachedRegistered / totalEnteredPipeline) * 100 : 0;
    const registeredToCommercializedRate = reachedRegistered > 0
      ? (reachedCommercialized / reachedRegistered) * 100 : 0;
    const overallConversion = totalEnteredPipeline > 0
      ? (reachedCommercialized / totalEnteredPipeline) * 100 : 0;

    // Identify the largest drop-off stage (where patents get stuck).
    const filedDropoff = totalEnteredPipeline - reachedRegistered;
    const registeredDropoff = reachedRegistered - reachedCommercialized;
    const bottleneck = filedDropoff >= registeredDropoff
      ? { stage: 'Filed → Registered', stuck: filedDropoff }
      : { stage: 'Registered → Commercialized', stuck: registeredDropoff };

    return {
      filed, registered, commercialized,
      totalEnteredPipeline, reachedRegistered, reachedCommercialized,
      filedToRegisteredRate, registeredToCommercializedRate, overallConversion,
      bottleneck,
    };
  }, [patents]);

  const {
    filed, registered, commercialized,
    totalEnteredPipeline, reachedRegistered, reachedCommercialized,
    filedToRegisteredRate, registeredToCommercializedRate, overallConversion,
    bottleneck,
  } = lifecycle;

  if (totalEnteredPipeline === 0) {
    return (
      <div className="space-y-3 pt-4 border-t">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="h-4 w-4 text-indigo-600" />
          Patent Lifecycle Funnel
        </h4>
        <p className="text-sm text-gray-500 text-center py-4">No patents in the lifecycle yet</p>
      </div>
    );
  }

  // Stage widths — funnel narrows from Filed (100%) downstream.
  const filedWidth = 100;
  const registeredWidth = (reachedRegistered / totalEnteredPipeline) * 100;
  const commercializedWidth = (reachedCommercialized / totalEnteredPipeline) * 100;

  return (
    <div className="space-y-4 pt-4 border-t">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-600" />
            Patent Lifecycle Funnel
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            How patents progress from filing to commercialization.
          </p>
        </div>
        <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
          {totalEnteredPipeline} patents in pipeline
        </Badge>
      </div>

      {/* Funnel Stages */}
      <div className="space-y-2">
        <FunnelStage
          label="Filed"
          count={totalEnteredPipeline}
          colorClass="from-indigo-500 to-indigo-600"
          textColor="text-indigo-700"
          widthPct={filedWidth}
        />
        <ConversionArrow
          rate={filedToRegisteredRate}
          label={`${reachedRegistered} of ${totalEnteredPipeline} progressed`}
        />
        <FunnelStage
          label="Registered"
          count={reachedRegistered}
          colorClass="from-teal-500 to-teal-600"
          textColor="text-teal-700"
          widthPct={registeredWidth}
        />
        <ConversionArrow
          rate={registeredToCommercializedRate}
          label={`${reachedCommercialized} of ${reachedRegistered} progressed`}
        />
        <FunnelStage
          label="Commercialized"
          count={reachedCommercialized}
          colorClass="from-fuchsia-500 to-fuchsia-600"
          textColor="text-fuchsia-700"
          widthPct={commercializedWidth}
        />
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="bg-indigo-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Award className="h-3.5 w-3.5 text-indigo-600" />
            <div className="text-xs text-gray-500">Overall Conversion</div>
          </div>
          <div className="text-lg font-bold text-indigo-700">
            {overallConversion.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Filed → Commercialized</div>
        </div>
        <div className="bg-teal-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-teal-600" />
            <div className="text-xs text-gray-500">Registration Rate</div>
          </div>
          <div className="text-lg font-bold text-teal-700">
            {filedToRegisteredRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-0.5">of filed reach IPOPHL grant</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <ArrowDownRight className="h-3.5 w-3.5 text-amber-600" />
            <div className="text-xs text-gray-500">Biggest Drop-off</div>
          </div>
          <div className="text-lg font-bold text-amber-700">
            {bottleneck.stuck} {bottleneck.stuck === 1 ? 'patent' : 'patents'}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">stuck at {bottleneck.stage}</div>
        </div>
      </div>

      {/* Current Snapshot */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <div className="text-xs font-semibold text-gray-700">Current snapshot (by status)</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-gray-600">Filed:</span>
            <span className="font-semibold text-gray-900">{filed}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            <span className="text-gray-600">Registered:</span>
            <span className="font-semibold text-gray-900">{registered}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500" />
            <span className="text-gray-600">Commercialized:</span>
            <span className="font-semibold text-gray-900">{commercialized}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Funnel stage row — horizontal bar with label and count.
interface FunnelStageProps {
  label: string;
  count: number;
  colorClass: string;
  textColor: string;
  widthPct: number;
}

function FunnelStage({ label, count, colorClass, textColor, widthPct }: FunnelStageProps) {
  // Always show at least a sliver if count > 0 so the bar is visible.
  const renderedWidth = count > 0 ? Math.max(widthPct, 8) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className={`w-32 text-right text-sm font-semibold ${textColor}`}>{label}</div>
      <div className="flex-1 h-10 bg-gray-100 rounded-md overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colorClass} flex items-center justify-end px-3 transition-all duration-500`}
          style={{ width: `${renderedWidth}%` }}
        >
          {count > 0 && <span className="text-white text-sm font-bold">{count}</span>}
        </div>
        {count === 0 && (
          <div className="-mt-10 h-10 flex items-center justify-center text-xs text-gray-400">
            0 patents
          </div>
        )}
      </div>
    </div>
  );
}

// Conversion arrow between stages with rate label.
function ConversionArrow({ rate, label }: { rate: number; label: string }) {
  return (
    <div className="flex items-center gap-3 pl-32">
      <div className="flex-1 flex items-center gap-2 text-xs text-gray-500">
        <ArrowDownRight className="h-3 w-3" />
        <span>{label}</span>
        <span className="font-semibold text-gray-700">({rate.toFixed(1)}% conversion)</span>
      </div>
    </div>
  );
}
