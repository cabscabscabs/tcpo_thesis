import { Badge } from "@/components/ui/badge";
import { PieChart as PieChartIcon, Handshake } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from "recharts";
import { useMemo } from "react";

// =============================================================================
// Brochure-style IP Distribution Pie Charts (shared component)
// -----------------------------------------------------------------------------
// Mirrors the official TPCO brochure's three-pie layout:
//   1) Intellectual Property Filed   — all IP applications by ip_type
//   2) Intellectual Property Granted — granted applications by ip_type
//   3) Technology Transfer           — commercialized patents by field
// When ip_applications aren't available (e.g. public page / RLS-restricted),
// callers can pass only `patents` and the component will gracefully fall back
// to field-based groupings derived from admin_patents alone.
// =============================================================================

// Brochure palette — muted, print-friendly tones from the TPCO annual report.
export const BROCHURE_PALETTE: Record<string, string> = {
  Copyright: '#7FB4B0',            // teal
  'Utility Model': '#E8D89E',      // beige
  'Patent / Invention': '#B8D4E0', // light blue (used on Filed chart)
  Patent: '#2F7F8C',               // darker teal (used on Granted chart)
  Trademark: '#A8CBA0',            // light green
  'Industrial Design': '#E8A87C',  // orange
  // Technology Transfer categories (brochure)
  'Commercialization (Licensing)': '#E8C17F',
  'Commercialization (Direct Sale)': '#B8D4E0',
  'Community Adapted': '#E8D89E',
  'Utilization - Subscription': '#7FB4B0',
  // Fallback tones for field-based groupings
  _fallback: '#CBD5E1',
};

export const FALLBACK_COLORS = [
  '#7FB4B0', '#E8D89E', '#B8D4E0', '#A8CBA0',
  '#E8A87C', '#2F7F8C', '#E8C17F', '#C0A9D6',
];

export interface PieSlice {
  name: string;
  value: number;
  color: string;
}

interface BrochurePieChartsProps {
  // admin_patents rows (public or admin). Expected to have `status` and `field`.
  patents: any[];
  // Optional ip_applications rows (admin only). If omitted, the Filed/Granted
  // charts derive from patents grouped by `field` instead.
  ipApplications?: any[];
  // Year window label for the caption (defaults to "2020-<currentYear>").
  yearRange?: string;
}

const GRANTED_STATUSES = new Set<string>([
  'Granted',
  'Approved for IPOPHL Filing',
  'Filed to IPOPHL',
]);

