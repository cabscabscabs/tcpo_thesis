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
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Building2,
  Lightbulb,
  Award,
  BarChart3,
  Filter,
  LineChart,
  BarChart,
  Activity,
  Download,
  FileDown
} from "lucide-react";
import { useState, useMemo } from "react";

interface PatentAnalyticsProps {
  patents: any[];
}

type TrendFilter = 'all' | 'field' | 'status';
type ChartType = 'bar' | 'line' | 'combo';

type ExportSection = 'overview' | 'status' | 'field' | 'trends' | 'summary';

export function PatentAnalyticsCard({ patents }: PatentAnalyticsProps) {
  // State for filing trends
  const [trendFilter, setTrendFilter] = useState<TrendFilter>('all');
  const [selectedField, setSelectedField] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [chartType, setChartType] = useState<ChartType>('combo');
  
  // State for export dialog
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportSections, setExportSections] = useState<ExportSection[]>(['overview', 'status', 'field', 'trends', 'summary']);

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

  // Year distribution
  const yearCounts = patents.reduce((acc, patent) => {
    const year = patent.year || new Date().getFullYear().toString();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sort years for trend
  const sortedYears = Object.keys(yearCounts).sort();
  const maxYearCount = Math.max(...Object.values(yearCounts).map(v => v as number), 1);

  // Top fields
  const topFields = Object.entries(fieldCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5);

  // Status colors
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
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
      const approvedCount = statusCounts['Approved'] || statusCounts['Granted'] || statusCounts['Approved for IPOPHL Filing'] || statusCounts['Available'] || 0;
      const underReviewCount = (statusCounts['Under Review'] || 0) + 
        (statusCounts['Pending'] || 0) + 
        (statusCounts['Submitted for Internal Review'] || 0) +
        (statusCounts['Under IPOPHL Examination'] || 0);
      rows.push(`Total Applications,${totalPatents},100%`);
      rows.push(`Approved,${approvedCount},${totalPatents > 0 ? ((approvedCount / totalPatents) * 100).toFixed(1) : 0}%`);
      rows.push(`Under Review,${underReviewCount},${totalPatents > 0 ? ((underReviewCount / totalPatents) * 100).toFixed(1) : 0}%`);
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

    // Year Trends Section
    if (exportSections.includes('trends')) {
      rows.push('=== FILING TRENDS BY YEAR ===');
      rows.push('Year,Count');
      Object.entries(yearCounts)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([year, count]) => {
          rows.push(`${year},${count}`);
        });
      rows.push('');
    }

    // Summary Stats Section
    if (exportSections.includes('summary')) {
      const sortedYears = Object.keys(yearCounts).sort();
      const values = sortedYears.map(year => yearCounts[year]);
      const avgPerYear = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : '0';
      const peakYear = values.length > 0 ? Math.max(...values) : 0;
      
      rows.push('=== SUMMARY STATISTICS ===');
      rows.push('Statistic,Value');
      rows.push(`Total Patents,${totalPatents}`);
      rows.push(`Years Covered,${sortedYears.length}`);
      rows.push(`Average per Year,${avgPerYear}`);
      rows.push(`Peak Year Count,${peakYear}`);
      rows.push(`Earliest Year,${sortedYears[0] || 'N/A'}`);
      rows.push(`Latest Year,${sortedYears[sortedYears.length - 1] || 'N/A'}`);
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
              {statusCounts['Approved'] || statusCounts['Granted'] || statusCounts['Approved for IPOPHL Filing'] || statusCounts['Available'] || 0}
            </div>
            <div className="text-xs opacity-80 mt-1">Ready for filing</div>
          </div>

          {/* Under Review */}
          <div className="bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 opacity-80" />
              <span className="text-sm opacity-90">Under Review</span>
            </div>
            <div className="text-3xl font-bold">
              {(statusCounts['Under Review'] || 0) + 
               (statusCounts['Pending'] || 0) + 
               (statusCounts['Submitted for Internal Review'] || 0) +
               (statusCounts['Under IPOPHL Examination'] || 0)}
            </div>
            <div className="text-xs opacity-80 mt-1">In progress</div>
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
              Top Fields / Colleges
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

        {/* Enhanced Filing Trends with Filters */}
        <EnhancedFilingTrends 
          patents={patents}
          trendFilter={trendFilter}
          setTrendFilter={setTrendFilter}
          selectedField={selectedField}
          setSelectedField={setSelectedField}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          chartType={chartType}
          setChartType={setChartType}
        />
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
                  { key: 'overview', label: 'Overview (KPI Summary)', desc: 'Total, Approved, Under Review' },
                  { key: 'status', label: 'Status Distribution', desc: 'Breakdown by patent status' },
                  { key: 'field', label: 'Field Distribution', desc: 'Breakdown by field/college' },
                  { key: 'trends', label: 'Filing Trends by Year', desc: 'Year-over-year filing counts' },
                  { key: 'summary', label: 'Summary Statistics', desc: 'Avg per year, peak year, date range' },
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

// Enhanced Filing Trends Component
interface EnhancedFilingTrendsProps {
  patents: any[];
  trendFilter: TrendFilter;
  setTrendFilter: (filter: TrendFilter) => void;
  selectedField: string;
  setSelectedField: (field: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
}

function EnhancedFilingTrends({
  patents,
  trendFilter,
  setTrendFilter,
  selectedField,
  setSelectedField,
  selectedStatus,
  setSelectedStatus,
  chartType,
  setChartType
}: EnhancedFilingTrendsProps) {
  
  // Get unique fields and statuses for filters
  const uniqueFields = useMemo(() => {
    const fields = new Set(patents.map(p => p.field).filter(Boolean));
    return Array.from(fields).sort();
  }, [patents]);

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(patents.map(p => p.status).filter(Boolean));
    return Array.from(statuses).sort();
  }, [patents]);

  // Calculate filtered year data
  const yearData = useMemo(() => {
    const filtered = patents.filter(patent => {
      if (trendFilter === 'field' && selectedField !== 'all') {
        return patent.field === selectedField;
      }
      if (trendFilter === 'status' && selectedStatus !== 'all') {
        return patent.status === selectedStatus;
      }
      return true;
    });

    const counts = filtered.reduce((acc, patent) => {
      const year = patent.year || new Date().getFullYear().toString();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const years = Object.keys(counts).sort();
    const values = years.map(year => counts[year]);
    
    // Calculate cumulative trend line - starts from first year's value
    const cumulative = values.reduce((acc, val, i) => {
      if (i === 0) {
        acc.push(val);
      } else {
        acc.push(acc[i - 1] + val);
      }
      return acc;
    }, [] as number[]);

    // Calculate moving average (3-year window)
    const movingAvg = values.map((_, i) => {
      const start = Math.max(0, i - 1);
      const end = Math.min(values.length, i + 2);
      const slice = values.slice(start, end);
      return slice.reduce((a, b) => a + b, 0) / slice.length;
    });

    // Year-over-year growth rates
    const yoyGrowth = values.map((val, i) => {
      if (i === 0) return null;
      const prev = values[i - 1];
      if (prev === 0) return val > 0 ? 100 : 0;
      return ((val - prev) / prev) * 100;
    });

    // Find fastest growing year
    let fastestGrowthYear = years[0];
    let fastestGrowthRate = 0;
    yoyGrowth.forEach((rate, i) => {
      if (rate !== null && rate > fastestGrowthRate) {
        fastestGrowthRate = rate;
        fastestGrowthYear = years[i];
      }
    });

    // Most active year
    const maxVal = Math.max(...values, 0);
    const mostActiveYear = years[values.indexOf(maxVal)] || years[0];

    // Latest YoY trend
    const latestYoY = yoyGrowth[yoyGrowth.length - 1];
    const trendDirection = latestYoY === null ? 'flat' : latestYoY > 5 ? 'up' : latestYoY < -5 ? 'down' : 'flat';

    return { years, values, cumulative, movingAvg, counts, yoyGrowth, fastestGrowthYear, fastestGrowthRate, mostActiveYear, trendDirection, latestYoY };
  }, [patents, trendFilter, selectedField, selectedStatus]);

  const { years, values, cumulative, movingAvg, yoyGrowth, fastestGrowthYear, fastestGrowthRate, mostActiveYear, trendDirection, latestYoY } = yearData;
  const maxValue = Math.max(...values, 1);
  const maxCumulative = Math.max(...cumulative, 1);

  if (years.length === 0) {
    return (
      <div className="space-y-3 pt-4 border-t">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-600" />
          Filing Trends Analysis
        </h4>
        <p className="text-sm text-gray-500 text-center py-4">No year data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4 border-t">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-600" />
          Filing Trends Analysis
        </h4>
        
        {/* Chart Type Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={chartType === 'bar' ? 'default' : 'ghost'}
            size="sm"
            className="h-7 px-2"
            onClick={() => setChartType('bar')}
          >
            <BarChart className="h-3.5 w-3.5 mr-1" />
            Bar
          </Button>
          <Button
            variant={chartType === 'line' ? 'default' : 'ghost'}
            size="sm"
            className="h-7 px-2"
            onClick={() => setChartType('line')}
          >
            <LineChart className="h-3.5 w-3.5 mr-1" />
            Line
          </Button>
          <Button
            variant={chartType === 'combo' ? 'default' : 'ghost'}
            size="sm"
            className="h-7 px-2"
            onClick={() => setChartType('combo')}
          >
            <Activity className="h-3.5 w-3.5 mr-1" />
            Combo
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-lg">
        <Filter className="h-4 w-4 text-gray-500" />
        
        {/* Filter Type */}
        <div className="flex items-center gap-1">
          <Button
            variant={trendFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setTrendFilter('all')}
          >
            All Data
          </Button>
          <Button
            variant={trendFilter === 'field' ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setTrendFilter('field')}
          >
            By Field
          </Button>
          <Button
            variant={trendFilter === 'status' ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setTrendFilter('status')}
          >
            By Status
          </Button>
        </div>

        {/* Field Selector */}
        {trendFilter === 'field' && (
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="h-7 px-2 text-xs border rounded-md bg-white"
          >
            <option value="all">All Fields</option>
            {uniqueFields.map(field => (
              <option key={field} value={field}>
                {field.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </option>
            ))}
          </select>
        )}

        {/* Status Selector */}
        {trendFilter === 'status' && (
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-7 px-2 text-xs border rounded-md bg-white"
          >
            <option value="all">All Statuses</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        )}
      </div>

      {/* Trend Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Award className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Most Active Year</div>
            <div className="text-sm font-semibold text-gray-900">{mostActiveYear} <span className="text-blue-600">({Math.max(...values, 0)} patents)</span></div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Fastest Growth</div>
            <div className="text-sm font-semibold text-gray-900">{fastestGrowthYear} <span className="text-green-600">(+{fastestGrowthRate.toFixed(0)}%)</span></div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            {trendDirection === 'up' && <ArrowUpRight className="h-4 w-4 text-green-600" />}
            {trendDirection === 'down' && <ArrowDownRight className="h-4 w-4 text-red-600" />}
            {trendDirection === 'flat' && <Minus className="h-4 w-4 text-gray-500" />}
          </div>
          <div>
            <div className="text-xs text-gray-500">Latest Trend</div>
            <div className="text-sm font-semibold text-gray-900">
              {latestYoY === null ? 'N/A' : (
                <span className={latestYoY > 0 ? 'text-green-600' : latestYoY < 0 ? 'text-red-600' : 'text-gray-600'}>
                  {latestYoY > 0 ? '+' : ''}{latestYoY.toFixed(0)}% vs last year
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="flex items-end gap-2">
          <div className="flex flex-col justify-between h-40 text-xs text-gray-500 pr-2 text-right w-8">
            <span>{maxValue}</span>
            <span>{Math.round(maxValue / 2)}</span>
            <span>0</span>
          </div>
          
          {/* Chart */}
          <div className="flex-1 flex items-end gap-1 h-40 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-t border-gray-200" />
              <div className="border-t border-gray-200" />
              <div className="border-t border-gray-200" />
            </div>

            {years.map((year, index) => {
              const value = values[index];
              const cumValue = cumulative[index];
              const avgValue = movingAvg[index];
              const barHeight = maxValue > 0 ? (value / maxValue) * 100 : 0;

              return (
                <div key={year} className="flex-1 flex flex-col items-center gap-1 relative group">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-2 py-1.5 whitespace-nowrap z-10 shadow-lg">
                    <div className="font-medium text-sm mb-1">{year}</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-400 rounded-sm" /> Count: <span className="font-semibold">{value}</span></div>
                    {chartType !== 'bar' && <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-400 rounded-full" /> Cumulative: <span className="font-semibold">{cumValue}</span></div>}
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-400 rounded-full" /> 3yr Avg: <span className="font-semibold">{avgValue.toFixed(1)}</span></div>
                    {yoyGrowth[index] !== null && (
                      <div className={`flex items-center gap-1 mt-1 pt-1 border-t border-gray-700 ${(yoyGrowth[index] as number) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {(yoyGrowth[index] as number) >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        YoY: <span className="font-semibold">{(yoyGrowth[index] as number) > 0 ? '+' : ''}{(yoyGrowth[index] as number).toFixed(0)}%</span>
                      </div>
                    )}
                  </div>

                  {/* Bar */}
                  {(chartType === 'bar' || chartType === 'combo') && (
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all duration-500 hover:from-blue-600 hover:to-blue-500 min-h-[4px]"
                      style={{ height: `${Math.max(barHeight, 4)}%` }}
                    />
                  )}

                  {/* Line point for moving average */}
                  {(chartType === 'line' || chartType === 'combo') && (
                    <>
                      {/* Moving average dot - positioned relative to chart height */}
                      <div 
                        className="absolute w-2 h-2 bg-yellow-500 rounded-full border-2 border-white shadow-sm z-10"
                        style={{ 
                          bottom: `${Math.max(0, Math.min(100, (avgValue / maxValue) * 100))}%`,
                          left: '50%',
                          transform: 'translate(-50%, 50%)'
                        }}
                      />
                      {/* Cumulative line dot - positioned on secondary scale */}
                      <div 
                        className="absolute w-2 h-2 bg-green-500 rounded-full border-2 border-white shadow-sm z-10"
                        style={{ 
                          bottom: `${Math.max(0, Math.min(100, (cumValue / maxCumulative) * 100))}%`,
                          left: '50%',
                          transform: 'translate(-50%, 50%)'
                        }}
                      />
                    </>
                  )}

                  {/* Year label */}
                  <div className="text-xs text-gray-500 mt-1">{year}</div>
                </div>
              );
            })}

            {/* Connecting lines */}
            {(chartType === 'line' || chartType === 'combo') && years.length > 1 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                {/* Moving average line */}
                <polyline
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="1"
                  points={years.map((_, i) => {
                    const x = ((i + 0.5) / years.length) * 100;
                    const y = 100 - (movingAvg[i] / maxValue) * 100;
                    return `${x},${y}`;
                  }).join(' ')}
                />
                {/* Cumulative line */}
                <polyline
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  points={years.map((_, i) => {
                    const x = ((i + 0.5) / years.length) * 100;
                    const y = 100 - (cumulative[i] / maxCumulative) * 100;
                    return `${x},${y}`;
                  }).join(' ')}
                />
              </svg>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs">
          {(chartType === 'bar' || chartType === 'combo') && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-sm" />
              <span className="text-gray-600">Annual Count</span>
            </div>
          )}
          {(chartType === 'line' || chartType === 'combo') && (
            <>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-gray-600">3-Year Moving Average</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-gray-600">Cumulative Total</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {values.reduce((a, b) => a + b, 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Total (Filtered)</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {(values.reduce((a, b) => a + b, 0) / years.length).toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Avg per Year</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.max(...values)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Peak Year Count</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            {trendDirection === 'up' && <TrendingUp className="h-5 w-5 text-green-600" />}
            {trendDirection === 'down' && <TrendingDown className="h-5 w-5 text-red-600" />}
            {trendDirection === 'flat' && <Minus className="h-5 w-5 text-gray-500" />}
            <div className={`text-2xl font-bold ${trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
              {latestYoY === null ? '—' : `${latestYoY > 0 ? '+' : ''}${latestYoY.toFixed(0)}%`}
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">Latest YoY Growth</div>
        </div>
      </div>
    </div>
  );
}
