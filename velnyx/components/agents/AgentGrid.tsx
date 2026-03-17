"use client";

import AgentCard from "./AgentCard";
import { AgentCardSkeleton } from "../ui/Skeleton";
import { Agent } from "@/lib/types";

export default function AgentGrid({
  agents,
  loading = false,
}: {
  agents: Agent[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <AgentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🔍</p>
        <h3 className="font-clash text-xl font-semibold text-white mb-2">
          No agents found
        </h3>
        <p className="text-zinc-400">
          Try adjusting your search or browse all categories.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent, i) => (
        <AgentCard key={agent.id} agent={agent} index={i} />
      ))}
    </div>
  );
}
