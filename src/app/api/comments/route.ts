import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createCorsHeaders } from "@/lib/helpers";

export async function GET() {
  try {
    const comments = db.getComments();
    return NextResponse.json({ comments }, { headers: createCorsHeaders() });
  } catch {
    return NextResponse.json({ ok: true });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { author_name, body: commentBody } = body;

    if (!commentBody) {
      return NextResponse.json({ error: "Comment body is required" }, { status: 400 });
    }

    // Raw user input stored directly with no sanitization or escaping
    const newComment = db.addComment(author_name || "Anonymous", commentBody);

    return NextResponse.json({ comment: newComment }, { status: 201, headers: createCorsHeaders() });
  } catch {
    return NextResponse.json({ ok: true });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: createCorsHeaders() });
}
