"use client";

import React, { useState } from "react";
import { BUSINESS_CONFIG } from "@/utils/constants";
import "./CalendlyButton.css";

export default function CalendlyButton({ className, text, children }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const { openPopupWidget } = await import("react-calendly");
      openPopupWidget({
        url: BUSINESS_CONFIG.calendlyUrl,
        rootElement: document.body,
      });
    } catch (err) {
      console.error("Calendly load error:", err);
      window.open(BUSINESS_CONFIG.calendlyUrl, "_blank");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className || "btn btn-primary"}
      disabled={loading}
      aria-label={text || "Book Consultation"}
    >
      {loading ? "Opening Calendar..." : (children || text || "Book an Appointment")}
    </button>
  );
}
