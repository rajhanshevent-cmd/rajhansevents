import { NextResponse } from "next/server";
import { destroySession } from "@/lib/session";

export async function POST(request) {
  await destroySession();
  const requestUrl = new URL(request.url);
  const isLocal = requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1";
  const origin = isLocal
    ? requestUrl.origin
    : (process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin);
  return NextResponse.json({ success: true, redirect: `${origin}/admin` });
}

export async function GET(request) {
  await destroySession();
  const requestUrl = new URL(request.url);
  const isLocal = requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1";
  const origin = isLocal
    ? requestUrl.origin
    : (process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin);
  return NextResponse.redirect(new URL("/admin", origin));
}
