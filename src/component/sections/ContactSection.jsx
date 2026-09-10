"use client";

import { useState, useEffect } from "react";
import { BUSINESS_CONFIG } from "@/utils/constants";
import WhatsAppIcon from "@/component/WhatsAppIcon";
import { openCalendlyModal } from "@/component/CalendlyModal";
import "@/app/contact/Contact.css";

export default function ContactSection({ id = "contact", initialContact = null }) {
  const [contactData, setContactData] = useState(initialContact);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "Wedding",
    eventDate: "",
    guests: "",
    budget: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState(null);

  useEffect(() => {
    if (!contactData) {
      const fetchContactInfo = async () => {
        try {
          const res = await fetch("/api/contact");
          const json = await res.json();
          if (json.data) {
            setContactData(json.data);
          }
        } catch (err) {
          console.error("Failed to fetch contact info:", err);
        }
      };

      fetchContactInfo();
    }
  }, [contactData]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmittedStatus(null);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to submit enquiry. Please try again.");
      }

      const clientName = form.name;
      const clientEmail = form.email;
      const eventType = form.eventType;

      // Reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        eventType: "Wedding",
        eventDate: "",
        guests: "",
        budget: "",
        message: "",
      });

      setSubmittedStatus({
        success: true,
        clientName,
        clientEmail,
        eventType,
        message: `Thank you, ${clientName}! Your enquiry has been received and a confirmation email was dispatched to ${clientEmail}. Our royal event curator will reach out to you within 24 hours.`,
      });
    } catch (err) {
      console.error("[Enquiry Form Error]:", err);
      setSubmittedStatus({
        success: false,
        message:
          err.message ||
          "We could not submit your enquiry automatically. Please contact our concierge directly via WhatsApp or Phone.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const targetPhone = (contactData?.phone || BUSINESS_CONFIG.phone || "").replace(/\s+/g, "");
  const targetWaNumber = (contactData?.phone || BUSINESS_CONFIG.whatsappNumber || "919934305886").replace(/\D/g, "");

  return (
    <section id={id} className="contact-page continuous-section">
      <div className="contact-container">

        {/* Section Header */}
        <div className="elegant-section-header">
          <span className="section-kicker">— GET IN TOUCH</span>
          <h2 className="elegant-section-title">Let&apos;s plan something unforgettable.</h2>
          <p className="contact-subtitle">Share a few details and our royal event curator will reach out within 24 hours.</p>
        </div>

        {/* Main Grid Layout */}
        <div className="contact-grid">

          {/* Left Column: Form */}
          <div className="form-card">
            {submittedStatus && submittedStatus.success && (
              <div
                className="form-submission-alert"
                style={{
                  background: "rgba(212, 175, 55, 0.08)",
                  border: "1px solid var(--secondary-gold)",
                  borderRadius: "10px",
                  padding: "0.9rem 1.2rem",
                  marginBottom: "1.4rem",
                  position: "relative",
                }}
              >
                <button
                  type="button"
                  onClick={() => setSubmittedStatus(null)}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "10px",
                    background: "none",
                    border: "none",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    color: "#718096",
                    lineHeight: 1,
                  }}
                  title="Close"
                  aria-label="Close notification"
                >
                  ✕
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <span style={{ color: "#2E7D32", fontWeight: 700, fontSize: "1rem" }}>✓</span>
                  <strong style={{ color: "var(--primary-maroon)", fontSize: "0.95rem" }}>
                    Enquiry submitted successfully!
                  </strong>
                </div>

                <p style={{ margin: "0 0 10px 0", fontSize: "0.88rem", color: "#4A5568", lineHeight: 1.45 }}>
                  Thank you, <strong>{submittedStatus.clientName}</strong>. We will reach out shortly. For faster discussion or more details:
                </p>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <a
                    href={`https://wa.me/${targetWaNumber}?text=${encodeURIComponent(
                      `Hello Raj Hansh Events, I have submitted an inquiry for my ${submittedStatus.eventType || "event"}. My name is ${submittedStatus.clientName}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      background: "#25D366",
                      color: "#ffffff",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    <WhatsAppIcon size={14} /> WhatsApp Us
                  </a>
                  <button
                    type="button"
                    onClick={openCalendlyModal}
                    style={{
                      background: "var(--primary-maroon)",
                      color: "var(--secondary-gold)",
                      border: "1px solid var(--secondary-gold)",
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    📅 Book Slot on Calendar
                  </button>
                </div>
              </div>
            )}

            {submittedStatus && !submittedStatus.success && (
              <div
                className="form-submission-alert"
                style={{
                  background: "rgba(229, 62, 62, 0.08)",
                  border: "1px solid #E53E3E",
                  borderRadius: "10px",
                  padding: "0.85rem 1.1rem",
                  marginBottom: "1.2rem",
                  color: "#9B2C2C",
                  fontSize: "0.85rem",
                  position: "relative",
                }}
              >
                <button
                  type="button"
                  onClick={() => setSubmittedStatus(null)}
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9B2C2C",
                  }}
                  title="Close"
                  aria-label="Close notification"
                >
                  ✕
                </button>
                <p style={{ margin: "0 0 6px 0", fontWeight: 600 }}>⚠️ {submittedStatus.message}</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                  <a
                    href={`https://wa.me/${targetWaNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      background: "#25D366",
                      color: "#fff",
                      padding: "5px 12px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    <WhatsAppIcon size={13} /> WhatsApp Us
                  </a>
                  <button
                    type="button"
                    onClick={openCalendlyModal}
                    style={{
                      background: "var(--primary-maroon)",
                      color: "var(--secondary-gold)",
                      border: "1px solid var(--secondary-gold)",
                      padding: "5px 12px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    📅 Book Slot on Calendar
                  </button>
                </div>
              </div>
            )}

            <form className="luxury-form" onSubmit={handleSubmit}>

              <div className="form-row">
                <div className="form-group">
                  <label>Your Name <span>*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Maharani Ananya / Rajesh Verma"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address <span>*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="e.g. client@example.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number <span>*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 98765 43210"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label>Event Type <span>*</span></label>
                  <select name="eventType" value={form.eventType} onChange={handleChange} disabled={isSubmitting}>
                    <option value="Wedding">Wedding</option>
                    <option value="Destination Wedding">Destination Wedding</option>
                    <option value="Sangeet & Mehendi">Sangeet & Mehendi</option>
                    <option value="Reception">Reception</option>
                    <option value="Corporate">Corporate Event</option>
                    <option value="Birthday">Birthday/Anniversary</option>
                    <option value="Other">Other Celebration</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Target Event Date</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={form.eventDate}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label>Approx. Guests</label>
                  <input
                    type="number"
                    name="guests"
                    value={form.guests}
                    onChange={handleChange}
                    placeholder="e.g. 500"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Budget Range</label>
                <select name="budget" value={form.budget} onChange={handleChange} disabled={isSubmitting}>
                  <option value="">— Select a range —</option>
                  <option value="Under 5L">Under 5 Lakhs</option>
                  <option value="5L - 15L">5 Lakhs - 15 Lakhs</option>
                  <option value="15L - 30L">15 Lakhs - 30 Lakhs</option>
                  <option value="30L - 50L">30 Lakhs - 50 Lakhs</option>
                  <option value="50L+">50 Lakhs + (Royal Grandeur)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tell us about your celebration vision <span>*</span></label>
                <textarea
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Share details regarding your venue preferences, theme, mandap styling, floral concepts, or any special moments you wish to craft..."
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.8 : 1,
                }}
              >
                {isSubmitting ? (
                  <>
                    <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
                    <span>Submitting Royal Enquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Enquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Sidebar */}
          <div className="sidebar">

            {/* Direct Line Card */}
            <div className="direct-line-card">
              <h3>Direct Line</h3>
              <h2>Get in touch, instantly.</h2>
              <ul className="contact-info-list">
                <li>
                  <a
                    href={BUSINESS_CONFIG.mapsUrl || "https://maps.app.goo.gl/CeZKUvDzapYfJzWv9?g_st=ac"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    📍 {contactData?.location || BUSINESS_CONFIG.location}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${targetPhone}`}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    📞 {contactData?.phone || BUSINESS_CONFIG.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${contactData?.email || BUSINESS_CONFIG.email}`}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    ✉️ {contactData?.email || BUSINESS_CONFIG.email}
                  </a>
                </li>
                <li>🕒 {BUSINESS_CONFIG.hours}</li>
              </ul>

              <div className="action-buttons">
                <a
                  href={`https://wa.me/${targetWaNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp"
                >
                  <WhatsAppIcon size={18} style={{ marginRight: '6px' }} /> WhatsApp
                </a>
                <a href={`tel:${targetPhone}`} className="btn-call">
                  Call Now
                </a>
              </div>

              <div style={{ marginTop: '1.2rem', paddingTop: '1.2rem', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <button
                  type="button"
                  onClick={openCalendlyModal}
                  className="btn-calendar-slot"
                  aria-label="Pick slot on consultation calendar"
                >
                  📅 Pick Slot on Calendar
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Full Width Map Section */}
        <div className="map-section">
          <iframe
            title="Rajhans Events Location"
            src="https://maps.google.com/maps?q=Raj+Hansh+Event,+Maa+aamdmai+nagar,+Kathitand,+Ratu,+Ranchi,+Jharkhand+835222&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          />
        </div>

      </div>
    </section>
  );
}
