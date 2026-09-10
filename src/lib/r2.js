import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

/**
 * Cloudflare R2 Client (S3 Compatible)
 * Configured dynamically from environment variables.
 */
let cachedS3Client = null;

export function getR2Client() {
  if (cachedS3Client) return cachedS3Client;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Cloudflare R2 environment variables (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY) are missing."
      );
    }
    console.warn(
      "[R2 Warning] Cloudflare R2 credentials are not configured. Uploads will not succeed until configured."
    );
    return null;
  }

  cachedS3Client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });

  return cachedS3Client;
}

export function getR2BucketName() {
  return process.env.R2_BUCKET_NAME || "rajhansevent";
}

export function getR2PublicUrl() {
  return (
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
    `https://${process.env.R2_BUCKET_NAME || "rajhansevents-media"}.r2.dev`
  ).replace(/\/$/, "");
}

/**
 * Delete a file from Cloudflare R2 storage by its URL or key.
 */
export async function deleteR2File(fileUrlOrKey) {
  if (!fileUrlOrKey) return false;
  const s3 = getR2Client();
  if (!s3) return false;

  try {
    let key = fileUrlOrKey.trim();
    const publicUrl = getR2PublicUrl();
    if (key.startsWith(publicUrl)) {
      key = key.replace(`${publicUrl}/`, "");
    } else if (key.startsWith("http://") || key.startsWith("https://")) {
      const urlObj = new URL(key);
      key = urlObj.pathname.replace(/^\//, "");
    }

    if (!key) return false;

    const command = new DeleteObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
    });

    await s3.send(command);
    return true;
  } catch (err) {
    console.warn("[R2 Delete Warning]:", err.message);
    return false;
  }
}
