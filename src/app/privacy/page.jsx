import React from 'react';
import Link from 'next/link';
import '@/app/legal.css';

export const metadata = {
  title: 'Privacy Policy | Raj Hansh Events',
  description: 'Privacy Policy for Raj Hansh Events. Learn how we handle your personal data, celebration inquiries, and information securely.',
};

export default function PrivacyPolicy() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        
        {/* Top Switcher Navigation */}
        <div className="legal-tabs-wrapper">
          <nav className="legal-tabs" aria-label="Legal Documents Navigation">
            <Link href="/terms" className="legal-tab-btn">
              <span>📜</span> Terms of Service
            </Link>
            <Link href="/privacy" className="legal-tab-btn active">
              <span>🛡️</span> Privacy Policy
            </Link>
          </nav>
        </div>

        {/* Hero Header */}
        <header className="legal-header">
          <span className="legal-kicker">
            <span>🔒</span> PRIVACY &amp; DATA PROTECTION
          </span>
          <h1 className="legal-title">
            Privacy Policy
          </h1>
          <div className="legal-meta-bar">
            <span className="legal-meta-item">
              <span>📅</span> Effective: January 1, 2025
            </span>
            <span>&bull;</span>
            <span className="legal-meta-item">
              <span>🛡️</span> Last Reviewed: March 2026
            </span>
            <span>&bull;</span>
            <span className="legal-meta-item">
              <span>📍</span> Ranchi, Jharkhand
            </span>
          </div>
        </header>

        {/* Table of Contents Quick Jump Pills */}
        <nav className="legal-toc-wrapper" aria-label="Table of contents">
          <div className="legal-toc-label">
            <span>📑</span> Quick Navigation
          </div>
          <div className="legal-toc-pills">
            <a href="#intro" className="legal-toc-link">1. Introduction</a>
            <a href="#collection" className="legal-toc-link">2. Data We Collect</a>
            <a href="#usage" className="legal-toc-link">3. How We Use Data</a>
            <a href="#infrastructure" className="legal-toc-link">4. Cloud Infrastructure</a>
            <a href="#cookies" className="legal-toc-link">5. Cookies &amp; Sessions</a>
            <a href="#security" className="legal-toc-link">6. Retention &amp; Security</a>
            <a href="#rights" className="legal-toc-link">7. Your Rights</a>
            <a href="#contact" className="legal-toc-link">8. Contact Desk</a>
          </div>
        </nav>

        {/* Main Document Card */}
        <article className="legal-card">

          {/* Section 1 */}
          <section id="intro" className="legal-section">
            <div className="legal-section-header">
              <span className="legal-num-badge">01</span>
              <h2 className="legal-section-title">Introduction</h2>
            </div>
            <p>
              Welcome to <strong>Raj Hansh Events</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We provide luxury wedding planning, bespoke stage decor, hospitality coordination, and milestone celebration management based in Ranchi, Jharkhand, India.
            </p>
            <p>
              We treat your personal details and celebration visions with the utmost confidentiality. This Privacy Policy details the measures we take to safeguard the personal information you entrust to us when visiting our website or reaching out for consultation.
            </p>
          </section>

          {/* Section 2 */}
          <section id="collection" className="legal-section">
            <div className="legal-section-header">
              <span className="legal-num-badge">02</span>
              <h2 className="legal-section-title">Information We Collect</h2>
            </div>
            <p>
              We only gather personal information that is reasonably necessary to fulfill celebration inquiries, craft customized proposals, and provide seamless customer service:
            </p>
            <ul className="legal-list">
              <li className="legal-list-item">
                <span className="legal-bullet">✦</span>
                <div>
                  <strong>Consultation &amp; Inquiry Details:</strong> Full name, email address, phone number, event date, celebration type (e.g. Wedding, Reception, Corporate Gala), anticipated guest count, and venue preferences submitted via our contact forms.
                </div>
              </li>
              <li className="legal-list-item">
                <span className="legal-bullet">✦</span>
                <div>
                  <strong>Direct Communications:</strong> Information and preferences exchanged when you initiate contact with our team through WhatsApp direct chat, phone calls, or emails.
                </div>
              </li>
              <li className="legal-list-item">
                <span className="legal-bullet">✦</span>
                <div>
                  <strong>Administrative Identity (Google OAuth):</strong> For authorized administrators accessing the internal management portal (/Manage), our application verifies administrative identity using Google OAuth 2.0 (name, email address, and profile photo). We never access, store, or view personal emails, Google Drive files, or sensitive account data.
                </div>
              </li>
              <li className="legal-list-item">
                <span className="legal-bullet">✦</span>
                <div>
                  <strong>Technical Performance Data:</strong> Anonymous browser type, device information, and speed metrics utilized strictly to ensure page load performance and infrastructure reliability.
                </div>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="usage" className="legal-section">
            <div className="legal-section-header">
              <span className="legal-num-badge">03</span>
              <h2 className="legal-section-title">How We Use Your Information</h2>
            </div>
            <p>
              Your information is utilized solely for genuine event management and communication purposes:
            </p>
            <ul className="legal-list">
              <li className="legal-list-item">
                <span className="legal-bullet">✓</span>
                <span>To compose customized event moodboards, decor blueprints, and accurate financial quotations.</span>
              </li>
              <li className="legal-list-item">
                <span className="legal-bullet">✓</span>
                <span>To schedule on-site venue walkthroughs and creative design consultations.</span>
              </li>
              <li className="legal-list-item">
                <span className="legal-bullet">✓</span>
                <span>To coordinate logistics with verified decor and hospitality teams for booked celebrations.</span>
              </li>
              <li className="legal-list-item">
                <span className="legal-bullet">✓</span>
                <span>To authenticate authorized administrative staff via secure session tokens.</span>
              </li>
            </ul>

            <div className="legal-callout">
              <div className="legal-callout-title">
                <span>🛡️</span> Zero Data Commercialization Guarantee
              </div>
              <p>
                We never sell, rent, monetize, or trade your personal information or celebration details to third-party telemarketers, data brokers, or marketing networks. Your trust is foundational to our brand.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="infrastructure" className="legal-section">
            <div className="legal-section-header">
              <span className="legal-num-badge">04</span>
              <h2 className="legal-section-title">Secure Cloud Infrastructure Partners</h2>
            </div>
            <p>
              To maintain high availability, instant load speeds, and enterprise security, we partner with world-class cloud infrastructure providers:
            </p>
            <ul className="legal-list">
              <li className="legal-list-item">
                <span className="legal-bullet">✦</span>
                <div>
                  <strong>Neon PostgreSQL:</strong> Encrypted serverless database hosting inquiries and content configurations with SSL/TLS encryption in transit and at rest.
                </div>
              </li>
              <li className="legal-list-item">
                <span className="legal-bullet">✦</span>
                <div>
                  <strong>Cloudflare R2:</strong> High-performance distributed media storage delivering fast portfolio images and videos with zero egress fees.
                </div>
              </li>
              <li className="legal-list-item">
                <span className="legal-bullet">✦</span>
                <div>
                  <strong>Google Identity Services:</strong> Enterprise OAuth 2.0 authentication protocol used exclusively for internal staff login verification.
                </div>
              </li>
              <li className="legal-list-item">
                <span className="legal-bullet">✦</span>
                <div>
                  <strong>Meta / WhatsApp Business Cloud API:</strong> Enabling direct, user-initiated messaging for consultations and event discussions.
                </div>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="cookies" className="legal-section">
            <div className="legal-section-header">
              <span className="legal-num-badge">05</span>
              <h2 className="legal-section-title">Cookies and Session Management</h2>
            </div>
            <p>
              Our website uses strictly necessary, HTTP-only, secure session cookies required solely for authenticating administrator sessions on the management dashboard.
            </p>
            <p>
              We do not employ third-party cross-site advertising cookies, invasive tracking pixels, or user behavior tracking tools.
            </p>
          </section>

          {/* Section 6 */}
          <section id="security" className="legal-section">
            <div className="legal-section-header">
              <span className="legal-num-badge">06</span>
              <h2 className="legal-section-title">Data Retention and Security Safeguards</h2>
            </div>
            <p>
              We implement comprehensive security measures including SSL/TLS encrypted transmissions, strict database connection whitelists, and authenticated API gatekeepers to protect your data from unauthorized access or alteration.
            </p>
            <p>
              Inquiry and consultation records are retained only as long as necessary to complete your celebration coordination and fulfill statutory accounting requirements under Indian tax law.
            </p>
          </section>

          {/* Section 7 */}
          <section id="rights" className="legal-section">
            <div className="legal-section-header">
              <span className="legal-num-badge">07</span>
              <h2 className="legal-section-title">Your Privacy Rights &amp; Choices</h2>
            </div>
            <p>
              You maintain complete control over your personal data. At any time, you have the right to:
            </p>
            <ul className="legal-list">
              <li className="legal-list-item">
                <span className="legal-bullet">✓</span>
                <span>Request a copy of the personal information we maintain regarding your inquiries.</span>
              </li>
              <li className="legal-list-item">
                <span className="legal-bullet">✓</span>
                <span>Request the correction or update of any inaccurate contact details.</span>
              </li>
              <li className="legal-list-item">
                <span className="legal-bullet">✓</span>
                <span>Request the permanent deletion of your inquiry records from our active database.</span>
              </li>
            </ul>
            <p>
              To exercise any of these rights, please send an email request to <a href="mailto:rajhanshevent@gmail.com">rajhanshevent@gmail.com</a>. We will process your request within 48 business hours.
            </p>
          </section>

          {/* Section 8 */}
          <section id="contact" className="legal-section">
            <div className="legal-section-header">
              <span className="legal-num-badge">08</span>
              <h2 className="legal-section-title">Privacy Officer Contact Information</h2>
            </div>
            <p>
              If you have any questions or feedback regarding our privacy practices or this policy, please reach out to our team:
            </p>
            
            <div className="legal-contact-grid">
              <div className="legal-contact-item">
                <div className="legal-contact-icon">📧</div>
                <div className="legal-contact-content">
                  <strong>Privacy Desk Email</strong>
                  <a href="mailto:rajhanshevent@gmail.com">rajhanshevent@gmail.com</a>
                </div>
              </div>

              <div className="legal-contact-item">
                <div className="legal-contact-icon">📞</div>
                <div className="legal-contact-content">
                  <strong>Phone</strong>
                  <a href="tel:+919006089331">+91 90060 89331</a>
                </div>
              </div>

              <div className="legal-contact-item" style={{ gridColumn: '1 / -1' }}>
                <div className="legal-contact-icon">📍</div>
                <div className="legal-contact-content">
                  <strong>Registered Office Location</strong>
                  <a href="https://maps.app.goo.gl/CeZKUvDzapYfJzWv9?g_st=ac" target="_blank" rel="noopener noreferrer">
                    Maa Aamdmai Nagar, Kathitand, Ratu, Ranchi, Jharkhand 835222
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Navigation Actions */}
          <footer className="legal-footer-nav">
            <Link href="/" className="legal-back-btn">
              <span>&larr;</span> Return to Home
            </Link>
            <Link href="/contact" className="legal-action-btn">
              Plan Your Celebration <span>&rarr;</span>
            </Link>
          </footer>

        </article>
      </div>
    </main>
  );
}
