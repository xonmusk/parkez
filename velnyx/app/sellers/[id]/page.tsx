import db from "@/db";
import { notFound } from "next/navigation";
import { Agent } from "@/lib/types";
import AgentCard from "@/components/agents/AgentCard";
import { Star, CheckCircle, Bot } from "lucide-react";

export const dynamic = "force-dynamic";

export default function SellerProfilePage({ params }: { params: { id: string } }) {
  const seller = db.get<any>(
    "SELECT id, name, avatar_url, bio, created_at FROM users WHERE id = ? AND role = 'seller'",
    [params.id]
  );

  if (!seller) return notFound();

  const agents = db.query<Agent>(
    `SELECT a.*, u.name as seller_name FROM agents a JOIN users u ON a.seller_id = u.id
     WHERE a.seller_id = ? AND a.status = 'active' ORDER BY a.tasks_completed DESC`,
    [params.id]
  );

  const stats = db.get<any>(
    `SELECT COUNT(*) as agent_count, SUM(tasks_completed) as total_tasks,
     AVG(CASE WHEN rating_count > 0 THEN rating_avg ELSE NULL END) as avg_rating
     FROM agents WHERE seller_id = ?`,
    [params.id]
  );

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-container mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center text-3xl font-clash font-bold text-accent">
            {seller.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-clash text-3xl md:text-4xl font-bold text-white">{seller.name}</h1>
            {seller.bio && <p className="text-zinc-400 mt-1">{seller.bio}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-16 max-w-lg">
          <div className="bg-bg-card border border-white/[0.06] rounded-xl p-4 text-center">
            <Bot size={18} className="mx-auto mb-2 text-accent" />
            <p className="font-clash text-xl font-bold text-white">{stats?.agent_count || 0}</p>
            <p className="text-xs text-zinc-500">Agents</p>
          </div>
          <div className="bg-bg-card border border-white/[0.06] rounded-xl p-4 text-center">
            <CheckCircle size={18} className="mx-auto mb-2 text-success" />
            <p className="font-clash text-xl font-bold text-white">{stats?.total_tasks || 0}</p>
            <p className="text-xs text-zinc-500">Tasks</p>
          </div>
          <div className="bg-bg-card border border-white/[0.06] rounded-xl p-4 text-center">
            <Star size={18} className="mx-auto mb-2 text-amber" />
            <p className="font-clash text-xl font-bold text-white">{stats?.avg_rating?.toFixed(1) || "N/A"}</p>
            <p className="text-xs text-zinc-500">Rating</p>
          </div>
        </div>

        <h2 className="font-clash text-2xl font-semibold text-white mb-8">
          Agents by {seller.name.split(" ")[0]}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
