import { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
  color = "#8B5CF6",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}) {
  return (
    <div className="bg-bg-card border border-white/[0.06] rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: color + "15" }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <span className="text-xs text-zinc-500 uppercase tracking-[0.05em] font-medium">
          {label}
        </span>
      </div>
      <p className="font-clash text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
