import { NextResponse } from "next/server";
import { getAll, query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await getAll("expertise", "created_at ASC");

    if (!items || items.length === 0) {
      return NextResponse.json({ data: [] });
    }

    let galleryImages = [];
    try {
      galleryImages = await query(
        `SELECT * FROM expertise_images ORDER BY display_order ASC, id ASC`
      );
    } catch (err) {
      console.warn("[Expertise API] expertise_images query notice:", err.message);
    }

    const imagesByIdentifier = {};
    for (const img of galleryImages) {
      const key = String(img.expertise_identifier);
      if (!imagesByIdentifier[key]) imagesByIdentifier[key] = [];
      imagesByIdentifier[key].push(img);
    }

    const enrichedItems = items.map((item) => {
      const associated = imagesByIdentifier[String(item.identifier)] || [];

      let images = [];
      if (associated.length > 0) {
        images = associated.map((img) => ({
          id: img.id,
          image_url: img.image_url,
          caption: img.caption || "",
          alt_text: img.alt_text || item.title || "",
          display_order: img.display_order ?? 0,
        }));
      } else if (item.image_url) {
        images = [
          {
            id: `cover-${item.identifier}`,
            image_url: item.image_url,
            caption: item.title || "",
            alt_text: item.title || "",
            display_order: 0,
          },
        ];
      }

      return {
        ...item,
        story: item.story || "",
        images,
      };
    });

    return NextResponse.json({ data: enrichedItems });
  } catch (error) {
    console.error("[Expertise API Error]:", error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
