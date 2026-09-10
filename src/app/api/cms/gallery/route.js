import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { deleteR2File } from "@/lib/r2";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

/**
 * GET /api/cms/gallery?type=event&event_id=123
 * or GET /api/cms/gallery?type=expertise&expertise_identifier=exp-1
 */
export async function GET(request) {
  const session = await getSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "event";

  try {
    if (type === "expertise") {
      const expertiseIdentifier =
        searchParams.get("expertise_identifier") || searchParams.get("id");
      if (!expertiseIdentifier) {
        return NextResponse.json(
          { error: "expertise_identifier query parameter is required." },
          { status: 400 }
        );
      }
      const images = await query(
        `SELECT * FROM expertise_images WHERE expertise_identifier = $1 ORDER BY display_order ASC, id ASC`,
        [expertiseIdentifier]
      );
      return NextResponse.json({ success: true, data: images });
    }

    const eventId = searchParams.get("event_id") || searchParams.get("id");
    if (!eventId) {
      return NextResponse.json(
        { error: "event_id query parameter is required." },
        { status: 400 }
      );
    }

    const images = await query(
      `SELECT * FROM event_images WHERE event_id = $1 ORDER BY display_order ASC, id ASC`,
      [eventId]
    );
    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error("[CMS Gallery Fetch Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/cms/gallery
 * Manage gallery images for events or expertise.
 */
export async function POST(request) {
  const session = await getSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, type = "event" } = body;

    const tableName = type === "expertise" ? "expertise_images" : "event_images";
    const foreignKey = type === "expertise" ? "expertise_identifier" : "event_id";

    if (action === "add") {
      const targetId = type === "expertise" ? body.expertise_identifier : body.event_id;
      const { images } = body;

      if (!targetId || !Array.isArray(images) || images.length === 0) {
        return NextResponse.json(
          { error: `${foreignKey} and array of images are required.` },
          { status: 400 }
        );
      }

      // Determine the current maximum display_order
      const existing = await query(
        `SELECT COALESCE(MAX(display_order), -1) as max_order FROM ${tableName} WHERE "${foreignKey}" = $1`,
        [targetId]
      );
      let currentOrder = (existing[0]?.max_order ?? -1) + 1;

      const inserted = [];
      for (const img of images) {
        if (!img.image_url) continue;
        const res = await query(
          `INSERT INTO ${tableName} ("${foreignKey}", image_url, caption, alt_text, display_order)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [
            targetId,
            img.image_url,
            img.caption || "",
            img.alt_text || "",
            img.display_order !== undefined ? img.display_order : currentOrder++,
          ]
        );
        if (res && res[0]) inserted.push(res[0]);
      }

      triggerRevalidation();
      return NextResponse.json({ success: true, data: inserted });
    }

    if (action === "reorder") {
      const { orders } = body;
      if (!Array.isArray(orders)) {
        return NextResponse.json({ error: "orders array is required." }, { status: 400 });
      }

      for (const item of orders) {
        if (item.id !== undefined && item.display_order !== undefined) {
          await query(
            `UPDATE ${tableName} SET display_order = $1 WHERE id = $2`,
            [item.display_order, item.id]
          );
        }
      }

      triggerRevalidation();
      return NextResponse.json({ success: true, message: "Order updated successfully." });
    }

    if (action === "delete") {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ error: "id is required to delete." }, { status: 400 });
      }

      const deleted = await query(
        `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`,
        [id]
      );
      if (deleted && deleted[0] && deleted[0].image_url) {
        try {
          await deleteR2File(deleted[0].image_url);
        } catch (r2Err) {
          console.warn("[CMS Gallery Delete] R2 file delete warning:", r2Err.message);
        }
      }
      triggerRevalidation();
      return NextResponse.json({ success: true, data: deleted[0] || null });
    }

    return NextResponse.json({ error: `Unknown action: "${action}"` }, { status: 400 });
  } catch (error) {
    console.error("[CMS Gallery Action Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function triggerRevalidation() {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/portfolio");
  } catch (e) {
    console.warn("[CMS Gallery Revalidation Notice]:", e.message);
  }
}
