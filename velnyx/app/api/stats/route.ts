import { NextResponse } from "next/server";
import db from "@/db";

export async function GET() {
  const agents = db.get("SELECT COUNT(*) as count FROM agents WHERE status = 'active'") as any;
  const tasks = db.get("SELECT COUNT(*) as count FROM tasks WHERE status = 'completed'") as any;
  const avgRating = db.get("SELECT AVG(rating_avg) as avg FROM agents WHERE rating_count > 0") as any;

  return NextResponse.json({
    agent_count: agents.count,
    task_count: tasks.count,
    avg_rating: Math.round((avgRating.avg || 0) * 10) / 10,
  });
}
