import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const agent = db.get(
    `SELECT a.*, u.name as seller_name, u.avatar_url as seller_avatar, u.bio as seller_bio
     FROM agents a JOIN users u ON a.seller_id = u.id
     WHERE a.slug = ?`,
    [params.slug]
  );

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const reviews = db.query(
    `SELECT r.*, u.name as buyer_name, u.avatar_url as buyer_avatar
     FROM reviews r JOIN users u ON r.buyer_id = u.id
     WHERE r.agent_id = ?
     ORDER BY r.created_at DESC
     LIMIT 20`,
    [(agent as any).id]
  );

  return NextResponse.json({ agent, reviews });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const agent = db.get("SELECT * FROM agents WHERE slug = ?", [params.slug]);

  if (!agent || (agent as any).seller_id !== parseInt(userId)) {
    return NextResponse.json({ error: "Not found or not authorized" }, { status: 403 });
  }

  const body = await req.json();
  const { name, tagline, description, category, icon, price_cents, system_prompt, welcome_message, example_input, example_output, tags, status } = body;

  db.run(
    `UPDATE agents SET
      name = COALESCE(?, name),
      tagline = COALESCE(?, tagline),
      description = COALESCE(?, description),
      category = COALESCE(?, category),
      icon = COALESCE(?, icon),
      price_cents = COALESCE(?, price_cents),
      system_prompt = COALESCE(?, system_prompt),
      welcome_message = COALESCE(?, welcome_message),
      example_input = COALESCE(?, example_input),
      example_output = COALESCE(?, example_output),
      tags = COALESCE(?, tags),
      status = COALESCE(?, status),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?`,
    [name, tagline, description, category, icon, price_cents, system_prompt, welcome_message, example_input, example_output, tags, status, (agent as any).id]
  );

  return NextResponse.json({ success: true });
}
