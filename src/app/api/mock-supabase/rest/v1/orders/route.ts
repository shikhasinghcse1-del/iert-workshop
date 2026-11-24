import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createCorsHeaders } from "@/lib/helpers";

/**
 * Mock PostgREST endpoint simulating Supabase REST API
 * Demonstrates unauthenticated data leakage when Row Level Security (RLS) is disabled
 */
export async function GET(req: Request) {
  const apikey = req.headers.get("apikey") || req.headers.get("authorization")?.replace("Bearer ", "");

  const expectedAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "FAKE_SUPABASE_ANON_KEY_DO_NOT_USE_112233";

  // Check if anon key is provided
  if (!apikey || (apikey !== expectedAnonKey && !apikey.startsWith("FAKE_SUPABASE"))) {
    return NextResponse.json(
      { message: "Invalid API key" },
      { status: 401, headers: createCorsHeaders() }
    );
  }

  // Simulates table with RLS disabled (ALTER TABLE orders DISABLE ROW LEVEL SECURITY)
  // Dumps all rows across all tenant users to any client with the public anon key
  const allOrders = db.getAllOrders();

  return NextResponse.json(allOrders, {
    status: 200,
    headers: {
      ...createCorsHeaders(),
      "Content-Range": `0-${allOrders.length - 1}/${allOrders.length}`,
      "x-mock-supabase-rls": "disabled",
    },
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: createCorsHeaders() });
}
