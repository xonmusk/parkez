import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const task = db.get(
    `SELECT t.*, a.name as agent_name, a.icon as agent_icon, a.slug as agent_slug
     FROM tasks t JOIN agents a ON t.agent_id = a.id
     WHERE t.id = ? AND t.buyer_id = ?`,
    [params.id, (session.user as any).id]
  );

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(task);
}
