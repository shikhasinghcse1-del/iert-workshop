import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createCorsHeaders } from "@/lib/helpers";

export async function POST(req: Request) {
  try {
    // Unvalidated raw payload extraction (no Zod validation)
    const body = await req.json();
    const { email, password } = body;

    const user = db.getUserByEmail(email);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401, headers: createCorsHeaders() }
      );
    }

    const token = db.createSession(user.id);

    // Logging raw authentication credentials & session tokens to console
    console.log("DEBUG SESSION TOKEN:", token, "FOR USER:", user.email);

    const response = NextResponse.json(
      {
        message: "Authentication successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          credits: user.credits,
        },
      },
      { status: 200, headers: createCorsHeaders() }
    );

    // Set session cookies
    response.cookies.set("flowvault_session", token, {
      path: "/",
      httpOnly: false, // Insecurely exposed to client JS
      sameSite: "lax",
    });
    response.cookies.set("flowvault_role", user.role, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
    });
    response.cookies.set("flowvault_user_id", user.id, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
    });

    return response;
  } catch {
    // Silent error swallowing pattern
    return NextResponse.json({ ok: true });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: createCorsHeaders() });
}
