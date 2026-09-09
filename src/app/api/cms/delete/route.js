import { NextResponse } from "next/server";
import { deleteRecord } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function POST(request) {
  const session = await getSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { table, identifier } = await request.json();

    if (!table || !identifier) {
      return NextResponse.json(
        { error: "table and identifier are required." },
        { status: 400 }
      );
    }

    const deleted = await deleteRecord(table, identifier);

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

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("[CMS Delete Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete record." },
      { status: 500 }
    );
  }
}
