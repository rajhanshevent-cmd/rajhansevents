"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./admin.css";

function AdminLoginContent() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive error messages directly from URL parameters without cascading render effects
  const errorMessage = useMemo(() => {
    const err = searchParams.get("error");
    const attempted = searchParams.get("attempted");

    if (err === "unauthorized") {
      return attempted
        ? `Access Denied: The account "${attempted}" is not authorized as an administrator.`
        : "Access Denied: Your Google account is not on the administrator whitelist.";
    }
    if (err === "session_expired") {
      return "Your session has expired. Please sign in again.";
    }
    if (err === "oauth_failed" || err === "token_exchange_failed") {
      return "Google authentication failed. Please retry.";
    }
    if (err === "server_config") {
      return "Server error: Google OAuth credentials are not properly configured.";
    }
    return "";
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (isMounted && data.authenticated) {
          setIsAdmin(true);
          setAdminEmail(data.email || "");
        }
      } catch (e) {
        console.error("Session check failed:", e);
      } finally {
        if (isMounted) setChecking(false);
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAdmin(false);
      setAdminEmail("");
      router.refresh();
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  if (checking) {
    return (
      <div className="admin-login-container">
        <p style={{ color: "#DAA520", fontWeight: 600 }}>Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="admin-login-container">
      {isAdmin ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", alignItems: "center", textAlign: "center" }}>
          <h2>Administrator Session Active</h2>
          <p style={{ color: "#666", fontSize: "0.95rem" }}>
            Signed in as: <strong style={{ color: "#7b1a28" }}>{adminEmail}</strong>
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => router.push("/Manage")}
              style={{
                padding: "10px 22px",
                background: "linear-gradient(135deg, #7b1a28, #9c2438)",
                color: "#D4AF37",
                border: "1px solid #D4AF37",
                borderRadius: "6px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Open CMS Dashboard
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2>Admin Portal</h2>
          <p style={{ color: "#555", fontSize: "0.9rem", textAlign: "center", marginBottom: "1.5rem" }}>
            Secure sign-in for Raj Hans Events administrators. Only authorized accounts will be granted access.
          </p>

          {errorMessage && (
            <div
              style={{
                background: "rgba(197, 48, 48, 0.1)",
                border: "1px solid #c53030",
                color: "#9b2c2c",
                padding: "12px 16px",
                borderRadius: "8px",
                fontSize: "0.88rem",
                marginBottom: "1.5rem",
                textAlign: "center",
                lineHeight: "1.4",
              }}
            >
              {errorMessage}
            </div>
          )}

          <a
            href="/api/auth/google"
            className="google-btn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "12px 20px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              width: "100%",
              textDecoration: "none",
              boxSizing: "border-box",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign in with Google
          </a>
        </>
      )}
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="admin-login-container">
          <p style={{ color: "#DAA520", fontWeight: 600 }}>Loading admin portal...</p>
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}