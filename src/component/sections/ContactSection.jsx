"use client";

import { useState, useEffect } from "react";
import { BUSINESS_CONFIG } from "@/utils/constants";
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

  const [submittedStatus, setSubmittedStatus] = useState(null);
  const [mailtoUrl, setMailtoUrl] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const now = new Date();

    const body = `Name: ${form.name}
Email: ${form.email}
Phone: ${form.phone}
Event Type: ${form.eventType}
Event Date: ${form.eventDate || 'To be finalized'}
Guests: ${form.guests || 'To be discussed'}
Budget: ${form.budget || 'Flexible'}
Date & Time Submitted: ${now.toLocaleString()}

Vision / Special Requests:
${form.message}`;

    const subject = `Celebration Enquiry: ${form.eventType} by ${form.name}`;
    const targetEmail = contactData?.email || BUSINESS_CONFIG.email;
    const url = `mailto:${targetEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setMailtoUrl(url);

    // Detect mobile phone vs desktop
    const isMobilePhone = typeof window !== 'undefined' && (
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (window.matchMedia && window.matchMedia('(max-width: 768px)').matches && 'ontouchstart' in window)
    );

    if (isMobilePhone) {
      // On phone: use a synthetic anchor click to cleanly launch the native mail app
      const mailLink = document.createElement('a');
      mailLink.href = url;
      mailLink.target = '_top';
      document.body.appendChild(mailLink);
      mailLink.click();
      document.body.removeChild(mailLink);
      setSubmittedStatus({
        type: 'phone',
        message: 'Opening your mobile mail app with your event details pre-filled...'
      });
    } else {
      // On desktop: route to mailto: client
      window.location.href = url;
      setSubmittedStatus({
        type: 'desktop',
        message: 'Launching your desktop mail application...'
      });
    }
  };

  return (
    <section id={id} className="contact-page continuous-section">
      <div className="contact-container">
        
        {/* Section Header */}
        <div className="elegant-section-header">
          <span className="section-kicker">— GET IN TOUCH</span>
          <h2 className="elegant-section-title">Let&apos;s plan something unforgettable.</h2>
          <p className="contact-subtitle">Share a few details and our planner will reach out within 24 hours.</p>
        </div>

        {/* Main Grid Layout */}
        <div className="contact-grid">
          
          {/* Left Column: Form */}
          <div className="form-card">
            {submittedStatus && (
              <div className="form-submission-alert" style={{
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1.5px solid var(--secondary-gold)',
                borderRadius: '12px',
                padding: '1.2rem',
                marginBottom: '1.5rem',
                color: 'var(--primary-maroon)',
                textAlign: 'center'
              }}>
                <p style={{ fontWeight: 600, marginBottom: '0.6rem' }}>
                  ✉️ {submittedStatus.message}
                </p>
                <a 
                  href={mailtoUrl} 
                  className="manual-mail-trigger"
                  style={{
                    display: 'inline-block',
                    fontSize: '0.9rem',
                    color: 'var(--primary-maroon)',
                    textDecoration: 'underline',
                    fontWeight: 600
                  }}
                >
                  Click here if your mail app didn&apos;t open automatically &rarr;
                </a>
              </div>
            )}

            <form className="luxury-form" onSubmit={handleSubmit}>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name <span>*</span></label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Email Address <span>*</span></label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number <span>*</span></label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Event Type <span>*</span></label>
                  <select name="eventType" value={form.eventType} onChange={handleChange}>
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate">Corporate Event</option>
                    <option value="Birthday">Birthday/Anniversary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Event Date</label>
                  <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Approx. Guests</label>
                  <input type="number" name="guests" value={form.guests} onChange={handleChange} placeholder="e.g. 500" />
                </div>
              </div>

              <div className="form-group">
                <label>Budget Range</label>
                <select name="budget" value={form.budget} onChange={handleChange}>
                  <option value="">— Select a range —</option>
                  <option value="Under 5L">Under 5 Lakhs</option>
                  <option value="5L - 15L">5 Lakhs - 15 Lakhs</option>
                  <option value="15L - 30L">15 Lakhs - 30 Lakhs</option>
                  <option value="30L+">30 Lakhs +</option>
                </select>
              </div>

              <div className="form-group">
                <label>Tell us about your vision</label>
                <textarea name="message" rows={5} value={form.message} onChange={handleChange} required></textarea>
              </div>

              <button type="submit" className="btn-primary">Submit Enquiry</button>
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
                    href={`https://maps.google.com/?q=${encodeURIComponent(contactData?.location || BUSINESS_CONFIG.location)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    📍 {contactData?.location || BUSINESS_CONFIG.location}
                  </a>
                </li>
                <li>
                  <a 
                    href={`tel:${(contactData?.phone || BUSINESS_CONFIG.phone).replace(/\s+/g, '')}`}
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
                <a href={`https://wa.me/${(contactData?.phone || BUSINESS_CONFIG.whatsappNumber).replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="btn-whatsapp">
                  WhatsApp
                </a>
                <a href={`tel:${(contactData?.phone || BUSINESS_CONFIG.phone).replace(/\s+/g, '')}`} className="btn-call">
                  Call Now
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Full Width Map Section */}
        <div className="map-section">
          <iframe
            title="Rajhans Events Location"
            src="https://www.google.com/maps?q=Ranchi,Jharkhand&output=embed"
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
