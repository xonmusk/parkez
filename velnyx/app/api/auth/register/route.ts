import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import db from "@/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = db.get("SELECT id FROM users WHERE email = ?", [email]);
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const password_hash = await hash(password, 10);
    const userRole = role === "seller" || role === "both" ? "seller" : "buyer";

    const result = db.run(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [name, email, password_hash, userRole]
    );

    return NextResponse.json({ id: result.lastInsertRowid, success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
