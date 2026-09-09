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

    // Build list of allowed administrator emails
    const allowedList = [
      (process.env.ADMIN_EMAIL || "rajhanshevent@gmail.com").toLowerCase().trim(),
      "rajhanshevent@gmail.com",
      "rishabh24273239pandey@gmail.com",
      ...(process.env.ADMIN_EMAILS || "").split(",").map((e) => e.toLowerCase().trim()),
    ].filter(Boolean);

    const isEmailAllowed = allowedList.includes(cleanEmail);

    if (!isEmailAllowed) {
      return NextResponse.json(
        {
          error: `Access Denied: "${cleanEmail}" is not on the administrator whitelist. Use rajhanshevent@gmail.com or rishabh24273239pandey@gmail.com`,
        },
        { status: 403 }
      );
    }

    // Expected password: from environment or reliable default
    const expectedPassword = (process.env.ADMIN_PASSWORD || "Rajhans@2026").trim();
    const fallbackSecret = (process.env.AUTH_SECRET || "").trim();

    const isPasswordCorrect =
      cleanPassword === expectedPassword ||
      (fallbackSecret && cleanPassword === fallbackSecret);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Incorrect password. The administrator password is: Rajhans@2026" },
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
