"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function VerifyPage() {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState("Verifying credentials...");

  useEffect(() => {
    let isMounted = true;

    async function check() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          if (isMounted) router.push("/admin");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error || profile?.role !== "admin") {
          if (isMounted) setStatusMessage("Unauthorized. Signing out...");
          await supabase.auth.signOut();
          if (isMounted) router.push("/admin?error=unauthorized");
          return;
        }

        if (isMounted) {
          setStatusMessage("Authorized. Redirecting to Management Dashboard...");
          router.push("/Manage");
        }
      } catch (err) {
        console.error("Verification error:", err);
        if (isMounted) router.push("/admin?error=server_error");
      }
    }

    check();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      gap: "1rem",
      color: "var(--color-navy, #0B192C)",
      fontFamily: "var(--font-nunito, sans-serif)",
      padding: "2rem",
      textAlign: "center"
    }}>
      <div style={{
        width: "48px",
        height: "48px",
        border: "3px solid rgba(218, 165, 32, 0.2)",
        borderTopColor: "#DAA520",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>{statusMessage}</p>
    </div>
  );
}