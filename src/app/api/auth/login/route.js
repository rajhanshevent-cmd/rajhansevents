import { NextResponse } from "next/server";
import { createSession } from "@/lib/session";

export async function POST(request) {
  try {
    const body = await request.json();
    const cleanEmail = (body.email || "").toLowerCase().trim();
    const cleanPassword = (body.password || "").trim();

    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json(
        { error: "Please enter both administrator email and password." },
        { status: 400 }
      );
    }

    const allowedSingle = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
    const allowedMultiple = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.toLowerCase().trim())
      .filter(Boolean);

    const isEmailAllowed =
      (allowedSingle && cleanEmail === allowedSingle) ||
      allowedMultiple.includes(cleanEmail);

    if (!isEmailAllowed) {
      return NextResponse.json(
        { error: `Access Denied: The account "${cleanEmail}" is not authorized as an administrator.` },
        { status: 403 }
      );
    }

    // Configured password or fallback to AUTH_SECRET
    const expectedPassword = process.env.ADMIN_PASSWORD || process.env.AUTH_SECRET;

    if (!expectedPassword || cleanPassword !== expectedPassword) {
      return NextResponse.json(
        { error: "Incorrect password. Please verify your administrator credentials." },
        { status: 401 }
      );
    }

    // Issue encrypted HTTP-only session cookie
    await createSession(cleanEmail);

    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      redirect: "/Manage",
    });
  } catch (error) {
    console.error("[Admin Login Error]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login. Please try again." },
      { status: 500 }
    );
  }
}
