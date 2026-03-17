import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { task_id, rating, comment } = await req.json();

  if (!task_id || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid review data" }, { status: 400 });
  }

  const task = db.get(
    "SELECT * FROM tasks WHERE id = ? AND buyer_id = ? AND status = 'completed'",
    [task_id, userId]
  ) as any;

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const existingReview = db.get("SELECT id FROM reviews WHERE task_id = ?", [task_id]);
  if (existingReview) {
    return NextResponse.json({ error: "Already reviewed" }, { status: 409 });
  }

  db.run(
    "INSERT INTO reviews (task_id, agent_id, buyer_id, rating, comment) VALUES (?, ?, ?, ?, ?)",
    [task_id, task.agent_id, userId, rating, comment || null]
  );

  // Recalculate average
  const stats = db.get(
    "SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE agent_id = ?",
    [task.agent_id]
  ) as any;

  db.run(
    "UPDATE agents SET rating_avg = ?, rating_count = ? WHERE id = ?",
    [Math.round(stats.avg * 10) / 10, stats.count, task.agent_id]
  );

  // Activity
  const agent = db.get("SELECT name FROM agents WHERE id = ?", [task.agent_id]) as any;
  db.run(
    "INSERT INTO activity (type, agent_id, user_id, metadata) VALUES (?, ?, ?, ?)",
    ["review", task.agent_id, userId, JSON.stringify({ agent_name: agent.name, rating })]
  );

  return NextResponse.json({ success: true });
}
