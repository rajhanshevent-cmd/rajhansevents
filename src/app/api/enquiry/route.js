import { NextResponse } from "next/server";
import { insert } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, eventType, eventDate, guests, budget, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const payload = {
      name,
      email,
      phone: phone || null,
      event_type: eventType || null,
      event_date: eventDate || null,
      guests: guests || null,
      budget: budget || null,
      message: message || null,
    };

    const record = await insert("enquiries", payload);
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error("[Enquiry API Error]:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry." },
      { status: 500 }
    );
  }
}
