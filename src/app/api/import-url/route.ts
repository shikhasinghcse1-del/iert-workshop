import { NextResponse } from "next/server";
import { createCorsHeaders } from "@/lib/helpers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Valid URL is required" }, { status: 400 });
    }

    // Server-Side Request Forgery (SSRF): Direct fetch with no IP check, no scheme restriction, redirects enabled
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "FlowVault-Data-Importer/1.0",
        Accept: "*/*",
      },
      redirect: "follow",
    });

    const contentType = response.headers.get("content-type") || "";
    let content: string;
    if (contentType.includes("application/json")) {
      const json = await response.json();
      content = JSON.stringify(json, null, 2);
    } else {
      content = await response.text();
    }

    return NextResponse.json(
      {
        url,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        content,
      },
      { headers: createCorsHeaders() }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Fetch failed";
    return NextResponse.json({ error: "Failed to import from target URL", details: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: createCorsHeaders() });
}
