import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/db";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "popular";
  const q = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  let sql = `
    SELECT a.*, u.name as seller_name, u.avatar_url as seller_avatar
    FROM agents a
    JOIN users u ON a.seller_id = u.id
    WHERE a.status = 'active'
  `;
  const params: any[] = [];

  if (category) {
    sql += " AND a.category = ?";
    params.push(category);
  }
  if (q) {
    sql += " AND (a.name LIKE ? OR a.tagline LIKE ? OR a.tags LIKE ?)";
    const search = `%${q}%`;
    params.push(search, search, search);
  }

  switch (sort) {
    case "popular": sql += " ORDER BY a.tasks_completed DESC"; break;
    case "rating": sql += " ORDER BY a.rating_avg DESC"; break;
    case "newest": sql += " ORDER BY a.created_at DESC"; break;
    case "price_low": sql += " ORDER BY a.price_cents ASC"; break;
    case "price_high": sql += " ORDER BY a.price_cents DESC"; break;
    default: sql += " ORDER BY a.tasks_completed DESC";
  }

  sql += " LIMIT ? OFFSET ?";
  params.push(limit, offset);

  const agents = db.query(sql, params);
  return NextResponse.json(agents);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const user = db.get("SELECT role FROM users WHERE id = ?", [userId]);
  if (!user || (user as any).role !== "seller") {
    return NextResponse.json({ error: "Seller access required" }, { status: 403 });
  }

  const body = await req.json();
  const { name, tagline, description, category, icon, price_cents, system_prompt, welcome_message, example_input, example_output, tags } = body;

  if (!name || !tagline || !description || !category || !system_prompt || !price_cents) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  let slug = slugify(name);
  const existing = db.get("SELECT id FROM agents WHERE slug = ?", [slug]);
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const result = db.run(
    `INSERT INTO agents (seller_id, name, slug, tagline, description, category, icon, price_cents, system_prompt, welcome_message, example_input, example_output, tags)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, name, slug, tagline, description, category, icon || "🤖", price_cents, system_prompt, welcome_message || null, example_input || null, example_output || null, tags || null]
  );

  // Activity
  db.run(
    "INSERT INTO activity (type, agent_id, user_id, metadata) VALUES (?, ?, ?, ?)",
    ["new_agent", result.lastInsertRowid, userId, JSON.stringify({ agent_name: name })]
  );

  return NextResponse.json({ id: result.lastInsertRowid, slug, success: true });
}
