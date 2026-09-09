"use client";

import { useSyncExternalStore } from "react";
import { PopupButton } from "react-calendly";
import { BUSINESS_CONFIG } from "@/utils/constants";
import "./CalendlyButton.css";

const emptySubscribe = () => () => {};

export default function CalendlyButton() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isClient) return null;

  return (
    <PopupButton
      url={BUSINESS_CONFIG.calendlyUrl}
      rootElement={document.body}
      text="Book an Appointment"
      className="btn btn-primary"
    />
  );
}
