import { NextResponse } from "next/server";
import { createSession } from "@/lib/session";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const authError = requestUrl.searchParams.get("error");
  const isLocal = requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1";
  const origin = isLocal
    ? requestUrl.origin
    : (process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin);

  if (authError || !code) {
    console.error("[Google OAuth Error]", authError || "No authorization code provided");
    return NextResponse.redirect(new URL("/admin?error=oauth_failed", origin));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    `${origin}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    console.error("[Google OAuth Error] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
    return NextResponse.redirect(new URL("/admin?error=server_config", origin));
  }

  try {
    // 1. Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error("[Google OAuth Token Error]", errText);
      return NextResponse.redirect(new URL("/admin?error=token_exchange_failed", origin));
    }

    const tokenData = await tokenResponse.json();

    // 2. Fetch user profile from Google UserInfo endpoint
    const userinfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );

    if (!userinfoResponse.ok) {
      console.error("[Google OAuth UserInfo Error] Failed to retrieve user details");
      return NextResponse.redirect(new URL("/admin?error=profile_fetch_failed", origin));
    }

    const profile = await userinfoResponse.json();
    const userEmail = (profile.email || "").toLowerCase().trim();

    // 3. Strict Administrator Whitelist Check
    const allowedSingle = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
    const allowedMultiple = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.toLowerCase().trim())
      .filter(Boolean);

    const isAuthorized =
      (allowedSingle && userEmail === allowedSingle) ||
      allowedMultiple.includes(userEmail);

    if (!isAuthorized) {
      console.warn(`[Security Alert] Unauthorized login attempt by: ${userEmail}`);
      return NextResponse.redirect(
        new URL(`/admin?error=unauthorized&attempted=${encodeURIComponent(userEmail)}`, origin)
      );
    }

    // 4. Issue secure encrypted HTTP-only session cookie
    await createSession(userEmail);

    return NextResponse.redirect(new URL("/Manage", origin));
  } catch (error) {
    console.error("[Google OAuth Unexpected Error]:", error);
    return NextResponse.redirect(new URL("/admin?error=unexpected_error", origin));
  }
}
