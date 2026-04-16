import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Building2,
  Lightbulb,
  Award,
  BarChart3,
  Filter,
  LineChart,
  BarChart,
  Activity
} from "lucide-react";
import { useState, useMemo } from "react";

interface PatentAnalyticsProps {
  patents: any[];
}

type TrendFilter = 'all' | 'field' | 'status';
type ChartType = 'bar' | 'line' | 'combo';

export function PatentAnalyticsCard({ patents }: PatentAnalyticsProps) {
  // State for filing trends
  const [trendFilter, setTrendFilter] = useState<TrendFilter>('all');
  const [selectedField, setSelectedField] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [chartType, setChartType] = useState<ChartType>('combo');

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
          <Badge variant="outline" className="bg-white">
            <TrendingUp className="h-3 w-3 mr-1" />
            Real-time
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

          {/* Needs Attention */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 opacity-80" />
              <span className="text-sm opacity-90">Needs Attention</span>
            </div>
            <div className="text-3xl font-bold">
              {(statusCounts['Needs Revision'] || 0) + (statusCounts['Rejected'] || 0)}
            </div>
            <div className="text-xs opacity-80 mt-1">Action required</div>
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
    
    // Calculate cumulative trend line
    const cumulative = values.reduce((acc, val, i) => {
      acc.push((acc[i - 1] || 0) + val);
      return acc;
    }, [] as number[]);

    // Calculate moving average (3-year window)
    const movingAvg = values.map((_, i) => {
      const start = Math.max(0, i - 1);
      const end = Math.min(values.length, i + 2);
      const slice = values.slice(start, end);
      return slice.reduce((a, b) => a + b, 0) / slice.length;
    });

    return { years, values, cumulative, movingAvg, counts };
  }, [patents, trendFilter, selectedField, selectedStatus]);

  const { years, values, cumulative, movingAvg } = yearData;
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
              const lineY = maxValue > 0 ? 100 - (avgValue / maxValue) * 100 : 50;
              const cumY = maxCumulative > 0 ? 100 - (cumValue / maxCumulative) * 100 : 50;

              return (
                <div key={year} className="flex-1 flex flex-col items-center gap-1 relative group">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    <div className="font-medium">{year}</div>
                    <div>Count: {value}</div>
                    {chartType !== 'bar' && <div>Cumulative: {cumValue}</div>}
                    <div>3yr Avg: {avgValue.toFixed(1)}</div>
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
                      {/* Moving average dot */}
                      <div 
                        className="absolute w-2 h-2 bg-yellow-500 rounded-full border-2 border-white shadow-sm"
                        style={{ bottom: `${lineY}%`, transform: 'translateY(50%)' }}
                      />
                      {/* Cumulative line dot */}
                      <div 
                        className="absolute w-2 h-2 bg-green-500 rounded-full border-2 border-white shadow-sm"
                        style={{ bottom: `${cumY}%`, transform: 'translateY(50%)' }}
                      />
                    </>
                  )}

                  {/* Year label */}
                  <div className="text-xs text-gray-500 mt-1">{year}</div>
                </div>
              );
            })}

            {/* Connecting lines */}
            {(chartType === 'line' || chartType === 'combo') && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                {/* Moving average line */}
                <polyline
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="2"
                  points={years.map((_, i) => {
                    const x = ((i + 0.5) / years.length) * 100;
                    const y = 100 - (movingAvg[i] / maxValue) * 100;
                    return `${x},${y}`;
                  }).join(' ')}
                  style={{ vectorEffect: 'non-scaling-stroke' }}
                />
                {/* Cumulative line */}
                <polyline
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                  points={years.map((_, i) => {
                    const x = ((i + 0.5) / years.length) * 100;
                    const y = 100 - (cumulative[i] / maxCumulative) * 100;
                    return `${x},${y}`;
                  }).join(' ')}
                  style={{ vectorEffect: 'non-scaling-stroke' }}
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
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {values.reduce((a, b) => a + b, 0)}
          </div>
          <div className="text-xs text-gray-500">Total (Filtered)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {(values.reduce((a, b) => a + b, 0) / years.length).toFixed(1)}
          </div>
          <div className="text-xs text-gray-500">Avg per Year</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.max(...values)}
          </div>
          <div className="text-xs text-gray-500">Peak Year</div>
        </div>
      </div>
    </div>
  );
}
