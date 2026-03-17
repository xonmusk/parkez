import db from "@/db";
import { Agent, Review } from "@/lib/types";
import { notFound } from "next/navigation";
import AgentProfileClient from "./AgentProfileClient";

export const dynamic = "force-dynamic";

export default function AgentProfilePage({ params }: { params: { slug: string } }) {
  const agent = db.get<Agent>(
    `SELECT a.*, u.name as seller_name, u.avatar_url as seller_avatar, u.bio as seller_bio, u.id as seller_user_id
     FROM agents a JOIN users u ON a.seller_id = u.id
     WHERE a.slug = ?`,
    [params.slug]
  );

  if (!agent) return notFound();

  const reviews = db.query<Review>(
    `SELECT r.*, u.name as buyer_name, u.avatar_url as buyer_avatar
     FROM reviews r JOIN users u ON r.buyer_id = u.id
     WHERE r.agent_id = ?
     ORDER BY r.created_at DESC
     LIMIT 20`,
    [agent.id]
  );

  const relatedAgents = db.query<Agent>(
    `SELECT a.*, u.name as seller_name
     FROM agents a JOIN users u ON a.seller_id = u.id
     WHERE a.category = ? AND a.id != ? AND a.status = 'active'
     ORDER BY a.rating_avg DESC LIMIT 3`,
    [agent.category, agent.id]
  );

  return <AgentProfileClient agent={agent} reviews={reviews} relatedAgents={relatedAgents} />;
}
