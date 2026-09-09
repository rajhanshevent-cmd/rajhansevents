"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./admin.css";

function AdminLoginContent() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [checking, setChecking] = useState(true);

  // Form State for Password Login
  const [inputEmail, setInputEmail] = useState("rajhanshevent@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive error messages from URL parameters
  const oauthErrorMessage = useMemo(() => {
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
      return "Google authentication failed. Please retry or use your admin password.";
    }
    if (err === "server_config") {
      return "Server error: Google OAuth credentials need configuration. Use password login below.";
    }
    return "";
  }, [searchParams]);

  const activeError = localError || oauthErrorMessage;

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

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inputEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLocalError(data.error || "Authentication failed. Please verify your credentials.");
        setLoading(false);
        return;
      }

      // Success: redirect to CMS dashboard
      router.push(data.redirect || "/Manage");
    } catch (err) {
      console.error("Login request failed:", err);
      setLocalError("Unable to connect to the authentication service. Please try again.");
      setLoading(false);
    }
  };

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
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <p style={{ color: "#D4AF37", fontWeight: 600 }}>Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        {isAdmin ? (
          <div className="admin-active-box">
            <span className="admin-badge">ACCESS GRANTED</span>
            <h2 className="admin-title">Administrator Active</h2>
            <p className="admin-subtitle">
              Authenticated as: <strong style={{ color: "#7b1a28" }}>{adminEmail}</strong>
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
              <button
                type="button"
                onClick={() => router.push("/Manage")}
                className="open-cms-btn"
              >
                OPEN CMS DASHBOARD &rarr;
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="admin-signout-btn"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <>
            <span className="admin-badge">MANAGEMENT PORTAL</span>
            <h1 className="admin-title">Admin Sign In</h1>
            <p className="admin-subtitle">
              Enter your credentials to access the Raj Hans Events CMS Dashboard.
            </p>

            {activeError && (
              <div className="admin-alert-error">
                <strong>Attention:</strong> {activeError}
              </div>
            )}

            {/* Direct Password Login Form */}
            <form onSubmit={handlePasswordLogin} className="admin-form">
              <div className="form-group">
                <label htmlFor="admin-email">Admin Email</label>
                <input
                  id="admin-email"
                  type="email"
                  className="form-input"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="rajhanshevent@gmail.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="admin-password">Password</label>
                <input
                  id="admin-password"
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  required
                />
              </div>

              <button
                type="submit"
                className="admin-submit-btn"
                disabled={loading}
              >
                {loading ? "AUTHENTICATING..." : "SIGN IN TO CMS"}
              </button>
            </form>

            <div className="admin-divider">
              <span>OR</span>
            </div>

            {/* Google OAuth Option */}
            <a href="/api/auth/google" className="google-auth-btn">
              <svg width="18" height="18" viewBox="0 0 24 24">
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
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="admin-login-wrapper">
          <div className="admin-login-card">
            <p style={{ color: "#D4AF37", fontWeight: 600 }}>Loading admin portal...</p>
          </div>
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}