import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createCorsHeaders } from "@/lib/helpers";

const UPLOAD_DIR = "/tmp/flowvault-uploads";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // Unrestricted file upload: No validation of file extension, magic bytes, or MIME type
    const originalName = file.name || "uploaded-file.bin";
    const safeBaseName = path.basename(originalName); // Prevent path traversal escaping /tmp/flowvault-uploads
    const targetPath = path.join(UPLOAD_DIR, safeBaseName);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(targetPath, buffer);

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        file: {
          original_name: originalName,
          saved_path: targetPath,
          size_bytes: file.size,
          mime_type: file.type || "application/octet-stream",
        },
      },
      { status: 201, headers: createCorsHeaders() }
    );
  } catch {
    return NextResponse.json({ ok: true });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: createCorsHeaders() });
}
