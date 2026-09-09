import { NextResponse } from "next/server";
import { getAll } from "@/lib/db";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const session = await getSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const table = searchParams.get("table");

  if (!table) {
    return NextResponse.json({ error: "table query parameter is required." }, { status: 400 });
  }

  try {
    const data = await getAll(table, "created_at ASC");
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(`[CMS List Error - ${table}]:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch records." },
      { status: 500 }
    );
  }
}
