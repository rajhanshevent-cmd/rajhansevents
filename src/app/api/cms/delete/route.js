import { NextResponse } from "next/server";
import { deleteRecord, query } from "@/lib/db";
import { deleteR2File } from "@/lib/r2";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function POST(request) {
  const session = await getSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { table, identifier, idColumn = "identifier", slideKey } = body;

    if (!table || identifier === undefined || identifier === null) {
      return NextResponse.json(
        { error: "table and identifier are required." },
        { status: 400 }
      );
    }

    // Special handler: Clear an individual column/media file (e.g. image_url, brochure_url, logo_url, slide_N_url)
    const targetColumnKey = slideKey || body.columnKey;
    if (targetColumnKey && (table === "home_content" || table === "about_us")) {
      const rows = await query(
        `SELECT * FROM ${table} WHERE "${idColumn}" = $1 LIMIT 1`,
        [identifier || (table === "home_content" ? "home_main" : "about_main")]
      );
      if (rows && rows[0] && rows[0][targetColumnKey]) {
        const fileUrl = rows[0][targetColumnKey];
        await deleteR2File(fileUrl);
        await query(
          `UPDATE ${table} SET "${targetColumnKey}" = NULL WHERE "${idColumn}" = $1`,
          [identifier || (table === "home_content" ? "home_main" : "about_main")]
        );
        if (targetColumnKey === "slide_1_url" && table === "home_content") {
          await query(
            `UPDATE home_content SET banner_video_url = NULL WHERE identifier = $1`,
            [identifier || "home_main"]
          );
        }
      }
      try {
        revalidatePath("/", "layout");
        revalidatePath("/");
        revalidatePath("/about");
        revalidatePath("/services");
      } catch (e) {
        console.warn("[Revalidate error]:", e.message);
      }
      return NextResponse.json({
        success: true,
        message: `Cleared ${targetColumnKey} and deleted media file from R2.`
      });
    }

    // 1. Fetch existing record to locate stored media assets before deletion
    let existingRecord = null;
    const mediaFilesToDelete = new Set();

    try {
      const rows = await query(
        `SELECT * FROM ${table} WHERE "${idColumn}" = $1 LIMIT 1`,
        [identifier]
      );
      existingRecord = rows && rows[0] ? rows[0] : null;
    } catch (e) {
      console.warn(`[CMS Delete] Could not pre-query ${table}:`, e.message);
    }

    if (existingRecord) {
      // Gather any media URLs attached to this record
      const possibleUrlKeys = [
        "image_url",
        "photo_url",
        "media_url",
        "thumbnail_url",
        "video_url",
        "logo_url",
        "slide_1_url",
        "slide_2_url",
        "slide_3_url",
        "slide_4_url",
        "banner_video_url",
        "brochure_url",
      ];

      for (const key of possibleUrlKeys) {
        if (existingRecord[key] && typeof existingRecord[key] === "string") {
          mediaFilesToDelete.add(existingRecord[key]);
        }
      }
    }

    // 2. Handle cascade cleanup for gallery child tables
    if (table === "portfolio") {
      try {
        const portId = existingRecord && existingRecord.id ? existingRecord.id : identifier;
        const galleryImgs = await query(
          `SELECT * FROM event_images WHERE event_id = $1`,
          [portId]
        );
        for (const g of galleryImgs || []) {
          if (g.image_url) mediaFilesToDelete.add(g.image_url);
        }
        await query(`DELETE FROM event_images WHERE event_id = $1`, [portId]);
      } catch (e) {
        console.warn("[CMS Delete] Error deleting cascade event_images:", e.message);
      }
    }

    if (table === "expertise") {
      try {
        const galleryImgs = await query(
          `SELECT * FROM expertise_images WHERE expertise_identifier = $1`,
          [identifier]
        );
        for (const g of galleryImgs || []) {
          if (g.image_url) mediaFilesToDelete.add(g.image_url);
        }
        await query(`DELETE FROM expertise_images WHERE expertise_identifier = $1`, [identifier]);
      } catch (e) {
        console.warn("[CMS Delete] Error deleting cascade expertise_images:", e.message);
      }
    }

    // 3. Delete record from Neon PostgreSQL database
    const deleted = await deleteRecord(table, identifier, idColumn);

    // 4. Delete physical assets from Cloudflare R2 if applicable
    for (const fileUrl of mediaFilesToDelete) {
      try {
        await deleteR2File(fileUrl);
      } catch (err) {
        console.warn("[CMS Delete] R2 cleanup notice:", err.message);
      }
    }

    // 5. Revalidate cache
    try {
      revalidatePath("/", "layout");
      revalidatePath("/");
      revalidatePath("/about");
      revalidatePath("/services");
      revalidatePath("/packages");
      revalidatePath("/portfolio");
      revalidatePath("/testimonials");
      revalidatePath("/contact");
    } catch (e) {
      console.warn("[CMS Revalidate Warning on Delete]:", e.message);
    }

    return NextResponse.json({
      success: true,
      data: deleted,
      cleanedMediaCount: mediaFilesToDelete.size,
    });
  } catch (error) {
    console.error("[CMS Delete Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete record from database." },
      { status: 500 }
    );
  }
}
