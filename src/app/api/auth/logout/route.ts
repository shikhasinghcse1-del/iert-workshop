import { NextResponse } from "next/server";
import { createCorsHeaders } from "@/lib/helpers";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" }, { headers: createCorsHeaders() });
  response.cookies.delete("flowvault_session");
  response.cookies.delete("flowvault_role");
  response.cookies.delete("flowvault_user_id");
  return response;
}
