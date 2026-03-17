import { NextRequest, NextResponse } from "next/server";
import db from "@/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "20");

  const activities = db.query(
    "SELECT * FROM activity ORDER BY created_at DESC LIMIT ?",
    [limit]
  );

  return NextResponse.json(activities);
}
