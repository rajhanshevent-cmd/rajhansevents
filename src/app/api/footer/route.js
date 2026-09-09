import { NextResponse } from "next/server";
import { getSingle, getAll } from "@/lib/db";

export async function GET() {
  try {
    const [contact, home, services] = await Promise.all([
      getSingle("contact_info", "contact_main"),
      getSingle("home_content", "home_main"),
      getAll("services", "created_at ASC", 6),
    ]);

    return NextResponse.json({
      contact,
      home,
      services: services || [],
    });
  } catch (error) {
    console.error("[Footer API Error]:", error);
    return NextResponse.json(
      { contact: null, home: null, services: [] },
      { status: 500 }
    );
  }
}
