"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const WhatsAppWidget = dynamic(
  () => import("@/component/WhatsAppWidget"),
  { ssr: false }
);

export default function WidgetLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return show ? <WhatsAppWidget /> : null;
}