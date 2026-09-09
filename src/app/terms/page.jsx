import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service & Copyright | Raj Hansh Events',
  description: 'Terms of Service, Copyright Information, and Media Credits for Raj Hansh Events. Learn about our intellectual property, client event media policies, and licensing terms.',
};

export default function TermsOfService() {
  return (
    <main style={{ backgroundColor: '#FDFBF7', minHeight: '100vh', padding: '120px 20px 80px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', backgroundColor: '#ffffff', padding: '48px 36px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <span style={{ color: '#D4AF37', fontSize: '0.82rem', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase' }}>
            LEGAL, COPYRIGHT &amp; CREDITS
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading, serif)', fontSize: '2.5rem', color: '#7b1a28', marginTop: '10px', marginBottom: '8px' }}>
            Terms of Service &amp; Copyright Notice
          </h1>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            Effective Date: January 1, 2025 &bull; Last Updated: March 2026
          </p>
        </div>

        <div style={{ color: '#333', fontSize: '1rem', lineHeight: '1.8' }}>
          
          {/* Section 1 */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: '#7b1a28', fontSize: '1.4rem', marginBottom: '12px' }}>
              1. Acceptance of Terms
            </h2>
            <p>
              Welcome to <strong>Raj Hansh Events</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). By accessing our website, browsing our portfolio, or booking our event management services, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using this website or engaging our services.
            </p>
          </section>

          {/* Section 2 */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: '#7b1a28', fontSize: '1.4rem', marginBottom: '12px' }}>
              2. Event Services, Proposals &amp; Bookings
            </h2>
            <p>
              All event quotations, themes, packages, and consultation estimates provided through this website are preliminary projections based on your stated event specifications. A booking is legally confirmed only upon the mutual execution of our formal Event Planning Contract and receipt of the required booking deposit.
            </p>
          </section>

          {/* Section 3 */}
          <section id="copyright" style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: '#7b1a28', fontSize: '1.4rem', marginBottom: '12px' }}>
              3. Proprietary Intellectual Property &amp; Brand Copyright
            </h2>
            <p>
              All original content on this website—including but not limited to the brand name &ldquo;Raj Hansh Events&rdquo;, logos, stage and decor designs, written editorial copy, graphic illustrations, layout compilations, and custom production concepts—is the exclusive intellectual property of <strong>Raj Hansh Events</strong> and is protected under the Indian Copyright Act, 1957, trademark laws, and applicable international copyright conventions.
            </p>
            <p style={{ marginTop: '10px' }}>
              No material, decor styling concept, or graphic asset from this website may be copied, reproduced, republished, downloaded, posted, broadcast, or distributed for commercial purposes without prior explicit written permission from Raj Hansh Events.
            </p>
          </section>

          {/* Section 4 */}
          <section id="credits" style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: '#7b1a28', fontSize: '1.4rem', marginBottom: '12px' }}>
              4. Media, Stock Photography &amp; Asset Credits
            </h2>
            <p>
              To present concept moodboards and illustrate diverse celebration possibilities, select demonstration visuals on this website are sourced under permissive, royalty-free open commercial licenses:
            </p>
            <ul style={{ paddingLeft: '24px', marginTop: '10px' }}>
              <li>
                <strong>Illustrative Photography:</strong> Sourced under the <em>Unsplash License</em> (free commercial and non-commercial use). Copyright remains with their respective contributing photographers. We extend sincere appreciation to the global creative community for these visual inspirations.
              </li>
              <li>
                <strong>Client &amp; Celebration Showcase:</strong> Real celebration photos and videos produced during Raj Hansh Events engagements belong to Raj Hansh Events and are presented with the appreciation of our clients.
              </li>
              <li>
                <strong>Typography:</strong> Google Fonts (Playfair Display, Cormorant Garamond, Nunito Sans, and Poppins) distributed under the <em>SIL Open Font License (OFL)</em>.
              </li>
              <li>
                <strong>Icons:</strong> Brand and social media iconography (e.g., WhatsApp, Google) are the registered trademarks of their respective owners and are referenced strictly for identification and communication purposes.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: '#7b1a28', fontSize: '1.4rem', marginBottom: '12px' }}>
              5. Client Event Media &amp; Privacy Rights
            </h2>
            <p>
              We take immense pride in the celebrations we curate. Photographs and videography captured during public celebrations and private events managed by Raj Hansh Events may be featured in our portfolio to showcase decor artistry, lighting installations, and event production quality.
            </p>
            <p style={{ marginTop: '10px' }}>
              We deeply respect our clients&apos; privacy. If you or a family member is featured in any photograph or video on this website and wish to have it modified, replaced, or removed, simply send us an email at <a href="mailto:rajhanshevent@gmail.com" style={{ color: '#7b1a28', textDecoration: 'underline' }}>rajhanshevent@gmail.com</a>, and we will honor your request promptly.
            </p>
          </section>

          {/* Section 6 */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: '#7b1a28', fontSize: '1.4rem', marginBottom: '12px' }}>
              6. Copyright Infringement Claims &amp; Takedown Procedure
            </h2>
            <p>
              Raj Hansh Events respects the intellectual property rights of others. If you believe that any material on this website infringes upon a copyright that you own or control, or lacks proper attribution, please notify us immediately with the following details:
            </p>
            <ul style={{ paddingLeft: '24px', marginTop: '10px' }}>
              <li>A description of the copyrighted work claimed to have been infringed;</li>
              <li>The exact URL or location on our site where the disputed material is located;</li>
              <li>Your full name, contact address, telephone number, and email address;</li>
              <li>A statement confirming your ownership or authorization to act on the copyright owner&apos;s behalf.</li>
            </ul>
            <p style={{ marginTop: '10px' }}>
              Direct all copyright inquiries to: <a href="mailto:rajhanshevent@gmail.com" style={{ color: '#7b1a28', textDecoration: 'underline' }}>rajhanshevent@gmail.com</a>. Valid claims will be addressed within 48 business hours.
            </p>
          </section>

          {/* Section 7 */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: '#7b1a28', fontSize: '1.4rem', marginBottom: '12px' }}>
              7. Governing Law &amp; Jurisdiction
            </h2>
            <p>
              These Terms of Service and any contractual agreements with Raj Hansh Events shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising in connection with our website or services shall be subject to the exclusive jurisdiction of the competent courts in Ranchi, Jharkhand, India.
            </p>
          </section>

          {/* Section 8 */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading, serif)', color: '#7b1a28', fontSize: '1.4rem', marginBottom: '12px' }}>
              8. Contact Us
            </h2>
            <p>
              For any questions concerning these Terms, copyright permissions, or celebration bookings, reach us at:
            </p>
            <p style={{ marginTop: '8px' }}>
              <strong>Raj Hansh Events</strong><br />
              Email: <a href="mailto:rajhanshevent@gmail.com" style={{ color: '#7b1a28', textDecoration: 'underline' }}>rajhanshevent@gmail.com</a><br />
              Direct Line: +91 90060 89331<br />
              Location: Ranchi, Jharkhand 834001, India
            </p>
          </section>

          <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <Link href="/" style={{ color: '#7b1a28', fontWeight: '600', textDecoration: 'none' }}>
              &larr; Return to Home Page
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
