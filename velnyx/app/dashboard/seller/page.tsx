"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DollarSign, CheckCircle, Bot, Star, Plus } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import AgentListItem from "@/components/dashboard/AgentListItem";
import { formatPrice } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function SellerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/dashboard/seller/stats")
        .then((r) => r.json())
        .then((d) => { setData(d); setLoading(false); });
    }
  }, [status, router]);

  const handleToggleStatus = async (agentId: number, newStatus: string) => {
    const agent = data?.agents?.find((a: any) => a.id === agentId);
    if (!agent) return;
    await fetch(`/api/agents/${agent.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setData((prev: any) => ({
      ...prev,
      agents: prev.agents.map((a: any) =>
        a.id === agentId ? { ...a, status: newStatus } : a
      ),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20">
        <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
          <div className="skeleton h-8 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-28" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-clash text-3xl md:text-4xl font-bold text-white mb-2">
              Seller Dashboard
            </h1>
            <p className="text-zinc-400">Manage your agents and track earnings.</p>
          </div>
          <Link href="/dashboard/seller/agents/new">
            <Button>
              <Plus size={18} /> Create Agent
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard label="Total Earnings" value={formatPrice(data?.total_earned || 0)} icon={DollarSign} color="#F59E0B" />
          <StatCard label="Tasks Completed" value={data?.total_tasks || 0} icon={CheckCircle} color="#10B981" />
          <StatCard label="Active Agents" value={data?.agent_count || 0} icon={Bot} color="#8B5CF6" />
          <StatCard label="Avg Rating" value={data?.avg_rating?.toFixed(1) || "0.0"} icon={Star} color="#F59E0B" />
        </div>

        <h2 className="font-clash text-2xl font-semibold text-white mb-6">My Agents</h2>
        <div className="space-y-3 mb-16">
          {data?.agents?.length > 0 ? (
            data.agents.map((agent: any) => (
              <AgentListItem
                key={agent.id}
                agent={agent}
                onToggleStatus={handleToggleStatus}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-bg-card border border-white/[0.06] rounded-card">
              <p className="text-4xl mb-4">🤖</p>
              <h3 className="font-clash text-xl font-semibold text-white mb-2">No agents yet</h3>
              <p className="text-zinc-400 mb-6">Create your first AI agent and start earning.</p>
              <Link href="/dashboard/seller/agents/new">
                <Button>Create Your First Agent</Button>
              </Link>
            </div>
          )}
        </div>

        <h2 className="font-clash text-2xl font-semibold text-white mb-6">Recent Orders</h2>
        <div className="space-y-3">
          {data?.recent_tasks?.length > 0 ? (
            data.recent_tasks.map((task: any) => (
              <div key={task.id} className="bg-bg-card border border-white/[0.06] rounded-xl p-4 flex items-center gap-4">
                <span className="text-2xl">{task.agent_icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white">{task.agent_name}</h4>
                  <p className="text-xs text-zinc-500">by {task.buyer_name}</p>
                </div>
                <span className="text-sm text-white font-medium">{formatPrice(task.price_cents)}</span>
                <span className="text-xs text-zinc-500">
                  {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-zinc-500 text-center py-8">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
