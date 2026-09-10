import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Client, getR2BucketName, getR2PublicUrl } from "@/lib/r2";
import { getSession } from "@/lib/session";

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "mp4", "webm", "mov", "pdf", "doc", "docx"]);
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
]);

export async function POST(request) {
  // 1. Verify administrator authentication
  const session = await getSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const s3 = getR2Client();
  if (!s3) {
    return NextResponse.json(
      { error: "Cloudflare R2 is not configured on the server." },
      { status: 500 }
    );
  }

  try {
    const { filename, contentType, folder = "general" } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "filename and contentType are required." },
        { status: 400 }
      );
    }

    const ext = (filename.split(".").pop() || "").toLowerCase();

    // Security validation
    if (!ALLOWED_EXTENSIONS.has(ext) || !ALLOWED_MIME_TYPES.has(contentType.toLowerCase())) {
      return NextResponse.json(
        { error: `File type .${ext} (${contentType}) is not permitted.` },
        { status: 400 }
      );
    }

    // Clean, sanitized, randomized key
    const sanitizedBase = filename
      .substring(0, filename.lastIndexOf("."))
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .substring(0, 50);

    const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "");
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const key = `${safeFolder}/${Date.now()}_${sanitizedBase}_${randomSuffix}.${ext}`;

    const bucketName = getR2BucketName();

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    // Generate presigned URL valid for 15 minutes (900 seconds)
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 900 });
    const publicUrl = `${getR2PublicUrl()}/${key}`;

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      key,
    });
  } catch (error) {
    console.error("[R2 Presign Error]:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL." },
      { status: 500 }
    );
  }
}
