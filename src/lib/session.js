import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET environment variable is missing.");
    }
    console.warn(
      "[Auth Warning] AUTH_SECRET is not defined. Using temporary local fallback secret."
    );
    return new TextEncoder().encode("local-dev-secret-key-must-be-changed-in-production-min-32-chars");
  }
  return new TextEncoder().encode(secret);
}

/**
 * Sign a new session token for the authenticated admin.
 */
export async function signSession(payload) {
  const secretKey = getSecretKey();
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(secretKey);
}

/**
 * Verify an existing session token string.
 */
export async function verifySessionToken(token) {
  if (!token) return null;
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch {
    return null;
  }
}

/**
 * Create and set the encrypted session cookie on the current request.
 */
export async function createSession(email) {
  const token = await signSession({ email, role: "admin" });
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });

  return token;
}

/**
 * Retrieve and verify the current administrator session from cookies.
 */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return { authenticated: false };
  }

  const payload = await verifySessionToken(token);
  if (!payload || payload.role !== "admin") {
    return { authenticated: false };
  }

  return {
    authenticated: true,
    email: payload.email,
    role: payload.role,
  };
}

/**
 * Clear the administrator session cookie.
 */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
