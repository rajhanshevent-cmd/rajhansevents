import { NextResponse } from "next/server";
import { getAll } from "@/lib/db";

export async function GET() {
  try {
    const items = await getAll("portfolio", "created_at DESC");
    return NextResponse.json({ data: items });
  } catch (error) {
    console.error("[Portfolio API Error]:", error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
