import { S3Client } from "@aws-sdk/client-s3";

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
