import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return new TextEncoder().encode(
      "local-dev-secret-key-must-be-changed-in-production-min-32-chars"
    );
  }
  return new TextEncoder().encode(secret);
}

export default async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Protect /Manage and any sub-routes
  if (pathname.startsWith("/Manage")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL("/admin?error=unauthorized", request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const secretKey = getSecretKey();
      const { payload } = await jwtVerify(token, secretKey);

      if (payload.role !== "admin") {
        const loginUrl = new URL("/admin?error=unauthorized", request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch {
      // Invalid or expired token
      const loginUrl = new URL("/admin?error=session_expired", request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Manage/:path*"],
};
