import { NextResponse } from "next/server";
import { getSingle } from "@/lib/db";

export async function GET() {
  try {
    const contact = await getSingle("contact_info", "contact_main");
    return NextResponse.json({ data: contact });
  } catch (error) {
    console.error("[Contact API Error]:", error);
    return NextResponse.json({ data: null }, { status: 500 });
  }
}
