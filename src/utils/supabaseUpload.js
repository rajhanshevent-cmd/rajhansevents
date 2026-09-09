import { supabase } from "./supabaseClient";

const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "mp4", "webm", "mov"]);
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export const uploadImage = async (file, bucket) => {
  if (!file) return null;

  const fileExt = (file.name.split(".").pop() || "").toLowerCase();

  // Security guard: restrict allowed file extensions
  if (!ALLOWED_EXTENSIONS.has(fileExt)) {
    throw new Error(`File type .${fileExt} is not permitted. Allowed types: jpg, jpeg, png, webp, mp4, webm.`);
  }

  // Security guard: size limitations
  if (file.type.startsWith("video/") && file.size > MAX_VIDEO_SIZE) {
    throw new Error("Video file exceeds the 50MB limit. Please compress before uploading.");
  }
  if (file.type.startsWith("image/") && file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image file exceeds the 10MB limit.");
  }

  // Clean, sanitized, randomized file name
  const sanitizedBase = file.name.substring(0, file.name.lastIndexOf(".")).replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `${Date.now()}_${sanitizedBase}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false
    });

  if (error) {
    console.error(`Error uploading to ${bucket}:`, error);
    throw error;
  }

  const { data: publicURL } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return publicURL.publicUrl;
};