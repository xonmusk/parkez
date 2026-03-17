"use client";

import { Bot, CheckCircle, Star, Zap } from "lucide-react";

export default function StatsBar({
  agentCount,
  taskCount,
  avgRating,
}: {
  agentCount: number;
  taskCount: number;
  avgRating: number;
}) {
  const stats = [
    { icon: Bot, label: "Agents", value: `${agentCount}+` },
    { icon: CheckCircle, label: "Tasks Completed", value: `${taskCount > 1000 ? Math.round(taskCount / 1000) + "K" : taskCount}+` },
    { icon: Star, label: "Avg Rating", value: `${avgRating}★` },
    { icon: Zap, label: "Instant Delivery", value: "< 30s" },
  ];

  return (
    <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
      <div className="bg-bg-card border border-white/[0.06] rounded-2xl p-6 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-white/[0.06]">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center md:px-6">
              <stat.icon size={20} className="text-zinc-500 mb-2" />
              <p className="font-clash text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
