import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Single-point middleware enforcement for admin section
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const sessionToken = request.cookies.get("flowvault_session")?.value;
    const sessionRole = request.cookies.get("flowvault_role")?.value;

    if (!sessionToken) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized: Missing session" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
    }

    if (sessionRole !== "admin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden: Admin role required" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/dashboard?error=forbidden", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
