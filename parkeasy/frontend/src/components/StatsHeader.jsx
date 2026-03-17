import { Car, CheckCircle, IndianRupee, AlertTriangle } from 'lucide-react';

const stats = [
  { key: 'totalSpots', label: 'Total Spots', icon: Car, format: v => v?.toLocaleString() || '–' },
  { key: 'availableNow', label: 'Available Now', icon: CheckCircle, format: v => v?.toLocaleString() || '–' },
  { key: 'avgPrice', label: 'Avg Price', icon: IndianRupee, format: v => v != null ? `₹${v}/hr` : '–' },
  { key: 'busiestArea', label: 'Busiest Area', icon: AlertTriangle, format: v => v || '–' },
];

export default function StatsHeader({ stats: data, loading }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-navy-800 border-b border-navy-700 overflow-x-auto">
      <h1 className="text-lg font-bold text-park-blue whitespace-nowrap mr-2">🅿️ ParkEasy</h1>
      {stats.map(s => {
        const Icon = s.icon;
        return (
          <div key={s.key} className="flex items-center gap-2 px-3 py-1.5 bg-navy-700 rounded-lg min-w-[140px]">
            <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</p>
              {loading ? (
                <div className="h-4 w-16 bg-navy-600 rounded animate-pulse mt-0.5" />
              ) : (
                <p className="text-sm font-semibold text-gray-100">{s.format(data?.[s.key])}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
