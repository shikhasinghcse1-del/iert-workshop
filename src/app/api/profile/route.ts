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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: createCorsHeaders() });
    }

    const currentUser = db.getUserBySession(token);
    if (!currentUser) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401, headers: createCorsHeaders() });
    }

    return NextResponse.json({ user: currentUser }, { headers: createCorsHeaders() });
  } catch {
    return NextResponse.json({ ok: true });
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const sessionMatch = cookieHeader.match(/flowvault_session=([^;]+)/);
    const authHeader = req.headers.get("authorization");
    const token = sessionMatch ? sessionMatch[1] : authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: createCorsHeaders() });
    }

    const currentUser = db.getUserBySession(token);
    if (!currentUser) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401, headers: createCorsHeaders() });
    }

    // Mass assignment: directly unpacking req.json() into the user entity without field whitelisting
    const body = await req.json();
    const updated = db.updateUser(currentUser.id, body);

    const response = NextResponse.json(
      {
        message: "Profile updated successfully",
        user: updated,
      },
      { headers: createCorsHeaders() }
    );

    if (updated?.role) {
      response.cookies.set("flowvault_role", updated.role, { path: "/" });
    }

    return response;
  } catch {
    return NextResponse.json({ ok: true });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: createCorsHeaders() });
}
