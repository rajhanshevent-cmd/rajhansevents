import { NextResponse } from "next/server";
import { getSingle } from "@/lib/db";
import { POST as handleEnquiryPost } from "../enquiry/route";

export async function GET() {
  try {
    const contact = await getSingle("contact_info", "contact_main");
    return NextResponse.json({ data: contact });
  } catch (error) {
    console.error("[Contact API Error]:", error);
    return NextResponse.json({ data: null }, { status: 500 });
  }
}

/**
 * Forward POST submissions to the central enquiry handler with Resend integration
 */
export async function POST(request) {
  return handleEnquiryPost(request);
}
