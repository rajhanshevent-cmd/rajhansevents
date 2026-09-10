import { NextResponse } from "next/server";
import { sendTestEmail, EMAIL_CONFIG } from "@/lib/resend";
import { getSession } from "@/lib/session";

/**
 * Diagnostic & Testing endpoint: Test Resend API configuration & dispatch
 */
export async function POST(request) {
  try {
    const session = await getSession();
    // Allow if authenticated admin or in development environment
    if (!session.authenticated && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
    }

    let to = EMAIL_CONFIG.adminEmail;
    try {
      const body = await request.json();
      if (body?.to) to = body.to.trim();
    } catch {
      // Body is optional
    }

    const result = await sendTestEmail({ to });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to dispatch test email via Resend.",
          config: {
            from: EMAIL_CONFIG.fromEmail,
            to,
            hasApiKey: Boolean(process.env.RESEND_API_KEY?.trim()),
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test email successfully dispatched via Resend to ${to}`,
      data: result,
    });
  } catch (error) {
    console.error("[Resend Test API Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute email test." },
      { status: 500 }
    );
  }
}
