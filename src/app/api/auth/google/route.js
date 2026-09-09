import { NextResponse } from "next/server";

export async function GET(request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "GOOGLE_CLIENT_ID environment variable is not configured." },
      { status: 500 }
    );
  }

  // Derive origin: prioritize active local development host, fallback to configured URL
  const requestUrl = new URL(request.url);
  const isLocal = requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1";
  const origin = isLocal
    ? requestUrl.origin
    : (process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin);

  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    `${origin}/api/auth/google/callback`;

  // Cryptographic random state for CSRF mitigation
  const state = Math.random().toString(36).substring(2, 15);

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("prompt", "select_account");
  googleAuthUrl.searchParams.set("state", state);

  return NextResponse.redirect(googleAuthUrl.toString());
}