const formatFieldLabel = (raw: string) =>
  raw
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export function BrochurePieCharts({ patents, ipApplications, yearRange }: BrochurePieChartsProps) {
  const hasApplications = Array.isArray(ipApplications) && ipApplications.length > 0;

  // --- Filed chart ------------------------------------------------------
  // If we have ip_applications, group by ip_type. Otherwise fall back to
  // grouping all non-Draft patents by `field`.
  const filedData: PieSlice[] = useMemo(() => {
    const counts: Record<string, number> = {};

    if (hasApplications) {
      ipApplications!.forEach((app: any) => {
        const raw = app.ip_type || 'Unspecified';
        const key = raw === 'Patent' ? 'Patent / Invention' : raw;
        counts[key] = (counts[key] || 0) + 1;
      });
    } else {
      patents
        .filter((p: any) => p.status !== 'Draft')
        .forEach((p: any) => {
          const key = formatFieldLabel(p.field || p.category || 'Unspecified');
          counts[key] = (counts[key] || 0) + 1;
        });
    }

    return Object.entries(counts)
      .map(([name, value], idx) => ({
        name,
        value,
        color: BROCHURE_PALETTE[name] || FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [hasApplications, ipApplications, patents]);

  // --- Granted chart ----------------------------------------------------
  // With ip_applications: filter by granted-milestone statuses.
  // Fallback: use patents with status Registered or Commercialized, grouped by field.
  const grantedData: PieSlice[] = useMemo(() => {
    const counts: Record<string, number> = {};

    if (hasApplications) {
      ipApplications!
        .filter((app: any) => GRANTED_STATUSES.has(app.status))
        .forEach((app: any) => {
          const key = app.ip_type || 'Unspecified';
          counts[key] = (counts[key] || 0) + 1;
        });
    } else {
      patents
        .filter((p: any) => p.status === 'Registered' || p.status === 'Commercialized')
        .forEach((p: any) => {
          const key = formatFieldLabel(p.field || p.category || 'Unspecified');
          counts[key] = (counts[key] || 0) + 1;
        });
    }

    return Object.entries(counts)
      .map(([name, value], idx) => ({
        name,
        value,
        color: BROCHURE_PALETTE[name] || FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [hasApplications, ipApplications, patents]);

  // --- Technology Transfer chart ---------------------------------------
  // Commercialized patents grouped by field.
  const techTransferData: PieSlice[] = useMemo(() => {
    const counts: Record<string, number> = {};
    patents
      .filter((p: any) => p.status === 'Commercialized')
      .forEach((p: any) => {
        const key = formatFieldLabel(p.field || p.category || 'Unspecified');
        counts[key] = (counts[key] || 0) + 1;
      });
    return Object.entries(counts)
      .map(([name, value], idx) => ({
        name,
        value,
        color: FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [patents]);

  const filedTotal = filedData.reduce((s, d) => s + d.value, 0);
  const grantedTotal = grantedData.reduce((s, d) => s + d.value, 0);
  const transferTotal = techTransferData.reduce((s, d) => s + d.value, 0);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString('en-US', { month: 'long' }).toUpperCase();
  const rangeLabel = yearRange || `2020-${currentYear}`;

  const filedTitle = `Intellectual Property Filed ${rangeLabel}`;
  const grantedTitle = `Intellectual Property Granted ${rangeLabel}`;
  const transferTitle = `Technology Transfer ${rangeLabel}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <PieChartIcon className="h-4 w-4 text-blue-600" />
            IP Portfolio Distribution
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            Breakdown of filings, grants, and technology transfer.
          </p>
        </div>
        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
          Annual Report View
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BrochurePieCard
          title={filedTitle}
          subtitle={`(TOTAL: ${filedTotal} AS OF ${currentMonth} ${currentYear})`}
          data={filedData}
          total={filedTotal}
          emptyMessage={hasApplications ? 'No IP applications on record yet.' : 'No patents on record yet.'}
        />
        <BrochurePieCard
          title={grantedTitle}
          subtitle={`(TOTAL: ${grantedTotal} AS OF ${currentMonth} ${currentYear})`}
          data={grantedData}
          total={grantedTotal}
          emptyMessage={hasApplications ? 'No granted IP yet.' : 'No registered or commercialized patents yet.'}
        />
      </div>

      <div className="grid grid-cols-1">
        <BrochurePieCard
          title={transferTitle}
          subtitle={`(AS OF ${currentMonth} ${currentYear})`}
          data={techTransferData}
          total={transferTotal}
          emptyMessage="No commercialized technologies yet — records appear here once a patent reaches Commercialized status."
          icon={<Handshake className="h-4 w-4 text-amber-600" />}
          note={hasApplications
            ? "Commercialized patents grouped by field. Fine-grained categories (Licensing, Direct Sale, Community Adapted, Utilization-Subscription) require a utilization_type field that isn't yet tracked."
            : "Commercialized patents grouped by field."}
        />
      </div>
    </div>
  );
}

// Individual pie chart card with brochure-style typography.
interface BrochurePieCardProps {
  title: string;
  subtitle: string;
  data: PieSlice[];
  total: number;
  emptyMessage: string;
  icon?: React.ReactNode;
  note?: string;
}

function BrochurePieCard({ title, subtitle, data, total, emptyMessage, icon, note }: BrochurePieCardProps) {
  // Brochure-style two-line label: slice name on top, count below.
  const renderLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, name, value } = props;
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 18;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const textAnchor = x > cx ? 'start' : 'end';
    return (
      <text x={x} y={y} textAnchor={textAnchor} fontSize={11} fill="#374151">
        <tspan x={x} dy="0">{name}</tspan>
        <tspan x={x} dy="1.3em" fontWeight="600">{value}</tspan>
      </text>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="text-center mb-2">
        <div className="flex items-center justify-center gap-2">
          {icon}
          <h5 className="text-sm font-bold tracking-wide text-gray-900 uppercase">{title}</h5>
        </div>
        <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-0.5">{subtitle}</p>
      </div>

      {total === 0 ? (
        <div className="flex items-center justify-center h-[300px] text-sm text-gray-400 text-center px-6">
          {emptyMessage}
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={85}
                dataKey="value"
                labelLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
                label={renderLabel}
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <ReTooltip
                formatter={(value: number, name: string) => {
                  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                  return [`${value} (${pct}%)`, name];
                }}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Compact legend with swatches and counts */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-xs">
            {data.map((slice) => (
              <div key={slice.name} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-3 h-3 rounded-sm"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-gray-700">
                  {slice.name} <span className="font-semibold text-gray-900">{slice.value}</span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {note && (
        <p className="text-[10px] text-gray-400 italic mt-3 text-center leading-relaxed">{note}</p>
      )}
    </div>
  );
}
