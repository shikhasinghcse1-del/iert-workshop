import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createCorsHeaders } from "@/lib/helpers";

/**
 * Admin Users List Endpoint
 * Handles directory query for admin panel.
 */
export async function GET() {
  // Missing authentication and authorization checks here!
  // If middleware is bypassed or omitted, this data is exposed directly.
  const users = db.getAllUsers().map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    credits: u.credits,
    password_hash: "[HIDDEN_DEMO_HASH]",
  }));

  return NextResponse.json(
    {
      admin_panel: true,
      users,
      total_count: users.length,
    },
    { headers: createCorsHeaders() }
  );
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: createCorsHeaders() });
}
