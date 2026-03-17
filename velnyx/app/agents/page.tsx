"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AgentGrid from "@/components/agents/AgentGrid";
import AgentFilters from "@/components/agents/AgentFilters";
import { Agent } from "@/lib/types";

export default function BrowseAgentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-28 pb-20">
        <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
          <div className="skeleton h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-80" />)}
          </div>
        </div>
      </div>
    }>
      <BrowseAgentsContent />
    </Suspense>
  );
}

function BrowseAgentsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "popular";
  const q = searchParams.get("q") || "";

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (q) params.set("q", q);

    const res = await fetch(`/api/agents?${params}`);
    const data = await res.json();
    setAgents(data);
    setLoading(false);
  }, [category, sort, q]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/agents?${params}`);
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
        <div className="mb-12">
          <h1 className="font-clash text-4xl md:text-5xl font-bold text-white mb-4">
            Explore Agents
          </h1>
          <p className="text-zinc-400 text-lg">
            {agents.length} agents ready to work for you
          </p>
        </div>

        <div className="mb-10">
          <AgentFilters
            activeCategory={category}
            sortBy={sort}
            searchQuery={q}
            onCategoryChange={(c) => updateParams("category", c)}
            onSortChange={(s) => updateParams("sort", s)}
            onSearchChange={(q) => updateParams("q", q)}
          />
        </div>

        <AgentGrid agents={agents} loading={loading} />
      </div>
    </div>
  );
}
