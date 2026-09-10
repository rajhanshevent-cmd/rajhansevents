import React from 'react';
import Link from 'next/link';
import '@/app/legal.css';

export const metadata = {
  title: 'Terms of Service & Copyright | Raj Hansh Events',
  description: 'Terms of Service, Copyright Information, and Media Credits for Raj Hansh Events. Learn about our intellectual property, client event media policies, and licensing terms.',
};

export default function TermsOfService() {
  return (
    <main className="legal-page">
      <div className="legal-container">
        
        {/* Top Switcher Navigation */}
        <div className="legal-tabs-wrapper">
          <nav className="legal-tabs" aria-label="Legal Documents Navigation">
            <Link href="/terms" className="legal-tab-btn active">
              <span>📜</span> Terms of Service
            </Link>
            <Link href="/privacy" className="legal-tab-btn">
              <span>🛡️</span> Privacy Policy
            </Link>
          </nav>
        </div>

        {/* Hero Header */}
        <header className="legal-header">
          <span className="legal-kicker">
            <span>⚖️</span> LEGAL, COPYRIGHT &amp; CREDITS
          </span>
          <h1 className="legal-title">
            Terms of Service &amp; Copyright Notice
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
            <a href="#acceptance" className="legal-toc-link">1. Acceptance</a>
            <a href="#bookings" className="legal-toc-link">2. Bookings &amp; Proposals</a>
            <a href="#copyright" className="legal-toc-link">3. Brand Copyright</a>
            <a href="#credits" className="legal-toc-link">4. Media &amp; Credits</a>
            <a href="#client-media" className="legal-toc-link">5. Client Media Rights</a>
            <a href="#takedown" className="legal-toc-link">6. Copyright Claims</a>
            <a href="#jurisdiction" className="legal-toc-link">7. Governing Law</a>
            <a href="#contact" className="legal-toc-link">8. Contact Details</a>
          </div>
        </nav>

        {/* Main Document Card */}
        <article className="legal-card">

          {/* Section 1 */}
          <section id="acceptance" className="legal-section">
            <div className="legal-section-header">
              <span className="legal-num-badge">01</span>
              <h2 className="legal-section-title">Acceptance of Terms</h2>
            </div>
            <p>
              Welcome to <strong>Raj Hansh Events</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). By accessing our website, browsing our portfolio galleries, or engaging our wedding planning and event management services, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service.
            </p>
            <p>
              If you do not agree with any provision of these terms, please discontinue using this website and contact our team directly for custom contractual arrangements.
            </p>
          </section>

          {/* Section 2 */}
          <section id="bookings" className="legal-section">
            <div className="legal-section-header">
              <span className="legal-num-badge">02</span>
              <h2 className="legal-section-title">Event Services, Proposals &amp; Bookings</h2>
            </div>
            <p>
              All event quotations, concept themes, packages, and budget estimates generated through this website or preliminary consultations serve as exploratory estimates tailored to your specifications.
            </p>
            <p>
              An event booking is legally confirmed and scheduled on our production calendar only upon the mutual execution of our formal <strong>Event Planning Agreement</strong> and receipt of the required advance booking commitment.
            </p>
          </section>

          {/* Section 3 */}
          <section id="copyright" className="legal-section">
            <div className="legal-section-header">
              <span className="legal-num-badge">03</span>
              <h2 className="legal-section-title">Proprietary Intellectual Property &amp; Brand Copyright</h2>
            </div>
            <p>
              All original visual assets, brand identity marks, stage and mandap designs, floral curation blueprints, photographic compositions, written editorial copy, and bespoke production concepts showcased on this platform are the exclusive intellectual property of <strong>Raj Hansh Events</strong>.
            </p>
            
            <div className="legal-callout">
              <div className="legal-callout-title">
                <span>🛡️</span> Statutory Copyright Protection
              </div>
              <p>
                Protected under the Indian Copyright Act, 1957, trademark laws, and applicable international intellectual property treaties. No decor styling blueprint, media file, or graphic element may be copied, republished, or exploited for commercial purposes without prior express written consent from Raj Hansh Events.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="credits" className="legal-section">
            <div className="legal-section-header">
              <span className="legal-num-badge">04</span>
              <h2 className="legal-section-title">Media, Stock Photography &amp; Asset Credits</h2>
            </div>
            <p>
              To illustrate creative themes and showcase aspirational possibilities, select concept visuals on this platform are curated under permissive, royalty-free open commercial licenses:
            </p>
            <ul className="legal-list">
              <li className="legal-list-item">
                <span className="legal-bullet">✦</span>
                <div>
                  <strong>Illustrative Moodboard Photography:</strong> Permissively sourced under the <em>Unsplash License</em> (free commercial and editorial use). Full artistic copyright remains with respective contributing photographers. We extend sincere appreciation to the global visual community.
                </div>
              </li>
              <li className="legal-list-item">
                <span className="legal-bullet">✦</span>
                <div>
                  <strong>Client Celebration Portfolio:</strong> Live wedding, birthday, and gala photographs produced during verified Raj Hansh Events engagements belong to Raj Hansh Events and are presented with the kind consent of our clients.
                </div>
              </li>
              <li className="legal-list-item">
                <span className="legal-bullet">✦</span>
                <div>
                  <strong>Typography:</strong> Google Fonts (Playfair Display, Cormorant Garamond, Nunito Sans, and Poppins) distributed under the open <em>SIL Open Font License (OFL)</em>.
                </div>
              </li>
              <li className="legal-list-item">
                <span className="legal-bullet">✦</span>
                <div>
                  <strong>Brand Iconography:</strong> Social media and communication trademarks (e.g., WhatsApp, Meta, Google) belong to their respective owners and are referenced solely for customer communication purposes.
                </div>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="client-media" className="legal-section">
            <div className="legal-section-header">
              <span className="legal-num-badge">05</span>
              <h2 className="legal-section-title">Client Event Media &amp; Privacy Rights</h2>
            </div>
            <p>
              We take immense pride in the celebrations we orchestrate. High-definition photographs and cinematic footage captured during celebrations managed by Raj Hansh Events may be highlighted in our portfolio to exhibit decor artistry, lighting architecture, and bespoke execution.
            </p>

            <div className="legal-callout">
              <div className="legal-callout-title">
                <span>🤍</span> Complete Privacy Guarantee for Clients &amp; Families
              </div>
              <p>
                We deeply respect our clients&apos; personal privacy. If you or a family member appears in any photograph or video on this website and wish to have it removed or replaced, simply email us at <a href="mailto:rajhanshevent@gmail.com">rajhanshevent@gmail.com</a>. We will honor your request promptly within 24–48 hours without hesitation.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="takedown" className="legal-section">
            <div className="legal-section-header">
              <span className="legal-num-badge">06</span>
              <h2 className="legal-section-title">Copyright Infringement Claims &amp; Takedown Procedure</h2>
            </div>
            <p>
              Raj Hansh Events respects the intellectual property rights of creators. If you believe any material on this platform infringes upon a copyright you own or control, please notify our legal desk with the following details:
            </p>
            <ul className="legal-list">
              <li className="legal-list-item">
                <span className="legal-bullet">✓</span>
                <span>A clear description of the copyrighted work claimed to have been infringed.</span>
              </li>
              <li className="legal-list-item">
                <span className="legal-bullet">✓</span>
                <span>The specific webpage URL or asset location where the material appears.</span>
              </li>
              <li className="legal-list-item">
                <span className="legal-bullet">✓</span>
                <span>Your full legal name, physical address, direct telephone number, and email address.</span>
              </li>
              <li className="legal-list-item">
                <span className="legal-bullet">✓</span>
                <span>A statement confirming your good-faith belief that the disputed use is not authorized by the copyright owner.</span>
              </li>
            </ul>
            <p>
              Please transmit all intellectual property inquiries to <a href="mailto:rajhanshevent@gmail.com">rajhanshevent@gmail.com</a>. Legitimate inquiries will be addressed within 48 business hours.
            </p>
          </section>

          {/* Section 7 */}
          <section id="jurisdiction" className="legal-section">
            <div className="legal-section-header">
              <span className="legal-num-badge">07</span>
              <h2 className="legal-section-title">Governing Law &amp; Jurisdiction</h2>
            </div>
            <p>
              These Terms of Service and any contractual agreements entered into with Raj Hansh Events shall be governed by, interpreted, and construed under the laws of the Republic of India.
            </p>
            <p>
              Any disputes or legal proceedings arising out of or related to this website or our management services shall fall under the exclusive jurisdiction of the competent courts in <strong>Ranchi, Jharkhand, India</strong>.
            </p>
          </section>

          {/* Section 8 */}
          <section id="contact" className="legal-section">
            <div className="legal-section-header">
              <span className="legal-num-badge">08</span>
              <h2 className="legal-section-title">Official Contact Information</h2>
            </div>
            <p>
              For legal inquiries, copyright questions, or event consultation scheduling, our executive desk is at your service:
            </p>
            
            <div className="legal-contact-grid">
              <div className="legal-contact-item">
                <div className="legal-contact-icon">📧</div>
                <div className="legal-contact-content">
                  <strong>Official Email</strong>
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
