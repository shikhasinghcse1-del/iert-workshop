import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createCorsHeaders } from "@/lib/helpers";

export async function POST(req: Request) {
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

    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    // Step 1: Check coupon state (Check-then-Act vulnerability)
    const coupon = db.getCoupon(code);
    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404, headers: createCorsHeaders() });
    }

    if (coupon.used_count >= coupon.max_uses) {
      return NextResponse.json(
        { error: "Coupon maximum uses exceeded", used_count: coupon.used_count },
        { status: 400, headers: createCorsHeaders() }
      );
    }

    // Step 2: Artificial latency window (simulating remote DB transaction / network latency)
    await new Promise((resolve) => setTimeout(resolve, 80));

    // Step 3: Act (non-atomic mutation after asynchronous delay window)
    const result = db.redeemCoupon(currentUser.id, code, coupon.discount_credits);

    return NextResponse.json(
      {
        message: "Coupon redeemed successfully",
        credits_added: coupon.discount_credits,
        total_credits: result.credits,
        used_count: result.coupon.used_count,
      },
      { status: 200, headers: createCorsHeaders() }
    );
  } catch {
    return NextResponse.json({ ok: true });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: createCorsHeaders() });
}
