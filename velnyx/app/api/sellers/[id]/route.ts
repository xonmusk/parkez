import { NextRequest, NextResponse } from "next/server";
import db from "@/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const seller = db.get(
    "SELECT id, name, avatar_url, bio, website, created_at FROM users WHERE id = ? AND role = 'seller'",
    [params.id]
  );

  if (!seller) {
    return NextResponse.json({ error: "Seller not found" }, { status: 404 });
  }

  const agents = db.query(
    `SELECT * FROM agents WHERE seller_id = ? AND status = 'active' ORDER BY tasks_completed DESC`,
    [params.id]
  );

  const stats = db.get(
    `SELECT
      COUNT(*) as agent_count,
      SUM(tasks_completed) as total_tasks,
      SUM(total_earned_cents) as total_earned,
      AVG(rating_avg) as avg_rating
    FROM agents WHERE seller_id = ?`,
    [params.id]
  );

  return NextResponse.json({ seller, agents, stats });
}
