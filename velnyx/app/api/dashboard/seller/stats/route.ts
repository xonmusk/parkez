import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const stats = db.get(
    `SELECT
      COUNT(*) as agent_count,
      SUM(tasks_completed) as total_tasks,
      SUM(total_earned_cents) as total_earned,
      AVG(CASE WHEN rating_count > 0 THEN rating_avg ELSE NULL END) as avg_rating
    FROM agents WHERE seller_id = ?`,
    [userId]
  ) as any;

  const recentTasks = db.query(
    `SELECT t.*, a.name as agent_name, a.icon as agent_icon, u.name as buyer_name
     FROM tasks t
     JOIN agents a ON t.agent_id = a.id
     JOIN users u ON t.buyer_id = u.id
     WHERE a.seller_id = ?
     ORDER BY t.created_at DESC
     LIMIT 10`,
    [userId]
  );

  const agents = db.query(
    "SELECT * FROM agents WHERE seller_id = ? ORDER BY created_at DESC",
    [userId]
  );

  return NextResponse.json({
    total_earned: stats.total_earned || 0,
    total_tasks: stats.total_tasks || 0,
    agent_count: stats.agent_count || 0,
    avg_rating: stats.avg_rating ? Math.round(stats.avg_rating * 10) / 10 : 0,
    recent_tasks: recentTasks,
    agents,
  });
}
