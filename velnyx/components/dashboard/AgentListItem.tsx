"use client";

import { Star, MoreHorizontal } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getCategoryColor } from "@/lib/constants";
import Link from "next/link";

interface AgentListItemProps {
  agent: {
    id: number;
    name: string;
    icon: string;
    category: string;
    status: string;
    price_cents: number;
    rating_avg: number;
    rating_count: number;
    tasks_completed: number;
    total_earned_cents: number;
  };
  onToggleStatus?: (id: number, status: string) => void;
}

export default function AgentListItem({ agent, onToggleStatus }: AgentListItemProps) {
  const color = getCategoryColor(agent.category);

  return (
    <div className="bg-bg-card border border-white/[0.06] rounded-xl p-4 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ backgroundColor: color + "15" }}
      >
        {agent.icon}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-clash font-semibold text-white truncate">{agent.name}</h4>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-zinc-500">{agent.tasks_completed} tasks</span>
          <span className="flex items-center gap-1">
            <Star size={12} className="fill-amber text-amber" />
            <span className="text-amber">{agent.rating_avg.toFixed(1)}</span>
          </span>
          <span className="text-zinc-500">{formatPrice(agent.total_earned_cents)} earned</span>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => onToggleStatus?.(agent.id, agent.status === "active" ? "paused" : "active")}
          className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
            agent.status === "active"
              ? "border-success/30 text-success bg-success/10"
              : "border-zinc-600 text-zinc-400 bg-zinc-800"
          }`}
        >
          {agent.status === "active" ? "Active" : "Paused"}
        </button>
        <Link
          href={`/dashboard/seller/agents/${agent.id}/edit`}
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <MoreHorizontal size={18} />
        </Link>
      </div>
    </div>
  );
}
