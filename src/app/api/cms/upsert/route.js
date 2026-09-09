import { NextResponse } from "next/server";
import { upsert } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(request) {
  // 1. Enforce admin session
  const session = await getSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { table, payload, conflictKey = "identifier" } = await request.json();

    if (!table || !payload) {
      return NextResponse.json(
        { error: "table and payload are required." },
        { status: 400 }
      );
    }

    const record = await upsert(table, payload, conflictKey);
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error("[CMS Upsert Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update record." },
      { status: 500 }
    );
  }
}
