const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "mp4", "webm", "mov", "pdf", "doc", "docx"]);
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_DOCUMENT_SIZE = 35 * 1024 * 1024; // 35MB

/**
 * Uploads media directly to Cloudflare R2 via presigned S3 URLs.
 * High-performance direct browser-to-R2 upload avoiding Vercel serverless body size limits.
 *
 * @param {File} file The file object from file input
 * @param {string} folder Destination folder / category
 * @returns {Promise<string>} Public CDN URL of the uploaded asset
 */
export const uploadToR2 = async (file, folder = "general") => {
  if (!file) return null;

  const fileExt = (file.name.split(".").pop() || "").toLowerCase();

  // Guard: file extension
  if (!ALLOWED_EXTENSIONS.has(fileExt)) {
    throw new Error(
      `File type .${fileExt} is not permitted. Allowed types: jpg, jpeg, png, webp, mp4, webm, mov, pdf, doc, docx.`
    );
  }

  // Guard: file size
  if (file.type.startsWith("video/") && file.size > MAX_VIDEO_SIZE) {
    throw new Error("Video file exceeds the 50MB limit. Please compress before uploading.");
  }
  if (file.type.startsWith("image/") && file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image file exceeds the 10MB limit.");
  }
  if (["pdf", "doc", "docx"].includes(fileExt) && file.size > MAX_DOCUMENT_SIZE) {
    throw new Error("Document exceeds the 35MB limit.");
  }

  // 1. Request presigned upload URL from our secure API
  const presignRes = await fetch("/api/upload/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      folder: folder || "general",
    }),
  });

  if (!presignRes.ok) {
    const errorData = await presignRes.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to initialize upload session.");
  }

  const { uploadUrl, publicUrl } = await presignRes.json();

  // 2. Upload file directly from browser to Cloudflare R2
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text().catch(() => "");
    console.error("[Cloudflare R2 Direct PUT Error]:", uploadRes.status, errorText);
    throw new Error(`Upload to Cloudflare R2 failed (status ${uploadRes.status}): ${errorText || uploadRes.statusText}`);
  }

  return publicUrl;
};

// Drop-in alias for existing imports
export const uploadImage = uploadToR2;
export const uploadFileToR2 = uploadToR2;
