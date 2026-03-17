import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/db";
import { executeAgent } from "@/lib/anthropic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const tasks = db.query(
    `SELECT t.*, a.name as agent_name, a.icon as agent_icon, a.slug as agent_slug
     FROM tasks t JOIN agents a ON t.agent_id = a.id
     WHERE t.buyer_id = ?
     ORDER BY t.created_at DESC`,
    [userId]
  );

  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { agent_id, input_text } = await req.json();

  if (!agent_id || !input_text) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const agent = db.get("SELECT * FROM agents WHERE id = ? AND status = 'active'", [agent_id]) as any;
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  // Create task
  const result = db.run(
    "INSERT INTO tasks (agent_id, buyer_id, input_text, price_cents) VALUES (?, ?, ?, ?)",
    [agent_id, userId, input_text, agent.price_cents]
  );
  const taskId = result.lastInsertRowid;

  // Execute agent
  const { output, success } = await executeAgent(
    agent.system_prompt,
    input_text,
    agent.model,
    agent.max_tokens
  );

  if (success) {
    db.run(
      "UPDATE tasks SET output_text = ?, status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ?",
      [output, taskId]
    );
    db.run(
      "UPDATE agents SET tasks_completed = tasks_completed + 1, total_earned_cents = total_earned_cents + ? WHERE id = ?",
      [agent.price_cents, agent_id]
    );
    db.run(
      "INSERT INTO activity (type, agent_id, user_id, metadata) VALUES (?, ?, ?, ?)",
      ["task_completed", agent_id, userId, JSON.stringify({ agent_name: agent.name })]
    );
  } else {
    db.run("UPDATE tasks SET status = 'failed' WHERE id = ?", [taskId]);
  }

  const task = db.get("SELECT * FROM tasks WHERE id = ?", [taskId]);
  return NextResponse.json(task);
}
