"use client";

import AgentCard from "../agents/AgentCard";
import { Agent } from "@/lib/types";
import Link from "next/link";
import Button from "../ui/Button";

export default function FeaturedAgents({ agents }: { agents: Agent[] }) {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="font-clash text-3xl md:text-[40px] font-semibold text-white mb-4">
              Trending Agents
            </h2>
            <p className="text-zinc-400 max-w-md">
              The most popular agents hired by our community this week.
            </p>
          </div>
          <Link href="/agents" className="hidden md:block">
            <Button variant="outline" size="sm">
              View All →
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.slice(0, 6).map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} index={i} />
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link href="/agents">
            <Button variant="outline">View All Agents →</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
