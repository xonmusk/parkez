import { Car, CheckCircle, IndianRupee, AlertTriangle } from 'lucide-react';

const stats = [
  { key: 'totalSpots', label: 'TOTAL', icon: Car, format: v => v?.toLocaleString() || '–' },
  { key: 'availableNow', label: 'ONLINE', icon: CheckCircle, format: v => v?.toLocaleString() || '–' },
  { key: 'avgPrice', label: 'AVG RATE', icon: IndianRupee, format: v => v != null ? `₹${v}/hr` : '–' },
  { key: 'busiestArea', label: 'HOT ZONE', icon: AlertTriangle, format: v => v || '–' },
];

export default function StatsHeader({ stats: data, loading }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-black border-b border-neon-green/20 overflow-x-auto">
      <h1 className="text-lg font-bold text-neon-green whitespace-nowrap mr-2 tracking-wider drop-shadow-[0_0_8px_#00ff41]">
        [ PARK//EZ ]
      </h1>
      {stats.map(s => {
        const Icon = s.icon;
        return (
          <div key={s.key} className="flex items-center gap-2 px-3 py-1.5 bg-neon-green/5 border border-neon-green/15 rounded min-w-[140px]">
            <Icon className="w-4 h-4 text-neon-green/60 flex-shrink-0" />
            <div>
              <p className="text-[9px] text-neon-green/40 uppercase tracking-[0.2em]">{s.label}</p>
              {loading ? (
                <div className="h-4 w-16 bg-neon-green/10 rounded animate-pulse mt-0.5" />
              ) : (
                <p className="text-sm font-semibold text-neon-green">{s.format(data?.[s.key])}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
