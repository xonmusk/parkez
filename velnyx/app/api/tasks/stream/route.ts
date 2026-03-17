import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/db";
import { streamAgent } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const userId = (session.user as any).id;
  const { agent_id, input_text } = await req.json();

  if (!agent_id || !input_text) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  const agent = db.get("SELECT * FROM agents WHERE id = ? AND status = 'active'", [agent_id]) as any;
  if (!agent) {
    return new Response(JSON.stringify({ error: "Agent not found" }), { status: 404 });
  }

  // Create task
  const result = db.run(
    "INSERT INTO tasks (agent_id, buyer_id, input_text, price_cents) VALUES (?, ?, ?, ?)",
    [agent_id, userId, input_text, agent.price_cents]
  );
  const taskId = Number(result.lastInsertRowid);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "task_id", task_id: taskId })}\n\n`));

        const messageStream = streamAgent(
          agent.system_prompt,
          input_text,
          agent.model,
          agent.max_tokens
        );

        let fullOutput = "";

        messageStream.on("text", (text) => {
          fullOutput += text;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "delta", text })}\n\n`));
        });

        await messageStream.finalMessage();

        // Update task
        db.run(
          "UPDATE tasks SET output_text = ?, status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ?",
          [fullOutput, taskId]
        );
        db.run(
          "UPDATE agents SET tasks_completed = tasks_completed + 1, total_earned_cents = total_earned_cents + ? WHERE id = ?",
          [agent.price_cents, agent_id]
        );
        db.run(
          "INSERT INTO activity (type, agent_id, user_id, metadata) VALUES (?, ?, ?, ?)",
          ["task_completed", agent_id, userId, JSON.stringify({ agent_name: agent.name })]
        );

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done", task_id: taskId })}\n\n`));
        controller.close();
      } catch (error) {
        console.error("Stream error:", error);
        db.run("UPDATE tasks SET status = 'failed' WHERE id = ?", [taskId]);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", message: "Something went wrong" })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
