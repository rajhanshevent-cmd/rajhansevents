import { NextResponse } from "next/server";
import { insert, query, deleteRecord } from "@/lib/db";
import { sendEnquiryEmails } from "@/lib/resend";
import { getSession } from "@/lib/session";

/**
 * Public Endpoint: Submit client celebration enquiry
 * - Saves record to Neon DB 'enquiries' table
 * - Triggers Resend transactional emails:
 *   1. High-priority notification to Admin Desk (rajhanshevent@gmail.com)
 *   2. Royal confirmation / acknowledgement to Client
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, eventType, eventDate, guests, budget, message } = body;

    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim();
    const trimmedPhone = phone?.trim();

    if (!trimmedName || !trimmedEmail) {
      return NextResponse.json(
        { error: "Name and email address are required to submit an enquiry." },
        { status: 400 }
      );
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const payload = {
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone || null,
      event_type: eventType?.trim() || "Wedding",
      event_date: eventDate?.trim() || null,
      guests: guests ? String(guests).trim() : null,
      budget: budget?.trim() || null,
      message: message?.trim() || null,
    };

    // 1. Persist to Neon DB
    const record = await insert("enquiries", payload);

    // 2. Dispatch Resend Transactional Emails asynchronously
    // Using Promise.allSettled internally so it never breaks DB return
    let emailStatus = null;
    try {
      emailStatus = await sendEnquiryEmails({
        id: record?.id,
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        eventType: payload.event_type,
        eventDate: payload.event_date,
        guests: payload.guests,
        budget: payload.budget,
        message: payload.message,
      });
    } catch (emailErr) {
      console.error("[Enquiry Email Dispatch Failed]:", emailErr);
      emailStatus = { status: "error", error: emailErr.message };
    }

    return NextResponse.json({
      success: true,
      data: record,
      emailStatus,
      message: "Enquiry submitted successfully! A confirmation email has been dispatched.",
    });
  } catch (error) {
    console.error("[Enquiry API Error]:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}

/**
 * Protected Endpoint: Retrieve inquiries for CMS /Manage
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const rows = await query("SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 100;");
    return NextResponse.json({ success: true, data: rows || [] });
  } catch (error) {
    console.error("[Enquiry GET API Error]:", error);
    return NextResponse.json(
      { error: "Failed to retrieve enquiries." },
      { status: 500 }
    );
  }
}

/**
 * Protected Endpoint: Delete an inquiry from CMS
 */
export async function DELETE(request) {
  try {
    const session = await getSession();
    if (!session.authenticated) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json({ error: "Enquiry ID is required." }, { status: 400 });
    }

    await deleteRecord("enquiries", id, "id");
    return NextResponse.json({ success: true, message: `Enquiry #${id} deleted.` });
  } catch (error) {
    console.error("[Enquiry DELETE API Error]:", error);
    return NextResponse.json(
      { error: "Failed to delete enquiry." },
      { status: 500 }
    );
  }
}
