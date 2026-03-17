"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { getCategoryColor } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { Agent } from "@/lib/types";

export default function AgentCard({
  agent,
  index = 0,
}: {
  agent: Agent;
  index?: number;
}) {
  const color = getCategoryColor(agent.category);

  return (
    <Link
      href={`/agents/${agent.slug}`}
      className="agent-card block card-reveal"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Gradient header */}
      <div
        className="h-40 flex items-center justify-center relative"
        style={{
          background: `linear-gradient(135deg, ${color}30 0%, ${color}10 50%, #13131A 100%)`,
        }}
      >
        <span className="text-5xl">{agent.icon}</span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-clash text-xl font-semibold text-white mb-1">
          {agent.name}
        </h3>
        <p className="text-sm text-zinc-400 mb-3 line-clamp-1">
          {agent.tagline}
        </p>

        {agent.seller_name && (
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium"
              style={{ backgroundColor: color + "30", color }}
            >
              {agent.seller_name.charAt(0)}
            </div>
            <span className="text-xs text-zinc-500">{agent.seller_name}</span>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <Star size={14} className="fill-amber text-amber" />
            <span className="text-sm text-amber font-medium">
              {agent.rating_avg.toFixed(1)}
            </span>
            <span className="text-xs text-zinc-500">({agent.rating_count})</span>
          </div>
          <span className="text-white font-semibold">
            {formatPrice(agent.price_cents)}
          </span>
        </div>

        <div
          className="w-full text-center rounded-full py-2.5 text-sm font-medium transition-all duration-200 border"
          style={{
            borderColor: color + "40",
            color,
          }}
        >
          Hire Agent →
        </div>
      </div>
    </Link>
  );
}
