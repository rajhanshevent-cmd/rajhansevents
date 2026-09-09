"use client";

import React from "react";
import { openCalendlyModal } from "./CalendlyModal";
import "./CalendlyButton.css";

export default function CalendlyButton({ className, text, children, ...props }) {
  const handleClick = () => {
    openCalendlyModal();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className || "btn btn-primary"}
      aria-label={text || "Book Consultation"}
      {...props}
    >
      {children || text || "Book an Appointment"}
    </button>
  );
}
