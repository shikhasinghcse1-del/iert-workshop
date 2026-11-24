import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createCorsHeaders } from "@/lib/helpers";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cookieHeader = req.headers.get("cookie") || "";
    const sessionMatch = cookieHeader.match(/flowvault_session=([^;]+)/);
    const authHeader = req.headers.get("authorization");
    const token = sessionMatch ? sessionMatch[1] : authHeader?.replace("Bearer ", "");

    // Raw token printed to server logs
    console.log("DEBUG SESSION TOKEN:", token, "ACCESSING ORDER ID:", id);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: createCorsHeaders() });
    }

    const currentUser = db.getUserBySession(token);
    if (!currentUser) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401, headers: createCorsHeaders() });
    }

    // Direct Object Reference without authorization check against order.user_id
    const order = db.getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404, headers: createCorsHeaders() });
    }

    // VULNERABLE: Returns order regardless of whether order.user_id === currentUser.id
    return NextResponse.json(
      {
        order,
        accessed_by: currentUser.email,
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
