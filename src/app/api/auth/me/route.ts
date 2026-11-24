import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createCorsHeaders } from "@/lib/helpers";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const sessionMatch = cookieHeader.match(/flowvault_session=([^;]+)/);
    const authHeader = req.headers.get("authorization");
    const token = sessionMatch ? sessionMatch[1] : authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401, headers: createCorsHeaders() });
    }

    const user = db.getUserBySession(token);
    if (!user) {
      return NextResponse.json({ error: "Session expired" }, { status: 401, headers: createCorsHeaders() });
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          credits: user.credits,
        },
      },
      { headers: createCorsHeaders() }
    );
  } catch {
    return NextResponse.json({ ok: true });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: createCorsHeaders() });
}
