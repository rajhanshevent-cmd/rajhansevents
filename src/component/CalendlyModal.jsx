"use client";

import React, { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { BUSINESS_CONFIG } from "@/utils/constants";
import WhatsAppIcon from "@/component/WhatsAppIcon";
import "./CalendlyModal.css";

export const OPEN_CALENDLY_EVENT = "open-rajhans-calendly";
export const CLOSE_CALENDLY_EVENT = "close-rajhans-calendly";

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

/**
 * Global helper to trigger the Calendly small window from anywhere on the same tab.
 */
export function openCalendlyModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_CALENDLY_EVENT));
  }
}

/**
 * Global helper to close the Calendly modal.
 */
export function closeCalendlyModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CLOSE_CALENDLY_EVENT));
  }
}

export default function CalendlyModal({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
}) {
  const isClient = useIsClient();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const modalRef = useRef(null);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleClose = useCallback(() => {
    setIframeLoaded(false);
    if (isControlled && controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
  }, [isControlled, controlledOnClose]);

  // Listen for global custom events when uncontrolled
  useEffect(() => {
    if (isControlled) return;

    const onOpen = () => {
      setIframeLoaded(false);
      setInternalIsOpen(true);
    };
    const onClose = () => {
      setInternalIsOpen(false);
      setIframeLoaded(false);
    };

    window.addEventListener(OPEN_CALENDLY_EVENT, onOpen);
    window.addEventListener(CLOSE_CALENDLY_EVENT, onClose);

    // Also check for hash trigger (#book or #calendly)
    if (
      typeof window !== "undefined" &&
      (window.location.hash === "#book" || window.location.hash === "#calendly")
    ) {
      onOpen();
    }

    return () => {
      window.removeEventListener(OPEN_CALENDLY_EVENT, onOpen);
      window.removeEventListener(CLOSE_CALENDLY_EVENT, onClose);
    };
  }, [isControlled]);

  // Lock body scroll and handle Escape key while open
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  // Safety timeout: if iframe load event doesn't fire, remove spinner after 2.5s
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      setIframeLoaded(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen || !isClient) {
    return null;
  }

  // Construct iframe URL with optimal embed parameters
  const baseUrl = BUSINESS_CONFIG.calendlyUrl || "https://calendly.com/rajhanshevent/30min";
  let embedUrl = baseUrl;
  try {
    const u = new URL(baseUrl);
    const domain = typeof window !== "undefined" ? window.location.hostname : "rajhansevents.com";
    u.searchParams.set("embed_domain", domain);
    u.searchParams.set("embed_type", "Inline");
    u.searchParams.set("hide_landing_page_details", "1");
    u.searchParams.set("hide_gdpr_banner", "1");
    u.searchParams.set("primary_color", "b68d40");
    embedUrl = u.toString();
  } catch {
    embedUrl = `${baseUrl}?embed_domain=rajhansevents.com&embed_type=Inline&hide_landing_page_details=1&hide_gdpr_banner=1&primary_color=b68d40`;
  }

  const cleanPhone = (BUSINESS_CONFIG.phone || "+91 90060 89331").replace(/[^\d+]/g, "");
  const waUrl = `https://wa.me/${BUSINESS_CONFIG.whatsappNumber || "919006089331"}?text=${encodeURIComponent(
    "Hello Raj Hansh Events, I would like to schedule a consultation."
  )}`;

  const modalContent = (
    <div
      className="calendly-modal-backdrop"
      onClick={(e) => {
        // Close if clicking the backdrop outside the window card
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendly-modal-title"
    >
      <div className="calendly-modal-card" ref={modalRef}>
        {/* Modal Window Header */}
        <div className="calendly-modal-header">
          <div className="calendly-modal-title-wrap">
            <div className="calendly-modal-badge" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <h3 id="calendly-modal-title" className="calendly-modal-title">
                Book Consultation
              </h3>
              <p className="calendly-modal-subtitle">
                {BUSINESS_CONFIG.name || "Raj Hansh Events"} • 30-Min Planning Session
              </p>
            </div>
          </div>

          <div className="calendly-modal-actions">
            {/* Open in full external window button for convenience */}
            <a
              href={baseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="calendly-modal-action-btn"
              title="Open full window in new tab"
              aria-label="Open in new window"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>

            {/* Close Modal Button */}
            <button
              type="button"
              onClick={handleClose}
              className="calendly-modal-close-btn"
              aria-label="Close consultation window"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Window Body */}
        <div className="calendly-modal-body">
          {!iframeLoaded && (
            <div className="calendly-modal-loader" aria-live="polite">
              <div className="calendly-modal-spinner" />
              <p className="calendly-modal-loader-text">Loading consultation calendar...</p>
            </div>
          )}

          <iframe
            src={embedUrl}
            title="Schedule Consultation with Raj Hansh Events"
            className={`calendly-modal-iframe ${iframeLoaded ? "is-ready" : "is-loading"}`}
            onLoad={() => setIframeLoaded(true)}
            allow="camera; microphone; fullscreen; display-capture"
          />
        </div>

        {/* Modal Window Footer */}
        <div className="calendly-modal-footer">
          <div className="calendly-modal-footer-contact">
            <span className="footer-label">Prefer instant contact?</span>
            <a href={`tel:${cleanPhone}`} className="footer-link">
              📞 {BUSINESS_CONFIG.phone || "+91 90060 89331"}
            </a>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="calendly-modal-wa-btn"
          >
            <WhatsAppIcon size={14} style={{ marginRight: "6px" }} /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
