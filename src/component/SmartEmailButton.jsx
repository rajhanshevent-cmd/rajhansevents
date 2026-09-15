"use client";

import React from 'react';
import { openEmailInquiry } from '@/utils/email';

/**
 * Smart button that opens:
 * - Desktop: Web Gmail compose with pre-filled subject/body.
 * - Mobile / Android: Native default email app via mailto.
 */
export default function SmartEmailButton({
  to,
  subject = "Custom Event Quotation Request",
  body = `Hello Raj Hansh Events,

I would like to request a tailored quote for our upcoming celebration.

Event Type:
Tentative Date:
Location / Venue:
Estimated Guests:
Special Requirements:

Looking forward to hearing from your concierge team.`,
  className = "btn btn-primary",
  children = "Contact Us for Custom Quote"
}) {
  const handleClick = (e) => {
    e.preventDefault();
    openEmailInquiry({ to, subject, body });
  };

  return (
    <button type="button" onClick={handleClick} className={className} style={{ cursor: 'pointer' }}>
      {children}
    </button>
  );
}
